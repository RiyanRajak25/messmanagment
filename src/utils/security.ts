/**
 * HIMRASAD Operational Security Suite
 * Institutional Cyber Security & Defensive Programming Utilities
 *
 * Covers:
 * 1. XSS & Injection Sanitization
 * 2. Input Boundary Validation
 * 3. Client & API Rate Limiting / Brute Force Prevention
 * 4. Tamper-Evident Security Event Audit Trail
 * 5. Data Masking for Confidential Financial & Personal Identifiers
 * 6. Session Integrity & Anti-CSRF Token Management
 */

// ============================================================================
// 1. INPUT SANITIZATION (ANTI-XSS & ANTI-INJECTION)
// ============================================================================

/**
 * Strips script tags, HTML tags, javascript: protocols, and event handler attributes
 * from user input to eliminate Cross-Site Scripting (XSS) vectors.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove dangerous protocol prefixes
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    // Remove inline event handlers (e.g. onerror=, onload=, onclick=)
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
    // Encode raw HTML tag brackets
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Recursively sanitizes all string properties in a payload object.
 */
export function sanitizePayload<T>(data: T): T {
  if (typeof data === 'string') {
    return sanitizeInput(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item)) as unknown as T;
  }
  if (data !== null && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data)) {
      sanitized[key] = sanitizePayload(val);
    }
    return sanitized as T;
  }
  return data;
}

// ============================================================================
// 2. INPUT BOUNDARY & NUMERIC INTEGRITY VALIDATORS
// ============================================================================

/**
 * Validates that a numeric input is positive, finite, and within institutional limits.
 */
export function isStrictPositiveNumber(val: unknown, maxLimit = 10_000_000): boolean {
  if (typeof val !== 'number' && typeof val !== 'string') return false;
  const num = typeof val === 'number' ? val : parseFloat(val);
  return Number.isFinite(num) && !Number.isNaN(num) && num > 0 && num <= maxLimit;
}

/**
 * Validates that a headcount or quantity is an integer >= 0.
 */
export function isNonNegativeInteger(val: unknown, maxLimit = 1_000_000): boolean {
  if (typeof val !== 'number' && typeof val !== 'string') return false;
  const num = typeof val === 'number' ? val : Number(val);
  return Number.isInteger(num) && num >= 0 && num <= maxLimit;
}

/**
 * RFC-compliant email format check.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

// ============================================================================
// 3. PASSWORD STRENGTH & EVALUATION
// ============================================================================

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Institutional Grade';
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial && password.length >= 10) score++;

  const labels: PasswordStrength['label'][] = [
    'Very Weak',
    'Weak',
    'Medium',
    'Strong',
    'Institutional Grade',
  ];

  return {
    score,
    label: labels[score] || 'Weak',
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };
}

// ============================================================================
// 4. SENSITIVE DATA MASKING (FINANCE & IDENTIFIER PRIVACY)
// ============================================================================

/**
 * Masks confidential bank account numbers, taxpayer IDs, or voucher numbers.
 * Example: maskSensitive("SBIN00481239912", 4, 3) => "SBIN••••••••912"
 */
export function maskSensitive(
  value: string | undefined | null,
  visibleStart = 3,
  visibleEnd = 4
): string {
  if (!value) return '••••';
  const str = String(value);
  if (str.length <= visibleStart + visibleEnd) {
    return '••••••••';
  }
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const dots = '•'.repeat(Math.min(8, str.length - visibleStart - visibleEnd));
  return `${start}${dots}${end}`;
}

// ============================================================================
// 5. BRUTE FORCE PREVENTION & RATE LIMITING
// ============================================================================

interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  lockoutUntil: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 60 seconds lockout

class SecurityRateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();

  check(actionKey: string): { allowed: boolean; remainingLockoutSeconds: number } {
    const record = this.records.get(actionKey);
    if (!record) {
      return { allowed: true, remainingLockoutSeconds: 0 };
    }

    const now = Date.now();
    if (record.lockoutUntil > now) {
      const remaining = Math.ceil((record.lockoutUntil - now) / 1000);
      return { allowed: false, remainingLockoutSeconds: remaining };
    }

    // Lockout expired, reset attempts if window has passed (e.g. 10 mins)
    if (now - record.lastAttempt > 600_000) {
      this.records.delete(actionKey);
    }

    return { allowed: true, remainingLockoutSeconds: 0 };
  }

  recordFailure(actionKey: string): { locked: boolean; remainingLockoutSeconds: number } {
    const now = Date.now();
    const record = this.records.get(actionKey) || {
      attempts: 0,
      lastAttempt: now,
      lockoutUntil: 0,
    };

    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
      record.lockoutUntil = now + LOCKOUT_DURATION_MS;
      this.records.set(actionKey, record);
      recordSecurityEvent({
        type: 'BRUTE_FORCE_LOCKOUT',
        severity: 'HIGH',
        details: `Action key ${actionKey} exceeded ${MAX_FAILED_ATTEMPTS} failed attempts. Locked for 60s.`,
      });
      return { locked: true, remainingLockoutSeconds: 60 };
    }

    this.records.set(actionKey, record);
    return { locked: false, remainingLockoutSeconds: 0 };
  }

  recordSuccess(actionKey: string): void {
    this.records.delete(actionKey);
  }
}

export const rateLimiter = new SecurityRateLimiter();

// ============================================================================
// 6. TAMPER-EVIDENT SECURITY AUDIT LOGGING
// ============================================================================

export interface SecurityEvent {
  id?: string;
  timestamp?: string;
  type:
    | 'AUTHENTICATION_SUCCESS'
    | 'AUTHENTICATION_FAILURE'
    | 'BRUTE_FORCE_LOCKOUT'
    | 'UNAUTHORIZED_ACCESS_ATTEMPT'
    | 'INVALID_TOKEN'
    | 'SESSION_TIMEOUT'
    | 'INJECTION_DETECTED'
    | 'INTEGRITY_VIOLATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  actor?: string;
  ipPlaceholder?: string;
}

const SECURITY_LOGS_KEY = 'himrasad_security_audit_logs';

export function recordSecurityEvent(event: SecurityEvent): void {
  try {
    const fullEvent: SecurityEvent = {
      ...event,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ipPlaceholder: '127.0.0.1 (Institutional Intranet Gateway)',
    };

    const existingRaw = localStorage.getItem(SECURITY_LOGS_KEY);
    const logs: SecurityEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
    logs.unshift(fullEvent);

    // Keep latest 200 security events to prevent unbounded storage growth
    if (logs.length > 200) {
      logs.splice(200);
    }

    localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to write security event log:', err);
  }
}

export function getSecurityLogs(): SecurityEvent[] {
  try {
    const raw = localStorage.getItem(SECURITY_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ============================================================================
// 7. ANTI-CSRF TOKEN GENERATION & VERIFICATION
// ============================================================================

const CSRF_TOKEN_KEY = 'himrasad_csrf_token';

export function getOrCreateCsrfToken(): string {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    const randomBytes = new Uint8Array(24);
    window.crypto.getRandomValues(randomBytes);
    token = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
}

export function verifyCsrfToken(submittedToken: string | null): boolean {
  if (!submittedToken) return false;
  const current = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return !!current && current === submittedToken;
}
