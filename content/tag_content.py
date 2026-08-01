"""
tag_content.py — Janhavi's one-time helper (Part 6.2 of the Kairos build guide)

Run locally once Arya's backend/app/agent.py exists, to see which pillar
names Gemini tends to generate for the aspiration domains this dataset
covers. Compare that output against the tags already used in dataset.json
and adjust either side so onboarding-generated pillars always find a match
in the curated content.

Run from the content/ folder:
    python3 tag_content.py
"""
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.agent import generate_pillars  # noqa: E402

# The aspiration domains this dataset's 20 pillars were curated against
# (Voice Control, Storytelling, Audience Engagement, Handling Questions,
# Presentation Confidence, Active Listening, Decision Making, Team
# Communication, Conflict Resolution, Trust Building, Deep Focus,
# Distraction Management, Time Management, Energy Management, Habit
# Formation, Goal Setting, Emotional Intelligence, Critical Thinking,
# Problem Solving, Resilience).
DOMAINS = [
    "a confident public speaker",
    "a person who does deep, focused work",
    "a leader people trust",
    "someone with strong emotional intelligence",
    "someone who makes better decisions under pressure",
]


def load_dataset_tags(path="dataset.json"):
    with open(path) as f:
        items = json.load(f)
    tags = set()
    for item in items:
        for t in item["tags"]:
            tags.add(t.lower())
    return tags


def main():
    dataset_tags = load_dataset_tags()
    print(f"Dataset currently covers {len(dataset_tags)} distinct tags:\n  {sorted(dataset_tags)}\n")

    for domain in DOMAINS:
        pillars = generate_pillars(domain)
        print(f'"{domain}" ->')
        for p in pillars:
            hit = p.lower() in dataset_tags
            marker = "OK" if hit else "MISSING — add content or retag"
            print(f"    - {p:<30} [{marker}]")
        print()


if __name__ == "__main__":
    main()
