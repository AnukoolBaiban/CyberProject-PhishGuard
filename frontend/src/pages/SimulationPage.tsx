import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import PhoneFrame from '../components/PhoneFrame';
import BrowserFrame from '../components/BrowserFrame';
import WebsiteFrame from '../components/WebsiteFrame';
import ChatFrame from '../components/ChatFrame';
import FeedbackPopup from '../components/FeedbackPopup';
import type { UiTrigger } from '../types';

const pageVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.3 } },
};

export default function SimulationPage() {
    const navigate = useNavigate();
    const nickname = sessionStorage.getItem('pg_nickname') ?? 'ไม่ระบุชื่อ';
    const {
        currentScenario, currentIndex, totalScenarios, score,
        answers, loading, error, isFinished,
        submitTrigger, nextScenario,
    } = useSimulation();

    const [showRedFlags, setShowRedFlags] = useState(false);
    const [showHint, setShowHint] = useState(false);
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
        setShowHint(false);
        setChoiceDisabled(false);
    }, [currentIndex]);

    const handleTrigger = async (trigger: UiTrigger, isPass: boolean) => {
        if (choiceDisabled) return;
        setChoiceDisabled(true);
        const isCorrect = await submitTrigger(nickname, trigger.label, isPass);
        setFeedback({ isCorrect, explanation: currentScenario?.explanation || '' });
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
                    <p className="text-cyber-muted font-mono">กำลังโหลดสถานการณ์...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="cyber-card p-8 max-w-sm text-center space-y-4">
                    <p className="text-4xl">🔴</p>
                    <h2 className="text-cyber-red font-bold text-xl">เชื่อมต่อไม่สำเร็จ</h2>
                    <p className="text-cyber-muted text-sm">{error}</p>
                    <p className="text-cyber-muted text-xs">โปรดตรวจสอบว่า FastAPI backend กำลังทำงานอยู่ที่พอร์ต 8000</p>
                    <button onClick={() => navigate('/')} className="cyber-btn-ghost w-full">← กลับหน้าหลัก</button>
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
                        <span className="ml-2 text-cyber-muted text-xs">ผู้เล่น: {nickname}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="text-right">
                        <span className="block text-xs text-cyber-muted font-mono">คะแนน</span>
                        <span className="font-bold text-cyber-green font-mono text-lg">
                            {score}/{currentIndex}
                        </span>
                    </div>
                    {/* Scenario counter */}
                    <div className="text-right">
                        <span className="block text-xs text-cyber-muted font-mono">สถานการณ์</span>
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
                {/* Scenario type badge + Hint + Red Flag toggle */}
                <div className="flex items-center gap-3 w-full justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border
                                ${currentScenario.category === 'SMS' || currentScenario.category === 'CHAT'
                                    ? 'border-cyber-green/40 text-cyber-green bg-cyber-green/10'
                                    : 'border-cyber-accent/40 text-cyber-accent bg-cyber-accent/10'
                                }`}
                        >
                            {currentScenario.category === 'SMS' ? '📱 SMS' : currentScenario.category === 'CHAT' ? '💬 CHAT' : currentScenario.category === 'WEBSITE' ? '🌐 WEB' : '📧 EMAIL'}
                        </span>
                        <span className="text-cyber-muted text-xs hidden sm:block">
                            ข้อความนี้น่าเชื่อถือหรือไม่? ลองกดดู
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {currentScenario.hint_message && (
                            <button
                                onClick={() => setShowHint(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-cyber-border text-cyber-muted hover:border-[#ff9800] hover:text-[#ff9800] transition-all duration-200"
                            >
                                💡 ขอคำใบ้
                            </button>
                        )}
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
                            🚩 {showRedFlags ? 'ซ่อน' : 'แสดง'}จุดน่าสงสัย
                        </button>
                    </div>
                </div>

                {/* Hint Message Box */}
                {showHint && currentScenario.hint_message && (
                    <div className="w-full bg-[#ff9800]/10 border border-[#ff9800]/40 rounded-xl p-4 flex gap-3 text-[#ffb74d] text-sm animate-in fade-in slide-in-from-top-2">
                        <span className="text-lg">💡</span>
                        <div>
                            <span className="font-bold block mb-1">คำใบ้:</span>
                            {currentScenario.hint_message}
                        </div>
                    </div>
                )}

                {/* Device Frame — fills remaining space */}
                <div className={`flex-1 flex overflow-hidden ${currentScenario.category === 'SMS' || currentScenario.category === 'CHAT' ? 'justify-center' : 'w-full'}`} style={{ minHeight: 0 }}>
                    {currentScenario.category === 'SMS' ? (
                        <PhoneFrame
                            sender={currentScenario.sender_name}
                            content={currentScenario.content_body}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            uiTriggers={currentScenario.ui_triggers}
                            onTrigger={handleTrigger}
                            disabled={choiceDisabled}
                        />
                    ) : currentScenario.category === 'WEBSITE' ? (
                        <WebsiteFrame
                            sender={currentScenario.sender_name}
                            subject={currentScenario.title}
                            content={currentScenario.content_body}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            uiTriggers={currentScenario.ui_triggers}
                            onTrigger={handleTrigger}
                            disabled={choiceDisabled}
                        />
                    ) : currentScenario.category === 'CHAT' ? (
                        <ChatFrame
                            sender={currentScenario.sender_name}
                            content={currentScenario.content_body}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            uiTriggers={currentScenario.ui_triggers}
                            onTrigger={handleTrigger}
                            disabled={choiceDisabled}
                        />
                    ) : (
                        <BrowserFrame
                            sender={currentScenario.sender_name}
                            subject={currentScenario.title}
                            content={currentScenario.content_body}
                            redFlags={currentScenario.red_flags}
                            showRedFlags={showRedFlags}
                            uiTriggers={currentScenario.ui_triggers}
                            onTrigger={handleTrigger}
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
