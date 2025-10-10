import { useState } from "react";
import { useMemo } from "react";
import { Combobox } from "./ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { formatNumber } from "../lib/format";

const flowrateUnits = [
  { id: "L/hr", label: "Liters per hour", symbol: "L/hr", factor: 1 },
  { id: "L/min", label: "Liters per minute", symbol: "L/min", factor: 1/60 },
  { id: "L/s", label: "Liters per second", symbol: "L/s", factor: 1/3600 },
  { id: "m3/hr", label: "Cubic meters per hour", symbol: "m³/hr", factor: 0.001 },
  { id: "m3/s", label: "Cubic meters per second", symbol: "m³/s", factor: 0.001/3600 },
  { id: "gal/min", label: "Gallons per minute (US)", symbol: "gal/min", factor: 0.264172 },
  { id: "gal/hr", label: "Gallons per hour (US)", symbol: "gal/hr", factor: 0.264172/60 },
  { id: "ft3/s", label: "Cubic feet per second", symbol: "ft³/s", factor: 0.0353147/3600 },
];

export function FlowRateCalculator() {
  const [input, setInput] = useState("120");
  const [fromUnit, setFromUnit] = useState("L/hr");
  const [toUnit, setToUnit] = useState("gal/min");

  const parsed = Number.parseFloat(input.replace(/,/g, ""));
  const from = flowrateUnits.find(u => u.id === fromUnit);
  const to = flowrateUnits.find(u => u.id === toUnit);

  const result = useMemo(() => {
    if (!from || !to || !Number.isFinite(parsed)) return NaN;
    // Convert to base (L/hr), then to target
    const base = parsed / from.factor;
    return base * to.factor;
  }, [parsed, from, to]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Flow Rate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input inputMode="decimal" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter value" />
              <Combobox
                options={flowrateUnits.map(u => ({ value: u.id, label: u.label, symbol: u.symbol }))}
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
                options={flowrateUnits.map(u => ({ value: u.id, label: u.label, symbol: u.symbol }))}
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
          <div className="font-semibold mb-1">How flow rate conversions work</div>
          <div>
            Flow rate conversions are performed by first converting the input value to the base unit (<b>L/hr</b>), then converting to the target unit using its factor.<br /><br />
            <span className="font-mono">value_in_to_unit = (input / from_factor) × to_factor</span><br />
            For example, to convert 120 L/hr to gal/min:<br />
            <span className="font-mono">120 / 1 × 0.264172 ÷ 60 = 0.5283 gal/min</span><br />
            To convert 10 m³/hr to L/min:<br />
            <span className="font-mono">10 / 0.001 × 1/60 = 166.67 L/min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
