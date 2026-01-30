/**
 * Database client and connection management
 * Uses Supabase for PostgreSQL database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Flag to track if we're in mock mode
export const isMockMode = !supabaseUrl || !supabaseServiceKey;

if (isMockMode) {
  console.warn(
    '⚠️  Running in MOCK MODE - Supabase credentials not configured.\n' +
    '   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env for database access.\n' +
    '   Frontend will use its own mock data.'
  );
}

// Create Supabase client only if credentials are available
export const supabase: SupabaseClient<Database> | null = isMockMode
  ? null
  : createClient<Database>(
    supabaseUrl!,
    supabaseServiceKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    }
  );

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!supabase) {
    console.log('Database check skipped - running in mock mode');
    return false;
  }

  try {
    const { error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Transaction helper (for complex operations)
export async function withTransaction<T>(
  callback: (client: SupabaseClient<Database>) => Promise<T>
): Promise<T> {
  if (!supabase) {
    throw new Error('Database not configured - cannot perform transaction in mock mode');
  }
  // Note: Supabase doesn't support true transactions across HTTP
  // For production, consider using a direct PostgreSQL connection pool
  // or using Supabase's RPC functions for atomic operations
  return callback(supabase);
}

// Utility to convert snake_case DB results to camelCase
export function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    // Recursively convert nested objects and arrays
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item =>
          typeof item === 'object' && item !== null
            ? toCamelCase(item as Record<string, unknown>)
            : item
        );
      } else {
        result[camelKey] = toCamelCase(value as Record<string, unknown>);
      }
    } else {
      result[camelKey] = value;
    }
  }

  return result as T;
}

// Utility to convert camelCase to snake_case for DB queries
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
