export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Nunito', sans-serif",
      background: 'var(--cream)',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🗺️</div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '2.5rem',
        color: 'var(--maroon)',
        margin: '0 0 12px',
      }}>
        Lost on the road?
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '8px' }}>
        This page doesn&apos;t exist — but your next adventure does.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic', marginBottom: '32px' }}>
        రోమేయ్ — roam around freely
      </p>
      <a
        href="/"
        style={{
          background: 'var(--maroon)',
          color: 'var(--cream)',
          padding: '12px 28px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 700,
          fontSize: '1rem',
        }}
      >
        ← Back to Roamai
      </a>
    </div>
  );
}
