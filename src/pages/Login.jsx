import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, User, KeyRound, AlertCircle } from 'lucide-react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check credentials (demo: admin/admin123 or any non-empty credentials)
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'demo' && password === 'demo') ||
            (username.trim() && password.trim())) {
            navigate('/hub');
        } else {
            setError('Invalid username or password');
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            color: '#f8fafc'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '48px 40px',
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '36px'
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                    }}>
                        <Lock size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.025em' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '0.95rem' }}>
                        Sign in to access EVERDIAN
                    </p>
                </div>

                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        color: '#fca5a5',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Username Field */}
                    <div>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '10px', 
                            fontSize: '0.9rem', 
                            color: '#94a3b8',
                            fontWeight: '500'
                        }}>
                            <User size={16} />
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '10px', 
                            fontSize: '0.9rem', 
                            color: '#94a3b8',
                            fontWeight: '500'
                        }}>
                            <KeyRound size={16} />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Remember me & Forgot password */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    accentColor: '#3b82f6',
                                    cursor: 'pointer'
                                }} 
                            />
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Remember me</span>
                        </label>
                        <a 
                            href="#" 
                            style={{ 
                                fontSize: '0.85rem', 
                                color: '#3b82f6', 
                                textDecoration: 'none' 
                            }}
                            onClick={(e) => e.preventDefault()}
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '14px',
                            background: isLoading 
                                ? 'rgba(59, 130, 246, 0.5)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.3)',
                            marginTop: '8px'
                        }}
                        onMouseDown={(e) => !isLoading && (e.target.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {isLoading ? (
                            <>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Demo credentials hint */}
                <div style={{
                    marginTop: '24px',
                    padding: '14px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.8rem', color: '#a78bfa', margin: 0 }}>
                        Demo: <strong>admin</strong> / <strong>admin123</strong>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Login;
