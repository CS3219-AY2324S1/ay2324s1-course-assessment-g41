import { Socket } from 'socket.io';
import cookie from 'cookie';
import authService from '@/services/auth-service';

const accessTokenKey = process.env.ACCESS_COOKIE_KEY || '';

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): void {
  try {
    const handshakeData = socket.request;
    const cookies = cookie.parse(handshakeData.headers.cookie || '');
    const token = cookies[accessTokenKey];

    if (token) {
      const decoded = authService.verifyAccessToken(token);
      (socket as any).userId = decoded.userId;

      console.log(`User authenticated - ID: ${decoded.userId}`); // Log the authenticated user's ID
      next();
    } else {
      console.log('Authentication error: Token not found');
      next(new Error('Authentication error'));
    }
  } catch (error) {
    console.log('Authentication error: Invalid token');
    next(new Error('Authentication error'));
  }
}
