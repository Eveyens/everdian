import React, { useState } from 'react';
import { Settings, Database, BarChart2, Layers, Filter, Download } from 'lucide-react';

const DataSelector = ({
    activeTab,
    setActiveTab,
    range,
    setRange,
    selectedDataset,
    setSelectedDataset
}) => {
    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Data Control Center</h2>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', padding: '8px 16px' }}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '8px' }}>
                {['Overview', 'Analytics', 'Sources', 'Settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        style={{
                            flex: 1,
                            background: activeTab === tab.toLowerCase() ? '#3b82f6' : 'transparent',
                            color: activeTab === tab.toLowerCase() ? 'white' : '#94a3b8',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Controls Container */}
            <div style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '12px',
                border: '1px solid #334155',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>

                {/* Dataset Selection */}
                <div>
                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                        <Database size={14} style={{ display: 'inline', marginRight: '8px' }} />
                        Active Dataset
                    </label>
                    <select
                        value={selectedDataset}
                        onChange={(e) => setSelectedDataset(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0f172a',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: 'white',
                            outline: 'none'
                        }}
                    >
                        <option value="Global Sales Q3 2024">Global Sales Q3 2024</option>
                        <option value="User Demographics v2.1">User Demographics v2.1</option>
                        <option value="Server Latency Logs">Server Latency Logs</option>
                        <option value="Inventory Distribution">Inventory Distribution</option>
                    </select>
                </div>

                {/* Range Slider */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                            <Filter size={14} style={{ display: 'inline', marginRight: '8px' }} />
                            Data Density
                        </label>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{range}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={range}
                        onChange={(e) => setRange(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#3b82f6' }}
                    />
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem' }}>Real-time Sync</span>
                        <div style={{ width: '40px', height: '20px', background: '#3b82f6', borderRadius: '10px', position: 'relative' }}>
                            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                        </div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem' }}>Auto-Aggregation</span>
                        <div style={{ width: '40px', height: '20px', background: '#475569', borderRadius: '10px', position: 'relative' }}>
                            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                        </div>
                    </div>
                </div>

                {/* Metrics Preview */}
                <div style={{ marginTop: 'auto' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                        <BarChart2 size={14} style={{ display: 'inline', marginRight: '8px' }} />
                        Quick Metrics
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>2.4M</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Records</div>
                        </div>
                        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>98%</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Uptime</div>
                        </div>
                        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>12ms</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Latency</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DataSelector;
