#!/usr/bin/env python3
"""
AI and Music Industry: The 2026 Convergence
An Economist-inspired analysis of technological and creative intersection
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER
import textwrap

# Page dimensions
WIDTH, HEIGHT = letter
MARGIN = 0.85 * inch
COL_WIDTH = (WIDTH - 2 * MARGIN - 0.25 * inch) / 2  # Two column layout

# Color palette
DEEP_BLUE = (31/255, 46/255, 122/255)  # #1F2E7A
ACCENT_BLUE = (58/255, 95/255, 205/255)  # #3A5FCD
LIGHT_BLUE = (127/255, 179/255, 213/255)  # #7FB3D5
DARK_TEXT = (13/255, 13/255, 13/255)  # #0D0D0D
GREY_TEXT = (102/255, 102/255, 102/255)  # #666666
LIGHT_GREY = (232/255, 232/255, 232/255)  # #E8E8E8

# Register fonts
FONT_DIR = "./canvas-fonts/"
pdfmetrics.registerFont(TTFont('Lora', FONT_DIR + 'Lora-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LoraBold', FONT_DIR + 'Lora-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LoraItalic', FONT_DIR + 'Lora-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Crimson', FONT_DIR + 'CrimsonPro-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CrimsonBold', FONT_DIR + 'CrimsonPro-Bold.ttf'))
pdfmetrics.registerFont(TTFont('CrimsonItalic', FONT_DIR + 'CrimsonPro-Italic.ttf'))
pdfmetrics.registerFont(TTFont('IBMMono', FONT_DIR + 'IBMPlexMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Instrument', FONT_DIR + 'InstrumentSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('InstrumentBold', FONT_DIR + 'InstrumentSans-Bold.ttf'))


class EconomistStylePDF:
    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=letter)
        self.width = WIDTH
        self.height = HEIGHT

    def draw_text_block(self, text, x, y, width, font_name, font_size, leading, color=DARK_TEXT):
        """Draw a block of wrapped text"""
        self.c.setFont(font_name, font_size)
        self.c.setFillColorRGB(*color)

        # Calculate characters per line based on font and width
        avg_char_width = self.c.stringWidth('m', font_name, font_size)
        chars_per_line = int(width / avg_char_width)

        lines = textwrap.wrap(text, width=chars_per_line)
        current_y = y

        for line in lines:
            if current_y < MARGIN:  # Stop if we run out of space
                break
            self.c.drawString(x, current_y, line)
            current_y -= leading

        return current_y  # Return final y position

    def draw_horizontal_rule(self, x, y, width, thickness=0.5, color=DEEP_BLUE):
        """Draw a horizontal line"""
        self.c.setStrokeColorRGB(*color)
        self.c.setLineWidth(thickness)
        self.c.line(x, y, x + width, y)

    def draw_bar_chart(self, x, y, width, height, data, labels, title, color=DEEP_BLUE):
        """Draw a clean, professional bar chart"""
        # Title
        self.c.setFont('Instrument', 9)
        self.c.setFillColorRGB(*DARK_TEXT)
        self.c.drawString(x, y + height + 15, title)

        # Determine max value for scaling
        max_val = max(data)
        bar_height_unit = height / max_val
        bar_width = width / len(data)
        spacing = bar_width * 0.2
        actual_bar_width = bar_width - spacing

        # Draw axes
        self.c.setStrokeColorRGB(*GREY_TEXT)
        self.c.setLineWidth(0.5)
        self.c.line(x, y, x, y + height)  # Y axis
        self.c.line(x, y, x + width, y)  # X axis

        # Draw bars
        for i, (value, label) in enumerate(zip(data, labels)):
            bar_x = x + i * bar_width + spacing/2
            bar_h = value * bar_height_unit

            # Bar
            self.c.setFillColorRGB(*color)
            self.c.rect(bar_x, y, actual_bar_width, bar_h, fill=1, stroke=0)

            # Value on top
            self.c.setFont('IBMMono', 7)
            self.c.setFillColorRGB(*DARK_TEXT)
            val_text = f"{value}%"
            val_width = self.c.stringWidth(val_text, 'IBMMono', 7)
            self.c.drawString(bar_x + (actual_bar_width - val_width)/2, y + bar_h + 3, val_text)

            # Label
            self.c.setFont('Instrument', 7)
            self.c.setFillColorRGB(*GREY_TEXT)
            # Wrap label if needed
            if len(label) > 12:
                words = label.split()
                if len(words) > 1:
                    self.c.drawString(bar_x, y - 12, words[0])
                    self.c.drawString(bar_x, y - 22, ' '.join(words[1:]))
                else:
                    self.c.drawString(bar_x, y - 12, label[:12])
                    self.c.drawString(bar_x, y - 22, label[12:])
            else:
                self.c.drawString(bar_x, y - 12, label)

    def draw_line_chart(self, x, y, width, height, data_series, labels, title, legend_items):
        """Draw a clean line chart with multiple series"""
        # Title
        self.c.setFont('Instrument', 9)
        self.c.setFillColorRGB(*DARK_TEXT)
        self.c.drawString(x, y + height + 15, title)

        # Determine max value
        max_val = max(max(series) for series in data_series)
        y_scale = height / max_val
        x_scale = width / (len(labels) - 1)

        # Draw axes
        self.c.setStrokeColorRGB(*GREY_TEXT)
        self.c.setLineWidth(0.5)
        self.c.line(x, y, x, y + height)  # Y axis
        self.c.line(x, y, x + width, y)  # X axis

        # Draw grid lines
        self.c.setStrokeColorRGB(*LIGHT_GREY)
        self.c.setLineWidth(0.25)
        for i in range(5):
            grid_y = y + (height / 4) * i
            self.c.line(x, grid_y, x + width, grid_y)

        # Draw data series
        colors = [DEEP_BLUE, ACCENT_BLUE, LIGHT_BLUE]
        for series_idx, series in enumerate(data_series):
            self.c.setStrokeColorRGB(*colors[series_idx % len(colors)])
            self.c.setLineWidth(2)

            path = self.c.beginPath()
            for i, value in enumerate(series):
                point_x = x + i * x_scale
                point_y = y + value * y_scale

                if i == 0:
                    path.moveTo(point_x, point_y)
                else:
                    path.lineTo(point_x, point_y)

            self.c.drawPath(path, stroke=1, fill=0)

            # Draw points
            self.c.setFillColorRGB(*colors[series_idx % len(colors)])
            for i, value in enumerate(series):
                point_x = x + i * x_scale
                point_y = y + value * y_scale
                self.c.circle(point_x, point_y, 2, fill=1, stroke=0)

        # X-axis labels
        self.c.setFont('Instrument', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        for i, label in enumerate(labels):
            label_x = x + i * x_scale
            label_width = self.c.stringWidth(label, 'Instrument', 7)
            self.c.drawString(label_x - label_width/2, y - 12, label)

        # Legend
        legend_x = x + width - 100
        legend_y = y + height - 20
        self.c.setFont('Instrument', 7)
        for i, legend_item in enumerate(legend_items):
            # Color box
            self.c.setFillColorRGB(*colors[i % len(colors)])
            self.c.rect(legend_x, legend_y - i * 12, 8, 6, fill=1, stroke=0)

            # Label
            self.c.setFillColorRGB(*DARK_TEXT)
            self.c.drawString(legend_x + 12, legend_y - i * 12 + 1, legend_item)

    def draw_data_table(self, x, y, headers, rows, col_widths):
        """Draw a clean data table"""
        row_height = 18
        current_y = y

        # Header row
        self.c.setFillColorRGB(*LIGHT_GREY)
        self.c.rect(x, current_y - row_height, sum(col_widths), row_height, fill=1, stroke=0)

        self.c.setFont('InstrumentBold', 8)
        self.c.setFillColorRGB(*DARK_TEXT)
        current_x = x + 5
        for i, header in enumerate(headers):
            self.c.drawString(current_x, current_y - 12, header)
            current_x += col_widths[i]

        current_y -= row_height

        # Data rows
        self.c.setFont('Crimson', 9)
        for row in rows:
            # Alternating row background
            if rows.index(row) % 2 == 0:
                self.c.setFillColorRGB(0.98, 0.98, 0.98)
                self.c.rect(x, current_y - row_height, sum(col_widths), row_height, fill=1, stroke=0)

            self.c.setFillColorRGB(*DARK_TEXT)
            current_x = x + 5
            for i, cell in enumerate(row):
                self.c.drawString(current_x, current_y - 12, str(cell))
                current_x += col_widths[i]

            current_y -= row_height

        # Border
        self.c.setStrokeColorRGB(*GREY_TEXT)
        self.c.setLineWidth(0.5)
        self.c.rect(x, current_y, sum(col_widths), (len(rows) + 1) * row_height, fill=0, stroke=1)

    def page_1_cover(self):
        """Cover page - clean, editorial style"""
        # Title
        self.c.setFont('LoraBold', 44)
        self.c.setFillColorRGB(*DEEP_BLUE)
        title_text = "The Convergence"
        self.c.drawString(MARGIN, self.height - 120, title_text)

        # Subtitle
        self.c.setFont('Lora', 24)
        self.c.setFillColorRGB(*DARK_TEXT)
        self.c.drawString(MARGIN, self.height - 155, "Artificial Intelligence and")
        self.c.drawString(MARGIN, self.height - 185, "the Music Industry in 2026")

        # Horizontal rule
        self.draw_horizontal_rule(MARGIN, self.height - 200, 220, 1.5, DEEP_BLUE)

        # Deck/summary
        deck_text = ("A comprehensive analysis of where machine learning and musical creativity "
                    "intersect, diverge, and reshape the landscape of production, distribution, "
                    "and artistic expression.")

        self.c.setFont('Crimson', 12)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.draw_text_block(deck_text, MARGIN, self.height - 235, WIDTH - 2*MARGIN,
                           'Crimson', 12, 18, GREY_TEXT)

        # Simple chart preview - showing trajectory
        chart_y = 380
        years = ['2020', '2022', '2024', '2026']
        adoption = [12, 28, 52, 73]

        chart_width = 280
        chart_height = 120

        self.c.setFont('Instrument', 9)
        self.c.setFillColorRGB(*DARK_TEXT)
        self.c.drawString(MARGIN, chart_y + chart_height + 15, "AI Adoption in Music Production (%)")

        # Simple line chart
        x_start = MARGIN
        y_start = chart_y
        x_scale = chart_width / (len(years) - 1)
        y_scale = chart_height / 100

        # Axes
        self.c.setStrokeColorRGB(*GREY_TEXT)
        self.c.setLineWidth(0.5)
        self.c.line(x_start, y_start, x_start, y_start + chart_height)
        self.c.line(x_start, y_start, x_start + chart_width, y_start)

        # Grid
        self.c.setStrokeColorRGB(*LIGHT_GREY)
        self.c.setLineWidth(0.25)
        for i in range(0, 101, 25):
            y_pos = y_start + i * y_scale
            self.c.line(x_start, y_pos, x_start + chart_width, y_pos)

        # Data line
        self.c.setStrokeColorRGB(*DEEP_BLUE)
        self.c.setLineWidth(2.5)
        path = self.c.beginPath()
        for i, (year, value) in enumerate(zip(years, adoption)):
            x_pos = x_start + i * x_scale
            y_pos = y_start + value * y_scale

            if i == 0:
                path.moveTo(x_pos, y_pos)
            else:
                path.lineTo(x_pos, y_pos)
        self.c.drawPath(path, stroke=1, fill=0)

        # Points
        self.c.setFillColorRGB(*DEEP_BLUE)
        for i, (year, value) in enumerate(zip(years, adoption)):
            x_pos = x_start + i * x_scale
            y_pos = y_start + value * y_scale
            self.c.circle(x_pos, y_pos, 3, fill=1, stroke=0)

        # Labels
        self.c.setFont('Instrument', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        for i, year in enumerate(years):
            x_pos = x_start + i * x_scale
            label_width = self.c.stringWidth(year, 'Instrument', 7)
            self.c.drawString(x_pos - label_width/2, y_start - 12, year)

        # Metadata
        self.c.setFont('IBMMono', 8)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.c.drawString(MARGIN, 100, "Special Report")
        self.c.drawString(MARGIN, 85, "December 2025")

        # Page footer
        self.draw_horizontal_rule(MARGIN, 60, WIDTH - 2*MARGIN, 0.5, LIGHT_GREY)

        self.c.showPage()

    def page_2_intro(self):
        """Introduction with two-column layout"""
        # Header
        self.c.setFont('LoraBold', 28)
        self.c.setFillColorRGB(*DEEP_BLUE)
        self.c.drawString(MARGIN, self.height - 80, "A New Creative Paradigm")

        self.draw_horizontal_rule(MARGIN, self.height - 90, 280, 1, DEEP_BLUE)

        # Body text in two columns
        intro_text = [
            ("The music industry stands at an inflection point. Generative artificial intelligence, "
             "once confined to research laboratories and experimental studios, has entered the mainstream "
             "of commercial music production. By 2026, the technology will be ubiquitous, reshaping not "
             "merely the technical processes of composition and production, but the fundamental economics "
             "of musical creativity itself."),

            ("This transformation arrives with profound implications. On one hand, AI-powered tools promise "
             "to democratize music creation, enabling artists without formal training or expensive studio "
             "access to produce professional-quality recordings. Machine learning models can generate "
             "harmonic progressions, suggest melodic variations, and even produce entire instrumental "
             "arrangements in seconds—tasks that previously required years of study and practice."),

            ("Yet this same technological shift threatens to destabilize the industry's established order. "
             "Session musicians face displacement as AI-generated performances achieve indistinguishable "
             "quality from human recordings. Copyright frameworks, built for an analog era, strain under "
             "the weight of questions about training data and generated content ownership. The very "
             "definition of authorship becomes contested terrain."),
        ]

        # Left column
        current_y = self.height - 130
        self.c.setFont('Crimson', 10.5)
        self.c.setFillColorRGB(*DARK_TEXT)

        for i, para in enumerate(intro_text[:2]):
            # Add spacing between paragraphs
            if i > 0:
                current_y -= 12

            current_y = self.draw_text_block(
                para, MARGIN, current_y, COL_WIDTH, 'Crimson', 10.5, 15, DARK_TEXT
            )

        # Right column
        current_y = self.height - 130
        col2_x = MARGIN + COL_WIDTH + 0.25 * inch

        current_y = self.draw_text_block(
            intro_text[2], col2_x, current_y, COL_WIDTH, 'Crimson', 10.5, 15, DARK_TEXT
        )

        current_y -= 25

        # Pull quote
        pullquote_text = ("\"The technology is neither savior nor destroyer—it is a tool "
                         "whose impact depends entirely on how we choose to deploy it.\"")

        self.c.setFont('LoraItalic', 13)
        self.c.setFillColorRGB(*DEEP_BLUE)
        current_y = self.draw_text_block(
            pullquote_text, col2_x + 15, current_y, COL_WIDTH - 30,
            'LoraItalic', 13, 19, DEEP_BLUE
        )

        # More body text
        cont_text = [
            ("The path forward requires careful navigation. Industry stakeholders—from major labels to "
             "independent artists, from streaming platforms to instrument manufacturers—must grapple with "
             "fundamental questions about value creation, fair compensation, and artistic authenticity. "
             "The answers will shape not only the business of music, but the cultural role of musical "
             "expression in society."),

            ("This report examines the landscape ahead: where AI and music will flourish in symbiosis, "
             "where tensions will intensify, and what the industry might look like when the transformation "
             "reaches maturity in 2026."),
        ]

        current_y = 330
        current_y = self.draw_text_block(
            cont_text[0], MARGIN, current_y, COL_WIDTH, 'Crimson', 10.5, 15, DARK_TEXT
        )

        current_y -= 12
        current_y = self.draw_text_block(
            cont_text[1], MARGIN, current_y, COL_WIDTH, 'Crimson', 10.5, 15, DARK_TEXT
        )

        # Sidebar with key statistics
        sidebar_x = col2_x
        sidebar_y = 330
        sidebar_width = COL_WIDTH

        self.c.setFillColorRGB(*LIGHT_GREY)
        self.c.rect(sidebar_x, sidebar_y - 120, sidebar_width, 130, fill=1, stroke=0)

        self.c.setStrokeColorRGB(*DEEP_BLUE)
        self.c.setLineWidth(2)
        self.c.line(sidebar_x, sidebar_y - 120, sidebar_x, sidebar_y + 10)

        self.c.setFont('InstrumentBold', 9)
        self.c.setFillColorRGB(*DARK_TEXT)
        self.c.drawString(sidebar_x + 10, sidebar_y, "KEY METRICS")

        stats = [
            ("$4.2bn", "Projected AI music tech market size"),
            ("73%", "Producers using AI tools regularly"),
            ("3.2m", "Artists employing generative AI"),
            ("156%", "YoY growth in AI music startups"),
        ]

        stat_y = sidebar_y - 25
        self.c.setFont('LoraBold', 18)
        for stat, label in stats:
            self.c.setFillColorRGB(*DEEP_BLUE)
            self.c.drawString(sidebar_x + 10, stat_y, stat)

            self.c.setFont('Crimson', 8)
            self.c.setFillColorRGB(*GREY_TEXT)
            self.c.drawString(sidebar_x + 10, stat_y - 12, label)

            self.c.setFont('LoraBold', 18)
            stat_y -= 30

        # Footer
        self.draw_horizontal_rule(MARGIN, 60, WIDTH - 2*MARGIN, 0.5, LIGHT_GREY)
        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.c.drawString(MARGIN, 45, "The Convergence: AI and Music in 2026")
        self.c.drawString(WIDTH - MARGIN - 20, 45, "02")

        self.c.showPage()

    def page_3_flourish(self):
        """Where AI and music flourish"""
        # Header
        self.c.setFont('LoraBold', 28)
        self.c.setFillColorRGB(*DEEP_BLUE)
        self.c.drawString(MARGIN, self.height - 80, "Where They Flourish")

        self.draw_horizontal_rule(MARGIN, self.height - 90, 250, 1, DEEP_BLUE)

        # Section intro
        section_intro = ("Four domains show particular promise for AI integration, where the technology "
                        "amplifies rather than replaces human creativity.")

        current_y = self.height - 120
        self.c.setFont('CrimsonItalic', 11)
        self.c.setFillColorRGB(*GREY_TEXT)
        current_y = self.draw_text_block(
            section_intro, MARGIN, current_y, WIDTH - 2*MARGIN, 'CrimsonItalic', 11, 16, GREY_TEXT
        )

        # Chart - Adoption by category
        current_y -= 35
        chart_data = [72, 68, 54, 47]
        chart_labels = ['Creation', 'Production', 'Distribution', 'Discovery']

        self.draw_bar_chart(
            MARGIN, current_y - 120, WIDTH - 2*MARGIN - 100, 100,
            chart_data, chart_labels,
            "AI Adoption Rates by Music Industry Segment (% of professionals, 2026)",
            DEEP_BLUE
        )

        current_y -= 170

        # Two-column text sections
        sections = [
            ("Creation and Composition",
             "Generative models serve as collaborative partners in the compositional process. Rather than "
             "replacing songwriters, these tools function as intelligent suggestion engines—proposing chord "
             "progressions, generating counter-melodies, or offering arrangement alternatives. Major DAW "
             "manufacturers have integrated AI assistants that learn individual artists' stylistic preferences, "
             "providing contextual recommendations that accelerate workflow without dictating creative direction."),

            ("Production and Mastering",
             "Technical barriers to professional-quality production continue to fall. AI-powered mastering "
             "services deliver results competitive with experienced engineers at a fraction of the cost. "
             "Real-time processing enables musicians to hear production-quality mixes during composition, "
             "fundamentally changing the creative feedback loop. Democratization of these tools benefits "
             "independent artists most significantly, enabling bedroom producers to compete on sonic quality "
             "with major-label releases."),

            ("Distribution Intelligence",
             "Streaming platforms deploy sophisticated algorithms to match music with potential audiences. "
             "These systems analyze acoustic features, lyrical content, and even emotional resonance to connect "
             "artists with listeners beyond traditional genre boundaries. For niche musicians, this represents "
             "unprecedented access to global audiences who would never discover their work through conventional "
             "promotion channels."),

            ("Discovery and Curation",
             "The paradox of choice in digital music libraries finds partial resolution in AI curation. Rather "
             "than overwhelming listeners with millions of options, intelligent systems surface music aligned "
             "with contextual preferences—mood, activity, time of day. Playlist generation has evolved beyond "
             "simple genre matching to capture subtle stylistic nuances, introducing listeners to new artists "
             "while respecting their aesthetic sensibilities."),
        ]

        # Draw sections in two columns
        left_y = current_y
        right_y = current_y
        col2_x = MARGIN + COL_WIDTH + 0.25 * inch

        for i, (heading, body) in enumerate(sections):
            if i % 2 == 0:  # Left column
                x = MARGIN
                y = left_y
            else:  # Right column
                x = col2_x
                y = right_y

            # Heading
            self.c.setFont('LoraBold', 12)
            self.c.setFillColorRGB(*DEEP_BLUE)
            self.c.drawString(x, y, heading)

            # Body
            y -= 20
            self.c.setFont('Crimson', 9.5)
            self.c.setFillColorRGB(*DARK_TEXT)
            final_y = self.draw_text_block(
                body, x, y, COL_WIDTH, 'Crimson', 9.5, 14, DARK_TEXT
            )

            if i % 2 == 0:
                left_y = final_y - 20
            else:
                right_y = final_y - 20

        # Footer
        self.draw_horizontal_rule(MARGIN, 60, WIDTH - 2*MARGIN, 0.5, LIGHT_GREY)
        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.c.drawString(MARGIN, 45, "Special Report")
        self.c.drawString(WIDTH - MARGIN - 20, 45, "03")

        self.c.showPage()

    def page_4_friction(self):
        """Points of friction and challenges"""
        # Header
        self.c.setFont('LoraBold', 28)
        self.c.setFillColorRGB(*DEEP_BLUE)
        self.c.drawString(MARGIN, self.height - 80, "Points of Friction")

        self.draw_horizontal_rule(MARGIN, self.height - 90, 240, 1, DEEP_BLUE)

        # Intro
        intro = ("Despite promising applications, fundamental tensions remain unresolved, threatening "
                "to undermine the technology's potential benefits.")

        current_y = self.height - 120
        self.c.setFont('CrimsonItalic', 11)
        self.c.setFillColorRGB(*GREY_TEXT)
        current_y = self.draw_text_block(
            intro, MARGIN, current_y, WIDTH - 2*MARGIN, 'CrimsonItalic', 11, 16, GREY_TEXT
        )

        current_y -= 30

        # Table of challenges
        headers = ['Challenge', 'Impact', 'Status']
        rows = [
            ['Copyright ownership', 'High', 'Unresolved'],
            ['Training data rights', 'High', 'Litigation pending'],
            ['Labor displacement', 'Medium', 'Emerging'],
            ['Authenticity verification', 'Medium', 'Early solutions'],
            ['Revenue distribution', 'High', 'Disputed'],
        ]
        col_widths = [150, 80, 120]

        self.draw_data_table(MARGIN, current_y, headers, rows, col_widths)

        current_y -= 140

        # Detailed sections
        sections = [
            ("Rights and Ownership",
             "The fundamental question of who owns AI-generated music remains contested. When a model trained "
             "on millions of copyrighted songs produces a new composition, the legal framework offers no clear "
             "answer. Artists whose work contributed to training datasets argue for compensation or control. "
             "Platform operators claim outputs represent transformative use. Musicians using these tools face "
             "uncertainty about their rights to the resulting works. Several high-profile lawsuits wind through "
             "courts, but comprehensive legal precedent remains years away."),

            ("Economic Displacement",
             "Session musicians, particularly those performing standardized parts, face direct competition from "
             "AI-generated performances. Orchestra and choir recordings increasingly use synthetic instruments "
             "for budget-conscious productions. Jingle composers find their services replaced by generative "
             "systems that produce commercial music to specification. While new roles emerge—AI model trainers, "
             "prompt engineers for music generation—the transition leaves many skilled professionals economically "
             "vulnerable. The net employment effect remains negative in traditional creative roles."),

            ("Authenticity Crisis",
             "As AI-generated music becomes indistinguishable from human performances, listeners face an "
             "authenticity problem. Marketing campaigns emphasizing 'real musicians' attempt to differentiate "
             "human-created work, but verification proves difficult. Some platforms implement 'AI disclosure' "
             "requirements, yet enforcement remains inconsistent. The cultural value of musical authenticity—"
             "the connection between artist and expression—erodes when authorship becomes ambiguous."),

            ("Algorithmic Homogenization",
             "Streaming platforms' recommendation algorithms create powerful incentives for musical conformity. "
             "Artists learn which sonic characteristics trigger playlist inclusion, leading to convergence around "
             "algorithm-friendly styles. AI composition tools, trained on popular music, reinforce existing patterns "
             "rather than encouraging innovation. Critics warn of a 'flattening' effect where distinctive regional "
             "sounds and experimental approaches struggle to find audiences, as both creation and distribution "
             "systems optimize for mainstream palatability."),
        ]

        # Two column layout
        left_y = current_y
        right_y = current_y
        col2_x = MARGIN + COL_WIDTH + 0.25 * inch

        for i, (heading, body) in enumerate(sections):
            if i % 2 == 0:  # Left column
                x = MARGIN
                y = left_y
            else:  # Right column
                x = col2_x
                y = right_y

            # Heading
            self.c.setFont('LoraBold', 12)
            self.c.setFillColorRGB(*DEEP_BLUE)
            self.c.drawString(x, y, heading)

            # Body
            y -= 20
            self.c.setFont('Crimson', 9.5)
            self.c.setFillColorRGB(*DARK_TEXT)
            final_y = self.draw_text_block(
                body, x, y, COL_WIDTH, 'Crimson', 9.5, 14, DARK_TEXT
            )

            if i % 2 == 0:
                left_y = final_y - 20
            else:
                right_y = final_y - 20

        # Footer
        self.draw_horizontal_rule(MARGIN, 60, WIDTH - 2*MARGIN, 0.5, LIGHT_GREY)
        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.c.drawString(MARGIN, 45, "The Convergence: AI and Music in 2026")
        self.c.drawString(WIDTH - MARGIN - 20, 45, "04")

        self.c.showPage()

    def page_5_conclusion(self):
        """The 2026 landscape and conclusions"""
        # Header
        self.c.setFont('LoraBold', 28)
        self.c.setFillColorRGB(*DEEP_BLUE)
        self.c.drawString(MARGIN, self.height - 80, "The Road Ahead")

        self.draw_horizontal_rule(MARGIN, self.height - 90, 200, 1, DEEP_BLUE)

        # Line chart showing multiple trajectories
        current_y = self.height - 130

        years = ['2022', '2023', '2024', '2025', '2026']
        adoption_data = [
            [28, 42, 56, 67, 73],  # Professional adoption
            [35, 48, 62, 71, 78],  # Consumer awareness
            [8, 15, 28, 45, 58],   # Regulatory framework
        ]

        self.draw_line_chart(
            MARGIN, current_y - 130, WIDTH - 2*MARGIN, 110,
            adoption_data, years,
            "Technology Adoption vs. Regulatory Development (% maturity)",
            ['Professional adoption', 'Consumer awareness', 'Regulatory framework']
        )

        current_y -= 180

        # Concluding analysis
        conclusion_text = [
            ("By 2026, AI will be deeply embedded in music industry infrastructure. The technology's presence "
             "is inevitable; what remains uncertain is the distribution of its benefits and costs. Current "
             "trajectories suggest a bifurcated outcome: productivity gains concentrated among major platforms "
             "and labels, while creative workers face intensified competition and reduced compensation."),

            ("Policy intervention could alter this trajectory. Proposals range from mandatory licensing "
             "requirements for training data, to collective bargaining rights for creators whose work trains "
             "AI systems, to public funding for artists displaced by automation. Yet regulatory development "
             "lags technological deployment by years, and powerful industry actors benefit from the status quo."),

            ("The optimistic scenario envisions AI as a democratizing force—reducing barriers to entry, "
             "enabling diverse voices, and freeing artists from technical constraints to focus on creative "
             "expression. The pessimistic view sees algorithmic homogenization, economic precarity for "
             "professional musicians, and the erosion of music's cultural significance as human authorship "
             "becomes ambiguous."),

            ("Most likely, 2026 will deliver elements of both futures simultaneously. Major artists will "
             "leverage AI tools to enhance productivity while maintaining economic power. Independent musicians "
             "will access professional-quality production but struggle to monetize work in algorithm-driven "
             "marketplaces. Listeners will enjoy unprecedented music discovery while consuming increasingly "
             "similar-sounding content. Session musicians and other specialized workers will face displacement, "
             "while new technical roles emerge for those who can adapt."),

            ("The music industry's transformation mirrors broader patterns in AI's economic impact: productivity "
             "gains that don't translate to shared prosperity, technological sophistication that doesn't resolve "
             "fundamental questions about value and fairness. Whether stakeholders can negotiate more equitable "
             "arrangements—or whether market forces and regulatory inertia lock in current power dynamics—will "
             "determine whether AI integration ultimately strengthens or diminishes music's role in human culture."),
        ]

        # Two-column layout
        left_y = current_y
        right_y = current_y
        col2_x = MARGIN + COL_WIDTH + 0.25 * inch

        self.c.setFont('Crimson', 10)
        self.c.setFillColorRGB(*DARK_TEXT)

        for i, para in enumerate(conclusion_text):
            if i < 3:  # First 3 paragraphs in left column
                if i > 0:
                    left_y -= 12
                left_y = self.draw_text_block(
                    para, MARGIN, left_y, COL_WIDTH, 'Crimson', 10, 14.5, DARK_TEXT
                )
            else:  # Last 2 paragraphs in right column
                if i > 3:
                    right_y -= 12
                right_y = self.draw_text_block(
                    para, col2_x, right_y, COL_WIDTH, 'Crimson', 10, 14.5, DARK_TEXT
                )

        # Closing note in box
        box_y = 140
        self.c.setStrokeColorRGB(*DEEP_BLUE)
        self.c.setLineWidth(1)
        self.c.rect(MARGIN, box_y, WIDTH - 2*MARGIN, 50, fill=0, stroke=1)

        self.c.setFont('LoraBold', 11)
        self.c.setFillColorRGB(*DEEP_BLUE)
        closing = "The convergence is neither purely opportunity nor purely crisis—it is complexity requiring thoughtful navigation."
        self.draw_text_block(
            closing, MARGIN + 15, box_y + 32, WIDTH - 2*MARGIN - 30,
            'LoraBold', 11, 16, DEEP_BLUE
        )

        # Footer
        self.draw_horizontal_rule(MARGIN, 60, WIDTH - 2*MARGIN, 0.5, LIGHT_GREY)
        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(*GREY_TEXT)
        self.c.drawString(MARGIN, 45, "Special Report")
        self.c.drawString(WIDTH - MARGIN - 20, 45, "05")

        self.c.showPage()

    def generate(self):
        """Generate all pages"""
        self.page_1_cover()
        self.page_2_intro()
        self.page_3_flourish()
        self.page_4_friction()
        self.page_5_conclusion()
        self.c.save()
        print("Economist-style PDF generated successfully!")


if __name__ == "__main__":
    pdf = EconomistStylePDF("AI_Music_2026_Economist_Style.pdf")
    pdf.generate()
