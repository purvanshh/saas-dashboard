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
import { supabase } from '../db/client';
import { AuthenticatedRequest, User } from '../types';

// JWT verification requires Supabase JWT secret
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET) {
  throw new Error('SUPABASE_JWT_SECRET environment variable is required');
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
    } catch (jwtError) {
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

    // Fetch user from database
    // This links the Supabase Auth user to our application user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .is('deleted_at', null)
      .single();

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

    // Convert DB format to application types
    const user: User = {
      id: userData.id,
      authId: userData.auth_id,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatar_url || undefined,
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at),
    };

    // Attach user to request for downstream middleware
    (req as AuthenticatedRequest).user = user;

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
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
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
    if (!authId) {
      next();
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .is('deleted_at', null)
      .single();

    if (userData) {
      (req as AuthenticatedRequest).user = {
        id: userData.id,
        authId: userData.auth_id,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatar_url || undefined,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      };
    }

    next();
  } catch {
    // Fail silently for optional auth
    next();
  }
}
