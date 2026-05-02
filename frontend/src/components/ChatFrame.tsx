import type { UiTrigger, UiTriggers, RedFlag } from '../types';
import RedFlagHighlighter from './RedFlagHighlighter';

interface Props {
    sender: string;
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
                                color: '#0052cc',
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

export default function ChatFrame({
    sender, content, redFlags, showRedFlags, uiTriggers, onTrigger, disabled,
}: Props) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const inlineLinks = uiTriggers.fail_triggers.filter(t => t.type === 'inline_link');

    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '12px 0',
        }}>
            <div style={{
                aspectRatio: '393 / 852', height: 'min(calc(100vh - 160px), 852px)',
                width: 'auto', minHeight: 560,
                background: '#849ebf',
                boxShadow: 'inset 0 0 0 1px #6c88a8, 0 40px 80px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden', borderRadius: 54,
            }}>
                {/* Header */}
                <div style={{
                    background: '#20262e', color: '#fff',
                    padding: '44px 16px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: '1px solid #1a1e24', flexShrink: 0,
                }}>
                    <span style={{ fontSize: 20, cursor: 'pointer', opacity: 0.8 }} onClick={() => {
                         const backTrigger = uiTriggers.pass_triggers.find(t => t.type === 'back_button');
                         if (backTrigger && !disabled) onTrigger(backTrigger, true);
                    }}>←</span>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#00c300', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        📱
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{sender}</span>
                        <span style={{ fontSize: 11, opacity: 0.6 }}>Official Account</span>
                    </div>
                    <span style={{ fontSize: 20, opacity: 0.8 }}>≡</span>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ textAlign: 'center', margin: '8px 0', opacity: 0.6 }}>
                        <span style={{ background: 'rgba(0,0,0,0.15)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 12 }}>Today</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00c300', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                            📱
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 11, color: '#eef', marginLeft: 4 }}>{sender}</span>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                <div style={{
                                    background: '#fff', color: '#111', padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                                    fontSize: 14, lineHeight: 1.5, maxWidth: 240, wordBreak: 'break-word',
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
                                <span style={{ fontSize: 10, color: '#eef', opacity: 0.7 }}>{time}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Pass Triggers (Block / Report) */}
                <div style={{ background: '#fff', padding: '16px 20px 34px', display: 'flex', gap: 12, justifyContent: 'center', borderTop: '1px solid #ddd', flexShrink: 0 }}>
                    {uiTriggers.pass_triggers.filter(t => t.type !== 'back_button').map(t => (
                        <button
                            key={t.label}
                            disabled={disabled}
                            onClick={() => onTrigger(t, true)}
                            style={{
                                flex: 1, padding: '12px 0', borderRadius: 8, border: 'none',
                                background: t.type === 'report_button' ? '#ffebeb' : '#f0f0f0',
                                color: t.type === 'report_button' ? '#d32f2f' : '#333',
                                fontSize: 15, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
                                opacity: disabled ? 0.5 : 1,
                            }}
                        >
                            {t.type === 'block_button' ? '🚫 ' : t.type === 'report_button' ? '🚨 ' : ''}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
