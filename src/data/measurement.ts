import type { UnitCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const measurementCategories: UnitCategory[] = [
  {
    id: "length",
    group: "Measurement",
    name: "Length / Distance",
    description: "Meters, miles, inches, nautical miles and more",
    icon: "Ruler",
    baseUnit: "m",
    units: [
      u("nm", "Nanometer", "nm", 1e-9),
      u("um", "Micrometer", "µm", 1e-6),
      u("mm", "Millimeter", "mm", 1e-3),
      u("cm", "Centimeter", "cm", 1e-2),
      u("m", "Meter", "m", 1),
      u("km", "Kilometer", "km", 1e3),
      u("in", "Inch", "in", 0.0254),
      u("ft", "Foot", "ft", 0.3048),
      u("yd", "Yard", "yd", 0.9144),
      u("mi", "Mile", "mi", 1609.344),
      u("nmi", "Nautical mile", "nmi", 1852),
      // Ancient units
      u("cubit", "Cubit (ancient)", "cubit", 0.4572), // 18 inches
      u("fathom", "Fathom", "fathom", 1.8288), // 6 feet
      u("league", "League", "league", 4828.032), // 3 miles
      u("furlong", "Furlong", "furlong", 201.168), // 1/8 mile
      u("rod", "Rod (perch)", "rod", 5.0292), // 16.5 feet
      // Astronomical distances
      u("au", "Astronomical Unit", "AU", 1.495978707e11), // ~150 million km
      u("ly", "Light-year", "ly", 9.4607304725808e15), // ~9.5 trillion km
      u("pc", "Parsec", "pc", 3.0856775814913673e16), // ~3.26 light-years
    ],
    popularPairs: [["km","mi"],["cm","in"],["m","ft"],["nmi","km"],["au","ly"],["cubit","m"]],
  },
  {
    id: "mass",
    group: "Measurement",
    name: "Mass / Weight",
    description: "Grams, kilograms, pounds, ounces, stones",
    icon: "Weight",
    baseUnit: "kg",
    units: [
      u("µg", "Microgram", "µg", 1e-9),
      u("mg", "Milligram", "mg", 1e-6),
      u("g", "Gram", "g", 1e-3),
      u("kg", "Kilogram", "kg", 1),
      u("t", "Metric ton", "t", 1000),
      u("oz", "Ounce", "oz", 0.0283495),
      u("lb", "Pound", "lb", 0.453592),
      u("st", "Stone", "st", 6.35029),
      u("cwt", "Hundredweight (US)", "cwt", 45.3592),
      u("ton-us", "Short ton (US)", "ton", 907.185),
      u("ton-uk", "Long ton (UK)", "ton", 1016.05),
    ],
    popularPairs: [["kg","lb"],["g","oz"],["t","ton-us"]],
  },
  {
    id: "temperature",
    group: "Measurement",
    name: "Temperature",
    description: "Celsius, Fahrenheit, Kelvin and more scales",
    icon: "Thermometer",
    baseUnit: "K",
    units: [
      { id: "C", label: "Celsius", symbol: "°C", toBase: (x) => x + 273.15, fromBase: (x) => x - 273.15 },
      { id: "F", label: "Fahrenheit", symbol: "°F", toBase: (x) => (x - 32) * 5/9 + 273.15, fromBase: (x) => (x - 273.15) * 9/5 + 32 },
      { id: "K", label: "Kelvin", symbol: "K", toBase: (x) => x, fromBase: (x) => x },
      { id: "R", label: "Rankine", symbol: "°R", toBase: (x) => x * 5/9, fromBase: (x) => x * 9/5 },
      // Historical temperature scales
      { id: "De", label: "Delisle", symbol: "°De", toBase: (x) => 373.15 - x * 2/3, fromBase: (x) => (373.15 - x) * 3/2 },
      { id: "Re", label: "Réaumur", symbol: "°Ré", toBase: (x) => x * 5/4 + 273.15, fromBase: (x) => (x - 273.15) * 4/5 },
      { id: "N", label: "Newton", symbol: "°N", toBase: (x) => x * 100/33 + 273.15, fromBase: (x) => (x - 273.15) * 33/100 },
      { id: "Ro", label: "Rømer", symbol: "°Rø", toBase: (x) => (x - 7.5) * 40/21 + 273.15, fromBase: (x) => (x - 273.15) * 21/40 + 7.5 },
      // Reference temperatures
      { id: "abs-zero", label: "Absolute Zero", symbol: "0K", toBase: (x) => 0, fromBase: (x) => 0 },
      { id: "water-freeze", label: "Water Freezing Point", symbol: "H₂O freeze", toBase: (x) => 273.15, fromBase: (x) => 273.15 },
      { id: "water-boil", label: "Water Boiling Point", symbol: "H₂O boil", toBase: (x) => 373.15, fromBase: (x) => 373.15 },
      { id: "body-temp", label: "Human Body Temperature", symbol: "Body", toBase: (x) => 310.15, fromBase: (x) => 310.15 },
      { id: "room-temp", label: "Room Temperature", symbol: "Room", toBase: (x) => 293.15, fromBase: (x) => 293.15 },
    ],
    popularPairs: [["C","F"],["F","C"],["K","C"],["C","K"],["F","K"]],
  },
  {
    id: "volume",
    group: "Measurement",
    name: "Volume / Capacity",
    description: "Liters, gallons, cups, milliliters and more",
    icon: "Beaker",
    baseUnit: "L",
    units: [
      // Metric volume units
      u("µL", "Microliter", "µL", 1e-6),
      u("mL", "Milliliter", "mL", 1e-3),
      u("cL", "Centiliter", "cL", 1e-2),
      u("dL", "Deciliter", "dL", 1e-1),
      u("L", "Liter", "L", 1),
      u("daL", "Decaliter", "daL", 10),
      u("hL", "Hectoliter", "hL", 100),
      u("kL", "Kiloliter", "kL", 1000),
      
      // Cubic measurements
      u("mm³", "Cubic millimeter", "mm³", 1e-6),
      u("cm³", "Cubic centimeter", "cm³", 1e-3),
      u("dm³", "Cubic decimeter", "dm³", 1),
      u("m³", "Cubic meter", "m³", 1000),
      u("km³", "Cubic kilometer", "km³", 1e12),
      
      // Imperial liquid units (US)
      u("fl-oz-us", "Fluid ounce (US)", "fl oz", 0.0295735),
      u("cup-us", "Cup (US)", "cup", 0.236588),
      u("pt-us", "Pint (US)", "pt", 0.473176),
      u("qt-us", "Quart (US)", "qt", 0.946353),
      u("gal-us", "Gallon (US)", "gal", 3.78541),
      
      // Imperial liquid units (UK)
      u("fl-oz-uk", "Fluid ounce (UK)", "fl oz", 0.0284131),
      u("cup-uk", "Cup (UK)", "cup", 0.284131),
      u("pt-uk", "Pint (UK)", "pt", 0.568261),
      u("qt-uk", "Quart (UK)", "qt", 1.13652),
      u("gal-uk", "Gallon (UK)", "gal", 4.54609),
      
      // Imperial cubic units
      u("in³", "Cubic inch", "in³", 0.0163871),
      u("ft³", "Cubic foot", "ft³", 28.3168),
      u("yd³", "Cubic yard", "yd³", 764.555),
      
      // Cooking measurements
      u("tsp", "Teaspoon", "tsp", 0.00492892),
      u("tbsp", "Tablespoon", "tbsp", 0.0147868),
      
      // Scientific measurements
      u("drop", "Drop", "drop", 5e-5),
      
      // Wine and spirits
      u("wine-bottle", "Wine bottle (750ml)", "bottle", 0.75),
      u("champagne", "Champagne bottle", "bottle", 0.75),
      u("magnum", "Magnum (wine)", "magnum", 1.5),
      
      // Beer measurements
      u("beer-bottle", "Beer bottle", "bottle", 0.355),
      u("beer-can", "Beer can", "can", 0.355),
      u("pint-beer-us", "Beer pint (US)", "pint", 0.473176),
      u("pint-beer-uk", "Beer pint (UK)", "pint", 0.568261),
      
      // Oil industry
      u("barrel-oil", "Oil barrel", "bbl", 158.987),
      u("barrel-us", "Barrel (US dry)", "bbl", 115.627),
      u("barrel-uk", "Barrel (UK)", "bbl", 163.659),
      
      // Large volumes
      u("acre-ft", "Acre-foot", "ac⋅ft", 1233481.8),
      
      // Historical units
      u("amphora", "Amphora (Roman)", "amphora", 26.026),
      u("firkin", "Firkin", "firkin", 40.9148),
      u("hogshead", "Hogshead", "hogshead", 238.481),
      
      // Metric cooking
      u("metric-cup", "Metric cup", "cup", 0.25),
      
      // Small scientific volumes
      u("nL", "Nanoliter", "nL", 1e-9),
      u("pL", "Picoliter", "pL", 1e-12),
      u("fL", "Femtoliter", "fL", 1e-15),
      
      // Alternative names
      u("cc", "Cubic centimeter (cc)", "cc", 1e-3), // same as cm³
      u("litre", "Litre (alternative)", "l", 1), // same as L
    ],
    popularPairs: [["L","gal-us"],["mL","fl-oz-us"],["cup-us","mL"],["L","gal-uk"],["m³","ft³"],["tsp","mL"]],
  },
  {
    id: "area",
    group: "Measurement",
    name: "Area",
    description: "Square meters, acres, hectares and more",
    icon: "Square",
    baseUnit: "m²",
    units: [
      // Metric area units
      u("mm²", "Square millimeter", "mm²", 1e-6),
      u("cm²", "Square centimeter", "cm²", 1e-4),
      u("dm²", "Square decimeter", "dm²", 1e-2),
      u("m²", "Square meter", "m²", 1),
      u("dam²", "Square decameter", "dam²", 100),
      u("hm²", "Square hectometer", "hm²", 10000),
      u("km²", "Square kilometer", "km²", 1e6),
      
      // Hectares and ares
      u("mm²", "Square millimeter", "mm²", 1e-6),
      u("a", "Are", "a", 100),
      u("ha", "Hectare", "ha", 10000),
      
      // Imperial/US area units
      u("in²", "Square inch", "in²", 0.00064516),
      u("ft²", "Square foot", "ft²", 0.092903),
      u("yd²", "Square yard", "yd²", 0.836127),
      u("ac", "Acre", "ac", 4046.86),
      u("mi²", "Square mile", "mi²", 2.58999e6),
      
      // Survey units
      u("rod²", "Square rod", "rod²", 25.2929),
      u("rood", "Rood", "rood", 1011.71),
      u("perch²", "Square perch", "perch²", 25.2929), // same as rod²
      
      // Large areas
      u("twp", "Township (US)", "twp", 9.32419e7), // 36 square miles
      u("section", "Section (US)", "section", 2.58999e6), // 1 square mile
      
      // Historical units
      u("hide", "Hide (English)", "hide", 485623), // ~120 acres
      u("virgate", "Virgate", "virgate", 121406), // ~30 acres
      u("oxgang", "Oxgang", "oxgang", 60703), // ~15 acres
      
      // International units
      u("dunam", "Dunam", "dunam", 1000), // Middle Eastern
      u("rai", "Rai (Thai)", "rai", 1600), // Thai unit
      u("ping", "Ping (Taiwan)", "ping", 3.30579), // Taiwanese unit
      u("tsubo", "Tsubo (Japanese)", "tsubo", 3.30579), // Japanese unit
      
      // Scientific units
      u("b", "Barn (nuclear)", "b", 1e-28), // Nuclear cross-section
      u("shed", "Shed (nuclear)", "shed", 1e-52), // Smaller nuclear unit
      
      // Construction/Real estate
      u("sq-ft", "Square feet (construction)", "sq ft", 0.092903), // same as ft²
      u("sq-m", "Square meters", "sq m", 1), // same as m²
      
      // Fabric/textile units
      u("fabric-yd²", "Fabric square yard", "yd²", 0.836127), // same as yd²
      
      // Agricultural units
      u("morgen", "Morgen (South African)", "morgen", 8565.3), // ~2.11 acres
      u("jerib", "Jerib (Middle Eastern)", "jerib", 1952), // Persian unit
      
      // Small precision areas
      u("µm²", "Square micrometer", "µm²", 1e-12),
      u("nm²", "Square nanometer", "nm²", 1e-18),
      
      // Alternative notations
      u("ha-metric", "Hectare (metric)", "ha", 10000), // same as ha
      u("acre-us", "US Survey acre", "ac", 4046.87), // slightly different from international acre
    ],
    popularPairs: [["m²","ft²"],["ha","ac"],["km²","mi²"],["cm²","in²"],["ac","ha"],["a","m²"]],
  },
  {
    id: "time",
    group: "Measurement", 
    name: "Time",
    description: "Seconds, minutes, hours, days, years",
    icon: "Clock",
    baseUnit: "s",
    units: [
      u("ns", "Nanosecond", "ns", 1e-9),
      u("µs", "Microsecond", "µs", 1e-6),
      u("ms", "Millisecond", "ms", 1e-3),
      u("s", "Second", "s", 1),
      u("min", "Minute", "min", 60),
      u("h", "Hour", "h", 3600),
      u("d", "Day", "d", 86400),
      u("wk", "Week", "wk", 604800),
      u("mo", "Month (30 days)", "mo", 2592000),
      u("yr", "Year (365 days)", "yr", 31536000),
      u("decade", "Decade", "decade", 315360000),
      u("century", "Century", "century", 3153600000),
      u("millennium", "Millennium", "millennium", 31536000000),
    ],
    popularPairs: [["h","min"],["d","h"],["yr","d"],["ms","s"]],
  },
  {
    id: "cooking-enhanced",
    group: "Measurement",
    name: "Cooking Measurements", 
    description: "Cups, tablespoons, teaspoons, ounces for cooking",
    icon: "ChefHat",
    baseUnit: "mL",
    units: [
      // US cooking measurements
      u("tsp-us", "Teaspoon (US)", "tsp", 4.92892),
      u("tbsp-us", "Tablespoon (US)", "tbsp", 14.7868),
      u("fl-oz-us-cook", "Fluid ounce (US)", "fl oz", 29.5735),
      u("cup-us-cook", "Cup (US)", "cup", 236.588),
      u("pt-us-cook", "Pint (US)", "pt", 473.176),
      u("qt-us-cook", "Quart (US)", "qt", 946.353),
      u("gal-us-cook", "Gallon (US)", "gal", 3785.41),
      // UK/Imperial cooking measurements  
      u("tsp-uk", "Teaspoon (UK)", "tsp", 5.91939),
      u("tbsp-uk", "Tablespoon (UK)", "tbsp", 17.7582),
      u("fl-oz-uk-cook", "Fluid ounce (UK)", "fl oz", 28.4131),
      u("cup-uk-cook", "Cup (UK)", "cup", 284.131),
      u("pt-uk-cook", "Pint (UK)", "pt", 568.261),
      // Metric cooking measurements
      u("mL-cook", "Milliliter", "mL", 1),
      u("L-cook", "Liter", "L", 1000),
      u("metric-tsp", "Metric teaspoon", "tsp", 5),
      u("metric-tbsp", "Metric tablespoon", "tbsp", 15),
      u("metric-cup", "Metric cup", "cup", 250),
      // Weight-based cooking (approximate)
      u("oz-weight", "Ounce (weight)", "oz", 28.3495), // grams converted to mL (water equivalent)
      u("lb-weight", "Pound (weight)", "lb", 453.592), // grams converted to mL (water equivalent)
      u("g-weight", "Gram (weight)", "g", 1), // water equivalent in mL
      u("kg-weight", "Kilogram (weight)", "kg", 1000), // water equivalent in mL
      // Specialty measurements
      u("drop-cook", "Drop", "drop", 0.05),
      u("dash", "Dash", "dash", 0.62),
      u("pinch", "Pinch", "pinch", 0.31),
      u("smidgen", "Smidgen", "smidgen", 0.15),
      // Wine and spirits
      u("jigger", "Jigger", "jigger", 44.36),
      u("shot-us", "Shot (US)", "shot", 44.36),
      u("shot-uk", "Shot (UK)", "shot", 25),
    ],
    popularPairs: [["cup-us-cook","mL-cook"],["tbsp-us","tsp-us"],["fl-oz-us-cook","mL-cook"],["metric-cup","cup-us-cook"]],
  },
  {
    id: "jewelry-metals",
    group: "Measurement",
    name: "Jewelry & Precious Metals",
    description: "Carats, troy ounces, pennyweights for precious metals", 
    icon: "Gem",
    baseUnit: "g",
    units: [
      // Precious metal weights
      u("tr-oz", "Troy ounce", "oz t", 31.1035),
      u("tr-lb", "Troy pound", "lb t", 373.242),
      u("dwt", "Pennyweight", "dwt", 1.55517),
      u("gr", "Grain", "gr", 0.0647989),
      u("ct", "Carat (metric)", "ct", 0.2),
      // Standard weights for reference
      u("g-jewelry", "Gram", "g", 1),
      u("kg-jewelry", "Kilogram", "kg", 1000),
      u("oz-jewelry", "Ounce (avoirdupois)", "oz", 28.3495),
      u("lb-jewelry", "Pound (avoirdupois)", "lb", 453.592),
      // Historical jewelry weights
      u("mite", "Mite", "mite", 0.00324),
      u("drachm", "Drachm", "drachm", 1.77185),
      u("scruple", "Scruple", "scruple", 1.29598),
    ],
    popularPairs: [["tr-oz","g-jewelry"],["ct","g-jewelry"],["dwt","g-jewelry"],["gr","ct"]],
  },
  {
    id: "lumber-construction",
    group: "Measurement",
    name: "Lumber & Construction",
    description: "Board feet, lumber sizes, construction measurements",
    icon: "Hammer",
    baseUnit: "m³",
    units: [
      // Volume measurements for lumber
      u("bf", "Board foot", "bf", 0.00235974), // 1 bf = 144 cubic inches
      u("cf", "Cubic foot", "cf", 0.0283168),
      u("cm-lumber", "Cubic meter", "m³", 1),
      u("ci", "Cubic inch", "in³", 1.63871e-5),
      // Linear measurements commonly used
      u("ft-linear", "Linear foot", "ft", 0.0283168), // assuming 1 sq ft cross-section
      u("m-linear", "Linear meter", "m", 0.1), // assuming 10cm x 10cm cross-section
      // Cord measurements (firewood)
      u("cord", "Cord (firewood)", "cord", 3.62456),
      u("face-cord", "Face cord", "face cord", 1.20819),
      u("rick", "Rick", "rick", 1.20819), // same as face cord
      // Stacked measurements
      u("stere", "Stere", "stere", 1), // 1 cubic meter of stacked wood
      u("cunit", "Cunit", "cunit", 2.83168), // 100 cubic feet
    ],
    popularPairs: [["bf","cm-lumber"],["cf","cm-lumber"],["cord","cm-lumber"],["bf","cf"]],
  },
];