import React, { useState } from 'react';

type Screen = 'INBOX' | 'CHAT_DETAIL';
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

// ── Module-level shell ────────────────────────────────────────────────────────────
interface LineShellProps { children: React.ReactNode; popup: Popup | null; onClose: () => void; }
const LineShell: React.FC<LineShellProps> = ({ children, popup, onClose }) => (
    <div className="w-full h-full flex items-center justify-center py-4">
        <div className="relative w-full max-w-[390px] h-full max-h-[844px] bg-white rounded-[55px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50" />
            <div className="h-12 flex items-end justify-between px-8 pb-1 flex-shrink-0 bg-[#00B900]">
                <span className="text-[14px] font-semibold text-white">9:41</span>
                <div className="flex gap-1.5 items-center text-white/80 text-[11px]">
                    <span>●●●</span><span>WiFi</span><span>🔋</span>
                </div>
            </div>
            {children}
            <div className="h-6 flex justify-center items-center flex-shrink-0 bg-white">
                <div className="w-28 h-1 bg-black/20 rounded-full" />
            </div>
        </div>
        {popup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                    <div className={`p-6 text-center ${
                        popup.type === 'success' ? 'bg-green-50' :
                        popup.type === 'fail'    ? 'bg-red-50'   : 'bg-orange-50'
                    }`}>
                        <div className="text-4xl mb-3">
                            {popup.type === 'success' ? '✅' : popup.type === 'fail' ? '🚨' : '⚠️'}
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${
                            popup.type === 'success' ? 'text-green-700' :
                            popup.type === 'fail'    ? 'text-red-700'   : 'text-orange-700'
                        }`}>
                            {popup.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{popup.message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors text-[15px]"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        )}
    </div>
);

export default function SafeLineChatScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [inputText, setInputText] = useState('');
    const [sentAccount, setSentAccount] = useState(false);

    const closePopup = () => {
        if (popup?.isFinal && onAction) onAction(popup.title, popup.type === 'success');
        setPopup(null);
    };

    const showPopup = (title: string, message: string, type: PopupType, isFinal = false) => {
        setShowMenu(false);
        setPopup({ title, message, type, isFinal });
    };



    // ── Screen 1: LINE Inbox ──────────────────────────────────────────────────
    if (currentScreen === 'INBOX') {
        return (
            <LineShell popup={popup} onClose={closePopup}>
                {/* LINE Header */}
                <div className="bg-[#00B900] px-4 pt-1 pb-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h1 className="text-white text-[17px] font-bold">LINE</h1>
                        <div className="flex items-center gap-3">
                            <button className="text-white opacity-80">🔍</button>
                            <button className="text-white opacity-80">⊕</button>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="flex mt-2">
                        {['แชท', 'โทร', 'NEWS'].map((tab, i) => (
                            <div key={tab} className={`flex-1 text-center pb-1 text-[13px] font-medium border-b-2 ${
                                i === 0 ? 'text-white border-white' : 'text-white/60 border-transparent'
                            }`}>
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {/* Target: คุณบอย */}
                    <div
                        onClick={() => setCurrentScreen('CHAT_DETAIL')}
                        className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer active:bg-slate-50 hover:bg-slate-50"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                บ
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-[15px] text-slate-900">คุณบอย (ลูกค้า)</span>
                                <span className="text-slate-400 text-[12px] flex-shrink-0 ml-2">11:08</span>
                            </div>
                            <p className="text-slate-500 text-[13px] truncate mt-0.5">
                                ลดเหลือ 1,700 ได้ไหมครับ พร้อมโอน...
                            </p>
                        </div>
                        <div className="w-5 h-5 bg-[#e50914] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">1</span>
                        </div>
                    </div>

                    {/* Dummy chats */}
                    {[
                        { name: 'นาเดียร์ (นายหน้า)', preview: 'พอดีพี่ที่แกรับซื้ออยู่ในกลุ่ม...', time: '10:23', color: 'from-orange-400 to-red-500', avatar: 'น' },
                        { name: 'กลุ่ม KMUTT 64',      preview: 'บีม: ส่งงานก่อน 5 โมงนะ',         time: 'เมื่อวาน', color: 'from-blue-500 to-blue-700', avatar: 'ก' },
                        { name: 'แม่ 👩',               preview: 'กินข้าวรึยังลูก',                  time: 'เมื่อวาน', color: 'from-pink-400 to-rose-500', avatar: 'ม' },
                        { name: 'LINE Pay',              preview: 'การชำระเงินของคุณสำเร็จแล้ว',     time: 'อา.',      color: 'from-[#00B900] to-[#007a00]', avatar: 'L' },
                        { name: 'มิ้น 🌸',              preview: 'โอเค พรุ่งนี้เจอกัน!',            time: '25 เม.ย.', color: 'from-purple-400 to-violet-600', avatar: 'ม' },
                    ].map(item => (
                        <div key={item.name} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 opacity-55 cursor-default">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                {item.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold text-[14px] text-slate-800">{item.name}</span>
                                    <span className="text-slate-400 text-[11px] flex-shrink-0 ml-2">{item.time}</span>
                                </div>
                                <p className="text-slate-400 text-[12px] truncate">{item.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom nav */}
                <div className="flex border-t border-slate-200 bg-white flex-shrink-0">
                    {[
                        { icon: '💬', label: 'แชท',   active: true  },
                        { icon: '⊕',  label: 'Voom',   active: false },
                        { icon: '🏠', label: 'หน้าหลัก', active: false },
                        { icon: '📞', label: 'โทร',    active: false },
                        { icon: '☰',  label: 'วอลเล็ท', active: false },
                    ].map(item => (
                        <button key={item.label} className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${item.active ? 'text-[#00B900]' : 'text-slate-400'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-[9px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </LineShell>
        );
    }

    // ── Screen 2: Chat Detail ─────────────────────────────────────────────────
    return (
        <LineShell popup={popup} onClose={closePopup}>
            {/* Chat Header */}
            <div className="bg-[#00B900] px-3 py-2 flex items-center gap-2 flex-shrink-0">
                {/* Back — returns to inbox (no popup) */}
                <button
                    onClick={() => setCurrentScreen('INBOX')}
                    className="text-white text-2xl px-1 leading-none font-light"
                >
                    ‹
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            บ
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-300 rounded-full border-2 border-[#00B900]" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-[14px] leading-tight">คุณบอย (ลูกค้า)</p>
                        <p className="text-white/70 text-[10px]">ออนไลน์อยู่</p>
                    </div>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-3 text-white">
                    <button className="opacity-80 text-xl">📞</button>
                    <button className="opacity-80 text-xl">📹</button>

                    {/* Hamburger menu — false-positive fail trap */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="opacity-80 text-xl px-1"
                        >
                            ☰
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-8 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                                <button className="w-full px-4 py-3 text-left text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <span>🔇</span> ปิดการแจ้งเตือน
                                </button>
                                <button className="w-full px-4 py-3 text-left text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <span>⭐</span> ตั้งเป็นรายการโปรด
                                </button>
                                {/* Block — false positive */}
                                <button
                                    onClick={() => showPopup(
                                        'เดี๋ยวก่อน! ⚠️',
                                        'ลูกค้าคนนี้มาสอบถามและขอซื้อของตามปกติ ไม่ได้มีการส่งลิงก์แปลกๆ หรือดึงเข้ากลุ่มแต่อย่างใด การระแวงจนบล็อกลูกค้าตัวจริงอาจทำให้คุณเสียโอกาสในการขายนะ!',
                                        'warning', true,
                                    )}
                                    className="w-full px-4 py-3 text-left text-[13px] text-red-500 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <span>🚫</span> รายงานปัญหา / บล็อก
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat body */}
            <div
                className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
                style={{ background: 'linear-gradient(180deg,#DFE5E7 0%,#D6DDE0 100%)' }}
                onClick={() => { if (showMenu) setShowMenu(false); }}
            >
                {/* Timestamp */}
                <div className="flex justify-center">
                    <span className="text-[11px] text-slate-500 bg-black/10 rounded-full px-3 py-0.5">วันนี้</span>
                </div>

                {/* Their bubble #1 */}
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">บ</div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-slate-500 ml-1">คุณบอย</span>
                        <div className="bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-bl-none max-w-[76%] text-[13px] leading-relaxed shadow-sm">
                            สวัสดีครับ สนใจรองเท้าไนกี้จอร์แดนครับ ยังมีของอยู่ไหมครับ 👟
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">11:01</span>
                    </div>
                </div>

                {/* My bubble */}
                <div className="flex justify-end gap-2 items-end">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-slate-400">11:02</span>
                        <div className="bg-[#B2F5A0] text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-br-none max-w-[76%] text-[13px] leading-relaxed shadow-sm">
                            มีครับ คู่ละ 1,800 บาทค่ะ รับเลยไหมคะ 😊
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-[#00B900]">✓✓ อ่านแล้ว</span>
                        </div>
                    </div>
                </div>

                {/* Their bubble #2 — negotiation + ask for account */}
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">บ</div>
                    <div className="flex flex-col gap-0.5">
                        <div className="bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-bl-none max-w-[80%] text-[13px] leading-relaxed shadow-sm">
                            ลดเหลือ 1,700 ถ้วนได้ไหมครับ ถ้าได้ผมพร้อมโอนเลยครับ 💸
                            <br />ขอเลขบัญชีหน่อยครับ
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">11:08</span>
                    </div>
                </div>

                {/* Sent account bubble — appears after clicking quick reply */}
                {sentAccount && (
                    <div className="flex justify-end gap-2 items-end">
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] text-slate-400">11:09</span>
                            <div className="bg-[#B2F5A0] text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-br-none max-w-[80%] text-[13px] leading-relaxed shadow-sm">
                                ได้เลยครับ 🙏<br />
                                <span className="font-bold">ธนาคารกสิกรไทย</span><br />
                                เลขบัญชี: <span className="font-mono font-bold">xxx-x-xxxxx-x</span><br />
                                ชื่อ: สมชาย ใจดี
                            </div>
                            <span className="text-[10px] text-[#00B900]">✓✓ อ่านแล้ว</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer — quick reply + input bar */}
            <div className="bg-white border-t border-slate-200 flex-shrink-0">
                {/* Quick reply chip — pass trap */}
                {!sentAccount && (
                    <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => {
                                setSentAccount(true);
                                setTimeout(() => showPopup(
                                    'ยอดเยี่ยม! ✅',
                                    'นี่คือลักษณะการซื้อขายที่ปกติและปลอดภัย ลูกค้าจะขอดูของ ต่อรองราคา และขอเลขบัญชีเพื่อโอนเงินโดยตรง โดยไม่มีการส่งลิงก์ให้กด หรืออ้างว่าเป็นนายหน้าเพื่อดึงคุณไปคุยในกลุ่มอื่น',
                                    'success', true,
                                ), 400);
                            }}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-[#e8f5e9] border border-[#00B900]/40 text-[#00766A] text-[12px] font-semibold rounded-full px-4 py-1.5 hover:bg-[#00B900]/20 transition-colors active:scale-95"
                        >
                            🏦 ส่งเลขบัญชี
                        </button>
                        <button
                            onClick={() => showPopup(
                                'ไม่เป็นไร!',
                                'คุณยังสามารถต่อรองราคาได้ก่อน ไม่มีความผิดปกติใดๆ ในบทสนทนานี้',
                                'warning',
                            )}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-500 text-[12px] font-semibold rounded-full px-4 py-1.5 hover:bg-slate-200 transition-colors"
                        >
                            💬 ต่อรองราคาก่อน
                        </button>
                    </div>
                )}

                {/* Input bar */}
                <div className="px-3 py-2 flex items-center gap-2">
                    <button className="text-slate-400 text-xl flex-shrink-0">⊕</button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Aa"
                        className="flex-1 bg-[#F2F2F2] rounded-full px-4 py-2 text-[13px] text-slate-700 outline-none"
                    />
                    <button className="text-slate-400 text-xl flex-shrink-0">😊</button>
                    {inputText.trim() ? (
                        <button
                            onClick={() => {
                                setInputText('');
                                showPopup(
                                    'สนทนาต่อได้!',
                                    'ลูกค้าคนนี้ไม่มีสัญญาณอันตรายใดๆ สามารถคุยต่อได้ตามปกติครับ',
                                    'warning',
                                );
                            }}
                            className="w-8 h-8 rounded-full bg-[#00B900] flex items-center justify-center text-white text-sm flex-shrink-0"
                        >
                            ↑
                        </button>
                    ) : (
                        <button className="text-slate-400 text-xl flex-shrink-0">🎤</button>
                    )}
                </div>
            </div>
        </LineShell>
    );
}
