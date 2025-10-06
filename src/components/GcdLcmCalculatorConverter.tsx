import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Share2, Copy, RotateCcw, Calculator, Plus } from "lucide-react";

interface GcdLcmResult {
  numbers: number[];
  gcd: number;
  lcm: number;
  gcdSteps: string[];
  lcmSteps: string[];
  properties: {
    gcdLcmProduct: number;
    originalProduct: number;
    areRelativelyPrime: boolean;
    commonFactors: number[];
  };
}

interface ExtendedGcdResult {
  gcd: number;
  x: number;
  y: number;
  steps: string[];
}

export function GcdLcmCalculatorConverter() {
  const [twoNumbers, setTwoNumbers] = useState({ a: "48", b: "18" });
  const [multipleNumbers, setMultipleNumbers] = useState("12, 18, 24, 30");
  const [calculationType, setCalculationType] = useState<"two" | "multiple">("two");
  const [bezoutA, setBezoutA] = useState("25");
  const [bezoutB, setBezoutB] = useState("9");

  // Euclidean algorithm for GCD
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return Math.abs(a);
  };

  // Extended Euclidean algorithm
  const extendedGcd = (a: number, b: number): ExtendedGcdResult => {
    const steps: string[] = [];
    const originalA = a;
    const originalB = b;
    
    steps.push(`Find integers x, y such that ${originalA}x + ${originalB}y = gcd(${originalA}, ${originalB})`);
    
    let oldR = a, r = b;
    let oldS = 1, s = 0;
    let oldT = 0, t = 1;
    
    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      steps.push(`${oldR} = ${quotient} × ${r} + ${oldR % r}`);
      
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];
    }
    
    steps.push(`gcd(${originalA}, ${originalB}) = ${oldR}`);
    steps.push(`${originalA} × (${oldS}) + ${originalB} × (${oldT}) = ${oldR}`);
    
    return {
      gcd: oldR,
      x: oldS,
      y: oldT,
      steps
    };
  };

  // GCD with steps
  const gcdWithSteps = (a: number, b: number): { result: number; steps: string[] } => {
    const steps: string[] = [];
    const originalA = a;
    const originalB = b;
    
    steps.push(`gcd(${originalA}, ${originalB})`);
    
    while (b !== 0) {
      const quotient = Math.floor(a / b);
      const remainder = a % b;
      steps.push(`${a} = ${quotient} × ${b} + ${remainder}`);
      [a, b] = [b, remainder];
    }
    
    steps.push(`gcd(${originalA}, ${originalB}) = ${Math.abs(a)}`);
    
    return { result: Math.abs(a), steps };
  };

  // LCM calculation
  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  // LCM for multiple numbers
  const lcmMultiple = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => lcm(acc, num));
  };

  // GCD for multiple numbers
  const gcdMultiple = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => gcd(acc, num));
  };

  // Parse numbers from string
  const parseNumbers = (str: string): number[] => {
    return str.split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  };

  // Calculate comprehensive results
  const calculateResults = (): GcdLcmResult => {
    let numbers: number[];
    
    if (calculationType === "two") {
      numbers = [parseInt(twoNumbers.a) || 0, parseInt(twoNumbers.b) || 0];
    } else {
      numbers = parseNumbers(multipleNumbers);
    }
    
    if (numbers.length === 0 || numbers.some(n => n <= 0)) {
      return {
        numbers: [],
        gcd: 0,
        lcm: 0,
        gcdSteps: ["Enter valid positive numbers"],
        lcmSteps: ["Enter valid positive numbers"],
        properties: {
          gcdLcmProduct: 0,
          originalProduct: 0,
          areRelativelyPrime: false,
          commonFactors: []
        }
      };
    }
    
    const gcdResult = gcdMultiple(numbers);
    const lcmResult = lcmMultiple(numbers);
    
    // Generate steps for two numbers
    let gcdSteps: string[] = [];
    let lcmSteps: string[] = [];
    
    if (numbers.length === 2) {
      const gcdCalc = gcdWithSteps(numbers[0], numbers[1]);
      gcdSteps = gcdCalc.steps;
      
      lcmSteps = [
        `lcm(${numbers[0]}, ${numbers[1]}) = (${numbers[0]} × ${numbers[1]}) / gcd(${numbers[0]}, ${numbers[1]})`,
        `lcm(${numbers[0]}, ${numbers[1]}) = ${numbers[0] * numbers[1]} / ${gcdResult}`,
        `lcm(${numbers[0]}, ${numbers[1]}) = ${lcmResult}`
      ];
    } else {
      gcdSteps = [`gcd(${numbers.join(', ')}) = ${gcdResult}`];
      lcmSteps = [`lcm(${numbers.join(', ')}) = ${lcmResult}`];
    }
    
    // Find common factors
    const findFactors = (n: number): number[] => {
      const factors: number[] = [];
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          factors.push(i);
          if (i !== n / i) factors.push(n / i);
        }
      }
      return factors.sort((a, b) => a - b);
    };
    
    const allFactors = numbers.map(findFactors);
    const commonFactors = allFactors.length > 0 
      ? allFactors.reduce((common, factors) => 
          common.filter(f => factors.includes(f))
        )
      : [];
    
    const originalProduct = numbers.reduce((acc, n) => acc * n, 1);
    const gcdLcmProduct = gcdResult * lcmResult;
    
    return {
      numbers,
      gcd: gcdResult,
      lcm: lcmResult,
      gcdSteps,
      lcmSteps,
      properties: {
        gcdLcmProduct,
        originalProduct: numbers.length === 2 ? originalProduct : 0,
        areRelativelyPrime: gcdResult === 1,
        commonFactors
      }
    };
  };

  // Diophantine equation solver
  const solveDiophantine = (a: number, b: number, c: number): { hasSolution: boolean; solutions: string[]; general?: string } => {
    const gcdAB = gcd(a, b);
    
    if (c % gcdAB !== 0) {
      return {
        hasSolution: false,
        solutions: [`No integer solutions exist because gcd(${a}, ${b}) = ${gcdAB} does not divide ${c}`]
      };
    }
    
    const extResult = extendedGcd(a, b);
    const x0 = extResult.x * (c / gcdAB);
    const y0 = extResult.y * (c / gcdAB);
    
    const solutions = [
      `Particular solution: x = ${x0}, y = ${y0}`,
      `Verification: ${a} × ${x0} + ${b} × ${y0} = ${a * x0 + b * y0}`
    ];
    
    const general = `General solution: x = ${x0} + ${b / gcdAB}t, y = ${y0} - ${a / gcdAB}t (t ∈ ℤ)`;
    
    return {
      hasSolution: true,
      solutions,
      general
    };
  };

  const copyResults = async () => {
    const results = calculateResults();
    
    const text = `GCD/LCM Calculation Results

Numbers: ${results.numbers.join(', ')}

GCD (Greatest Common Divisor): ${results.gcd}
LCM (Least Common Multiple): ${results.lcm}

Properties:
- Relatively Prime: ${results.properties.areRelativelyPrime ? 'Yes' : 'No'}
- Common Factors: ${results.properties.commonFactors.join(', ')}
${results.properties.originalProduct ? `- Product Verification: ${results.gcd} × ${results.lcm} = ${results.properties.gcdLcmProduct} ${results.properties.gcdLcmProduct === results.properties.originalProduct ? '✓' : '✗'}` : ''}

GCD Steps:
${results.gcdSteps.join('\n')}

LCM Steps:
${results.lcmSteps.join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyBezout = async () => {
    const result = extendedGcd(parseInt(bezoutA) || 0, parseInt(bezoutB) || 0);
    
    const text = `Extended Euclidean Algorithm / Bézout's Identity

${bezoutA} × (${result.x}) + ${bezoutB} × (${result.y}) = ${result.gcd}

Steps:
${result.steps.join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setTwoNumbers({ a: "48", b: "18" });
    setMultipleNumbers("12, 18, 24, 30");
    setBezoutA("25");
    setBezoutB("9");
    setCalculationType("two");
  };

  const results = calculateResults();
  const bezoutResult = extendedGcd(parseInt(bezoutA) || 0, parseInt(bezoutB) || 0);
  const diophantineResult = solveDiophantine(parseInt(bezoutA) || 0, parseInt(bezoutB) || 0, 1);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Share2 className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">GCD/LCM Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate Greatest Common Divisor and Least Common Multiple with detailed steps
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic GCD/LCM</TabsTrigger>
          <TabsTrigger value="extended">Extended GCD</TabsTrigger>
          <TabsTrigger value="diophantine">Diophantine</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Input Numbers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={calculationType === "two" ? "default" : "outline"}
                    onClick={() => setCalculationType("two")}
                    className="flex-1"
                  >
                    Two Numbers
                  </Button>
                  <Button
                    variant={calculationType === "multiple" ? "default" : "outline"}
                    onClick={() => setCalculationType("multiple")}
                    className="flex-1"
                  >
                    Multiple Numbers
                  </Button>
                </div>

                {calculationType === "two" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Number (a)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={twoNumbers.a}
                        onChange={(e) => setTwoNumbers(prev => ({ ...prev, a: e.target.value }))}
                        placeholder="48"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Second Number (b)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={twoNumbers.b}
                        onChange={(e) => setTwoNumbers(prev => ({ ...prev, b: e.target.value }))}
                        placeholder="18"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Numbers (comma separated)</Label>
                    <Textarea
                      value={multipleNumbers}
                      onChange={(e) => setMultipleNumbers(e.target.value)}
                      placeholder="12, 18, 24, 30"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCalculationType("two");
                        setTwoNumbers({ a: "48", b: "18" });
                      }}
                    >
                      48, 18
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCalculationType("two");
                        setTwoNumbers({ a: "60", b: "36" });
                      }}
                    >
                      60, 36
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCalculationType("multiple");
                        setMultipleNumbers("12, 18, 24");
                      }}
                    >
                      12, 18, 24
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCalculationType("multiple");
                        setMultipleNumbers("15, 25, 35");
                      }}
                    >
                      15, 25, 35
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Calculate GCD/LCM
                  </Button>
                  <Button variant="outline" onClick={copyResults}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4" />
                  </Button>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>GCD:</strong> Largest number that divides all inputs</div>
                  <div><strong>LCM:</strong> Smallest positive number divisible by all inputs</div>
                  <div><strong>Property:</strong> For two numbers: gcd(a,b) × lcm(a,b) = a × b</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results & Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.numbers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Numbers: {results.numbers.join(', ')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">GCD</div>
                            <div className="text-2xl font-bold text-primary">{results.gcd}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">LCM</div>
                            <div className="text-2xl font-bold text-primary">{results.lcm}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Relatively Prime</div>
                        <Badge variant={results.properties.areRelativelyPrime ? "default" : "secondary"}>
                          {results.properties.areRelativelyPrime ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Common Factors</div>
                        <div className="font-mono text-xs">
                          {results.properties.commonFactors.slice(0, 5).join(', ')}
                          {results.properties.commonFactors.length > 5 ? '...' : ''}
                        </div>
                      </div>
                    </div>

                    {results.properties.originalProduct > 0 && (
                      <div className="bg-background p-3 rounded border">
                        <div className="text-sm font-medium mb-1">Product Verification</div>
                        <div className="font-mono text-xs">
                          gcd × lcm = {results.gcd} × {results.lcm} = {results.properties.gcdLcmProduct}
                        </div>
                        <div className="font-mono text-xs">
                          a × b = {results.numbers[0]} × {results.numbers[1]} = {results.properties.originalProduct}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {results.properties.gcdLcmProduct === results.properties.originalProduct ? "✓ Property verified" : "✗ Error in calculation"}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                      <div className="font-medium">GCD Steps (Euclidean Algorithm)</div>
                      <div className="bg-background p-3 rounded border font-mono text-xs space-y-1">
                        {results.gcdSteps.map((step, index) => (
                          <div key={index}>{step}</div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-medium">LCM Calculation</div>
                      <div className="bg-background p-3 rounded border font-mono text-xs space-y-1">
                        {results.lcmSteps.map((step, index) => (
                          <div key={index}>{step}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Enter valid positive numbers to see GCD/LCM calculation
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="extended" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Extended Euclidean Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Find integers x, y such that ax + by = gcd(a, b)
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number a</Label>
                    <Input
                      type="number"
                      value={bezoutA}
                      onChange={(e) => setBezoutA(e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number b</Label>
                    <Input
                      type="number"
                      value={bezoutB}
                      onChange={(e) => setBezoutB(e.target.value)}
                      placeholder="9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBezoutA("25");
                        setBezoutB("9");
                      }}
                    >
                      25, 9
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBezoutA("48");
                        setBezoutB("18");
                      }}
                    >
                      48, 18
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBezoutA("17");
                        setBezoutB("13");
                      }}
                    >
                      17, 13
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBezoutA("240");
                        setBezoutB("46");
                      }}
                    >
                      240, 46
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Find Bézout Coefficients
                  </Button>
                  <Button variant="outline" onClick={copyBezout}>
                    <Copy className="size-4" />
                  </Button>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Bézout's Identity:</strong> For any integers a, b, there exist integers x, y such that ax + by = gcd(a, b)</div>
                  <div><strong>Applications:</strong> Solving linear Diophantine equations, modular arithmetic</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bézout Identity Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-mono">
                      {bezoutA} × ({bezoutResult.x}) + {bezoutB} × ({bezoutResult.y}) = {bezoutResult.gcd}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Bézout coefficients: x = {bezoutResult.x}, y = {bezoutResult.y}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-medium">Algorithm Steps</div>
                  <div className="bg-background p-3 rounded border font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                    {bezoutResult.steps.map((step, index) => (
                      <div key={index}>{step}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Verification</div>
                  <div className="bg-background p-2 rounded border font-mono text-sm">
                    {parseInt(bezoutA) * bezoutResult.x + parseInt(bezoutB) * bezoutResult.y} = {bezoutResult.gcd} ✓
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Unique Solution:</strong> The coefficients are unique modulo the quotients</div>
                  <div><strong>Alternative forms:</strong> x' = x + kb/gcd, y' = y - ka/gcd for any integer k</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diophantine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linear Diophantine Equations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Solve: ax + by = c using values from Extended GCD tab
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-mono">
                        {bezoutA}x + {bezoutB}y = c
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Currently solving for c = 1 (Bézout's identity)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Solution Status</div>
                    <Badge variant={diophantineResult.hasSolution ? "default" : "destructive"}>
                      {diophantineResult.hasSolution ? "Has Solutions" : "No Solutions"}
                    </Badge>
                  </div>

                  {diophantineResult.hasSolution && diophantineResult.general && (
                    <div className="space-y-2">
                      <div className="font-medium">General Solution</div>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        {diophantineResult.general}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Solution Details</div>
                    <div className="bg-muted p-3 rounded-lg space-y-1 font-mono text-sm">
                      {diophantineResult.solutions.map((solution, index) => (
                        <div key={index}>{solution}</div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Theory</div>
                    <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                      <div><strong>Existence:</strong> ax + by = c has integer solutions iff gcd(a,b) | c</div>
                      <div><strong>Uniqueness:</strong> If (x₀, y₀) is a solution, then all solutions are:</div>
                      <div>x = x₀ + (b/gcd(a,b))t, y = y₀ - (a/gcd(a,b))t for t ∈ ℤ</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Example Values of t</div>
                    {diophantineResult.hasSolution && (
                      <div className="bg-background p-3 rounded border font-mono text-xs space-y-1">
                        <div>t = 0: x = {bezoutResult.x}, y = {bezoutResult.y}</div>
                        <div>t = 1: x = {bezoutResult.x + parseInt(bezoutB)}, y = {bezoutResult.y - parseInt(bezoutA)}</div>
                        <div>t = -1: x = {bezoutResult.x - parseInt(bezoutB)}, y = {bezoutResult.y + parseInt(bezoutA)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-World Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Practical Applications</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Scheduling:</strong> Finding common time periods</div>
                      <div><strong>Gear Ratios:</strong> Determining gear combinations</div>
                      <div><strong>Tiling:</strong> Finding patterns that fit exactly</div>
                      <div><strong>Music:</strong> Harmonic frequencies and rhythm</div>
                      <div><strong>Fractions:</strong> Simplifying to lowest terms</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Mathematical Uses</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Number Theory:</strong> Fundamental tool for proofs</div>
                      <div><strong>Cryptography:</strong> RSA key generation</div>
                      <div><strong>Modular Arithmetic:</strong> Finding inverses</div>
                      <div><strong>Continued Fractions:</strong> Rational approximations</div>
                      <div><strong>Lattice Problems:</strong> Finding shortest vectors</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Example Problems</div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium">Clock Problem:</div>
                        <div>If one clock chimes every 6 hours and another every 8 hours, when do they chime together?</div>
                        <div className="font-mono text-xs">LCM(6, 8) = 24 hours</div>
                      </div>
                      
                      <div>
                        <div className="font-medium">Tile Problem:</div>
                        <div>What's the smallest square that can be tiled by 15×18 and 12×20 rectangles?</div>
                        <div className="font-mono text-xs">LCM(15,12) × LCM(18,20) = 60×180</div>
                      </div>

                      <div>
                        <div className="font-medium">Change Problem:</div>
                        <div>Using 25¢ and 9¢ coins, what amounts can you make?</div>
                        <div className="font-mono text-xs">All amounts ≥ (25-1)(9-1) - 25 - 9 = 182¢</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Algorithm Complexity</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Euclidean Algorithm:</strong> O(log min(a,b))</div>
                      <div><strong>Extended Euclidean:</strong> O(log min(a,b))</div>
                      <div><strong>Multiple Numbers:</strong> O(n log max(numbers))</div>
                      <div><strong>Space Complexity:</strong> O(1) iterative, O(log n) recursive</div>
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