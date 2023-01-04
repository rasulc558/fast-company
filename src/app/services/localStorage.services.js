const JWT_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";

export function setToken({ refreshToken, expiresIn = 3600, idToken }) {
  const expiresDate = new Date().getTime() + +expiresIn * 1000;
  localStorage.setItem(JWT_KEY, idToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate);
}

export function getAccessToken() {
  return localStorage.getItem(JWT_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getTokenExpiresDate() {
  return localStorage.getItem(EXPIRES_KEY);
}

const localsStorageService = {
  setToken,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate
};

export default localsStorageService;
