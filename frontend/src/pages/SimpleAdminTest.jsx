import React from 'react';
import { useAuth } from '../context/AuthContext';

const SimpleAdminTest = () => {
    const { user } = useAuth();

    console.log('🧪 SimpleAdminTest - User:', user);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>
                    Simple Admin Test Page
                </h1>

                <div style={{
                    backgroundColor: '#ddd6fe',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    <h2>User Information:</h2>
                    <pre style={{ fontSize: '14px', overflow: 'auto' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
                </div>

                <div>
                    <p><strong>User Name:</strong> {user?.name || 'Not logged in'}</p>
                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                    <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
                    <p><strong>Is Admin:</strong> {user?.role === 'admin' ? 'YES' : 'NO'}</p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: '#7c3aed',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleAdminTest;