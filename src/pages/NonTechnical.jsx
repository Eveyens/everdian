import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, Newspaper, BarChart2, FileText, Map as MapIcon, Table as TableIcon, Image as ImageIcon } from 'lucide-react';
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
The webhook should return JSON in the following formats:

1. GRAPHIC (Chart.js)
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

2. MAP (World Map)
{
  "type": "map",
  "markers": [
    { "name": "New York", "coordinates": [-74.006, 40.7128], "value": 100 },
    { "name": "London", "coordinates": [-0.1276, 51.5074], "value": 50 }
  ]
}

3. TABLE
{
  "type": "table",
  "columns": ["Name", "Role", "Status"],
  "rows": [
    ["Alice", "Admin", "Active"],
    ["Bob", "User", "Inactive"]
  ]
}

4. REPORT / TEXT
{
  "type": "rapport" | "text",
  "content": "## Monthly Report\n\nThis is the detailed report content..."
}
*/

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

    const style = { height: '300px', width: '100%', padding: '10px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px' };

    switch (type?.toLowerCase()) {
        case 'line': return <div style={style}><Line data={data} options={options} /></div>;
        case 'pie': return <div style={style}><Pie data={data} options={options} /></div>;
        case 'doughnut': return <div style={style}><Doughnut data={data} options={options} /></div>;
        case 'bar':
        default: return <div style={style}><Bar data={data} options={options} /></div>;
    }
};

// Simple Table Component
const SimpleTable = ({ headers, rows }) => {
    if ((!headers || headers.length === 0) && (!rows || rows.length === 0)) return <p style={{ color: '#94a3b8' }}>No data available</p>;

    return (
        <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '10px' }}>
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
                            {row.map((cell, j) => (
                                <td key={j} style={{ padding: '12px', borderBottom: '1px solid #1e293b', color: '#e2e8f0' }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Response Renderer Component
const ResponseRenderer = ({ data }) => {
    if (!data) return null;

    // 1. Graphic / Chart
    if (data.chartData) {
        return <ChartRenderer chartData={data.chartData} />;
    }

    // 2. Map
    if (data.mapData) {
        // Map markers to WorldMap component format
        // WorldMap expects: { name, coordinates: [lon, lat], value }
        const markers = (data.mapData.markers || []).map(m => ({
            name: m.title || "Marker",
            coordinates: m.coordinates,
            value: 50 // Default value for visibility
        }));

        return (
            <div style={{ height: '350px', width: '100%', background: '#020617', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid #334155' }}>
                <WorldMap markers={markers} />
            </div>
        );
    }

    // 3. Table
    if (data.tableData) {
        return <SimpleTable headers={data.tableData.headers} rows={data.tableData.rows} />;
    }

    // 4. Report / Text (Classique)
    if (data.content) {
        return (
            <div style={{
                whiteSpace: 'pre-wrap',
                background: data.content.length > 100 ? 'rgba(30, 41, 59, 0.3)' : 'transparent',
                padding: data.content.length > 100 ? '20px' : '0',
                borderRadius: '8px',
                border: data.content.length > 100 ? '1px solid #334155' : 'none'
            }}>
                {data.content}
            </div>
        );
    }

    // Fallback for unknown JSON or simple string
    if (typeof data === 'string') return <p style={{ whiteSpace: 'pre-wrap' }}>{data}</p>;

    return (
        <div style={{ whiteSpace: 'pre-wrap', color: '#94a3b8', fontSize: '0.8rem' }}>
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

function NonTechnical() {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! Please select a format for your inquiry.' }
    ]);
    const [input, setInput] = useState('');
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [conversationId, setConversationId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://n8n.srv849307.hstgr.cloud/webhook/everdian-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    format: selectedFormat || "text",
                    conversationID: conversationId
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Pass the raw data to the renderer, which now handles specific keys (chartData, mapData, etc.)
            const botResponse = { id: Date.now() + 1, type: 'bot', data: data };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorResponse = { id: Date.now() + 1, type: 'bot', text: 'Error connecting to agent.' };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const options = ['text', 'table', 'map', 'graphic', 'rapport'];

    const handleOptionClick = (option) => {
        setSelectedFormat(option);
        const userMsg = { id: Date.now(), type: 'user', text: `Format: ${option}` };
        setMessages(prev => [...prev, userMsg]);

        // Mock response for immediate feedback if webhook is slow/not connected in dev
        // In prod, this timeout might be removed or adjusted
        /* 
        setTimeout(() => {
             // This is just a placeholder interaction, the real data comes from handleSend
        }, 500); 
        */
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            width: '100vw',
            background: '#0f172a',
            color: '#f8fafc',
            overflow: 'hidden'
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
                                {msg.text && <p style={{ margin: 0 }}>{msg.text}</p>}
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

                    {messages.length === 1 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginTop: '10px',
                            width: '100%',
                            paddingLeft: '44px'
                        }}>
                            {options.map((opt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(opt)}
                                    style={{
                                        padding: '8px 16px',
                                        background: selectedFormat === opt ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.3)',
                                        border: selectedFormat === opt ? '1px solid #3b82f6' : '1px solid #334155',
                                        borderRadius: '20px',
                                        color: selectedFormat === opt ? '#f8fafc' : '#94a3b8',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {opt === 'text' && <FileText size={16} />}
                                    {opt === 'table' && <TableIcon size={16} />}
                                    {opt === 'map' && <MapIcon size={16} />}
                                    {opt === 'graphic' && <BarChart2 size={16} />}
                                    {opt === 'rapport' && <ImageIcon size={16} />}
                                    {opt}
                                </button>
                            ))}
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
                    <form onSubmit={handleSend} style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedFormat ? `Ask for ${selectedFormat}...` : "Select a format above first..."}
                            disabled={!selectedFormat}
                            style={{
                                width: '100%',
                                padding: '14px 48px 14px 16px',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                opacity: selectedFormat ? 1 : 0.7,
                                cursor: selectedFormat ? 'text' : 'not-allowed'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || !selectedFormat}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: input.trim() && selectedFormat ? '#3b82f6' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: input.trim() && selectedFormat ? 'pointer' : 'default',
                                transition: 'background 0.2s'
                            }}
                        >
                            <Send size={16} color={input.trim() && selectedFormat ? 'white' : '#475569'} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section - Compact News Feed */}
            <div style={{
                width: '300px', // Fixed small width
                background: '#020617',
                overflowY: 'auto',
                padding: '20px',
                borderLeft: '1px solid #334155',
                flexShrink: 0
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
        </div>
    );
}

export default NonTechnical;
