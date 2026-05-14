import { JwtPayload, UserRole } from '../types';

/**
 * Utility to simulate JWT Token creation, decoding and verification.
 * In a real application, token signing happens on the server, but for this mock setup,
 * we replicate the exact structure: header.payload.signature
 */

// Helper to encode string to base64 (browser safe)
const base64Encode = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    return str;
  }
};

// Helper to decode base64
const base64Decode = (str: string): string => {
  try {
    return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return str;
  }
};

export const signMockToken = (data: { sub: string; username: string; role: UserRole; fullName: string }): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600; // 1 hour expiration
  
  const payload: JwtPayload = {
    ...data,
    iat,
    exp,
    iss: 'auth-on3-api'
  };

  const encodedHeader = base64Encode(JSON.stringify(header));
  const encodedPayload = base64Encode(JSON.stringify(payload));
  // Simulated signature using a static salt
  const mockSignature = base64Encode(`hmac_secret_key_on3_${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export const decodeMockToken = (token: string): JwtPayload | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const decodedPayloadStr = base64Decode(parts[1]);
    return JSON.parse(decodedPayloadStr) as JwtPayload;
  } catch (e) {
    console.error('Error decoding mock JWT token:', e);
    return null;
  }
};

export const verifyMockToken = (token: string): boolean => {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = decodeMockToken(token);
    if (!payload) return false;

    // Check expiration
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      console.warn('Mock token has expired');
      return false;
    }

    // Check issuer
    if (payload.iss !== 'auth-on3-api') {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};
