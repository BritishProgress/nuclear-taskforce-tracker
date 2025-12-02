/**
 * Get the base URL for the application
 * In development, returns localhost
 * In production, returns the production domain
 */
export function getBaseUrl(): string {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }
  // In production, use the actual domain
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://nuclear.britishprogress.org';
}

/**
 * Get the full URL for a given path
 * @param path - The path (e.g., '/recommendation/1' or '/api/og')
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

