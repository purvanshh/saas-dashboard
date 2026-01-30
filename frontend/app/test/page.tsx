export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Test Page</h1>
      <p>If you can see this, the Next.js app is working correctly.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  );
}