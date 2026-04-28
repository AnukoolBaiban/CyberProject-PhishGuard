import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import PhoneFrame from '../components/PhoneFrame';
import BrowserFrame from '../components/BrowserFrame';
import WebsiteFrame from '../components/WebsiteFrame';
import FeedbackPopup from '../components/FeedbackPopup';

const pageVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.3 } },
};

export default function SimulationPage() {
    const navigate = useNavigate();
    const nickname = sessionStorage.getItem('pg_nickname') ?? 'Anonymous';
    const {
        currentScenario, currentIndex, totalScenarios, score,
        answers, loading, error, isFinished,
        submitChoice, nextScenario,
    } = useSimulation();

    const [showRedFlags, setShowRedFlags] = useState(false);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [choiceDisabled, setChoiceDisabled] = useState(false);

    // Navigate to summary when finished
    useEffect(() => {
        if (isFinished) {
            sessionStorage.setItem('pg_score', String(score));
            sessionStorage.setItem('pg_total', String(totalScenarios));
            sessionStorage.setItem('pg_answers', JSON.stringify(answers));
            navigate('/summary');
        }
    }, [isFinished, score, totalScenarios, answers, navigate]);

    // Reset red flags per scenario
    useEffect(() => {
        setShowRedFlags(false);
        setChoiceDisabled(false);
    }, [currentIndex]);

    const handleChoice = async (label: string) => {
        if (choiceDisabled) return;
        setChoiceDisabled(true);
        const isCorrect = await submitChoice(nickname, label);
        const choice = currentScenario?.choices.find((c) => c.label === label);
        if (choice) setFeedback({ isCorrect, explanation: choice.explanation });
    };

    const handleNext = () => {
        setFeedback(null);
        nextScenario();
    };

    // ── Loading / Error states ──────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-cyber-accent border-t-transparent rounded-full
                          animate-spin mx-auto" />
                    <p className="text-cyber-muted font-mono">Loading scenarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="cyber-card p-8 max-w-sm text-center space-y-4">
                    <p className="text-4xl">🔴</p>
                    <h2 className="text-cyber-red font-bold text-xl">Connection Failed</h2>
                    <p className="text-cyber-muted text-sm">{error}</p>
                    <p className="text-cyber-muted text-xs">Make sure the FastAPI backend is running at port 8000.</p>
                    <button onClick={() => navigate('/')} className="cyber-btn-ghost w-full">← Back to Home</button>
                </div>
            </div>
        );
    }

    if (!currentScenario) return null;

    const progress = ((currentIndex) / totalScenarios) * 100;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-screen flex flex-col grid-bg overflow-hidden"
        >
            {/* Top Bar */}
            <header className="border-b border-cyber-border bg-cyber-surface/80 backdrop-blur-sm px-6 py-4
                         flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                        <span className="font-bold text-cyber-accent font-mono">PhishGuard</span>
                        <span className="ml-2 text-cyber-muted text-xs">as {nickname}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="text-right">
                        <span className="block text-xs text-cyber-muted font-mono">Score</span>
                        <span className="font-bold text-cyber-green font-mono text-lg">
                            {score}/{currentIndex}
                        </span>
                    </div>
                    {/* Scenario counter */}
                    <div className="text-right">
                        <span className="block text-xs text-cyber-muted font-mono">Scenario</span>
                        <span className="font-bold text-cyber-text font-mono text-lg">
                            {currentIndex + 1}/{totalScenarios}
                        </span>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1 bg-cyber-surface">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyber-accent to-cyber-green"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden px-4 pt-3 pb-4 gap-3" style={{ minHeight: 0 }}>
                {/* Scenario type badge + Red Flag toggle */}
                <div className="flex items-center gap-3 w-full justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border
                ${currentScenario.type === 'sms'
                                    ? 'border-cyber-green/40 text-cyber-green bg-cyber-green/10'
                                    : 'border-cyber-accent/40 text-cyber-accent bg-cyber-accent/10'
                                }`}
                        >
                            {currentScenario.type === 'sms' ? '📱 SMS' : '📧 Email'}
                        </span>
                        <span className="text-cyber-muted text-xs hidden sm:block">
                            Is this message legitimate?
                        </span>
                    </div>

                    <button
                        id="red-flag-btn"
                        onClick={() => setShowRedFlags((v) => !v)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        border transition-all duration-200
                        ${showRedFlags
                                ? 'border-cyber-red text-cyber-red bg-cyber-red/10'
                                : 'border-cyber-border text-cyber-muted hover:border-cyber-red hover:text-cyber-red'
                            }`}
                    >
                        🚩 {showRedFlags ? 'Hide' : 'Show'} Red Flags
                    </button>
                </div>

                {/* Device Frame — fills remaining space */}
                <div className={`flex-1 flex overflow-hidden ${currentScenario.type === 'sms' ? 'justify-center' : 'w-full'}`} style={{ minHeight: 0 }}>
                    {currentScenario.type === 'sms' ? (
                        <PhoneFrame
                            sender={currentScenario.sender}
                            content={currentScenario.content}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            choices={currentScenario.choices}
                            onChoice={handleChoice}
                            disabled={choiceDisabled}
                        />
                    ) : currentScenario.type === 'website' ? (
                        <WebsiteFrame
                            sender={currentScenario.sender}
                            subject={currentScenario.subject}
                            content={currentScenario.content}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            choices={currentScenario.choices}
                            onChoice={handleChoice}
                            disabled={choiceDisabled}
                        />
                    ) : (
                        <BrowserFrame
                            sender={currentScenario.sender}
                            subject={currentScenario.subject}
                            content={currentScenario.content}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            choices={currentScenario.choices}
                            onChoice={handleChoice}
                            disabled={choiceDisabled}
                        />
                    )}
                </div>
            </main>

            {/* Feedback Popup */}
            {feedback && (
                <FeedbackPopup
                    isCorrect={feedback.isCorrect}
                    explanation={feedback.explanation}
                    onNext={handleNext}
                />
            )}
        </motion.div>
    );
}
