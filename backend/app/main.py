from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

from app.agent import (
    generate_pillars,
    generate_rationale,
    summarize_journal,
    generate_twin_message,
    generate_opportunity_pitch,
)
from app.fusion_engine import (
    pick_recommendation_type,
    pick_weakest_priority_pillar,
    pick_eligible_opportunities,
)
from app.db import supabase

app = FastAPI(title="Kairos")

# ---------------- ROOT ROUTE ----------------

@app.get("/")
def root():
    return {
        "status": "Backend Running",
        "message": "Welcome to Kairos API"
    }

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD DATA ----------------

BASE_DIR = os.path.dirname(__file__)

with open(
    os.path.join(BASE_DIR, "..", "..", "content", "dataset.json"),
    encoding="utf-8",
) as f:
    CONTENT = json.load(f)

with open(
    os.path.join(BASE_DIR, "..", "..", "content", "opportunities.json"),
    encoding="utf-8",
) as f:
    OPPORTUNITIES = json.load(f)

# ---------------- ONBOARD ----------------

class OnboardRequest(BaseModel):
    future_self_statement: str


@app.post("/api/onboard")
def onboard(req: OnboardRequest):
    pillars = generate_pillars(req.future_self_statement)
    return {"pillars": pillars}


# ---------------- RECOMMEND ----------------

class RecommendRequest(BaseModel):
    pillars: list[dict]
    user_moment: str | None = None
    drift_detected: bool = False


@app.post("/api/recommend")
def recommend(req: RecommendRequest):
    target = pick_weakest_priority_pillar(req.pillars)

    rec_type = pick_recommendation_type(
        target["mastery_score"],
        bool(req.user_moment),
        req.drift_detected,
    )

    candidates = [
        c
        for c in CONTENT
        if target["name"].lower() in [t.lower() for t in c["tags"]]
    ]

    pick = candidates[0] if candidates else CONTENT[0]

    rationale = generate_rationale(
        target["name"],
        pick["title"],
        req.user_moment,
    )

    return {
        "pillar": target["name"],
        "recommendation_type": rec_type,
        "content": pick,
        "rationale": rationale,
    }


# ---------------- JOURNAL ----------------

class JournalRequest(BaseModel):
    text: str
    pillar_names: list[str]
    pillar_ids: dict[str, str] | None = None


@app.post("/api/journal")
def journal(req: JournalRequest):
    deltas = summarize_journal(req.text, req.pillar_names)

    if req.pillar_ids:
        for pillar_name, delta in deltas.items():
            pillar_id = req.pillar_ids.get(pillar_name)

            if not pillar_id:
                continue

            current = (
                supabase.table("pillars")
                .select("mastery_score")
                .eq("id", pillar_id)
                .single()
                .execute()
            )

            current_score = current.data["mastery_score"]

            new_score = max(
                0,
                min(100, current_score + delta),
            )

            (
                supabase.table("pillars")
                .update({"mastery_score": new_score})
                .eq("id", pillar_id)
                .execute()
            )

            (
                supabase.table("mastery_history")
                .insert(
                    {
                        "pillar_id": pillar_id,
                        "score": new_score,
                    }
                )
                .execute()
            )

    return {"mastery_deltas": deltas}


# ---------------- FUTURE SELF ----------------

class TwinMessageRequest(BaseModel):
    future_self_statement: str
    pillars: list[dict]
    user_note: str | None = None


@app.post("/api/twin-message")
def twin_message(req: TwinMessageRequest):
    message = generate_twin_message(
        req.future_self_statement,
        req.pillars,
        req.user_note,
    )

    return {
        "message": message
    }


# ---------------- TIMELINE ----------------

@app.get("/api/timeline")
def timeline(user_id: str):
    future_self = (
        supabase.table("future_selves")
        .select("id")
        .eq("user_id", user_id)
        .execute()
    )

    future_self_ids = [f["id"] for f in future_self.data]

    if not future_self_ids:
        return {"points": []}

    pillars = (
        supabase.table("pillars")
        .select("id, name")
        .in_("future_self_id", future_self_ids)
        .execute()
    )

    pillar_lookup = {
        p["id"]: p["name"]
        for p in pillars.data
    }

    if not pillar_lookup:
        return {"points": []}

    history = (
        supabase.table("mastery_history")
        .select("pillar_id, score, recorded_at")
        .in_("pillar_id", list(pillar_lookup.keys()))
        .order("recorded_at")
        .execute()
    )

    points = [
        {
            "pillar_name": pillar_lookup[h["pillar_id"]],
            "score": h["score"],
            "recorded_at": h["recorded_at"],
        }
        for h in history.data
    ]

    return {
        "points": points
    }


# ---------------- OPPORTUNITIES ----------------

class OpportunitiesRequest(BaseModel):
    future_self_statement: str
    pillars: list[dict]
    mastery_threshold: int = 60


@app.post("/api/opportunities")
def opportunities(req: OpportunitiesRequest):

    eligible = pick_eligible_opportunities(
        req.pillars,
        OPPORTUNITIES,
        req.mastery_threshold,
    )

    results = []

    for opp in eligible:

        pitch = generate_opportunity_pitch(
            opp["matched_pillars"],
            opp["title"],
        )

        results.append(
            {
                **opp,
                "pitch": pitch,
            }
        )

    return {
        "opportunities": results
    }