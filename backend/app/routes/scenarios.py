from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Scenario, ScenarioResponse
import json

router = APIRouter()

@router.get("/scenarios", response_model=List[ScenarioResponse])
async def get_scenarios(db: Session = Depends(get_db)):
    """Return all scenarios ordered by creation time."""
    try:
        scenarios = db.query(Scenario).order_by(Scenario.created_at).all()
        return scenarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy import text

@router.get("/scenarios/seed")
async def seed_scenarios(db: Session = Depends(get_db)):
    """
    Seed the database with Thai phishing + safe scenarios.
    """
    sample_scenarios = [
        {
            "title": "แลกคะแนน AIS Points",
            "category": "SMS",
            "difficulty": "Easy",
            "sender_name": "AIS",
            "content_body": "บริการ AIS Points: คุณมี 9,233 คะแนนจะหมดอายุวันนี้! แลกรับรางวัลที่ https://ais-redeem-point.com",
            "hint_message": "ลองสังเกตลิงก์ที่ให้มาว่าสะกดถูกต้องหรือไม่?",
            "red_flags": [
                {"part": "ลิงก์", "desc": "ais-redeem-point.com ไม่ใช่โดเมนจริงของ AIS"},
                {"part": "ความเร่งด่วน", "desc": "มักจะอ้างว่าหมดอายุวันนี้เพื่อให้รีบกด"}
            ],
            "ui_triggers": {
                "fail_triggers": [{"label": "ลิงก์ปลอม", "isCorrect": False}],
                "pass_triggers": [{"label": "ลบข้อความ", "isCorrect": True}]
            },
            "explanation": "AIS ยืนยันว่าไม่มีนโยบายส่ง SMS พร้อมลิงก์เพื่อให้ลูกค้าแลกคะแนนสะสม การแลกคะแนนทุกกรณีควรทำผ่านแอป myAIS เท่านั้น"
        },
        {
            "title": "รหัส OTP ธนาคาร",
            "category": "SMS",
            "difficulty": "Medium",
            "sender_name": "KBank",
            "content_body": "รหัส OTP คือ 492015 สำหรับโอนเงิน 1,500 บาท หากไม่ได้ทำรายการ โปรดติดต่อ 02-888-8888",
            "hint_message": "SMS นี้ไม่มีลิงก์ให้กด และระบุเบอร์ติดต่อที่ถูกต้องของธนาคาร",
            "red_flags": [],
            "ui_triggers": {
                "pass_triggers": [{"label": "เก็บไว้/ย้อนกลับ", "isCorrect": True}],
                "fail_triggers": [{"label": "ลบข้อความจริง", "isCorrect": False}]
            },
            "explanation": "นี่คือ SMS ของจริง การลบหรือรายงานข้อความจริงอาจทำให้เราพลาดข้อมูลสำคัญ แต่การไม่กดลิงก์สุ่มสี่สุ่มห้าถือเป็นนิสัยที่ดี"
        },
        {
            "title": "แจ้งค้างชำระค่าไฟฟ้า",
            "category": "EMAIL",
            "difficulty": "Hard",
            "sender_name": "MEA - การไฟฟ้านครหลวง",
            "content_body": "แจ้งค้างชำระค่าไฟฟ้าเกินกำหนด โปรดชำระทันทีเพื่อหลีกเลี่ยงการถูกตัดไฟ",
            "hint_message": "ตรวจสอบโดเมนอีเมลผู้ส่ง @mea-service.net ว่าใช่ของจริงหรือไม่?",
            "red_flags": [
                {"part": "ผู้ส่ง", "desc": "MEA จริงใช้ @mea.or.th ไม่ใช่ @mea-service.net"},
                {"part": "ลิงก์", "desc": "นำไปสู่เว็บปลอมเพื่อหลอกเอาข้อมูลบัตร"}
            ],
            "ui_triggers": {
                "fail_triggers": [{"label": "กรอกข้อมูลบัตร", "isCorrect": False}],
                "pass_triggers": [{"label": "รายงานสแปม", "isCorrect": True}]
            },
            "explanation": "การไฟฟ้าไม่มีนโยบายส่งอีเมลขู่ตัดไฟพร้อมแนบลิงก์ให้กรอกข้อมูลบัตรเครดิต การตรวจสอบโดเมนผู้ส่งเป็นวิธีป้องกันที่ได้ผลที่สุด"
        },
        {
            "title": "อัปเดตระบบ Google Workspace",
            "category": "EMAIL",
            "difficulty": "Medium",
            "sender_name": "Google Workspace Updates",
            "content_body": "การอัปเดตฟีเจอร์ใหม่สำหรับ Google Meet ประจำเดือนนี้",
            "hint_message": "ตรวจสอบโดเมนผู้ส่ง @google.com ว่าเป็นทางการหรือไม่?",
            "red_flags": [],
            "ui_triggers": {
                "pass_triggers": [{"label": "คลิกลิงก์ปลอดภัย", "isCorrect": True}],
                "fail_triggers": [{"label": "ลบอีเมลจริง", "isCorrect": False}]
            },
            "explanation": "อีเมลจาก Google จริงจะมาจากโดเมน @google.com และไม่มีการเร่งรัดให้กรอกข้อมูลส่วนตัว การแยกแยะอีเมลงานของจริงได้ช่วยให้การทำงานไม่สะดุด"
        },
        {
            "title": "เว็บปลอม Netflix หลอกอัปเดตบัตรเครดิต",
            "category": "WEBSITE",
            "difficulty": "Hard",
            "sender_name": "netfl1x-billing-update-th.com",
            "content_body": "บัญชีของคุณถูกระงับชั่วคราว! กรุณาอัปเดตข้อมูลบัตรเครดิตของคุณภายใน 24 ชั่วโมง เพื่อรับชมภาพยนตร์และซีรีส์ต่อ",
            "hint_message": "สังเกต URL ในแถบ address bar ให้ดี มีตัวอักษรผิดปกติหรือไม่?",
            "red_flags": [
                {"part": "URL (netfl1x)", "desc": "ใช้ตัวเลข '1' แทนตัวอักษร 'i' เพื่อทำให้สับสน โดเมนของจริงคือ netflix.com เท่านั้น"},
                {"part": "ความเร่งด่วน 24 ชั่วโมง", "desc": "การกดดันให้กระทำภายในเวลาจำกัด คือกลเม็ดหลักของ Social Engineering"},
                {"part": "ฟอร์มกรอกข้อมูลบัตร", "desc": "บริการ Streaming ที่ถูกกฎหมายไม่เคยขอให้ยืนยันบัตรผ่านเว็บภายนอก"}
            ],
            "ui_triggers": {
                "component": "FakeNetflixWebsiteScenario",
                "fail_triggers": [
                    {"label": "อัปเดตข้อมูลการชำระเงิน", "isCorrect": False}
                ],
                "pass_triggers": [
                    {"label": "ปิดแท็บ (Close button)", "isCorrect": True},
                    {"label": "ตรวจสอบ URL", "isCorrect": True}
                ]
            },
            "explanation": "นี่คือการโจมตีแบบ Phishing Website ที่ลอกเลียนแบบ Netflix ด้วยการ Typosquatting (netfl1x แทน netflix) หากกรอกข้อมูลบัตรเครดิตลงไป มิจฉาชีพจะได้รับข้อมูลทันที วิธีป้องกันคือตรวจสอบ URL เสมอก่อนกรอกข้อมูลใดๆ"
        },
        {
            "title": "[SAFE] SMS โปรโมชัน dtac ของจริง",
            "category": "SMS",
            "difficulty": "Medium",
            "sender_name": "dtac",
            "content_body": "สาดความอิ่มคุ้ม เน็ต 50GB 15วัน 299บ ฟรีคูปองสุกี้ตี๋น้อยพร้อมเครื่องดื่ม 276บ คุ้มทะลุแป้ง จัดเลย https://www.dtac.co.th/s/7doDnlW",
            "hint_message": "สังเกต Sender ID และโดเมนของลิงก์ นี่คือ SMS โปรโมชันจากดีแทคของจริง!",
            "red_flags": [],
            "ui_triggers": {
                "component": "SafeDtacSmsScenario",
                "pass_triggers": [
                    {"label": "เยี่ยมมาก! 🔍", "isCorrect": True},
                    {"label": "ถูกต้อง! ✅", "isCorrect": True}
                ],
                "fail_triggers": [
                    {"label": "เดี๋ยวก่อน! ⚠️", "isCorrect": False}
                ]
            },
            "explanation": "SMS นี้คือ SMS โปรโมชันของจริงจาก dtac Sender ID ที่จดทะเบียนถูกต้อง ลิงก์ชี้ไปยัง dtac.co.th ซึ่งเป็นโดเมนทางการของดีแทค ความระแวงเกินขนาด (False Positive) อาจทำให้คุณพลาดสิทธิประโยชน์ที่แท้จริงได้"
        },
        {
            "title": "นายหน้าหลอกเข้ากลุ่ม (OpenChat Scam)",
            "category": "CHAT",
            "difficulty": "Intermediate",
            "sender_name": "นาเดียร์ (นายหน้า)",
            "content_body": "เราเป็นนายหน้านะคะ พอดีพี่ที่เค้าพร้อมซื้อแกซื้อขายในกลุ่มค่ะ พี่สะดวกเข้าไปคุยรายละเอียดกะเค้ามั้ย รับทั้งหมดเลยค่ะ [LINE OPENCHAT คำเชิญ: VIP KRISSHOP - ซื้อขายสินค้าแบรนด์เนม]",
            "hint_message": "ทำไมนายหน้าถึงต้องให้เข้า OpenChat ก่อน? การซื้อขายจริงไม่ควรมีค่าใช้จ่ายเพื่อเข้ากลุ่ม",
            "red_flags": [
                {"part": "นายหน้าแปลกหน้า", "desc": "คนที่ไม่รู้จักอ้างตัวเป็นนายหน้าและพยายามดึงเข้ากลุ่มบุคคลที่สาม"},
                {"part": "LINE OpenChat ปลอม", "desc": "กลุ่มที่มีสมาชิกจำนวนมากแต่ไม่รู้จัก มักเป็นหน้าม้าที่มิจฉาชีพจ้างมา"},
                {"part": "ค่าสมาชิก/ค่าประกัน", "desc": "การซื้อขายจริงไม่ต้องจ่ายเงินเพื่อเข้าไปขาย ถ้ามีค่าใช้จ่ายนั่นคือสัญญาณอันตราย"}
            ],
            "ui_triggers": {
                "component": "FakeLineChatScenario",
                "fail_triggers": [
                    {"label": "เสร็จโจร! 🚨", "isCorrect": False}
                ],
                "pass_triggers": [
                    {"label": "ยอดเยี่ยม! 🛡️", "isCorrect": True},
                    {"label": "เยี่ยมมาก! ✅", "isCorrect": True}
                ]
            },
            "explanation": "นี่คือกลโกง OpenChat Scam ที่กำลังระบาดบน LINE มิจฉาชีพสวมรอยเป็นนายหน้าเพื่อดึงเหยื่อเข้ากลุ่มปลอมที่มีหน้าม้า จากนั้นจะหลอกให้โอน 'ค่าประกันสินค้า' หรือ 'ค่าสมาชิก' การซื้อขายจริงไม่ต้องจ่ายเงินเพื่อเข้าไปขาย และไม่ควรเชื่อคนแปลกหน้าที่อ้างตัวเป็นนายหน้า"
        },
        {
            "title": "ลูกค้าตัวจริงขอซื้อสินค้า (Safe Chat)",
            "category": "CHAT",
            "difficulty": "Beginner",
            "sender_name": "คุณบอย (ลูกค้า)",
            "content_body": "ลดเหลือ 1,700 ถ้วนได้ไหมครับ ถ้าได้ผมพร้อมโอนเลยครับ ขอเลขบัญชีหน่อยครับ",
            "hint_message": "บทสนทนานี้ปกติไหม? มีการส่งลิงก์แปลกๆ หรือดึงเข้ากลุ่มหรือเปล่า?",
            "red_flags": [],
            "ui_triggers": {
                "component": "SafeLineChatScenario",
                "pass_triggers": [
                    {"label": "ยอดเยี่ยม! ✅", "isCorrect": True}
                ],
                "fail_triggers": [
                    {"label": "เดี๋ยวก่อน! ⚠️", "isCorrect": False}
                ]
            },
            "explanation": "นี่คือการซื้อขายปกติและปลอดภัย ลูกค้าจะสอบถามสินค้า ต่อรองราคา และขอเลขบัญชีเพื่อโอนเงินโดยตรง โดยไม่มีการส่งลิงก์ให้กด ไม่มีการอ้างนายหน้า และไม่มีการดึงเข้ากลุ่ม LINE ใดๆ ความระแวงเกินขนาดอาจทำให้พลาดโอกาสในการขายได้"
        }
    ]

    try:
        db.execute(text("TRUNCATE TABLE user_attempts, scenarios RESTART IDENTITY CASCADE"))
        
        for s_data in sample_scenarios:
            db_scenario = Scenario(**s_data)
            db.add(db_scenario)
        
        db.commit()
        return {"message": f"Seeded {len(sample_scenarios)} scenarios successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/scenarios/clear")
async def clear_scenarios(db: Session = Depends(get_db)):
    """
    Delete ALL scenarios and attempts from the database.
    """
    try:
        from app.models import UserAttempt
        db.query(UserAttempt).delete()
        db.query(Scenario).delete()
        db.commit()
        return {"message": "Cleared all scenarios and attempts from database."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
