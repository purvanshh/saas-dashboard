'use client';

export default function DebugPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px' }}>
        SaaS Dashboard - Debug Page
      </h1>
      
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Environment Check</h2>
        <ul>
          <li>Next.js Version: 16.1.6</li>
          <li>React Version: 19.2.3</li>
          <li>Build Time: {new Date().toISOString()}</li>
          <li>Environment: {process.env.NODE_ENV}</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#ecfdf5', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #10b981'
      }}>
        <h2 style={{ color: '#059669' }}>✅ App is Working</h2>
        <p>If you can see this page, the Next.js application is deployed and running correctly.</p>
        <p>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            Go to Main Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}