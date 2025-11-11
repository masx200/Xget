/**
 * Rewrites GitHub redirect Location headers to go through proxy
 * @param {Response} response - The response object
 * @param {URL} url - The original request URL
 * @returns {Headers} Modified headers with rewritten Location if needed
 */
function rewriteGitHubRedirectHeaders(response: Response, url: URL): Headers {
  const headers = new Headers(response.headers);

  if (response.status >= 300 && response.status < 400) {
    const location = headers.get('Location');
    if (location) {
      // Check if the Location header points to GitHub release assets or raw content
      if (
        location.includes('release-assets.githubusercontent.com') ||
        location.includes('raw.githubusercontent.com')
      ) {
        // Rewrite the Location to go through our proxy
        // Extract the path from the original URL
        const urlObj = new URL(location);
        let newPath = urlObj.pathname + urlObj.search + urlObj.hash;

        // Prepend with the appropriate platform prefix
        if (urlObj.hostname === 'release-assets.githubusercontent.com') {
          headers.set('Location', `${url.origin}/release-assets.githubusercontent.com${newPath}`);
        } else if (urlObj.hostname === 'raw.githubusercontent.com') {
          headers.set('Location', `${url.origin}/raw.githubusercontent.com${newPath}`);
        }
      }
    }
  }

  return headers;
}



export { rewriteGitHubRedirectHeaders };