import { motion } from 'framer-motion';
import type { RedFlag } from '../types';

interface Props {
    content: string;
    redFlags: RedFlag[];
    showRedFlags: boolean;
}

export default function RedFlagHighlighter({ content, redFlags, showRedFlags }: Props) {
    if (!showRedFlags || redFlags.length === 0) {
        return <span className="whitespace-pre-wrap">{content}</span>;
    }

    // Build a list of segments { text, flag? }
    type Segment = { text: string; flag?: RedFlag };
    const segments: Segment[] = [];
    let remaining = content;

    // Sort flags by position of occurrence
    const sorted = [...redFlags].sort(
        (a, b) => content.indexOf(a.text) - content.indexOf(b.text)
    );

    for (const flag of sorted) {
        const idx = remaining.indexOf(flag.text);
        if (idx === -1) continue;
        if (idx > 0) segments.push({ text: remaining.slice(0, idx) });
        segments.push({ text: flag.text, flag });
        remaining = remaining.slice(idx + flag.text.length);
    }
    if (remaining.length > 0) segments.push({ text: remaining });

    return (
        <span className="whitespace-pre-wrap">
            {segments.map((seg, i) =>
                seg.flag ? (
                    <Tooltip key={i} reason={seg.flag.reason}>
                        <motion.mark
                            initial={{ backgroundColor: 'transparent' }}
                            animate={{ backgroundColor: 'rgba(255, 59, 92, 0.3)' }}
                            className="relative cursor-help rounded px-0.5 text-cyber-red border-b-2 border-cyber-red bg-transparent"
                        >
                            {seg.text}
                        </motion.mark>
                    </Tooltip>
                ) : (
                    <span key={i}>{seg.text}</span>
                )
            )}
        </span>
    );
}

function Tooltip({ children, reason }: { children: React.ReactNode; reason: string }) {
    return (
        <span className="group relative inline-block">
            {children}
            <span
                className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48
                   -translate-x-1/2 rounded-lg border border-cyber-red/40 bg-cyber-surface
                   px-3 py-2 text-xs text-cyber-text opacity-0 shadow-lg transition-opacity
                   duration-200 group-hover:opacity-100"
            >
                ⚠️ {reason}
                {/* Arrow */}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-cyber-red/40" />
            </span>
        </span>
    );
}
