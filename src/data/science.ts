import type { UnitCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const scienceCategories: UnitCategory[] = [
  {
    id: "energy",
    group: "Science",
    name: "Energy",
    description: "Joules, calories, Wh, BTU, eV, and specialized units",
    icon: "Bolt",
    baseUnit: "J",
    units: [
      // SI and metric units
      u("aJ", "Attojoule", "aJ", 1e-18),
      u("fJ", "Femtojoule", "fJ", 1e-15),
      u("pJ", "Picojoule", "pJ", 1e-12),
      u("nJ", "Nanojoule", "nJ", 1e-9),
      u("µJ", "Microjoule", "µJ", 1e-6),
      u("mJ", "Millijoule", "mJ", 1e-3),
      u("J", "Joule", "J", 1),
      u("kJ", "Kilojoule", "kJ", 1e3),
      u("MJ", "Megajoule", "MJ", 1e6),
      u("GJ", "Gigajoule", "GJ", 1e9),
      u("TJ", "Terajoule", "TJ", 1e12),
      
      // Electrical energy
      u("Wh", "Watt-hour", "Wh", 3600),
      u("kWh", "Kilowatt-hour", "kWh", 3.6e6),
      u("MWh", "Megawatt-hour", "MWh", 3.6e9),
      u("GWh", "Gigawatt-hour", "GWh", 3.6e12),
      u("TWh", "Terawatt-hour", "TWh", 3.6e15),
      
      // Calories (various definitions)
      u("cal", "Calorie (thermochemical)", "cal", 4.184),
      u("cal-IT", "Calorie (IT)", "cal(IT)", 4.1868),
      u("cal-15", "Calorie (15°C)", "cal₁₅", 4.1855),
      u("kcal", "Kilocalorie", "kcal", 4184),
      u("Cal", "Calorie (food)", "Cal", 4184), // same as kcal
      
      // British thermal units
      u("BTU", "BTU (International Table)", "BTU", 1055.05585262),
      u("BTU-th", "BTU (thermochemical)", "BTU(th)", 1054.35026444),
      u("BTU-39", "BTU (39°F)", "BTU₃₉", 1059.67),
      u("BTU-59", "BTU (59°F)", "BTU₅₉", 1054.8),
      u("MBTU", "Million BTU", "MBTU", 1.05505585262e9),
      
      // Particle physics
      u("eV", "Electronvolt", "eV", 1.602176634e-19),
      u("keV", "Kiloelectronvolt", "keV", 1.602176634e-16),
      u("MeV", "Megaelectronvolt", "MeV", 1.602176634e-13),
      u("GeV", "Gigaelectronvolt", "GeV", 1.602176634e-10),
      u("TeV", "Teraelectronvolt", "TeV", 1.602176634e-7),
      
      // Atomic and nuclear
      u("hartree", "Hartree", "Eh", 4.3597447222071e-18),
      u("rydberg", "Rydberg", "Ry", 2.1798723611035e-18),
      
      // Mechanical and thermal
      u("erg", "Erg", "erg", 1e-7),
      u("ft-lbf", "Foot-pound force", "ft⋅lbf", 1.3558179483314004),
      u("in-lbf", "Inch-pound force", "in⋅lbf", 0.1129848290276167),
      u("therm", "Therm", "therm", 1.05505585262e8),
      u("quad", "Quad", "quad", 1.05505585262e18),
      
      // Explosive energy
      u("tnt-g", "Gram of TNT", "g TNT", 4184),
      u("tnt-kg", "Kilogram of TNT", "kg TNT", 4.184e6),
      u("tnt-ton", "Ton of TNT", "t TNT", 4.184e9),
      u("tnt-kt", "Kiloton of TNT", "kt TNT", 4.184e12),
      u("tnt-mt", "Megaton of TNT", "Mt TNT", 4.184e15),
      
      // Fuel energy content
      u("gasoline-L", "Liter of gasoline", "L gas", 3.4e7), // ~34 MJ/L
      u("diesel-L", "Liter of diesel", "L diesel", 3.8e7), // ~38 MJ/L
      u("natural-gas-m3", "Cubic meter natural gas", "m³ gas", 3.6e7), // ~36 MJ/m³
    ],
    popularPairs: [["kWh","MJ"],["kcal","kJ"],["BTU","kJ"],["eV","J"],["ft-lbf","J"],["therm","kWh"]],
  },
  {
    id: "power",
    group: "Science",
    name: "Power",
    description: "Watts, kilowatts, horsepower, and specialized power units",
    icon: "Zap",
    baseUnit: "W",
    units: [
      // SI power units
      u("pW", "Picowatt", "pW", 1e-12),
      u("nW", "Nanowatt", "nW", 1e-9),
      u("µW", "Microwatt", "µW", 1e-6),
      u("mW", "Milliwatt", "mW", 1e-3),
      u("W", "Watt", "W", 1),
      u("kW", "Kilowatt", "kW", 1e3),
      u("MW", "Megawatt", "MW", 1e6),
      u("GW", "Gigawatt", "GW", 1e9),
      u("TW", "Terawatt", "TW", 1e12),
      
      // Horsepower variations
      u("hp", "Horsepower (mechanical)", "hp", 745.6998715822702),
      u("hp-metric", "Horsepower (metric)", "PS", 735.49875),
      u("hp-elec", "Horsepower (electrical)", "hp(E)", 746),
      u("hp-boiler", "Horsepower (boiler)", "hp(S)", 9809.5),
      u("hp-water", "Horsepower (hydraulic)", "whp", 746.043),
      
      // CGS system
      u("erg/s", "Erg per second", "erg/s", 1e-7),
      
      // Thermal power
      u("BTU/h", "BTU per hour", "BTU/h", 0.29307107017222),
      u("BTU/min", "BTU per minute", "BTU/min", 17.584264210333),
      u("BTU/s", "BTU per second", "BTU/s", 1055.05585262),
      u("cal/s", "Calorie per second", "cal/s", 4.184),
      u("kcal/h", "Kilocalorie per hour", "kcal/h", 1.1622222222222),
      
      // Cooling/heating
      u("ton-ref", "Ton of refrigeration", "TR", 3516.8528420667),
      u("RT", "Refrigeration ton", "RT", 3516.8528420667), // same as above
      
      // Mechanical power
      u("ft-lbf/s", "Foot-pound per second", "ft⋅lbf/s", 1.3558179483314),
      u("ft-lbf/min", "Foot-pound per minute", "ft⋅lbf/min", 0.022596965805523),
      u("ft-lbf/h", "Foot-pound per hour", "ft⋅lbf/h", 0.00037661609675872),
      
      // Solar power
      u("kW/m2", "Kilowatt per sq meter", "kW/m²", 1000), // Power density reference
      
      // Audio power
      u("dBm", "Decibel-milliwatt", "dBm", 0.001), // Reference: 1 mW = 0 dBm
      u("dBW", "Decibel-watt", "dBW", 1), // Reference: 1 W = 0 dBW
      
      // Historical units
      u("pferdestarke", "Pferdestärke (German HP)", "PS", 735.49875),
      u("cheval-vapeur", "Cheval vapeur (French HP)", "ch", 735.49875),
    ],
    popularPairs: [["kW","hp"],["W","mW"],["MW","GW"],["BTU/h","kW"],["hp","PS"],["cal/s","W"]],
  },
  {
    id: "pressure",
    group: "Science",
    name: "Pressure",
    description: "Pa, bar, atm, psi, mmHg, Torr, and many more",
    icon: "Activity",
    baseUnit: "Pa",
    units: [
      // SI Units
      u("Pa", "Pascal", "Pa", 1),
      u("hPa", "Hectopascal", "hPa", 1e2),
      u("kPa", "Kilopascal", "kPa", 1e3),
      u("MPa", "Megapascal", "MPa", 1e6),
      u("GPa", "Gigapascal", "GPa", 1e9),
      
      // Common metric units
      u("bar", "Bar", "bar", 1e5),
      u("mbar", "Millibar", "mbar", 1e2), // same as hPa
      u("µbar", "Microbar", "µbar", 0.1),
      
      // Atmospheric pressure units
      u("atm", "Standard atmosphere", "atm", 101325),
      u("at", "Technical atmosphere", "at", 98066.5), // kgf/cm²
      
      // Imperial/US units
      u("psi", "Pounds per square inch", "psi", 6894.757293168),
      u("psf", "Pounds per square foot", "psf", 47.88025898033584),
      u("ksi", "Kilopounds per square inch", "ksi", 6894757.293168),
      
      // Mercury column units
      u("mmHg", "Millimeter of mercury", "mmHg", 133.322387415),
      u("cmHg", "Centimeter of mercury", "cmHg", 1333.22387415),
      u("inHg", "Inch of mercury", "inHg", 3386.389),
      u("torr", "Torr", "Torr", 133.322387415), // ≈ mmHg
      
      // Water column units
      u("mmH2O", "Millimeter of water", "mmH₂O", 9.80665),
      u("cmH2O", "Centimeter of water", "cmH₂O", 98.0665),
      u("inH2O", "Inch of water", "inH₂O", 248.84),
      u("ftH2O", "Foot of water", "ftH₂O", 2989.067),
      
      // Other fluid column units
      u("mAq", "Meter of water column", "mAq", 9806.65),
      u("ftAq", "Foot of water column", "ftAq", 2989.067),
      
      // Vacuum units
      u("mtorr", "Millitorr", "mTorr", 0.133322387415),
      u("µtorr", "Microtorr", "µTorr", 0.000133322387415),
      
      // Old/historical units
      u("kgf/cm2", "Kilogram-force/cm²", "kgf/cm²", 98066.5),
      u("kgf/m2", "Kilogram-force/m²", "kgf/m²", 9.80665),
      u("lbf/ft2", "Pound-force/ft²", "lbf/ft²", 47.88025898),
      
      // Specialized units
      u("dyne/cm2", "Dyne per cm²", "dyn/cm²", 0.1),
      u("N/m2", "Newton per m²", "N/m²", 1), // same as Pascal
      u("N/mm2", "Newton per mm²", "N/mm²", 1e6),
      
      // Meteorological
      u("mb", "Millibar (meteorology)", "mb", 1e2),
      u("µm-Hg", "Micron of mercury", "µm Hg", 0.133322387415),
      
      // Industrial/specialized
      u("Ba", "Barye", "Ba", 0.1), // CGS unit
      u("pz", "Pieze", "pz", 1e3), // MKS unit
    ],
    popularPairs: [["bar","psi"],["kPa","psi"],["atm","kPa"],["mmHg","kPa"],["torr","mmHg"],["inHg","mmHg"],["mbar","hPa"]],
  },
  {
    id: "angle",
    group: "Science",
    name: "Angle",
    description: "Degrees, radians, gradians, mils, and navigation units",
    icon: "Compass",
    baseUnit: "rad",
    units: [
      // Primary units
      { id: "rad", label: "Radian", symbol: "rad", toBase: (x) => x, fromBase: (x) => x },
      { id: "deg", label: "Degree", symbol: "°", toBase: (x) => x * Math.PI / 180, fromBase: (x) => x * 180 / Math.PI },
      { id: "grad", label: "Gradian", symbol: "gon", toBase: (x) => x * Math.PI / 200, fromBase: (x) => x * 200 / Math.PI },
      
      // Subdivisions of degrees
      { id: "arcmin", label: "Arcminute", symbol: "′", toBase: (x) => (x/60) * Math.PI / 180, fromBase: (x) => (x * 180 / Math.PI) * 60 },
      { id: "arcsec", label: "Arcsecond", symbol: "″", toBase: (x) => (x/3600) * Math.PI / 180, fromBase: (x) => (x * 180 / Math.PI) * 3600 },
      { id: "mas", label: "Milliarcsecond", symbol: "mas", toBase: (x) => (x/3600000) * Math.PI / 180, fromBase: (x) => (x * 180 / Math.PI) * 3600000 },
      { id: "µas", label: "Microarcsecond", symbol: "µas", toBase: (x) => (x/3.6e9) * Math.PI / 180, fromBase: (x) => (x * 180 / Math.PI) * 3.6e9 },
      
      // Military/surveying units
      { id: "mil-nato", label: "Mil (NATO)", symbol: "mil", toBase: (x) => x * Math.PI / 3200, fromBase: (x) => x * 3200 / Math.PI },
      { id: "mil-us", label: "Mil (US)", symbol: "mil(US)", toBase: (x) => x * Math.PI / 3200, fromBase: (x) => x * 3200 / Math.PI },
      { id: "mil-ussr", label: "Mil (Soviet)", symbol: "mil(USSR)", toBase: (x) => x * Math.PI / 3000, fromBase: (x) => x * 3000 / Math.PI },
      { id: "mil-sweden", label: "Mil (Swedish)", symbol: "mil(SE)", toBase: (x) => x * Math.PI / 3000, fromBase: (x) => x * 3000 / Math.PI },
      
      // Navigation and maritime
      { id: "point", label: "Point (compass)", symbol: "pt", toBase: (x) => x * Math.PI / 16, fromBase: (x) => x * 16 / Math.PI },
      { id: "quadrant", label: "Quadrant", symbol: "quad", toBase: (x) => x * Math.PI / 2, fromBase: (x) => x * 2 / Math.PI },
      { id: "sextant", label: "Sextant", symbol: "sext", toBase: (x) => x * Math.PI / 3, fromBase: (x) => x * 3 / Math.PI },
      { id: "octant", label: "Octant", symbol: "oct", toBase: (x) => x * Math.PI / 4, fromBase: (x) => x * 4 / Math.PI },
      
      // Complete rotations
      { id: "revolution", label: "Revolution", symbol: "rev", toBase: (x) => x * 2 * Math.PI, fromBase: (x) => x / (2 * Math.PI) },
      { id: "turn", label: "Turn", symbol: "tr", toBase: (x) => x * 2 * Math.PI, fromBase: (x) => x / (2 * Math.PI) },
      
      // Historical and regional
      { id: "centesimal-min", label: "Centesimal minute", symbol: "c", toBase: (x) => x * Math.PI / 20000, fromBase: (x) => x * 20000 / Math.PI },
      { id: "centesimal-sec", label: "Centesimal second", symbol: "cc", toBase: (x) => x * Math.PI / 2000000, fromBase: (x) => x * 2000000 / Math.PI },
      
      // Binary subdivisions
      { id: "binary-deg", label: "Binary degree", symbol: "brad", toBase: (x) => x * Math.PI / 128, fromBase: (x) => x * 128 / Math.PI },
      
      // Percentage of circle
      { id: "percent-circle", label: "Percent of circle", symbol: "%⊙", toBase: (x) => x * 2 * Math.PI / 100, fromBase: (x) => x * 100 / (2 * Math.PI) },
      
      // Astronomical
      { id: "hour-angle", label: "Hour angle", symbol: "h", toBase: (x) => x * Math.PI / 12, fromBase: (x) => x * 12 / Math.PI },
      { id: "minute-angle", label: "Minute of time", symbol: "m", toBase: (x) => x * Math.PI / 720, fromBase: (x) => x * 720 / Math.PI },
      { id: "second-angle", label: "Second of time", symbol: "s", toBase: (x) => x * Math.PI / 43200, fromBase: (x) => x * 43200 / Math.PI },
    ],
    popularPairs: [["deg","rad"],["arcmin","deg"],["arcsec","arcmin"],["mil-nato","deg"],["revolution","deg"],["grad","deg"]],
  },
  {
    id: "frequency",
    group: "Science",
    name: "Frequency & Angular Velocity",
    description: "Hz, RPM, radians/sec, degrees/sec, cycles and more",
    icon: "Waveform",
    baseUnit: "Hz",
    units: [
      // Basic frequency units
      u("Hz", "Hertz (cycle/sec)", "Hz", 1),
      u("kHz", "Kilohertz", "kHz", 1e3),
      u("MHz", "Megahertz", "MHz", 1e6),
      u("GHz", "Gigahertz", "GHz", 1e9),
      u("THz", "Terahertz", "THz", 1e12),
      
      // Cycles per time
      u("cps", "Cycle per second", "cps", 1), // same as Hz
      u("cpm", "Cycle per minute", "cpm", 1/60),
      u("cph", "Cycle per hour", "cph", 1/3600),
      
      // Revolutions per time
      { id: "rps", label: "Revolution per second", symbol: "rps", toBase: (x) => x, fromBase: (x) => x },
      { id: "rpm", label: "Revolution per minute", symbol: "RPM", toBase: (x) => x/60, fromBase: (x) => x*60 },
      { id: "rph", label: "Revolution per hour", symbol: "rph", toBase: (x) => x/3600, fromBase: (x) => x*3600 },
      
      // Angular velocity - radians per time
      { id: "rads", label: "Radian per second", symbol: "rad/s", toBase: (x) => x/(2*Math.PI), fromBase: (x) => x*(2*Math.PI) },
      { id: "radm", label: "Radian per minute", symbol: "rad/min", toBase: (x) => x/(2*Math.PI*60), fromBase: (x) => x*(2*Math.PI*60) },
      { id: "radh", label: "Radian per hour", symbol: "rad/h", toBase: (x) => x/(2*Math.PI*3600), fromBase: (x) => x*(2*Math.PI*3600) },
      
      // Angular velocity - degrees per time
      { id: "degs", label: "Degree per second", symbol: "°/s", toBase: (x) => x/360, fromBase: (x) => x*360 },
      { id: "degm", label: "Degree per minute", symbol: "°/min", toBase: (x) => x/(360*60), fromBase: (x) => x*(360*60) },
      { id: "degh", label: "Degree per hour", symbol: "°/h", toBase: (x) => x/(360*3600), fromBase: (x) => x*(360*3600) },
      
      // Common mechanical frequencies
      { id: "bpm", label: "Beats per minute", symbol: "BPM", toBase: (x) => x/60, fromBase: (x) => x*60 },
      { id: "fps-freq", label: "Frames per second", symbol: "fps", toBase: (x) => x, fromBase: (x) => x },
      
      // Scientific frequencies
      u("mHz", "Millihertz", "mHz", 1e-3),
      u("μHz", "Microhertz", "µHz", 1e-6),
      
      // Period conversions (inverse of frequency)
      { id: "period-s", label: "Period (seconds)", symbol: "s period", toBase: (x) => 1/x, fromBase: (x) => 1/x },
      { id: "period-ms", label: "Period (milliseconds)", symbol: "ms period", toBase: (x) => 1000/x, fromBase: (x) => 1000/x },
    ],
    popularPairs: [["Hz","rpm"],["rps","rpm"],["degs","rads"],["bpm","Hz"],["fps-freq","Hz"],["period-s","Hz"]],
  },
  {
    id: "force",
    group: "Science",
    name: "Force",
    description: "Newtons, pounds-force, dynes, and gravitational units",
    icon: "Armchair",
    baseUnit: "N",
    units: [
      // SI force units
      u("pN", "Piconewton", "pN", 1e-12),
      u("nN", "Nanonewton", "nN", 1e-9),
      u("µN", "Micronewton", "µN", 1e-6),
      u("mN", "Millinewton", "mN", 1e-3),
      u("N", "Newton", "N", 1),
      u("kN", "Kilonewton", "kN", 1e3),
      u("MN", "Meganewton", "MN", 1e6),
      u("GN", "Giganewton", "GN", 1e9),
      
      // CGS system
      u("dyn", "Dyne", "dyn", 1e-5),
      u("kdyn", "Kilodyne", "kdyn", 1e-2),
      u("Mdyn", "Megadyne", "Mdyn", 10),
      
      // Gravitational units
      u("kgf", "Kilogram-force", "kgf", 9.80665),
      u("gf", "Gram-force", "gf", 0.00980665),
      u("tf", "Tonne-force", "tf", 9806.65),
      u("tonf", "Ton-force (metric)", "tonf", 9806.65),
      
      // Imperial/US units
      u("lbf", "Pound-force", "lbf", 4.4482216152605),
      u("ozf", "Ounce-force", "ozf", 0.27801385095378),
      u("kip", "Kip (1000 lbf)", "kip", 4448.2216152605),
      u("tonf-us", "Ton-force (US short)", "tonf(US)", 8896.4432305210),
      u("tonf-uk", "Ton-force (UK long)", "tonf(UK)", 9964.0164181707),
      
      // Atomic and molecular
      u("atm-force", "Atomic unit of force", "Eh/a₀", 8.2387234983e-8),
      
      // Thrust units (aerospace)
      u("lbf-thrust", "Pound-force (thrust)", "lbf(thrust)", 4.4482216152605),
      u("kgf-thrust", "Kilogram-force (thrust)", "kgf(thrust)", 9.80665),
      
      // Spring constant related
      u("N/m", "Newton per meter", "N/m", 1), // Force per unit length
      u("lbf/in", "Pound per inch", "lbf/in", 175.1268369),
      u("kgf/mm", "Kilogram per millimeter", "kgf/mm", 9806.65),
      
      // Pressure-force conversion (reference area)
      u("psi-in2", "PSI × square inch", "psi⋅in²", 6.8947572932),
      u("bar-cm2", "Bar × square centimeter", "bar⋅cm²", 10),
      
      // Historical units  
      u("sthene", "Sthène", "sn", 1000), // MTS system
      u("poundal", "Poundal", "pdl", 0.138254954376),
    ],
    popularPairs: [["N","lbf"],["kgf","N"],["dyn","N"],["kN","kip"],["MN","tonf"],["gf","mN"]],
  },
  {
    id: "torque",
    group: "Science",
    name: "Torque",
    description: "Newton-meters, pound-feet, and rotational moment units",
    icon: "Cog",
    baseUnit: "Nm",
    units: [
      // SI torque units
      u("µNm", "Micronewton meter", "µN⋅m", 1e-6),
      u("mNm", "Millinewton meter", "mN⋅m", 1e-3),
      u("Nm", "Newton meter", "N⋅m", 1),
      u("kNm", "Kilonewton meter", "kN⋅m", 1e3),
      u("MNm", "Meganewton meter", "MN⋅m", 1e6),
      
      // CGS system
      u("dyn-cm", "Dyne centimeter", "dyn⋅cm", 1e-7),
      u("dyn-mm", "Dyne millimeter", "dyn⋅mm", 1e-8),
      
      // Metric gravitational units
      u("kgf-m", "Kilogram-force meter", "kgf⋅m", 9.80665),
      u("kgf-cm", "Kilogram-force centimeter", "kgf⋅cm", 0.0980665),
      u("kgf-mm", "Kilogram-force millimeter", "kgf⋅mm", 0.00980665),
      u("gf-m", "Gram-force meter", "gf⋅m", 0.00980665),
      u("gf-cm", "Gram-force centimeter", "gf⋅cm", 0.0000980665),
      
      // Imperial/US units
      u("lbf-ft", "Pound-force foot", "lbf⋅ft", 1.3558179483314),
      u("lbf-in", "Pound-force inch", "lbf⋅in", 0.1129848290276167),
      u("ozf-in", "Ounce-force inch", "ozf⋅in", 0.007061551814226),
      u("kip-ft", "Kip foot", "kip⋅ft", 1355.8179483314),
      u("kip-in", "Kip inch", "kip⋅in", 112.9848290276167),
      
      // Small precision units
      u("mNmm", "Millinewton millimeter", "mN⋅mm", 1e-6),
      u("cNm", "Centinewton meter", "cN⋅m", 1e-2),
      u("µNmm", "Micronewton millimeter", "µN⋅mm", 1e-9),
      
      // Automotive/mechanical
      u("ft-lb", "Foot-pound (torque)", "ft⋅lb", 1.3558179483314), // same as lbf⋅ft
      u("in-lb", "Inch-pound (torque)", "in⋅lb", 0.1129848290276167), // same as lbf⋅in
      
      // Alternative notation
      u("kg-m", "Kilogram meter", "kg⋅m", 9.80665), // same as kgf⋅m
      u("g-cm", "Gram centimeter", "g⋅cm", 0.0000980665), // same as gf⋅cm
      
      // Large torque units
      u("tonf-m", "Tonne-force meter", "tonf⋅m", 9806.65),
      u("tonf-ft", "Ton-force foot (US)", "tonf⋅ft", 2712.0097225),
      
      // Atomic units
      u("hartree-bohr", "Hartree per Bohr radius", "Eh/a₀", 4.359744722207185e-8),
    ],
    popularPairs: [["Nm","lbf-ft"],["lbf-in","Nm"],["kgf-m","Nm"],["mNm","µNm"],["kNm","MNm"],["dyn-cm","Nm"]],
  },
];