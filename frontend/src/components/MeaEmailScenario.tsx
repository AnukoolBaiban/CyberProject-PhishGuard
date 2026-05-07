import React, { useState } from 'react';

type Screen = 'GMAIL_INBOX' | 'EMAIL_DETAIL' | 'FAKE_PAYMENT_PAGE';
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
interface BrowserShellProps {
    children: React.ReactNode;
    url: string;
    popup: Popup | null;
    onClose: () => void;
    currentScreen: string;
}

const BrowserShell: React.FC<BrowserShellProps> = ({ children, url, popup, onClose, currentScreen }) => (
    <div className="w-full h-full flex flex-col bg-[#f0f3f4] overflow-hidden font-sans">
        {/* Windows Browser Header (Chrome Style) */}
        <div className="bg-[#dee1e6] h-9 flex items-center justify-between px-2 flex-shrink-0">
            <div className="flex items-end h-full">
                <div className="bg-white h-8 px-4 rounded-t-lg text-[11px] flex items-center gap-2 min-w-[180px] shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
                    <span className="text-[#ea4335]">✉️</span>
                    <span className="truncate max-w-[140px] text-gray-700">
                        {currentScreen === 'FAKE_PAYMENT_PAGE' ? 'MEA E-Payment Gateway' : 'Gmail - Inbox'}
                    </span>
                    <span className="ml-auto text-[10px] opacity-40">×</span>
                </div>
                <div className="px-3 py-2 text-gray-500 text-xs hover:bg-gray-300 rounded-t-md cursor-default">+</div>
            </div>
            <div className="flex items-center gap-4 pr-2 text-gray-600">
                <span className="text-lg leading-none hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded">−</span>
                <span className="text-sm leading-none hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded">▢</span>
                <span className="text-lg leading-none hover:bg-red-500 hover:text-white w-8 h-8 flex items-center justify-center rounded">×</span>
            </div>
        </div>
        
        {/* Address Bar Area */}
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
                <span className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-default">🧩</span>
                <span className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-default text-xl">⋮</span>
            </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-hidden relative">
            {children}
        </div>

        {/* Popup Modal */}
        {popup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
                    <div className={`p-8 text-center ${
                        popup.type === 'success' ? 'bg-green-50/50' : 
                        popup.type === 'fail' ? 'bg-red-50/50' : 'bg-blue-50/50'
                    }`}>
                        <div className="text-5xl mb-4 transform scale-110">
                            {popup.type === 'success' ? '✅' : popup.type === 'fail' ? '🚨' : '🛡️'}
                        </div>
                        <h3 className={`text-2xl font-black mb-3 tracking-tight ${
                            popup.type === 'success' ? 'text-green-700' : 
                            popup.type === 'fail' ? 'text-red-700' : 'text-blue-700'
                        }`}>
                            {popup.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-snug font-medium">
                            {popup.message}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <button 
                            onClick={onClose}
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

export default function MeaEmailScenario({ onAction }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen>('GMAIL_INBOX');
    const [popup, setPopup] = useState<Popup | null>(null);
    // Payment form state
    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNum, setCardNum] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [otp, setOtp] = useState('');
    const [shake, setShake] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fmtCard = (raw: string) => raw.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
    const fmtExp  = (raw: string) => {
        const d = raw.replace(/\D/g,'').slice(0,4);
        return d.length <= 2 ? d : `${d.slice(0,2)} / ${d.slice(2)}`;
    };
    const cardBrand = (n: string) => {
        const d = n.replace(/\s/g,'');
        if (d.startsWith('4')) return 'VISA';
        if (/^5[1-5]/.test(d)) return '💳 MC';
        if (d.startsWith('3')) return 'AMEX';
        return '💳';
    };
    const cardDigits = cardNum.replace(/\s/g,'').length;
    const expiryDigits = expiry.replace(/\D/g,'').length;
    const allValid = nameOnCard.trim().length >= 2 && cardDigits === 16 && expiryDigits === 4 && cvv.length >= 3 && otp.replace(/\D/g,'').length >= 4;

    const handleMeaSubmit = () => {
        setSubmitted(true);
        if (!allValid) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }
        showPopup(
            'เสร็จโจร! 🚨',
            `คุณกรอกข้อมูลบัตรหมายเลข ${cardNum} ลงในลิงก์ปลอม! มิจฉาชีพได้ข้อมูลของคุณไปแล้ว จำไว้ว่า MEA ไม่มีนโยบายส่งอีเมลขู่ตัดไฟพร้อมลิงก์กรอกข้อมูลบัตรแบบนี้ ตรวจสอบผ่านแอป MEA Smart Life หรือเบอร์ 1130 เท่านั้น!`,
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

    // ── Icons ──────────────────────────────────────────────────────────────────
    const MeaLogo = () => (
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#6A2B86" />
            <path d="M25 75V25H35L50 50L65 25H75V75H65V45L50 70L35 45V75H25Z" fill="white" />
            <circle cx="50" cy="50" r="42" stroke="#F58220" strokeWidth="4" />
        </svg>
    );


    // ── Screen: Gmail Inbox ────────────────────────────────────────────────────
    if (currentScreen === 'GMAIL_INBOX') {
        return (
            <BrowserShell url="https://mail.google.com/mail/u/0/#inbox" popup={popup} onClose={closePopup} currentScreen={currentScreen}>
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
                        <div className="flex-1 max-w-2xl bg-[#f1f3f4] h-12 rounded-lg flex items-center px-4 gap-4 text-gray-500 focus-within:bg-white focus-within:shadow-md transition-all">
                            <span>🔍</span>
                            <input type="text" placeholder="Search mail" className="bg-transparent w-full outline-none text-gray-700" readOnly />
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-gray-500 pr-2">
                            <span className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-default">⚙️</span>
                            <span className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-default">⠿</span>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">K</div>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Gmail Sidebar */}
                        <div className="w-64 flex flex-col pt-2 px-3 bg-white flex-shrink-0">
                            <div className="bg-[#c2e7ff] text-[#001d35] w-36 h-14 rounded-2xl flex items-center justify-center font-medium shadow-sm mb-4 hover:shadow-md cursor-default transition-shadow">
                                <span className="text-2xl mr-3">✎</span> Compose
                            </div>
                            <div className="space-y-0.5">
                                <div className="bg-[#fce8e6] text-[#b41e15] px-6 py-2.5 rounded-r-full flex justify-between items-center font-bold text-sm">
                                    <div className="flex items-center gap-4"><span>📥</span> Inbox</div>
                                    <span>1</span>
                                </div>
                                {[
                                    { icon: '⭐', label: 'Starred' },
                                    { icon: '🕒', label: 'Snoozed' },
                                    { icon: '📤', label: 'Sent' },
                                    { icon: '📄', label: 'Drafts' },
                                    { icon: '⌄', label: 'More' }
                                ].map(item => (
                                    <div key={item.label} className="px-6 py-2.5 hover:bg-gray-100 rounded-r-full text-sm text-gray-700 flex items-center gap-4 cursor-default">
                                        <span className="opacity-70">{item.icon}</span> {item.label}
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
                                <div className="ml-auto text-xs opacity-60">1-4 of 4</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto">
                                <div 
                                    onClick={() => setCurrentScreen('EMAIL_DETAIL')}
                                    className="border-b border-gray-200 flex items-center px-4 py-2 gap-4 hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] transition-all cursor-pointer bg-white group z-10"
                                >
                                    <div className="flex items-center gap-3 shrink-0">
                                        <input type="checkbox" className="rounded-sm border-gray-400 w-4 h-4" onClick={e => e.stopPropagation()} />
                                        <span className="text-gray-300 group-hover:text-gray-400 text-lg">☆</span>
                                    </div>
                                    <div className="w-44 font-bold text-sm text-gray-800 truncate shrink-0">MEA Services</div>
                                    <div className="flex-1 flex gap-2 text-sm truncate">
                                        <span className="font-bold text-gray-800 shrink-0">แจ้งเตือนค้างชำระค่าไฟฟ้า (ค้างชำระ 1 งวด)</span>
                                        <span className="text-gray-500"> - โปรดดำเนินการด่วน หมายเลขบัญชีแสดงสัญญา 123...</span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-700 shrink-0">19:33</div>
                                </div>
                                {/* Dummy Emails */}
                                {[
                                    { from: 'Google Security', sub: 'New sign-in on Windows', desc: 'Your Google Account was logged into...' },
                                    { from: 'Shopee Thailand', sub: 'Flash Sale Alert! ⚡', desc: 'Don\'t miss out on today\'s deals...' },
                                    { from: 'LinkedIn', sub: 'You have 3 new notifications', desc: 'See who viewed your profile this week...' }
                                ].map((item, i) => (
                                    <div key={i} className="border-b border-gray-100 flex items-center px-4 py-2 gap-4 opacity-50 bg-[#f8f9fa] cursor-default">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <input type="checkbox" className="rounded-sm border-gray-300 w-4 h-4" />
                                            <span className="text-gray-300 text-lg">☆</span>
                                        </div>
                                        <div className="w-44 text-sm font-medium text-gray-600 truncate shrink-0">{item.from}</div>
                                        <div className="flex-1 flex gap-2 text-sm truncate text-gray-500">
                                            <span className="font-medium">{item.sub}</span>
                                            <span> - {item.desc}</span>
                                        </div>
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
    if (currentScreen === 'EMAIL_DETAIL') {
        return (
            <BrowserShell url="https://mail.google.com/mail/u/0/#inbox/MEA0200041532">
                <div className="absolute inset-0 bg-white flex flex-col overflow-y-auto">
                    {/* Gmail Detail Actions */}
                    <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-8 text-gray-500 sticky top-0 bg-white z-10 flex-shrink-0">
                        <button onClick={() => setCurrentScreen('GMAIL_INBOX')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <span className="text-xl">←</span>
                        </button>
                        <div className="flex gap-6 items-center">
                            <span className="cursor-default hover:bg-gray-100 p-2 rounded-full text-lg" title="Archive">📥</span>
                            <span 
                                onClick={() => showPopup("ฉลาดมาก!", "การตรวจสอบผู้ส่งและแจ้งสแปม คือการป้องกัน Phishing ที่ดีที่สุดครับ ✅", "success", true)}
                                className="cursor-pointer hover:bg-gray-100 p-2 rounded-full text-lg" title="Report Spam"
                            >⚠️</span>
                            <span 
                                onClick={() => showPopup("ยอดเยี่ยม!", "คุณตัดสินใจถูกต้องที่เลือกลบอีเมลที่น่าสงสัยทิ้งทันที ✅", "success", true)}
                                className="cursor-pointer hover:bg-gray-100 p-2 rounded-full text-lg" title="Delete"
                            >🗑️</span>
                        </div>
                    </div>

                    {/* Email Content Area */}
                    <div className="max-w-4xl w-full mx-auto p-8 pt-6">
                        <div className="flex items-center gap-4 mb-8">
                            <h1 className="text-[22px] text-gray-800 font-normal flex-1">แจ้งเตือนค้างชำระค่าไฟฟ้า (ค้างชำระ 1 งวด) - โปรดดำเนินการด่วน</h1>
                            <div className="flex gap-2">
                                <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">Inbox x</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mb-10">
                            <div className="w-10 h-10 bg-[#6A2B86] rounded-full flex items-center justify-center text-lg shrink-0 font-bold text-white shadow-sm">M</div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[14px] text-gray-900">MEA Services</span>
                                    <span 
                                        onClick={() => showPopup(
                                            "สังเกตเห็นไหม? 🔍", 
                                            "อีเมลทางการของ MEA ต้องลงท้ายด้วย @mea.or.th เท่านั้น! ส่วน @mea-service.net คือโดเมนปลอมที่มิจฉาชีพจดทะเบียนมาเพื่อหลอกคุณครับ", 
                                            "success"
                                        )}
                                        className="text-[12px] text-gray-500 cursor-pointer hover:underline truncate"
                                    >
                                        &lt;admin@mea-service.net&gt;
                                    </span>
                                </div>
                                <div className="text-[12px] text-gray-500 flex items-center gap-1">
                                    to me <span className="text-[8px]">▼</span>
                                </div>
                            </div>
                            <div className="text-[12px] text-gray-500 shrink-0">19:33 (0 minutes ago)</div>
                            <div className="flex gap-4 text-gray-400 text-lg ml-4">
                                <span>☆</span>
                                <span>⤺</span>
                                <span>⋮</span>
                            </div>
                        </div>

                        {/* MEA Branded Content (Realistic HTML Email) */}
                        <div className="border border-gray-200 rounded-sm overflow-hidden bg-white max-w-[600px] mx-auto shadow-sm">
                            <div className="bg-[#6A2B86] p-6 flex flex-col items-center border-b-[6px] border-[#F58220]">
                                <MeaLogo />
                                <h2 className="text-white font-bold mt-2 tracking-widest text-lg">MEA</h2>
                                <p className="text-white/80 text-[10px] uppercase tracking-tighter">Metropolitan Electricity Authority</p>
                            </div>
                            
                            <div className="p-8 space-y-6 text-gray-700 font-sans leading-relaxed text-[15px]">
                                <p className="font-bold text-gray-900">เรียน ผู้ใช้บริการไฟฟ้า,</p>
                                <p>
                                    การไฟฟ้านครหลวง (MEA) ขอแจ้งผลการตรวจสอบยอดค้างชำระ สำหรับหมายเลขบัญชีแสดงสัญญา: 
                                    <span className="font-bold text-gray-900 ml-1">0200041532</span>
                                </p>
                                
                                <div className="bg-red-50/50 border border-red-100 rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">ยอดค้างชำระสะสม:</span>
                                        <span className="text-xl font-bold text-red-600">1,250.50 บาท</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">สถานะ:</span>
                                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">เกินกำหนดชำระ</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-md text-orange-900 text-[13px] leading-snug italic">
                                    <span className="font-bold block mb-1">⚠️ คำเตือนการงดจ่ายกระแสไฟฟ้า:</span>
                                    หากไม่ดำเนินการชำระภายในระยะเวลาที่กำหนด MEA จำเป็นต้องดำเนินการระงับการจ่ายกระแสไฟฟ้าตามระเบียบ
                                </div>

                                <div className="flex flex-col items-center py-4 gap-3">
                                    <button 
                                        onClick={() => setCurrentScreen('FAKE_PAYMENT_PAGE')}
                                        className="bg-[#F58220] hover:bg-[#e4761a] text-white px-12 py-4 rounded-full font-bold text-lg shadow-[0_4px_14px_0_rgba(245,130,32,0.39)] transition-all transform active:scale-95"
                                    >
                                        ชำระเงินออนไลน์ทันที
                                    </button>
                                    <span className="text-[10px] text-gray-400">*รองรับบัตรเครดิต และ Mobile Banking ทุกธนาคาร</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 border-t border-gray-100 text-center space-y-2">
                                <p className="text-[11px] text-gray-500 leading-tight">
                                    หากท่านชำระเงินเรียบร้อยแล้ว กรุณาขออภัยและละเว้นอีเมลฉบับนี้<br/>
                                    ติดต่อสอบถามเพิ่มเติม MEA Call Center โทร <span className="font-bold">1130</span>
                                </p>
                                <div className="flex justify-center gap-3 pt-2 opacity-50 grayscale">
                                    {['f', 'ig', 'tw', 'yt'].map(s => <span key={s} className="w-5 h-5 rounded-full bg-gray-400 text-white text-[8px] flex items-center justify-center font-bold uppercase">{s}</span>)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex gap-4">
                            <button className="border border-gray-300 px-6 py-2 rounded-full text-sm text-gray-500 hover:bg-gray-50">⤺ Reply</button>
                            <button className="border border-gray-300 px-6 py-2 rounded-full text-sm text-gray-500 hover:bg-gray-50">⤻ Forward</button>
                        </div>
                    </div>
                </div>
            </BrowserShell>
        );
    }

    // ── Screen: Fake Payment Page ──────────────────────────────────────────────
    return (
        <BrowserShell url="https://mea-epayment-portal.net/checkout/secure/0200041532" popup={popup} onClose={closePopup} currentScreen={currentScreen}>
            <div className="absolute inset-0 bg-white flex flex-col items-center pt-8 overflow-y-auto pb-24 px-4 scroll-smooth">
                {/* Site Branding */}
                <div className="flex flex-col items-center mb-8 transform scale-100">
                    <MeaLogo />
                    <h2 className="text-xl font-black text-[#6A2B86] mt-3 tracking-tight">MEA SMART LIFE</h2>
                    <p className="text-[#F58220] font-bold text-[10px] uppercase tracking-widest">E-Payment Gateway</p>
                </div>

                <div className="w-full max-w-[540px] p-0 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden mb-12 flex-shrink-0">
                    <div className="bg-gray-50 p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                            <span>รายการ: ชำระค่าไฟฟ้าค้างชำระ</span>
                            <span>#INV-99211</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-900 font-medium">ยอดรวมสุทธิ</span>
                            <span className="text-3xl font-black text-[#6A2B86]">1,250.50 <span className="text-sm">บาท</span></span>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="space-y-4" style={shake ? { animation: 'shake 0.5s' } : {}}>
                            {/* Name on card */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">ชื่อบนหน้าบัตร</label>
                                <input
                                    type="text"
                                    value={nameOnCard}
                                    onChange={e => setNameOnCard(e.target.value.toUpperCase())}
                                    placeholder="FULL NAME ON CARD"
                                    className={`w-full p-3.5 border-2 rounded-lg outline-none text-sm font-bold uppercase placeholder:font-normal placeholder:text-gray-300 transition-colors ${
                                        submitted && nameOnCard.trim().length < 2 ? 'border-red-400 bg-red-50' :
                                        nameOnCard.trim().length >= 2 ? 'border-green-400 focus:ring-2 focus:ring-green-300' :
                                        'border-gray-300 focus:ring-2 focus:ring-[#6A2B86]'
                                    }`}
                                />
                                {submitted && nameOnCard.trim().length < 2 && (
                                    <p className="text-red-500 text-xs">⚠ กรุณากรอกชื่อบนบัตรอย่างน้อย 2 ตัวอักษร</p>
                                )}
                            </div>

                            {/* Card number */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">หมายเลขบัตรเครดิต/เดบิต</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={cardNum}
                                        onChange={e => setCardNum(fmtCard(e.target.value))}
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        className={`w-full p-3.5 border-2 rounded-lg outline-none text-sm font-mono tracking-[2px] pr-16 transition-colors ${
                                            submitted && cardDigits !== 16 ? 'border-red-400 bg-red-50' :
                                            cardDigits === 16 ? 'border-green-400' :
                                            'border-gray-300 focus:ring-2 focus:ring-[#6A2B86]'
                                        }`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                        {cardNum ? cardBrand(cardNum) : '💳'}
                                    </span>
                                </div>
                                {submitted && cardDigits !== 16 && (
                                    <p className="text-red-500 text-xs">⚠ กรอกตัวเลขบัตรให้ครบ 16 หลัก ({cardDigits}/16)</p>
                                )}
                            </div>

                            {/* Expiry + CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">วันหมดอายุ</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={expiry}
                                        onChange={e => setExpiry(fmtExp(e.target.value))}
                                        placeholder="MM / YY"
                                        maxLength={7}
                                        className={`w-full p-3.5 border-2 rounded-lg outline-none text-sm text-center font-mono transition-colors ${
                                            submitted && expiryDigits !== 4 ? 'border-red-400 bg-red-50' :
                                            expiryDigits === 4 ? 'border-green-400' :
                                            'border-gray-300 focus:ring-2 focus:ring-[#6A2B86]'
                                        }`}
                                    />
                                    {submitted && expiryDigits !== 4 && (
                                        <p className="text-red-500 text-[10px]">⚠ ระบุ MM/YY</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">CVV / CVC</label>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                                        placeholder="•••"
                                        maxLength={4}
                                        className={`w-full p-3.5 border-2 rounded-lg outline-none text-sm text-center font-mono transition-colors ${
                                            submitted && cvv.length < 3 ? 'border-red-400 bg-red-50' :
                                            cvv.length >= 3 ? 'border-green-400' :
                                            'border-gray-300 focus:ring-2 focus:ring-[#6A2B86]'
                                        }`}
                                    />
                                    {submitted && cvv.length < 3 && (
                                        <p className="text-red-500 text-[10px]">⚠ ระบุ CVV</p>
                                    )}
                                </div>
                            </div>

                            {/* OTP */}
                            <div className="pt-4 border-t border-gray-100 space-y-1">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">รหัส OTP ยืนยันรายการ</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                                        placeholder="ตรวจสอบจาก SMS ของท่าน"
                                        maxLength={6}
                                        className={`flex-1 p-3.5 border-2 rounded-lg outline-none text-sm font-mono tracking-widest transition-colors ${
                                            submitted && otp.replace(/\D/g,'').length < 4 ? 'border-red-400 bg-red-50' :
                                            otp.replace(/\D/g,'').length >= 4 ? 'border-green-400' :
                                            'border-gray-300 focus:ring-2 focus:ring-[#6A2B86]'
                                        }`}
                                    />
                                    <button className="bg-gray-100 text-gray-500 px-4 rounded-lg text-xs font-bold hover:bg-gray-200 flex-shrink-0">ขอรับอีกครั้ง</button>
                                </div>
                                {submitted && otp.replace(/\D/g,'').length < 4 && (
                                    <p className="text-red-500 text-xs">⚠ กรอก OTP ที่ได้รับ (ตัวเลขเท่านั้น)</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleMeaSubmit}
                            className={`w-full py-4 font-black rounded-xl shadow-lg transition-all transform active:scale-[0.98] text-lg uppercase tracking-wider ${
                                allValid
                                    ? 'bg-[#6A2B86] hover:bg-[#522168] text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {allValid ? 'ยืนยันและชำระเงิน →' : 'ยืนยันและชำระเงิน'}
                        </button>
                        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex flex-col items-center gap-2 border-t border-gray-100">
                        <div className="flex gap-4 opacity-30 grayscale scale-75">
                            <span className="text-xs font-bold italic">VISA</span>
                            <span className="text-xs font-bold italic">MasterCard</span>
                            <span className="text-xs font-bold italic">JCB</span>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center font-medium uppercase tracking-tighter">
                            🔒 SECURE 256-BIT SSL ENCRYPTED CONNECTION (SIMULATED)
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-xs text-gray-400 hover:underline cursor-default">กลับสู่หน้าหลักการไฟฟ้านครหลวง</p>
            </div>
        </BrowserShell>
    );
}

