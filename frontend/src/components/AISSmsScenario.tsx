import React, { useState } from 'react';

type Screen = 'INBOX' | 'SMS_DETAIL' | 'FAKE_BROWSER';
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

// ── Module-level shell (stable identity across renders) ───────────────────────
interface PhoneShellProps {
    children: React.ReactNode;
    bg?: string;
    popup: Popup | null;
    onClose: () => void;
}

const PhoneShell: React.FC<PhoneShellProps> = ({ children, bg = 'bg-white', popup, onClose }) => (
    <div className="w-full h-full flex items-center justify-center py-4">
        <div className={`relative w-full max-w-[390px] h-full max-h-[844px] ${bg} rounded-[55px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50" />
            <div className="h-12 flex items-end justify-between px-8 pb-1 flex-shrink-0">
                <span className="text-[15px] font-semibold">9:41</span>
                <div className="flex gap-1.5 items-center">
                    <div className="w-4 h-4 rounded-sm border border-current opacity-50" />
                    <div className="w-4 h-4 rounded-sm border border-current opacity-50" />
                    <div className="w-6 h-3 rounded-sm border border-current opacity-50" />
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
                        }`}>{popup.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{popup.message}</p>
                    </div>
                    <button onClick={onClose} className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 transition-colors">ตกลง</button>
                </div>
            </div>
        )}
    </div>
);

export default function AISSmsScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    // Fake browser form state
    const [phone, setPhone] = useState('');
    const [shake, setShake] = useState(false);

    const formatPhone = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleAisSubmit = () => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }
        showPopup(
            'เสร็จโจร!',
            `🚨 คุณกรอกเบอร์ ${phone} ลงในเว็บไซต์ปลอมเรียบร้อยแล้ว มิจฉาชีพได้เบอร์ของคุณไป! สังเกตที่ URL: เว็บจริงของ AIS คือ ais.th ไม่ใช่ ais-redeem-point.com`,
            'fail',
            true,
        );
    };

    const closePopup = () => {
        if (popup?.isFinal && onAction) {
            onAction(popup.title, popup.type === 'success');
        }
        setPopup(null);
    };

    const showPopup = (title: string, message: string, type: PopupType, isFinal: boolean = false) => {
        setPopup({ title, message, type, isFinal });
    };


    // ── Screen: Inbox ───────────────────────────────────────────────────
    // ── Screen: Inbox ──────────────────────────────────────────────────────────
    if (currentScreen === 'INBOX') {
        const toggleEdit = () => {
            setIsEditing(!isEditing);
            setSelectedIds([]);
        };

        const toggleSelect = (id: string) => {
            setSelectedIds(prev => 
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            );
        };

        return (
            <PhoneShell bg="bg-[#F2F2F7]" popup={popup} onClose={closePopup}>
                <div className="px-4 py-2 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center flex-shrink-0 z-10">
                    <button 
                        onClick={toggleEdit}
                        className="text-blue-500 font-medium cursor-pointer"
                    >
                        {isEditing ? 'Done' : 'Edit'}
                    </button>
                    <h1 className="text-[17px] font-bold">Messages</h1>
                    <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✎</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div 
                        onClick={() => isEditing ? toggleSelect('ais') : setCurrentScreen('SMS_DETAIL')}
                        className="bg-white px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100"
                    >
                        {isEditing && (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedIds.includes('ais') ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                            }`}>
                                {selectedIds.includes('ais') && <span className="text-white text-xs">✓</span>}
                            </div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-xl shrink-0">👤</div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold">AIS</span>
                                <span className="text-slate-400 text-sm">9:41 AM</span>
                            </div>
                            <p className="text-slate-500 text-sm truncate">
                                บริการ AIS Points: เราพบว่า AIS Points (9,233 คะแนน)...
                            </p>
                        </div>
                        {!isEditing && <span className="text-blue-500 self-center">›</span>}
                    </div>
                    {/* Dummy messages */}
                    <div className="bg-white px-4 py-3 flex items-center gap-3 opacity-50 border-b border-slate-100">
                        {isEditing && (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xl shrink-0">👤</div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-0.5">
                                <span className="font-bold">KBank</span>
                                <span className="text-slate-400 text-sm">Yesterday</span>
                            </div>
                            <p className="text-slate-500 text-sm">คุณมียอดเงินโอนเข้าจำนวน...</p>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="h-16 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between items-center px-8 flex-shrink-0">
                        <span className="text-blue-500 font-medium opacity-50">Read All</span>
                        <button 
                            onClick={() => {
                                if (selectedIds.includes('ais')) {
                                    showPopup(
                                        "ยอดเยี่ยมมาก!", 
                                        "นี่คือวิธีรับมือที่ฉลาดที่สุด! การกด Edit แล้วเลือก 'ลบข้อความ' โดยไม่กดเข้าไปดู เป็นการตัดโอกาสที่มิจฉาชีพจะหลอกล่อคุณได้ตั้งแต่ต้นครับ 🛡️", 
                                        "success",
                                        true
                                    );
                                } else if (selectedIds.length > 0) {
                                    showPopup("คำแนะนำ", "คุณลบข้อความอื่นได้ แต่ข้อความที่น่าสงสัย (AIS) ยังอยู่นะ!", "warning");
                                }
                            }}
                            className={`font-medium ${selectedIds.length > 0 ? 'text-red-500' : 'text-red-300'}`}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </PhoneShell>
        );
    }

    // ── Screen: SMS Detail ─────────────────────────────────────────────────────
    if (currentScreen === 'SMS_DETAIL') {
        return (
            <PhoneShell bg="bg-white" popup={popup} onClose={closePopup}>
                {/* iOS Message Header */}
                <div className="bg-[#F2F2F7] border-b border-slate-300 px-4 pt-2 pb-3">
                    <div className="flex items-center mb-2">
                        <button onClick={() => setCurrentScreen('INBOX')} className="text-blue-500 flex items-center gap-1">
                            <span className="text-2xl">‹</span>
                            <span className="font-semibold text-lg bg-blue-500 text-white px-1.5 py-0 rounded-lg text-xs mr-2">19</span>
                        </button>
                    </div>
                    <div 
                        onClick={() => showPopup(
                            "ยอดเยี่ยม!", 
                            "การเช็กโปรไฟล์ผู้ส่งคือด่านแรกของการจับผิดมิจฉาชีพ เบอร์ที่ส่งมาจริง ๆ คือ +698 111 2222 ซึ่งไม่ใช่เบอร์ทางการของ AIS", 
                            "success"
                        )}
                        className="flex flex-col items-center cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center text-2xl mb-1">👤</div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-800">AIS</span>
                            <span className="text-[10px] text-blue-500">›</span>
                        </div>
                    </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-4 bg-white overflow-y-auto">
                    <div className="flex flex-col items-start gap-4">
                        <div className="bg-[#E9E9EB] text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none max-w-[85%] text-[15px] leading-relaxed">
                            บริการ AIS Points: เราพบว่า AIS Points (9,233 คะแนน) ในบัญชีของคุณจะหมดอายุวันนี้ กรุณาแลกคะแนนเพื่อรับรางวัลใหญ่ที่ 
                            <span 
                                onClick={() => setCurrentScreen('FAKE_BROWSER')}
                                className="text-blue-600 underline cursor-pointer break-all block mt-1"
                            >
                                https://ais-redeem-point.com
                            </span> 
                            ก่อน 23.59 น.
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">SMS • Today 9:41 AM</span>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                        <button 
                            onClick={() => showPopup(
                                "คุณรอดตัว!", 
                                "การลบข้อความและไม่สนใจคือวิธีรับมือที่ปลอดภัยที่สุด 🛡️", 
                                "success",
                                true
                            )}
                            className="text-blue-500 font-semibold"
                        >
                            ลบข้อความ
                        </button>
                    </div>
                </div>

                {/* iMessage Input Bar */}
                <div className="px-3 py-2 bg-[#F2F2F7] border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400">⊕</div>
                    <div 
                        onClick={() => showPopup(
                            "ใจเย็น!", 
                            "การพิมพ์ตอบกลับหรือด่ามิจฉาชีพ เป็นการยืนยันว่าเบอร์นี้มีคนใช้งานจริง คราวหน้ามันจะใช้วิธีโทรมาหาคุณแทน บล็อกทิ้งไปเลยดีกว่า!", 
                            "warning"
                        )}
                        className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-slate-300 text-sm cursor-text"
                    >
                        iMessage
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white">↑</div>
                </div>
            </PhoneShell>
        );
    }

    // ── Screen: Fake Browser ───────────────────────────────────────────────────
    if (currentScreen === 'FAKE_BROWSER') {
        return (
            <PhoneShell bg="bg-white">
                {/* Safari Chrome */}
                <div className="bg-[#F9F9F9] border-b border-slate-300 pt-1 flex flex-col gap-1.5 flex-shrink-0">
                    <div className="flex justify-between items-center px-4 py-1">
                        <span className="text-blue-500 text-sm">Done</span>
                        <div className="bg-slate-200/80 rounded-lg px-8 py-1.5 flex items-center gap-2 flex-1 mx-4 justify-center">
                            <span className="text-[10px] opacity-40">🔒</span>
                            <span className="text-xs font-medium text-slate-600 truncate">ais-redeem-point.com</span>
                        </div>
                        <span className="text-blue-500 text-lg">↻</span>
                    </div>
                    <div className="flex justify-between px-6 pb-2 text-blue-500 text-xl">
                        <span>‹</span>
                        <span>›</span>
                        <span>⎙</span>
                        <span>📖</span>
                        <span>❐</span>
                    </div>
                </div>

                {/* Fake Webpage Content */}
                <div className="flex-1 bg-[#F5F5F5] flex flex-col overflow-y-auto">
                    {/* Header Banner */}
                    <div className="bg-[#93D500] p-6 flex justify-between items-center flex-shrink-0">
                        <div className="text-white font-black italic text-2xl">AIS</div>
                        <div className="text-white text-xs font-bold border border-white px-2 py-1 rounded">TH | EN</div>
                    </div>

                    <div className="p-6 flex flex-col gap-6 items-center mt-8">
                        <h2 className="text-2xl font-bold text-slate-800 text-center">แลกคะแนนรับรางวัลใหญ่</h2>
                        <p className="text-slate-500 text-center text-sm">กรอกเบอร์โทรศัพท์ของคุณเพื่อตรวจสอบคะแนนสะสมและแลกรับของรางวัลพิเศษ</p>
                        
                        <div className="w-full space-y-4 mt-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={phone}
                                        onChange={e => setPhone(formatPhone(e.target.value))}
                                        placeholder="08X-XXX-XXXX"
                                        maxLength={12}
                                        className={`w-full p-4 rounded-xl border-2 bg-white shadow-sm outline-none font-mono tracking-widest transition-colors ${
                                            phone.replace(/\D/g,'').length === 10
                                                ? 'border-[#93D500] focus:ring-2 focus:ring-[#93D500]'
                                                : phone.length > 0
                                                ? 'border-orange-400'
                                                : 'border-slate-200 focus:ring-2 focus:ring-[#93D500]'
                                        }`}
                                    />
                                    {phone.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold">
                                            {phone.replace(/\D/g,'').length}/10
                                        </span>
                                    )}
                                </div>
                                {phone.length > 0 && phone.replace(/\D/g,'').length < 10 && (
                                    <p className="text-orange-500 text-xs ml-1">⚠ กรอกเบอร์ให้ครบ 10 หลัก</p>
                                )}
                            </div>
                            
                            <button
                                onClick={handleAisSubmit}
                                style={shake ? { animation: 'shake 0.5s' } : {}}
                                className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all transform active:scale-95 ${
                                    phone.replace(/\D/g,'').length === 10
                                        ? 'bg-[#93D500] text-white hover:bg-[#82bd00]'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Redeem Points
                            </button>
                        </div>

                        <div className="mt-12 text-center text-slate-300 text-[10px] space-y-1">
                            <p>© 2024 Advanced Info Service PLC. All rights reserved.</p>
                            <p>Privacy Policy | Terms of Service</p>
                        </div>
                    </div>
                </div>
                <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
            </PhoneShell>
        );
    }

    return null;
}
