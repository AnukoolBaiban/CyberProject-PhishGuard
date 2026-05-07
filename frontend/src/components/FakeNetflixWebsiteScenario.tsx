import React, { useState, useEffect } from 'react';

type PopupType = 'success' | 'fail';

interface Popup {
    title: string;
    message: string;
    type: PopupType;
    isFinal?: boolean;
}

interface Props {
    onAction?: (label: string, isCorrect: boolean) => void;
}

function formatCardNumber(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + ' / ' + digits.slice(2);
}
function cardBrand(num: string): string {
    const d = num.replace(/\s/g, '');
    if (d.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(d)) return 'MC';
    if (d.startsWith('3')) return 'AMEX';
    return '💳';
}

export default function FakeNetflixWebsiteScenario({ onAction }: Props) {
    const [popup, setPopup] = useState<Popup | null>(null);

    // Real input state
    const [cardNum, setCardNum] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [shake, setShake] = useState(false);

    // ── Live countdown (starts from 23:59:59) ─────────────────────────────────
    const [seconds, setSeconds] = useState(23 * 3600 + 59 * 60 + 59);
    useEffect(() => {
        const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, []);
    const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    const isUrgent = seconds < 3600; // < 1 hour → flash red

    const allFilled =
        cardNum.replace(/\s/g, '').length === 16 &&
        expiry.replace(/\D/g, '').length === 4 &&
        cvv.length >= 3 &&
        nameOnCard.trim().length >= 2;

    const closePopup = () => {
        if (popup?.isFinal && onAction) onAction(popup.title, popup.type === 'success');
        setPopup(null);
    };
    const showPopup = (title: string, message: string, type: PopupType, isFinal = false) =>
        setPopup({ title, message, type, isFinal });

    const handleSubmit = () => {
        if (!allFilled) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }
        showPopup(
            'เสร็จโจร! 🚨',
            `คุณกรอกข้อมูลบัตรเครดิตหมายเลข ${cardNum} ลงในเว็บไซต์ปลอม! มิจฉาชีพได้ข้อมูลทั้งหมดไปแล้ว จำไว้ว่า URL ที่ถูกต้องต้องเป็น netflix.com เท่านั้น ไม่ใช่ netfl1x-billing-update-th.com`,
            'fail',
            true,
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#e8e8e8] overflow-hidden font-sans relative">

            {/* ── macOS Title bar ── */}
            <div className="bg-[#d6d6d6] border-b border-[#b8b8b8] h-10 flex items-center px-3 gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                    {/* Close — hidden pass trap */}
                    <button
                        title="Close Tab"
                        onClick={() => showPopup(
                            'คุณรอดตัว! ✅',
                            'การปิดหน้าต่างทิ้งทันทีเมื่อเจอเว็บไซต์ที่น่าสงสัยและเร่งรัดให้กรอกข้อมูล คือวิธีที่ปลอดภัยที่สุด',
                            'success', true,
                        )}
                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 flex items-center justify-center group"
                    >
                        <span className="text-[8px] text-[#820005] opacity-0 group-hover:opacity-100 font-bold">✕</span>
                    </button>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-[#d4a029]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                <div className="flex-1 flex items-end h-full pt-1">
                    <div className="bg-white h-8 px-4 rounded-t-md flex items-center gap-2 max-w-xs border border-b-0 border-gray-300">
                        <span className="text-[10px]">🎬</span>
                        <span className="text-[11px] text-gray-600 truncate">Netflix — Update Payment</span>
                        <span className="ml-auto text-[11px] text-gray-400">×</span>
                    </div>
                </div>
            </div>

            {/* ── Address Bar (URL — pass trap) ── */}
            <div className="bg-white border-b border-gray-300 h-10 flex items-center px-3 gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="opacity-40">‹</span>
                    <span className="opacity-40">›</span>
                    <span className="hover:text-gray-600 cursor-default">↻</span>
                </div>
                <button
                    onClick={() => showPopup(
                        'เยี่ยมมาก! 🔍',
                        'การเช็ก URL คือสิ่งแรกที่ควรทำ เว็บไซต์ปลอมมักพิมพ์ผิดหรือสะกดชื่อแบรนด์ผิด เช่น "netfl1x" (ตัวเลข 1 แทน i) เว็บจริงต้องเป็น netflix.com เท่านั้น',
                        'success', true,
                    )}
                    className="flex-1 flex items-center gap-2 bg-[#f1f3f4] hover:bg-[#e8eaed] h-7 rounded-full px-4 border border-transparent hover:border-[#dfe1e5] transition-all group text-left"
                >
                    <span className="text-[11px] text-amber-500">⚠️</span>
                    <span className="text-[11px] text-gray-700 truncate">
                        <span className="text-gray-400">https://</span>
                        <span className="text-red-600 font-semibold">netfl1x</span>
                        <span className="text-gray-600">-billing-update-th.com</span>
                        <span className="text-gray-400">/account/payment</span>
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400 opacity-0 group-hover:opacity-100">🔍</span>
                </button>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <span className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full">☆</span>
                    <span className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full text-base">⋮</span>
                </div>
            </div>

            {/* ── Page Body ── */}
            <div className="flex-1 overflow-y-auto bg-black">
                {/* Netflix Nav */}
                <div className="bg-gradient-to-b from-black to-transparent px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-[#e50914] font-black text-3xl" style={{ fontFamily: 'Georgia,serif', letterSpacing: '-0.05em' }}>
                            NETFLIX
                        </span>
                        {['หน้าแรก', 'ซีรีส์', 'ภาพยนตร์', 'ใหม่ & ดัง'].map(n => (
                            <span key={n} className="text-gray-300 text-sm hover:text-white cursor-default hidden md:block">{n}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center text-white text-sm font-bold">K</div>
                        <span className="text-gray-400 text-sm cursor-default">▾</span>
                    </div>
                </div>

                {/* Main card */}
                <div className="flex items-center justify-center min-h-[calc(100%-80px)] px-4 py-8">
                    <div
                        className="w-full max-w-[460px] bg-[#141414] rounded-md overflow-hidden shadow-2xl border border-[#333]"
                        style={shake ? { animation: 'shake 0.5s' } : {}}
                    >
                        {/* Red header */}
                        <div className="bg-[#e50914] px-6 py-4 flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80">การแจ้งเตือนด่วน</p>
                                <h2 className="text-white text-lg font-bold leading-tight">บัญชีของคุณถูกระงับชั่วคราว!</h2>
                            </div>
                        </div>

                        <div className="px-7 py-6 space-y-5">
                            {/* Urgency text */}
                            <p className="text-gray-300 text-sm leading-relaxed">
                                เราพบปัญหาในการตัดเงินค่าบริการประจำเดือน กรุณาอัปเดตข้อมูลบัตรเครดิตของคุณ{' '}
                                <span className="text-red-400 font-bold">ภายใน 24 ชั่วโมง</span>{' '}
                                เพื่อรับชมภาพยนตร์และซีรีส์ต่อ
                            </p>

                            {/* ── Live countdown ── */}
                            <div className={`rounded-md p-3 flex items-center justify-between border transition-colors ${
                                isUrgent
                                    ? 'bg-red-950 border-red-500/70 animate-pulse'
                                    : 'bg-[#1f1f1f] border-[#e50914]/40'
                            }`}>
                                <div>
                                    <span className="text-gray-400 text-xs block">เหลือเวลา</span>
                                    {isUrgent && (
                                        <span className="text-red-400 text-[9px] font-bold uppercase tracking-wider">⚡ เร่งด่วนมาก!</span>
                                    )}
                                </div>
                                <span className={`font-mono font-bold text-2xl tabular-nums tracking-widest ${
                                    isUrgent ? 'text-red-400' : 'text-[#e50914]'
                                }`}>
                                    {hh}:{mm}:{ss}
                                </span>
                            </div>

                            {/* Input fields */}
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                                        ชื่อบนหน้าบัตร
                                    </label>
                                    <input
                                        type="text"
                                        value={nameOnCard}
                                        onChange={e => setNameOnCard(e.target.value.toUpperCase())}
                                        placeholder="FULL NAME"
                                        className="w-full bg-[#2a2a2a] border border-[#555] focus:border-[#e50914] rounded px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600 font-mono tracking-wider"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                                        หมายเลขบัตรเครดิต
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={cardNum}
                                            onChange={e => setCardNum(formatCardNumber(e.target.value))}
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            className="w-full bg-[#2a2a2a] border border-[#555] focus:border-[#e50914] rounded px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600 font-mono tracking-[0.15em] pr-16"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">
                                            {cardNum ? cardBrand(cardNum) : '💳'}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">วันหมดอายุ</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={expiry}
                                            onChange={e => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM / YY"
                                            maxLength={7}
                                            className="w-full bg-[#2a2a2a] border border-[#555] focus:border-[#e50914] rounded px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600 font-mono text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">CVV / CVC</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            value={cvv}
                                            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="•••"
                                            maxLength={4}
                                            className="w-full bg-[#2a2a2a] border border-[#555] focus:border-[#e50914] rounded px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600 font-mono text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit — fail trap */}
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-3.5 font-bold rounded text-white text-base transition-all active:scale-[0.98] shadow-lg ${
                                    allFilled
                                        ? 'bg-[#e50914] hover:bg-[#f40612] shadow-red-900/40'
                                        : 'bg-[#8b0000] hover:bg-[#a00000] opacity-80'
                                }`}
                            >
                                {allFilled ? 'ยืนยันและอัปเดตการชำระเงิน →' : 'อัปเดตข้อมูลการชำระเงิน'}
                            </button>

                            {/* Trust badges */}
                            <div className="flex items-center justify-center gap-4">
                                {['🔒 SSL', 'VISA', 'Mastercard', 'JCB'].map(b => (
                                    <span key={b} className="text-[10px] text-gray-700 font-medium">{b}</span>
                                ))}
                            </div>
                        </div>

                        {/* Footer — subtle safe paths hidden as fine print */}
                        <div className="px-7 py-4 border-t border-[#222] text-center">
                            {/* "ข้ามไปก่อน" — hidden pass path disguised as opt-out */}
                            <button
                                onClick={() => showPopup(
                                    'ฉลาดมาก! 🚪',
                                    'การไม่ยอมกรอกข้อมูลสำคัญโดยมองหา "ออกจากหน้านี้" หรือ "ข้ามไปก่อน" คือสัญชาตญาณที่ดี เว็บไซต์หลอกลวงมักจะซ่อนทางออกไว้ในตัวอักษรเล็กๆ เพื่อทำให้คุณกดปุ่มหลักแทน',
                                    'success', true,
                                )}
                                className="text-gray-700 hover:text-gray-400 text-[11px] transition-colors mb-1 block mx-auto"
                            >
                                ไม่ต้องการอัปเดตตอนนี้ ข้ามไปก่อน
                            </button>
                            <p className="text-gray-800 text-[10px]">
                                © 2024 Netflix, Inc. ·{' '}
                                {/* Footer links — subtle hidden pass paths */}
                                <span
                                    onClick={() => showPopup(
                                        'ดีมาก! 🌐',
                                        'การพิมพ์ help.netflix.com โดยตรงใน browser ของตัวเองปลอดภัยกว่าการกดลิงก์จาก SMS หรืออีเมลเสมอ',
                                        'success', true,
                                    )}
                                    className="hover:text-gray-500 cursor-pointer transition-colors"
                                >
                                    ศูนย์ช่วยเหลือ
                                </span>
                                {' '}·{' '}
                                <span
                                    onClick={() => showPopup(
                                        'ดีมาก! 🔒',
                                        'การตรวจสอบนโยบายความปลอดภัยก่อนกรอกข้อมูล หรือโทรหา Netflix Support โดยตรงจาก help.netflix.com คือสิ่งที่ควรทำ',
                                        'success', true,
                                    )}
                                    className="hover:text-gray-500 cursor-pointer transition-colors"
                                >
                                    ความเป็นส่วนตัว
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup */}
            {popup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className={`p-8 text-center ${popup.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="text-5xl mb-4">{popup.type === 'success' ? '✅' : '🚨'}</div>
                            <h3 className={`text-xl font-black mb-3 tracking-tight ${popup.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {popup.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{popup.message}</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <button onClick={closePopup} className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all active:scale-95">
                                เข้าใจแล้ว
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes shake {
                    0%,100%{transform:translateX(0)}
                    20%{transform:translateX(-6px)}
                    40%{transform:translateX(6px)}
                    60%{transform:translateX(-4px)}
                    80%{transform:translateX(4px)}
                }
            `}</style>
        </div>
    );
}
