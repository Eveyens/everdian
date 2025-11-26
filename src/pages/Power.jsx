import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/WorldMap';
import { Layout, Bell, User, Bot, Clock, FileText, Filter, Download, Database, BarChart2, Search, X, Globe, MessageSquare, Tag, Calendar, RefreshCw, Trash2, Eye, EyeOff } from 'lucide-react';

// Import JSONL data
import rawData from '../../2025-10-25.jsonl?raw';

// Parse JSONL data
const parseJsonl = (data) => {
    return data
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 500) // Limit to 500 items for performance
        .map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return null;
            }
        })
        .filter(item => item !== null);
};

// NewsItem component for the feed
const NewsItem = ({ item, onSelect, isSelected, onHide }) => {
    const getNetworkColor = (network) => {
        switch (network) {
            case 'twitter': return '#1DA1F2';
            case 'news': return '#10b981';
            case 'facebook': return '#4267B2';
            case 'telegram': return '#0088cc';
            default: return '#94a3b8';
        }
    };

    const getCategoryLabel = (labels) => {
        if (!labels || labels.length === 0) return 'General';
        const mainCategory = labels.find(l => l.type === 'Main Categories');
        return mainCategory?.value || 'General';
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    const getLocation = (locations) => {
        if (!locations) return null;
        const loc = locations.mentions?.[0] || locations.inferred?.[0];
        return loc?.country || null;
    };

    return (
        <div
            onClick={() => onSelect(item)}
            style={{
                padding: '14px 16px',
                borderBottom: '1px solid #334155',
                background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
            }}
            onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            }}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(30, 41, 59, 0.3)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        background: getNetworkColor(item.network),
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        fontSize: '0.65rem'
                    }}>
                        {item.network}
                    </span>
                    <Clock size={12} /> {formatDate(item.publish_date)}
                </span>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa' }}>
                    {getCategoryLabel(item.labels_v2)}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}>@{item.user?.userName}</span>
                {item.user?.metrics?.[0] && (
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {item.user.metrics[0].metricCount.toLocaleString()} followers
                    </span>
                )}
            </div>
            <p style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                lineHeight: '1.5',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
            }}>
                {item.english_sentence || item.text}
            </p>
            {getLocation(item.locations) && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} /> {getLocation(item.locations)}
                </div>
            )}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onHide(item.id);
                    }}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#ef4444',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <EyeOff size={10} /> Hide
                </button>
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#3b82f6',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <Eye size={10} /> View
                </a>
            </div>
        </div>
    );
};

// Data Control Panel
const DataControlPanel = ({
    filters,
    setFilters,
    stats,
    onExport,
    onRefresh,
    onClearFilters
}) => {
    const networks = ['all', 'twitter', 'news', 'facebook', 'telegram'];
    const categories = ['all', 'Protest', 'Illicit / Illegal Action', 'Clash', 'Shooting', 'Hazard', 'Cyberattack', 'Other'];
    const languages = ['all', 'eng_Latn', 'spa_Latn', 'fra_Latn', 'por_Latn', 'deu_Latn'];

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Data Filters</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onRefresh}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10b981',
                            borderRadius: '6px',
                            color: '#10b981',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button
                        onClick={onExport}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '6px',
                            color: '#3b82f6',
                            cursor: 'pointer'
                        }}
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Search */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    <Search size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    Search Keywords
                </label>
                <input
                    type="text"
                    placeholder="Search in posts..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            {/* Network Filter */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    <Globe size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    Network
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {networks.map(network => (
                        <button
                            key={network}
                            onClick={() => setFilters({ ...filters, network })}
                            style={{
                                padding: '8px 14px',
                                background: filters.network === network ? '#3b82f6' : '#1e293b',
                                border: filters.network === network ? '1px solid #3b82f6' : '1px solid #475569',
                                borderRadius: '6px',
                                color: filters.network === network ? 'white' : '#94a3b8',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s'
                            }}
                        >
                            {network}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    <Tag size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    Category
                </label>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                </select>
            </div>

            {/* Language Filter */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    <MessageSquare size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    Language
                </label>
                <select
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    <option value="all">All Languages</option>
                    <option value="eng_Latn">English</option>
                    <option value="spa_Latn">Spanish</option>
                    <option value="fra_Latn">French</option>
                    <option value="por_Latn">Portuguese</option>
                    <option value="deu_Latn">German</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={onClearFilters}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <X size={16} /> Clear All Filters
            </button>

            {/* Stats */}
            <div style={{ marginTop: 'auto' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    <BarChart2 size={14} style={{ display: 'inline', marginRight: '8px' }} />
                    Live Statistics
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Posts</div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#10b981' }}>{stats.filtered.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Filtered</div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.withLocation}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>With Location</div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.hidden}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hidden</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Power() {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [hiddenIds, setHiddenIds] = useState(new Set());
    const [selectedItem, setSelectedItem] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        network: 'all',
        category: 'all',
        language: 'all'
    });

    // Load data on mount
    useEffect(() => {
        const data = parseJsonl(rawData);
        setAllData(data);
    }, []);

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            // Hidden filter
            if (hiddenIds.has(item.id)) return false;

            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const text = (item.text || '').toLowerCase();
                const englishText = (item.english_sentence || '').toLowerCase();
                if (!text.includes(searchLower) && !englishText.includes(searchLower)) {
                    return false;
                }
            }

            // Network filter
            if (filters.network !== 'all' && item.network !== filters.network) {
                return false;
            }

            // Category filter
            if (filters.category !== 'all') {
                const hasCategory = item.labels_v2?.some(
                    l => l.type === 'Main Categories' && l.value === filters.category
                );
                if (!hasCategory) return false;
            }

            // Language filter
            if (filters.language !== 'all' && item.lang !== filters.language) {
                return false;
            }

            return true;
        });
    }, [allData, filters, hiddenIds]);

    // Generate markers from filtered data
    const markers = useMemo(() => {
        const markerMap = new Map();

        filteredData.forEach(item => {
            const loc = item.locations?.mentions?.[0] || item.locations?.inferred?.[0];
            if (loc && loc.coordinates) {
                const key = `${loc.coordinates[0]},${loc.coordinates[1]}`;
                if (!markerMap.has(key)) {
                    markerMap.set(key, {
                        name: loc.name || loc.country || 'Unknown',
                        coordinates: loc.coordinates,
                        markerOffset: -15,
                        value: 1,
                        items: [item]
                    });
                } else {
                    const existing = markerMap.get(key);
                    existing.value += 1;
                    existing.items.push(item);
                }
            }
        });

        return Array.from(markerMap.values()).map(m => ({
            ...m,
            name: `${m.name} (${m.value} posts)`
        }));
    }, [filteredData]);

    // Stats
    const stats = useMemo(() => ({
        total: allData.length,
        filtered: filteredData.length,
        withLocation: filteredData.filter(item =>
            item.locations?.mentions?.[0] || item.locations?.inferred?.[0]
        ).length,
        hidden: hiddenIds.size
    }), [allData, filteredData, hiddenIds]);

    const handleHide = (id) => {
        setHiddenIds(prev => new Set([...prev, id]));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filtered_data.json';
        a.click();
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            network: 'all',
            category: 'all',
            language: 'all'
        });
        setHiddenIds(new Set());
    };

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
                        EVERDIAN<span style={{ color: '#3b82f6' }}>.POWER</span>
                    </h1>
                    <span style={{
                        background: '#ef4444',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        marginLeft: '8px'
                    }}>
                        LIVE DATA
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <nav style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', color: '#94a3b8' }}>
                        <span style={{ color: 'white', cursor: 'pointer' }}>Dashboard</span>
                        <span style={{ cursor: 'pointer' }}>Analytics</span>
                        <span style={{ cursor: 'pointer' }}>Reports</span>
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
                gridTemplateColumns: '30fr 30fr 40fr',
                overflow: 'hidden'
            }}>
                {/* Left Column: Feed */}
                <section style={{
                    borderRight: '1px solid #334155',
                    background: 'rgba(15, 23, 42, 0.5)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid #334155',
                        background: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <FileText size={20} color="#3b82f6" />
                            Live Feed
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {filteredData.length} posts
                        </span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredData.slice(0, 100).map(item => (
                            <NewsItem
                                key={item.id}
                                item={item}
                                onSelect={setSelectedItem}
                                isSelected={selectedItem?.id === item.id}
                                onHide={handleHide}
                            />
                        ))}
                        {filteredData.length === 0 && (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#64748b'
                            }}>
                                <Filter size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p>No posts match your filters</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Middle Column: Filters */}
                <section style={{
                    borderRight: '1px solid #334155',
                    background: '#0f172a',
                    overflow: 'hidden'
                }}>
                    <DataControlPanel
                        filters={filters}
                        setFilters={setFilters}
                        stats={stats}
                        onExport={handleExport}
                        onRefresh={() => {
                            const data = parseJsonl(rawData);
                            setAllData(data);
                        }}
                        onClearFilters={handleClearFilters}
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
                        LIVE GLOBAL VIEW • {markers.length} locations
                    </div>
                    <WorldMap markers={markers} density={80} />
                </section>
            </main>
        </div>
    );
}

export default Power;
