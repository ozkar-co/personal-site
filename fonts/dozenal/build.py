"""Build Dozenal, a tabular figures face.

Digits 0-9, the comma, the hyphen and the period share one advance
and one figure height. Dek is a chi and elv is an epsilon, drawn in
that same box so neither sinks under the line nor reads smaller than
a digit. U+0058 and U+0057 carry the same outlines, for text that
still spells dozenal with X and W.
"""

from __future__ import annotations

import math
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

UPM = 1000
WIDTH = 620
CAP = 700
STROKE = 74
HERE = Path(__file__).resolve().parent


def pen_for(draw) -> object:
    pen = TTGlyphPen(None)
    draw(pen)
    return pen.glyph()


def outline(pen, points) -> None:
    pen.moveTo(points[0])
    for point in points[1:]:
        pen.lineTo(point)
    pen.closePath()


def rect(pen, x, y, w, h) -> None:
    outline(pen, [(x, y), (x, y + h), (x + w, y + h), (x + w, y)])


def oval(pen, cx, cy, rx, ry, reverse=False) -> None:
    steps = (
        ((cx + rx, cy), (cx + rx, cy + ry), (cx, cy + ry)),
        ((cx, cy + ry), (cx - rx, cy + ry), (cx - rx, cy)),
        ((cx - rx, cy), (cx - rx, cy - ry), (cx, cy - ry)),
        ((cx, cy - ry), (cx + rx, cy - ry), (cx + rx, cy)),
    )
    if reverse:
        steps = tuple(
            (end, control, start) for start, control, end in reversed(steps)
        )
    pen.moveTo(steps[0][0])
    for _start, control, end in steps:
        pen.qCurveTo(control, end)
    pen.closePath()


def ring(pen, cx, cy, rx, ry, stroke) -> None:
    oval(pen, cx, cy, rx, ry, reverse=True)
    oval(pen, cx, cy, rx - stroke, ry - stroke)


def disc(pen, cx, cy, r) -> None:
    oval(pen, cx, cy, r, r, reverse=True)


def quad(p0, p1, p2, n=24):
    points = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        points.append((
            u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
            u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
        ))
    return points


def normals(points, width):
    half = width / 2
    left = []
    right = []
    for index, point in enumerate(points):
        if index == 0:
            direction = (points[1][0] - point[0], points[1][1] - point[1])
        elif index == len(points) - 1:
            direction = (point[0] - points[index - 1][0], point[1] - points[index - 1][1])
        else:
            before = (point[0] - points[index - 1][0], point[1] - points[index - 1][1])
            after = (points[index + 1][0] - point[0], points[index + 1][1] - point[1])
            direction = (before[0] + after[0], before[1] + after[1])
        length = math.hypot(*direction) or 1
        nx = -direction[1] / length * half
        ny = direction[0] / length * half
        left.append((point[0] + nx, point[1] + ny))
        right.append((point[0] - nx, point[1] - ny))
    return left + list(reversed(right))


def stroke(pen, points, width=STROKE) -> None:
    outline(pen, normals(points, width))


def curve(pen, anchors, width=STROKE) -> None:
    points = []
    for start, control, end in anchors:
        points.extend(quad(start, control, end)[:-1])
    points.append(anchors[-1][2])
    stroke(pen, points, width)


def zero(pen) -> None:
    ring(pen, 310, 350, 232, 366, STROKE)


def one(pen) -> None:
    rect(pen, 286, 0, STROKE, CAP)
    outline(pen, [(168, 548), (286, CAP), (360, CAP), (250, 500)])
    rect(pen, 176, 0, 280, STROKE)


def two(pen) -> None:
    curve(pen, [
        ((148, 470), (140, 700), (330, 690)),
        ((330, 690), (540, 678), (520, 470)),
    ])
    stroke(pen, [(490, 520), (168, 40)])
    rect(pen, 132, 0, 372, STROKE)


def three(pen) -> None:
    curve(pen, [
        ((150, 560), (150, 760), (340, 748)),
        ((340, 748), (560, 734), (470, 470)),
    ])
    curve(pen, [
        ((250, 390), (560, 430), (500, 180)),
        ((500, 180), (450, -20), (250, 16)),
        ((250, 16), (130, 40), (150, 160)),
    ])


def four(pen) -> None:
    rect(pen, 400, 0, STROKE, CAP)
    rect(pen, 120, 214, 390, STROKE)
    stroke(pen, [(148, 680), (450, 230)])


def five(pen) -> None:
    rect(pen, 148, CAP - STROKE, 330, STROKE)
    rect(pen, 148, 340, STROKE, CAP - 340)
    curve(pen, [
        ((200, 400), (560, 460), (500, 180)),
        ((500, 180), (450, -24), (240, 12)),
        ((240, 12), (120, 36), (148, 170)),
    ])


def six(pen) -> None:
    ring(pen, 310, 250, 214, 230, STROKE)
    curve(pen, [
        ((200, 460), (150, 700), (360, 690)),
        ((360, 690), (530, 670), (400, 430)),
    ])


def seven(pen) -> None:
    rect(pen, 140, CAP - STROKE, 360, STROKE)
    stroke(pen, [(450, 650), (200, 20)])


def eight(pen) -> None:
    ring(pen, 310, 512, 176, 188, 66)
    ring(pen, 310, 196, 196, 206, 66)


def nine(pen) -> None:
    ring(pen, 310, 450, 214, 230, STROKE)
    curve(pen, [
        ((420, 360), (520, 20), (260, 8)),
        ((260, 8), (90, 0), (140, 190)),
    ])


def comma(pen) -> None:
    disc(pen, 300, 150, 48)
    stroke(pen, [(300, 130), (250, -30), (236, -150)], 56)


def hyphen(pen) -> None:
    rect(pen, 150, 300, 320, STROKE)


def period(pen) -> None:
    disc(pen, 310, 70, 48)


def chi(pen) -> None:
    curve(pen, [((150, CAP), (500, 420), (470, 0))])
    curve(pen, [((150, 0), (120, 280), (470, CAP))])


def epsilon(pen) -> None:
    top = 716 - STROKE / 2
    bot = -16 + STROKE / 2
    grown = _Grow(pen, 1.08, 310, 350)
    curve(grown, [
        ((520, top), (90, top), (160, 350)),
        ((160, 350), (90, bot), (520, bot)),
    ])
    rect(grown, 190, 350 - STROKE / 2, 180, STROKE)


class _Grow:
    def __init__(self, pen, factor, cx, cy):
        self.pen = pen
        self.factor = factor
        self.cx = cx
        self.cy = cy

    def _point(self, point):
        return (
            self.cx + (point[0] - self.cx) * self.factor,
            self.cy + (point[1] - self.cy) * self.factor,
        )

    def moveTo(self, point):
        self.pen.moveTo(self._point(point))

    def lineTo(self, point):
        self.pen.lineTo(self._point(point))

    def qCurveTo(self, *points):
        self.pen.qCurveTo(*(self._point(point) for point in points))

    def closePath(self):
        self.pen.closePath()


DRAWS = {
    "zero": zero,
    "one": one,
    "two": two,
    "three": three,
    "four": four,
    "five": five,
    "six": six,
    "seven": seven,
    "eight": eight,
    "nine": nine,
    "comma": comma,
    "hyphen": hyphen,
    "period": period,
    "chi": chi,
    "epsilon": epsilon,
}


def build() -> None:
    order = [".notdef", *DRAWS]
    glyphs = {name: pen_for(draw) for name, draw in DRAWS.items()}
    blank = TTGlyphPen(None).glyph()
    glyphs[".notdef"] = blank
    mapping = {ord(ch): name for ch, name in zip("0123456789", list(DRAWS)[:10])}
    mapping.update({
        ord(","): "comma",
        ord("-"): "hyphen",
        ord("."): "period",
        0x03C7: "chi",
        0x03B5: "epsilon",
        ord("X"): "chi",
        ord("W"): "epsilon",
    })
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(mapping)
    fb.setupGlyf(glyphs)
    metrics = {}
    glyf = fb.font["glyf"]
    for name in order:
        xmin = getattr(glyf[name], "xMin", None)
        metrics[name] = (WIDTH, 0 if xmin is None else xmin)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=820, descent=-240)
    fb.setupNameTable({
        "copyright": "Copyright 2026 Ozkar",
        "familyName": "Dozenal",
        "styleName": "Regular",
        "uniqueFontIdentifier": "Ozkar: Dozenal Regular 1.000",
        "fullName": "Dozenal Regular",
        "version": "Version 1.000",
        "psName": "Dozenal-Regular",
        "designer": "Ozkar",
        "description": (
            "Tabular dozenal figures. Dek is chi and elv is epsilon, "
            "both on the figure line and at figure height."
        ),
        "licenseDescription": "Use and modify these outlines freely.",
    })
    fb.setupOS2(
        sTypoAscender=820,
        sTypoDescender=-240,
        sTypoLineGap=0,
        usWinAscent=820,
        usWinDescent=240,
        sxHeight=700,
        sCapHeight=700,
        version=4,
        fsSelection=0x40 | 0x80,
        usWeightClass=400,
    )
    fb.setupPost(underlinePosition=-120, underlineThickness=50)
    ttf = HERE / "Dozenal-Regular.ttf"
    fb.save(str(ttf))
    web = TTFont(ttf)
    web.flavor = "woff2"
    woff = HERE / "Dozenal-Regular.woff2"
    web.save(str(woff))
    static = HERE.parents[1] / "server" / "static" / "Dozenal-Regular.woff2"
    static.write_bytes(woff.read_bytes())
    print(f"{ttf} {ttf.stat().st_size}")
    print(f"{woff} {woff.stat().st_size}")


if __name__ == "__main__":
    build()
