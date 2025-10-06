import type { UnitCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const electronicsCategories: UnitCategory[] = [
  {
    id: "electrical-voltage",
    group: "Electronics",
    name: "Electrical Voltage",
    description: "Volts, millivolts, kilovolts, and electrical potential units",
    icon: "Zap",
    baseUnit: "V",
    units: [
      // SI voltage units
      u("aV", "Attovolt", "aV", 1e-18),
      u("fV", "Femtovolt", "fV", 1e-15),
      u("pV", "Picovolt", "pV", 1e-12),
      u("nV", "Nanovolt", "nV", 1e-9),
      u("µV", "Microvolt", "µV", 1e-6),
      u("mV", "Millivolt", "mV", 1e-3),
      u("V", "Volt", "V", 1),
      u("kV", "Kilovolt", "kV", 1e3),
      u("MV", "Megavolt", "MV", 1e6),
      u("GV", "Gigavolt", "GV", 1e9),
      
      // CGS electromagnetic units (EMU)
      u("abV", "Abvolt", "abV", 1e-8),
      u("statV", "Statvolt", "statV", 299.792458),
      
      // Historical/specialized units
      u("planck-voltage", "Planck voltage", "V_P", 1.0435e27),
    ],
    popularPairs: [["V","mV"],["kV","V"],["µV","mV"],["MV","kV"],["nV","µV"],["V","kV"]],
  },
  {
    id: "electrical-current",
    group: "Electronics", 
    name: "Electrical Current",
    description: "Amperes, milliamps, microamps, and electric current units",
    icon: "Activity",
    baseUnit: "A",
    units: [
      // SI current units
      u("aA", "Attoampere", "aA", 1e-18),
      u("fA", "Femtoampere", "fA", 1e-15),
      u("pA", "Picoampere", "pA", 1e-12),
      u("nA", "Nanoampere", "nA", 1e-9),
      u("µA", "Microampere", "µA", 1e-6),
      u("mA", "Milliampere", "mA", 1e-3),
      u("A", "Ampere", "A", 1),
      u("kA", "Kiloampere", "kA", 1e3),
      u("MA", "Megaampere", "MA", 1e6),
      u("GA", "Gigaampere", "GA", 1e9),
      
      // CGS electromagnetic units
      u("abA", "Abampere", "abA", 10),
      u("statA", "Statampere", "statA", 3.335641e-10),
      u("Bi", "Biot", "Bi", 10), // same as abampere
      
      // Specialized units
      u("esu/s", "ESU per second", "esu/s", 3.335641e-10),
      u("Fr/s", "Franklin per second", "Fr/s", 3.335641e-10),
      
      // Practical units
      u("gilbert/s", "Gilbert per second", "Gi/s", 0.795775),
    ],
    popularPairs: [["A","mA"],["mA","µA"],["µA","nA"],["kA","A"],["pA","nA"],["A","µA"]],
  },
  {
    id: "electrical-resistance",
    group: "Electronics",
    name: "Electrical Resistance", 
    description: "Ohms, kilohms, megohms, and electrical resistance units",
    icon: "Minus",
    baseUnit: "Ω",
    units: [
      // SI resistance units
      u("µΩ", "Microhm", "µΩ", 1e-6),
      u("mΩ", "Milliohm", "mΩ", 1e-3),
      u("Ω", "Ohm", "Ω", 1),
      u("kΩ", "Kilohm", "kΩ", 1e3),
      u("MΩ", "Megohm", "MΩ", 1e6),
      u("GΩ", "Gigohm", "GΩ", 1e9),
      u("TΩ", "Teraohm", "TΩ", 1e12),
      
      // CGS units
      u("abΩ", "Abohm", "abΩ", 1e-9),
      u("statΩ", "Statohm", "statΩ", 8.987551787e11),
      
      // Conductance units (reciprocal of resistance)
      { id: "S", label: "Siemens", symbol: "S", toBase: (x) => 1/x, fromBase: (x) => 1/x },
      { id: "mS", label: "Millisiemens", symbol: "mS", toBase: (x) => 1/(x*1e-3), fromBase: (x) => (1/x)*1e-3 },
      { id: "µS", label: "Microsiemens", symbol: "µS", toBase: (x) => 1/(x*1e-6), fromBase: (x) => (1/x)*1e-6 },
      { id: "nS", label: "Nanosiemens", symbol: "nS", toBase: (x) => 1/(x*1e-9), fromBase: (x) => (1/x)*1e-9 },
      
      // Historical conductance units
      { id: "mho", label: "Mho", symbol: "℧", toBase: (x) => 1/x, fromBase: (x) => 1/x }, // same as siemens
      { id: "mmho", label: "Millimho", symbol: "m℧", toBase: (x) => 1/(x*1e-3), fromBase: (x) => (1/x)*1e-3 },
      { id: "µmho", label: "Micromho", symbol: "µ℧", toBase: (x) => 1/(x*1e-6), fromBase: (x) => (1/x)*1e-6 },
    ],
    popularPairs: [["Ω","kΩ"],["kΩ","MΩ"],["mΩ","Ω"],["MΩ","GΩ"],["S","Ω"],["mS","kΩ"]],
  },
  {
    id: "electrical-capacitance",
    group: "Electronics",
    name: "Electrical Capacitance",
    description: "Farads, microfarads, picofarads, and capacitance units", 
    icon: "Battery",
    baseUnit: "F",
    units: [
      // SI capacitance units
      u("aF", "Attofarad", "aF", 1e-18),
      u("fF", "Femtofarad", "fF", 1e-15),
      u("pF", "Picofarad", "pF", 1e-12),
      u("nF", "Nanofarad", "nF", 1e-9),
      u("µF", "Microfarad", "µF", 1e-6),
      u("mF", "Millifarad", "mF", 1e-3),
      u("F", "Farad", "F", 1),
      u("kF", "Kilofarad", "kF", 1e3),
      
      // CGS units
      u("abF", "Abfarad", "abF", 1e9),
      u("statF", "Statfarad", "statF", 1.112650e-12),
      
      // Alternative names/notation
      u("uF", "Microfarad (alt)", "uF", 1e-6), // alternative µF notation
      u("mmF", "Micro-microfarad", "mmF", 1e-12), // old name for pF
      u("µµF", "Micro-microfarad", "µµF", 1e-12), // old notation for pF
      
      // Specialized units
      u("jar", "Leyden jar", "jar", 1e-9), // approximately 1 nF
    ],
    popularPairs: [["µF","nF"],["pF","nF"],["F","µF"],["nF","pF"],["mF","µF"],["fF","pF"]],
  },
  {
    id: "electrical-inductance", 
    group: "Electronics",
    name: "Electrical Inductance",
    description: "Henries, millihenries, microhenries, and inductance units",
    icon: "Coil",
    baseUnit: "H",
    units: [
      // SI inductance units
      u("pH", "Picohenry", "pH", 1e-12),
      u("nH", "Nanohenry", "nH", 1e-9),
      u("µH", "Microhenry", "µH", 1e-6),
      u("mH", "Millihenry", "mH", 1e-3),
      u("H", "Henry", "H", 1),
      u("kH", "Kilohenry", "kH", 1e3),
      
      // CGS units
      u("abH", "Abhenry", "abH", 1e-9),
      u("statH", "Stathenry", "statH", 8.987551787e11),
      
      // Alternative notation
      u("uH", "Microhenry (alt)", "uH", 1e-6), // alternative µH notation
    ],
    popularPairs: [["mH","µH"],["µH","nH"],["H","mH"],["nH","pH"],["kH","H"],["µH","mH"]],
  },
  {
    id: "electrical-charge",
    group: "Electronics", 
    name: "Electrical Charge",
    description: "Coulombs, amp-hours, electron charges, and electrical charge units",
    icon: "Zap",
    baseUnit: "C",
    units: [
      // SI charge units
      u("aC", "Attocoulomb", "aC", 1e-18),
      u("fC", "Femtocoulomb", "fC", 1e-15),
      u("pC", "Picocoulomb", "pC", 1e-12),
      u("nC", "Nanocoulomb", "nC", 1e-9),
      u("µC", "Microcoulomb", "µC", 1e-6),
      u("mC", "Millicoulomb", "mC", 1e-3),
      u("C", "Coulomb", "C", 1),
      u("kC", "Kilocoulomb", "kC", 1e3),
      
      // Time-current units
      u("Ah", "Ampere-hour", "A⋅h", 3600),
      u("mAh", "Milliampere-hour", "mA⋅h", 3.6),
      u("µAh", "Microampere-hour", "µA⋅h", 3.6e-3),
      u("As", "Ampere-second", "A⋅s", 1), // same as coulomb
      
      // CGS units
      u("abC", "Abcoulomb", "abC", 10),
      u("statC", "Statcoulomb", "statC", 3.335641e-10),
      u("esu", "Electrostatic unit", "esu", 3.335641e-10),
      u("Fr", "Franklin", "Fr", 3.335641e-10), // same as statcoulomb
      
      // Fundamental charge units
      { id: "e", label: "Elementary charge", symbol: "e", toBase: (x) => x * 1.602176634e-19, fromBase: (x) => x / 1.602176634e-19 },
      
      // Battery capacity units
      u("Wh", "Watt-hour", "W⋅h", 3600), // energy, but commonly used for battery capacity
      u("kWh", "Kilowatt-hour", "kW⋅h", 3.6e6),
    ],
    popularPairs: [["C","mC"],["Ah","C"],["mAh","C"],["µC","nC"],["e","C"],["pC","fC"]],
  },
  {
    id: "electrical-conductivity",
    group: "Electronics",
    name: "Electrical Conductivity", 
    description: "Siemens per meter and electrical conductivity units",
    icon: "Workflow",
    baseUnit: "S/m",
    units: [
      // SI conductivity units  
      u("S/m", "Siemens per meter", "S/m", 1),
      u("S/cm", "Siemens per centimeter", "S/cm", 100),
      u("S/mm", "Siemens per millimeter", "S/mm", 1000),
      u("mS/m", "Millisiemens per meter", "mS/m", 1e-3),
      u("mS/cm", "Millisiemens per centimeter", "mS/cm", 0.1),
      u("µS/m", "Microsiemens per meter", "µS/m", 1e-6),
      u("µS/cm", "Microsiemens per centimeter", "µS/cm", 1e-4),
      
      // CGS units
      u("abS/m", "Absiemens per meter", "abS/m", 1e9),
      u("statS/m", "Statsiemens per meter", "statS/m", 1.112650e-12),
      
      // Resistivity units (reciprocal)
      { id: "Ω⋅m", label: "Ohm meter", symbol: "Ω⋅m", toBase: (x) => 1/x, fromBase: (x) => 1/x },
      { id: "Ω⋅cm", label: "Ohm centimeter", symbol: "Ω⋅cm", toBase: (x) => 1/(x*0.01), fromBase: (x) => (1/x)*0.01 },
      { id: "Ω⋅mm", label: "Ohm millimeter", symbol: "Ω⋅mm", toBase: (x) => 1/(x*0.001), fromBase: (x) => (1/x)*0.001 },
      
      // Practical units
      u("mho/m", "Mho per meter", "℧/m", 1), // same as S/m
      u("mho/cm", "Mho per centimeter", "℧/cm", 100),
    ],
    popularPairs: [["S/m","mS/m"],["S/cm","S/m"],["µS/cm","mS/cm"],["Ω⋅m","S/m"],["Ω⋅cm","S/cm"]],
  },
  {
    id: "magnetic-field",
    group: "Electronics",
    name: "Magnetic Field",
    description: "Tesla, gauss, weber per square meter, magnetic flux density",
    icon: "Magnet", 
    baseUnit: "T",
    units: [
      // SI magnetic field units
      u("pT", "Picotesla", "pT", 1e-12),
      u("nT", "Nanotesla", "nT", 1e-9),
      u("µT", "Microtesla", "µT", 1e-6),
      u("mT", "Millitesla", "mT", 1e-3),
      u("T", "Tesla", "T", 1),
      u("kT", "Kilotesla", "kT", 1e3),
      
      // CGS units
      u("G", "Gauss", "G", 1e-4),
      u("mG", "Milligauss", "mG", 1e-7),
      u("µG", "Microgauss", "µG", 1e-10),
      u("kG", "Kilogauss", "kG", 0.1),
      
      // Alternative SI notation
      u("Wb/m²", "Weber per square meter", "Wb/m²", 1), // same as tesla
      
      // Specialized units
      u("gamma", "Gamma (magnetic)", "γ", 1e-9), // same as nT
      u("Oe", "Oersted (H-field)", "Oe", 79.5774715), // magnetic field strength, approximately
      
      // Earth field units
      u("earth-field", "Earth magnetic field", "B⊕", 5e-5), // approximately 50 µT
    ],
    popularPairs: [["T","mT"],["mT","µT"],["G","mG"],["T","G"],["µT","nT"],["kG","T"]],
  },
  {
    id: "magnetic-flux", 
    group: "Electronics",
    name: "Magnetic Flux",
    description: "Weber, maxwell, volt-second, and magnetic flux units",
    icon: "Magnet",
    baseUnit: "Wb",
    units: [
      // SI magnetic flux units
      u("pWb", "Picoweber", "pWb", 1e-12),
      u("nWb", "Nanoweber", "nWb", 1e-9),
      u("µWb", "Microweber", "µWb", 1e-6),
      u("mWb", "Milliweber", "mWb", 1e-3),
      u("Wb", "Weber", "Wb", 1),
      u("kWb", "Kiloweber", "kWb", 1e3),
      
      // CGS units
      u("Mx", "Maxwell", "Mx", 1e-8),
      u("kMx", "Kilomaxwell", "kMx", 1e-5),
      
      // Alternative notation
      u("V⋅s", "Volt-second", "V⋅s", 1), // same as weber
      
      // Quantum flux units
      u("Φ₀", "Flux quantum", "Φ₀", 2.067833831e-15),
    ],
    popularPairs: [["Wb","mWb"],["mWb","µWb"],["Mx","Wb"],["µWb","nWb"],["V⋅s","Wb"]],
  },
];