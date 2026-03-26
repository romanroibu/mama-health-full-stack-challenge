import asyncio


async def generate_response(user_message: str) -> str:

    await asyncio.sleep(3)  # Simulate thinking time

    text = user_message.strip().lower()

    if not text:
        return (
            "Blub-blub! I heard a tiny splash but no question yet. "
            "Ask me about Crohn's symptoms, meds, side effects, injections, or missed doses!"
        )

    if _contains_any(text, ("hi", "hello", "hey", "good morning", "good evening")):
        return (
            "SPLASH-tastic hello! I am Dr. Squiggles, your overly enthusiastic goldfish guide. "
            "Ask me anything about Crohn's treatment, side effects, injections, food, or missed doses."
        )

    if _contains_any(
        text,
        ("side effect", "side effects", "nausea", "pain", "rash", "headache", "fever"),
    ):
        return (
            "Excellent safety question, champion swimmer! Mild side effects can happen with many Crohn's meds, "
            "but severe pain, trouble breathing, chest tightness, high fever, or facial swelling are urgent signals. "
            "Contact your care team right away for anything severe or worsening."
        )

    if _contains_any(text, ("dose", "dosage", "missed", "forget", "forgot", "late")):
        return (
            "Fantastic adherence question, fin-friend! If you miss a dose, check your medication instructions and "
            "contact your care team or pharmacist for exact timing. Do not double-dose unless they explicitly tell you to."
        )

    if _contains_any(text, ("inject", "injection", "shot", "pen", "needle")):
        return (
            "You are swimming in the right direction! For injections: use the prescribed technique, rotate sites, "
            "and watch for redness, warmth, or swelling that gets worse. If the reaction is severe, seek care promptly."
        )

    if _contains_any(text, ("food", "eat", "diet", "coffee", "alcohol", "drink")):
        return (
            "Meal-time mastery! Crohn's triggers vary by person, so keep a simple symptom-and-food log. "
            "Hydration and gentle foods during flares can help, and your clinician can guide a personalized plan."
        )

    if _contains_any(
        text, ("flare", "flare-up", "flare up", "worse", "blood", "stool", "diarrhea")
    ):
        return (
            "Big splash of support coming your way. Possible flare signs include worsening pain, diarrhea, blood in stool, "
            "or fatigue. Reach out to your care team early so they can adjust treatment before symptoms escalate."
        )

    if _contains_any(
        text, ("emergency", "urgent", "hospital", "severe", "can't breathe", "faint")
    ):
        return (
            "Alarm-fins activated: if symptoms feel severe or dangerous, seek urgent medical care now. "
            "I can support with general Crohn's guidance, but emergency evaluation should happen immediately."
        )

    if _contains_any(text, ("thanks", "thank you")):
        return "Anytime, superstar swimmer! I am here for Crohn's questions whenever you need me."

    return (
        "I am Dr. Squiggles, and I keep my fins on Crohn's-related support only. "
        "Ask me about symptoms, medication timing, side effects, injections, food triggers, or when to contact your care team."
    )


def _contains_any(text: str, keywords: tuple[str, ...]) -> bool:
    return any(keyword in text for keyword in keywords)
