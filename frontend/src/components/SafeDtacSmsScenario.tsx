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

// ── Module-level shell ────────────────────────────────────────────────────────────
interface PhoneShellProps { children: React.ReactNode; bg?: string; popup: Popup | null; onClose: () => void; }
const PhoneShell: React.FC<PhoneShellProps> = ({ children, bg = 'bg-white', popup, onClose }) => (
    <div className="w-full h-full flex items-center justify-center py-4">
        <div className={`relative w-full max-w-[390px] h-full max-h-[844px] ${bg} rounded-[55px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50" />
            <div className="h-12 flex items-end justify-between px-8 pb-1 flex-shrink-0">
                <span className="text-[15px] font-semibold">9:41</span>
                <div className="flex gap-1.5 items-center text-black/50 text-[11px]">
                    <span>●●●</span><span>WiFi</span><span>🔋</span>
                </div>
            </div>
            {children}
            <div className="h-8 flex justify-center items-center flex-shrink-0">
                <div className="w-32 h-1.5 bg-black/20 rounded-full" />
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
                    <button onClick={onClose} className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors">ตกลง</button>
                </div>
            </div>
        )}
    </div>
);

export default function SafeDtacSmsScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [linkExpanded, setLinkExpanded] = useState(false);
    const [messageRead, setMessageRead] = useState(false);

    const closePopup = () => {
        if (popup?.isFinal && onAction) onAction(popup.title, popup.type === 'success');
        setPopup(null);
    };

    const showPopup = (title: string, message: string, type: PopupType, isFinal = false) => {
        setShowContextMenu(false);
        setShowMoreMenu(false);
        setPopup({ title, message, type, isFinal });
    };

    // ── Shared Phone Shell ────────────────────────────────────────────────────
    const PhoneShell = ({ children, bg = 'bg-white' }: { children: React.ReactNode; bg?: string }) => (
        <div className="w-full h-full flex items-center justify-center py-4">
            <div className={`relative w-full max-w-[390px] h-full max-h-[844px] ${bg} rounded-[55px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col`}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50" />

                {/* Status bar */}
                <div className="h-12 flex items-end justify-between px-8 pb-1 flex-shrink-0">
                    <span className="text-[15px] font-semibold">9:41</span>
                    <div className="flex gap-1.5 items-center text-black/50 text-[11px]">
                        <span>●●●</span>
                        <span>WiFi</span>
                        <span>🔋</span>
                    </div>
                </div>

                {children}

                {/* Home indicator */}
                <div className="h-8 flex justify-center items-center flex-shrink-0">
                    <div className="w-32 h-1.5 bg-black/20 rounded-full" />
                </div>
            </div>

            {/* Popup */}
            {popup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className={`p-6 text-center ${popup.type === 'success' ? 'bg-green-50' : popup.type === 'fail' ? 'bg-red-50' : 'bg-orange-50'}`}>
                            <div className="text-4xl mb-3">{popup.type === 'success' ? '✅' : popup.type === 'fail' ? '🚨' : '⚠️'}</div>
                            <h3 className={`text-xl font-bold mb-2 ${popup.type === 'success' ? 'text-green-700' : popup.type === 'fail' ? 'text-red-700' : 'text-orange-700'}`}>
                                {popup.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{popup.message}</p>
                        </div>
                        <button onClick={closePopup} className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors">
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Screen 1: Inbox ───────────────────────────────────────────────────────
    if (currentScreen === 'INBOX') {
        return (
            <PhoneShell bg="bg-[#F2F2F7]" popup={popup} onClose={closePopup}>
                <div className="px-4 py-2 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center flex-shrink-0">
                    <button className="text-blue-500 font-medium text-sm">Edit</button>
                    <h1 className="text-[17px] font-bold">Messages</h1>
                    <button className="w-7 h-7 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✎</span>
                    </button>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 px-4 py-2 bg-[#F2F2F7] flex-shrink-0">
                    <div className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">ทั้งหมด</div>
                    <div className="bg-white text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">ยังไม่ได้อ่าน</div>
                    <div className="bg-white text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">ธุรกิจ</div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white">
                    {/* dtac — main message */}
                    <div
                        onClick={() => { setCurrentScreen('SMS_DETAIL'); setMessageRead(true); }}
                        className="px-4 py-3 flex items-center gap-3 cursor-pointer active:bg-slate-100 border-b border-slate-100"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#F68B1F] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-sm">d</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                                <div className="flex items-center gap-1.5">
                                    {!messageRead && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />}
                                    <span className={`text-[15px] ${!messageRead ? 'font-bold' : 'font-semibold text-slate-700'}`}>dtac</span>
                                </div>
                                <span className="text-slate-400 text-xs">9:41 AM</span>
                            </div>
                            <p className="text-slate-500 text-sm truncate">สาดความอิ่มคุ้ม เน็ต 50GB...</p>
                        </div>
                        <span className="text-slate-300 text-lg">›</span>
                    </div>

                    {/* Dummy messages */}
                    {[
                        { name: 'KBank', preview: 'คุณมียอดเงินโอนเข้า 2,500 บ. เมื่อ...', time: 'เมื่อวาน', color: 'bg-green-600' },
                        { name: 'SCB', preview: 'แจ้งเตือน: บัตรเครดิตครบกำหนดชำระ...', time: 'จันทร์', color: 'bg-purple-700' },
                        { name: 'KRUNGTHAI', preview: 'ยอดสรุปบัญชีประจำเดือน เมษายน...', time: 'อา.', color: 'bg-blue-700' },
                        { name: 'LINE', preview: 'คุณมีข้อความใหม่ 12 ข้อความ', time: '27 เม.ย.', color: 'bg-green-500' },
                    ].map(m => (
                        <div key={m.name} className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 opacity-45 cursor-default">
                            <div className={`w-12 h-12 rounded-full ${m.color} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white font-bold text-xs">{m.name.slice(0, 2)}</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-semibold text-[15px]">{m.name}</span>
                                    <span className="text-slate-400 text-xs">{m.time}</span>
                                </div>
                                <p className="text-slate-500 text-sm truncate">{m.preview}</p>
                            </div>
                            <span className="text-slate-200 text-lg">›</span>
                        </div>
                    ))}
                </div>
            </PhoneShell>
        );
    }

    // ── Screen 2: SMS Detail ──────────────────────────────────────────────────
    return (
        <PhoneShell bg="bg-white" popup={popup} onClose={closePopup}>
            {/* Header */}
            <div className="bg-[#F2F2F7] border-b border-slate-200 px-4 pt-2 pb-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={() => setCurrentScreen('INBOX')} className="text-blue-500 flex items-center gap-1">
                        <span className="text-2xl leading-none">‹</span>
                        <span className="text-[13px] font-semibold bg-blue-500 text-white px-1.5 rounded-md">1</span>
                    </button>

                    {/* ⋮ More menu — natural interaction */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className="text-blue-500 text-2xl px-2"
                        >
                            ⋮
                        </button>
                        {showMoreMenu && (
                            <div className="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20">
                                {/* Block — false alarm safe path */}
                                <button
                                    onClick={() => showPopup(
                                        'เดี๋ยวก่อน! ⚠️',
                                        'นี่คือ SMS โปรโมชันของจริงจาก dtac! การบล็อก Sender ID ทางการอาจทำให้คุณพลาดข้อมูลโปรโมชันและการแจ้งเตือนสำคัญจากผู้ให้บริการได้',
                                        'warning', true,
                                    )}
                                    className="w-full px-4 py-3 text-left text-[14px] text-red-500 hover:bg-slate-50 border-b border-slate-100"
                                >
                                    🚫 บล็อกผู้ส่ง
                                </button>
                                {/* Report Junk — false alarm */}
                                <button
                                    onClick={() => showPopup(
                                        'รอก่อน! 🤔',
                                        'ก่อนรายงานว่าเป็น Junk ลองตรวจสอบ Sender ID และโดเมนลิงก์ดูก่อน dtac เป็น Sender ID จดทะเบียนถูกต้อง และลิงก์ชี้ไปยัง dtac.co.th ซึ่งเป็นโดเมนทางการ',
                                        'warning',
                                    )}
                                    className="w-full px-4 py-3 text-left text-[14px] text-orange-500 hover:bg-slate-50 border-b border-slate-100"
                                >
                                    ⚠️ รายงาน Junk
                                </button>
                                {/* Copy text */}
                                <button
                                    onClick={() => { setShowMoreMenu(false); }}
                                    className="w-full px-4 py-3 text-left text-[14px] text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                                >
                                    📋 คัดลอกข้อความ
                                </button>
                                {/* Delete — false alarm */}
                                <button
                                    onClick={() => showPopup(
                                        'เดี๋ยวก่อน! ⚠️',
                                        'นี่คือ SMS โปรโมชันของจริง! การระแวงจนเกินไปอาจทำให้คุณพลาดสิทธิพิเศษดีๆ ได้นะ สังเกตชื่อผู้ส่งและโดเมนเว็บไซต์ให้ชัวร์ก่อนตัดสินใจลบ',
                                        'warning', true,
                                    )}
                                    className="w-full px-4 py-3 text-left text-[14px] text-red-500 hover:bg-slate-50"
                                >
                                    🗑️ ลบข้อความ
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender profile — pass trap */}
                <button
                    onClick={() => showPopup(
                        'ยอดเยี่ยม! 🔍',
                        "ผู้ส่งคือ 'dtac' ซึ่งเป็น Sender ID ที่จดทะเบียนถูกต้อง ไม่ใช่เบอร์มือถือส่วนตัว (เช่น 08x-xxx-xxxx) ที่มิจฉาชีพชอบใช้ Sender ID ทางการจะแสดงชื่อแบรนด์แทนเบอร์โทร",
                        'success', true,
                    )}
                    className="w-full flex flex-col items-center gap-1"
                >
                    <div className="w-14 h-14 rounded-full bg-[#F68B1F] flex items-center justify-center">
                        <span className="text-white font-black text-xl">d</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold text-slate-800">dtac</span>
                        <span className="text-blue-500 text-sm">›</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Promotional Message · แตะเพื่อดูรายละเอียด</span>
                </button>
            </div>

            {/* Message + Link preview */}
            <div
                className="flex-1 overflow-y-auto bg-white p-4"
                onClick={() => { if (showContextMenu) setShowContextMenu(false); if (showMoreMenu) setShowMoreMenu(false); }}
            >
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[11px] text-slate-400 mx-auto mb-1">Today 9:41 AM</span>

                    {/* Message bubble — long press → context menu */}
                    <div
                        onContextMenu={e => { e.preventDefault(); setShowContextMenu(true); }}
                        className="relative"
                    >
                        <div className="bg-[#E9E9EB] text-slate-800 px-4 py-3 rounded-2xl rounded-bl-none max-w-[88%] text-[14px] leading-relaxed select-none">
                            <p>สาดความอิ่มคุ้ม เน็ต 50GB 15วัน 299บ ฟรีคูปองสุกี้ตี๋น้อยพร้อมเครื่องดื่ม 276บ คุ้มทะลุแป้ง จัดเลย</p>
                            {/* Safe link — pass trap */}
                            <button
                                onClick={e => { e.stopPropagation(); showPopup(
                                    'ถูกต้อง! ✅',
                                    'ลิงก์นี้ปลอดภัย สังเกตจากโดเมนหลักคือ dtac.co.th ซึ่งเป็นเว็บไซต์ทางการของดีแทค ลิงก์สั้น (short link) ที่ได้รับจาก Sender ID ทางการมักนำไปสู่หน้าโปรโมชันจริง',
                                    'success', true,
                                ); }}
                                className="text-blue-500 underline text-[13px] mt-1.5 text-left break-all block"
                            >
                                https://www.dtac.co.th/s/7doDnlW
                            </button>
                        </div>

                        {/* Long-press context menu */}
                        {showContextMenu && (
                            <div className="absolute left-0 bottom-full mb-1 flex gap-1 bg-slate-800 rounded-xl px-3 py-2 shadow-xl z-20">
                                {[
                                    { icon: '↩️', label: 'Reply' },
                                    { icon: '📋', label: 'Copy' },
                                    { icon: '↗️', label: 'Forward' },
                                    { icon: '🗑️', label: 'Delete' },
                                ].map(item => (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            if (item.label === 'Delete') {
                                                showPopup(
                                                    'เดี๋ยวก่อน! ⚠️',
                                                    'นี่คือ SMS โปรโมชันของจริงจาก dtac! ลิงก์ชี้ไปยัง dtac.co.th โดเมนทางการ ตรวจสอบให้ชัวร์ก่อนลบทิ้งนะ',
                                                    'warning', true,
                                                );
                                            } else {
                                                setShowContextMenu(false);
                                            }
                                        }}
                                        className="flex flex-col items-center gap-0.5 px-2"
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-white text-[9px]">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Delivered */}
                    <span className="text-[10px] text-slate-400 ml-1">SMS · Delivered</span>

                    {/* Link preview card — expands on tap */}
                    <div
                        onClick={() => setLinkExpanded(!linkExpanded)}
                        className="mt-1 w-[88%] border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            <div className="w-10 h-10 rounded-lg bg-[#F68B1F] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-black text-sm">d</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[12px] font-semibold text-slate-800 truncate">dtac โปรโมชัน เน็ต 50GB</p>
                                <p className="text-[10px] text-slate-400 truncate">dtac.co.th</p>
                            </div>
                            <span className="text-slate-300 text-sm">{linkExpanded ? '▾' : '›'}</span>
                        </div>
                        {linkExpanded && (
                            <div className="px-3 pb-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                                โดเมน: <span className="text-green-600 font-bold">dtac.co.th</span> — ✅ โดเมนทางการของดีแทค ไม่ใช่เว็บปลอม
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* iMessage input bar */}
            <div className="px-3 py-2 bg-[#F2F2F7] border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 text-lg flex-shrink-0">⊕</div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onFocus={() => showPopup(
                            'ระวัง! ⚠️',
                            'การตอบกลับ SMS จากผู้ส่ง Sender ID ทางการนั้นไม่จำเป็นต้องทำ แต่หากตอบกลับ SMS หลอกลวงจะทำให้มิจฉาชีพรู้ว่าเบอร์นี้มีคนใช้งานอยู่จริง',
                            'warning',
                        )}
                        placeholder="iMessage"
                        className="w-full bg-white border border-slate-300 rounded-full px-4 py-1.5 text-slate-700 text-sm outline-none"
                    />
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-white text-sm flex-shrink-0">↑</button>
            </div>
        </PhoneShell>
    );
}
