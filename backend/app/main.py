def pick_recommendation_type(mastery_score: int, has_moment: bool, drift_detected: bool) -> str:
    gap = 100 - mastery_score
    if drift_detected:
        return "redirect_nudge"
    if gap >= 60:
        return "just_in_time_deep" if has_moment else "foundational_primer"
    if gap < 30:
        return "stretch_expert"
    return "foundational_primer"


def pick_weakest_priority_pillar(pillars: list[dict]) -> dict:
    """pillars: [{name, mastery_score, priority_weight}, ...]
    Weakest AND most-prioritized wins — priority_weight breaks ties toward what the user cares about."""
    return max(pillars, key=lambda p: (100 - p["mastery_score"]) * p["priority_weight"])


def pick_eligible_opportunities(pillars: list[dict], opportunities: list[dict], threshold: int = 60) -> list[dict]:
    """NEW — AI Opportunity Discovery: deterministic eligibility check, kept out of Gemini on
    purpose (same rule as the rest of this file — hard logic stays separate from agentic
    reasoning). A pillar "unlocks" opportunities tagged to it once mastery_score crosses
    `threshold` (default 60), and each opportunity can optionally require a higher bar via
    its own `min_mastery` field.

    pillars: [{name, mastery_score, priority_weight}, ...]
    opportunities: [{id, title, type, url, tags, min_mastery}, ...] — see content/opportunities.json

    Returns each eligible opportunity with a `matched_pillars` list appended, so main.py can
    ask agent.generate_opportunity_pitch() for a one-line "why you're eligible" message per item.
    """
    mastered = {p["name"].lower(): p["mastery_score"] for p in pillars if p["mastery_score"] >= threshold}

    eligible = []
    for opp in opportunities:
        required = opp.get("min_mastery", threshold)
        matched = [
            tag for tag in opp["tags"]
            if tag.lower() in mastered and mastered[tag.lower()] >= required
        ]
        if matched:
            eligible.append({**opp, "matched_pillars": matched})

    return eligible
