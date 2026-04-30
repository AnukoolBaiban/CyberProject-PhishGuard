import { motion } from 'framer-motion';
import type { ImmunityLevel } from '../types';

interface Props {
    level: ImmunityLevel;
    score: number;
    total: number;
}

const CONFIG: Record<ImmunityLevel, { emoji: string; color: string; glowClass: string; desc: string }> = {
    Novice: {
        emoji: '🛡️',
        color: 'text-cyber-yellow',
        glowClass: 'border-cyber-yellow badge-glow-blue',
        desc: 'คุณเพิ่งเริ่มต้นเส้นทางไซเบอร์ซิเคียวริตี้ ฝึกต่อไปและอย่าประมาทนะ!',
    },
    Guard: {
        emoji: '⚔️',
        color: 'text-cyber-accent',
        glowClass: 'border-cyber-accent badge-glow-blue',
        desc: 'สัญชาตญาณไซเบอร์ดีมาก! ภัยส่วนใหญ่หลอกคุณไม่ได้แล้ว',
    },
    Expert: {
        emoji: '🔰',
        color: 'text-cyber-green',
        glowClass: 'border-cyber-green badge-glow-green',
        desc: 'ตรวจจับภัยคุกคามได้อย่างเชี่ยวชาญ! คุณคือนักรักษาดิจิทัลตัวจริง!',
    },
};

export function getImmunityLevel(score: number, total: number): ImmunityLevel {
    if (total === 0) return 'Novice';
    const pct = (score / total) * 100;
    if (pct >= 75) return 'Expert';
    if (pct >= 40) return 'Guard';
    return 'Novice';
}

export default function ImmunityBadge({ level, score, total }: Props) {
    const cfg = CONFIG[level];
    return (
        <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            className={`mx-auto w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center
                  bg-cyber-surface ${cfg.glowClass} animate-pulse-slow`}
        >
            <span className="text-5xl mb-1" role="img" aria-label={level}>{cfg.emoji}</span>
            <span className={`font-bold text-lg font-mono ${cfg.color}`}>{level}</span>
            <span className="text-cyber-muted text-xs mt-1 font-mono">{score}/{total} ถูกต้อง</span>
        </motion.div>
    );
}

export function ImmunityDescription({ level }: { level: ImmunityLevel }) {
    return (
        <p className="text-center text-cyber-muted text-sm mt-3 italic">
            {CONFIG[level].desc}
        </p>
    );
}
