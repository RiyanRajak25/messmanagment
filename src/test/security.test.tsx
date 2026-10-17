import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeInput,
  sanitizePayload,
  isStrictPositiveNumber,
  isNonNegativeInteger,
  isValidEmail,
  evaluatePasswordStrength,
  maskSensitive,
  rateLimiter,
  recordSecurityEvent,
  getSecurityLogs,
  getOrCreateCsrfToken,
  verifyCsrfToken,
} from '../utils/security';

describe('HIMRASAD Cyber Security & Defensive Controls', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Anti-XSS & Payload Sanitization', () => {
    it('strips malicious script tags from user inputs', () => {
      const malicious = '<script>alert("XSS")</script>Fresh Vegetables';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toBe('Fresh Vegetables');
    });

    it('removes javascript: protocol injections', () => {
      const malicious = 'javascript:evilFunction()';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('javascript:');
    });

    it('neutralizes inline event handlers like onerror and onload', () => {
      const malicious = '<img src="x" onerror="stealCookies()">';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('stealCookies');
    });

    it('recursively sanitizes complex JSON payloads', () => {
      const payload = {
        title: 'Daily Menu',
        description: '<script>fetch("http://attacker.com")</script>Standard Rice and Dal',
        items: ['<b onmouseover="hack()">Chapati</b>', 'Mixed Dal'],
        nested: {
          comment: '<iframe src="http://evil.com"></iframe>Good food',
        },
      };

      const sanitized = sanitizePayload(payload);
      expect(sanitized.description).toBe('Standard Rice and Dal');
      expect(sanitized.items[0]).not.toContain('onmouseover');
      expect(sanitized.nested.comment).toBe('Good food');
    });
  });

  describe('Strict Numeric Boundary & Boundary Controls', () => {
    it('rejects negative, NaN, and non-numeric quantities', () => {
      expect(isStrictPositiveNumber(-10)).toBe(false);
      expect(isStrictPositiveNumber(0)).toBe(false);
      expect(isStrictPositiveNumber(NaN)).toBe(false);
      expect(isStrictPositiveNumber(Infinity)).toBe(false);
      expect(isStrictPositiveNumber('abc')).toBe(false);
      expect(isStrictPositiveNumber(50)).toBe(true);
      expect(isStrictPositiveNumber('25.5')).toBe(true);
    });

    it('validates headcounts and non-negative integers', () => {
      expect(isNonNegativeInteger(-1)).toBe(false);
      expect(isNonNegativeInteger(2.5)).toBe(false);
      expect(isNonNegativeInteger(0)).toBe(true);
      expect(isNonNegativeInteger(350)).toBe(true);
      expect(isNonNegativeInteger('400')).toBe(true);
    });

    it('validates email format strictly', () => {
      expect(isValidEmail('admin@messmunch.edu')).toBe(true);
      expect(isValidEmail('vendor@kisanagro.in')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('Password Evaluation & Protection', () => {
    it('scores password complexity appropriately', () => {
      const weak = evaluatePasswordStrength('abc');
      expect(weak.score).toBeLessThanOrEqual(1);

      const strong = evaluatePasswordStrength('HimRasad@2026#SecureOps');
      expect(strong.score).toBeGreaterThanOrEqual(3);
      expect(strong.hasUpper).toBe(true);
      expect(strong.hasLower).toBe(true);
      expect(strong.hasNumber).toBe(true);
      expect(strong.hasSpecial).toBe(true);
    });
  });

  describe('Sensitive Financial Data Masking', () => {
    it('masks bank accounts, GSTIN, and tax IDs by default', () => {
      const maskedGst = maskSensitive('29AAAAA0000A1Z5', 2, 3);
      expect(maskedGst.startsWith('29')).toBe(true);
      expect(maskedGst.endsWith('1Z5')).toBe(true);
      expect(maskedGst).toContain('••••');

      const maskedAccount = maskSensitive('SBIN00481239912', 4, 3);
      expect(maskedAccount.startsWith('SBIN')).toBe(true);
      expect(maskedAccount.endsWith('912')).toBe(true);
      expect(maskedAccount).toContain('••••');
    });

    it('safely handles short strings or null values', () => {
      expect(maskSensitive(null)).toBe('••••');
      expect(maskSensitive('')).toBe('••••');
      expect(maskSensitive('123')).toBe('••••••••');
    });
  });

  describe('Brute Force Rate Limiting Sentinel', () => {
    it('locks out actions after 5 consecutive failures', () => {
      const testKey = 'test-attacker@unauthorized.com';

      for (let i = 0; i < 4; i++) {
        const res = rateLimiter.recordFailure(testKey);
        expect(res.locked).toBe(false);
      }

      // 5th failure should trigger 60s lockout
      const fifthRes = rateLimiter.recordFailure(testKey);
      expect(fifthRes.locked).toBe(true);
      expect(fifthRes.remainingLockoutSeconds).toBe(60);

      // Subsequent check should disallow
      const status = rateLimiter.check(testKey);
      expect(status.allowed).toBe(false);
      expect(status.remainingLockoutSeconds).toBeGreaterThan(0);
    });

    it('resets lockout on success', () => {
      const testKey = 'test-legit@authorized.com';
      rateLimiter.recordFailure(testKey);
      rateLimiter.recordSuccess(testKey);
      const status = rateLimiter.check(testKey);
      expect(status.allowed).toBe(true);
    });
  });

  describe('Tamper-Evident Security Event Audit Trail', () => {
    it('records security events in persistent storage', () => {
      recordSecurityEvent({
        type: 'AUTHENTICATION_SUCCESS',
        severity: 'LOW',
        details: 'Unit test authentication record',
      });

      const logs = getSecurityLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].type).toBe('AUTHENTICATION_SUCCESS');
      expect(logs[0].ipPlaceholder).toContain('Institutional Intranet');
    });
  });

  describe('Anti-CSRF Token Generation and Verification', () => {
    it('creates and verifies cryptographically random CSRF tokens', () => {
      const token = getOrCreateCsrfToken();
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(20);

      expect(verifyCsrfToken(token)).toBe(true);
      expect(verifyCsrfToken('tampered-fake-token')).toBe(false);
      expect(verifyCsrfToken(null)).toBe(false);
    });
  });
});
