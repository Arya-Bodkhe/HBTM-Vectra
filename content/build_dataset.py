"""
One-off generator script (not part of the shipped app) used to assemble
content/dataset.json from the 20-pillar resource list.

Sources (all real, hand-curated links pulled directly from the team's
research docs — nothing here is placeholder/generic):
  - Kiaros__Vectra.pdf / CURATED_RESOURCES (Voice Control public speaking guide):
    Voice Control, Storytelling, Audience Engagement, Handling Questions,
    Presentation Confidence, Deep Focus, Distraction Management,
    Time Management, Energy Management, Habit Formation
  - CURATED_RESOURCES.docx:
    Goal Setting, Emotional Intelligence, Critical Thinking, Problem Solving,
    Resilience
  - Active_Listening.txt:
    Active Listening, Decision Making, Team Communication, Conflict
    Resolution, Trust Building

Run once: python3 build_dataset.py  ->  writes dataset.json
"""
import json

# Each pillar: (pillar_name, [ (type, title, url, length_minutes_or_None) ... ])
# type is one of: article, video, book, course
PILLARS = [
("Voice Control", [
    ("course", "Introduction to Public Speaking — University of Washington (Coursera)", "https://www.coursera.org/learn/public-speaking", None),
    ("article", "Your Speaking Voice", "https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/199-your-speaking-voice.pdf", 8),
    ("article", "Public Speaking Tips", "https://www.edx.org/resources/public-speaking-tips", 7),
    ("book", "How to Rise and Speak: Building Confidence as a Public Speaker", "https://www.google.co.in/books/edition/How_to_Rise_and_Speak_Building_Confidenc/VkssEQAAQBAJ", None),
    ("video", "How to Speak So That People Want to Listen — Julian Treasure (TED)", "https://youtu.be/eIho2S0ZahI", 10),
    ("video", "Public Speaking Skills | Boost Your Confidence — Ankur Warikoo", "https://youtu.be/savwVzZh5go", 12),
]),
("Storytelling", [
    ("course", "Presentation Skills with Storytelling (Coursera)", "https://www.coursera.org/learn/packt-presentation-skills-with-story-telling-zvn2k", None),
    ("article", "Storytelling Tips From Contest Winners — Toastmasters International", "https://www.toastmasters.org/magazine/magazine-issues/2023/sept/storytelling-tips", 6),
    ("article", "11 Strategies to Tell a Good Story", "https://www.betterup.com/blog/how-to-be-a-good-storyteller", 9),
    ("video", "The Magical Science of Storytelling — David JP Phillips (TEDxStockholm)", "https://youtu.be/Nj-hdQMa3uA", 16),
    ("video", "The Secret to Telling a Great Story — in Less Than 60 Seconds — Jenny Hoyos (TED)", "https://youtu.be/ZmNpeXTj2c4", 6),
]),
("Audience Engagement", [
    ("course", "Top Public Speaking Courses (Coursera)", "https://www.coursera.org/courses?query=public%20speaking", None),
    ("article", "Public Speaking Tips", "https://www.edx.org/resources/public-speaking-tips", 7),
    ("article", "8 Tips for Engaging Your Audience — Toastmasters International", "https://www.toastmasters.org/magazine/magazine-issues/2022/jan/engaging-your-audience", 6),
    ("video", "Audience Engagement Techniques for Speakers", "https://youtu.be/5h0dHhJYx5s", 10),
    ("video", "How to Engage Any Audience", "https://youtu.be/BmEiZadVNWY", 9),
]),
("Handling Questions", [
    ("article", "Handling Difficult Questions", "https://www.linkedin.com/pulse/handling-difficult-questions-naveen-bhati-ehwle/", 6),
    ("article", "10 Secrets to Handling Questions Well", "https://www.lepaya.com/blog/10-secrets-to-handling-questions-well", 7),
    ("course", "Presentation Skills (Coursera)", "https://www.coursera.org/learn/presentation-skills", None),
]),
("Presentation Confidence", [
    ("article", "Presenting with Confidence — Harvard Graduate School of Design Executive Education", "https://execed.gsd.harvard.edu/programs/presenting-with-confidence/", 8),
    ("article", "Presentation Skills — Harvard Business Review", "https://hbr.org/topic/subject/presentation-skills", 8),
    ("video", "The Surprising Secret to Speaking with Confidence — Caroline Goyder (TEDxBrixton)", "https://youtu.be/a2MR5XbJtXU", 10),
    ("video", "How to Be Confident (Even If You're Not) — Montana von Fliss (TEDxBellevueWomen)", "https://youtu.be/eVFzbxmKNUw", 11),
    ("book", "Give Great Presentations: How to Speak Confidently and Make Your Point", "https://books.google.co.in/books/about/Give_Great_Presentations.html?id=0btYEAAAQBAJ", None),
]),
("Deep Focus", [
    ("course", "Improve Focus and Concentration for a Longer Attention Span (Coursera)", "https://www.coursera.org/learn/focus", None),
    ("article", "Productivity Is About Your Systems, Not Your People — Harvard Business Review", "https://hbr.org/2021/01/productivity-is-about-your-systems-not-your-people", 7),
    ("article", "How to Improve Concentration and Focus: Our 15 Best Tips", "https://www.betterup.com/blog/15-ways-to-improve-your-focus-and-concentration-skills", 9),
    ("video", "Avoiding Distractions & Doing Deep Work — Dr. Cal Newport & Dr. Andrew Huberman", "https://youtu.be/f7V76Ky-_v8", 20),
    ("video", "Core Idea: Deep Work", "https://youtu.be/xJYlhhT7hyE", 8),
    ("book", "Deep Focus: How to Achieve Success in a Distracted World", "https://books.google.co.in/books/about/Deep_Focus.html?id=L6Up0QEACAAJ", None),
]),
("Distraction Management", [
    ("course", "Fostering Engagement in the Age of Digital Distraction (Coursera)", "https://www.coursera.org/learn/fostering-engagement-in-the-age-of-digital-distraction", None),
    ("article", "How to Avoid Distractions: Seize the Workday", "https://www.betterup.com/blog/how-to-avoid-distractions", 7),
    ("article", "4 Strategies for Overcoming Distraction — Harvard Business Impact Education", "https://hbsp.harvard.edu/product/H04IQ6-PDF-ENG", 8),
    ("video", "Avoiding Distractions & Doing Deep Work — Dr. Cal Newport & Dr. Andrew Huberman", "https://youtu.be/f7V76Ky-_v8", 20),
    ("book", "Hyperfocus: How to Manage Your Attention in a World of Distraction", "https://www.amazon.in/Hyperfocus-Manage-Attention-World-Distraction/dp/0525522255", None),
]),
("Time Management", [
    ("course", "Advanced Time Management (Coursera)", "https://www.coursera.org/learn/advanced-time-management", None),
    ("article", "Learn Time Management", "https://www.edx.org/learn/time-management", 8),
    ("article", "Time Management — Harvard Business Review", "https://hbr.org/topic/subject/time-management", 7),
    ("video", "The Philosophy of Time Management — Brad Aeon (TEDxConcordia)", "https://youtu.be/WXBA4eWskrc", 13),
    ("video", "We're Overcomplicating Time Management — Samantha Lane (TEDxJohnsonCity)", "https://youtu.be/SxbDsuC-Ch4", 11),
    ("book", "Time Management — Marc Mancini", "https://books.google.co.in/books/about/Time_Management.html?id=7ui4Dhog3xYC", None),
]),
("Energy Management", [
    ("article", "Manage Your Energy, Not Your Time — Tony Schwartz & Catherine McCarthy (Harvard Business Review)", "https://www.betterup.com/blog/manage-your-energy-not-your-time", 15),
    ("video", "Importance of Energy Management — Bannhat Phat (TEDxISPP)", "https://youtu.be/yLq0K7tYtnU", 12),
    ("video", "The Value of Energy Efficiency — James Brew (TEDxBoulder)", "https://youtu.be/P9l8zingLjE", 14),
    ("book", "Energy Management Systems", "https://books.google.co.in/books/about/Energy_Management_Systems.html?id=t-GdDwAAQBAJ", None),
]),
("Habit Formation", [
    ("course", "Build Healthy Habits With Latest Neuroscience Research (Coursera)", "https://www.coursera.org/learn/habits", None),
    ("article", "The Science of Habits: How to Build Good Ones and Break Bad Ones", "https://www.sciencenewstoday.org/the-science-of-habits-how-to-build-good-ones-and-break-bad-ones", 8),
    ("article", "How Are Habits Formed? The Psychology of Habit Formation", "https://positivepsychology.com/how-habits-are-formed/", 9),
    ("video", "Atomic Habits by James Clear — Audiobook Summary (Hindi)", "https://youtu.be/EjsTWJ7U1rk", 18),
    ("video", "Habit Formation and Breaking Dysfunctional Routines — Thatcher Lai (TEDxYouth)", "https://youtu.be/goUuMdT9Kvk", 12),
    ("book", "Atomic Habits — James Clear", "https://books.google.co.in/books/about/Atomic_Habits.html?id=lFhbDwAAQBAJ", None),
]),
("Goal Setting", [
    ("book", "Atomic Habits — James Clear", "https://drive.google.com/file/d/1eAZMdXO-Zn4_90TV365KMpIqfxUy7J0t/edit", None),
    ("video", "How to Achieve Your Most Ambitious Goals (TEDx Talks)", "https://www.youtube.com/watch?v=TQMbvJNRpLE", 14),
    ("video", "Why the Secret to Success Is Setting the Right Goals (TED)", "https://www.youtube.com/watch?v=L4N1q4RNi9I", 13),
    ("course", "Work Smarter, Not Harder: Time Management for Personal & Professional Productivity — UC Irvine (Coursera)", "https://www.coursera.org/learn/work-smarter-not-harder", None),
    ("article", "3 Ways We Sabotage Our Goals (and How to Stop) — Harvard Business Review", "https://hbr.org/2023/12/3-ways-we-sabotage-our-goals-and-how-to-stop", 6),
    ("article", "SMART Goals — MindTools", "https://www.mindtools.com/a4wo118/smart-goals/", 6),
]),
("Emotional Intelligence", [
    ("book", "Emotional Intelligence — Daniel Goleman", "https://books.google.co.in/books/about/Emotional_Intelligence.html?id=9iQWqIBwl_AC", None),
    ("video", "The Power of Emotional Intelligence (TED)", "https://www.youtube.com/watch?v=auXNnTmhHsk", 15),
    ("video", "Emotional Intelligence: The Skill We Need Now (TEDx)", "https://www.youtube.com/watch?v=UvtUajdE8w4", 13),
    ("course", "Inspiring Leadership through Emotional Intelligence — Case Western Reserve University (Coursera)", "https://www.coursera.org/learn/emotional-intelligence-leadership", None),
    ("article", "What Makes a Leader? — Daniel Goleman (Harvard Business Review)", "https://hbr.org/2004/01/what-makes-a-leader", 15),
    ("article", "What Is Emotional Intelligence? — BetterUp", "https://www.betterup.com/blog/what-is-emotional-intelligence", 8),
]),
("Critical Thinking", [
    ("book", "Thinking, Fast and Slow — Daniel Kahneman", "https://mlsu.ac.in/econtents/2950_Daniel%20Kahneman%20-%20Thinking,%20Fast%20and%20Slow%20(2013).pdf", None),
    ("video", "5 Tips to Improve Your Critical Thinking (TED-Ed)", "https://www.youtube.com/watch?v=dItUGF8GdTw", 5),
    ("video", "Importance of Critical Thinking in the Age of Information Glut (TEDx)", "https://www.youtube.com/watch?v=gSKmnkoPk10", 13),
    ("course", "Leadership and Critical Thinking Specialization — Duke University (Coursera)", "https://www.coursera.org/specializations/leadership-critical-thinking", None),
    ("article", "3 Ways to Build Critical Thinking Skills — Harvard Business Review", "https://hbr.org/podcast/2023/08/3-ways-to-build-critical-thinking-skills", 9),
    ("article", "Critical Thinking Skills — MindTools", "https://www.mindtools.com/a3ixqae/critical-thinking/", 9),
]),
("Problem Solving", [
    ("book", "The Art of Problem Solving — Russell L. Ackoff", "https://archive.org/details/artofproblemsolv00acko", None),
    ("video", "The Art of Problem Solving (TEDx)", "https://www.youtube.com/watch?v=oDGydfWkVhI", 12),
    ("video", "How to Think Like a Problem Solver (TED-Ed)", "https://www.youtube.com/watch?v=LaYVqj1El1A", 5),
    ("course", "Creative Problem Solving — University of Michigan (Coursera)", "https://www.coursera.org/learn/creative-problem-solving", None),
    ("article", "How to Solve Problems — Harvard Business Review", "https://hbr.org/2021/10/how-to-solve-problems", 9),
    ("article", "Problem Solving — MindTools", "https://www.mindtools.com/cx4ems0/problem-solving/", 8),
]),
("Resilience", [
    ("book", "The Resilience Factor — Karen Reivich & Andrew Shatté", "https://archive.org/details/resiliencefactor0000reiv_b8c7", None),
    ("video", "3 Secrets of Resilient People — Lucy Hone (TED)", "https://www.youtube.com/watch?v=NWH8N-BvhAw", 17),
    ("video", "Building Resilience (TEDx)", "https://www.youtube.com/watch?v=AbsJLrU2XeI", 12),
    ("course", "Resilience Skills in a Time of Uncertainty — Yale University (Coursera)", "https://www.coursera.org/learn/positive-psychology-resilience", None),
    ("article", "How Resilient Are You? — Harvard Business Review", "https://hbr.org/2015/01/assessment-how-resilient-are-you", 8),
    ("article", "What Is Resilience? — BetterUp", "https://www.betterup.com/blog/what-is-resilience-training", 8),
]),
("Active Listening", [
    ("article", "What Is Active Listening: Definition, Examples & Techniques — BetterUp", "https://www.betterup.com/blog/active-listening", 11),
    ("article", "Active Listening Techniques: Best Practices for Leaders — Center for Creative Leadership", "https://www.ccl.org/articles/leading-effectively-articles/coaching-others-use-active-listening-skills/", 15),
    ("video", "Active Listening Skills Explained", "https://www.youtube.com/watch?v=Yq5pJ0q3xuc", 8),
    ("video", "How to Practice Active Listening", "https://www.youtube.com/watch?v=7wUCyjiyXdg", 7),
    ("book", "Active Listening (ICAI study material)", "https://www.caalley.com/icaipub/misc/82309psec66395.pdf", None),
    ("course", "Active Listening: Enhancing Communication Skills (Coursera)", "https://www.coursera.org/learn/active-listening-enhancing-communication-skills", None),
]),
("Decision Making", [
    ("article", "Decision-Making — ScienceDirect Topic Overview", "https://www.sciencedirect.com/topics/psychology/decision-making", 10),
    ("article", "What Is Decision Making? — McKinsey", "https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-decision-making", 9),
    ("video", "How to Make Better Decisions", "https://www.youtube.com/watch?v=d7Jnmi2BkS8", 9),
    ("video", "The Psychology of Decision Making", "https://www.youtube.com/watch?v=WKSts1lNZhc", 11),
    ("book", "The Art of Decision Making", "https://archive.org/details/artofdecisionmak032604mbp/page/n31/mode/2up", None),
    ("course", "Problem Solving (Coursera)", "https://www.coursera.org/learn/problem-solving", None),
]),
("Team Communication", [
    ("article", "Team Communication — Asana", "https://asana.com/resources/team-communication", 8),
    ("article", "Team Communications — Indeed Career Advice", "https://ca.indeed.com/career-advice/career-development/team-communications", 7),
    ("video", "Improving Team Communication", "https://www.youtube.com/watch?v=vfLYEs_cHYs", 9),
    ("video", "How Great Teams Communicate", "https://www.youtube.com/watch?v=efmmXCPkSsY", 10),
    ("book", "Team Communication", "https://bookstore.emerald.com/media/preview/9781800435018-23-2.pdf", None),
    ("course", "Teamwork Skills: Communicating Effectively in Groups — University of Colorado Boulder (Coursera)", "https://www.coursera.org/learn/teamwork-skills-effective-communication", None),
]),
("Conflict Resolution", [
    ("article", "3 Cool Conflict Resolution Skills to Help You Handle Any Disputes Confidently — Art of Living", "https://www.artofliving.org/us-en/3-cool-conflict-resolution-skills-to-help-you-handle-any-disputes-confidently", 7),
    ("article", "Conflict Resolution Skills — HelpGuide", "https://www.helpguide.org/relationships/communication/conflict-resolution-skills", 9),
    ("video", "Conflict Resolution Strategies", "https://www.youtube.com/watch?v=DoCi_JECwvY", 12),
    ("video", "How to Resolve Conflict", "https://www.youtube.com/watch?v=v4sby5j4dTY", 9),
    ("book", "The Big Book of Conflict Resolution Games", "https://s3.wp.wsu.edu/uploads/sites/2070/2016/08/The-big-book-of-Conflict-Resolution-Games.pdf", None),
    ("course", "Workplace Conflict Resolution Skills (Coursera)", "https://www.coursera.org/learn/workplace-conflict-resolution-skills", None),
]),
("Trust Building", [
    ("article", "Building Trust — PMC / National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10304359/", 12),
    ("article", "Building Trust — Wharton Executive Education", "https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2015/10/building-trust/", 8),
    ("video", "How to Build Trust", "https://www.youtube.com/watch?v=pVeq-0dIqpk", 11),
    ("video", "The Trust Equation", "https://www.youtube.com/watch?v=s9FBK4eprmA", 9),
    ("book", "Building Trust", "https://www.scribd.com/document/156998972/Building-Trust", None),
    ("course", "Building Trust and Credibility as a Leader (Udemy)", "https://www.udemy.com/course/building-trust-and-credibility-as-a-leader/", None),
]),
]

def slug(s):
    return s.lower().replace(" ", "_").replace("&", "and").replace("!", "").replace(",", "").replace("'", "").replace("-", "_")

items = []
counter = 1
for pillar_name, resources in PILLARS:
    for (rtype, title, url, length_minutes) in resources:
        item = {
            "id": f"c{counter:03d}",
            "title": title,
            "type": rtype,  # article | video | book | course
            "url": url,
            "tags": [pillar_name.lower()],
        }
        if length_minutes is not None:
            item["length_minutes"] = length_minutes
        items.append(item)
        counter += 1

with open("dataset.json", "w") as f:
    json.dump(items, f, indent=2)

print(f"Wrote {len(items)} items across {len(PILLARS)} pillars to dataset.json")
