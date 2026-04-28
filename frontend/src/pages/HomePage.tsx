import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function HomePage() {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (!nickname.trim()) {
            setError('Enter your nickname to begin.');
            return;
        }
        sessionStorage.setItem('pg_nickname', nickname.trim());
        navigate('/simulation');
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 relative overflow-hidden"
        >
            {/* Ambient glow orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />

            {/* Logo / Hero */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-12"
            >
                {/* Shield icon */}
                <div className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-cyber-accent/10 border-2 border-cyber-accent/40
                        flex items-center justify-center text-5xl animate-float border-glow">
                    🛡️
                </div>

                <h1 className="text-6xl font-extrabold tracking-tight mb-3">
                    <span className="text-cyber-accent text-glow">Phish</span>
                    <span className="text-cyber-text">Guard</span>
                </h1>
                <p className="text-cyber-muted text-lg max-w-md mx-auto leading-relaxed">
                    Train your cyber instincts. Detect phishing attempts before they get you.
                </p>

                {/* Stats row */}
                <div className="flex justify-center gap-8 mt-6">
                    {[
                        { label: 'Scenarios', value: '3+' },
                        { label: 'Threat Types', value: 'SMS & Email' },
                        { label: 'Your Shield', value: 'Awaits' },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-cyber-accent font-bold font-mono text-xl">{s.value}</div>
                            <div className="text-cyber-muted text-xs mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Input Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="cyber-card w-full max-w-md p-8 space-y-5 border-glow"
            >
                <div>
                    <label htmlFor="nickname" className="block text-sm font-semibold text-cyber-text mb-2 font-mono">
                        {'>'} Enter your nickname
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => { setNickname(e.target.value); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        placeholder="e.g. CyberWolf99"
                        maxLength={30}
                        className="cyber-input"
                        autoComplete="off"
                    />
                    {error && (
                        <p className="text-cyber-red text-xs mt-2 font-mono">⚠ {error}</p>
                    )}
                </div>

                <button
                    id="start-simulation-btn"
                    onClick={handleStart}
                    className="cyber-btn-primary w-full text-base flex items-center justify-center gap-2"
                >
                    <span>Start Simulation</span>
                    <span>→</span>
                </button>

                <p className="text-center text-cyber-muted text-xs">
                    No account needed. Your progress is saved anonymously.
                </p>
            </motion.div>

            {/* Feature hints */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap justify-center gap-3 text-xs text-cyber-muted"
            >
                {['🚩 Red Flag Highlighter', '📊 Digital Immunity Score', '💡 Instant Feedback'].map((f) => (
                    <span key={f} className="px-3 py-1.5 border border-cyber-border rounded-full bg-cyber-surface">
                        {f}
                    </span>
                ))}
            </motion.div>
        </motion.div>
    );
}
