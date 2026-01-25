import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth error:', error?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  
  supabaseAdmin.auth.getUser(token)
    .then(({ data: { user }, error }) => {
      if (!error && user) {
        req.userId = user.id;
        req.userEmail = user.email;
      }
      next();
    })
    .catch(() => {
      next();
    });
}
