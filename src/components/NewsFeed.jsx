import React from 'react';
import { Clock, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const NewsItem = ({ title, time, category, content }) => (
    <div style={{
        padding: '16px',
        borderBottom: '1px solid #334155',
        background: 'rgba(30, 41, 59, 0.3)',
        marginBottom: '1px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {time}
            </span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa' }}>{category}</span>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', color: '#f1f5f9' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>{content}</p>
    </div>
);

const NewsFeed = () => {
    return (
        <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #334155', position: 'sticky', top: 0, background: '#0f172a', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="#3b82f6" />
                    Intelligence Feed
                </h2>
            </div>

            <NewsItem
                title="Q3 Market Analysis Report Released"
                time="10:42 AM"
                category="Market Data"
                content="Global markets show resilience amidst fluctuating energy prices. The tech sector continues to lead with a 4.5% increase in aggregate value across major indices. Analysts suggest a bullish trend for the upcoming quarter."
            />
            <NewsItem
                title="Emerging Markets: Asia-Pacific Growth"
                time="09:15 AM"
                category="Regional"
                content="New trade agreements in the APAC region are expected to boost cross-border logistics by 15% year-over-year. Key players in Singapore and Tokyo are positioning for expanded operations."
            />
            <NewsItem
                title="Supply Chain Optimization Protocol"
                time="Yesterday"
                category="Logistics"
                content="Implementation of AI-driven routing has reduced delivery latencies by an average of 12% in the European sector. Further integration is planned for North American distribution centers."
            />
            <NewsItem
                title="Security Alert: Cyber Infrastructure"
                time="Yesterday"
                category="Security"
                content="Routine audits have identified potential vulnerabilities in legacy systems. A mandatory patch rollout is scheduled for 0200 UTC. All nodes are required to update to firmware v4.5.2."
            />
            <NewsItem
                title="Sustainable Energy Transition"
                time="2 days ago"
                category="Energy"
                content="Renewable energy adoption in manufacturing plants has reached a milestone of 40%. This shift is projected to reduce operational costs by 8% annually while meeting new environmental compliance standards."
            />
            <NewsItem
                title="Forex Volatility Index Update"
                time="2 days ago"
                category="Finance"
                content="The USD/EUR pair has seen increased volatility due to recent central bank announcements. Traders are advised to monitor support levels closely as liquidity shifts."
            />
            <NewsItem
                title="Corporate Merger Announcement"
                time="3 days ago"
                category="Business"
                content="Everdian Corp has officially acquired a majority stake in Nexus Logistics. This strategic move consolidates our position in the trans-atlantic shipping corridors."
            />
        </div>
    );
};

export default NewsFeed;
