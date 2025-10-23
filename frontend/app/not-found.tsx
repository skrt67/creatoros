'use client';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '16px' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Page introuvable
        </h2>
        <p style={{ marginBottom: '24px', color: '#666' }}>
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#6366f1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
