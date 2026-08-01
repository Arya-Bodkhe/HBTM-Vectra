def pick_recommendation_type(
    mastery_score: int,
    has_moment: bool,
    drift_detected: bool,
) -> str:

    gap = 100 - mastery_score

    if drift_detected:
        return "redirect_nudge"

    if gap >= 60:
        return (
            "just_in_time_deep"
            if has_moment
            else "foundational_primer"
        )

    if gap < 30:
        return "stretch_expert"

    return "foundational_primer"


def pick_weakest_priority_pillar(
    pillars: list[dict],
) -> dict:
    """
    Weakest AND highest priority wins.
    """

    return max(
        pillars,
        key=lambda p: (
            (100 - p["mastery_score"])
            * p["priority_weight"]
        ),
    )