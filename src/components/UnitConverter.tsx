import { useMemo, useState } from "react";
import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowUpDown, Copy, RefreshCcw } from "lucide-react";
import type { UnitCategory } from "../types";
import { convert } from "../lib/convert";
import { formatNumber } from "../lib/format";

export function UnitConverter({ category }: { category: UnitCategory }) {
  // Dynamic base unit label and explanation
  const baseUnitLabel = category.units.find(u => u.id === category.baseUnit)?.label || category.baseUnit;
  const baseUnitSymbol = category.units.find(u => u.id === category.baseUnit)?.symbol || category.baseUnit;

  // Dynamic explanation text
  const explanations: Record<string, { title: string; body: JSX.Element }> = {
    length: {
      title: "How length/distance conversions work",
      body: (
        <>
          All length and distance conversions are performed by first converting the input value to a base unit (<b>meters</b>), using the factor for the selected "from" unit. Then, the value in meters is converted to the desired "to" unit using its factor. This ensures accurate conversions between any units, including ancient and astronomical units.<br /><br />
          <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
          For example, to convert 5 miles to kilometers: <br />
          <span className="font-mono">5 × 1609.344 ÷ 1000 = 8.04672 km</span>
        </>
      ),
    },
    mass: {
      title: "How mass/weight conversions work",
      body: (
        <>
          All mass and weight conversions are performed by first converting the input value to a base unit (<b>kilograms</b>), using the factor for the selected "from" unit. Then, the value in kilograms is converted to the desired "to" unit using its factor. This ensures accurate conversions between grams, pounds, ounces, stones, and more.<br /><br />
          <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
          For example, to convert 10 pounds to kilograms: <br />
          <span className="font-mono">10 × 0.453592 ÷ 1 = 4.53592 kg</span>
        </>
      ),
    },
    temperature: {
      title: "How temperature conversions work",
      body: (
        <>
          Temperature conversions use specific formulas for each scale. For example, Celsius to Fahrenheit: <span className="font-mono">F = (C × 9/5) + 32</span>. All values are first converted to the base unit (<b>Kelvin</b>), then to the target unit.<br /><br />
          <span className="font-mono">value_in_to_unit = fromBase(toBase(input))</span><br />
          For example, to convert 25°C to Fahrenheit: <br />
          <span className="font-mono">(25 × 9/5) + 32 = 77°F</span>
        </>
      ),
    },
    volume: {
      title: "How volume conversions work",
      body: (
        <>
          All volume conversions are performed by first converting the input value to a base unit (<b>liters</b>), using the factor for the selected "from" unit. Then, the value in liters is converted to the desired "to" unit using its factor.<br /><br />
          <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
          For example, to convert 3 gallons to liters: <br />
          <span className="font-mono">3 × 3.78541 ÷ 1 = 11.35623 L</span>
        </>
      ),
    },
    area: {
      title: "How area conversions work",
      body: (
        <>
          All area conversions are performed by first converting the input value to a base unit (<b>square meters</b>), using the factor for the selected "from" unit. Then, the value in square meters is converted to the desired "to" unit using its factor.<br /><br />
          <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
        </>
      ),
    },
    science: {
      title: "How scientific unit conversions work",
      body: (
        <>
          Scientific conversions cover a wide range of physical quantities. Here are some key examples:<br /><br />
          <b>Flow Rate:</b> Measures the volume of fluid passing a point per unit time.<br />
          <span className="font-mono">flowrate = volume / time</span><br />
          For example, to convert 120 liters per hour to gallons per minute:<br />
          <span className="font-mono">120 L/hr × 0.264172 ÷ 60 = 0.5283 gal/min</span><br /><br />
          <b>Density:</b> Measures mass per unit volume.<br />
          <span className="font-mono">density = mass / volume</span><br />
          For example, to convert 1000 kg/m³ to g/cm³:<br />
          <span className="font-mono">1000 kg/m³ × 0.001 = 1 g/cm³</span><br /><br />
          All scientific conversions are performed by converting to a base unit (e.g., SI units), then to the target unit using the appropriate factor.<br /><br />
          <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
        </>
      ),
    },
    // Add more categories as needed
  };

  const categoryKey = category.id;
  const explanation = explanations[categoryKey] || {
    title: `How ${category.name} conversions work`,
    body: (
      <>
        All conversions are performed by first converting the input value to a base unit (<b>{baseUnitLabel}</b>), using the factor for the selected "from" unit. Then, the value in the base unit is converted to the desired "to" unit using its factor.<br /><br />
        <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span><br />
      </>
    ),
  };
  const swap = () => {
    setFrom(to);
    setTo(from);
  };
  const [from, setFrom] = useState(category.units[0].id);
  const [to, setTo] = useState(category.units[1]?.id ?? category.units[0].id);
  const [input, setInput] = useState<string>("1");

  // Convert units to combobox options
  const unitOptions = category.units.map(unit => ({
    value: unit.id,
    label: unit.label,
    symbol: unit.symbol
  }));

  const parsed = Number.parseFloat(input.replace(/,/g, ""));
  const result = useMemo(() => {
    if (!Number.isFinite(parsed)) return NaN;
    try {
      return convert(parsed, category, from, to);
    } catch (e) {
      return NaN;
    }
  }, [parsed, category, from, to]);

  // Step-by-step breakdown for length/distance
  const fromUnit = category.units.find(u => u.id === from);
  const toUnit = category.units.find(u => u.id === to);
  const baseValue = fromUnit ? fromUnit.toBase(parsed) : NaN;
  const finalValue = toUnit ? toUnit.fromBase(baseValue) : NaN;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">{category.name[0]}</span>
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Conversion UI */}
          <div className="flex-1 min-w-[280px]">
            <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">From</div>
                <div className="flex items-center gap-2">
                  <Input inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter value" />
                  <Combobox
                    options={unitOptions}
                    value={from}
                    onValueChange={setFrom}
                    placeholder="Select unit"
                    searchPlaceholder="Search units..."
                    className="w-[180px]"
                  />
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center pb-2">
                <Button type="button" variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={swap}>
                  <ArrowUpDown className="size-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">To</div>
                <div className="flex items-center gap-2">
                  <Input readOnly value={Number.isFinite(result) ? formatNumber(result) : ""} />
                  <Combobox
                    options={unitOptions}
                    value={to}
                    onValueChange={setTo}
                    placeholder="Select unit"
                    searchPlaceholder="Search units..."
                    className="w-[180px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Step-by-step breakdown */}
          <div className="flex-1 min-w-[280px] bg-muted/30 rounded-lg p-4">
            <div className="font-semibold mb-2">How the conversion happens</div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-mono">{input || "1"}</span> <span>{fromUnit?.label} ({fromUnit?.symbol})</span>
              </div>
              <div>
                <span className="font-mono">× {fromUnit?.toBase(1) ?? "?"}</span> <span>= <span className="font-mono">{Number.isFinite(baseValue) ? formatNumber(baseValue) : "?"}</span> {baseUnitLabel} ({baseUnitSymbol})</span>
              </div>
              <div>
                <span className="font-mono">÷ {toUnit?.toBase(1) ?? "?"}</span> <span>= <span className="font-mono">{Number.isFinite(finalValue) ? formatNumber(finalValue) : "?"}</span> {toUnit?.label} ({toUnit?.symbol})</span>
              </div>
              <Separator className="my-2" />
              <div>
                <span className="font-semibold">Formula:</span> <br />
                <span className="font-mono">value_in_to_unit = (input × from_factor) ÷ to_factor</span>
              </div>
            </div>
          </div>
        </div>
        {/* Explanation below both panels */}
        <div className="mt-8 p-4 rounded-lg bg-muted/20 text-sm">
          <div className="font-semibold mb-1">{explanation.title}</div>
          <div>{explanation.body}</div>
        </div>
      </CardContent>
    </Card>
  );
}
 
