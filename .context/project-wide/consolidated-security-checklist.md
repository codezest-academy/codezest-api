# CodeZest Security & Authentication - Consolidated Checklist

**Purpose**: Master checklist combining all security standards from backend, frontend, and platform-wide guides  
**Last Updated**: 2025-11-27  
**Status**: Official Standard

---

## 🎯 Quick Reference

| Aspect              | Backend                    | Frontend                    | Resource Servers                       |
| ------------------- | -------------------------- | --------------------------- | -------------------------------------- |
| **Auth Method**     | JWT in httpOnly cookies    | Proxy to backend            | Verify JWT from header                 |
| **Token Storage**   | Set-Cookie headers         | No storage (cookies only)   | No storage needed                      |
| **CSRF Protection** | Generate & validate tokens | Send in X-CSRF-Token header | Validate if accepting browser requests |
| **Token Lifetime**  | Access: 15min, Refresh: 7d | N/A (managed by backend)    | Verify expiration                      |
| **Primary Role**    | Identity Provider          | User Interface              | Resource Protection                    |

---

## 📋 Backend (Identity Provider) Checklist

### Configuration

- [ ] **JWT Secrets**
  - [ ] `JWT_ACCESS_SECRET` set (32+ characters, random)
  - [ ] `JWT_REFRESH_SECRET` set (different from access secret)
  - [ ] Secrets stored in environment variables, never hardcoded
  - [ ] Different secrets for development and production

- [ ] **Cookie Configuration**
  - [ ] Access token: `httpOnly: true`, `secure: true` (prod), `sameSite: 'strict'`, `maxAge: 15min`
  - [ ] Refresh token: `httpOnly: true`, `secure: true` (prod), `sameSite: 'strict'`, `maxAge: 7d`, `path: '/auth/refresh'`
  - [ ] CSRF token: `httpOnly: false`, `secure: true` (prod), `sameSite: 'strict'`, `maxAge: 24h`

- [ ] **CORS Configuration**
  - [ ] `origin` set to frontend URL (not `*`)
  - [ ] `credentials: true` enabled
  - [ ] Allowed headers include `X-CSRF-Token`

### Implementation

- [ ] **Token Service**
  - [ ] `generateAccessToken()` with 15min expiration
  - [ ] `generateRefreshToken()` with 7d expiration
  - [ ] `verifyAccessToken()` with issuer/audience validation
  - [ ] `verifyRefreshToken()` with issuer/audience validation

- [ ] **CSRF Service**
  - [ ] `generateToken()` creates cryptographically random tokens
  - [ ] `validateToken()` checks existence and expiration
  - [ ] Token cleanup mechanism to prevent memory leaks

- [ ] **Auth Controller**
  - [ ] `/auth/register` - Sets cookies, never returns tokens in body
  - [ ] `/auth/login` - Sets cookies, supports "remember me"
  - [ ] `/auth/logout` - Clears all cookies
  - [ ] `/auth/refresh` - Implements refresh token rotation
  - [ ] `/auth/csrf-token` - Returns CSRF token
  - [ ] `/auth/me` - Returns current user (protected)

- [ ] **Middleware**
  - [ ] `authMiddleware` - Reads token from cookie, verifies, attaches user to request
  - [ ] `csrfMiddleware` - Validates CSRF token on non-GET requests
  - [ ] `cookieParser` - Installed and configured before routes

### Security

- [ ] **Never Do**
  - [ ] ❌ Send tokens in response body
  - [ ] ❌ Use long-lived access tokens (>15min)
  - [ ] ❌ Skip httpOnly flag
  - [ ] ❌ Use SameSite=None without Secure
  - [ ] ❌ Store tokens in database (except refresh token hash if implementing revocation)

- [ ] **Always Do**
  - [ ] ✅ Set tokens in httpOnly cookies
  - [ ] ✅ Use short-lived access tokens
  - [ ] ✅ Verify CSRF tokens on mutations
  - [ ] ✅ Implement refresh token rotation
  - [ ] ✅ Log failed login attempts

### Testing

- [ ] **Unit Tests**
  - [ ] Token generation and verification
  - [ ] CSRF token validation
  - [ ] Expired token rejection

- [ ] **Integration Tests**
  - [ ] Login sets httpOnly cookies
  - [ ] Logout clears cookies
  - [ ] Refresh endpoint rotates tokens
  - [ ] CSRF validation on protected routes
  - [ ] 401 on invalid/expired tokens

### Deployment

- [ ] HTTPS enabled
- [ ] `NODE_ENV=production`
- [ ] Cookie `secure` flag enabled
- [ ] Rate limiting on auth endpoints
- [ ] Strong JWT secrets in production
- [ ] CORS origin set to production frontend URL

---

## 📋 Frontend (Next.js) Checklist

### API Routes (Proxy Pattern)

- [ ] **Auth Endpoints**
  - [ ] `/api/auth/login` - Proxies to backend, forwards Set-Cookie headers
  - [ ] `/api/auth/register` - Proxies to backend, forwards Set-Cookie headers
  - [ ] `/api/auth/logout` - Proxies to backend
  - [ ] `/api/auth/refresh` - Proxies to backend, forwards Set-Cookie headers
  - [ ] `/api/auth/csrf-token` - Proxies to backend

- [ ] **Header Forwarding**
  - [ ] All routes use `response.headers.getSetCookie()`
  - [ ] Set-Cookie headers appended to NextResponse
  - [ ] `credentials: 'include'` on all fetch calls to backend

### Services

- [ ] **Auth Service**
  - [ ] `login()` - Calls `/api/auth/login`, no token storage
  - [ ] `register()` - Calls `/api/auth/register`, no token storage
  - [ ] `logout()` - Calls `/api/auth/logout`
  - [ ] `getCurrentUser()` - Calls `/api/auth/me`
  - [ ] `refreshToken()` - Calls `/api/auth/refresh`
  - [ ] No methods for getting/setting tokens

- [ ] **HTTP Client**
  - [ ] All requests include `credentials: 'include'`
  - [ ] CSRF token added to non-GET requests via `X-CSRF-Token` header
  - [ ] Auto-refresh on 401 errors
  - [ ] Deduplication of refresh requests (prevent multiple simultaneous refreshes)
  - [ ] Redirect to login on refresh failure

- [ ] **CSRF Service**
  - [ ] `initialize()` fetches CSRF token on app load
  - [ ] `getToken()` returns current token
  - [ ] Token read from cookie for header injection

### Hooks

- [ ] **useAuth**
  - [ ] Loads user on mount
  - [ ] Provides `login()`, `logout()`, `refetch()`
  - [ ] Returns `user`, `loading`, `error`, `isAuthenticated`
  - [ ] No token management logic

### Security

- [ ] **Never Do**
  - [ ] ❌ Store tokens in localStorage/sessionStorage
  - [ ] ❌ Manually set Authorization header
  - [ ] ❌ Send tokens in URL parameters
  - [ ] ❌ Forget `credentials: 'include'`

- [ ] **Always Do**
  - [ ] ✅ Use `credentials: 'include'` on all requests
  - [ ] ✅ Add CSRF token to mutations
  - [ ] ✅ Handle 401 gracefully with auto-refresh
  - [ ] ✅ Redirect to login on auth failure

### Testing

- [ ] **Manual Verification**
  - [ ] Login sets cookies in DevTools → Application → Cookies
  - [ ] Cookies have `HttpOnly` flag
  - [ ] Cookies have `Secure` flag (production)
  - [ ] Cookies have `SameSite=Strict`
  - [ ] Logout clears cookies
  - [ ] Token auto-refreshes on 401
  - [ ] CSRF token sent with POST/PUT/DELETE
  - [ ] `document.cookie` does NOT show accessToken/refreshToken

---

## 📋 Resource Servers Checklist

### Dependencies

- [ ] `helmet` - Security headers
- [ ] `cors` - Cross-origin configuration
- [ ] `jsonwebtoken` - JWT verification
- [ ] `zod` - Input validation
- [ ] `express-rate-limit` - Rate limiting

### Environment Variables

- [ ] `JWT_ACCESS_SECRET` - Must match auth service
- [ ] `FRONTEND_URL` - For CORS configuration
- [ ] Service-specific variables

### Middleware

- [ ] **Security Middleware**
  - [ ] `helmet()` active globally
  - [ ] `cors()` configured with frontend URL and `credentials: true`
  - [ ] `rateLimit()` configured (global: 100 req/15min, sensitive routes: stricter)

- [ ] **Auth Middleware**
  - [ ] `authenticate()` - Verifies JWT from `Authorization: Bearer <token>` header
  - [ ] Validates signature with `JWT_ACCESS_SECRET`
  - [ ] Verifies issuer (`codezest-auth`) and audience (`codezest-api`)
  - [ ] Verifies expiration
  - [ ] Attaches user payload to request

- [ ] **Authorization Middleware**
  - [ ] `authorize(...roles)` - Checks user role from JWT payload
  - [ ] Service-level role blocking if needed
  - [ ] Resource-level ownership verification

### Routes

- [ ] **Protected Routes**
  - [ ] All protected routes use `authenticate` middleware
  - [ ] Role-restricted routes use `authorize(...)` middleware
  - [ ] Public routes clearly separated

### Input Validation

- [ ] **All Endpoints**
  - [ ] POST/PUT/PATCH endpoints validate body with Zod schemas
  - [ ] Query parameters validated
  - [ ] Path parameters validated
  - [ ] Validation errors return 400 with clear messages

### Inter-Service Communication

- [ ] **Asynchronous (Preferred)**
  - [ ] Events published to RabbitMQ/Redis
  - [ ] Event consumers trust publisher

- [ ] **Synchronous**
  - [ ] User context: Forward user's JWT in `Authorization` header
  - [ ] System context: Use service-to-service token or mTLS

### Security

- [ ] **Never Do**
  - [ ] ❌ Skip JWT verification on protected routes
  - [ ] ❌ Trust user input without validation
  - [ ] ❌ Use `*` for CORS origin
  - [ ] ❌ Skip rate limiting

- [ ] **Always Do**
  - [ ] ✅ Verify JWT signature and expiration
  - [ ] ✅ Validate all inputs with Zod
  - [ ] ✅ Use helmet for security headers
  - [ ] ✅ Configure CORS properly
  - [ ] ✅ Implement rate limiting

---

## 🔐 Platform-Wide Security Standards

### Token Strategy

| Token Type    | Lifetime   | Storage                                                      | Purpose            |
| ------------- | ---------- | ------------------------------------------------------------ | ------------------ |
| Access Token  | 15 minutes | httpOnly cookie (backend) / Bearer header (resource servers) | API authentication |
| Refresh Token | 7 days     | httpOnly cookie (path=/auth/refresh)                         | Token renewal      |
| CSRF Token    | 24 hours   | Regular cookie (readable by JS)                              | CSRF protection    |

### Service Responsibilities

#### Identity Provider (`codezest-auth`)

- ✅ User registration & login
- ✅ Password hashing & storage
- ✅ Token generation (access & refresh)
- ✅ Session management (Redis-backed)
- ✅ OAuth integration
- ✅ Account lockout & security events

#### Resource Servers (All other services)

- ✅ Verify JWT access tokens
- ✅ Enforce RBAC permissions
- ✅ Protect resources with rate limiting
- ✅ Validate all inputs
- ✅ Implement CORS properly

### Cross-Cutting Concerns

- [ ] **Logging**
  - [ ] Failed authentication attempts
  - [ ] Authorization failures
  - [ ] Rate limit violations
  - [ ] Security events

- [ ] **Monitoring**
  - [ ] Token refresh rate
  - [ ] Failed login attempts
  - [ ] 401/403 response rates
  - [ ] Rate limit hits

- [ ] **Documentation**
  - [ ] API endpoints documented
  - [ ] Security requirements clear
  - [ ] Environment variables documented
  - [ ] Deployment checklist maintained

---

## 🚨 Common Pitfalls

### Backend

1. **Sending tokens in response body** - Always use Set-Cookie headers
2. **Long-lived access tokens** - Never exceed 15 minutes
3. **Missing httpOnly flag** - Critical XSS vulnerability
4. **Weak JWT secrets** - Use 32+ random characters
5. **No CSRF protection** - Vulnerable to cross-site attacks

### Frontend

1. **localStorage for tokens** - XSS vulnerable, use cookies
2. **Missing credentials: 'include'** - Cookies won't be sent
3. **No auto-refresh logic** - Poor user experience
4. **Forgetting CSRF token** - Mutations will fail
5. **Manual token management** - Let cookies handle it

### Resource Servers

1. **Skipping JWT verification** - Critical security hole
2. **No input validation** - Injection vulnerabilities
3. **CORS misconfiguration** - Either too restrictive or too permissive
4. **Missing rate limiting** - Vulnerable to abuse
5. **Trusting JWT without verification** - Anyone can forge tokens

---

## 📚 Quick Start Guide

### For New Backend Service

1. Copy JWT and cookie configurations
2. Implement token and CSRF services
3. Create auth controller with all endpoints
4. Add auth and CSRF middleware
5. Configure CORS with `credentials: true`
6. Add tests for all auth flows

### For New Frontend

1. Create API route proxies for all auth endpoints
2. Implement HTTP client with auto-refresh
3. Create auth service (no token storage)
4. Initialize CSRF token on app load
5. Use `credentials: 'include'` everywhere
6. Test cookie flow in DevTools

### For New Resource Server

1. Install security dependencies
2. Set `JWT_ACCESS_SECRET` environment variable
3. Implement `authenticate` middleware
4. Implement `authorize` middleware
5. Configure helmet, CORS, rate limiting
6. Validate all inputs with Zod
7. Protect all routes appropriately

---

## ✅ Pre-Deployment Verification

Run through this checklist before deploying any service:

- [ ] All environment variables set in production
- [ ] HTTPS enabled
- [ ] Cookie `secure` flag enabled
- [ ] CORS origin set to production URL (not `*`)
- [ ] JWT secrets are strong and different from development
- [ ] Rate limiting configured
- [ ] All tests passing
- [ ] Security headers verified (helmet)
- [ ] No tokens in logs
- [ ] Error messages don't leak sensitive info

---

**Last Updated**: 2025-11-27  
**Maintained By**: CodeZest Security Team  
**Priority**: CRITICAL
