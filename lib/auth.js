// lib/auth.js
import jwt from 'jsonwebtoken';

export function authenticate(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
