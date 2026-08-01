import axios from "axios";

// Matches backend/app/main.py exactly. Base URL is Srushti's Render deploy
// (or localhost:8000 while developing) — see .env.local / VITE_API_URL.
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const client = axios.create({ baseURL: API, timeout: 30000 });

// Only the three fields fusion_engine.py / agent.py actually read.
// pillar_ids, drift flags, etc. are added per-call below.
function toApiPillars(pillars) {
  return pillars.map(({ name, mastery_score, priority_weight }) => ({
    name,
    mastery_score,
    priority_weight,
  }));
}

/**
 * POST /api/onboard  { future_self_statement }
 * -> { pillars: string[] }
 * (generate_pillars in agent.py — one Gemini call, no Supabase write)
 */
export async function onboard(future_self_statement) {
  const { data } = await client.post("/api/onboard", { future_self_statement });
  return data.pillars;
}

/**
 * POST /api/recommend  { pillars, user_moment, drift_detected }
 * -> { pillar, recommendation_type, content, rationale }
 * (pick_weakest_priority_pillar + pick_recommendation_type in fusion_engine.py,
 *  content match against content/dataset.json, generate_rationale in agent.py —
 *  all server-side, the frontend just renders what comes back)
 */
export async function recommend(pillars, { userMoment = null, driftDetected = false } = {}) {
  const { data } = await client.post("/api/recommend", {
    pillars: toApiPillars(pillars),
    user_moment: userMoment || null,
    drift_detected: !!driftDetected,
  });
  return data;
}

/**
 * POST /api/journal  { text, pillar_names, pillar_ids? }
 * -> { mastery_deltas: { pillar_name: delta } }
 * pillar_ids is an OPTIONAL { pillar_name: supabase_uuid } map. main.py only
 * writes to Supabase (pillars.mastery_score + mastery_history) when it's
 * supplied — see the README note on why this app currently omits it.
 */
export async function journal(text, pillarNames, pillarIds = null) {
  const { data } = await client.post("/api/journal", {
    text,
    pillar_names: pillarNames,
    pillar_ids: pillarIds,
  });
  return data.mastery_deltas;
}

/**
 * POST /api/twin-message  { future_self_statement, pillars, user_note }
 * -> { message }
 * (generate_twin_message in agent.py)
 */
export async function twinMessage(futureSelfStatement, pillars, userNote = null) {
  const { data } = await client.post("/api/twin-message", {
    future_self_statement: futureSelfStatement,
    pillars: toApiPillars(pillars),
    user_note: userNote || null,
  });
  return data.message;
}

/**
 * GET /api/timeline?user_id=...
 * -> { points: [{ pillar_name, score, recorded_at }] }
 * Reads future_selves -> pillars -> mastery_history in Supabase for that
 * user. Returns { points: [] } for any user_id with no persisted rows —
 * see the README note, this is where the current backend has a gap.
 */
export async function timeline(userId) {
  const { data } = await client.get("/api/timeline", { params: { user_id: userId } });
  return data.points;
}

/**
 * POST /api/opportunities  { future_self_statement, pillars, mastery_threshold }
 * -> { opportunities: [{ id, title, type, url, tags, min_mastery, matched_pillars, pitch }] }
 * (pick_eligible_opportunities in fusion_engine.py + generate_opportunity_pitch
 *  in agent.py — matched against content/opportunities.json server-side)
 */
export async function opportunities(futureSelfStatement, pillars, masteryThreshold = 60) {
  const { data } = await client.post("/api/opportunities", {
    future_self_statement: futureSelfStatement,
    pillars: toApiPillars(pillars),
    mastery_threshold: masteryThreshold,
  });
  return data.opportunities;
}
