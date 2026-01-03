#!/usr/bin/env python3
"""
Synthetic Resonance: AI × Music Industry 2026
A visual exploration of technological and creative intersection
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math

# Page dimensions
WIDTH, HEIGHT = letter
MARGIN = 0.75 * inch

# Register fonts
FONT_DIR = "./canvas-fonts/"
pdfmetrics.registerFont(TTFont('Geist', FONT_DIR + 'GeistMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('GeistBold', FONT_DIR + 'GeistMono-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Instrument', FONT_DIR + 'InstrumentSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('InstrumentBold', FONT_DIR + 'InstrumentSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Work', FONT_DIR + 'WorkSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Jura', FONT_DIR + 'Jura-Light.ttf'))
pdfmetrics.registerFont(TTFont('IBMMono', FONT_DIR + 'IBMPlexMono-Regular.ttf'))

class SyntheticResonancePDF:
    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=letter)
        self.width = WIDTH
        self.height = HEIGHT

    def draw_waveform(self, x, y, width, height, frequency=3, amplitude=15, color=(0,0,0)):
        """Draw a sine wave pattern"""
        self.c.setStrokeColorRGB(*color)
        self.c.setLineWidth(1.5)

        path = self.c.beginPath()
        steps = 200
        for i in range(steps + 1):
            dx = (i / steps) * width
            dy = math.sin((i / steps) * frequency * 2 * math.pi) * amplitude
            if i == 0:
                path.moveTo(x + dx, y + dy)
            else:
                path.lineTo(x + dx, y + dy)

        self.c.drawPath(path, stroke=1, fill=0)

    def draw_frequency_bars(self, x, y, width, height, num_bars=40, values=None):
        """Draw equalizer-style frequency bars"""
        bar_width = width / num_bars
        spacing = bar_width * 0.3
        actual_bar_width = bar_width - spacing

        for i in range(num_bars):
            if values:
                bar_height = values[i] * height
            else:
                # Create varied heights based on position
                bar_height = height * (0.2 + 0.6 * math.sin(i * 0.5) ** 2)

            # Color gradient effect
            intensity = bar_height / height
            self.c.setFillColorRGB(intensity * 0.2, intensity * 0.4, intensity * 0.8)

            self.c.rect(
                x + i * bar_width,
                y,
                actual_bar_width,
                bar_height,
                fill=1,
                stroke=0
            )

    def draw_concentric_circles(self, cx, cy, max_radius, num_circles=8, color=(0,0,0), alpha=0.3):
        """Draw concentric circles like sound waves"""
        for i in range(num_circles, 0, -1):
            radius = (i / num_circles) * max_radius
            self.c.setStrokeColorRGB(*color)
            self.c.setLineWidth(0.75)
            self.c.setStrokeAlpha(alpha)
            self.c.circle(cx, cy, radius, stroke=1, fill=0)
        self.c.setStrokeAlpha(1)

    def page_1_cover(self):
        """Cover page - establishing visual identity"""
        self.c.setFillColorRGB(0, 0, 0)
        self.c.rect(0, 0, self.width, self.height, fill=1)

        # Large central circle (vinyl record metaphor)
        center_x = self.width / 2
        center_y = self.height / 2 + 50

        # Outer glow circles
        for i in range(12, 0, -1):
            radius = i * 15
            alpha = 0.08 * (12 - i) / 12
            self.c.setFillColorRGB(0.2, 0.4, 0.9)
            self.c.setFillAlpha(alpha)
            self.c.circle(center_x, center_y, radius, stroke=0, fill=1)

        self.c.setFillAlpha(1)

        # Main circle
        self.c.setFillColorRGB(0.05, 0.05, 0.05)
        self.c.circle(center_x, center_y, 140, stroke=0, fill=1)

        # Inner circles
        self.c.setStrokeColorRGB(0.15, 0.3, 0.6)
        self.c.setLineWidth(1)
        for r in [120, 100, 60, 30]:
            self.c.circle(center_x, center_y, r, stroke=1, fill=0)

        # Center hole
        self.c.setFillColorRGB(0, 0, 0)
        self.c.circle(center_x, center_y, 20, stroke=0, fill=1)

        # Radial lines (grooves)
        self.c.setStrokeColorRGB(0.1, 0.2, 0.5)
        self.c.setLineWidth(0.5)
        for i in range(24):
            angle = (i / 24) * 2 * math.pi
            x1 = center_x + 35 * math.cos(angle)
            y1 = center_y + 35 * math.sin(angle)
            x2 = center_x + 135 * math.cos(angle)
            y2 = center_y + 135 * math.sin(angle)
            self.c.line(x1, y1, x2, y2)

        # Main title
        self.c.setFillColorRGB(1, 1, 1)
        self.c.setFont('GeistBold', 42)
        title_text = "AI × MUSIC"
        title_width = self.c.stringWidth(title_text, 'GeistBold', 42)
        self.c.drawString((self.width - title_width) / 2, self.height - 100, title_text)

        # Subtitle
        self.c.setFont('Jura', 16)
        subtitle = "THE 2026 CONVERGENCE"
        sub_width = self.c.stringWidth(subtitle, 'Jura', 16)
        self.c.drawString((self.width - sub_width) / 2, self.height - 125, subtitle)

        # Bottom text
        self.c.setFont('IBMMono', 8)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        bottom_text = "An analysis of technological and creative intersection"
        bt_width = self.c.stringWidth(bottom_text, 'IBMMono', 8)
        self.c.drawString((self.width - bt_width) / 2, 80, bottom_text)

        # Waveform at bottom
        self.c.setStrokeColorRGB(0.2, 0.5, 0.9)
        self.draw_waveform(MARGIN, 50, self.width - 2*MARGIN, 20, frequency=8, amplitude=8)

        self.c.showPage()

    def page_2_flourish(self):
        """Page 2 - Where AI and Music Flourish"""
        # White background
        self.c.setFillColorRGB(1, 1, 1)
        self.c.rect(0, 0, self.width, self.height, fill=1)

        # Title
        self.c.setFillColorRGB(0, 0, 0)
        self.c.setFont('InstrumentBold', 28)
        self.c.drawString(MARGIN, self.height - 80, "FLOURISHING")

        # Thin line under title
        self.c.setStrokeColorRGB(0.2, 0.6, 0.9)
        self.c.setLineWidth(2)
        self.c.line(MARGIN, self.height - 90, MARGIN + 200, self.height - 90)

        # Create visual clusters representing different areas
        areas = [
            ("Creation", 0.3, 0.7, (0.15, 0.45, 0.85)),
            ("Production", 0.65, 0.7, (0.25, 0.65, 0.45)),
            ("Distribution", 0.3, 0.4, (0.75, 0.35, 0.65)),
            ("Discovery", 0.65, 0.4, (0.95, 0.55, 0.15)),
        ]

        base_y = self.height - 180
        for i, (label, rel_x, rel_y, color) in enumerate(areas):
            x = MARGIN + rel_x * (self.width - 2*MARGIN)
            y = base_y - rel_y * 300

            # Main circle
            self.c.setFillColorRGB(*color)
            self.c.setFillAlpha(0.7)
            self.c.circle(x, y, 50, stroke=0, fill=1)

            # Outer ring
            self.c.setFillAlpha(0.2)
            self.c.circle(x, y, 70, stroke=0, fill=1)

            self.c.setFillAlpha(1)

            # Inner detail circles
            self.c.setFillColorRGB(1, 1, 1)
            for j in range(8):
                angle = (j / 8) * 2 * math.pi
                cx = x + 25 * math.cos(angle)
                cy = y + 25 * math.sin(angle)
                self.c.circle(cx, cy, 3, stroke=0, fill=1)

            # Label
            self.c.setFillColorRGB(0, 0, 0)
            self.c.setFont('Work', 11)
            label_width = self.c.stringWidth(label, 'Work', 11)
            self.c.drawString(x - label_width/2, y - 100, label)

        # Connection lines between areas
        self.c.setStrokeColorRGB(0.7, 0.7, 0.7)
        self.c.setLineWidth(1)
        self.c.setStrokeAlpha(0.3)

        # Draw lines between all pairs
        for i in range(len(areas)):
            for j in range(i+1, len(areas)):
                x1 = MARGIN + areas[i][1] * (self.width - 2*MARGIN)
                y1 = base_y - areas[i][2] * 300
                x2 = MARGIN + areas[j][1] * (self.width - 2*MARGIN)
                y2 = base_y - areas[j][2] * 300
                self.c.line(x1, y1, x2, y2)

        self.c.setStrokeAlpha(1)

        # Bottom insights
        insights = [
            "Generative tools democratize composition",
            "Real-time collaboration transcends geography",
            "AI mastering achieves professional quality",
            "Algorithmic curation enables niche discovery"
        ]

        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(0.3, 0.3, 0.3)
        y_pos = 120
        for insight in insights:
            self.c.drawString(MARGIN + 20, y_pos, "→ " + insight)
            y_pos -= 15

        # Page number
        self.c.setFont('Jura', 8)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        self.c.drawString(self.width - MARGIN - 20, MARGIN - 20, "02")

        self.c.showPage()

    def page_3_friction(self):
        """Page 3 - Friction Points and Challenges"""
        # Dark background
        self.c.setFillColorRGB(0.08, 0.08, 0.12)
        self.c.rect(0, 0, self.width, self.height, fill=1)

        # Title
        self.c.setFillColorRGB(1, 1, 1)
        self.c.setFont('InstrumentBold', 28)
        self.c.drawString(MARGIN, self.height - 80, "FRICTION")

        # Thin line
        self.c.setStrokeColorRGB(0.9, 0.3, 0.3)
        self.c.setLineWidth(2)
        self.c.line(MARGIN, self.height - 90, MARGIN + 200, self.height - 90)

        # Visual representation of conflicts - overlapping shapes
        tensions = [
            ("Authenticity", 200, 520, (0.95, 0.35, 0.35)),
            ("Rights", 400, 480, (0.95, 0.55, 0.25)),
            ("Value", 250, 380, (0.85, 0.25, 0.55)),
            ("Labor", 380, 340, (0.65, 0.35, 0.75)),
        ]

        # Draw overlapping rectangles with different orientations
        for i, (label, x, y, color) in enumerate(tensions):
            self.c.saveState()
            self.c.translate(x, y)
            self.c.rotate(i * 15)

            # Main rectangle
            self.c.setFillColorRGB(*color)
            self.c.setFillAlpha(0.4)
            self.c.rect(-60, -40, 120, 80, fill=1, stroke=0)

            # Border
            self.c.setStrokeColorRGB(*color)
            self.c.setLineWidth(2)
            self.c.setStrokeAlpha(0.9)
            self.c.rect(-60, -40, 120, 80, fill=0, stroke=1)

            self.c.restoreState()

            # Label below
            self.c.setFillColorRGB(0.9, 0.9, 0.9)
            self.c.setFillAlpha(1)
            self.c.setFont('Work', 10)
            label_width = self.c.stringWidth(label, 'Work', 10)
            self.c.drawString(x - label_width/2, y - 70, label)

        self.c.setFillAlpha(1)
        self.c.setStrokeAlpha(1)

        # Detailed friction points
        friction_points = [
            "Ownership of AI-generated compositions remains contested",
            "Training data copyright challenges persist",
            "Musicians face displacement in commercial production",
            "Authenticity verification becomes critical",
            "Revenue distribution models lag technology"
        ]

        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(0.85, 0.85, 0.85)
        y_pos = 240
        for point in friction_points:
            # Bullet point
            self.c.setFillColorRGB(0.9, 0.4, 0.4)
            self.c.circle(MARGIN + 10, y_pos + 2, 2, fill=1, stroke=0)

            # Text
            self.c.setFillColorRGB(0.85, 0.85, 0.85)
            self.c.drawString(MARGIN + 20, y_pos, point)
            y_pos -= 18

        # Waveform disrupted
        self.c.setStrokeColorRGB(0.9, 0.3, 0.3)
        self.c.setLineWidth(1.5)
        path = self.c.beginPath()
        steps = 150
        for i in range(steps + 1):
            x = MARGIN + (i / steps) * (self.width - 2*MARGIN)
            # Disrupted sine wave
            y_base = 100
            if i < 50:
                y = y_base + math.sin((i / 150) * 12 * math.pi) * 15
            elif i < 100:
                # Disruption
                y = y_base + (math.sin((i / 150) * 12 * math.pi) * 15 + (i - 50) * 0.3)
            else:
                y = y_base + math.sin((i / 150) * 12 * math.pi) * 15

            if i == 0:
                path.moveTo(x, y)
            else:
                path.lineTo(x, y)

        self.c.drawPath(path, stroke=1, fill=0)

        # Page number
        self.c.setFont('Jura', 8)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        self.c.drawString(self.width - MARGIN - 20, MARGIN - 20, "03")

        self.c.showPage()

    def page_4_landscape(self):
        """Page 4 - The 2026 Landscape"""
        # Gradient background simulation (light)
        self.c.setFillColorRGB(0.97, 0.97, 0.99)
        self.c.rect(0, 0, self.width, self.height, fill=1)

        # Title
        self.c.setFillColorRGB(0, 0, 0)
        self.c.setFont('InstrumentBold', 28)
        self.c.drawString(MARGIN, self.height - 80, "2026 LANDSCAPE")

        # Thin line
        self.c.setStrokeColorRGB(0.3, 0.5, 0.8)
        self.c.setLineWidth(2)
        self.c.line(MARGIN, self.height - 90, MARGIN + 250, self.height - 90)

        # Frequency bars visualization
        y_freq = self.height - 200
        self.c.setFont('IBMMono', 6)
        self.c.setFillColorRGB(0.4, 0.4, 0.4)

        # Three sections with frequency bars
        sections = [
            ("CREATION TOOLS", 140, [0.7, 0.9, 0.6, 0.8, 0.95, 0.7, 0.85, 0.9, 0.75, 0.8]),
            ("MARKET ADOPTION", 140, [0.5, 0.6, 0.7, 0.8, 0.75, 0.7, 0.8, 0.85, 0.9, 0.95]),
            ("REGULATION", 140, [0.3, 0.4, 0.5, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.65])
        ]

        x_offset = MARGIN
        for section_title, height_val, values in sections:
            # Section title
            self.c.setFont('IBMMono', 7)
            self.c.setFillColorRGB(0.2, 0.2, 0.2)
            self.c.drawString(x_offset, y_freq + height_val + 20, section_title)

            # Draw bars
            bar_width = 15
            for i, val in enumerate(values):
                bar_height = val * height_val
                # Gradient color based on value
                self.c.setFillColorRGB(0.2 + val * 0.3, 0.4 + val * 0.3, 0.8)
                self.c.rect(
                    x_offset + i * (bar_width + 3),
                    y_freq,
                    bar_width,
                    bar_height,
                    fill=1,
                    stroke=0
                )

            x_offset += 180

        # Key predictions
        predictions = [
            ("70%", "of commercial music production will use AI tools"),
            ("$4.2B", "market size for AI music technology"),
            ("3.2M", "musicians actively using generative AI"),
            ("45%", "of streaming platforms integrate AI discovery")
        ]

        y_pred = 350
        for stat, description in predictions:
            # Stat
            self.c.setFont('GeistBold', 32)
            self.c.setFillColorRGB(0.2, 0.4, 0.8)
            self.c.drawString(MARGIN, y_pred, stat)

            # Description
            self.c.setFont('Work', 9)
            self.c.setFillColorRGB(0.3, 0.3, 0.3)
            self.c.drawString(MARGIN + 100, y_pred + 8, description)

            y_pred -= 70

        # Circular diagram at bottom
        center_x = self.width - 150
        center_y = 150

        # Concentric circles representing ecosystem layers
        self.draw_concentric_circles(center_x, center_y, 80, num_circles=6, color=(0.2, 0.4, 0.8), alpha=0.15)

        # Labels around circle
        labels = ["Artists", "Platforms", "Tools", "Listeners"]
        for i, label in enumerate(labels):
            angle = (i / len(labels)) * 2 * math.pi - math.pi/2
            x = center_x + 95 * math.cos(angle)
            y = center_y + 95 * math.sin(angle)

            self.c.setFont('IBMMono', 6)
            self.c.setFillColorRGB(0.2, 0.2, 0.2)
            label_width = self.c.stringWidth(label, 'IBMMono', 6)
            self.c.drawString(x - label_width/2, y, label)

        # Page number
        self.c.setFont('Jura', 8)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        self.c.drawString(self.width - MARGIN - 20, MARGIN - 20, "04")

        self.c.showPage()

    def page_5_synthesis(self):
        """Page 5 - Synthesis and Conclusion"""
        # Black background with gradient simulation
        self.c.setFillColorRGB(0, 0, 0)
        self.c.rect(0, 0, self.width, self.height, fill=1)

        # Large central visualization - spectrum
        center_y = self.height / 2 + 20

        # Draw spectrum bands
        num_bands = 40
        band_height = 8
        for i in range(num_bands):
            # Color transition from blue to purple to orange
            t = i / num_bands
            if t < 0.5:
                r = 0.2 + t * 0.8
                g = 0.3 + t * 0.6
                b = 0.9 - t * 0.2
            else:
                r = 0.6 + (t - 0.5) * 0.8
                g = 0.6 - (t - 0.5) * 0.4
                b = 0.7 - (t - 0.5) * 0.5

            self.c.setFillColorRGB(r, g, b)
            self.c.setFillAlpha(0.7)

            # Variable width based on sine wave
            width_factor = 0.5 + 0.5 * math.sin(i * 0.3)
            bar_width = (self.width - 2 * MARGIN) * width_factor

            x = MARGIN + (self.width - 2 * MARGIN - bar_width) / 2
            y = center_y + (i - num_bands/2) * (band_height + 2)

            self.c.rect(x, y, bar_width, band_height, fill=1, stroke=0)

        self.c.setFillAlpha(1)

        # Title above
        self.c.setFillColorRGB(1, 1, 1)
        self.c.setFont('InstrumentBold', 32)
        title_text = "SYNTHESIS"
        title_width = self.c.stringWidth(title_text, 'InstrumentBold', 32)
        self.c.drawString((self.width - title_width) / 2, self.height - 100, title_text)

        # Key insight
        self.c.setFont('Work', 11)
        insights = [
            "The convergence is inevitable, but the outcomes remain contested.",
            "Technology will amplify both opportunity and inequality.",
            "Human creativity persists as the essential variable.",
        ]

        y_pos = 180
        for insight in insights:
            self.c.setFillColorRGB(0.85, 0.85, 0.85)
            insight_width = self.c.stringWidth(insight, 'Work', 11)
            self.c.drawString((self.width - insight_width) / 2, y_pos, insight)
            y_pos -= 25

        # Bottom elements
        self.c.setFont('IBMMono', 7)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        bottom_text = "Neither purely flourishing nor failing — a complex coexistence"
        bt_width = self.c.stringWidth(bottom_text, 'IBMMono', 7)
        self.c.drawString((self.width - bt_width) / 2, 100, bottom_text)

        # Small waveforms at very bottom
        self.c.setStrokeColorRGB(0.3, 0.5, 0.8)
        self.draw_waveform(MARGIN, 60, (self.width - 2*MARGIN) / 3 - 10, 15, frequency=4, amplitude=6)

        self.c.setStrokeColorRGB(0.7, 0.4, 0.7)
        self.draw_waveform(self.width/2 - (self.width - 2*MARGIN) / 6, 60, (self.width - 2*MARGIN) / 3 - 10, 15, frequency=6, amplitude=6)

        self.c.setStrokeColorRGB(0.9, 0.5, 0.3)
        self.draw_waveform(self.width - MARGIN - (self.width - 2*MARGIN) / 3, 60, (self.width - 2*MARGIN) / 3 - 10, 15, frequency=5, amplitude=6)

        # Page number
        self.c.setFont('Jura', 8)
        self.c.setFillColorRGB(0.5, 0.5, 0.5)
        self.c.drawString(self.width - MARGIN - 20, MARGIN - 20, "05")

        self.c.showPage()

    def generate(self):
        """Generate all pages"""
        self.page_1_cover()
        self.page_2_flourish()
        self.page_3_friction()
        self.page_4_landscape()
        self.page_5_synthesis()
        self.c.save()
        print("PDF generated successfully!")


if __name__ == "__main__":
    pdf = SyntheticResonancePDF("AI_Music_2026.pdf")
    pdf.generate()
