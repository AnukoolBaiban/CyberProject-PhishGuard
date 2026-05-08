import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isCorrect: boolean;
    explanation: string;
    onNext: () => void;
}

export default function FeedbackPopup({ isCorrect, explanation, onNext }: Props) {
    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            >
                {/* Card */}
                <motion.div
                    key="card"
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="cyber-card max-w-md w-full p-6 space-y-5 text-center"
                    style={{
                        boxShadow: isCorrect
                            ? '0 0 40px rgba(0,255,157,0.2), 0 0 80px rgba(0,255,157,0.05)'
                            : '0 0 40px rgba(255,59,92,0.2), 0 0 80px rgba(255,59,92,0.05)',
                    }}
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${isCorrect
                                ? 'bg-cyber-green/15 border-2 border-cyber-green'
                                : 'bg-cyber-red/15 border-2 border-cyber-red'
                            }`}
                    >
                        {isCorrect ? '✅' : '❌'}
                    </motion.div>

                    {/* Title */}
                    <div>
                        <h2
                            className={`text-2xl font-bold mb-1 ${isCorrect ? 'text-cyber-green' : 'text-cyber-red'
                                }`}
                        >
                            {isCorrect ? 'รอดภัยคุกคามได้สำเร็จ! 🎉' : 'ตกเป็นเหยื่อภัยคุกคาม! ⚠️'}
                        </h2>
                        <p className="text-xs font-mono uppercase tracking-widest text-cyber-muted">
                            {isCorrect ? 'ตอบสนองถูกต้อง' : 'ตอบสนองไม่ถูกต้อง'}
                        </p>
                    </div>

                    {/* Explanation */}
                    <p className="text-cyber-text text-sm leading-relaxed bg-cyber-surface rounded-xl p-4 border border-cyber-border text-left">
                        {explanation}
                    </p>

                    {/* Next Button */}
                    <button
                        onClick={onNext}
                        className="cyber-btn-primary w-full text-base"
                    >
                        สถานการณ์ถัดไป →
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
