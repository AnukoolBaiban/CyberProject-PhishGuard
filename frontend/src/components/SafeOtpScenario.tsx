import React, { useState } from 'react';

type Screen = 'INBOX' | 'SMS_DETAIL';
type PopupType = 'success' | 'warning' | 'fail';

interface Popup {
    title: string;
    message: string;
    type: PopupType;
    isFinal?: boolean;
}

interface Props {
    onAction?: (label: string, isCorrect: boolean) => void;
}

export default function SafeOtpScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);

    const closePopup = () => {
        if (popup?.isFinal && onAction) {
            onAction(popup.title, popup.type === 'success');
        }
        setPopup(null);
    };

    const showPopup = (title: string, message: string, type: PopupType, isFinal: boolean = false) => {
        setPopup({ title, message, type, isFinal });
    };

    // ── Helper: Screen Shell ───────────────────────────────────────────────────
    const PhoneShell = ({ children, bg = 'bg-white' }: { children: React.ReactNode; bg?: string }) => (
        <div className="w-full h-full flex items-center justify-center py-4">
            <div className={`relative w-full max-w-[390px] h-full max-h-[844px] ${bg} rounded-[55px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col`}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50"></div>
                
                {/* Status Bar */}
                <div className="h-12 flex items-end justify-between px-8 pb-1 flex-shrink-0">
                    <span className="text-[15px] font-semibold">10:20</span>
                    <div className="flex gap-1.5 items-center">
                        <div className="w-4 h-4 rounded-sm border border-current opacity-50"></div>
                        <div className="w-4 h-4 rounded-sm border border-current opacity-50"></div>
                        <div className="w-6 h-3 rounded-sm border border-current opacity-50"></div>
                    </div>
                </div>

                {children}

                {/* Home Indicator */}
                <div className="h-8 flex justify-center items-center flex-shrink-0">
                    <div className="w-32 h-1.5 bg-black/20 rounded-full"></div>
                </div>
            </div>

            {/* Popup Modal */}
            {popup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className={`p-6 text-center ${
                            popup.type === 'success' ? 'bg-green-50' : 
                            popup.type === 'fail' ? 'bg-red-50' : 'bg-orange-50'
                        }`}>
                            <div className="text-4xl mb-3">
                                {popup.type === 'success' ? '✅' : popup.type === 'fail' ? '🚨' : '⚠️'}
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${
                                popup.type === 'success' ? 'text-green-700' : 
                                popup.type === 'fail' ? 'text-red-700' : 'text-orange-700'
                            }`}>
                                {popup.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {popup.message}
                            </p>
                        </div>
                        <button 
                            onClick={closePopup}
                            className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Screen: Inbox ──────────────────────────────────────────────────────────
    if (currentScreen === 'INBOX') {
        return (
            <PhoneShell bg="bg-[#F2F2F7]">
                <div className="px-4 py-2 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center flex-shrink-0 z-10">
                    <span className="text-blue-500 font-medium">Edit</span>
                    <h1 className="text-[17px] font-bold">Messages</h1>
                    <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✎</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div 
                        onClick={() => setCurrentScreen('SMS_DETAIL')}
                        className="bg-white px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-xl shrink-0 text-white font-bold">K</div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold">KBank</span>
                                <span className="text-slate-400 text-sm">10:19 AM</span>
                            </div>
                            <p className="text-slate-500 text-sm truncate">
                                รหัส OTP ของคุณคือ 738291 สำหรับโอนเงิน 1,500 บ...
                            </p>
                        </div>
                        <span className="text-blue-500 self-center">›</span>
                    </div>
                </div>
            </PhoneShell>
        );
    }

    // ── Screen: SMS Detail ─────────────────────────────────────────────────────
    return (
        <PhoneShell bg="bg-white">
            {/* iOS Message Header */}
            <div className="bg-[#F2F2F7] border-b border-slate-300 px-4 pt-2 pb-3">
                <div className="flex items-center mb-2">
                    <button 
                        onClick={() => showPopup(
                            "ยอดเยี่ยม!", 
                            "คุณมีสติและแยกแยะได้ว่าข้อความนี้เป็นของจริง ไม่มีลิงก์อันตรายแอบแฝง การกดออกหรือเก็บไว้เฉยๆ คือสิ่งที่ควรทำเมื่อเป็นข้อความทางการครับ ✅", 
                            "success",
                            true
                        )} 
                        className="text-blue-500 flex items-center gap-1"
                    >
                        <span className="text-2xl">‹</span>
                        <span className="font-semibold text-lg bg-blue-500 text-white px-1.5 py-0 rounded-lg text-xs mr-2">1</span>
                    </button>
                </div>
                <div 
                    onClick={() => showPopup(
                        "สังเกตได้ดีมาก!", 
                        "ชื่อผู้ส่งเป็นของธนาคารชัดเจน ไม่มีตัวอักษรหรือตัวเลขแปลกๆ ผสมกัน เช่น K-B4nk ซึ่งมักจะเป็นกลวิธีของมิจฉาชีพ", 
                        "success"
                    )}
                    className="flex flex-col items-center cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center text-2xl mb-1 text-white font-bold">K</div>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800">KBank</span>
                        <span className="text-[10px] text-blue-500">›</span>
                    </div>
                </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-4 bg-white overflow-y-auto">
                <div className="flex flex-col items-start gap-4">
                    <div className="bg-[#E9E9EB] text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none max-w-[85%] text-[15px] leading-relaxed shadow-sm">
                        รหัส OTP 738291 สำหรับโอนเงิน 1,500 บ. ไปยังบัญชี xxxx หากคุณไม่ได้ทำรายการ โปรดติดต่อ 
                        <span 
                            onClick={() => showPopup(
                                "ถูกต้องที่สุด!", 
                                "หากได้รับ OTP โดยไม่ได้ทำรายการ การโทรสอบถาม Call Center เบอร์ทางการ (ที่ไม่มีการแนบลิงก์แอดไลน์) คือสิ่งที่ควรทำที่สุดเพื่อความปลอดภัย 📞", 
                                "success",
                                true
                            )}
                            className="text-blue-600 underline cursor-pointer"
                        > 02-888-8888 </span> 
                        ทันที
                    </div>
                    <span className="text-[10px] text-slate-400 ml-1">SMS • Today 10:19 AM</span>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                    <button 
                        onClick={() => showPopup(
                            "เดี๋ยวก่อน! 🚨", 
                            "นี่คือข้อความ OTP ของจริง! หากคุณระแวงจนลบทิ้ง คุณอาจจะไม่รู้ตัวเลยว่ามีมิจฉาชีพกำลังพยายามโอนเงินจากบัญชีของคุณอยู่นะ การระวังภัยเป็นเรื่องดีแต่ต้องมีสติด้วยครับ!", 
                            "fail",
                            true
                        )}
                        className="text-red-500 font-semibold"
                    >
                        ลบข้อความ / บล็อก
                    </button>
                </div>
            </div>

            {/* iMessage Input Bar */}
            <div 
                onClick={() => showPopup(
                    "พิมพ์ไปเขาก็ไม่อ่านหรอก!", 
                    "นี่คือระบบส่งข้อความอัตโนมัติ (No-Reply) 🤖 การส่งข้อความกลับไปหาธนาคารผ่านทางนี้ไม่สามารถทำได้ครับ", 
                    "warning"
                )}
                className="px-3 py-2 bg-[#F2F2F7] border-t border-slate-200 flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400">⊕</div>
                <div className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-slate-300 text-sm">
                    iMessage
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white">↑</div>
            </div>
        </PhoneShell>
    );
}
