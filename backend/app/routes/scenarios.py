"""GET /scenarios — fetch all scenarios from Supabase."""
from fastapi import APIRouter, HTTPException
from typing import List
from app.database import supabase
from app.models import Scenario

router = APIRouter()


@router.get("/scenarios", response_model=List[Scenario])
async def get_scenarios():
    """Return all scenarios ordered by creation time."""
    try:
        response = supabase.table("scenarios").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scenarios/seed")
async def seed_scenarios():
    """
    Seed the database with Thai phishing scenarios based on real incidents in Thailand.
    Call once at: GET /api/scenarios/seed
    """
    sample_scenarios = [
        # ── Scenario 1: SMS ธนาคารกรุงไทยปลอม ──────────────────────────────
        {
            "type": "sms",
            "sender": "KrungThai Bank",
            "subject": None,
            "content": (
                "ธนาคารกรุงไทย: บัญชีของท่านถูกระงับชั่วคราว "
                "เนื่องจากพบธุรกรรมที่ผิดปกติ "
                "กรุณายืนยันตัวตนภายใน 24 ชั่วโมง มิฉะนั้นบัญชีจะถูกปิดถาวร "
                "คลิกที่นี่: http://krungthai-secure-verify.net/login"
            ),
            "red_flags": [
                {
                    "text": "ถูกระงับชั่วคราว",
                    "reason": "การขู่ระงับบัญชีเป็นเทคนิคสร้างความตื่นตระหนกเพื่อให้กระทำโดยไม่คิด",
                },
                {
                    "text": "24 ชั่วโมง",
                    "reason": "การกำหนดเส้นตายปลอมบีบให้ตัดสินใจรีบโดยไม่ตรวจสอบ",
                },
                {
                    "text": "ปิดถาวร",
                    "reason": "การขู่สูญเสียถาวรเป็นกลวิธีบงการอารมณ์ให้เกิดความกลัว",
                },
                {
                    "text": "http://krungthai-secure-verify.net",
                    "reason": "โดเมนปลอม — ธนาคารกรุงไทยใช้ krungthai.com เท่านั้น ไม่ใช่ .net",
                },
            ],
            "choices": [
                {
                    "label": "กดลิงก์เพื่อยืนยันตัวตน",
                    "is_correct": False,
                    "explanation": (
                        "นี่คือเว็บฟิชชิ่ง! ธนาคารไม่เคยส่ง SMS ให้กดลิงก์เพื่อยืนยันตัวตน "
                        "หากกดเข้าไปและกรอกข้อมูล แฮกเกอร์จะได้รหัสผ่านธนาคารของคุณทันที"
                    ),
                },
                {
                    "label": "โทรหาธนาคารโดยตรงและรายงานข้อความ",
                    "is_correct": True,
                    "explanation": (
                        "ถูกต้อง! ควรโทรหาธนาคารกรุงไทยที่เบอร์ 02-111-1111 "
                        "หรือเข้าแอป KTB netbank โดยตรง อย่าเชื่อหรือกดลิงก์ใน SMS เด็ดขาด"
                    ),
                },
            ],
        },
        # ── Scenario 2: อีเมลปลอมกรมสรรพากร ────────────────────────────────
        {
            "type": "email",
            "sender": "noreply@rd-th-gov.com",
            "subject": "แจ้งเตือน: มีภาษีค้างชำระ กรุณาดำเนินการด่วน",
            "content": (
                "เรียน ผู้เสียภาษีอากร\n\n"
                "ระบบตรวจสอบของกรมสรรพากรพบว่าท่านมียอดภาษีค้างชำระ จำนวน 8,450 บาท "
                "จากการยื่นแบบ ภ.ง.ด.90 ปี 2566 ที่ไม่ครบถ้วน\n\n"
                "หากไม่ดำเนินการชำระภายใน 48 ชั่วโมง ท่านจะถูกดำเนินคดีตามกฎหมาย "
                "และอาจถูกอายัดทรัพย์สิน\n\n"
                "ชำระภาษีออนไลน์ได้ที่: http://rd-th-gov.com/pay-tax\n\n"
                "กรมสรรพากร\nกระทรวงการคลัง"
            ),
            "red_flags": [
                {
                    "text": "noreply@rd-th-gov.com",
                    "reason": "อีเมลปลอม — กรมสรรพากรใช้โดเมน @rd.go.th เท่านั้น ไม่ใช่ .com",
                },
                {
                    "text": "48 ชั่วโมง",
                    "reason": "กำหนดเวลาเร่งด่วนปลอมเพื่อกดดันให้ตัดสินใจโดยไม่ตรวจสอบ",
                },
                {
                    "text": "ถูกดำเนินคดีตามกฎหมาย",
                    "reason": "การขู่ด้วยกฎหมายเป็นกลวิธีหลอกลวงที่พบบ่อย หน่วยงานราชการไม่แจ้งทางอีเมลเช่นนี้",
                },
                {
                    "text": "http://rd-th-gov.com",
                    "reason": "โดเมนปลอม — เว็บไซต์จริงของกรมสรรพากรคือ www.rd.go.th เท่านั้น",
                },
            ],
            "choices": [
                {
                    "label": "กดลิงก์และชำระเงินทันที",
                    "is_correct": False,
                    "explanation": (
                        "อย่ากดเด็ดขาด! นี่คืออีเมลฟิชชิ่ง "
                        "หากกรอกข้อมูลบัตรเครดิต แฮกเกอร์จะได้ข้อมูลทางการเงินของคุณทันที "
                        "กรมสรรพากรจะส่งเอกสารทางไปรษณีย์จริง ไม่ใช่อีเมล"
                    ),
                },
                {
                    "label": "ลบอีเมลและตรวจสอบผ่าน www.rd.go.th",
                    "is_correct": True,
                    "explanation": (
                        "ถูกต้อง! เว็บจริงของกรมสรรพากรคือ www.rd.go.th เท่านั้น "
                        "หรือโทร 1161 สายด่วนกรมสรรพากร เพื่อตรวจสอบสถานะภาษีของคุณ"
                    ),
                },
            ],
        },
        # ── Scenario 3: SMS ไปรษณีย์ไทยปลอม ────────────────────────────────
        {
            "type": "sms",
            "sender": "Thailand Post",
            "subject": None,
            "content": (
                "ไปรษณีย์ไทย: พัสดุของท่านหมายเลข TH8821049930 ไม่สามารถจัดส่งได้ "
                "เนื่องจากยังไม่ได้ชำระค่าธรรมเนียมศุลกากร จำนวน 39 บาท "
                "กรุณาชำระภายในวันนี้เพื่อรับพัสดุของท่าน: "
                "https://thailandp0st-delivery.com/pay"
            ),
            "red_flags": [
                {
                    "text": "39 บาท",
                    "reason": "ค่าธรรมเนียมเล็กน้อยดูไม่อันตราย แต่เป็นกับดักเพื่อขโมยข้อมูลบัตรเครดิต",
                },
                {
                    "text": "https://thailandp0st-delivery.com",
                    "reason": "โดเมนปลอม — ใช้ตัวเลข '0' แทนตัวอักษร 'o' ในคำว่า 'post' เว็บจริงคือ thailandpost.com",
                },
            ],
            "choices": [
                {
                    "label": "กดลิงก์และจ่ายค่าธรรมเนียม 39 บาท",
                    "is_correct": False,
                    "explanation": (
                        "อย่ากด! แม้ยอดเงินจะน้อย แต่เมื่อกรอกข้อมูลบัตรบนเว็บปลอม "
                        "แฮกเกอร์จะได้หมายเลขบัตร รหัส CVV และสามารถนำไปใช้จ่ายเงินจำนวนมากได้"
                    ),
                },
                {
                    "label": "ตรวจสอบพัสดุผ่านแอปไปรษณีย์ไทย",
                    "is_correct": True,
                    "explanation": (
                        "ถูกต้อง! ควรตรวจสอบสถานะพัสดุผ่านแอปไปรษณีย์ไทยหรือเว็บ www.thailandpost.com โดยตรง "
                        "หรือโทร 1545 ไปรษณีย์ไทยไม่เคยส่ง SMS ให้จ่ายค่าธรรมเนียมผ่านลิงก์"
                    ),
                },
            ],
        },
        # ── Scenario 4: SMS LINE Phishing ────────────────────────────────────
        {
            "type": "sms",
            "sender": "LINE Thailand",
            "subject": None,
            "content": (
                "LINE แจ้งเตือน: บัญชี LINE ของคุณถูกรายงานว่ามีพฤติกรรมผิดปกติ "
                "บัญชีของคุณจะถูกระงับถาวรใน 2 ชั่วโมง "
                "ยืนยันตัวตนเพื่อรักษาบัญชีของคุณ: http://line-verify-account.xyz/confirm"
            ),
            "red_flags": [
                {
                    "text": "ถูกระงับถาวรใน 2 ชั่วโมง",
                    "reason": "กำหนดเวลาเร่งด่วนปลอมเพื่อให้ตัดสินใจรีบ โดยไม่ตรวจสอบ",
                },
                {
                    "text": "http://line-verify-account.xyz",
                    "reason": "โดเมนปลอม — LINE ไม่มีโดเมน .xyz LINE ส่งการแจ้งเตือนผ่านแอปโดยตรงเท่านั้น",
                },
            ],
            "choices": [
                {
                    "label": "กดลิงก์เพื่อยืนยันบัญชี LINE",
                    "is_correct": False,
                    "explanation": (
                        "นี่คือ LINE Phishing ที่พบบ่อยมากในไทย! "
                        "หากกดและล็อกอิน แฮกเกอร์จะเข้าควบคุมบัญชี LINE ของคุณ "
                        "และใช้ขอยืมเงินจากเพื่อนและครอบครัว"
                    ),
                },
                {
                    "label": "ไม่กด และตรวจสอบในแอป LINE โดยตรง",
                    "is_correct": True,
                    "explanation": (
                        "ถูกต้อง! LINE จะแจ้งเตือนด้านความปลอดภัยผ่านแอปโดยตรง ไม่ใช่ทาง SMS "
                        "หากสงสัยให้เปิดแอป LINE แล้วไปที่ การตั้งค่า > บัญชีของคุณ เพื่อตรวจสอบ"
                    ),
                },
            ],
        },
        # ── Scenario 5: TradingView Deepfake AI CEO Scam (Website) ─────────────
        {
            "type": "website",
            "sender": "tradingview-global-beta.net",
            "subject": "TradingView AI Bot — เปิดตัวอย่างเป็นทางการ | Live Now",
            "content": (
                "🔴 LIVE: CEO TradingView ประกาศเปิดตัว AI Trading Bot รุ่นใหม่ล่าสุด!\n\n"
                "ระบบ AI ของเราวิเคราะห์ตลาดได้แม่นยำ 94.7% ผลตอบแทนเฉลี่ย 300%+ ต่อปี\n\n"
                "⚡ โปรโมชั่นพิเศษ: ดาวน์โหลดแอปฟรี 500 ที่นั่งแรกเท่านั้น!\n"
                "✅ ได้รับการยืนยันจาก CEO โดยตรงใน Live Stream นี้\n"
                "🔒 ระบบปลอดภัยระดับ Military-Grade Encryption\n\n"
                "⚠️ หมายเหตุ: แอปนี้ไม่มีในร้านค้าทางการ ต้องดาวน์โหลด .apk โดยตรง"
            ),
            "red_flags": [
                {
                    "text": "tradingview-global-beta.net",
                    "reason": "โดเมนปลอม — TradingView ใช้ tradingview.com เท่านั้น ไม่มี -global-beta.net",
                },
                {
                    "text": "94.7%",
                    "reason": "ตัวเลขความแม่นยำสูงเกินจริง ไม่มีระบบ AI ใดการันตีผลตอบแทนได้ 100%",
                },
                {
                    "text": "300%+ ต่อปี",
                    "reason": "ผลตอบแทนสูงผิดปกติเป็นสัญญาณ Scam — นักลงทุนมืออาชีพระดับโลกทำได้เฉลี่ยแค่ 7-15% ต่อปี",
                },
                {
                    "text": "ต้องดาวน์โหลด .apk โดยตรง",
                    "reason": "แอปที่ถูกกฎหมายจะอยู่ใน App Store / Play Store เท่านั้น APK นอกร้านอย่างเป็นทางการคือมัลแวร์",
                },
            ],
            "choices": [
                {
                    "label": "ดาวน์โหลด TradingView-AI.apk",
                    "is_correct": False,
                    "explanation": (
                        "อันตรายมาก! นี่คือมัลแวร์ที่ปลอมตัวเป็นแอป TradingView "
                        "เหตุการณ์นี้เคยเกิดขึ้นจริงในไทยปี 2567 "
                        "มิจฉาชีพใช้ AI Clone เสียงและใบหน้า CEO จริงๆ มา Live Stream หลอกนักเทรด "
                        "เมื่อติดตั้ง APK แล้ว มัลแวร์จะซ่อนตัวในเครื่องและดักจับรหัสผ่าน "
                        "ข้อมูล Wallet และ Private Key ทุกครั้งที่คุณเทรด"
                    ),
                },
                {
                    "label": "ปิดเว็บและรายงาน",
                    "is_correct": True,
                    "explanation": (
                        "ถูกต้อง! นี่คือกลโกง Deepfake AI ที่อันตรายมาก "
                        "ควรปิดเว็บนี้ทันที ไม่ดาวน์โหลดไฟล์ใดๆ "
                        "แอปที่ถูกกฎหมายจาก TradingView มีให้ดาวน์โหลดผ่าน Play Store / App Store เท่านั้น "
                        "หากพบเว็บปลอมลักษณะนี้ให้รายงานที่ www.etda.or.th หรือโทร 1212"
                    ),
                },
            ],
        },
    ]

    try:
        response = supabase.table("scenarios").insert(sample_scenarios).execute()
        return {"message": f"Seeded {len(response.data)} scenarios successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/scenarios/clear")
async def clear_scenarios():
    """
    Delete ALL scenarios from the database.
    Use this before re-seeding to avoid duplicates.
    Call: DELETE /api/scenarios/clear
    """
    try:
        # Step 1: Delete all attempts first (foreign key constraint)
        supabase.table("attempts").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        # Step 2: Delete all scenarios
        response = supabase.table("scenarios").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        return {"message": f"Cleared {len(response.data)} scenario(s) and all attempts from database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
