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
    Seed the database with sample phishing scenarios.
    Call once at: GET /api/scenarios/seed
    """
    sample_scenarios = [
        {
            "type": "sms",
            "sender": "+1 (800) 555-0147",
            "subject": None,
            "content": (
                "URGENT: Your bank account has been SUSPENDED due to suspicious activity. "
                "Click here immediately to verify your identity and restore access: "
                "http://secure-bank-verify.xyz/login?token=abc123"
            ),
            "red_flags": [
                {"text": "URGENT", "reason": "Urgency tactics pressure you into acting without thinking."},
                {"text": "SUSPENDED", "reason": "Threatening account suspension is a classic phishing tactic."},
                {"text": "http://secure-bank-verify.xyz", "reason": "Suspicious domain — not an official bank URL."},
            ],
            "choices": [
                {
                    "label": "Click the link",
                    "is_correct": False,
                    "explanation": "Clicking unknown links from SMS can lead to credential theft or malware installation.",
                },
                {
                    "label": "Ignore and report",
                    "is_correct": True,
                    "explanation": "Correct! Always verify suspicious messages by contacting your bank directly through their official app or website.",
                },
            ],
        },
        {
            "type": "email",
            "sender": "support@paypa1-secure.com",
            "subject": "Action Required: Confirm Your Payment Information",
            "content": (
                "Dear Valued Customer,\n\n"
                "We have detected unusual login attempts on your PayPal account. "
                "To secure your account, you must verify your payment details within 24 hours "
                "or your account will be permanently limited.\n\n"
                "Click here to verify: http://paypa1-secure.com/verify\n\n"
                "PayPal Security Team"
            ),
            "red_flags": [
                {"text": "support@paypa1-secure.com", "reason": "Spoofed sender — 'paypa1' uses the number 1 instead of the letter l."},
                {"text": "24 hours", "reason": "Artificial deadline creates panic to bypass rational thinking."},
                {"text": "permanently limited", "reason": "Threat of permanent loss is a manipulation tactic."},
                {"text": "http://paypa1-secure.com", "reason": "Typosquatted domain designed to look like PayPal."},
            ],
            "choices": [
                {
                    "label": "Click 'Verify' and enter details",
                    "is_correct": False,
                    "explanation": "This is a phishing site. Entering credentials here hands them directly to attackers.",
                },
                {
                    "label": "Delete the email and log in via official site",
                    "is_correct": True,
                    "explanation": "Always navigate directly to paypal.com — never through email links. Legitimate companies rarely ask for credentials via email.",
                },
            ],
        },
        {
            "type": "sms",
            "sender": "Amazon Delivery",
            "subject": None,
            "content": (
                "Hello! Your Amazon package #AMZ-998231 could not be delivered. "
                "A $1.99 customs fee is required. Pay now to release your parcel: "
                "https://amaz0n-delivery-fee.com/pay"
            ),
            "red_flags": [
                {"text": "$1.99 customs fee", "reason": "Small fee requests seem harmless but are used to capture your payment card details."},
                {"text": "https://amaz0n-delivery-fee.com", "reason": "Fake Amazon domain — uses '0' instead of 'o' in 'amazon'."},
            ],
            "choices": [
                {
                    "label": "Pay the $1.99 fee",
                    "is_correct": False,
                    "explanation": "Submitting payment info on a fake site exposes your full card details to fraudsters.",
                },
                {
                    "label": "Check the Amazon app directly",
                    "is_correct": True,
                    "explanation": "Always verify delivery status through the official Amazon app or website, not via SMS links.",
                },
            ],
        },
    ]

    try:
        response = supabase.table("scenarios").insert(sample_scenarios).execute()
        return {"message": f"Seeded {len(response.data)} scenarios successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
