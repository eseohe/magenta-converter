import type { UnitCategory, CustomCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const specialtyCategories: UnitCategory[] = [
  {
    id: "clothing-sizes",
    group: "Other",
    name: "Clothing & Shoe Sizes",
    description: "US, EU, UK, Asian sizes for clothing and shoes",
    icon: "Shirt",
    baseUnit: "us",
    units: [
      // Men's clothing sizes
      u("men-us-xs", "Men's XS (US)", "XS", 1),
      u("men-us-s", "Men's S (US)", "S", 2),
      u("men-us-m", "Men's M (US)", "M", 3),
      u("men-us-l", "Men's L (US)", "L", 4),
      u("men-us-xl", "Men's XL (US)", "XL", 5),
      u("men-us-xxl", "Men's XXL (US)", "XXL", 6),
      // Men's shoe sizes (US to EU conversion)
      u("men-shoe-us-7", "Men's Shoe US 7", "US 7", 7),
      u("men-shoe-us-8", "Men's Shoe US 8", "US 8", 8),
      u("men-shoe-us-9", "Men's Shoe US 9", "US 9", 9),
      u("men-shoe-us-10", "Men's Shoe US 10", "US 10", 10),
      u("men-shoe-us-11", "Men's Shoe US 11", "US 11", 11),
      u("men-shoe-us-12", "Men's Shoe US 12", "US 12", 12),
      // EU equivalents
      u("men-shoe-eu-40", "Men's Shoe EU 40", "EU 40", 7.5),
      u("men-shoe-eu-42", "Men's Shoe EU 42", "EU 42", 8.5),
      u("men-shoe-eu-43", "Men's Shoe EU 43", "EU 43", 9.5),
      u("men-shoe-eu-44", "Men's Shoe EU 44", "EU 44", 10.5),
      u("men-shoe-eu-45", "Men's Shoe EU 45", "EU 45", 11.5),
      u("men-shoe-eu-46", "Men's Shoe EU 46", "EU 46", 12.5),
    ],
    popularPairs: [["men-shoe-us-9","men-shoe-eu-43"],["men-us-m","men-us-l"],["men-shoe-us-10","men-shoe-eu-44"]],
  },
  {
    id: "bra-sizes",
    group: "Other",
    name: "Bra Sizes",
    description: "International bra sizing conversions: US, UK, EU, French systems",
    icon: "Heart",
    baseUnit: "us-band",
    units: [
      // Band Sizes - US/UK (inches)
      u("bra-us-28", "28 Band (US/UK)", "28", 28),
      u("bra-us-30", "30 Band (US/UK)", "30", 30),
      u("bra-us-32", "32 Band (US/UK)", "32", 32),
      u("bra-us-34", "34 Band (US/UK)", "34", 34),
      u("bra-us-36", "36 Band (US/UK)", "36", 36),
      u("bra-us-38", "38 Band (US/UK)", "38", 38),
      u("bra-us-40", "40 Band (US/UK)", "40", 40),
      u("bra-us-42", "42 Band (US/UK)", "42", 42),
      u("bra-us-44", "44 Band (US/UK)", "44", 44),
      u("bra-us-46", "46 Band (US/UK)", "46", 46),
      
      // Band Sizes - EU (centimeters)
      u("bra-eu-60", "60 Band (EU)", "60", 28.7), // 60cm ≈ 28"
      u("bra-eu-65", "65 Band (EU)", "65", 30.7), // 65cm ≈ 30"
      u("bra-eu-70", "70 Band (EU)", "70", 32.3), // 70cm ≈ 32"
      u("bra-eu-75", "75 Band (EU)", "75", 34.0), // 75cm ≈ 34"
      u("bra-eu-80", "80 Band (EU)", "80", 35.6), // 80cm ≈ 36"
      u("bra-eu-85", "85 Band (EU)", "85", 37.2), // 85cm ≈ 38"
      u("bra-eu-90", "90 Band (EU)", "90", 38.9), // 90cm ≈ 40"
      u("bra-eu-95", "95 Band (EU)", "95", 40.5), // 95cm ≈ 42"
      u("bra-eu-100", "100 Band (EU)", "100", 42.1), // 100cm ≈ 44"
      u("bra-eu-105", "105 Band (EU)", "105", 43.7), // 105cm ≈ 46"
      
      // Band Sizes - French (different system)
      u("bra-fr-75", "75 Band (FR)", "75", 28.0),
      u("bra-fr-80", "80 Band (FR)", "80", 30.0),
      u("bra-fr-85", "85 Band (FR)", "85", 32.0),
      u("bra-fr-90", "90 Band (FR)", "90", 34.0),
      u("bra-fr-95", "95 Band (FR)", "95", 36.0),
      u("bra-fr-100", "100 Band (FR)", "100", 38.0),
      u("bra-fr-105", "105 Band (FR)", "105", 40.0),
      u("bra-fr-110", "110 Band (FR)", "110", 42.0),
      u("bra-fr-115", "115 Band (FR)", "115", 44.0),
      u("bra-fr-120", "120 Band (FR)", "120", 46.0),
      
      // Cup Sizes - US System
      u("bra-cup-us-aa", "AA Cup (US)", "AA", 100),
      u("bra-cup-us-a", "A Cup (US)", "A", 101),
      u("bra-cup-us-b", "B Cup (US)", "B", 102),
      u("bra-cup-us-c", "C Cup (US)", "C", 103),
      u("bra-cup-us-d", "D Cup (US)", "D", 104),
      u("bra-cup-us-dd", "DD/E Cup (US)", "DD", 105),
      u("bra-cup-us-ddd", "DDD/F Cup (US)", "DDD", 106),
      u("bra-cup-us-g", "G Cup (US)", "G", 107),
      u("bra-cup-us-h", "H Cup (US)", "H", 108),
      u("bra-cup-us-i", "I Cup (US)", "I", 109),
      u("bra-cup-us-j", "J Cup (US)", "J", 110),
      u("bra-cup-us-k", "K Cup (US)", "K", 111),
      
      // Cup Sizes - UK System (differs after D)
      u("bra-cup-uk-aa", "AA Cup (UK)", "AA", 200),
      u("bra-cup-uk-a", "A Cup (UK)", "A", 201),
      u("bra-cup-uk-b", "B Cup (UK)", "B", 202),
      u("bra-cup-uk-c", "C Cup (UK)", "C", 203),
      u("bra-cup-uk-d", "D Cup (UK)", "D", 204),
      u("bra-cup-uk-dd", "DD Cup (UK)", "DD", 205),
      u("bra-cup-uk-e", "E Cup (UK)", "E", 206),
      u("bra-cup-uk-f", "F Cup (UK)", "F", 207),
      u("bra-cup-uk-ff", "FF Cup (UK)", "FF", 208),
      u("bra-cup-uk-g", "G Cup (UK)", "G", 209),
      u("bra-cup-uk-gg", "GG Cup (UK)", "GG", 210),
      u("bra-cup-uk-h", "H Cup (UK)", "H", 211),
      u("bra-cup-uk-hh", "HH Cup (UK)", "HH", 212),
      u("bra-cup-uk-j", "J Cup (UK)", "J", 213),
      u("bra-cup-uk-jj", "JJ Cup (UK)", "JJ", 214),
      u("bra-cup-uk-k", "K Cup (UK)", "K", 215),
      
      // Cup Sizes - EU System
      u("bra-cup-eu-aa", "AA Cup (EU)", "AA", 300),
      u("bra-cup-eu-a", "A Cup (EU)", "A", 301),
      u("bra-cup-eu-b", "B Cup (EU)", "B", 302),
      u("bra-cup-eu-c", "C Cup (EU)", "C", 303),
      u("bra-cup-eu-d", "D Cup (EU)", "D", 304),
      u("bra-cup-eu-e", "E Cup (EU)", "E", 305),
      u("bra-cup-eu-f", "F Cup (EU)", "F", 306),
      u("bra-cup-eu-g", "G Cup (EU)", "G", 307),
      u("bra-cup-eu-h", "H Cup (EU)", "H", 308),
      u("bra-cup-eu-i", "I Cup (EU)", "I", 309),
      u("bra-cup-eu-j", "J Cup (EU)", "J", 310),
      u("bra-cup-eu-k", "K Cup (EU)", "K", 311),
      
      // Cup Sizes - French System
      u("bra-cup-fr-a", "A Cup (FR)", "A", 401),
      u("bra-cup-fr-b", "B Cup (FR)", "B", 402),
      u("bra-cup-fr-c", "C Cup (FR)", "C", 403),
      u("bra-cup-fr-d", "D Cup (FR)", "D", 404),
      u("bra-cup-fr-e", "E Cup (FR)", "E", 405),
      u("bra-cup-fr-f", "F Cup (FR)", "F", 406),
      u("bra-cup-fr-g", "G Cup (FR)", "G", 407),
      u("bra-cup-fr-h", "H Cup (FR)", "H", 408),
    ],
    popularPairs: [["bra-us-34","bra-eu-75"],["bra-us-36","bra-eu-80"],["bra-us-32","bra-fr-85"],["bra-cup-us-c","bra-cup-uk-c"],["bra-cup-us-dd","bra-cup-uk-dd"],["bra-cup-us-ddd","bra-cup-uk-e"],["bra-us-38","bra-eu-85"],["bra-cup-us-d","bra-cup-eu-d"]],
  },
  {
    id: "paper-sizes",
    group: "Other",
    name: "Paper Sizes",
    description: "A-series, US Letter/Legal, photo sizes",
    icon: "FileText",
    baseUnit: "mm2",
    units: [
      // A-series (ISO 216)
      u("a0", "A0", "A0", 841 * 1189),
      u("a1", "A1", "A1", 594 * 841),
      u("a2", "A2", "A2", 420 * 594),
      u("a3", "A3", "A3", 297 * 420),
      u("a4", "A4", "A4", 210 * 297),
      u("a5", "A5", "A5", 148 * 210),
      u("a6", "A6", "A6", 105 * 148),
      // US sizes
      u("letter", "US Letter", "Letter", 215.9 * 279.4),
      u("legal", "US Legal", "Legal", 215.9 * 355.6),
      u("tabloid", "US Tabloid", "Tabloid", 279.4 * 431.8),
      u("executive", "US Executive", "Executive", 184.15 * 266.7),
      // Photo sizes (in mm)
      u("photo-4x6", "4×6 inch", "4×6\"", 101.6 * 152.4),
      u("photo-5x7", "5×7 inch", "5×7\"", 127 * 177.8),
      u("photo-8x10", "8×10 inch", "8×10\"", 203.2 * 254),
      u("photo-11x14", "11×14 inch", "11×14\"", 279.4 * 355.6),
    ],
    popularPairs: [["a4","letter"],["a3","tabloid"],["photo-4x6","photo-5x7"]],
  },
  {
    id: "typography",
    group: "Other",
    name: "Typography Units",
    description: "Points, pixels, ems, rems, DPI conversions",
    icon: "Type",
    baseUnit: "px",
    units: [
      // Base pixel unit
      u("px", "Pixel", "px", 1),
      // Points (1pt = 1/72 inch, at 96 DPI: 1pt = 1.333px)
      u("pt", "Point", "pt", 1.333333),
      u("pc", "Pica", "pc", 16), // 1 pica = 12 points
      // Relative units (assuming 16px base font size)
      u("em", "Em (16px base)", "em", 16),
      u("rem", "Rem (16px base)", "rem", 16),
      // Percentage (100% = 16px)
      u("percent", "Percent (16px base)", "%", 0.16),
      // Different DPI contexts
      u("px-72dpi", "Pixel (72 DPI)", "px@72", 0.75), // 72/96
      u("px-300dpi", "Pixel (300 DPI)", "px@300", 3.125), // 300/96
      // CSS viewport units (assuming 1920px width)
      u("vw", "Viewport width (1920px)", "vw", 19.2), // 1vw = 1920px/100
    ],
    popularPairs: [["pt","px"],["em","px"],["rem","px"],["pc","pt"]],
  },
  {
    id: "photography",
    group: "Other",
    name: "Photography",
    description: "F-stops, ISO, focal length, exposure values",
    icon: "Camera",
    baseUnit: "fstop",
    units: [
      // F-stops (aperture values)
      u("f1", "f/1.0", "f/1", 1),
      u("f1.4", "f/1.4", "f/1.4", 1.4),
      u("f2", "f/2.0", "f/2", 2),
      u("f2.8", "f/2.8", "f/2.8", 2.8),
      u("f4", "f/4.0", "f/4", 4),
      u("f5.6", "f/5.6", "f/5.6", 5.6),
      u("f8", "f/8.0", "f/8", 8),
      u("f11", "f/11", "f/11", 11),
      u("f16", "f/16", "f/16", 16),
      u("f22", "f/22", "f/22", 22),
      // ISO values (light sensitivity)
      u("iso100", "ISO 100", "ISO 100", 100),
      u("iso200", "ISO 200", "ISO 200", 200),
      u("iso400", "ISO 400", "ISO 400", 400),
      u("iso800", "ISO 800", "ISO 800", 800),
      u("iso1600", "ISO 1600", "ISO 1600", 1600),
      u("iso3200", "ISO 3200", "ISO 3200", 3200),
      u("iso6400", "ISO 6400", "ISO 6400", 6400),
    ],
    popularPairs: [["f2.8","f5.6"],["iso400","iso800"],["f4","f8"]],
  },
];

export const specialtyCustomCategories: CustomCategory[] = [
  { id: "numbers", group: "Other", name: "Number Bases", description: "Binary, octal, decimal, hex + any base (2–36)", icon: "Hash", custom: true },
  { id: "colors", group: "Other", name: "Color Codes", description: "HEX, RGB, HSL, CMYK color conversions", icon: "Palette", custom: true },
  { id: "timezones", group: "Other", name: "Time Zones", description: "World time zones and UTC offset conversions", icon: "Globe2", custom: true },
];