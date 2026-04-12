export class UserApiClient {
  baseUrl = 'http://127.0.0.1:3001';

  private async request(path: string, opts: RequestInit = {}) {
    const res = await fetch(this.baseUrl + path, {
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      credentials: 'omit',
      ...opts,
    });
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
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(payload: any) {
    return this.request('/register', {
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

  async setPermissions(id: string, permissions: string[], token?: string) {
    return this.request(`/users/${id}/permissions`, { method: 'PUT', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify({ permissions }) });
  }

  async addPermission(id: string, permission: any, token?: string) {
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    return this.request(`/users/${id}/permissions`, { method: 'POST', headers, body: JSON.stringify({ permission }) });
  }

  async removePermission(id: string, permissionIdentifier: string | number, token?: string) {
    // permissionIdentifier may be a numeric id or a name string
    const path = `/users/${id}/permissions/${encodeURIComponent(String(permissionIdentifier))}`;
    return this.request(path, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  }
}

export default UserApiClient;
