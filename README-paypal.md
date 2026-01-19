# PayPal + Supabase

Fluxo implementado: criação de ordem, captura manual, webhook para confirmação idempotente e listagem pública de campanhas com progresso.

## Variáveis de ambiente (Vercel)
Backend (serverless):
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_ENV (`sandbox` | `live`, padrão `sandbox`)
- PAYPAL_WEBHOOK_ID (ID do webhook configurado no PayPal)

Frontend (Vite):
- VITE_PAYPAL_CLIENT_ID (mesmo Client ID acima, sem segredo)

> Não adicione novas variáveis do Supabase. Use apenas as existentes.

## Endpoints criados
- POST `/api/paypal/create-order` – cria registro em `donations` (status `pending`) e abre ordem PayPal com `custom_id` = donationId.
- POST `/api/paypal/capture-order` – captura a ordem e marca `donations.status = confirmed` com `provider_capture_id`.
- POST `/api/paypal/webhook` – valida assinatura via `verify-webhook-signature` e confirma/refunda/falha a doação no banco.
- GET `/api/public/campaigns` – retorna campanhas ativas com progresso confirmado.

## Webhook no PayPal
1) Em **Sandbox** ou **Live**, acesse **Developer Dashboard** → **My Apps & Credentials** → selecione a aplicação.
2) Em **Webhooks**, crie um webhook apontando para:
   - Produção: `https://seu-domínio/api/paypal/webhook`
   - Local (via túnel): URL pública do ngrok → `/api/paypal/webhook`
3) Eventos mínimos:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.FAILED`
4) Copie o **Webhook ID** e configure em `PAYPAL_WEBHOOK_ID` na Vercel.

## Testes locais
1) Configure `.env.local` com `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox`, `PAYPAL_WEBHOOK_ID` e `VITE_PAYPAL_CLIENT_ID`.
2) Rode o frontend: `npm install && npm run dev`.
3) Exponha localmente `http://localhost:5173` com ngrok: `ngrok http 5173`.
4) Atualize o webhook no dashboard PayPal para a URL do ngrok + `/api/paypal/webhook`.
5) Fluxo:
   - Na página de projeto, escolha valor → cria ordem → clique no botão PayPal carregado.
   - `onApprove` chama `/api/paypal/capture-order`; o webhook confirma e atualiza `donations`.

## Observações
- `donations.status` aceita: pending, approved, confirmed, failed, refunded, canceled (e o legado `confirmado`).
- As colunas `provider_order_id` e `provider_capture_id` têm índices únicos para idempotência.
- `campaign_progress` view soma apenas doações confirmadas/confirmado.
