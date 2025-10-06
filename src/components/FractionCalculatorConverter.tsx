import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calculator, Copy, RotateCcw, Plus, Minus, X, Divide } from "lucide-react";

interface Fraction {
  numerator: number;
  denominator: number;
}

interface FractionResult {
  result: Fraction;
  decimal: number;
  simplified: Fraction;
  mixedNumber?: {
    whole: number;
    fraction: Fraction;
  };
}

export function FractionCalculatorConverter() {
  // Input states
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 3 });
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide">("add");
  
  // Single fraction operations
  const [singleFraction, setSingleFraction] = useState<Fraction>({ numerator: 3, denominator: 4 });
  
  // Decimal to fraction
  const [decimalInput, setDecimalInput] = useState("0.75");
  
  // Mixed number inputs
  const [mixedNumber1, setMixedNumber1] = useState({ whole: 2, numerator: 1, denominator: 4 });
  const [mixedNumber2, setMixedNumber2] = useState({ whole: 1, numerator: 1, denominator: 6 });

  // Results
  const [calculationResult, setCalculationResult] = useState<FractionResult | null>(null);

  // Helper functions
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const simplifyFraction = (fraction: Fraction): Fraction => {
    if (fraction.denominator === 0) return { numerator: 0, denominator: 1 };
    
    const divisor = gcd(fraction.numerator, fraction.denominator);
    let numerator = fraction.numerator / divisor;
    let denominator = fraction.denominator / divisor;
    
    // Handle negative fractions - move sign to numerator
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }
    
    return { numerator, denominator };
  };

  const toMixedNumber = (fraction: Fraction): { whole: number; fraction: Fraction } | null => {
    const simplified = simplifyFraction(fraction);
    if (Math.abs(simplified.numerator) < simplified.denominator) {
      return null; // Proper fraction
    }
    
    const whole = Math.floor(Math.abs(simplified.numerator) / simplified.denominator);
    const remainingNumerator = Math.abs(simplified.numerator) % simplified.denominator;
    
    return {
      whole: simplified.numerator < 0 ? -whole : whole,
      fraction: { numerator: remainingNumerator, denominator: simplified.denominator }
    };
  };

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenominator = lcm(f1.denominator, f2.denominator);
    const numerator1 = f1.numerator * (commonDenominator / f1.denominator);
    const numerator2 = f2.numerator * (commonDenominator / f2.denominator);
    
    return {
      numerator: numerator1 + numerator2,
      denominator: commonDenominator
    };
  };

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenominator = lcm(f1.denominator, f2.denominator);
    const numerator1 = f1.numerator * (commonDenominator / f1.denominator);
    const numerator2 = f2.numerator * (commonDenominator / f2.denominator);
    
    return {
      numerator: numerator1 - numerator2,
      denominator: commonDenominator
    };
  };

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return {
      numerator: f1.numerator * f2.numerator,
      denominator: f1.denominator * f2.denominator
    };
  };

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return {
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    };
  };

  const calculateResult = (): FractionResult | null => {
    if (fraction1.denominator === 0 || fraction2.denominator === 0) return null;
    
    let result: Fraction;
    
    switch (operation) {
      case "add":
        result = addFractions(fraction1, fraction2);
        break;
      case "subtract":
        result = subtractFractions(fraction1, fraction2);
        break;
      case "multiply":
        result = multiplyFractions(fraction1, fraction2);
        break;
      case "divide":
        if (fraction2.numerator === 0) return null;
        result = divideFractions(fraction1, fraction2);
        break;
      default:
        return null;
    }
    
    const simplified = simplifyFraction(result);
    const decimal = simplified.numerator / simplified.denominator;
    const mixedNumber = toMixedNumber(simplified);
    
    return {
      result,
      simplified,
      decimal,
      mixedNumber: mixedNumber || undefined
    };
  };

  const decimalToFraction = (decimal: string): FractionResult | null => {
    const num = parseFloat(decimal);
    if (isNaN(num)) return null;
    
    // Handle simple decimals
    const decimalPlaces = decimal.split('.')[1]?.length || 0;
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(num * denominator);
    
    const fraction = { numerator, denominator };
    const simplified = simplifyFraction(fraction);
    const mixedNumber = toMixedNumber(simplified);
    
    return {
      result: fraction,
      simplified,
      decimal: num,
      mixedNumber: mixedNumber || undefined
    };
  };

  const mixedNumberToFraction = (whole: number, num: number, den: number): Fraction => {
    if (den === 0) return { numerator: 0, denominator: 1 };
    return {
      numerator: whole * den + num,
      denominator: den
    };
  };

  const formatFraction = (fraction: Fraction): string => {
    if (fraction.denominator === 1) return fraction.numerator.toString();
    return `${fraction.numerator}/${fraction.denominator}`;
  };

  const formatMixedNumber = (mixedNumber: { whole: number; fraction: Fraction }): string => {
    if (mixedNumber.fraction.numerator === 0) return mixedNumber.whole.toString();
    return `${mixedNumber.whole} ${mixedNumber.fraction.numerator}/${mixedNumber.fraction.denominator}`;
  };

  const performCalculation = () => {
    const result = calculateResult();
    setCalculationResult(result);
  };

  const copyResult = async () => {
    if (!calculationResult) return;
    
    const text = `
Fraction Calculation Result:
${formatFraction(fraction1)} ${operation} ${formatFraction(fraction2)}

Result: ${formatFraction(calculationResult.result)}
Simplified: ${formatFraction(calculationResult.simplified)}
Decimal: ${calculationResult.decimal}
${calculationResult.mixedNumber ? `Mixed Number: ${formatMixedNumber(calculationResult.mixedNumber)}` : ''}
`;
    
    try {
      await navigator.clipboard.writeText(text.trim());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setFraction1({ numerator: 1, denominator: 2 });
    setFraction2({ numerator: 1, denominator: 3 });
    setCalculationResult(null);
    setSingleFraction({ numerator: 3, denominator: 4 });
    setDecimalInput("0.75");
    setMixedNumber1({ whole: 2, numerator: 1, denominator: 4 });
    setMixedNumber2({ whole: 1, numerator: 1, denominator: 6 });
  };

  const decimalResult = decimalToFraction(decimalInput);
  const singleSimplified = simplifyFraction(singleFraction);
  const singleMixed = toMixedNumber(singleSimplified);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Fraction Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Add, subtract, multiply, and divide fractions with automatic simplification
        </p>
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="simplify">Simplify</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="mixed">Mixed Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle>Fraction Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>First Fraction</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={fraction1.numerator}
                        onChange={(e) => setFraction1(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        placeholder="Numerator"
                        className="text-center"
                      />
                      <span className="text-2xl font-bold">/</span>
                      <Input
                        type="number"
                        value={fraction1.denominator}
                        onChange={(e) => setFraction1(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        placeholder="Denominator"
                        className="text-center"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      = {(fraction1.numerator / fraction1.denominator).toFixed(4)}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex gap-1 bg-muted p-1 rounded-lg">
                      <Button
                        variant={operation === "add" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setOperation("add")}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        variant={operation === "subtract" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setOperation("subtract")}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Button
                        variant={operation === "multiply" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setOperation("multiply")}
                      >
                        <X className="size-4" />
                      </Button>
                      <Button
                        variant={operation === "divide" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setOperation("divide")}
                      >
                        <Divide className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Second Fraction</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={fraction2.numerator}
                        onChange={(e) => setFraction2(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        placeholder="Numerator"
                        className="text-center"
                      />
                      <span className="text-2xl font-bold">/</span>
                      <Input
                        type="number"
                        value={fraction2.denominator}
                        onChange={(e) => setFraction2(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        placeholder="Denominator"
                        className="text-center"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      = {(fraction2.numerator / fraction2.denominator).toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={performCalculation} className="flex-1">
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" onClick={copyResult} disabled={!calculationResult}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculationResult ? (
                  <div className="space-y-4">
                    <div className="text-center bg-muted p-6 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatFraction(fraction1)} {operation} {formatFraction(fraction2)} =
                      </div>
                      <div className="text-3xl font-mono font-bold text-primary mb-2">
                        {formatFraction(calculationResult.simplified)}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        = {calculationResult.decimal.toFixed(6)}
                      </div>
                      {calculationResult.mixedNumber && (
                        <div className="text-lg text-muted-foreground mt-2">
                          = {formatMixedNumber(calculationResult.mixedNumber)}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Step-by-step breakdown:</h4>
                      <div className="space-y-2 text-sm">
                        <div>Original: {formatFraction(calculationResult.result)}</div>
                        <div>Simplified: {formatFraction(calculationResult.simplified)}</div>
                        <div>Decimal: {calculationResult.decimal}</div>
                        {calculationResult.mixedNumber && (
                          <div>Mixed Number: {formatMixedNumber(calculationResult.mixedNumber)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Enter fractions and click Calculate to see the result
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simplify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simplify Fraction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fraction to Simplify</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={singleFraction.numerator}
                        onChange={(e) => setSingleFraction(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        placeholder="Numerator"
                        className="text-center"
                      />
                      <span className="text-2xl font-bold">/</span>
                      <Input
                        type="number"
                        value={singleFraction.denominator}
                        onChange={(e) => setSingleFraction(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        placeholder="Denominator"
                        className="text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Simplified:</div>
                    <div className="text-2xl font-mono font-bold text-primary">
                      {formatFraction(singleSimplified)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      = {(singleSimplified.numerator / singleSimplified.denominator).toFixed(6)}
                    </div>
                    {singleMixed && (
                      <div className="text-sm text-muted-foreground mt-1">
                        = {formatMixedNumber(singleMixed)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    GCD: {gcd(singleFraction.numerator, singleFraction.denominator)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decimal to Fraction Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Decimal Number</Label>
                    <Input
                      type="number"
                      step="any"
                      value={decimalInput}
                      onChange={(e) => setDecimalInput(e.target.value)}
                      placeholder="Enter decimal (e.g., 0.75)"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {decimalResult && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">As Fraction:</div>
                      <div className="text-2xl font-mono font-bold text-primary">
                        {formatFraction(decimalResult.simplified)}
                      </div>
                      {decimalResult.mixedNumber && (
                        <div className="text-sm text-muted-foreground mt-2">
                          = {formatMixedNumber(decimalResult.mixedNumber)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mixed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mixed Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>First Mixed Number</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={mixedNumber1.whole}
                        onChange={(e) => setMixedNumber1(prev => ({ ...prev, whole: parseInt(e.target.value) || 0 }))}
                        placeholder="Whole"
                        className="text-center"
                      />
                      <Input
                        type="number"
                        value={mixedNumber1.numerator}
                        onChange={(e) => setMixedNumber1(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        placeholder="Num"
                        className="text-center"
                      />
                      <span className="font-bold">/</span>
                      <Input
                        type="number"
                        value={mixedNumber1.denominator}
                        onChange={(e) => setMixedNumber1(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        placeholder="Den"
                        className="text-center"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      = {formatFraction(mixedNumberToFraction(mixedNumber1.whole, mixedNumber1.numerator, mixedNumber1.denominator))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Second Mixed Number</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={mixedNumber2.whole}
                        onChange={(e) => setMixedNumber2(prev => ({ ...prev, whole: parseInt(e.target.value) || 0 }))}
                        placeholder="Whole"
                        className="text-center"
                      />
                      <Input
                        type="number"
                        value={mixedNumber2.numerator}
                        onChange={(e) => setMixedNumber2(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        placeholder="Num"
                        className="text-center"
                      />
                      <span className="font-bold">/</span>
                      <Input
                        type="number"
                        value={mixedNumber2.denominator}
                        onChange={(e) => setMixedNumber2(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        placeholder="Den"
                        className="text-center"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      = {formatFraction(mixedNumberToFraction(mixedNumber2.whole, mixedNumber2.numerator, mixedNumber2.denominator))}
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-center space-y-2">
                    <h4 className="font-medium">Improper Fractions</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        First: {formatFraction(mixedNumberToFraction(mixedNumber1.whole, mixedNumber1.numerator, mixedNumber1.denominator))}
                      </div>
                      <div>
                        Second: {formatFraction(mixedNumberToFraction(mixedNumber2.whole, mixedNumber2.numerator, mixedNumber2.denominator))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}