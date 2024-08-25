// An Array Of Routes That are accessible to the public
// This routes do not require authentication
export const publicRoutes = ["/", "/auth/new-verification"];

// An Array Of Routes That are used for authentication
// These routes will redirect logged in user to /settings

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

// Prefix for api authentication routes
// routes that start with this prefix are used for api authentication purposes

export const apiAuthPrefix = "/api/auth";

//The default redirect path after loggin in
export const DEFAULT_LOGIN_REDIRECT = "/settings";
