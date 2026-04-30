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

function ClickableContent({
    content, redFlags, showRedFlags, inlineLinks, onTrigger, disabled,
}: {
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
    inlineLinks: UiTrigger[];
    onTrigger: (trigger: UiTrigger, isPass: boolean) => void;
    disabled: boolean;
}) {
    const urlRe = /(https?:\/\/[^\s]+)/g;
    if (showRedFlags) {
        return <RedFlagHighlighter content={content} redFlags={redFlags} showRedFlags={showRedFlags} />;
    }
    const parts = content.split(urlRe);
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {parts.map((part, i) => {
                if (urlRe.test(part) || part.startsWith('http')) {
                    const failTrigger = inlineLinks.find(t => t.label === part || part.includes(t.label)) || inlineLinks[0];
                    return (
                        <span
                            key={i}
                            onClick={() => {
                                if (disabled) return;
                                if (failTrigger) onTrigger(failTrigger, false);
                            }}
                            style={{
                                color: '#60cdff',
                                textDecoration: 'underline',
                                cursor: disabled ? 'default' : 'pointer',
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

// ── Mini TradingView-style chart bars (decorative) ─────────────────────────
function FakeChart() {
    const bars = [40, 55, 42, 68, 52, 75, 60, 80, 65, 90, 72, 85, 70, 95, 80, 100, 88, 78, 92, 85];
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60, padding: '0 4px' }}>
            {bars.map((h, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i > 14
                        ? 'linear-gradient(to top, #26a69a, #4ecdc4)'
                        : 'linear-gradient(to top, #ef5350, #ff6b6b)',
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.85,
                }} />
            ))}
        </div>
    );
}

// ── Deepfake video player placeholder ─────────────────────────────────────
function FakeVideoPlayer({ onPlayClick }: { onPlayClick: () => void }) {
    return (
        <div style={{
            width: '100%',
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #30363d',
        }}>
            {/* Fake video frame scanlines */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                pointerEvents: 'none',
            }} />

            {/* Speaker silhouette */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, border: '2px solid #4299e1',
                    boxShadow: '0 0 30px rgba(66,153,225,0.4)',
                }}>👤</div>
                <div style={{
                    color: '#e2e8f0', fontSize: 13, fontWeight: 600,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>TradingView CEO — Live Stream</div>

                {/* Live badge */}
                <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: '#e53e3e', color: '#fff',
                    fontSize: 11, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    boxShadow: '0 0 8px rgba(229,62,62,0.6)',
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#fff', animation: 'blink 1s ease-in-out infinite',
                        display: 'inline-block',
                    }} />
                    LIVE
                </div>

                {/* Viewer count */}
                <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(0,0,0,0.6)', color: '#a0aec0',
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}>👁️ 12,483</div>

                {/* Audio waveform (fake) */}
                <div style={{
                    position: 'absolute', bottom: 40, left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 2,
                }}>
                    {[4, 8, 12, 6, 10, 3, 7, 11, 5, 9].map((h, i) => (
                        <div key={i} style={{
                            width: 3, height: h,
                            background: '#4299e1', borderRadius: 2, opacity: 0.7,
                        }} />
                    ))}
                </div>
            </div>

            {/* Video controls bar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 36,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8,
            }}>
                <span style={{ fontSize: 14, cursor: 'pointer' }}>▶️</span>
                <div style={{
                    flex: 1, height: 3, background: 'rgba(255,255,255,0.2)',
                    borderRadius: 2, position: 'relative',
                }}>
                    <div style={{
                        width: '35%', height: '100%',
                        background: '#4299e1', borderRadius: 2,
                    }} />
                </div>
                <span style={{ color: '#a0aec0', fontSize: 10, fontFamily: 'monospace' }}>12:34</span>
                <span style={{ fontSize: 12, cursor: 'pointer' }}>🔊</span>
                <span style={{ fontSize: 12, cursor: 'pointer' }}>⛶</span>
            </div>

            {/* Download CTA overlay */}
            <div
                onClick={onPlayClick}
                style={{
                    position: 'absolute', bottom: 50, left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)',
                    color: '#fff', padding: '10px 24px',
                    borderRadius: 6, fontWeight: 700, fontSize: 14,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 20px rgba(49,130,206,0.6)',
                    border: '1px solid #4299e1',
                    transition: 'transform 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-50%) scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%)'}
            >
                ⬇️ ดาวน์โหลด TradingView-AI.apk ฟรี!
            </div>
        </div>
    );
}

export default function WebsiteFrame({
    content, redFlags, showRedFlags, uiTriggers, onTrigger, disabled,
}: Props) {
    const downloadTrigger = uiTriggers.fail_triggers.find(t => t.type === 'download_button');
    const reportTrigger = uiTriggers.pass_triggers.find(t => t.type === 'report_button');
    const closeTabTrigger = uiTriggers.pass_triggers.find(t => t.type === 'close_tab');

    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            background: '#0f0f0f', overflow: 'hidden',
        }}>
            {/* ── Browser Chrome ── */}
            <div style={{
                background: '#1e1e1e',
                borderBottom: '1px solid #333',
                flexShrink: 0,
            }}>
                {/* Title bar */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    height: 32, paddingLeft: 12, borderBottom: '1px solid #333',
                }}>
                    {['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => (
                        <div key={i} 
                             onClick={() => { if (i === 0 && !disabled && closeTabTrigger) onTrigger(closeTabTrigger, true); }}
                             style={{
                                width: 12, height: 12, borderRadius: '50%',
                                background: c, marginRight: 6,
                                cursor: i === 0 && closeTabTrigger && !disabled ? 'pointer' : 'default',
                        }} />
                    ))}
                    <span style={{
                        flex: 1, textAlign: 'center', color: '#888',
                        fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif',
                    }}>TradingView — Advanced Financial Visualization</span>
                </div>

                {/* Tab bar */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: 34, paddingLeft: 8 }}>
                    <div style={{
                        background: '#0f0f0f', borderRadius: '6px 6px 0 0',
                        padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6,
                        border: '1px solid #333', borderBottom: 'none',
                    }}>
                        <span style={{ fontSize: 13 }}>📈</span>
                        <span style={{
                            color: '#e2e8f0', fontSize: 12,
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}>TradingView</span>
                    </div>
                </div>

                {/* Address bar */}
                <div style={{
                    padding: '6px 10px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: '1px solid #333',
                }}>
                    <span style={{ color: '#888', fontSize: 14, cursor: 'pointer' }}>←</span>
                    <span style={{ color: '#888', fontSize: 14, cursor: 'pointer' }}>→</span>
                    <span style={{ color: '#888', fontSize: 14, cursor: 'pointer' }}>↻</span>
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 6,
                        background: '#2d2d2d', borderRadius: 20, padding: '5px 12px',
                        border: '1px solid #444',
                    }}>
                        <span style={{ color: '#f6c90e', fontSize: 12 }}>⚠️</span>
                        <span style={{
                            color: '#f6c90e', fontSize: 12,
                            fontFamily: 'Inter, system-ui, sans-serif',
                            flex: 1,
                        }}>
                            tradingview-global-beta.net/ai-bot-launch
                        </span>
                    </div>
                    <span style={{ color: '#888', fontSize: 14 }}>☆</span>
                    <span style={{ color: '#888', fontSize: 14 }}>⋮</span>
                </div>
            </div>

            {/* ── Page Content ── */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#131722' }}>
                {/* Nav bar mimicking TradingView */}
                <div style={{
                    background: '#1e222d',
                    borderBottom: '1px solid #2a2e39',
                    padding: '0 20px',
                    display: 'flex', alignItems: 'center',
                    height: 44, gap: 24,
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 18 }}>📈</span>
                        <span style={{
                            color: '#2196f3', fontWeight: 700, fontSize: 15,
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}>TradingView</span>
                        <span style={{
                            background: '#e53e3e', color: '#fff', fontSize: 9,
                            fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}>BETA</span>
                    </div>
                    {['Chart', 'Screener', 'News', 'Ideas', 'Scripts'].map(item => (
                        <span key={item} style={{
                            color: '#787b86', fontSize: 13, cursor: 'pointer',
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}>{item}</span>
                    ))}
                    <div style={{ flex: 1 }} />
                    <div style={{
                        background: '#2196f3', color: '#fff', fontSize: 12,
                        fontWeight: 600, padding: '6px 16px', borderRadius: 4,
                        fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer',
                    }}>Get Started — Free</div>
                </div>

                {/* Hero Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
                    padding: '24px 32px 0',
                    borderBottom: '1px solid #2a2e39',
                }}>
                    <div style={{ display: 'flex', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                        {/* Left: Video */}
                        <div style={{ flex: 1.4 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                            }}>
                                <div style={{
                                    background: '#e53e3e', color: '#fff',
                                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    animation: 'pulse 2s ease-in-out infinite',
                                }}>🔴 LIVE NOW</div>
                                <span style={{
                                    color: '#787b86', fontSize: 12,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}>Official Product Launch — AI Trading Bot (Beta)</span>
                            </div>

                            <FakeVideoPlayer onPlayClick={() => { if (!disabled && downloadTrigger) onTrigger(downloadTrigger, false); }} />

                            {/* Message Content */}
                            <div style={{
                                marginTop: 14,
                                padding: '12px 16px',
                                background: '#1e222d', borderRadius: 8,
                                border: '1px solid #2a2e39',
                                color: '#c9d1d9', fontSize: 13, lineHeight: 1.7,
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}>
                                <ClickableContent
                                    content={content}
                                    redFlags={redFlags}
                                    showRedFlags={showRedFlags}
                                    inlineLinks={uiTriggers.fail_triggers.filter(t => t.type === 'inline_link')}
                                    onTrigger={onTrigger}
                                    disabled={disabled}
                                />
                            </div>

                            {/* Download & Close buttons */}
                            <div style={{ display: 'flex', gap: 10, marginTop: 14, paddingBottom: 24 }}>
                                {/* Download — dangerous */}
                                {downloadTrigger && (
                                    <button
                                        disabled={disabled}
                                        onClick={() => onTrigger(downloadTrigger, false)}
                                        style={{
                                            flex: 1, padding: '12px 0',
                                            background: disabled ? '#2d3748' : 'linear-gradient(135deg, #2b6cb0, #2196f3)',
                                            color: '#fff', border: 'none', borderRadius: 6,
                                            fontSize: 14, fontWeight: 700,
                                            fontFamily: 'Inter, system-ui, sans-serif',
                                            cursor: disabled ? 'default' : 'pointer',
                                            opacity: disabled ? 0.5 : 1,
                                            transition: 'opacity 0.15s',
                                            boxShadow: disabled ? 'none' : '0 4px 20px rgba(33,150,243,0.4)',
                                        }}
                                    >
                                        ⬇️ {downloadTrigger.label}
                                    </button>
                                )}
                                {/* Report/Close — safe */}
                                {reportTrigger && (
                                    <button
                                        disabled={disabled}
                                        onClick={() => onTrigger(reportTrigger, true)}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'transparent',
                                            color: '#787b86', border: '1px solid #2a2e39', borderRadius: 6,
                                            fontSize: 13, fontWeight: 600,
                                            fontFamily: 'Inter, system-ui, sans-serif',
                                            cursor: disabled ? 'default' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                        }}
                                        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.borderColor = '#ff6b6b'; } }}
                                        onMouseLeave={e => { e.currentTarget.style.color = '#787b86'; e.currentTarget.style.borderColor = '#2a2e39'; }}
                                    >
                                        🚨 {reportTrigger.label}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Chart widget */}
                        <div style={{ width: 220, flexShrink: 0 }}>
                            <div style={{
                                background: '#1e222d', borderRadius: 8,
                                border: '1px solid #2a2e39', padding: '14px',
                                marginBottom: 12,
                            }}>
                                <div style={{
                                    color: '#c9d1d9', fontSize: 13, fontWeight: 600, marginBottom: 4,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}>BTCUSDT</div>
                                <div style={{
                                    color: '#26a69a', fontSize: 22, fontWeight: 700, marginBottom: 2,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}>$94,210.50</div>
                                <div style={{ color: '#26a69a', fontSize: 12 }}>▲ +3.42%</div>
                                <FakeChart />
                            </div>
                            <div style={{
                                background: '#1e222d', borderRadius: 8,
                                border: '1px solid #2a2e39', padding: '14px',
                            }}>
                                <div style={{
                                    color: '#c9d1d9', fontSize: 13, fontWeight: 600, marginBottom: 4,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}>ETHUSDT</div>
                                <div style={{
                                    color: '#ef5350', fontSize: 22, fontWeight: 700, marginBottom: 2,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}>$1,802.30</div>
                                <div style={{ color: '#ef5350', fontSize: 12 }}>▼ -1.18%</div>
                                <FakeChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust badges bar */}
                <div style={{
                    background: '#1e222d', padding: '10px 32px',
                    display: 'flex', justifyContent: 'center', gap: 32,
                    borderBottom: '1px solid #2a2e39', flexWrap: 'wrap',
                }}>
                    {['✅ ผลตอบแทน 300%+ ต่อปี', '🔒 ระบบ AI ปลอดภัยระดับ Military', '⚡ 500 ที่นั่งแรกเท่านั้น!', '🏆 CEO แนะนำโดยตรง'].map(t => (
                        <span key={t} style={{
                            color: '#787b86', fontSize: 12,
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}>{t}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
