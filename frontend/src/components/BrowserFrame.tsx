import type { Choice, RedFlag } from '../types';
import RedFlagHighlighter from './RedFlagHighlighter';

interface Props {
    sender: string;
    subject?: string;
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
    choices: Choice[];
    onChoice: (label: string) => void;
    disabled: boolean;
}

const FOLDERS = [
    { name: 'Inbox', icon: '📥', count: 1, active: true },
    { name: 'Sent', icon: '📤', count: 0, active: false },
    { name: 'Drafts', icon: '📝', count: 2, active: false },
    { name: 'Junk Email', icon: '⚠️', count: 4, active: false },
    { name: 'Deleted', icon: '🗑️', count: 0, active: false },
];

// Accent colours for each choice button to feel native to Outlook
const CHOICE_STYLES: { bg: string; border: string; color: string; hoverBg: string }[] = [
    { bg: '#0078d4', border: '#0078d4', color: '#fff', hoverBg: '#106ebe' },
    { bg: '#202020', border: '#555', color: '#d4d4d4', hoverBg: '#2d2d2d' },
    { bg: '#202020', border: '#555', color: '#d4d4d4', hoverBg: '#2d2d2d' },
];

export default function BrowserFrame({
    sender, subject, content, redFlags, showRedFlags, choices, onChoice, disabled,
}: Props) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        /* Full-width, full-height Windows Mail frame */
        <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            border: '1px solid #404040',
            background: '#202020',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
        }}>

            {/* ── Windows Title Bar ── */}
            <div style={{
                background: '#2b2b2b',
                display: 'flex',
                alignItems: 'center',
                height: 32,
                paddingLeft: 12,
                borderBottom: '1px solid #404040',
                flexShrink: 0,
            }}>
                <span style={{ fontSize: 13, marginRight: 8 }}>✉️</span>
                <span style={{
                    color: '#d4d4d4', fontSize: 13, flex: 1,
                    fontFamily: '"Segoe UI", system-ui, sans-serif',
                }}>
                    Mail — {subject ?? 'New Message'}
                </span>
                {['─', '□', '✕'].map((ch, i) => (
                    <div key={i}
                        style={{
                            width: 46, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#d4d4d4', fontSize: i === 2 ? 11 : 13,
                            cursor: 'default',
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = i === 2 ? '#c42b1c' : '#3d3d3d'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{ch}</div>
                ))}
            </div>

            {/* ── Ribbon Toolbar ── */}
            <div style={{
                background: '#2b2b2b',
                display: 'flex', alignItems: 'center', gap: 2,
                padding: '4px 8px',
                borderBottom: '1px solid #404040',
                flexShrink: 0,
            }}>
                {[
                    { icon: '✉️', label: 'New mail' },
                    { icon: '↩️', label: 'Reply' },
                    { icon: '↪️', label: 'Forward' },
                    { icon: '🗑️', label: 'Delete' },
                    { icon: '⚠️', label: 'Junk' },
                    { icon: '📁', label: 'Move' },
                ].map((a) => (
                    <div key={a.label}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '4px 8px', borderRadius: 4, cursor: 'default',
                            gap: 2, minWidth: 48,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#3d3d3d'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <span style={{ fontSize: 10, color: '#a0a0a0', fontFamily: '"Segoe UI", system-ui, sans-serif' }}>{a.label}</span>
                    </div>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{
                    display: 'flex', alignItems: 'center',
                    background: '#1a1a1a', border: '1px solid #555',
                    borderRadius: 4, padding: '4px 10px', gap: 6,
                }}>
                    <span style={{ color: '#888', fontSize: 12 }}>🔍</span>
                    <span style={{ color: '#666', fontSize: 12, fontFamily: '"Segoe UI", system-ui, sans-serif' }}>Search mail</span>
                </div>
            </div>

            {/* ── 3-Panel Layout ── */}
            <div style={{ display: 'flex', flex: 1, minHeight: 520 }}>

                {/* Left: Folder Tree */}
                <div style={{
                    width: 180, background: '#252525',
                    borderRight: '1px solid #404040', padding: '12px 0', flexShrink: 0,
                }}>
                    <div style={{
                        padding: '0 14px 8px', color: '#0078d4', fontSize: 11,
                        fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                        fontFamily: '"Segoe UI", system-ui, sans-serif',
                    }}>Favorites</div>
                    {FOLDERS.map((f) => (
                        <div key={f.name}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '6px 14px',
                                background: f.active ? '#0078d4' : 'transparent',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => { if (!f.active) e.currentTarget.style.background = '#333'; }}
                            onMouseLeave={e => { if (!f.active) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13 }}>{f.icon}</span>
                                <span style={{
                                    color: f.active ? '#fff' : '#d4d4d4', fontSize: 13,
                                    fontFamily: '"Segoe UI", system-ui, sans-serif',
                                }}>{f.name}</span>
                            </div>
                            {f.count > 0 && (
                                <span style={{
                                    background: f.active ? 'rgba(255,255,255,0.3)' : '#0078d4',
                                    color: '#fff', fontSize: 10, fontWeight: 700,
                                    borderRadius: 10, padding: '1px 6px',
                                    fontFamily: '"Segoe UI", system-ui, sans-serif',
                                }}>{f.count}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Center: Email List */}
                <div style={{
                    width: 260, background: '#1e1e1e',
                    borderRight: '1px solid #404040', flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{
                        padding: '10px 14px', borderBottom: '1px solid #404040',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{
                            color: '#d4d4d4', fontSize: 13, fontWeight: 600,
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                        }}>Inbox</span>
                        <span style={{ color: '#888', fontSize: 11, fontFamily: '"Segoe UI", system-ui, sans-serif' }}>1 message</span>
                    </div>

                    {/* Selected email row */}
                    <div style={{
                        padding: '12px 14px', background: '#0078d4',
                        cursor: 'default', borderLeft: '3px solid #60cdff',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{
                                color: '#fff', fontSize: 13, fontWeight: 700,
                                maxWidth: 165, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                fontFamily: '"Segoe UI", system-ui, sans-serif',
                            }}>{sender}</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{timeStr}</span>
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600,
                            marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                        }}>{subject ?? '(No subject)'}</div>
                        <div style={{
                            color: 'rgba(255,255,255,0.65)', fontSize: 11,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                        }}>{content.slice(0, 60)}…</div>
                    </div>
                </div>

                {/* Right: Reading Pane */}
                <div style={{
                    flex: 1, background: '#1a1a1a',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    {/* ── Action Bar with CHOICES as buttons ── */}
                    <div style={{
                        padding: '10px 20px',
                        borderBottom: '1px solid #404040',
                        display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
                    }}>
                        {choices.map((c, i) => {
                            // Map style: first choice (often the dangerous one) is blue, others are neutral
                            // But we check keywords to be sure
                            const isDangerous = /click|link|open|visit|คลิก|ลิงก์|เปิด|โอน|กด|รับ/i.test(c.label);
                            const style = isDangerous ? CHOICE_STYLES[0] : CHOICE_STYLES[1];

                            return (
                                <button
                                    key={c.label}
                                    disabled={disabled}
                                    onClick={() => onChoice(c.label)}
                                    style={{
                                        padding: '6px 16px',
                                        border: `1px solid ${style.border}`,
                                        borderRadius: 4,
                                        background: style.bg,
                                        color: style.color,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: disabled ? 'default' : 'pointer',
                                        fontFamily: '"Segoe UI", system-ui, sans-serif',
                                        opacity: disabled ? 0.4 : 1,
                                        transition: 'background 0.15s, opacity 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = style.hoverBg; }}
                                    onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = style.bg; }}
                                >
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Email Header */}
                    <div style={{
                        padding: '16px 20px 12px',
                        borderBottom: '1px solid #404040', flexShrink: 0,
                    }}>
                        <h2 style={{
                            color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 12px',
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                        }}>{subject ?? '(No subject)'}</h2>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', background: '#0078d4',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 18, flexShrink: 0,
                            }}>✉️</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{
                                        color: '#fff', fontSize: 13, fontWeight: 600,
                                        fontFamily: '"Segoe UI", system-ui, sans-serif',
                                    }}>{sender}</span>
                                    <span style={{
                                        color: '#888', fontSize: 12,
                                        fontFamily: '"Segoe UI", system-ui, sans-serif',
                                    }}>{dateStr}, {timeStr}</span>
                                </div>
                                <div style={{ color: '#888', fontSize: 12, fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
                                    To: <span style={{ color: '#a0a0a0' }}>me</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
                        <div style={{
                            color: '#d4d4d4', fontSize: 14, lineHeight: 1.7,
                            fontFamily: '"Segoe UI", system-ui, sans-serif',
                        }}>
                            <RedFlagHighlighter content={content} redFlags={redFlags} showRedFlags={showRedFlags} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
