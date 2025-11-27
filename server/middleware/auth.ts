import type { Request, Response, NextFunction } from "express";

// Extend express session types
declare module 'express-session' {
  interface SessionData {
    userId: string;
    username: string;
  }
}

// Authentication middleware to verify session
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    // User is authenticated
    return next();
  }
  
  // User is not authenticated
  return res.status(401).json({ 
    success: false, 
    message: "Nije autorizovan pristup. Molimo prijavite se." 
  });
}

// Rate limiting for login attempts
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Clean up old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(loginAttempts.entries());
  for (const [ip, entry] of entries) {
    if (now - entry.firstAttempt > WINDOW_MS) {
      loginAttempts.delete(ip);
    }
  }
}, 30 * 60 * 1000);

export function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  const entry = loginAttempts.get(ip);
  
  if (!entry) {
    // First attempt from this IP
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }
  
  // Check if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    // Reset the window
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }
  
  // Check if max attempts reached
  if (entry.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((WINDOW_MS - (now - entry.firstAttempt)) / 60000);
    return res.status(429).json({ 
      success: false, 
      message: `Previše pokušaja prijave. Pokušajte ponovo za ${timeLeft} minuta.` 
    });
  }
  
  // Increment attempt count
  entry.count++;
  loginAttempts.set(ip, entry);
  
  next();
}

// Reset rate limit on successful login
export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
