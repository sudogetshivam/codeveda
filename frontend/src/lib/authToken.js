// Holds Clerk's getToken so axios can attach the JWT to API requests (needed for cross-origin).
let getTokenFn = null;

export function setAuthGetToken(fn) {
  getTokenFn = fn;
}

export function getAuthToken() {
  return getTokenFn ? getTokenFn() : Promise.resolve(null);
}