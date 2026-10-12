import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'titenfin_super_secret_auth_key_2026';

/**
 * Hash PIN/Password dengan HMAC SHA-256
 */
export function hashPin(pin: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(pin).digest('hex');
}

/**
 * Buat session token sederhana berbasis payload & signature
 */
export function createSessionToken(userId: string, email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email,
      timestamp: Date.now(),
    })
  ).toString('base64');

  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verifikasi session token
 */
export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadBase64).digest('hex');
    if (expectedSig !== signature) return null;

    const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}
