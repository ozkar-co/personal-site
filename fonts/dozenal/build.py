"""Build Dozenal from the Inkscape sheets.

Each figure and each sign has an SVG. Draw on the layer dibujo, with
black fill and no stroke, then run this file. That layer replaces the
outline kept here. An empty dibujo layer leaves the outline in this
file. Digits, chi, epsilon, comma, hyphen and period share one advance
and one figure height. The fourteen signs, Cetus and Ophiuchus
included, live at U+E000 in lunato order from the winter solstice.
"""

from __future__ import annotations

import math
import re
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.misc import etree
from fontTools.misc.transform import Transform
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import SVGPath
from fontTools.ttLib import TTFont

UPM = 1000
WIDTH = 620
CAP = 700
STROKE = 74
ASCENT = 820
DESCENT = 240
HERE = Path(__file__).resolve().parent
INKSCAPE = "http://www.inkscape.org/namespaces/inkscape"
SVGNS = "http://www.w3.org/2000/svg"
DRAWABLE = {"path", "rect", "circle", "ellipse", "polygon", "polyline", "line"}


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
    left = 148
    stem = 392
    bar = 248
    rect(pen, stem, 0, STROKE, CAP)
    rect(pen, left, bar, stem + STROKE - left, STROKE)
    rect(pen, left, bar, STROKE, CAP - bar)


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


def aries(pen) -> None:
    curve(pen, [((310, 70), (70, 220), (168, 560))])
    curve(pen, [((168, 560), (150, 700), (250, 620))])
    curve(pen, [((310, 70), (550, 220), (452, 560))])
    curve(pen, [((452, 560), (470, 700), (370, 620))])


def taurus(pen) -> None:
    ring(pen, 310, 280, 168, 168, STROKE)
    curve(pen, [((210, 420), (120, 600), (230, 660))])
    curve(pen, [((410, 420), (500, 600), (390, 660))])


def gemini(pen) -> None:
    rect(pen, 150, 40, STROKE, 620)
    rect(pen, 396, 40, STROKE, 620)
    rect(pen, 150, 40, 150, STROKE)
    rect(pen, 320, 40, 150, STROKE)
    rect(pen, 150, 586, 150, STROKE)
    rect(pen, 320, 586, 150, STROKE)


def cancer(pen) -> None:
    ring(pen, 228, 468, 118, 118, 62)
    ring(pen, 392, 232, 118, 118, 62)


def leo(pen) -> None:
    ring(pen, 236, 470, 128, 128, 64)
    curve(pen, [
        ((350, 420), (540, 380), (470, 170)),
        ((470, 170), (420, 30), (290, 90)),
    ])


def virgo(pen) -> None:
    rect(pen, 168, 40, STROKE, 640)
    ring(pen, 392, 430, 128, 156, 64)


def libra(pen) -> None:
    rect(pen, 120, 236, 380, STROKE)
    curve(pen, [((156, 310), (310, 700), (464, 310))])


def scorpio(pen) -> None:
    curve(pen, [
        ((150, 80), (150, 360), (300, 470)),
        ((300, 470), (470, 590), (470, 300)),
    ])
    stroke(pen, [(360, 430), (500, 300)])
    stroke(pen, [(390, 250), (500, 300)])


def ophiuchus(pen) -> None:
    rect(pen, 310 - STROKE / 2, 36, STROKE, 640)
    curve(pen, [
        ((110, 180), (210, 340), (310, 250)),
        ((310, 250), (430, 150), (510, 300)),
        ((510, 300), (420, 470), (310, 390)),
        ((310, 390), (190, 300), (130, 520)),
    ])


def sagittarius(pen) -> None:
    stroke(pen, [(120, 90), (470, 620)])
    stroke(pen, [(330, 540), (500, 660)])
    stroke(pen, [(390, 470), (500, 660)])
    stroke(pen, [(160, 220), (250, 90)])


def capricorn(pen) -> None:
    curve(pen, [
        ((150, 620), (150, 280), (330, 300)),
        ((330, 300), (530, 320), (480, 140)),
        ((480, 140), (440, 20), (330, 90)),
        ((330, 90), (270, 160), (360, 190)),
    ])


def aquarius(pen) -> None:
    curve(pen, [
        ((100, 470), (200, 640), (310, 470)),
        ((310, 470), (420, 300), (520, 470)),
    ])
    curve(pen, [
        ((100, 250), (200, 420), (310, 250)),
        ((310, 250), (420, 80), (520, 250)),
    ])


def pisces(pen) -> None:
    curve(pen, [((190, 70), (70, 350), (190, 630))])
    curve(pen, [((430, 70), (550, 350), (430, 630))])
    rect(pen, 150, 350 - STROKE / 2, 320, STROKE)


def cetus(pen) -> None:
    ring(pen, 230, 350, 145, 108, 64)
    stroke(pen, [(400, 360), (545, 530)])
    stroke(pen, [(400, 340), (545, 170)])


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
    "aries": aries,
    "taurus": taurus,
    "gemini": gemini,
    "cancer": cancer,
    "leo": leo,
    "virgo": virgo,
    "libra": libra,
    "scorpio": scorpio,
    "ophiuchus": ophiuchus,
    "sagittarius": sagittarius,
    "capricorn": capricorn,
    "aquarius": aquarius,
    "pisces": pisces,
    "cetus": cetus,
}

# Private Use, in lunato order from the winter solstice.
SIGNS = {
    0xE000: "sagittarius",
    0xE001: "capricorn",
    0xE002: "aquarius",
    0xE003: "pisces",
    0xE004: "aries",
    0xE005: "cetus",
    0xE006: "taurus",
    0xE007: "gemini",
    0xE008: "cancer",
    0xE009: "leo",
    0xE00A: "virgo",
    0xE00B: "libra",
    0xE00C: "scorpio",
    0xE00D: "ophiuchus",
}

SHEETS = {
    "zero": HERE / "cifras" / "0.svg",
    "one": HERE / "cifras" / "1.svg",
    "two": HERE / "cifras" / "2.svg",
    "three": HERE / "cifras" / "3.svg",
    "four": HERE / "cifras" / "4.svg",
    "five": HERE / "cifras" / "5.svg",
    "six": HERE / "cifras" / "6.svg",
    "seven": HERE / "cifras" / "7.svg",
    "eight": HERE / "cifras" / "8.svg",
    "nine": HERE / "cifras" / "9.svg",
    "comma": HERE / "cifras" / "coma.svg",
    "hyphen": HERE / "cifras" / "guion.svg",
    "period": HERE / "cifras" / "punto.svg",
    "chi": HERE / "cifras" / "chi.svg",
    "epsilon": HERE / "cifras" / "epsilon.svg",
    "sagittarius": HERE / "signs" / "sagitario.svg",
    "capricorn": HERE / "signs" / "capricornio.svg",
    "aquarius": HERE / "signs" / "acuario.svg",
    "pisces": HERE / "signs" / "piscis.svg",
    "aries": HERE / "signs" / "aries.svg",
    "cetus": HERE / "signs" / "cetus.svg",
    "taurus": HERE / "signs" / "tauro.svg",
    "gemini": HERE / "signs" / "geminis.svg",
    "cancer": HERE / "signs" / "cancer.svg",
    "leo": HERE / "signs" / "leo.svg",
    "virgo": HERE / "signs" / "virgo.svg",
    "libra": HERE / "signs" / "libra.svg",
    "scorpio": HERE / "signs" / "escorpio.svg",
    "ophiuchus": HERE / "signs" / "ofiuco.svg",
}


def _sheet_transform(raw: str | None) -> Transform:
    if not raw:
        return Transform()
    total = Transform()
    found = re.findall(r"(matrix|translate|scale|rotate)\s*\(([^)]*)\)", raw)
    if not found:
        raise ValueError(raw)
    for kind, args in found:
        nums = [float(n) for n in re.split(r"[\s,]+", args.strip()) if n]
        if kind == "matrix":
            local = Transform(*nums)
        elif kind == "translate":
            local = Transform(1, 0, 0, 1, nums[0], nums[1] if len(nums) > 1 else 0)
        elif kind == "scale":
            sx = nums[0]
            sy = nums[1] if len(nums) > 1 else sx
            local = Transform(sx, 0, 0, sy, 0, 0)
        else:
            angle = math.radians(nums[0])
            rot = Transform(math.cos(angle), math.sin(angle), -math.sin(angle), math.cos(angle), 0, 0)
            if len(nums) == 3:
                cx, cy = nums[1], nums[2]
                local = Transform(1, 0, 0, 1, cx, cy).transform(rot).transform(Transform(1, 0, 0, 1, -cx, -cy))
            else:
                local = rot
        total = total.transform(local)
    return total


def _matrix_attr(transform: Transform) -> str:
    values = " ".join(f"{n:.4f}".rstrip("0").rstrip(".") for n in transform)
    return f"matrix({values})"


def glyph_from_svg(path: Path):
    root = etree.parse(path).getroot()
    layer = None
    for el in root.iter():
        if el.get(f"{{{INKSCAPE}}}label") == "dibujo":
            layer = el
            break
    if layer is None:
        return None
    drawn = []

    def walk(el, parent: Transform) -> None:
        local = _sheet_transform(el.get("transform"))
        absolute = parent.transform(local)
        tag = etree.QName(el).localname
        if tag in DRAWABLE and el.get("fill") != "none":
            clone = etree.fromstring(etree.tostring(el))
            clone.attrib.pop("transform", None)
            if absolute != Transform():
                clone.set("transform", _matrix_attr(absolute))
            drawn.append(clone)
        for child in el:
            walk(child, absolute)

    walk(layer, Transform())
    if not drawn:
        return None
    wrapper = etree.Element(f"{{{SVGNS}}}svg")
    for el in drawn:
        wrapper.append(el)
    pen = TTGlyphPen(None)
    curves = Cu2QuPen(pen, max_err=1.0, reverse_direction=False)
    SVGPath.fromstring(
        etree.tostring(wrapper),
        transform=(1, 0, 0, -1, 0, ASCENT),
    ).draw(curves)
    glyph = pen.glyph()
    if not glyph.numberOfContours:
        return None
    return glyph


def build() -> None:
    order = [".notdef", *DRAWS]
    glyphs = {}
    from_sheet = []
    for name, draw in DRAWS.items():
        sheet = SHEETS.get(name)
        loaded = glyph_from_svg(sheet) if sheet and sheet.exists() else None
        if loaded is None:
            glyphs[name] = pen_for(draw)
        else:
            glyphs[name] = loaded
            from_sheet.append(sheet.stem)
    print("svg:", " ".join(from_sheet) if from_sheet else "ninguno")
    blank = TTGlyphPen(None).glyph()
    glyphs[".notdef"] = blank
    mapping = {ord(ch): name for ch, name in zip("0123456789", list(DRAWS)[:10])}
    mapping.update({
        ord(","): "comma",
        ord("-"): "hyphen",
        ord("."): "period",
        0x03C7: "chi",
        0x03A7: "chi",
        0x03B5: "epsilon",
        0x0395: "epsilon",
        ord("X"): "chi",
        ord("W"): "epsilon",
        **SIGNS,
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
            "Tabular dozenal figures. Dek is chi and elv is epsilon. "
            "Signs U+E000 to U+E00D follow the lunato from Sagittarius."
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
