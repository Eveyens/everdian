import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/WorldMap';
import { Layout, Bell, User, Bot, Clock, FileText, Filter, Download, Database, BarChart2, Search, X, Globe, MessageSquare, Tag, Calendar, RefreshCw, Trash2, Eye, EyeOff, TrendingUp, PieChart, Activity, FileBarChart, AlertTriangle, Users, MapPin, Zap, Shield, Target, Layers, Radio, Crosshair, ChevronRight, ArrowUpRight, ArrowDownRight, Minus, Hash, Flame, BookOpen, Send, Printer, Mail, Share2 } from 'lucide-react';

// Supabase configuration (public anon key – safe for frontend)
const SUPABASE_URL = 'https://jgfrctmtakpamojfymer.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZnJjdG10YWtwYW1vamZ5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTI4NzMsImV4cCI6MjA3OTU4ODg3M30.nGiV5X4joVojCqFLKFSAPAar_x_GY8APXFSXjVbENSI';

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

// ============================================
// ENHANCED ANALYTICS SECTION - Command Center Style
// ============================================
const AnalyticsSection = ({ data }) => {
    const [selectedMetric, setSelectedMetric] = useState('overview');
    const [animatedValues, setAnimatedValues] = useState({});

    const analytics = useMemo(() => {
        const networkCounts = {};
        const categoryCounts = {};
        const languageCounts = {};
        const countryCounts = {};
        const sentimentScores = { positive: 0, negative: 0, neutral: 0 };
        
        data.forEach(item => {
            const network = item.network || 'unknown';
            networkCounts[network] = (networkCounts[network] || 0) + 1;
            
            const category = item.labels_v2?.find(l => l.type === 'Main Categories')?.value || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            
            const lang = item.lang || 'unknown';
            languageCounts[lang] = (languageCounts[lang] || 0) + 1;
            
            const country = item.locations?.mentions?.[0]?.country || item.locations?.inferred?.[0]?.country;
            if (country) {
                countryCounts[country] = (countryCounts[country] || 0) + 1;
            }

            // Simulate sentiment based on categories
            const threatCats = ['Shooting', 'Clash', 'Hazard', 'Cyberattack'];
            if (item.labels_v2?.some(l => threatCats.includes(l.value))) {
                sentimentScores.negative++;
            } else if (category === 'Other') {
                sentimentScores.neutral++;
            } else {
                sentimentScores.positive++;
            }
        });

        const threatCategories = ['Shooting', 'Clash', 'Protest', 'Illicit / Illegal Action', 'Cyberattack', 'Hazard'];
        const threatCount = data.filter(d => 
            d.labels_v2?.some(l => l.type === 'Main Categories' && threatCategories.includes(l.value))
        ).length;

        return {
            networkCounts,
            categoryCounts,
            languageCounts,
            countryCounts,
            sentimentScores,
            totalPosts: data.length,
            threatCount,
            postsWithMedia: data.filter(d => (d.images?.length > 0) || (d.videos?.length > 0)).length,
            postsWithLocation: data.filter(d => d.locations?.mentions?.[0] || d.locations?.inferred?.[0]).length,
            avgEngagement: Math.round(data.reduce((acc, d) => acc + (d.user?.metrics?.[0]?.metricCount || 0), 0) / (data.length || 1))
        };
    }, [data]);

    useEffect(() => {
        // Animate values on load
        const timer = setTimeout(() => {
            setAnimatedValues({
                total: analytics.totalPosts,
                threats: analytics.threatCount,
                locations: analytics.postsWithLocation
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [analytics]);

    const getLanguageName = (code) => {
        const names = {
            'eng_Latn': 'English', 'spa_Latn': 'Spanish', 'fra_Latn': 'French',
            'por_Latn': 'Portuguese', 'deu_Latn': 'German', 'ara_Arab': 'Arabic',
            'zho_Hans': 'Chinese', 'jpn_Jpan': 'Japanese'
        };
        return names[code] || code;
    };

    const threatLevel = analytics.threatCount / (analytics.totalPosts || 1);
    const threatStatus = threatLevel > 0.3 ? 'HIGH' : threatLevel > 0.15 ? 'MEDIUM' : 'LOW';
    const threatColor = threatLevel > 0.3 ? '#ef4444' : threatLevel > 0.15 ? '#f59e0b' : '#10b981';

    return (
        <div style={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
            display: 'grid',
            gridTemplateColumns: '280px 1fr 320px',
            gap: '1px',
            overflow: 'hidden'
        }}>
            {/* Left Sidebar - Metrics Selection */}
            <div style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                borderRight: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '40px', height: '40px', 
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Activity size={22} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Analytics</h2>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>COMMAND CENTER</span>
                        </div>
                    </div>
                </div>

                {/* Metric Buttons */}
                {[
                    { id: 'overview', icon: Layers, label: 'Overview', color: '#8b5cf6' },
                    { id: 'networks', icon: Globe, label: 'Networks', color: '#3b82f6' },
                    { id: 'threats', icon: Shield, label: 'Threat Intel', color: '#ef4444' },
                    { id: 'geographic', icon: MapPin, label: 'Geographic', color: '#10b981' },
                    { id: 'temporal', icon: Clock, label: 'Temporal', color: '#f59e0b' },
                    { id: 'engagement', icon: Users, label: 'Engagement', color: '#ec4899' }
                ].map(({ id, icon: Icon, label, color }) => (
                    <button
                        key={id}
                        onClick={() => setSelectedMetric(id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            background: selectedMetric === id 
                                ? `linear-gradient(90deg, ${color}20, transparent)`
                                : 'transparent',
                            border: 'none',
                            borderLeft: selectedMetric === id ? `3px solid ${color}` : '3px solid transparent',
                            borderRadius: '0 8px 8px 0',
                            color: selectedMetric === id ? '#f8fafc' : '#94a3b8',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                        }}
                    >
                        <Icon size={18} color={selectedMetric === id ? color : '#64748b'} />
                        <span style={{ fontSize: '0.9rem', fontWeight: selectedMetric === id ? '600' : '400' }}>{label}</span>
                        {selectedMetric === id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                    </button>
                ))}

                {/* Quick Stats at Bottom */}
                <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        System Status
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Data Feed Active</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: threatColor, borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Threat Level: {threatStatus}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ 
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '24px',
                overflowY: 'auto'
            }}>
                {/* Hero Stats Row */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {[
                        { label: 'Total Signals', value: analytics.totalPosts, icon: Radio, color: '#8b5cf6', trend: '+12%' },
                        { label: 'Threat Alerts', value: analytics.threatCount, icon: AlertTriangle, color: '#ef4444', trend: '-5%' },
                        { label: 'Geo-Tagged', value: analytics.postsWithLocation, icon: Target, color: '#10b981', trend: '+8%' },
                        { label: 'Media Content', value: analytics.postsWithMedia, icon: Layers, color: '#f59e0b', trend: '+3%' }
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                            borderRadius: '16px',
                            padding: '20px',
                            border: `1px solid ${stat.color}30`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                                borderRadius: '50%'
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <stat.icon size={20} color={stat.color} />
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                }}>
                                    {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.trend}
                                </span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                                {stat.value.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Bottom Grid - Categories & Networks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Category Distribution */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Tag size={18} color="#f59e0b" />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Category Distribution</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(analytics.categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([category, count]) => {
                                const percentage = (count / analytics.totalPosts) * 100;
                                const isThreat = ['Shooting', 'Clash', 'Hazard', 'Cyberattack'].includes(category);
                                return (
                                    <div key={category}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '0.8rem', color: isThreat ? '#fca5a5' : '#f8fafc' }}>{category}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                height: '100%', 
                                                width: `${percentage}%`, 
                                                background: isThreat 
                                                    ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                                                borderRadius: '3px',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Network Sources */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Globe size={18} color="#3b82f6" />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Network Sources</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {Object.entries(analytics.networkCounts).sort((a, b) => b[1] - a[1]).map(([network, count]) => {
                                const colors = {
                                    twitter: { bg: '#1DA1F220', border: '#1DA1F2', text: '#1DA1F2' },
                                    news: { bg: '#10b98120', border: '#10b981', text: '#10b981' },
                                    facebook: { bg: '#4267B220', border: '#4267B2', text: '#4267B2' },
                                    telegram: { bg: '#0088cc20', border: '#0088cc', text: '#0088cc' }
                                };
                                const style = colors[network] || { bg: '#64748b20', border: '#64748b', text: '#64748b' };
                                return (
                                    <div key={network} style={{
                                        background: style.bg,
                                        border: `1px solid ${style.border}`,
                                        borderRadius: '10px',
                                        padding: '14px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: style.text }}>{count}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>{network}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Live Intel */}
            <div style={{ 
                background: 'rgba(15, 23, 42, 0.9)',
                borderLeft: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Flame size={20} color="#ef4444" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>Live Intel Feed</h3>
                </div>

                {/* Threat Gauge */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${threatColor}40`
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Threat Assessment
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `conic-gradient(${threatColor} ${threatLevel * 360}deg, #1e293b 0deg)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#0f172a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: threatColor
                            }}>
                                {Math.round(threatLevel * 100)}%
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: threatColor }}>{threatStatus}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{analytics.threatCount} threat signals</div>
                        </div>
                    </div>
                </div>

                {/* Top Countries */}
                <div style={{ 
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <MapPin size={16} color="#10b981" />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Top Locations</span>
                    </div>
                    {Object.entries(analytics.countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([country, count], idx) => (
                        <div key={country} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            padding: '8px 0',
                            borderBottom: idx < 4 ? '1px solid #334155' : 'none'
                        }}>
                            <span style={{ 
                                width: '20px', 
                                height: '20px', 
                                background: `hsl(${160 - idx * 30}, 70%, 45%)`,
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>{idx + 1}</span>
                            <span style={{ flex: 1, fontSize: '0.8rem', color: '#f8fafc' }}>{country}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Languages */}
                <div style={{ 
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <MessageSquare size={16} color="#8b5cf6" />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Languages</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {Object.entries(analytics.languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([lang, count]) => (
                            <span key={lang} style={{
                                background: '#1e293b',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                color: '#cbd5e1'
                            }}>
                                {getLanguageName(lang)} ({count})
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// ENHANCED REPORTS SECTION - Document Center Style
// ============================================
const ReportsSection = ({ data, onExport }) => {
    const [selectedReportType, setSelectedReportType] = useState('executive');
    const [dateRange, setDateRange] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedReports, setGeneratedReports] = useState([]);

    const reportData = useMemo(() => {
        const now = new Date();
        let filteredByDate = data;

        if (dateRange === 'today') {
            filteredByDate = data.filter(d => {
                const date = new Date(d.publish_date);
                return date.toDateString() === now.toDateString();
            });
        } else if (dateRange === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredByDate = data.filter(d => new Date(d.publish_date) >= weekAgo);
        }

        const threatCategories = ['Shooting', 'Clash', 'Protest', 'Illicit / Illegal Action', 'Cyberattack', 'Hazard'];
        const threatPosts = filteredByDate.filter(d => 
            d.labels_v2?.some(l => l.type === 'Main Categories' && threatCategories.includes(l.value))
        );

        const highEngagement = filteredByDate
            .filter(d => d.user?.metrics?.[0]?.metricCount > 10000)
            .slice(0, 10);

        const byCountry = {};
        const byNetwork = {};
        filteredByDate.forEach(d => {
            const country = d.locations?.mentions?.[0]?.country || d.locations?.inferred?.[0]?.country || 'Unknown';
            if (!byCountry[country]) byCountry[country] = [];
            byCountry[country].push(d);

            const network = d.network || 'unknown';
            if (!byNetwork[network]) byNetwork[network] = [];
            byNetwork[network].push(d);
        });

        return {
            total: filteredByDate.length,
            threats: threatPosts.length,
            threatPosts: threatPosts.slice(0, 20),
            highEngagement,
            byCountry,
            byNetwork,
            dateRange: dateRange === 'all' ? 'All Time' : dateRange === 'today' ? 'Today' : 'Last 7 Days'
        };
    }, [data, dateRange]);

    const handleGenerateReport = async (type) => {
        setIsGenerating(true);
        
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const timestamp = new Date().toISOString();
        let reportContent = '';

        if (type === 'executive') {
            reportContent = `
════════════════════════════════════════════════════════════════
                    EVERDIAN INTELLIGENCE REPORT
                       EXECUTIVE SUMMARY
════════════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
Period: ${reportData.dateRange}
Classification: INTERNAL USE ONLY
────────────────────────────────────────────────────────────────

1. OVERVIEW
═══════════════════════════════════════════════════════════════
   Total Signals Analyzed:     ${reportData.total.toLocaleString()}
   Threat-Related Signals:     ${reportData.threats.toLocaleString()}
   High-Engagement Content:    ${reportData.highEngagement.length}
   Geographic Coverage:        ${Object.keys(reportData.byCountry).length} countries

2. NETWORK DISTRIBUTION
═══════════════════════════════════════════════════════════════
${Object.entries(reportData.byNetwork)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([network, posts]) => `   ${network.toUpperCase().padEnd(15)} ${posts.length.toString().padStart(6)} signals`)
    .join('\n')}

3. GEOGRAPHIC HOTSPOTS
═══════════════════════════════════════════════════════════════
${Object.entries(reportData.byCountry)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .map(([country, posts], idx) => `   ${(idx + 1).toString().padStart(2)}. ${country.padEnd(25)} ${posts.length} signals`)
    .join('\n')}

4. THREAT ASSESSMENT
═══════════════════════════════════════════════════════════════
   Threat Level: ${reportData.threats / reportData.total > 0.3 ? 'HIGH' : reportData.threats / reportData.total > 0.15 ? 'MEDIUM' : 'LOW'}
   Threat Ratio: ${((reportData.threats / reportData.total) * 100).toFixed(1)}% of total signals

════════════════════════════════════════════════════════════════
                         END OF REPORT
════════════════════════════════════════════════════════════════
            `;
        } else if (type === 'threat') {
            reportContent = `
╔══════════════════════════════════════════════════════════════╗
║           EVERDIAN THREAT INTELLIGENCE REPORT                ║
╚══════════════════════════════════════════════════════════════╝

Generated: ${new Date().toLocaleString()}
Classification: CONFIDENTIAL

══════════════════════════════════════════════════════════════
THREAT SUMMARY
══════════════════════════════════════════════════════════════
Total Threat Signals: ${reportData.threats}
Threat Categories: Shooting, Clash, Protest, Cyberattack, Hazard

══════════════════════════════════════════════════════════════
DETAILED THREAT SIGNALS
══════════════════════════════════════════════════════════════
${reportData.threatPosts.slice(0, 15).map((post, idx) => `
┌─────────────────────────────────────────────────────────────
│ SIGNAL #${(idx + 1).toString().padStart(3, '0')}
├─────────────────────────────────────────────────────────────
│ Category: ${post.labels_v2?.find(l => l.type === 'Main Categories')?.value || 'Unknown'}
│ Source:   ${post.network} / @${post.user?.userName || 'unknown'}
│ Location: ${post.locations?.mentions?.[0]?.country || post.locations?.inferred?.[0]?.country || 'Unknown'}
│ Time:     ${post.publish_date ? new Date(post.publish_date).toLocaleString() : 'Unknown'}
│ 
│ Content:
│ ${(post.english_sentence || post.text || '').substring(0, 300).split('\n').join('\n│ ')}...
│ 
│ URL: ${post.url || 'N/A'}
└─────────────────────────────────────────────────────────────
`).join('\n')}

══════════════════════════════════════════════════════════════
                    END OF THREAT REPORT
══════════════════════════════════════════════════════════════
            `;
        } else if (type === 'geographic') {
            reportContent = `
EVERDIAN GEOGRAPHIC ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════════════════

REGIONAL DISTRIBUTION
${Object.entries(reportData.byCountry)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([country, posts]) => {
        const bar = '█'.repeat(Math.round((posts.length / reportData.total) * 50));
        return `${country.padEnd(25)} ${bar} ${posts.length}`;
    })
    .join('\n')}

═══════════════════════════════════════════════════════════════
            `;
        }

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `everdian_${type}_report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();

        setGeneratedReports(prev => [{
            id: Date.now(),
            type,
            date: new Date().toLocaleString(),
            records: reportData.total
        }, ...prev].slice(0, 5));

        setIsGenerating(false);
    };

    const reportTypes = [
        { id: 'executive', icon: FileText, label: 'Executive Summary', desc: 'High-level overview for leadership', color: '#3b82f6' },
        { id: 'threat', icon: Shield, label: 'Threat Intelligence', desc: 'Detailed security threat analysis', color: '#ef4444' },
        { id: 'geographic', icon: MapPin, label: 'Geographic Analysis', desc: 'Regional distribution breakdown', color: '#10b981' },
        { id: 'network', icon: Globe, label: 'Network Analysis', desc: 'Source and platform metrics', color: '#8b5cf6' }
    ];

    return (
        <div style={{ 
            height: '100%', 
            background: 'linear-gradient(180deg, #0c0a1d 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            overflow: 'hidden'
        }}>
            {/* Main Report Builder */}
            <div style={{ 
                padding: '32px',
                overflowY: 'auto',
                borderRight: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <BookOpen size={24} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>
                                Report Center
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                                Generate comprehensive intelligence reports
                            </p>
                        </div>
                    </div>
                </div>

                {/* Report Type Selection */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Select Report Type
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {reportTypes.map(({ id, icon: Icon, label, desc, color }) => (
                            <button
                                key={id}
                                onClick={() => setSelectedReportType(id)}
                                style={{
                                    background: selectedReportType === id 
                                        ? `linear-gradient(135deg, ${color}20, ${color}10)`
                                        : 'rgba(30, 41, 59, 0.5)',
                                    border: selectedReportType === id 
                                        ? `2px solid ${color}`
                                        : '2px solid transparent',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    background: `${color}20`,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '14px'
                                }}>
                                    <Icon size={22} color={color} />
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>{label}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range Selection */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Time Period
                    </h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                            { id: 'all', label: 'All Time' },
                            { id: 'week', label: 'Last 7 Days' },
                            { id: 'today', label: 'Today' }
                        ].map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setDateRange(id)}
                                style={{
                                    padding: '14px 28px',
                                    background: dateRange === id ? '#8b5cf6' : 'rgba(30, 41, 59, 0.5)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: dateRange === id ? 'white' : '#94a3b8',
                                    fontSize: '0.9rem',
                                    fontWeight: dateRange === id ? '600' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Report Preview Stats */}
                <div style={{ 
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '20px', color: '#94a3b8' }}>
                        Report Preview
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {[
                            { label: 'Total Records', value: reportData.total, icon: Hash },
                            { label: 'Threat Signals', value: reportData.threats, icon: AlertTriangle },
                            { label: 'Countries', value: Object.keys(reportData.byCountry).length, icon: MapPin },
                            { label: 'High Engagement', value: reportData.highEngagement.length, icon: TrendingUp }
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <Icon size={20} color="#8b5cf6" style={{ marginBottom: '8px' }} />
                                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f8fafc' }}>{value}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={() => handleGenerateReport(selectedReportType)}
                    disabled={isGenerating}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: isGenerating 
                            ? 'rgba(139, 92, 246, 0.3)'
                            : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                        border: 'none',
                        borderRadius: '14px',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: isGenerating ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s',
                        boxShadow: isGenerating ? 'none' : '0 8px 32px rgba(139, 92, 246, 0.3)'
                    }}
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            Generate & Download Report
                        </>
                    )}
                </button>

                {/* Export Options */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                        onClick={onExport}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'transparent',
                            border: '1px solid #475569',
                            borderRadius: '10px',
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Database size={16} />
                        Export JSON
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'transparent',
                            border: '1px solid #475569',
                            borderRadius: '10px',
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Mail size={16} />
                        Email Report
                    </button>
                </div>
            </div>

            {/* Right Sidebar - Recent Reports & Threats */}
            <div style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                {/* Recent Reports */}
                <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Recent Reports
                    </h3>
                    {generatedReports.length === 0 ? (
                        <div style={{ 
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            color: '#64748b'
                        }}>
                            <FileBarChart size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>No reports generated yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {generatedReports.map(report => (
                                <div key={report.id} style={{
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    borderRadius: '10px',
                                    padding: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: '#8b5cf620',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FileText size={18} color="#8b5cf6" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', textTransform: 'capitalize' }}>
                                            {report.type} Report
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {report.records} records • {report.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Threat Highlights */}
                <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} color="#ef4444" />
                        Threat Highlights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reportData.threatPosts.slice(0, 4).map((post, idx) => (
                            <div key={post.id || idx} style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '10px',
                                padding: '14px',
                                borderLeft: '3px solid #ef4444'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ 
                                        fontSize: '0.65rem', 
                                        background: '#ef4444', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px',
                                        fontWeight: '600'
                                    }}>
                                        {post.labels_v2?.find(l => l.type === 'Main Categories')?.value || 'THREAT'}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                        {post.locations?.mentions?.[0]?.country || 'Unknown'}
                                    </span>
                                </div>
                                <p style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#cbd5e1', 
                                    margin: 0,
                                    lineHeight: '1.4',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {post.english_sentence || post.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1))',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px', color: '#f8fafc' }}>
                        Data Summary
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Time Period</span>
                            <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: '600' }}>{reportData.dateRange}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Signals</span>
                            <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: '600' }}>{reportData.total}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Threat Ratio</span>
                            <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '600' }}>
                                {((reportData.threats / reportData.total) * 100).toFixed(1)}%
                            </span>
                        </div>
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
    const [activeView, setActiveView] = useState('dashboard');
    const [filters, setFilters] = useState({
        search: '',
        network: 'all',
        category: 'all',
        language: 'all'
    });

    const loadDataFromSupabase = useCallback(async () => {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/contents_clean?select=id,content,metadata&limit=500`, {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
            }

            const rows = await response.json();

            const mapped = rows.map((row) => {
                const meta = row.metadata || {};
                return {
                    id: row.id,
                    text: row.content,
                    english_sentence: meta.english_sentence || row.content,
                    lang: meta.lang,
                    labels_v2: meta.labels_v2,
                    publish_date: meta.publish_date,
                    locations: meta.locations,
                    images: meta.images || [],
                    videos: meta.videos || [],
                    url: meta.url,
                    user: meta.user,
                    network: meta.network,
                };
            });

            setAllData(mapped);
        } catch (error) {
            console.error('Error loading data from Supabase:', error);
        }
    }, []);

    useEffect(() => {
        loadDataFromSupabase();
    }, [loadDataFromSupabase]);

    const filteredData = useMemo(() => {
        return allData.filter(item => {
            if (hiddenIds.has(item.id)) return false;

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const text = (item.text || '').toLowerCase();
                const englishText = (item.english_sentence || '').toLowerCase();
                if (!text.includes(searchLower) && !englishText.includes(searchLower)) {
                    return false;
                }
            }

            if (filters.network !== 'all' && item.network !== filters.network) {
                return false;
            }

            if (filters.category !== 'all') {
                const hasCategory = item.labels_v2?.some(
                    l => l.type === 'Main Categories' && l.value === filters.category
                );
                if (!hasCategory) return false;
            }

            if (filters.language !== 'all' && item.lang !== filters.language) {
                return false;
            }

            return true;
        });
    }, [allData, filters, hiddenIds]);

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

    const renderMainContent = () => {
        if (activeView === 'analytics') {
            return (
                <main style={{ flex: 1, overflow: 'hidden' }}>
                    <AnalyticsSection data={filteredData} />
                </main>
            );
        }

        if (activeView === 'reports') {
            return (
                <main style={{ flex: 1, overflow: 'hidden' }}>
                    <ReportsSection data={filteredData} onExport={handleExport} />
                </main>
            );
        }

        return (
            <main style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '30fr 30fr 40fr',
                overflow: 'hidden'
            }}>
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
                        onRefresh={loadDataFromSupabase}
                        onClearFilters={handleClearFilters}
                    />
                </section>

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
        );
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
                    <nav style={{ display: 'flex', gap: '8px', fontSize: '0.875rem' }}>
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: Layout },
                            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                            { id: 'reports', label: 'Reports', icon: FileBarChart }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveView(id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: activeView === id ? '#3b82f6' : 'transparent',
                                    border: activeView === id ? '1px solid #3b82f6' : '1px solid transparent',
                                    borderRadius: '6px',
                                    color: activeView === id ? 'white' : '#94a3b8',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: activeView === id ? '600' : '400'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeView !== id) {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                        e.currentTarget.style.color = '#f8fafc';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeView !== id) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }
                                }}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
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

            {renderMainContent()}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Power;
