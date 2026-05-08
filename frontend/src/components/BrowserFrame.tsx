import type { UiTrigger, UiTriggers, RedFlag } from '../types';
import RedFlagHighlighter from './RedFlagHighlighter';

interface Props {
    sender: string;
    subject?: string;
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
    uiTriggers: UiTriggers;
    onTrigger: (trigger: UiTrigger, isPass: boolean) => void;
    disabled: boolean;
}

interface ClickableContentProps {
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
    inlineLinks: (UiTrigger & { isPass: boolean })[];
    onTrigger: (trigger: UiTrigger, isPass: boolean) => void;
    disabled: boolean;
}

function ClickableContent({
    content, redFlags, showRedFlags, inlineLinks, onTrigger, disabled,
}: ClickableContentProps) {
    const urlRe = /(https?:\/\/[^\s]+)/g;
    if (showRedFlags) {
        return <RedFlagHighlighter content={content} redFlags={redFlags} showRedFlags={showRedFlags} />;
    }
    const parts = content.split(urlRe);
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {parts.map((part, i) => {
                if (urlRe.test(part) || part.startsWith('http')) {
                    const trigger = inlineLinks.find(t => t.label === part || part.includes(t.label));
                    return (
                        <span
                            key={i}
                            onClick={() => {
                                if (disabled || !trigger) return;
                                onTrigger(trigger, trigger.isPass);
                            }}
                            style={{
                                color: '#60cdff',
                                textDecoration: 'underline',
                                cursor: (disabled || !trigger) ? 'default' : 'pointer',
                                wordBreak: 'break-all',
                            }}
                        >{part}</span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
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
    sender, subject, content, redFlags, showRedFlags, uiTriggers, onTrigger, disabled,
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
                    { icon: '✉️', label: 'New mail', trigger: null },
                    { icon: '↩️', label: 'Reply', trigger: null },
                    { icon: '↪️', label: 'Forward', trigger: null },
                    { icon: '🗑️', label: 'Delete', trigger: uiTriggers.pass_triggers.find(t => t.type === 'delete_button') },
                    { icon: '⚠️', label: 'Junk', trigger: uiTriggers.pass_triggers.find(t => t.type === 'report_button') },
                    { icon: '📁', label: 'Move', trigger: null },
                ].map((a) => (
                    <div key={a.label}
                        onClick={() => { if (!disabled && a.trigger) onTrigger(a.trigger, true); }}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '4px 8px', borderRadius: 4, cursor: a.trigger && !disabled ? 'pointer' : 'default',
                            gap: 2, minWidth: 48,
                            opacity: disabled && a.trigger ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!disabled && a.trigger) e.currentTarget.style.background = '#3d3d3d'; }}
                        onMouseLeave={e => { if (!disabled && a.trigger) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <span style={{ fontSize: 10, color: a.trigger ? '#60cdff' : '#a0a0a0', fontWeight: a.trigger ? 700 : 400, fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
                            {a.trigger ? a.trigger.label : a.label}
                        </span>
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
                    {/* ── Action Bar removed ── */}

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
                            <ClickableContent
                                content={content}
                                redFlags={redFlags}
                                showRedFlags={showRedFlags}
                                inlineLinks={[
                                    ...uiTriggers.fail_triggers.filter(t => t.type === 'inline_link').map(t => ({ ...t, isPass: false })),
                                    ...uiTriggers.pass_triggers.filter(t => t.type === 'inline_link').map(t => ({ ...t, isPass: true })),
                                ]}
                                onTrigger={onTrigger}
                                disabled={disabled}
                            />
                        </div>
                        {uiTriggers.fail_triggers.filter(t => t.type === 'cta_button').map(t => (
                            <div key={t.label} style={{ marginTop: 24, textAlign: 'center' }}>
                                <button
                                    disabled={disabled}
                                    onClick={() => onTrigger(t, false)}
                                    style={{
                                        background: '#0078d4', border: 'none', color: '#fff',
                                        padding: '10px 24px', fontSize: 16, borderRadius: 4,
                                        cursor: disabled ? 'default' : 'pointer',
                                        opacity: disabled ? 0.5 : 1,
                                        fontFamily: '"Segoe UI", system-ui, sans-serif',
                                        fontWeight: 600,
                                    }}
                                >
                                    {t.label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
