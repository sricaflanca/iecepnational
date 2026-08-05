// Lightweight replacement for the @base44/sdk client, backed by our own
// Express API (see server/). Keeps the exact same call shape the rest of
// the app already uses (base44.auth.*, base44.entities.<Name>.*,
// base44.integrations.Core.UploadFile) so no page needed to change.

const TOKEN_KEY = "auth_token";
const API_BASE = "/api";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function toQueryString(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") usp.set(key, value);
  });
  const str = usp.toString();
  return str ? `?${str}` : "";
}

async function apiFetch(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let requestBody = body;
  if (body && !isForm) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: requestBody });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const error = new Error((data && data.message) || res.statusText || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

const ENTITY_NAMES = [
  "BoardMember",
  "ChapterEvent",
  "CorporateMember",
  "Event",
  "IECEPistle",
  "Member",
  "Partner",
  "Resolution",
  "SocialEvent",
  "Specialization",
  "StudentActivity",
];

function buildEntityClient(entityName) {
  return {
    list: (sort, limit) => apiFetch(`/entities/${entityName}${toQueryString({ sort, limit })}`),
    filter: (_query, sort, limit) =>
      apiFetch(`/entities/${entityName}/filter${toQueryString({ sort, limit })}`),
    create: (payload) => apiFetch(`/entities/${entityName}`, { method: "POST", body: payload }),
    update: (id, payload) => apiFetch(`/entities/${entityName}/${id}`, { method: "PUT", body: payload }),
    delete: (id) => apiFetch(`/entities/${entityName}/${id}`, { method: "DELETE" }),
  };
}

const entities = {};
for (const name of ENTITY_NAMES) entities[name] = buildEntityClient(name);

export const base44 = {
  auth: {
    getToken,
    // No public registration — accounts are created by an admin from the
    // Users tab (base44.admin.users.create below).
    async loginViaEmailPassword(email, password) {
      const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      setToken(data.access_token);
      return data;
    },
    setToken(token) {
      setToken(token);
    },
    async me() {
      return apiFetch("/auth/me");
    },
    logout(redirectUrl) {
      setToken(null);
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin(returnTo) {
      const suffix = returnTo && returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
      window.location.href = `/admin/login${suffix}`;
    },
    async resetPasswordRequest(email) {
      return apiFetch("/auth/forgot-password", { method: "POST", body: { email } });
    },
    async resetPassword({ resetToken, newPassword }) {
      return apiFetch("/auth/reset-password", { method: "POST", body: { resetToken, newPassword } });
    },
    async changePassword({ currentPassword, newPassword }) {
      return apiFetch("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
    },
  },
  entities,
  integrations: {
    Core: {
      async UploadFile({ file }) {
        const formData = new FormData();
        formData.append("file", file);
        return apiFetch("/upload", { method: "POST", body: formData, isForm: true });
      },
    },
  },
  admin: {
    users: {
      list: () => apiFetch("/admin/users"),
      create: (payload) => apiFetch("/admin/users", { method: "POST", body: payload }),
      updateRoles: (id, roles) =>
        apiFetch(`/admin/users/${id}/roles`, { method: "PATCH", body: { roles } }),
      delete: (id) => apiFetch(`/admin/users/${id}`, { method: "DELETE" }),
    },
  },
  settings: {
    about: {
      get: () => apiFetch("/settings/about"),
      update: (payload) => apiFetch("/settings/about", { method: "PUT", body: payload }),
    },
  },
};
