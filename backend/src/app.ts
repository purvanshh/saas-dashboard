/**
 * Main Express Application
 * 
 * Configures and starts the multi-tenant SaaS backend server.
 * 
 * Middleware Order (CRITICAL):
 * 1. Security headers (helmet)
 * 2. CORS configuration
 * 3. Rate limiting
 * 4. Request parsing
 * 5. Routes
 * 6. Error handling
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import routes from './routes';
import { globalErrorHandler } from './utils/errors';
import { checkDatabaseConnection } from './db/client';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id'],
};

app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
      status: 429,
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth endpoints
  skipSuccessfulRequests: true,
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 writes per minute
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Write operations are rate-limited to prevent abuse.',
      status: 429,
    },
  },
});

app.use(generalLimiter);

// ============================================
// REQUEST PARSING
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', async (req, res) => {
  const dbHealthy = await checkDatabaseConnection();
  
  if (dbHealthy) {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } else {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// ============================================
// API ROUTES
// ============================================

// Mount all routes under /api
app.use('/api', routes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      status: 404,
    },
  });
});

// Global error handler (must be last)
app.use(globalErrorHandler);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Verify database connection before starting
    const dbHealthy = await checkDatabaseConnection();
    
    if (!dbHealthy) {
      console.error('❌ Database connection failed. Cannot start server.');
      process.exit(1);
    }

    console.log('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Multi-Tenant SaaS Backend Running

📡 Server: http://localhost:${PORT}
🔑 API Base: http://localhost:${PORT}/api
💓 Health: http://localhost:${PORT}/health

🔒 Security:
  - Helmet headers enabled
  - CORS configured for ${corsOptions.origin}
  - Rate limiting active

🏢 Multi-Tenancy:
  - Tenant isolation enforced
  - RBAC permissions checked
  - Audit logging enabled

⚡️ Ready for requests!
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;
