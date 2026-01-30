/**
 * Authentication Middleware
 * 
 * Verifies Supabase JWT tokens and attaches authenticated user to request.
 * This is the FIRST middleware in the chain - every request must pass auth.
 * 
 * Security principles:
 * 1. Never trust client-provided user identity
 * 2. Always verify JWT signature with Supabase
 * 3. Extract user_id from verified token only
 * 4. Handle auth errors with generic messages to prevent info leakage
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, isMockMode } from '../db/client';
import { AuthenticatedRequest, Database } from '../types';

// Type for user row from database
type UserRow = Database['public']['Tables']['users']['Row'];

// JWT verification requires Supabase JWT secret
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET && !isMockMode) {
  throw new Error('SUPABASE_JWT_SECRET environment variable is required');
} else if (!SUPABASE_JWT_SECRET) {
  console.warn('⚠️  SUPABASE_JWT_SECRET not set - auth will be bypassed in mock mode');
}

/**
 * Express middleware to authenticate users via Supabase JWT
 * 
 * Expected header: Authorization: Bearer <jwt_token>
 * 
 * On success: Attaches user object to req.user
 * On failure: Returns 401 with standard error format
 */
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // In mock mode without JWT secret, skip authentication
    if (isMockMode && !SUPABASE_JWT_SECRET) {
      // Attach a mock user for development
      (req as unknown as AuthenticatedRequest).user = {
        id: 'mock-user-id',
        authId: 'mock-auth-id',
        email: 'dev@example.com',
      };
      next();
      return;
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid token.',
          status: 401,
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify JWT signature
    let decodedToken: jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(token, SUPABASE_JWT_SECRET!) as jwt.JwtPayload;
    } catch {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token. Please sign in again.',
          status: 401,
        },
      });
      return;
    }

    // Extract user ID from verified token
    const authId = decodedToken.sub;

    if (!authId) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token format.',
          status: 401,
        },
      });
      return;
    }

    // Check if supabase is available
    if (!supabase) {
      res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Database not configured.',
          status: 503,
        },
      });
      return;
    }

    // Fetch user from database
    const { data, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .is('deleted_at', null)
      .single();

    const userData = data as UserRow | null;

    if (userError || !userData) {
      console.error('User lookup failed:', userError);
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found or account deactivated.',
          status: 401,
        },
      });
      return;
    }

    // Attach user to request for downstream middleware
    (req as unknown as AuthenticatedRequest).user = {
      id: userData.id,
      authId: userData.auth_id,
      email: userData.email,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication service unavailable.',
        status: 500,
      },
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token valid, but doesn't block request if missing/invalid
 * Useful for public routes that can be enhanced when user is logged in
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // In mock mode, attach mock user
    if (isMockMode && !SUPABASE_JWT_SECRET) {
      (req as unknown as AuthenticatedRequest).user = {
        id: 'mock-user-id',
        authId: 'mock-auth-id',
        email: 'dev@example.com',
      };
      next();
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    let decodedToken: jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(token, SUPABASE_JWT_SECRET!) as jwt.JwtPayload;
    } catch {
      next();
      return;
    }

    const authId = decodedToken.sub;
    if (!authId || !supabase) {
      next();
      return;
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .is('deleted_at', null)
      .single();

    const userData = data as UserRow | null;

    if (userData) {
      (req as unknown as AuthenticatedRequest).user = {
        id: userData.id,
        authId: userData.auth_id,
        email: userData.email,
      };
    }

    next();
  } catch {
    // Fail silently for optional auth
    next();
  }
}
