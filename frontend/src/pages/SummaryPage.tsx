import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImmunityBadge, { getImmunityLevel, ImmunityDescription } from '../components/ImmunityBadge';
import type { Answer } from '../types';

const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
};

export default function SummaryPage() {
    const navigate = useNavigate();
    const nickname = sessionStorage.getItem('pg_nickname') ?? 'ผู้ใช้งาน';
    const score = parseInt(sessionStorage.getItem('pg_score') ?? '0', 10);
    const total = parseInt(sessionStorage.getItem('pg_total') ?? '0', 10);
    const answers: Answer[] = JSON.parse(sessionStorage.getItem('pg_answers') ?? '[]');

    const level = getImmunityLevel(score, total);
    const wrongAnswers = answers.filter((a) => !a.isCorrect);
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // Guard: if no data, redirect home
    useEffect(() => {
        if (total === 0) navigate('/');
    }, [total, navigate]);

    const handleReset = () => {
        sessionStorage.removeItem('pg_score');
        sessionStorage.removeItem('pg_total');
        sessionStorage.removeItem('pg_answers');
        navigate('/');
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-12"
        >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                      bg-cyber-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-xl space-y-6 relative">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <p className="text-cyber-muted text-sm font-mono mb-1">ภารกิจสำเร็จ — {nickname}</p>
                    <h1 className="text-4xl font-extrabold text-cyber-text">
                        รายงาน <span className="text-cyber-accent">ภูมิคุ้มกัน</span>ของคุณ
                    </h1>
                </motion.div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="cyber-card p-8 flex flex-col items-center"
                >
                    <ImmunityBadge level={level} score={score} total={total} />
                    <ImmunityDescription level={level} />

                    {/* Score bar */}
                    <div className="w-full mt-6">
                        <div className="flex justify-between text-xs text-cyber-muted font-mono mb-1">
                            <span>ความแม่นยำ</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-2 bg-cyber-surface rounded-full overflow-hidden border border-cyber-border">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyber-accent to-cyber-green rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Lessons learned */}
                {wrongAnswers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="cyber-card p-6 space-y-3"
                    >
                        <h2 className="font-bold text-cyber-text flex items-center gap-2">
                            <span>💡</span> บทเรียนที่ได้รับ
                        </h2>
                        <ul className="space-y-3">
                            {wrongAnswers.map((a, i) => (
                                <li key={a.scenarioId + i} className="flex gap-3">
                                    <span className="text-cyber-red text-lg flex-shrink-0">❌</span>
                                    <p className="text-cyber-muted text-sm leading-relaxed">{a.explanation}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* All correct message */}
                {wrongAnswers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="cyber-card p-6 text-center"
                    >
                        <p className="text-3xl mb-2">🏆</p>
                        <p className="text-cyber-green font-bold">ได้คะแนนเต็ม 100%!</p>
                        <p className="text-cyber-muted text-sm mt-1">
                            คุณตรวจจับภัยคุกคามได้ทุกข้อ คุณคือนักรักษาดิจิทัลตัวจริง!
                        </p>
                    </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <button
                        id="try-again-btn"
                        onClick={handleReset}
                        className="cyber-btn-primary flex-1 text-base text-center"
                    >
                        🔄 ลองอีกครั้ง
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="cyber-btn-ghost flex-1 text-base text-center"
                    >
                        ← หน้าหลัก
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
