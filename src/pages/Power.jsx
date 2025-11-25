import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsFeed from '../components/NewsFeed';
import DataSelector from '../components/DataSelector';
import WorldMap from '../components/WorldMap';
import { Layout, Menu, Bell, User, Bot } from 'lucide-react';

function Power() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [range, setRange] = useState(50);
    const [selectedDataset, setSelectedDataset] = useState('Global Sales Q3 2024');

    const markers = useMemo(() => {
        switch (selectedDataset) {
            case 'Global Sales Q3 2024':
                return [
                    { markerOffset: -15, name: "New York", coordinates: [-74.006, 40.7128], value: 80 },
                    { markerOffset: -15, name: "London", coordinates: [-0.1276, 51.5074], value: 60 },
                    { markerOffset: 25, name: "Tokyo", coordinates: [139.6917, 35.6895], value: 90 },
                    { markerOffset: 25, name: "Singapore", coordinates: [103.8198, 1.3521], value: 70 },
                    { markerOffset: -15, name: "Paris", coordinates: [2.3522, 48.8566], value: 50 },
                ];
            case 'User Demographics v2.1':
                return [
                    { markerOffset: -15, name: "San Francisco", coordinates: [-122.4194, 37.7749], value: 95 },
                    { markerOffset: -15, name: "Berlin", coordinates: [13.4050, 52.5200], value: 40 },
                    { markerOffset: 25, name: "Sydney", coordinates: [151.2093, -33.8688], value: 65 },
                    { markerOffset: 25, name: "Mumbai", coordinates: [72.8777, 19.0760], value: 85 },
                ];
            case 'Server Latency Logs':
                return [
                    { markerOffset: -15, name: "Virginia", coordinates: [-77.4565, 38.9586], value: 20 },
                    { markerOffset: -15, name: "Frankfurt", coordinates: [8.6821, 50.1109], value: 30 },
                    { markerOffset: 25, name: "Singapore", coordinates: [103.8198, 1.3521], value: 25 },
                ];
            default:
                return [
                    { markerOffset: -15, name: "New York", coordinates: [-74.006, 40.7128], value: 50 },
                    { markerOffset: -15, name: "London", coordinates: [-0.1276, 51.5074], value: 50 },
                ];
        }
    }, [selectedDataset]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            background: '#0f172a',
            color: '#f8fafc'
        }}>
            {/* Header */}
            <header style={{
                height: '60px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Layout size={18} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>
                        EVERDIAN<span style={{ color: '#3b82f6' }}>.DASH</span>
                    </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <nav style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', color: '#94a3b8' }}>
                        <span style={{ color: 'white', cursor: 'pointer' }}>Dashboard</span>
                        <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-white">Analytics</span>
                        <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-white">Reports</span>
                    </nav>
                    <div style={{ width: '1px', height: '24px', background: '#334155' }}></div>
                    <button
                        onClick={() => navigate('/non-technical')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Bot size={16} />
                        Non-Technical
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#334155' }}></div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Bell size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        <User size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <main style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '25fr 35fr 40fr',
                overflow: 'hidden'
            }}>
                {/* Left Column: Text Sections */}
                <section style={{
                    borderRight: '1px solid #334155',
                    background: 'rgba(15, 23, 42, 0.5)',
                    overflow: 'hidden'
                }}>
                    <NewsFeed />
                </section>

                {/* Middle Column: Data Selection */}
                <section style={{
                    borderRight: '1px solid #334155',
                    background: '#0f172a',
                    overflow: 'hidden'
                }}>
                    <DataSelector
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        range={range}
                        setRange={setRange}
                        selectedDataset={selectedDataset}
                        setSelectedDataset={setSelectedDataset}
                    />
                </section>

                {/* Right Column: World Map */}
                <section style={{
                    position: 'relative',
                    background: '#020617',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 10,
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #334155',
                        fontSize: '0.75rem',
                        color: '#94a3b8'
                    }}>
                        LIVE GLOBAL VIEW
                    </div>
                    <WorldMap markers={markers} density={range} />
                </section>
            </main>
        </div>
    );
}

export default Power;
