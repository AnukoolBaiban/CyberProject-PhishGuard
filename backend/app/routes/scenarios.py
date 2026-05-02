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
    Seed the database with the 4 specific Thai phishing scenarios.
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
        }
    ]

    try:
        # Use raw SQL TRUNCATE CASCADE to handle foreign keys properly
        db.execute(text("TRUNCATE TABLE user_attempts, scenarios RESTART IDENTITY CASCADE"))
        
        for s_data in sample_scenarios:
            db_scenario = Scenario(**s_data)
            db.add(db_scenario)
        
        db.commit()
        return {"message": f"Seeded {len(sample_scenarios)} scenarios successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
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
