import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Clock, Newspaper, BarChart2, FileText, Map as MapIcon, Table as TableIcon, Image as ImageIcon, Download, LayoutDashboard } from 'lucide-react';
import WorldMap from '../components/WorldMap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// --- JSON STRUCTURE DOCUMENTATION ---
/*
WEBHOOK REQUEST FORMAT:
{
  "message": "User's question or request",
  "format": "text" | "table" | "map" | "graphic" | "rapport",
  "conversationID": "unique-conversation-id"
}

WEBHOOK RESPONSE FORMATS (Standardized JSON):

1. GRAPHIC (Chart.js) - format: "graphic"
{
  "type": "graphic",
  "chartType": "bar" | "line" | "pie" | "doughnut",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      {
        "label": "Sales",
        "data": [12, 19, 3],
        "backgroundColor": ["rgba(255, 99, 132, 0.2)"],
        "borderColor": ["rgba(255, 99, 132, 1)"],
        "borderWidth": 1
      }
    ]
  },
  "options": { ... } // Optional Chart.js options
}

OR alternative format:
{
  "chartData": {
    "type": "bar" | "line" | "pie" | "doughnut",
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [...]
  }
}

2. MAP (World Map) - format: "map"
{
  "type": "map",
  "markers": [
    { "name": "New York", "coordinates": [-74.006, 40.7128], "value": 100 },
    { "name": "London", "coordinates": [-0.1276, 51.5074], "value": 50 }
  ]
}

OR alternative format:
{
  "mapData": {
    "markers": [
      { "title": "New York", "coordinates": [-74.006, 40.7128], "value": 100 }
    ]
  }
}

3. TABLE - format: "table"
{
  "type": "table",
  "columns": ["Name", "Role", "Status"],
  "rows": [
    ["Alice", "Admin", "Active"],
    ["Bob", "User", "Inactive"]
  ]
}

OR alternative format:
{
  "tableData": {
    "headers": ["Name", "Role", "Status"],
    "rows": [
      ["Alice", "Admin", "Active"],
      ["Bob", "User", "Inactive"]
    ]
  }
}

4. TEXT / REPORT - format: "text" | "rapport"
{
  "type": "text" | "rapport",
  "content": "## Monthly Report\n\nThis is the detailed report content..."
}

OR alternative format:
{
  "content": "Simple text response..."
}
*/

// Enhanced Wrapper Component for visualizations
const EnhancedWrapper = ({ children, onDownload, downloadFilename, downloadData, downloadType = 'json' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
            return;
        }

        if (downloadType === 'png') {
            // For charts, find the canvas element within this wrapper
            setTimeout(() => {
                const wrapper = document.activeElement?.closest('div[style*="background"]') || 
                               document.querySelector('div[style*="linear-gradient(135deg"]');
                const canvas = wrapper?.querySelector('canvas');
                if (canvas) {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = downloadFilename || `chart-${new Date().toISOString().split('T')[0]}.png`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }
                    });
                } else {
                    // Fallback to JSON if canvas not found
                    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = downloadFilename || `chart-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            }, 100);
            return;
        }

        let blob, filename;
        
        if (downloadType === 'json') {
            blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
            filename = downloadFilename || `data-${new Date().toISOString().split('T')[0]}.json`;
        } else if (downloadType === 'csv') {
            // Convert table data to CSV
            const csv = convertToCSV(downloadData);
            blob = new Blob([csv], { type: 'text/csv' });
            filename = downloadFilename || `table-${new Date().toISOString().split('T')[0]}.csv`;
        }

        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const convertToCSV = (data) => {
        if (!data || !data.headers || !data.rows) return '';
        const headers = data.headers.join(',');
        const rows = data.rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        return `${headers}\n${rows}`;
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '12px',
                border: '1px solid #334155',
                padding: '20px',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isHovered 
                    ? '0 10px 30px rgba(59, 130, 246, 0.2)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                borderColor: isHovered ? '#3b82f6' : '#334155'
            }}
        >
            {/* Download Button */}
            <button
                onClick={handleDownload}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: isHovered ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    fontWeight: '500',
                    zIndex: 10
                }}
            >
                <Download size={14} />
                Télécharger
            </button>

            {/* Content */}
            <div style={{
                paddingRight: '100px', // Space for download button
            }}>
                {children}
            </div>

            {/* Decorative border */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px 0 0 12px'
            }} />
        </div>
    );
};

// Chart Renderer Component
const ChartRenderer = ({ chartData }) => {
    if (!chartData) return null;

    const { type, labels, datasets, options: customOptions } = chartData;

    const data = {
        labels: labels || [],
        datasets: datasets || []
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#94a3b8' } },
            title: { display: false },
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        },
        ...customOptions
    };

    const style = { height: '300px', width: '100%' };

    const chartComponent = (() => {
        switch (type?.toLowerCase()) {
            case 'line': return <Line data={data} options={options} />;
            case 'pie': return <Pie data={data} options={options} />;
            case 'doughnut': return <Doughnut data={data} options={options} />;
            case 'bar':
            default: return <Bar data={data} options={options} />;
        }
    })();

    const handleChartDownload = () => {
        // Try to download as PNG first
        setTimeout(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `chart-${type || 'bar'}-${new Date().toISOString().split('T')[0]}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                });
            } else {
                // Fallback to JSON
                const blob = new Blob([JSON.stringify(chartData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chart-${type || 'bar'}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }, 200);
    };

    return (
        <EnhancedWrapper
            onDownload={handleChartDownload}
        >
            <div style={style}>{chartComponent}</div>
        </EnhancedWrapper>
    );
};

// Simple Table Component
const SimpleTable = ({ headers, rows }) => {
    if ((!headers || headers.length === 0) && (!rows || rows.length === 0)) {
        return (
            <EnhancedWrapper>
                <p style={{ color: '#94a3b8' }}>No data available</p>
            </EnhancedWrapper>
        );
    }

    const tableData = { headers, rows };

    const isUrl = (value) =>
        typeof value === 'string' && /^https?:\/\/[^\s]+$/i.test(value.trim());

    return (
        <EnhancedWrapper
            downloadData={tableData}
            downloadFilename={`table-${new Date().toISOString().split('T')[0]}.csv`}
            downloadType="csv"
        >
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr>
                            {headers.map((col, i) => (
                                <th key={i} style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #334155', color: '#94a3b8' }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => {
                                    const cellValue = typeof cell === 'string' ? cell.trim() : cell;
                                    const url = isUrl(cellValue) ? cellValue : null;

                                    return (
                                        <td
                                            key={j}
                                            style={{
                                                padding: '12px',
                                                borderBottom: '1px solid #1e293b',
                                                color: '#e2e8f0',
                                                maxWidth: '320px'
                                            }}
                                        >
                                            {url ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '6px 12px',
                                                        background: 'rgba(59, 130, 246, 0.15)',
                                                        borderRadius: '999px',
                                                        border: '1px solid #3b82f6',
                                                        color: '#e2e8f0',
                                                        fontSize: '0.8rem',
                                                        textDecoration: 'none',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Ouvrir la source
                                                </a>
                                            ) : (
                                                cellValue
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </EnhancedWrapper>
    );
};

// Report Renderer Component - Beautiful report with download option
const ReportRenderer = ({ content }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Parse markdown-like content for titles
    const parseContent = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            // H1 titles
            if (line.startsWith('# ')) {
                return (
                    <h1 key={index} style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#f8fafc',
                        marginTop: index > 0 ? '24px' : '0',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #3b82f6'
                    }}>
                        {line.substring(2)}
                    </h1>
                );
            }
            // H2 titles
            if (line.startsWith('## ')) {
                return (
                    <h2 key={index} style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#e2e8f0',
                        marginTop: index > 0 ? '20px' : '0',
                        marginBottom: '10px',
                        paddingBottom: '6px',
                        borderBottom: '1px solid #475569'
                    }}>
                        {line.substring(3)}
                    </h2>
                );
            }
            // H3 titles
            if (line.startsWith('### ')) {
                return (
                    <h3 key={index} style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        marginTop: index > 0 ? '16px' : '0',
                        marginBottom: '8px'
                    }}>
                        {line.substring(4)}
                    </h3>
                );
            }
            // Bold text
            if (line.startsWith('**') && line.endsWith('**')) {
                return (
                    <p key={index} style={{ fontWeight: 'bold', color: '#e2e8f0', margin: '8px 0' }}>
                        {line.substring(2, line.length - 2)}
                    </p>
                );
            }
            // Regular paragraphs
            if (line.trim()) {
                return (
                    <p key={index} style={{ 
                        color: '#cbd5e1', 
                        lineHeight: '1.6', 
                        margin: '8px 0',
                        paddingLeft: line.startsWith('- ') ? '16px' : '0'
                    }}>
                        {line.startsWith('- ') ? '• ' + line.substring(2) : line}
                    </p>
                );
            }
            // Empty lines
            return <br key={index} />;
        });
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '12px',
                border: '1px solid #334155',
                padding: '24px',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isHovered 
                    ? '0 10px 30px rgba(59, 130, 246, 0.2)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                borderColor: isHovered ? '#3b82f6' : '#334155'
            }}
        >
            {/* Download Button */}
            <button
                onClick={handleDownload}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: isHovered ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                }}
            >
                <FileText size={14} />
                Télécharger
            </button>

            {/* Report Content */}
            <div style={{
                paddingRight: '100px', // Space for download button
                lineHeight: '1.8'
            }}>
                {parseContent(content)}
            </div>

            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px 0 0 12px'
            }} />
        </div>
    );
};

// Helper to extract links from text
const extractLinksFromText = (text) => {
    if (!text || typeof text !== 'string') return [];
    const urlRegex = /https?:\/\/[^\s)]+/g;
    const matches = text.match(urlRegex) || [];
    return matches.map((url) => ({ url, label: url }));
};

// Helper to extract links from any response object
const extractLinksFromData = (data) => {
    const links = [];
    const seen = new Set();

    const addLink = (url, label) => {
        if (!url || seen.has(url)) return;
        seen.add(url);
        links.push({ url, label: label || url });
    };

    if (!data) return links;

    if (typeof data === 'string') {
        extractLinksFromText(data).forEach((l) => addLink(l.url, l.label));
        return links;
    }

    // Direct url / urls fields
    if (typeof data.url === 'string') addLink(data.url);
    if (Array.isArray(data.urls)) {
        data.urls.forEach((u) => {
            if (typeof u === 'string') addLink(u);
            else if (u && typeof u.url === 'string') addLink(u.url, u.label);
        });
    }

    // links array: [{ url, label }] ou [string]
    if (Array.isArray(data.links)) {
        data.links.forEach((l) => {
            if (typeof l === 'string') addLink(l);
            else if (l && typeof l.url === 'string') addLink(l.url, l.label);
        });
    }

    // Extraire depuis content si string
    if (typeof data.content === 'string') {
        extractLinksFromText(data.content).forEach((l) => addLink(l.url, l.label));
    }

    return links;
};

// Small component to render link buttons
const LinkButtons = ({ links }) => {
    if (!links || links.length === 0) return null;
    return (
        <div style={{
            marginTop: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
        }}>
            {links.map((link, index) => (
                <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        padding: '6px 12px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        borderRadius: '999px',
                        border: '1px solid #3b82f6',
                        color: '#e2e8f0',
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#3b82f6'
                    }} />
                    <span>Ouvrir le lien</span>
                </a>
            ))}
        </div>
    );
};

// Response Renderer Component - Automatically detects and transforms JSON responses
const ResponseRenderer = ({ data }) => {
    if (!data) return null;

    // Handle string responses
    if (typeof data === 'string') {
        const links = extractLinksFromText(data);
        return (
            <div>
                <div style={{
                    whiteSpace: 'pre-wrap',
                    background: data.length > 100 ? 'rgba(30, 41, 59, 0.3)' : 'transparent',
                    padding: data.length > 100 ? '20px' : '0',
                    borderRadius: '8px',
                    border: data.length > 100 ? '1px solid #334155' : 'none'
                }}>
                    {data}
                </div>
                <LinkButtons links={links} />
            </div>
        );
    }

    const globalLinks = extractLinksFromData(data);

    // Detect format based on "type" field (standardized format)
    const responseType = data.type?.toLowerCase();

    // 1. GRAPHIC / CHART - Standardized format or alternative
    if (responseType === 'graphic' || data.chartData || (data.data && data.chartType)) {
        let chartData = null;
        
        // Standardized format: { type: "graphic", chartType: "bar", data: {...} }
        if (responseType === 'graphic' && data.data) {
            chartData = {
                type: data.chartType || 'bar',
                labels: data.data.labels || [],
                datasets: data.data.datasets || []
            };
        }
        // Alternative format: { chartData: { type, labels, datasets } }
        else if (data.chartData) {
            chartData = data.chartData;
        }

        if (chartData) {
            return (
                <div>
                    <ChartRenderer chartData={chartData} />
                    <LinkButtons links={globalLinks} />
                </div>
            );
        }
    }

    // 2. MAP - Standardized format or alternative
    if (responseType === 'map' || data.mapData) {
        let markers = [];
        
        // Standardized format: { type: "map", markers: [...] }
        if (responseType === 'map' && data.markers) {
            markers = data.markers.map(m => ({
                name: m.name || m.title || "Marker",
                coordinates: m.coordinates,
                value: m.value !== undefined ? m.value : 50, // Preserve string values
                description: m.description || m.details || null,
            }));
        }
        // Alternative format: { mapData: { markers: [...] } }
        else if (data.mapData && data.mapData.markers) {
            markers = data.mapData.markers.map(m => ({
                name: m.name || m.title || "Marker",
                coordinates: m.coordinates,
                value: m.value !== undefined ? m.value : 50, // Preserve string values
                description: m.description || m.details || null,
            }));
        }

        if (markers.length > 0) {
            return (
                <EnhancedWrapper
                    downloadData={{ type: 'map', markers }}
                    downloadFilename={`map-${new Date().toISOString().split('T')[0]}.json`}
                    downloadType="json"
                >
                    <div style={{ height: '350px', width: '100%', background: '#020617', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        <WorldMap markers={markers} />
                    </div>
                    <LinkButtons links={globalLinks} />
                </EnhancedWrapper>
            );
        }
    }

    // 3. TABLE - Standardized format or alternative
    if (responseType === 'table' || data.tableData) {
        let headers = [];
        let rows = [];
        
        // Standardized format: { type: "table", columns: [...], rows: [...] }
        if (responseType === 'table') {
            headers = data.columns || [];
            rows = data.rows || [];
        }
        // Alternative format: { tableData: { headers: [...], rows: [...] } }
        else if (data.tableData) {
            headers = data.tableData.headers || data.tableData.columns || [];
            rows = data.tableData.rows || [];
        }

        if (headers.length > 0 || rows.length > 0) {
            return (
                <div>
                    <SimpleTable headers={headers} rows={rows} />
                    <LinkButtons links={globalLinks} />
                </div>
            );
        }
    }

    // 4. TEXT - Simple text format
    if (responseType === 'text' || (!responseType && data.content && !data.type)) {
        const content = data.content || '';
        if (content) {
            const links = extractLinksFromText(content);
            return (
                <div>
                    <div style={{
                        whiteSpace: 'pre-wrap',
                        background: content.length > 100 ? 'rgba(30, 41, 59, 0.3)' : 'transparent',
                        padding: content.length > 100 ? '20px' : '0',
                        borderRadius: '8px',
                        border: content.length > 100 ? '1px solid #334155' : 'none'
                    }}>
                        {content}
                    </div>
                    <LinkButtons links={links.length > 0 ? links : globalLinks} />
                </div>
            );
        }
    }

    // 5. RAPPORT - Enhanced report format with styling and download
    if (responseType === 'rapport') {
        const content = data.content || '';
        if (content) {
            return <ReportRenderer content={content} />;
        }
    }

    // Fallback: Display raw JSON for debugging
    return (
        <div>
            <div style={{ whiteSpace: 'pre-wrap', color: '#94a3b8', fontSize: '0.8rem', background: 'rgba(30, 41, 59, 0.3)', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '0.75rem' }}>⚠️ Unknown response format. Raw data:</div>
                {JSON.stringify(data, null, 2)}
            </div>
            <LinkButtons links={globalLinks} />
        </div>
    );
};

function NonTechnical() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! Select a format and ask your question.' }
    ]);
    const [input, setInput] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('text'); // Default to 'text' instead of null
    const [conversationId, setConversationId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!conversationId) {
            setConversationId(Math.random().toString(36).substring(7));
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input, format: selectedFormat };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        const currentFormat = selectedFormat || "text";
        setInput('');
        setIsLoading(true);

        // Prepare request payload
        const requestPayload = {
            message: currentInput,
            format: currentFormat,
            conversationID: conversationId
        };

        console.log('📤 Sending request to webhook:', {
            url: 'https://n8n.srv849307.hstgr.cloud/webhook/everdian-agent',
            payload: requestPayload
        });

        try {
            const response = await fetch('https://n8n.srv849307.hstgr.cloud/webhook/everdian-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 404) {
                    throw new Error('Webhook not found. Please check if the n8n workflow is active.');
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            console.log('📥 Received response from webhook:', {
                format: currentFormat,
                responseType: data.type,
                hasChartData: !!data.chartData || (data.type === 'graphic'),
                hasMapData: !!data.mapData || (data.type === 'map'),
                hasTableData: !!data.tableData || (data.type === 'table'),
                hasContent: !!data.content,
                rawData: data
            });

            // Validate response structure
            if (!data || (typeof data !== 'object' && typeof data !== 'string')) {
                throw new Error('Invalid response format from webhook');
            }

            // Automatically transform the response based on its structure
            // The ResponseRenderer will detect the format and render accordingly
            const botResponse = { 
                id: Date.now() + 1, 
                type: 'bot', 
                data: data,
                format: currentFormat // Store the requested format for reference
            };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error('❌ Error sending message:', error);
            const errorMessage = error.message.includes('Webhook not found') 
                ? '⚠️ Webhook not found. Please ensure the n8n workflow "everdian-agent" is active. Check your n8n dashboard.'
                : `Error connecting to agent: ${error.message}`;
            const errorResponse = { id: Date.now() + 1, type: 'bot', text: errorMessage };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const options = ['text', 'table', 'map', 'graphic', 'rapport'];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            background: '#0f172a',
            color: '#f8fafc',
            overflow: 'hidden'
        }}>
            {/* Top Navigation Header */}
            <header style={{
                height: '60px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                zIndex: 50,
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bot size={18} color="#3b82f6" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>
                        Non-Technical<span style={{ color: '#3b82f6' }}> Platform</span>
                    </h1>
                </div>

                <button
                    onClick={() => navigate('/power')}
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
                    <LayoutDashboard size={16} />
                    Power Platform
                </button>
            </header>

            {/* Main Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Left Section - Chat Interface */}
                <div style={{
                    flex: 1, // Takes remaining space
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #334155',
                    background: 'rgba(15, 23, 42, 0.95)',
                    zIndex: 20,
                    overflow: 'hidden'
                }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Bot size={24} color="#3b82f6" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>AI Assistant</h2>
                            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online</span>
                        </div>
                    </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            display: 'flex',
                            gap: '12px',
                            flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '90%',
                            width: '100%'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: msg.type === 'user' ? '#3b82f6' : '#334155',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {msg.type === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="#94a3b8" />}
                            </div>
                            <div style={{
                                background: msg.type === 'user' ? '#1e293b' : 'rgba(30, 41, 59, 0.5)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                borderTopRightRadius: msg.type === 'user' ? '2px' : '12px',
                                borderTopLeftRadius: msg.type === 'bot' ? '2px' : '12px',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                color: '#e2e8f0',
                                wordBreak: 'break-word',
                                width: msg.type === 'bot' ? '100%' : 'auto',
                                maxWidth: msg.type === 'bot' ? '600px' : '100%'
                            }}>
                                {msg.text && (
                                    <div>
                                        <p style={{ margin: 0 }}>{msg.text}</p>
                                        {msg.format && msg.type === 'user' && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: '#3b82f6',
                                                marginTop: '4px',
                                                display: 'inline-block',
                                                padding: '2px 8px',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                borderRadius: '4px'
                                            }}>
                                                Format: {msg.format}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {msg.data && <ResponseRenderer data={msg.data} />}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', gap: '12px', maxWidth: '90%' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Bot size={16} color="#94a3b8" />
                            </div>
                            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px 16px', borderRadius: '12px', borderTopLeftRadius: '2px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #334155',
                    background: 'rgba(15, 23, 42, 0.95)',
                    flexShrink: 0
                }}>
                    {/* Format Selection Buttons */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        {options.map((opt, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedFormat(opt)}
                                style={{
                                    padding: '6px 12px',
                                    background: selectedFormat === opt ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.3)',
                                    border: selectedFormat === opt ? '1px solid #3b82f6' : '1px solid #334155',
                                    borderRadius: '16px',
                                    color: selectedFormat === opt ? '#f8fafc' : '#94a3b8',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textTransform: 'capitalize',
                                    fontWeight: selectedFormat === opt ? '600' : '400'
                                }}
                            >
                                {opt === 'text' && <FileText size={14} />}
                                {opt === 'table' && <TableIcon size={14} />}
                                {opt === 'map' && <MapIcon size={14} />}
                                {opt === 'graphic' && <BarChart2 size={14} />}
                                {opt === 'rapport' && <ImageIcon size={14} />}
                                {opt}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSend} style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Ask your question (format: ${selectedFormat})...`}
                            style={{
                                width: '100%',
                                padding: '14px 48px 14px 16px',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: input.trim() ? '#3b82f6' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: input.trim() ? 'pointer' : 'default',
                                transition: 'background 0.2s'
                            }}
                        >
                            <Send size={16} color={input.trim() ? 'white' : '#475569'} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section - Compact News Feed (collapsible) */}
            <div style={{
                position: 'relative',
                height: '100%',
                transition: 'width 0.25s ease',
                width: isSidebarOpen ? '300px' : '0px',
                flexShrink: 0,
                overflow: 'hidden',
                borderLeft: isSidebarOpen ? '1px solid #334155' : 'none',
                background: '#020617'
            }}>
                {/* Toggle handle */}
                <button
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    style={{
                        position: 'absolute',
                        left: isSidebarOpen ? '-12px' : '-12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '24px',
                        height: '48px',
                        borderRadius: '999px',
                        border: '1px solid #334155',
                        background: 'rgba(15, 23, 42, 0.95)',
                        color: '#e2e8f0',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 30
                    }}
                >
                    {isSidebarOpen ? '⟨' : '⟩'}
                </button>

                {isSidebarOpen && (
                    <div style={{
                        height: '100%',
                        overflowY: 'auto',
                        padding: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Newspaper size={20} color="#3b82f6" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Latest</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: "Market Analysis Q3", time: "1h ago", tag: "Finance" },
                                { title: "New AI Regulations", time: "2h ago", tag: "Policy" },
                                { title: "Tech Sector Rally", time: "4h ago", tag: "Market" },
                                { title: "Global Supply Chain", time: "5h ago", tag: "Logistics" },
                                { title: "Energy Crisis Update", time: "6h ago", tag: "Energy" }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    padding: '12px',
                                    background: '#1e293b',
                                    borderRadius: '8px',
                                    border: '1px solid #334155'
                                }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>{item.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                                        <span>{item.time}</span>
                                        <span style={{ color: '#3b82f6' }}>{item.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}

export default NonTechnical;
