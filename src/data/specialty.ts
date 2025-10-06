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