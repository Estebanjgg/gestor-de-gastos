import jwt from 'jsonwebtoken';

/**
 * Autentica un token JWT y devuelve la información decodificada del usuario.
 * @param {string} token - El token JWT del usuario.
 * @returns {object|null} - Información decodificada del usuario o `null` si el token es inválido.
 */
export function authenticate(token) {
  try {
    if (!token) {
      console.warn('No se recibió un token para autenticar.');
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error al autenticar el token:', error.message);
    return null;
  }
}
