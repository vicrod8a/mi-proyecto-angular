export class UserApiClient {
  // Route all user API calls through the API Gateway
  // Gateway proxies `/users` -> user service — keep base at gateway root
  baseUrl = 'http://127.0.0.1:3000';

  private async request(path: string, opts: RequestInit = {}) {
    const hasBody = opts.body !== undefined && opts.body !== null;
    const mergedHeaders: Record<string, string> = { ...(opts.headers || {}) } as Record<string, string>;
    if (hasBody && !Object.keys(mergedHeaders).some(h => h.toLowerCase() === 'content-type')) {
      mergedHeaders['Content-Type'] = 'application/json';
    }
    const fetchOpts: RequestInit = {
      ...opts,
      headers: mergedHeaders,
      credentials: 'omit',
    };
    const res = await fetch(this.baseUrl + path, fetchOpts);
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const err = new Error((body && (body.message || body.error)) || res.statusText);
      (err as any).status = res.status;
      (err as any).body = body;
      throw err;
    }
    return body;
  }

  async login(email: string, password: string) {
    // send explicit email field
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(payload: any) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async logout(token?: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getUsers(token?: string) {
    return this.request('/users', { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async getById(id: string, token?: string) {
    return this.request(`/users/${id}`, { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async getMe(token?: string) {
    return this.request('/users/me', { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async getPermissions(token?: string) {
    return this.request('/users/permissions', { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async getPermissionsFor(userId: string, token?: string) {
    const path = `/users/${userId}/permissions`;
    return this.request(path, { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async createUser(payload: any, token?: string) {
    return this.request('/users', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(payload) });
  }

  async updateUser(id: string, payload: any, token?: string) {
    return this.request(`/users/${id}`, { method: 'PUT', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(payload) });
  }

  async deleteUser(id: string, token?: string) {
    return this.request(`/users/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }

  async deleteUserWithPassword(id: string, currentPassword: string, token?: string) {
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    const body = JSON.stringify({ current_password: currentPassword });
    return this.request(`/users/${id}`, { method: 'DELETE', headers, body });
  }

  async setPermissions(id: string, permissions: string[], token?: string) {
    return this.request(`/users/${id}/permissions`, { method: 'PUT', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify({ permissions }) });
  }

  async addPermission(id: string, permission: any, token?: string) {
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    // Normalize input: if caller passed an object like { permission: 'x', group_id }, send group_id at top-level
    let bodyPayload: any = {};
    if (permission && typeof permission === 'object') {
      bodyPayload.permission = permission.permission || permission.name || permission.id || String(permission);
      if (permission.group_id) bodyPayload.group_id = permission.group_id;
      if (permission.groupId) bodyPayload.group_id = permission.groupId;
    } else {
      bodyPayload = { permission };
    }
    return this.request(`/users/${id}/permissions`, { method: 'POST', headers, body: JSON.stringify(bodyPayload) });
  }

  async removePermission(id: string, permissionIdentifier: string | number, token?: string, groupId?: string) {
    // permissionIdentifier may be a numeric id or a name string
    let path = `/users/${id}/permissions/${encodeURIComponent(String(permissionIdentifier))}`;
    if (groupId) path += `?group_id=${encodeURIComponent(String(groupId))}`;
    return this.request(path, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }
}

export default UserApiClient;
