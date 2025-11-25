import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, LayoutDashboard, ArrowRight } from 'lucide-react';

function Hub() {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#f8fafc'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
                maxWidth: '900px',
                width: '100%',
                padding: '24px'
            }}>
                {/* Non Technical / Chatbot Card */}
                <div
                    onClick={() => navigate('/non-technical')}
                    style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        padding: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        group: 'card'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <Bot size={40} color="#3b82f6" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>Non Technical Platform</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
                        Interactive chatbot interface powered by AI. Visualize data through conversation.
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#3b82f6',
                        fontWeight: '600'
                    }}>
                        Launch Interface <ArrowRight size={18} />
                    </div>
                </div>

                {/* Power / Dashboard Card */}
                <div
                    onClick={() => navigate('/power')}
                    style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        padding: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <LayoutDashboard size={40} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>Power Platform</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
                        Full-featured dashboard with real-time analytics, global mapping, and detailed reports.
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#10b981',
                        fontWeight: '600'
                    }}>
                        Open Dashboard <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hub;
