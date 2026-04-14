export function setTokenCookie(token: string, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `mi-proyecto-token=${encodeURIComponent(token)}; path=/; expires=${expires}`;
  } catch (e) {
    // ignore
  }
}

export function getTokenFromCookie(): string | null {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + 'mi-proyecto-token'.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  } catch (e) {
    return null;
  }
}

export function removeTokenCookie() {
  try {
    document.cookie = 'mi-proyecto-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (e) {}
}

// Backwards-compatible accessor: prefer cookie, fall back to localStorage
export function getAuthToken(): string | null {
  const c = getTokenFromCookie();
  if (c) return c;
  try {
    const ls = (localStorage && localStorage.getItem('mi-proyecto-token')) || null;
    return ls;
  } catch (e) {
    return null;
  }
}
