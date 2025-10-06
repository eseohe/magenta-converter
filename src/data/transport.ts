import type { UnitCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const transportCategories: UnitCategory[] = [
  {
    id: "speed",
    group: "Transport",
    name: "Speed",
    description: "m/s, km/h, mph, knots",
    icon: "Gauge",
    baseUnit: "mps",
    units: [
      u("mps", "Meter/second", "m/s", 1),
      u("kmh", "Kilometer/hour", "km/h", 1000/3600),
      u("mph", "Mile/hour", "mph", 0.44704),
      u("knot", "Knot", "kn", 0.514444),
      u("fps", "Foot/second", "ft/s", 0.3048),
    ],
    popularPairs: [["kmh","mph"],["knot","kmh"],["mps","kmh"]],
  },
  {
    id: "fuel",
    group: "Transport",
    name: "Fuel Economy",
    description: "mpg (US/UK), L/100km, km/L",
    icon: "Car",
    baseUnit: "kml",
    units: [
      { id: "kml", label: "Kilometer per liter", symbol: "km/L", toBase: (x) => x, fromBase: (x) => x },
      { id: "L100km", label: "Liters/100 km", symbol: "L/100km", toBase: (x) => 100 / x, fromBase: (x) => 100 / x },
      { id: "mpgUS", label: "Miles per gallon (US)", symbol: "mpg (US)", toBase: (x) => x * (1.609344/3.785411784), fromBase: (x) => x / (1.609344/3.785411784) },
      { id: "mpgUK", label: "Miles per gallon (Imp)", symbol: "mpg (UK)", toBase: (x) => x * (1.609344/4.54609), fromBase: (x) => x / (1.609344/4.54609) },
    ],
    popularPairs: [["L100km","mpgUS"],["kml","mpgUS"],["mpgUK","mpgUS"]],
  },
];