#!/usr/bin/env python3
"""
Skills Australia — Single Merged Business Plan PDF
Visual picture slides + full written plan in one user-friendly document.
Output: SKILLS-AUSTRALIA-BUSINESS-PLAN.pdf
"""

from pathlib import Path

from fpdf import FPDF

BASE = Path(__file__).parent
OUT_MERGED = BASE / "SKILLS-AUSTRALIA-BUSINESS-PLAN.pdf"
OUT_VISUAL = BASE / "SKILLS-AUSTRALIA-VISUAL-DECK.pdf"
OUT_TEXT = BASE / "SKILLS-AUSTRALIA-TEXT-PLAN.pdf"
ASSETS = BASE / "assets"

TEAL = (0, 128, 128)
TEAL_DARK = (0, 100, 100)
ORANGE = (255, 140, 0)
DARK = (33, 37, 41)
GRAY = (108, 117, 125)
WHITE = (255, 255, 255)
LIGHT = (245, 247, 250)
LIGHT_TEAL = (230, 245, 245)


def clean(text):
    if not isinstance(text, str):
        text = str(text)
    for old, new in {"—": "-", "→": "->", "–": "-", "'": "'", "'": "'", """: '"', """: '"', "…": "..."}.items():
        text = text.replace(old, new)
    return text.encode("latin-1", "replace").decode("latin-1")


PACKAGES = [
    (1, "Learner Permit Quiz Ready", "Students who want to pass the learner permit theory test after arrival",
     [["Australian Road Rules Explained", "Road signs, speed limits, giving way - plain language"],
      ["Learner Permit Application Guide", "How to apply - steps, documents, what to expect"],
      ["Practice Quiz Package", "Unlimited quizzes in real test style - complete in Nepal before flying"],
      ["Test-Day Tips", "What to bring and expect at the testing centre"]],
     "Online classes in Nepal + self-paced quiz practice tool",
     "Quiz access, road rules booklet, application checklist. We do NOT issue licences."),
    (2, "NAATI CCL Prep", "Students who want visa points or interpreter work using Nepali language skills",
     [["Test Format Mastery", "Full breakdown of NAATI CCL dialogue structure"],
      ["Practice Dialogues", "Health, legal, and community topic practice"],
      ["Exam Strategy", "Vocabulary lists, timing tips, mock test feedback"]],
     "Online group classes + solo practice materials",
     "Dialogue practice recordings, vocabulary booklet, exam-day checklist"),
    (3, "Jobs & Career Guide", "Students who need to understand how to find work in Australia",
     [["How to Find Jobs on Seek & Other Platforms", "Step-by-step Seek, Indeed, LinkedIn guide"],
      ["Australian Resume & Cover Letter", "Templates and feedback for Australian employers"],
      ["Workplace Communication", "Australian standards, polite phrases, phone calls, emails"],
      ["Australian Slang & Workplace English", "Common slang and cultural communication norms"],
      ["Interview Preparation", "Common questions, mock interview practice"]],
     "Online workshops with downloadable templates",
     "Resume template pack, job search tracker, interview question bank. We do NOT give students jobs."),
    (4, "Home & Renting Guide", "Students who need to find a room or rent safely",
     [["Finding a Room vs Renting a House", "Shared rooms, units, and full leases explained"],
      ["How to Apply for Rentals", "Documents, references, realestate.com.au and Domain guide"],
      ["Bonds & Lease Obligations", "What a bond is, tenant rights, lease terms"],
      ["Good Areas & Nepalese Communities", "Suburbs with transport, safety, and community by city"],
      ["Rental Scam Awareness", "How to spot fake listings, bond fraud, deposit scams"]],
     "Online classes + document checklists + area guides",
     "Rental document checklist, bond explainer, suburb guide. We do NOT find housing."),
    (5, "Cookery, Hospitality & FSA", "Students targeting hospitality, cafe, restaurant, or kitchen hand roles",
     [["How to Find Hospitality & Cookery Jobs", "Where to look, trial shift tips"],
      ["Australian Kitchen Work Environment", "Pace, hygiene, team structure, uniforms"],
      ["FSA Certificate - Complete Guidance", "Walkthrough including starting preparation in Nepal"],
      ["Cookery Job Application Guide", "Resume tweaks, where to apply, skills to highlight"]],
     "Online classes + FSA enrolment guidance (Nepal and Australia)",
     "Food safety study guide, certificate provider comparison, kitchen job application templates"),
    (6, "Cleaning Jobs Guide", "Students who want reliable entry-level cleaning work",
     [["Cleaning Work Standards", "Products, safety, time expectations, commercial vs residential"],
      ["Equipment & PPE Guide", "What to bring, what employers supply, WH&S basics"],
      ["How to Find Cleaning Jobs", "Agencies, direct employers, ABN vs employee work, pay rates overview"],
      ["Application Walkthrough", "Resume tweaks for cleaning roles, trial day preparation"]],
     "Online workshop + practical checklist + job search support",
     "Cleaning job checklist, equipment list, employer contact guide for student areas"),
    (7, "NDIS & Community Work Guide", "Students interested in disability support, aged care, or community services",
     [["NDIS Worker Screening Walkthrough", "Who needs it, documents required, step-by-step online application"],
      ["Identity Verification Guide", "Avoid delays - address history, ID, visa evidence"],
      ["Community Care Job Pathways", "Entry roles, providers, what to expect on the job"]],
     "Detailed online workshop with document preparation support",
     "NDIS application checklist, document preparation template, provider list"),
    (8, "Work Rights, TFN & Super", "Students who want to understand wages, tax, and workplace rights",
     [["Applying for a TFN", "What a Tax File Number is, how to apply, documents needed"],
      ["Choosing the Right Super Fund", "What super is, how to compare funds - guidance only, not financial advice"],
      ["Employment Contracts Explained", "Part-time vs casual vs full-time - what to look for before signing"],
      ["Fair Work & Your Rights", "Minimum wage awareness, payslips, what to do if something goes wrong"],
      ["Workplace Issues & Insurance Basics", "Fair Work Commission overview, workplace safety awareness"]],
     "Online class with plain-language examples",
     "TFN application guide, super comparison sheet, contract checklist, Fair Work rights card"),
    (9, "Budget Living & Free Food Tips", "Students on a tight budget who want to eat well without overspending",
     [["How to Save Money After Arriving", "First-month spending traps, budgeting basics"],
      ["Free Food Tips in Australia", "Salvation Army, Foodbank, community kitchens, church meals - who provides free food and how to access it"],
      ["Supermarket Savings", "Discount timing, student meal deals, bulk buying tips"],
      ["Meal Planning on a Student Budget", "Simple weekly meal plans under budget"]],
     "Online class + printed guide + digital map of nearby free food providers",
     "Free food provider map (Salvation Army, Foodbank, community orgs), budget meal plan, discount calendar"),
    (10, "Navigate Australia & Stay Safe", "Students who want to avoid scams and make smart decisions",
     [["Common Scams in Australia", "Rental scams, job scams, phone scams, myGov/ATO impersonation"],
      ["Buying a Second-Hand Car Safely", "How to inspect a car, rego checks, avoiding dodgy sellers"],
      ["General Safety & Awareness", "Staying safe online, verifying people and businesses"]],
     "Online workshop + printable safety checklists",
     "Scam red-flag guide, second-hand car inspection checklist, safety tips card"),
]

# Visual slides — logical story order for investors
VISUALS = [
    ("02-problem-solution.png",        "1. The Problem & Our Solution"),
    ("free-perks-included.png",        "2. Free With Every Package"),
    ("skills-australia-packages.png",  "3. Our 10 Packages"),
    ("free-food-tips.png",             "4. Free Food Tips in Australia"),
    ("06-student-journey.png",         "5. Student Journey - 10 Steps"),
    ("09-extra-addons.png",            "6. Optional Extra Add-On Packages"),
    ("08-why-choose-us.png",           "7. Why Families & Investors Choose Us"),
    ("10-business-model.png",          "8. Business Model Overview"),
    ("07-launch-roadmap.png",          "9. Launch Roadmap"),
]

EXTRA_ADDONS = [
    ("LinkedIn Profile", "Setup and optimisation for Australian job search"),
    ("Professional Resume", "Premium review and feedback"),
    ("Bond and Lease Review", "We review your rental application or lease before you sign"),
    ("One-on-One Career Coaching", "Personal session with a career guide"),
    ("IT Certification Coaching", "Guidance on IT certifications to help you land tech roles"),
    ("Airport Pickup Plus", "Extended pickup with accommodation orientation guide"),
]


class PlanPDF(FPDF):
    toc_entries = []

    def cell(self, w, h=0, text="", *args, **kwargs):
        return super().cell(w, h, clean(text), *args, **kwargs)

    def multi_cell(self, w, h=0, text="", *args, **kwargs):
        return super().multi_cell(w, h, clean(text), *args, **kwargs)

    def write(self, h, text="", *args, **kwargs):
        return super().write(h, clean(text), *args, **kwargs)

    def header(self):
        if self.page_no() <= 2:
            return
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(*GRAY)
        self.cell(95, 6, "Skills Australia  |  Business Plan  |  August 2026", align="L")
        self.cell(95, 6, "0416 206 568  |  info@skillsaustralia.com.np", align="R")
        self.ln(5)

    def footer(self):
        self.set_y(-12)
        self.set_draw_color(*TEAL)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(2)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*GRAY)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def register_toc(self, label, page=None):
        if page is None:
            page = self.page_no()
        self.toc_entries.append((label, page))

    # ── Cover ──────────────────────────────────────────────────────────────
    def cover(self):
        self.add_page()
        self.set_fill_color(*TEAL)
        self.rect(0, 0, 210, 297, "F")

        logo = ASSETS / "skills-australia-logo.png"
        if logo.exists():
            self.image(str(logo), x=75, y=30, w=60)

        self.set_y(100)
        self.set_font("Helvetica", "B", 34)
        self.set_text_color(*WHITE)
        self.cell(0, 14, "Skills Australia", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        self.set_font("Helvetica", "", 16)
        self.cell(0, 9, "Nepal -> Australia New Arrival Support Program", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(8)
        self.set_font("Helvetica", "I", 13)
        self.cell(0, 8, "Modular Student Settlement & Life-Skills Packages", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(14)
        self.set_font("Helvetica", "", 12)
        self.cell(0, 8, "Helping students moving from Nepal to Australia", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 8, "land, settle, and thrive", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(20)
        self.set_font("Helvetica", "B", 11)
        self.cell(0, 8, "Prepared: August 2026  |  Status: Draft for review", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(10)
        self.set_font("Helvetica", "", 11)
        self.cell(0, 8, "Phone: 0416 206 568", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 8, "Email: info@skillsaustralia.com.np", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(16)
        self.set_fill_color(*ORANGE)
        self.set_x(30)
        self.set_font("Helvetica", "B", 10)
        self.cell(150, 10, "  VISUAL OVERVIEW + FULL BUSINESS PLAN  |  ONE DOCUMENT", fill=True, align="C")

        self.register_toc("Cover", 1)

    # ── Table of Contents ──────────────────────────────────────────────────
    def table_of_contents(self):
        self.add_page()
        self.set_fill_color(*TEAL)
        self.rect(0, 0, 210, 22, "F")
        self.set_y(6)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*WHITE)
        self.cell(0, 10, "  How to Read This Document", align="L")
        self.ln(18)

        self.set_text_color(*DARK)
        self.set_font("Helvetica", "", 10)
        self.multi_cell(0, 6,
            "This is ONE document with two parts woven together:\n\n"
            "  PART 1  VISUAL OVERVIEW  (picture slides - pages 3-11)\n"
            "          Quick understanding for investors and families\n\n"
            "  PART 2  DETAILED PLAN     (written steps - pages 12+)\n"
            "          Full tables, package details, and legal information"
        )
        self.ln(8)

        sections = [
            ("PART 1 - VISUAL OVERVIEW  (Picture Slides)", ORANGE, [
                "The Problem & Our Solution",
                "Free With Every Package",
                "Our 10 Packages",
                "Student Journey - 10 Steps",
                "Why Families & Investors Choose Us",
                "Business Model Overview",
                "Launch Roadmap",
            ]),
            ("PART 2 - DETAILED BUSINESS PLAN  (Written Steps)", TEAL, [
                "Step 1  -  Executive Summary",
                "Step 2  -  The Problem We Solve",
                "Step 3  -  Vision & Target Customers",
                "Step 4  -  How Skills Australia Works",
                "Step 5  -  Our Packages (Full Detail)",
                "Step 6  -  Package Comparison",
                "Step 7  -  Suggested Bundles",
                "Step 8  -  Student Journey",
                "Step 9  -  Why Families Choose Us",
                "Step 10 -  Launch Roadmap",
                "Step 11 -  Legal Note",
                "Step 12 -  Next Steps",
            ]),
        ]

        for section_title, color, items in sections:
            self.set_fill_color(*color)
            self.set_text_color(*WHITE)
            self.set_font("Helvetica", "B", 11)
            self.cell(0, 9, f"  {section_title}", fill=True, new_x="LMARGIN", new_y="NEXT")
            self.ln(2)
            self.set_text_color(*DARK)
            self.set_font("Helvetica", "", 10)
            for label in items:
                self.set_fill_color(*LIGHT_TEAL)
                self.cell(0, 7, f"    >  {label}", fill=True, new_x="LMARGIN", new_y="NEXT")
            self.ln(4)

        self.ln(4)
        self.set_fill_color(*ORANGE)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 9, "  TIP: Flip through Part 1 first, then read Part 2 for full detail.", fill=True, align="C")
        self.register_toc("Contents", 2)

    # ── Section divider ────────────────────────────────────────────────────
    def section_divider(self, part_num, title, subtitle, color=TEAL):
        self.add_page()
        self.set_fill_color(*color)
        self.rect(0, 0, 210, 297, "F")
        self.set_y(110)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(*WHITE)
        self.cell(0, 10, f"PART {part_num}", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        self.set_font("Helvetica", "B", 26)
        self.cell(0, 14, title, align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(8)
        self.set_font("Helvetica", "I", 13)
        self.cell(0, 9, subtitle, align="C", new_x="LMARGIN", new_y="NEXT")

    # ── Full-page visual ───────────────────────────────────────────────────
    def visual_page(self, image_file, badge="VISUAL OVERVIEW"):
        self.add_page()
        self.set_fill_color(*ORANGE)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8)
        self.cell(0, 6, f"  {badge}", fill=True, new_x="LMARGIN", new_y="NEXT")
        path = ASSETS / image_file
        if path.exists():
            self.image(str(path), x=5, y=18, w=200)

    # ── Text helpers ───────────────────────────────────────────────────────
    def step_header(self, step_num, title):
        self.ln(2)
        self.set_fill_color(*TEAL)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8)
        self.cell(30, 6, "  DETAILED PLAN", fill=True)
        self.set_fill_color(*TEAL_DARK)
        self.cell(0, 6, f"  Step {step_num} - {title}", fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(4)
        self.set_text_color(*DARK)

    def sub_title(self, title):
        self.ln(2)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*TEAL)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(*DARK)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_fill_color(*LIGHT_TEAL)
        x, y = self.get_x(), self.get_y()
        self.rect(10, y, 190, 7, "F")
        self.set_xy(14, y + 1)
        self.cell(4, 5.5, ">")
        self.multi_cell(176, 5.5, text)
        self.ln(2)

    def note_box(self, text):
        self.set_fill_color(*LIGHT)
        self.set_draw_color(*TEAL)
        self.set_font("Helvetica", "I", 9)
        self.multi_cell(0, 5.5, text, border=1, fill=True)
        self.ln(3)

    def perk_cards(self):
        perks = [
            ("Free SIM Card", "On enrol in Nepal"),
            ("Free Airport Pickup", "Met at airport"),
            ("Quiz Tools", "Practice anytime"),
            ("Transport Card", "Optional add-on"),
        ]
        w = 46
        x0 = 11
        y = self.get_y()
        for i, (title, sub) in enumerate(perks):
            x = x0 + i * (w + 2)
            self.set_fill_color(*TEAL if i % 2 == 0 else ORANGE)
            self.rect(x, y, w, 18, "F")
            self.set_xy(x + 2, y + 3)
            self.set_font("Helvetica", "B", 8)
            self.set_text_color(*WHITE)
            self.cell(w - 4, 5, title, align="C")
            self.set_xy(x + 2, y + 10)
            self.set_font("Helvetica", "", 7)
            self.cell(w - 4, 4, sub, align="C")
        self.set_y(y + 22)
        self.set_text_color(*DARK)

    def add_table(self, headers, rows, col_widths=None):
        if self.get_y() > 240:
            self.add_page()
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(*TEAL)
        self.set_text_color(*WHITE)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 8, h, border=1, fill=True)
        self.ln()
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*DARK)
        fill = False
        for row in rows:
            if self.get_y() > 265:
                self.add_page()
            max_h = 8
            cell_lines = []
            for i, cell in enumerate(row):
                lines = self.multi_cell(col_widths[i], 5, str(cell), dry_run=True, output="LINES")
                cell_lines.append(lines)
                max_h = max(max_h, len(lines) * 5)
            x0, y0 = self.get_x(), self.get_y()
            if fill:
                self.set_fill_color(*LIGHT)
            for i, lines in enumerate(cell_lines):
                x = x0 + sum(col_widths[:i])
                self.set_xy(x, y0)
                self.rect(x, y0, col_widths[i], max_h, "DF" if fill else "D")
                self.set_xy(x + 1, y0 + 1)
                for line in lines:
                    self.cell(col_widths[i] - 2, 5, line)
                    self.ln(5)
                    self.set_x(x + 1)
            self.set_xy(x0, y0 + max_h)
            fill = not fill
        self.ln(4)

    def package_block(self, num, name, best_for, modules, fmt, includes):
        if self.get_y() > 195:
            self.add_page()
        self.set_fill_color(*ORANGE)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 11)
        self.cell(0, 9, f"  Package {num} - {name}", fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        self.set_text_color(*DARK)
        self.set_font("Helvetica", "B", 9)
        self.cell(0, 6, f"Best for: {best_for}", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        self.add_table(["Module", "What the Student Gets"], modules, [55, 135])
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*TEAL)
        self.cell(22, 6, "Format:")
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*DARK)
        self.multi_cell(0, 5.5, fmt)
        self.ln(1)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*TEAL)
        self.cell(22, 6, "Includes:")
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*DARK)
        self.multi_cell(0, 5.5, includes)
        self.ln(4)


def add_visual_slides(pdf, with_divider=False):
    """All picture slides in story order."""
    if with_divider:
        pdf.section_divider("1", "VISUAL OVERVIEW", "Picture slides - understand the business at a glance", ORANGE)
    for img, label in VISUALS:
        pdf.visual_page(img)


def add_text_plan(pdf, show_divider=True):
    """Full written Steps 1-12."""
    if show_divider:
        pdf.section_divider("2", "DETAILED PLAN", "Full written steps, tables, and package information", TEAL)

    pdf.add_page()
    pdf.step_header(1, "Executive Summary")
    pdf.body_text(
        "Every year, thousands of students leave Nepal to study in Australia. Most arrive knowing very little "
        "about how to find a job, apply for a learner permit, find housing, or navigate life without getting scammed."
    )
    pdf.body_text(
        "Skills Australia offers modular guidance packages. No forced bundle - families pay for what matters."
    )
    pdf.sub_title("Included with every package purchase:")
    pdf.perk_cards()
    pdf.bullet("Free Australian SIM card - included when you enrol in your course (Nepal)")
    pdf.bullet("Free airport pickup - met at the airport and taken to accommodation")
    pdf.bullet("City transport card top-up available as optional add-on at purchase")
    pdf.bullet("We help students activate their SIM after arriving in Australia")
    pdf.bullet("Practice quiz tools for each enrolled package")
    pdf.note_box(
        "We turn a confusing, stressful arrival into a guided, choose-what-you-need program - "
        "so students land in Australia informed, prepared, and confident."
    )

    pdf.step_header(2, "The Problem We Solve")
    pdf.add_table(
        ["Pain Point", "What Goes Wrong", "Our Package"],
        [
            ["Driving", "Learner permit rules unfamiliar", "Learner Permit Quiz Ready"],
            ["Transport", "Unfamiliar with local transport systems", "Navigate Australia & Stay Safe + transport card guidance"],
            ["Housing", "Rejected apps, rental scams", "Home & Renting Guide"],
            ["Jobs", "Wrong resume format", "Jobs & Career Guide"],
            ["Hospitality", "No FSA certificate", "Cookery, Hospitality & FSA"],
            ["Cleaning", "Don't know how to apply", "Cleaning Jobs Guide"],
            ["Care work", "NDIS screening confusing", "NDIS & Community Work Guide"],
            ["Visa points", "NAATI feels impossible", "NAATI CCL Prep"],
            ["Food & budget", "Overspend, miss free food options", "Budget Living & Free Food Tips"],
        ],
        [28, 67, 95],
    )

    pdf.step_header(3, "Vision & Target Customers")
    pdf.sub_title("Who we serve")
    pdf.bullet("Nepali students with an offer to study in Australia")
    pdf.bullet("Families in Nepal who want their children prepared before they fly")
    pdf.bullet("Education and migration agents who want a trusted add-on service")
    pdf.sub_title("Our promise")
    pdf.bullet("Simple, plain-language teaching - no jargon")
    pdf.bullet("Pick only what you need - no forced bundle")
    pdf.bullet("Guidance, not guarantees - we prepare; students take their own steps")
    pdf.bullet("Nepal-first, Australia-ready")

    pdf.add_page()
    pdf.step_header(4, "How Skills Australia Works")
    pdf.sub_title("Three phases")
    pdf.bullet("Phase 1 - Nepal: Enrol, online classes, practice quizzes")
    pdf.bullet("Phase 2 - Travel: Pack with confidence")
    pdf.bullet("Phase 3 - Australia: Free airport pickup, SIM activation help, apply independently")
    pdf.add_table(
        ["Perk", "Details"],
        [
            ["Free SIM card", "Included when you enrol in your course (Nepal)"],
            ["SIM activation help", "We guide students to activate their SIM in Australia"],
            ["Free airport pickup", "Met at airport, taken to accommodation"],
            ["Transport card (optional add-on)", "City transport card pre-loaded for any Australian city"],
            ["City transport map", "Printed + digital maps for your destination city"],
            ["Practice quiz access", "Matching enrolled packages"],
            ["Orientation session", "First 48 hours overview"],
        ],
        [55, 135],
    )

    pdf.add_page()
    pdf.step_header(5, "Our Packages - Full Detail")
    pdf.note_box("We guide and prepare - we do not provide jobs, licences, or housing directly.")
    for pkg in PACKAGES:
        pdf.package_block(*pkg)

    pdf.add_page()
    pdf.step_header(6, "Package Comparison at a Glance")
    pdf.add_table(
        ["Package", "Pre-Departure", "After Arrival", "Deliverable"],
        [
            ["Learner Permit Quiz", "Quiz online", "Sit theory test", "Test ready"],
            ["NAATI CCL Prep", "Full course", "Practice", "Exam ready"],
            ["Jobs & Career", "Full course", "Follow-up", "Resume ready"],
            ["Home & Renting", "Full course", "Support", "Rental ready"],
            ["Cookery & FSA", "Full course", "Cert support", "FSA pathway"],
            ["Cleaning Jobs", "Full course", "Job support", "Job ready"],
            ["NDIS & Community", "Full course", "Documents", "Screening done"],
            ["Work Rights & TFN", "Full course", "-", "Rights aware"],
            ["Budget & Free Food Tips", "Guide", "Free food map", "Eat well on a budget"],
            ["Stay Safe", "Full course", "-", "Scam aware"],
        ],
        [42, 32, 32, 84],
    )

    pdf.step_header(7, "Suggested Package Bundles (Optional)")
    pdf.add_table(
        ["Bundle", "Includes", "Ideal For"],
        [
            ["Job Hunter", "Jobs & Career + industry package", "Need work fast"],
            ["Arrival Ready", "Renting + Budget + Stay Safe", "First-time travellers"],
            ["Drive & Work", "Learner Quiz + Work Rights", "Drive and work"],
            ["Visa Points Plus", "NAATI + Jobs & Career", "PR pathway"],
            ["Full Independence", "Any 4+ packages", "Comprehensive prep"],
        ],
        [35, 85, 70],
    )

    pdf.sub_title("Optional Extra Add-On Packages")
    pdf.body_text("Add these to any main package at enrolment - pick only what you need:")
    pdf.add_table(
        ["Add-On", "What the Student Gets"],
        [[name, detail] for name, detail in EXTRA_ADDONS],
        [55, 135],
    )

    pdf.add_page()
    pdf.step_header(8, "Student Journey (Step by Step)")
    pdf.add_table(
        ["Step", "Action", "Where"],
        [
            ["1", "Receive Australian study offer", "Nepal"],
            ["2", "Contact Skills Australia or agent", "Nepal"],
            ["3", "Browse and choose packages", "Online"],
            ["4", "Enrol and pay - SIM included with your course", "Online / Nepal"],
            ["5", "Attend online classes", "Nepal"],
            ["6", "Complete quizzes and receive guides", "Online"],
            ["7", "Fly to Australia", "Travel"],
            ["8", "Free airport pickup + SIM activation help", "Australia"],
            ["9", "Get to know transport and secure your city transport card", "Australia"],
            ["10", "Apply for permit, jobs, housing - add packages anytime", "Australia / Online"],
        ],
        [12, 118, 60],
    )

    pdf.step_header(9, "Why Families Will Choose Skills Australia")
    for item in [
        "Modular - pay only for what you need",
        "Honest - we guide, no false promises",
        "Starts in Nepal before departure",
        "SIM included on enrol + free airport pickup + activation help in Australia",
        "Plain Nepali and English",
        "Job-focused guidance packages",
        "Agent-friendly add-on service",
    ]:
        pdf.bullet(item)

    pdf.add_page()
    pdf.step_header(10, "Launch Roadmap")
    pdf.add_table(
        ["Step", "Action", "Notes"],
        [
            ["1", "Register Skills Australia", "Legal structure"],
            ["2", "Finalise pricing", "Package and bundle fees"],
            ["3", "Build quiz platform", "Topic quizzes per package"],
            ["4", "SIM and transport card supplier deals", "Bulk SIM on enrol; city transport card partnerships"],
            ["5", "FSA certificate partners", "Nepal + Australia"],
            ["6", "Enrolment portal", "Package selection and payment"],
            ["7", "PDF booklets per module", "Printable family guides"],
            ["8", "Recruit trainers", "NAATI, career, hospitality"],
            ["9", "Pilot 10-15 students", "Feedback before scaling"],
            ["10", "Launch marketing", "0416 206 568 | info@skillsaustralia.com.np"],
        ],
        [12, 68, 110],
    )

    pdf.step_header(11, "Legal & Compliance Note")
    pdf.note_box(
        "Skills Australia provides general education and orientation only. Not migration, legal, tax, or financial advice. "
        "We do NOT guarantee employment, issue licences, or provide housing. Students confirm requirements with "
        "Australian government bodies or licensed professionals."
    )

    pdf.step_header(12, "Next Document Versions (To Add)")
    for item in [
        "Pricing per package and bundle tiers",
        "Staffing plan and cost model",
        "Legal/compliance review (Nepal + Australia)",
        "Nepali-language summaries per package",
        "Partner agent agreement template",
        "Quiz question bank per package",
    ]:
        pdf.bullet(item)

    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(*GRAY)
    pdf.multi_cell(0, 5, "Draft business plan for Skills Australia - August 2026")


def build_visual_deck():
    """PDF 1 — picture slides only, proper story order."""
    pdf = PlanPDF()
    pdf.set_auto_page_break(auto=False, margin=18)
    pdf.cover()
    pdf.add_page()
    pdf.set_fill_color(*ORANGE)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_y(80)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 12, "Visual Overview", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 8, "9 picture slides  |  For investors & families", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 10)
    pdf.multi_cell(0, 6,
        "Slide order:\n"
        "1. Problem & Solution\n"
        "2. Free With Every Package\n"
        "3. Our 10 Packages\n"
        "4. Free Food Tips in Australia\n"
        "5. Student Journey\n"
        "6. Optional Extra Add-On Packages\n"
        "7. Why Choose Us\n"
        "8. Business Model\n"
        "9. Launch Roadmap",
        align="C")
    add_visual_slides(pdf, with_divider=False)
    pdf.output(str(OUT_VISUAL))
    return pdf.page_no()


def build_text_plan():
    """PDF 2 of 3 — written plan only."""
    pdf = PlanPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.cover()
    pdf.add_page()
    pdf.set_fill_color(*TEAL)
    pdf.rect(0, 0, 210, 22, "F")
    pdf.set_y(6)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 10, "  Written Business Plan - Steps 1 to 12", align="L")
    pdf.ln(16)
    pdf.set_text_color(*DARK)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, "Full written detail with tables and package information.\nIdeal for registration, funding, and legal review.")
    add_text_plan(pdf, show_divider=False)
    pdf.output(str(OUT_TEXT))
    return pdf.page_no()


def build_merged():
    """PDF 3 — visual + text interleaved in appealing story order."""
    pdf = PlanPDF()
    pdf.set_auto_page_break(auto=True, margin=18)

    # 1. Cover
    pdf.cover()
    pdf.table_of_contents()

    # 2. VISUAL — Why we exist
    pdf.visual_page("02-problem-solution.png")

    # 3. TEXT — Executive summary + problem + vision
    pdf.add_page()
    pdf.step_header(1, "Executive Summary")
    pdf.body_text(
        "Every year, thousands of students leave Nepal to study in Australia. Most arrive knowing very little "
        "about how to find a job, apply for a learner permit, find housing, or navigate life without getting scammed."
    )
    pdf.body_text("Skills Australia offers modular guidance packages. Families pay for what matters.")
    pdf.sub_title("Included with every package purchase:")
    pdf.perk_cards()
    pdf.bullet("Free Australian SIM card - included when you enrol in your course (Nepal)")
    pdf.bullet("Free airport pickup - met at the airport and taken to accommodation")
    pdf.bullet("City transport card top-up available as optional add-on at purchase")
    pdf.bullet("We help students activate their SIM after arriving in Australia")
    pdf.bullet("Practice quiz tools for each enrolled package")
    pdf.note_box(
        "We turn a confusing, stressful arrival into a guided, choose-what-you-need program - "
        "so students land in Australia informed, prepared, and confident."
    )
    pdf.step_header(2, "The Problem We Solve")
    pdf.add_table(
        ["Pain Point", "What Goes Wrong", "Our Package"],
        [
            ["Driving", "Learner permit rules unfamiliar", "Learner Permit Quiz Ready"],
            ["Transport", "Unfamiliar with local transport systems", "Transport guidance + optional city transport card"],
            ["Housing", "Rejected apps, rental scams", "Home & Renting Guide"],
            ["Jobs", "Wrong resume format", "Jobs & Career Guide"],
            ["Hospitality", "No FSA certificate", "Cookery, Hospitality & FSA"],
            ["Cleaning", "Don't know how to apply", "Cleaning Jobs Guide"],
            ["Care work", "NDIS screening confusing", "NDIS & Community Work Guide"],
            ["Visa points", "NAATI feels impossible", "NAATI CCL Prep"],
            ["Food & budget", "Overspend, miss free food options", "Budget Living & Free Food Tips"],
        ],
        [28, 67, 95],
    )
    pdf.step_header(3, "Vision & Target Customers")
    pdf.bullet("Nepali students with an offer to study in Australia")
    pdf.bullet("Families in Nepal who want their children prepared before they fly")
    pdf.bullet("Education and migration agents who want a trusted add-on service")
    pdf.bullet("Simple language, modular packages, guidance not guarantees")

    # 4. VISUAL — What's free
    pdf.visual_page("free-perks-included.png")

    # 5. TEXT — How it works
    pdf.add_page()
    pdf.step_header(4, "How Skills Australia Works")
    pdf.sub_title("Three phases")
    pdf.bullet("Phase 1 - Nepal: Enrol, online classes, practice quizzes")
    pdf.bullet("Phase 2 - Travel: Pack with confidence")
    pdf.bullet("Phase 3 - Australia: Free airport pickup, SIM activation help, apply independently")
    pdf.add_table(
        ["Perk", "Details"],
        [
            ["Free SIM card", "Included when you enrol in your course (Nepal)"],
            ["SIM activation help", "We guide students to activate their SIM in Australia"],
            ["Free airport pickup", "Met at airport, taken to accommodation"],
            ["Transport card (optional add-on)", "City transport card pre-loaded for any Australian city"],
            ["City transport map", "Printed + digital maps for your destination city"],
            ["Practice quiz access", "Matching enrolled packages"],
            ["Orientation session", "First 48 hours overview"],
        ],
        [55, 135],
    )

    # 6. VISUAL — What packages exist
    pdf.visual_page("skills-australia-packages.png")

    # 6b. VISUAL — Free food tips
    pdf.visual_page("free-food-tips.png")

    # 7. TEXT — Full package detail
    pdf.add_page()
    pdf.step_header(5, "Our Packages - Full Detail")
    pdf.note_box("We guide and prepare - we do not provide jobs, licences, or housing directly.")
    for pkg in PACKAGES:
        pdf.package_block(*pkg)

    # 8. TEXT — Comparison + bundles
    pdf.add_page()
    pdf.step_header(6, "Package Comparison at a Glance")
    pdf.add_table(
        ["Package", "Pre-Departure", "After Arrival", "Deliverable"],
        [
            ["Learner Permit Quiz", "Quiz online", "Sit theory test", "Test ready"],
            ["NAATI CCL Prep", "Full course", "Practice", "Exam ready"],
            ["Jobs & Career", "Full course", "Follow-up", "Resume ready"],
            ["Home & Renting", "Full course", "Support", "Rental ready"],
            ["Cookery & FSA", "Full course", "Cert support", "FSA pathway"],
            ["Cleaning Jobs", "Full course", "Job support", "Job ready"],
            ["NDIS & Community", "Full course", "Documents", "Screening done"],
            ["Work Rights & TFN", "Full course", "-", "Rights aware"],
            ["Budget & Free Food Tips", "Guide", "Free food map", "Eat well on a budget"],
            ["Stay Safe", "Full course", "-", "Scam aware"],
        ],
        [42, 32, 32, 84],
    )
    pdf.step_header(7, "Suggested Package Bundles (Optional)")
    pdf.add_table(
        ["Bundle", "Includes", "Ideal For"],
        [
            ["Job Hunter", "Jobs & Career + industry package", "Need work fast"],
            ["Arrival Ready", "Renting + Budget + Stay Safe", "First-time travellers"],
            ["Drive & Work", "Learner Quiz + Work Rights", "Drive and work"],
            ["Visa Points Plus", "NAATI + Jobs & Career", "PR pathway"],
            ["Full Independence", "Any 4+ packages", "Comprehensive prep"],
        ],
        [35, 85, 70],
    )
    pdf.sub_title("Optional Extra Add-On Packages")
    pdf.body_text("Add these to any main package at enrolment - pick only what you need:")
    pdf.add_table(
        ["Add-On", "What the Student Gets"],
        [[name, detail] for name, detail in EXTRA_ADDONS],
        [55, 135],
    )

    # 9. VISUAL — Student journey
    pdf.visual_page("06-student-journey.png")

    # 9b. VISUAL — Extra add-ons
    pdf.visual_page("09-extra-addons.png")

    # 10. TEXT — Journey detail + why choose us
    pdf.add_page()
    pdf.step_header(8, "Student Journey (Step by Step)")
    pdf.add_table(
        ["Step", "Action", "Where"],
        [
            ["1", "Receive Australian study offer", "Nepal"],
            ["2", "Contact Skills Australia or agent", "Nepal"],
            ["3", "Browse and choose packages", "Online"],
            ["4", "Enrol and pay - SIM included with your course", "Online / Nepal"],
            ["5", "Attend online classes", "Nepal"],
            ["6", "Complete quizzes and receive guides", "Online"],
            ["7", "Fly to Australia", "Travel"],
            ["8", "Free airport pickup + SIM activation help", "Australia"],
            ["9", "Get to know transport and secure your city transport card", "Australia"],
            ["10", "Apply for permit, jobs, housing - add packages anytime", "Australia / Online"],
        ],
        [12, 118, 60],
    )
    pdf.step_header(9, "Why Families Will Choose Skills Australia")
    for item in [
        "Modular - pay only for what you need",
        "Honest - we guide, no false promises",
        "Starts in Nepal before departure",
        "SIM included on enrol + free airport pickup + activation help in Australia",
        "Plain Nepali and English",
        "Job-focused guidance packages",
        "Agent-friendly add-on service",
    ]:
        pdf.bullet(item)

    # 11-13. VISUAL — Why us, business model, roadmap
    pdf.visual_page("08-why-choose-us.png")
    pdf.visual_page("10-business-model.png")
    pdf.visual_page("07-launch-roadmap.png")

    # 14. TEXT — Launch, legal, next steps
    pdf.add_page()
    pdf.step_header(10, "Launch Roadmap")
    pdf.add_table(
        ["Step", "Action", "Notes"],
        [
            ["1", "Register Skills Australia", "Legal structure"],
            ["2", "Finalise pricing", "Package and bundle fees"],
            ["3", "Build quiz platform", "Topic quizzes per package"],
            ["4", "SIM and transport card supplier deals", "Bulk SIM on enrol; city transport card partnerships"],
            ["5", "FSA certificate partners", "Nepal + Australia"],
            ["6", "Enrolment portal", "Package selection and payment"],
            ["7", "PDF booklets per module", "Printable family guides"],
            ["8", "Recruit trainers", "NAATI, career, hospitality"],
            ["9", "Pilot 10-15 students", "Feedback before scaling"],
            ["10", "Launch marketing", "0416 206 568 | info@skillsaustralia.com.np"],
        ],
        [12, 68, 110],
    )
    pdf.step_header(11, "Legal & Compliance Note")
    pdf.note_box(
        "Skills Australia provides general education and orientation only. Not migration, legal, tax, or financial advice. "
        "We do NOT guarantee employment, issue licences, or provide housing."
    )
    pdf.step_header(12, "Next Document Versions (To Add)")
    for item in [
        "Pricing per package and bundle tiers",
        "Staffing plan and cost model",
        "Legal/compliance review (Nepal + Australia)",
        "Nepali-language summaries per package",
        "Partner agent agreement template",
        "Quiz question bank per package",
    ]:
        pdf.bullet(item)

    pdf.output(str(OUT_MERGED))
    return pdf.page_no()


def build():
    v = build_visual_deck()
    t = build_text_plan()
    m = build_merged()
    print(f"\n{'='*60}")
    print("  YOUR 3 PDF FILES:")
    print(f"{'='*60}")
    print(f"  1. VISUAL DECK  ({v} pages)")
    print(f"     {OUT_VISUAL}")
    print(f"  2. TEXT PLAN    ({t} pages)")
    print(f"     {OUT_TEXT}")
    print(f"  3. MERGED       ({m} pages)")
    print(f"     {OUT_MERGED}")
    print(f"{'='*60}")
    return m


if __name__ == "__main__":
    build()
