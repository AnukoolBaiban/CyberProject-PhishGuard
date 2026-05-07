import React, { useState } from 'react';

type Screen = 'INBOX' | 'CHAT_DETAIL';
type PopupType = 'success' | 'fail' | 'warning';

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
                    <div className={`p-6 text-center ${popup.type === 'success' ? 'bg-green-50' : popup.type === 'fail' ? 'bg-red-50' : 'bg-orange-50'}`}>
                        <div className="text-4xl mb-3">{popup.type === 'success' ? '✅' : popup.type === 'fail' ? '🚨' : '⚠️'}</div>
                        <h3 className={`text-xl font-bold mb-2 ${popup.type === 'success' ? 'text-green-700' : popup.type === 'fail' ? 'text-red-700' : 'text-orange-700'}`}>{popup.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{popup.message}</p>
                    </div>
                    <button onClick={onClose} className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors text-[15px]">ตกลง</button>
                </div>
            </div>
        )}
    </div>
);

export default function FakeLineChatScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);
    const [showMenu, setShowMenu] = useState(false);

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
                    <div className="flex mt-2 gap-0">
                        {['แชท', 'โทร', 'NEWS'].map((tab, i) => (
                            <div key={tab} className={`flex-1 text-center pb-1 text-[13px] font-medium border-b-2 ${
                                i === 0 ? 'text-white border-white' : 'text-white/60 border-transparent'
                            }`}>
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {/* Target message */}
                    <div
                        onClick={() => setCurrentScreen('CHAT_DETAIL')}
                        className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer active:bg-slate-50 hover:bg-slate-50"
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7043] to-[#E53935] flex items-center justify-center text-white font-bold text-lg">
                                น
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-[15px] text-slate-900">นาเดียร์ (นายหน้า)</span>
                                <span className="text-slate-400 text-[12px] flex-shrink-0 ml-2">10:23</span>
                            </div>
                            <p className="text-slate-500 text-[13px] truncate mt-0.5">
                                พอดีพี่ที่แกรับซื้ออยู่ในกลุ่มค่ะ...
                            </p>
                        </div>
                        {/* Unread badge */}
                        <div className="w-5 h-5 bg-[#e50914] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">1</span>
                        </div>
                    </div>

                    {/* Dummy chats */}
                    {[
                        { name: 'กลุ่ม KMUTT 64', preview: 'บีม: ส่งงานก่อน 5 โมงนะ', time: 'เมื่อวาน', avatar: 'ก', color: 'from-blue-500 to-blue-700', unread: 3 },
                        { name: 'แม่ 👩', preview: 'กินข้าวรึยังลูก', time: 'เมื่อวาน', avatar: 'ม', color: 'from-pink-400 to-rose-500', unread: 0 },
                        { name: 'LINE Pay', preview: 'การชำระเงินของคุณสำเร็จแล้ว', time: 'อา.', avatar: 'L', color: 'from-[#00B900] to-[#007a00]', unread: 0 },
                        { name: 'มิ้น 🌸', preview: 'จ้า โอเค พรุ่งนี้เจอกัน!', time: '25 เม.ย.', avatar: 'ม', color: 'from-purple-400 to-violet-600', unread: 0 },
                        { name: 'Facebook Marketplace', preview: 'มีคนสนใจสินค้าของคุณ', time: '24 เม.ย.', avatar: 'F', color: 'from-blue-600 to-blue-800', unread: 0 },
                    ].map(item => (
                        <div key={item.name} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 opacity-60 cursor-default">
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
                            {item.unread > 0 && (
                                <div className="w-5 h-5 bg-[#e50914] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-[10px] font-bold">{item.unread}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom nav */}
                <div className="flex border-t border-slate-200 bg-white flex-shrink-0">
                    {[
                        { icon: '💬', label: 'แชท', active: true },
                        { icon: '⊕', label: 'Voom', active: false },
                        { icon: '🏠', label: 'หน้าหลัก', active: false },
                        { icon: '📞', label: 'โทร', active: false },
                        { icon: '☰', label: 'วอลเล็ท', active: false },
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
                {/* Back — pass trap */}
                <button
                    onClick={() => showPopup(
                        'ยอดเยี่ยม! 🛡️',
                        'การถอยออกมาและไม่หลงเชื่อคำหว่านล้อมของนายหน้าปลอม ช่วยให้คุณรอดพ้นจากการถูกหลอกได้ ไม่มีนายหน้าจริงที่ต้องดึงคุณเข้า "กลุ่มพิเศษ" ก่อนซื้อขาย',
                        'success', true,
                    )}
                    className="text-white text-2xl px-1 leading-none font-light"
                >
                    ‹
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7043] to-[#E53935] flex items-center justify-center text-white font-bold">
                            น
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-300 rounded-full border-2 border-[#00B900]" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-[14px] leading-tight">นาเดียร์</p>
                        <p className="text-white/70 text-[10px]">ออนไลน์อยู่</p>
                    </div>
                </div>

                {/* Header icons */}
                <div className="flex items-center gap-3 text-white">
                    <button className="opacity-80 text-xl">📞</button>
                    <button className="opacity-80 text-xl">📹</button>

                    {/* Menu — pass trap */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="opacity-80 text-xl px-1"
                        >
                            ☰
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                                <button className="w-full px-4 py-3 text-left text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <span>🔇</span> ปิดการแจ้งเตือน
                                </button>
                                <button className="w-full px-4 py-3 text-left text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <span>⭐</span> ตั้งเป็นรายการโปรด
                                </button>
                                {/* Block — pass action */}
                                <button
                                    onClick={() => showPopup(
                                        'เยี่ยมมาก! ✅',
                                        'การบล็อกและรายงานบัญชีที่พยายามดึงคุณเข้ากลุ่มแปลกๆ คือการตัดไฟตั้งแต่ต้นลม มิจฉาชีพมักสวมรอยเป็น "นายหน้า" เพื่อดึงเหยื่อเข้า OpenChat ปลอม',
                                        'success', true,
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

            {/* Chat Body */}
            <div
                className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
                style={{ background: 'linear-gradient(180deg, #DFE5E7 0%, #D6DDE0 100%)' }}
                onClick={() => { if (showMenu) setShowMenu(false); }}
            >
                {/* Date stamp */}
                <div className="flex justify-center">
                    <span className="text-[11px] text-slate-500 bg-black/10 rounded-full px-3 py-0.5">วันนี้</span>
                </div>

                {/* My bubble (seller) */}
                <div className="flex justify-end gap-2 items-end">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-slate-400">10:18</span>
                        <div className="bg-[#B2F5A0] text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-br-none max-w-[75%] text-[13px] leading-relaxed shadow-sm">
                            สนใจรองเท้าไนกี้จอร์แดนคู่นี้ใช่มั้ยคะ 1800 บาทค่ะ 👟
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-[#00B900]">✓✓ อ่านแล้ว</span>
                        </div>
                    </div>
                </div>

                {/* Their bubble (scammer) */}
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7043] to-[#E53935] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        น
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-slate-500 ml-1">นาเดียร์</span>
                        <div className="bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-bl-none max-w-[78%] text-[13px] leading-relaxed shadow-sm">
                            เราเป็นนายหน้านะคะ 😊 พอดีพี่ที่เค้าพร้อมซื้อแกซื้อขายในกลุ่มค่ะ พี่สะดวกเข้าไปคุยรายละเอียดกะเค้ามั้ย รับทั้งหมดเลยค่ะ
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">10:23</span>
                    </div>
                </div>

                {/* ── OpenChat Invite Card — FAIL TRAP ── */}
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7043] to-[#E53935] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        น
                    </div>
                    <div className="flex flex-col gap-0.5 max-w-[82%]">
                        <button
                            onClick={() => showPopup(
                                'เสร็จโจร! 🚨',
                                'นี่คือมุกหลอกผู้ขายที่กำลังระบาดหนัก! มิจฉาชีพจะทำทีเป็นนายหน้าดึงคุณเข้า "กลุ่มปลอม" ที่มีหน้าม้าเต็มไปหมด จากนั้นจะหลอกให้คุณโอน "ค่าประกันสินค้า" หรือ "ค่าสมาชิก" ก่อนถึงจะขายของได้ จำไว้ว่าการซื้อขายจริงไม่ต้องจ่ายเงินเพื่อเข้าไปขาย!',
                                'fail', true,
                            )}
                            className="bg-white rounded-2xl rounded-bl-none overflow-hidden shadow-sm border border-slate-200 text-left w-full hover:brightness-95 transition-all active:scale-[0.98]"
                        >
                            {/* Card Header */}
                            <div className="bg-[#00B900] px-4 py-2.5 flex items-center gap-2">
                                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                                    <span className="text-[#00B900] font-black text-[13px]">L</span>
                                </div>
                                <span className="text-white font-bold text-[12px] tracking-wider">LINE OPENCHAT</span>
                            </div>

                            {/* Card Body */}
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-3 mb-3">
                                    {/* Group icon */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <span className="text-white text-xl">👑</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-800 font-bold text-[13px] leading-tight">
                                            VIP KRISSHOP
                                        </p>
                                        <p className="text-slate-500 text-[11px]">ซื้อขายสินค้าแบรนด์เนม</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] text-slate-400">👥 4,891 สมาชิก</span>
                                            <span className="text-[10px] text-slate-300">·</span>
                                            <span className="text-[10px] text-green-500">● ออนไลน์ 312</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Join button */}
                                <div className="w-full py-2 bg-[#00B900] rounded-full text-center">
                                    <span className="text-white font-bold text-[13px]">เข้าร่วมโอเพนแชท</span>
                                </div>
                            </div>
                        </button>
                        <span className="text-[10px] text-slate-400 ml-1">10:23</span>
                    </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7043] to-[#E53935] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        น
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>

            {/* Input bar */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center gap-2 flex-shrink-0">
                <button className="text-slate-400 text-xl">⊕</button>
                <div className="flex-1 bg-[#F2F2F2] rounded-full px-4 py-2 text-slate-400 text-[13px]">
                    Aa
                </div>
                <button className="text-slate-400 text-xl">😊</button>
                <button className="text-slate-400 text-xl">🎤</button>
            </div>
        </LineShell>
    );
}