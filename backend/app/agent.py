import os
import json
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

MODEL = "gemini-2.5-flash"  # Swap to "gemini-2.5-flash-lite" if you hit rate limits


def _generate_json(prompt: str, max_tokens: int = 200) -> dict | list:
    """
    Shared helper: ask Gemini for JSON-only output and parse it.
    """
    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            max_output_tokens=max_tokens,
        ),
    )

    return json.loads(resp.text)


def generate_pillars(future_self_statement: str) -> list[str]:
    """
    One-time, at onboarding: break an aspiration into 4–5 concrete capability pillars.
    """
    prompt = f"""
A person wants to become "{future_self_statement}".

Break this into exactly 4–5 concrete, learnable capability pillars (2–4 words each).

Return ONLY a JSON array of strings, nothing else.
"""

    return _generate_json(prompt, max_tokens=200)


def generate_rationale(
    pillar_name: str,
    content_title: str,
    user_moment: str | None,
) -> str:
    """
    Per recommendation: one sentence explaining why this, why now.
    """
    moment_clause = (
        f'The user mentioned: "{user_moment}".'
        if user_moment
        else ""
    )

    prompt = f"""
Pillar: {pillar_name}

Recommended content: "{content_title}"

{moment_clause}

Write ONE short, warm, specific sentence explaining why this piece fits
this pillar right now.

No preamble, just the sentence.
"""

    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            max_output_tokens=100,
        ),
    )

    return resp.text.strip()


def summarize_journal(
    entry_text: str,
    pillars: list[str],
) -> dict:
    """
    After a journal entry: which pillars did this touch,
    and how much did mastery move?
    """
    prompt = f"""
Pillars being tracked:
{pillars}

Journal entry:
"{entry_text}"

For each pillar this entry meaningfully touches,
estimate a mastery delta from -5 to +10.

Return ONLY JSON:

{{"pillar_name": delta, ...}}

Omit pillars not touched.
"""

    return _generate_json(prompt, max_tokens=200)


def generate_twin_message(
    future_self_statement: str,
    pillars: list[dict],
    user_note: str | None = None,
) -> str:
    """
    On-demand: speak in first person AS the user's future self,
    using their live pillar data.
    """
    pillar_summary = ", ".join(
        f'{p["name"]} at {p["mastery_score"]}/100'
        for p in pillars
    )

    weakest = min(
        pillars,
        key=lambda p: p["mastery_score"],
    )

    note_clause = (
        f'They just said: "{user_note}".'
        if user_note
        else ""
    )

    prompt = f"""
You ARE the future version of this person:

"{future_self_statement}"

Their current pillar progress:

{pillar_summary}

Their weakest pillar right now is:

"{weakest["name"]}"

{note_clause}

Speak in first person, as their future self.

Give one short, warm, specific piece of encouragement or advice tied to
their weakest pillar.

Keep it to 2–3 sentences.

No preamble.
"""

    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            max_output_tokens=120,
        ),
    )

    return resp.text.strip()