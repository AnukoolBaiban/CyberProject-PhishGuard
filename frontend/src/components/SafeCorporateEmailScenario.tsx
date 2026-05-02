import React, { useState } from 'react';

type Screen = 'GMAIL_INBOX' | 'EMAIL_DETAIL';
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

export default function SafeCorporateEmailScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('GMAIL_INBOX');
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

    // ── Helper: Browser Shell ──────────────────────────────────────────────────
    const BrowserShell = ({ children, url }: { children: React.ReactNode; url: string }) => (
        <div className="w-full h-full flex flex-col bg-[#f0f3f4] overflow-hidden font-sans">
            {/* Windows Browser Header */}
            <div className="bg-[#dee1e6] h-9 flex items-center justify-between px-2 flex-shrink-0">
                <div className="flex items-end h-full">
                    <div className="bg-white h-8 px-4 rounded-t-lg text-[11px] flex items-center gap-2 min-w-[180px] shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
                        <span className="text-[#ea4335]">✉️</span>
                        <span className="truncate max-w-[140px] text-gray-700">Gmail - Inbox</span>
                        <span className="ml-auto text-[10px] opacity-40">×</span>
                    </div>
                    <div className="px-3 py-2 text-gray-500 text-xs hover:bg-gray-300 rounded-t-md cursor-default">+</div>
                </div>
                <div className="flex items-center gap-4 pr-2 text-gray-600">
                    <span className="text-lg hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded">−</span>
                    <span className="text-sm hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded">▢</span>
                    <span className="text-lg hover:bg-red-500 hover:text-white w-8 h-8 flex items-center justify-center rounded">×</span>
                </div>
            </div>
            
            {/* Address Bar */}
            <div className="bg-white h-11 border-b border-gray-300 flex items-center px-4 gap-3 flex-shrink-0">
                <div className="flex gap-3 text-gray-500 text-lg">
                    <span className="cursor-default opacity-40">←</span>
                    <span className="cursor-default opacity-40">→</span>
                    <span className="cursor-default hover:text-gray-800">↻</span>
                </div>
                <div className="flex-1 bg-[#f1f3f4] h-7 rounded-full flex items-center px-4 gap-2 border border-transparent focus-within:bg-white focus-within:shadow-[0_0_0_2px_#8ab4f8] transition-all">
                    <span className="text-[10px] opacity-60">🔒</span>
                    <span className="text-xs text-gray-700 truncate select-none">{url}</span>
                </div>
                <div className="flex gap-2 text-gray-500">
                    <span className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-default text-xl">⋮</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {children}
            </div>

            {/* Popup Modal */}
            {popup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
                        <div className={`p-8 text-center ${
                            popup.type === 'success' ? 'bg-green-50/50' : 
                            popup.type === 'warning' ? 'bg-orange-50/50' : 'bg-red-50/50'
                        }`}>
                            <div className="text-5xl mb-4 transform scale-110">
                                {popup.type === 'success' ? '✅' : popup.type === 'warning' ? '🚨' : '❌'}
                            </div>
                            <h3 className={`text-2xl font-black mb-3 tracking-tight ${
                                popup.type === 'success' ? 'text-green-700' : 
                                popup.type === 'warning' ? 'text-orange-700' : 'text-red-700'
                            }`}>
                                {popup.title}
                            </h3>
                            <p className="text-gray-600 text-lg leading-snug font-medium">
                                {popup.message}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <button 
                                onClick={closePopup}
                                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-all text-lg shadow-md active:scale-95"
                            >
                                เข้าใจแล้ว
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Screen: Gmail Inbox ────────────────────────────────────────────────────
    if (currentScreen === 'GMAIL_INBOX') {
        return (
            <BrowserShell url="https://mail.google.com/mail/u/0/#inbox">
                <div className="h-full flex flex-col bg-white">
                    {/* Gmail Header */}
                    <div className="h-16 border-b border-gray-100 flex items-center px-4 gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2 w-56 shrink-0">
                            <div className="text-gray-500 text-xl p-2 hover:bg-gray-100 rounded-full cursor-default">☰</div>
                            <div className="flex items-center gap-1">
                                <span className="text-[#ea4335] text-2xl">📩</span>
                                <span className="text-xl text-gray-600 font-medium tracking-tight">Gmail</span>
                            </div>
                        </div>
                        <div className="flex-1 max-w-2xl bg-[#f1f3f4] h-12 rounded-lg flex items-center px-4 gap-4 text-gray-500">
                            <span>🔍</span>
                            <input type="text" placeholder="Search mail" className="bg-transparent w-full outline-none text-gray-700" readOnly />
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-gray-500 pr-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">K</div>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-64 flex flex-col pt-2 px-3 bg-white flex-shrink-0">
                            <div className="bg-[#c2e7ff] text-[#001d35] w-36 h-14 rounded-2xl flex items-center justify-center font-medium shadow-sm mb-4 cursor-default">
                                <span className="text-2xl mr-3">✎</span> Compose
                            </div>
                            <div className="space-y-0.5">
                                <div className="bg-[#fce8e6] text-[#b41e15] px-6 py-2.5 rounded-r-full flex justify-between items-center font-bold text-sm">
                                    <div className="flex items-center gap-4"><span>📥</span> Inbox</div>
                                    <span>1</span>
                                </div>
                                {['⭐ Starred', '🕒 Snoozed', '📤 Sent', '📄 Drafts'].map(label => (
                                    <div key={label} className="px-6 py-2.5 hover:bg-gray-100 rounded-r-full text-sm text-gray-700 flex items-center gap-4 cursor-default">
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email List Area */}
                        <div className="flex-1 flex flex-col border-l border-gray-100 bg-[#f6f8fc] rounded-tl-2xl overflow-hidden">
                            <div className="h-12 flex items-center px-4 gap-6 text-gray-500 border-b border-gray-200/50">
                                <input type="checkbox" className="rounded-sm border-gray-400 w-4 h-4" />
                                <span className="cursor-default hover:text-gray-800">↻</span>
                                <span className="cursor-default hover:text-gray-800">⋮</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto">
                                <div 
                                    onClick={() => setCurrentScreen('EMAIL_DETAIL')}
                                    className="border-b border-gray-200 flex items-center px-4 py-2 gap-4 hover:shadow-md transition-all cursor-pointer bg-white group"
                                >
                                    <div className="flex items-center gap-3 shrink-0">
                                        <input type="checkbox" className="rounded-sm border-gray-400 w-4 h-4" />
                                        <span className="text-gray-300 text-lg">☆</span>
                                    </div>
                                    <div className="w-52 font-bold text-sm text-gray-800 truncate shrink-0">Google Workspace Updates</div>
                                    <div className="flex-1 flex gap-2 text-sm truncate">
                                        <span className="font-bold text-gray-800 shrink-0">การอัปเดตฟีเจอร์ใหม่สำหรับ Google Meet ประจำเดือนนี้</span>
                                        <span className="text-gray-500"> - เรียนผู้ใช้งาน, เราได้เพิ่มฟีเจอร์การจัดกลุ่ม...</span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-700 shrink-0">14:20</div>
                                </div>
                                {/* Dummies */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="border-b border-gray-100 flex items-center px-4 py-2 gap-4 opacity-40 bg-[#f8f9fa] cursor-default">
                                        <div className="flex items-center gap-3 shrink-0"><input type="checkbox" className="w-4 h-4" /><span className="text-lg">☆</span></div>
                                        <div className="w-52 text-sm truncate shrink-0 text-gray-600">Company Announcements</div>
                                        <div className="flex-1 text-sm truncate text-gray-500">Monthly company newsletter...</div>
                                        <div className="text-xs text-gray-500 shrink-0">Yesterday</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserShell>
        );
    }

    // ── Screen: Email Detail ───────────────────────────────────────────────────
    return (
        <BrowserShell url="https://mail.google.com/mail/u/0/#inbox/GW123456789">
            <div className="absolute inset-0 bg-white flex flex-col overflow-y-auto">
                {/* Actions */}
                <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-8 text-gray-500 sticky top-0 bg-white z-10 flex-shrink-0">
                    <button onClick={() => setCurrentScreen('GMAIL_INBOX')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <span className="text-xl">←</span>
                    </button>
                    <div className="flex gap-6 items-center">
                        <span className="cursor-default hover:bg-gray-100 p-2 rounded-full text-lg" title="Archive">📥</span>
                        <span 
                            onClick={() => showPopup(
                                "เดี๋ยวก่อน! 🚨", 
                                "นี่คืออีเมลประกาศของจริงจากระบบ การระแวงจนแจ้งสแปมอีเมลสำคัญอาจทำให้คุณพลาดการอัปเดตงานที่จำเป็นได้!", 
                                "warning"
                            )}
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded-full text-lg" title="Report Spam"
                        >⚠️</span>
                        <span 
                            onClick={() => showPopup(
                                "เดี๋ยวก่อน! 🚨", 
                                "นี่คืออีเมลประกาศของจริงจากระบบ การระแวงจนลบอีเมลสำคัญอาจทำให้คุณพลาดการอัปเดตงานที่จำเป็นได้!", 
                                "warning"
                            )}
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded-full text-lg" title="Delete"
                        >🗑️</span>
                    </div>
                </div>

                <div className="max-w-4xl w-full mx-auto p-8 pt-6">
                    <h1 className="text-[22px] text-gray-800 font-normal mb-8">การอัปเดตฟีเจอร์ใหม่สำหรับ Google Meet ประจำเดือนนี้</h1>
                    
                    <div className="flex gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#4285f4] rounded-full flex items-center justify-center text-lg shrink-0 font-bold text-white">G</div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[14px] text-gray-900">Google Workspace Updates</span>
                                <span 
                                    onClick={() => showPopup(
                                        "เยี่ยมมาก! 🔍", 
                                        "คุณตรวจสอบโดเมนผู้ส่ง อีเมลนี้ส่งมาจาก @google.com ซึ่งเป็นโดเมนทางการที่ถูกต้อง และมีการเข้ารหัสความปลอดภัยครบถ้วน", 
                                        "success"
                                    )}
                                    className="text-[12px] text-gray-500 cursor-pointer hover:underline truncate"
                                >
                                    &lt;workspace-noreply@google.com&gt;
                                </span>
                            </div>
                            <div 
                                onClick={() => showPopup(
                                    "เยี่ยมมาก! 🔍", 
                                    "คุณตรวจสอบโดเมนผู้ส่ง อีเมลนี้ส่งมาจาก @google.com ซึ่งเป็นโดเมนทางการที่ถูกต้อง และมีการเข้ารหัสความปลอดภัยครบถ้วน", 
                                    "success"
                                )}
                                className="text-[12px] text-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-50 w-fit pr-2 rounded"
                            >
                                to me <span className="text-[8px]">▼</span>
                            </div>
                        </div>
                        <div className="text-[12px] text-gray-500 shrink-0">14:20 (10 minutes ago)</div>
                    </div>

                    {/* Google Workspace Branded Content */}
                    <div className="border border-gray-200 rounded-sm overflow-hidden bg-white max-w-[600px] mx-auto shadow-sm">
                        <div className="bg-[#f8f9fa] p-6 flex flex-col items-center border-b">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🌐</span>
                                <span className="text-lg font-medium text-gray-600">Google Workspace</span>
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-6 text-gray-700 font-sans leading-relaxed text-[15px]">
                            <p className="font-bold text-gray-900 text-lg">เรียนผู้ใช้งาน,</p>
                            <p>
                                เรามีความยินดีที่จะประกาศว่า เราได้เพิ่มฟีเจอร์การจัดกลุ่ม **(Breakout Rooms)** ใน Google Meet 
                                เพื่อให้การประชุมและการระดมสมองของคุณมีประสิทธิภาพมากขึ้น
                            </p>
                            <p>
                                ฟีเจอร์นี้จะช่วยให้ผู้จัดการประชุมสามารถแยกผู้เข้าร่วมออกเป็นกลุ่มย่อยๆ ได้ 
                                และคุณสามารถดูคู่มือการใช้งานและการตั้งค่าได้ที่บล็อกอย่างเป็นทางการของเรา
                            </p>

                            <div className="flex flex-col items-center py-6">
                                <button 
                                    onClick={() => showPopup(
                                        "ยอดเยี่ยม! ✅", 
                                        "คุณมีความมั่นใจในการแยกแยะ ลิงก์นี้ปลอดภัยและนำไปสู่เว็บไซต์ของ Google จริงๆ ซึ่งเป็นอีเมลทางการที่ส่งมาเพื่อสนับสนุนการทำงานของคุณ", 
                                        "success",
                                        true
                                    )}
                                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-10 py-3.5 rounded font-bold text-[14px] shadow-sm transition-all"
                                >
                                    อ่านคู่มือการใช้งาน
                                </button>
                            </div>

                            <p className="text-[12px] text-gray-500 border-t pt-6">
                                ขอบคุณที่เลือกใช้ Google Workspace<br/>
                                ทีมงาน Google Workspace
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex gap-4 opacity-40 grayscale pointer-events-none">
                        <button className="border border-gray-300 px-6 py-2 rounded-full text-sm">⤺ Reply</button>
                        <button className="border border-gray-300 px-6 py-2 rounded-full text-sm">⤻ Forward</button>
                    </div>
                </div>
            </div>
        </BrowserShell>
    );
}
