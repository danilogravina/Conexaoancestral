const paypalEnv = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const baseUrl = paypalEnv === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function fetchAccessToken(): Promise<{ access_token: string; expires_in: number }> {
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
  }
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to obtain PayPal token: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.token;
  }

  const tokenResponse = await fetchAccessToken();
  cachedToken = {
    token: tokenResponse.access_token,
    expiresAt: now + tokenResponse.expires_in * 1000,
  };
  return cachedToken.token;
}

interface PaypalFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function paypalFetch(path: string, options: PaypalFetchOptions = {}): Promise<any> {
  const token = await getAccessToken();
  const { method = 'GET', headers = {}, body } = options;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    throw new Error(`PayPal API error ${res.status}: ${message}`);
  }

  return payload;
}

export function getPaypalBaseUrl(): string {
  return baseUrl;
}

export const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
