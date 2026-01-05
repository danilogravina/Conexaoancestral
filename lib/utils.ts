export const ensureAbsolutePath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/${path}`;
};
