import { useState } from "react";
import { useMemo } from "react";
import { Combobox } from "./ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { formatNumber } from "../lib/format";

const densityUnits = [
  { id: "kg/m3", label: "Kilogram per cubic meter", symbol: "kg/m³", factor: 1 },
  { id: "g/cm3", label: "Gram per cubic centimeter", symbol: "g/cm³", factor: 1000 },
  { id: "lb/ft3", label: "Pound per cubic foot", symbol: "lb/ft³", factor: 16.0185 },
  { id: "lb/in3", label: "Pound per cubic inch", symbol: "lb/in³", factor: 27679.9 },
  { id: "g/L", label: "Gram per liter", symbol: "g/L", factor: 1 },
  { id: "mg/m3", label: "Milligram per cubic meter", symbol: "mg/m³", factor: 0.001 },
];

export function DensityCalculator() {
  const [input, setInput] = useState("1000");
  const [fromUnit, setFromUnit] = useState("kg/m3");
  const [toUnit, setToUnit] = useState("g/cm3");

  const parsed = Number.parseFloat(input.replace(/,/g, ""));
  const from = densityUnits.find(u => u.id === fromUnit);
  const to = densityUnits.find(u => u.id === toUnit);

  const result = useMemo(() => {
    if (!from || !to || !Number.isFinite(parsed)) return NaN;
    // Convert to base (kg/m³), then to target
    const base = parsed / from.factor;
    return base * to.factor;
  }, [parsed, from, to]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Density Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input inputMode="decimal" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter value" />
              <Combobox
                options={densityUnits.map(u => ({ value: u.id, label: u.label, symbol: u.symbol }))}
                value={fromUnit}
                onValueChange={setFromUnit}
                placeholder="Select unit"
                className="w-[180px]"
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-center pb-2">
            <span className="text-muted-foreground">→</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-2">
              <Input readOnly value={Number.isFinite(result) ? formatNumber(result) : ""} />
              <Combobox
                options={densityUnits.map(u => ({ value: u.id, label: u.label, symbol: u.symbol }))}
                value={toUnit}
                onValueChange={setToUnit}
                placeholder="Select unit"
                className="w-[180px]"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="text-sm bg-muted p-3 rounded-md">
          <div className="font-semibold mb-1">How density conversions work</div>
          <div>
            Density conversions are performed by first converting the input value to the base unit (<b>kg/m³</b>), then converting to the target unit using its factor.<br /><br />
            <span className="font-mono">value_in_to_unit = (input / from_factor) × to_factor</span><br />
            For example, to convert 1000 kg/m³ to g/cm³:<br />
            <span className="font-mono">1000 / 1 × 0.001 = 1 g/cm³</span><br />
            To convert 62.4 lb/ft³ to kg/m³:<br />
            <span className="font-mono">62.4 / 16.0185 × 1 = 3.895 kg/m³</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
