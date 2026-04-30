import type { UiTrigger, UiTriggers, RedFlag } from '../types';
import RedFlagHighlighter from './RedFlagHighlighter';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function SignalIcon() {
    return (
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
            <rect x="0" y="6" width="3" height="6" rx="1" />
            <rect x="4.5" y="4" width="3" height="8" rx="1" />
            <rect x="9" y="2" width="3" height="10" rx="1" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3" />
        </svg>
    );
}
function WifiIcon() {
    return (
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
            <path d="M8 6C6.1 6 4.4 6.8 3.2 8l1.4 1.4C5.5 8.6 6.7 8 8 8s2.5.6 3.4 1.4L12.8 8C11.6 6.8 9.9 6 8 6z" opacity="0.8" />
            <path d="M8 2C5 2 2.3 3.3 0.4 5.5L1.8 7C3.3 5.1 5.5 4 8 4s4.7 1.1 6.2 3l1.4-1.5C13.7 3.3 11 2 8 2z" opacity="0.5" />
        </svg>
    );
}
function BatteryIcon() {
    return (
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
            <rect x="2" y="2" width="17" height="8" rx="2" opacity="0.9" />
            <path d="M23 4v4a2 2 0 0 0 0-4z" />
        </svg>
    );
}

// ── Inline-clickable content renderer ─────────────────────────────────────────
// Turns URLs in the message into tappable blue links that trigger a choice
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
    // URL regex
    const urlRe = /(https?:\/\/[^\s]+)/g;

    // If red flags are shown, delegate to RedFlagHighlighter (no clickable links to avoid conflict)
    if (showRedFlags) {
        return <RedFlagHighlighter content={content} redFlags={redFlags} showRedFlags={showRedFlags} />;
    }

    // Split on URLs
    const parts = content.split(urlRe);
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {parts.map((part, i) => {
                if (urlRe.test(part) || part.startsWith('http')) {
                    return (
                        <span
                            key={i}
                            onClick={() => {
                                if (disabled) return;
                                const failTrigger = inlineLinks.find(t => t.label === part || part.includes(t.label)) || inlineLinks[0];
                                if (failTrigger) onTrigger(failTrigger, false);
                            }}
                            style={{
                                color: '#007aff',
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

interface Props {
    sender: string;
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
    uiTriggers: UiTriggers;
    onTrigger: (trigger: UiTrigger, isPass: boolean) => void;
    disabled: boolean;
}

export default function PhoneFrame({
    sender, content, redFlags, showRedFlags, uiTriggers, onTrigger, disabled,
}: Props) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const displayName = sender.length > 22 ? sender.slice(0, 20) + '…' : sender;

    const inlineLinks = uiTriggers.fail_triggers.filter(t => t.type === 'inline_link');
    const backTrigger = uiTriggers.pass_triggers.find(t => t.type === 'back_button');

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
        }}>
            {/* ── Outer phone shell ── */}
            <div style={{
                /* Keep iPhone 15 Pro aspect ratio: 393 × 852 */
                aspectRatio: '393 / 852',
                height: 'min(calc(100vh - 160px), 852px)',
                width: 'auto',
                minHeight: 560,
                borderRadius: 54,
                background: '#1c1c1e',
                boxShadow: 'inset 0 0 0 1px #3a3a3c, 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px #000',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
            }}>
                {/* Side buttons (decorative) */}
                {[
                    { side: 'left', top: 100, h: 32 },
                    { side: 'left', top: 145, h: 64 },
                    { side: 'left', top: 222, h: 64 },
                    { side: 'right', top: 160, h: 80 },
                ].map(({ side, top, h }, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        [side]: -3,
                        top,
                        width: 3,
                        height: h,
                        background: '#3a3a3c',
                        borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
                    }} />
                ))}

                {/* ── Screen ── */}
                <div style={{
                    margin: 10,
                    borderRadius: 46,
                    overflow: 'hidden',
                    background: '#fff',
                    height: 'calc(100% - 20px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Status Bar */}
                    <div style={{
                        background: '#f2f2f7',
                        paddingTop: 14,
                        paddingBottom: 4,
                        paddingLeft: 28,
                        paddingRight: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                        position: 'relative',
                    }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#1c1c1e', fontFamily: '-apple-system, SF Pro Display, sans-serif' }}>
                            {time}
                        </span>
                        {/* Dynamic Island */}
                        <div style={{
                            position: 'absolute',
                            top: 14, left: '50%', transform: 'translateX(-50%)',
                            width: 120, height: 34,
                            background: '#000', borderRadius: 20, zIndex: 10,
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1c1c1e' }}>
                            <SignalIcon /><WifiIcon /><BatteryIcon />
                        </div>
                    </div>

                    {/* iOS Messages Header */}
                    <div style={{
                        background: '#f2f2f7',
                        borderBottom: '0.5px solid #c6c6c8',
                        padding: '4px 16px 12px',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                            <button
                                onClick={() => { if (!disabled && backTrigger) onTrigger(backTrigger, true); }}
                                style={{
                                    background: 'none', border: 'none', cursor: (!disabled && backTrigger) ? 'pointer' : 'default',
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    color: '#007aff', padding: 0,
                                    opacity: disabled && backTrigger ? 0.5 : 1,
                            }}>
                                <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
                                    <path d="M8.5 1 L1.5 8.5 L8.5 16" stroke="#007aff" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span style={{
                                    fontSize: 13, fontWeight: 600,
                                    background: '#007aff', color: '#fff',
                                    borderRadius: 10, padding: '1px 7px',
                                }}>19</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: '50%', background: '#c7c7cc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28,
                            }}>👤</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1c1e', fontFamily: '-apple-system, SF Pro Text, sans-serif' }}>
                                    {displayName}
                                </span>
                                <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                                    <path d="M1 1 L6 5.5 L1 10" stroke="#007aff" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 12, color: '#8e8e93', fontFamily: '-apple-system, SF Pro Text, sans-serif' }}>
                                Text Message
                            </span>
                        </div>
                    </div>

                    {/* Message Area — scrollable */}
                    <div style={{
                        background: '#fff',
                        flex: 1,
                        padding: '16px 12px 8px',
                        overflowY: 'auto',
                    }}>
                        {/* Date stamp */}
                        <div style={{
                            textAlign: 'center', color: '#8e8e93', fontSize: 12,
                            marginBottom: 14, fontFamily: '-apple-system, SF Pro Text, sans-serif',
                        }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {/* Incoming bubble */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%', background: '#c7c7cc',
                                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, marginBottom: 2,
                            }}>👤</div>
                            <div style={{
                                background: '#e5e5ea',
                                borderRadius: '18px 18px 18px 4px',
                                padding: '10px 14px',
                                maxWidth: '80%',
                                fontSize: 15,
                                lineHeight: 1.5,
                                color: '#1c1c1e',
                                fontFamily: '-apple-system, SF Pro Text, sans-serif',
                            }}>
                                <ClickableContent
                                    content={content}
                                    redFlags={redFlags}
                                    showRedFlags={showRedFlags}
                                    inlineLinks={inlineLinks}
                                    onTrigger={onTrigger}
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                        <p style={{
                            fontSize: 11, color: '#8e8e93', marginLeft: 40, marginTop: 5,
                            fontFamily: '-apple-system, SF Pro Text, sans-serif',
                        }}>{time}</p>

                        {/* ── Native iOS Report/Delete Link ── */}
                        {uiTriggers.pass_triggers.filter(t => t.type !== 'back_button').length > 0 && (
                            <div style={{
                                marginTop: 32, textAlign: 'center', fontSize: 13,
                                fontFamily: '-apple-system, SF Pro Text, sans-serif',
                                color: '#8e8e93', borderTop: '0.5px solid #c6c6c8', paddingTop: 14,
                                display: 'flex', flexDirection: 'column', gap: 6,
                            }}>
                                <span>ผู้ส่งคนนี้ไม่อยู่ในรายชื่อผู้ติดต่อของคุณ</span>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 4 }}>
                                    {uiTriggers.pass_triggers.filter(t => t.type !== 'back_button').map(t => (
                                        <span
                                            key={t.label}
                                            onClick={() => { if (!disabled) onTrigger(t, true); }}
                                            style={{
                                                color: '#007aff', fontWeight: 400,
                                                cursor: disabled ? 'default' : 'pointer',
                                                opacity: disabled ? 0.4 : 1,
                                            }}
                                        >
                                            {t.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* iOS Input Bar */}
                    <div style={{
                        background: '#f2f2f7',
                        borderTop: '0.5px solid #c6c6c8',
                        padding: '8px 12px 10px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        flexShrink: 0,
                    }}>
                        <div style={{
                            background: '#fff', border: '0.5px solid #c6c6c8',
                            borderRadius: 20, padding: '8px 14px', flex: 1,
                            fontSize: 16, color: '#c7c7cc',
                            fontFamily: '-apple-system, SF Pro Text, sans-serif',
                        }}>iMessage</div>
                        <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: '#007aff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                <path d="M8 13V3M4 7l4-5 4 5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div style={{
                        background: '#f2f2f7', paddingBottom: 8,
                        display: 'flex', justifyContent: 'center', paddingTop: 6, flexShrink: 0,
                    }}>
                        <div style={{ width: 134, height: 5, borderRadius: 3, background: '#1c1c1e', opacity: 0.2 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
