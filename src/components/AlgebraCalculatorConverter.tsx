import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Sigma, Copy, RotateCcw, Calculator, Plus, Minus, X, Divide } from "lucide-react";

interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  roots: {
    real: boolean;
    x1: number | string;
    x2: number | string;
  };
  vertex: {
    x: number;
    y: number;
  };
  axisOfSymmetry: number;
  nature: string;
}

interface SystemResult {
  method: string;
  solution: {
    x: number;
    y: number;
  } | null;
  type: "unique" | "infinite" | "no-solution";
  steps: string[];
}

export function AlgebraCalculatorConverter() {
  // Quadratic equation inputs
  const [quadA, setQuadA] = useState("1");
  const [quadB, setQuadB] = useState("-5");
  const [quadC, setQuadC] = useState("6");

  // System of equations inputs
  const [sysA1, setSysA1] = useState("2");
  const [sysB1, setSysB1] = useState("3");
  const [sysC1, setSysC1] = useState("7");
  const [sysA2, setSysA2] = useState("4");
  const [sysB2, setSysB2] = useState("-1");
  const [sysC2, setSysC2] = useState("1");

  // Polynomial operations
  const [poly1, setPoly1] = useState("x^2 + 3x + 2");
  const [poly2, setPoly2] = useState("x + 1");
  const [polyOperation, setPolyOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | null>(null);
  const [polyEvalX, setPolyEvalX] = useState("2");

  // Expression simplifier
  const [expression, setExpression] = useState("2x + 3x - 5 + 4x - 2");

  const solveQuadratic = (): QuadraticResult => {
    const a = parseFloat(quadA) || 0;
    const b = parseFloat(quadB) || 0;
    const c = parseFloat(quadC) || 0;

    const discriminant = b * b - 4 * a * c;
    
    let roots: { real: boolean; x1: number | string; x2: number | string };
    let nature: string;

    if (a === 0) {
      // Linear equation: bx + c = 0
      if (b === 0) {
        nature = c === 0 ? "infinite solutions" : "no solution";
        roots = { real: false, x1: "undefined", x2: "undefined" };
      } else {
        const x = -c / b;
        nature = "linear equation";
        roots = { real: true, x1: x, x2: x };
      }
    } else if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      nature = "two distinct real roots";
      roots = { real: true, x1, x2 };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      nature = "one repeated real root";
      roots = { real: true, x1: x, x2: x };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      nature = "two complex roots";
      roots = { 
        real: false, 
        x1: `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
        x2: `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`
      };
    }

    const vertex = {
      x: -b / (2 * a),
      y: (4 * a * c - b * b) / (4 * a)
    };

    return {
      a,
      b,
      c,
      discriminant,
      roots,
      vertex,
      axisOfSymmetry: -b / (2 * a),
      nature
    };
  };

  const solveSystem = (): SystemResult => {
    const a1 = parseFloat(sysA1) || 0;
    const b1 = parseFloat(sysB1) || 0;
    const c1 = parseFloat(sysC1) || 0;
    const a2 = parseFloat(sysA2) || 0;
    const b2 = parseFloat(sysB2) || 0;
    const c2 = parseFloat(sysC2) || 0;

    const steps: string[] = [];
    steps.push(`Equation 1: ${a1}x + ${b1}y = ${c1}`);
    steps.push(`Equation 2: ${a2}x + ${b2}y = ${c2}`);

    // Calculate determinant
    const det = a1 * b2 - a2 * b1;
    steps.push(`Determinant: ${a1} × ${b2} - ${a2} × ${b1} = ${det}`);

    if (det === 0) {
      // Check if the system has no solution or infinite solutions
      if (a1 * c2 === a2 * c1 && b1 * c2 === b2 * c1) {
        return {
          method: "Cramer's Rule",
          solution: null,
          type: "infinite",
          steps: [...steps, "Det = 0 and equations are proportional: Infinite solutions"]
        };
      } else {
        return {
          method: "Cramer's Rule",
          solution: null,
          type: "no-solution",
          steps: [...steps, "Det = 0 and equations are inconsistent: No solution"]
        };
      }
    }

    // Unique solution using Cramer's rule
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;

    steps.push(`x = (${c1} × ${b2} - ${c2} × ${b1}) / ${det} = ${x.toFixed(4)}`);
    steps.push(`y = (${a1} × ${c2} - ${a2} × ${c1}) / ${det} = ${y.toFixed(4)}`);

    return {
      method: "Cramer's Rule",
      solution: { x, y },
      type: "unique",
      steps
    };
  };

  const simplifyExpression = (expr: string): string => {
    try {
      // Very basic algebraic simplification
      // This is a simplified version - a full algebra system would be much more complex
      
      // Remove spaces and convert to lowercase
      let simplified = expr.toLowerCase().replace(/\s/g, '');
      
      // Basic term collection for linear expressions
      if (simplified.includes('x')) {
        // Extract coefficient of x terms
        const xTerms = simplified.match(/([+-]?\d*\.?\d*)x/g) || [];
        let xCoeff = 0;
        
        xTerms.forEach(term => {
          const coeffMatch = term.match(/([+-]?\d*\.?\d*)x/);
          if (coeffMatch) {
            const coeff = coeffMatch[1];
            if (coeff === '' || coeff === '+') xCoeff += 1;
            else if (coeff === '-') xCoeff -= 1;
            else xCoeff += parseFloat(coeff);
          }
        });
        
        // Extract constant terms
        const constantTerms = simplified.match(/([+-]?\d+\.?\d*)(?!x)/g) || [];
        let constant = 0;
        
        constantTerms.forEach(term => {
          if (!term.includes('x')) {
            constant += parseFloat(term);
          }
        });
        
        // Build simplified expression
        let result = '';
        if (xCoeff !== 0) {
          if (xCoeff === 1) result += 'x';
          else if (xCoeff === -1) result += '-x';
          else result += `${xCoeff}x`;
        }
        
        if (constant !== 0) {
          if (result === '') {
            result = constant.toString();
          } else {
            result += constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
          }
        }
        
        return result || '0';
      }
      
      return "Expression too complex for basic simplifier";
    } catch (error) {
      return "Invalid expression";
    }
  };

  const factorQuadratic = (a: number, b: number, c: number): string => {
    if (a === 0) return "Not a quadratic expression";
    
    // Try to factor as (px + q)(rx + s) = prx² + (ps + qr)x + qs
    // where pr = a, ps + qr = b, qs = c
    
    for (let p = -20; p <= 20; p++) {
      if (p === 0) continue;
      for (let q = -20; q <= 20; q++) {
        for (let r = -20; r <= 20; r++) {
          if (r === 0) continue;
          for (let s = -20; s <= 20; s++) {
            if (p * r === a && p * s + q * r === b && q * s === c) {
              const factor1 = `${p === 1 ? '' : p === -1 ? '-' : p}x${q >= 0 ? ' + ' + q : ' - ' + Math.abs(q)}`;
              const factor2 = `${r === 1 ? '' : r === -1 ? '-' : r}x${s >= 0 ? ' + ' + s : ' - ' + Math.abs(s)}`;
              return `(${factor1})(${factor2})`;
            }
          }
        }
      }
    }
    
    return "Cannot factor with integer coefficients";
  };

  const copyQuadraticResult = async () => {
    const result = solveQuadratic();
    const factored = factorQuadratic(result.a, result.b, result.c);
    
    const text = `Quadratic Equation Analysis
Equation: ${result.a}x² + ${result.b}x + ${result.c} = 0

Solutions:
Nature: ${result.nature}
Root 1: ${result.roots.x1}
Root 2: ${result.roots.x2}

Properties:
Discriminant: ${result.discriminant}
Vertex: (${result.vertex.x.toFixed(4)}, ${result.vertex.y.toFixed(4)})
Axis of Symmetry: x = ${result.axisOfSymmetry.toFixed(4)}
Factored Form: ${factored}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copySystemResult = async () => {
    const result = solveSystem();
    
    let solutionText = '';
    if (result.type === 'unique' && result.solution) {
      solutionText = `x = ${result.solution.x.toFixed(4)}, y = ${result.solution.y.toFixed(4)}`;
    } else if (result.type === 'infinite') {
      solutionText = 'Infinite solutions (dependent system)';
    } else {
      solutionText = 'No solution (inconsistent system)';
    }
    
    const text = `System of Linear Equations
${result.steps.join('\n')}

Solution: ${solutionText}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Polynomial operations
  interface PolynomialTerm {
    coefficient: number;
    power: number;
  }

  const parsePolynomial = (polyStr: string): PolynomialTerm[] => {
    if (!polyStr.trim()) return [];
    
    try {
      // Remove spaces and normalize
      let normalized = polyStr.toLowerCase().replace(/\s/g, '');
      
      // Add + at beginning if doesn't start with +/-
      if (!normalized.startsWith('+') && !normalized.startsWith('-')) {
        normalized = '+' + normalized;
      }
      
      // Split into terms by + and - (keeping the signs)
      const termRegex = /[+-][^+-]+/g;
      const matches = normalized.match(termRegex) || [];
      
      const terms: PolynomialTerm[] = [];
      
      matches.forEach(termStr => {
        const term = termStr.trim();
        
        if (term.includes('x')) {
          // Term with x variable
          const xIndex = term.indexOf('x');
          let coeff = term.substring(0, xIndex);
          let power = 1;
          
          // Handle coefficient
          if (coeff === '+' || coeff === '') coeff = '1';
          else if (coeff === '-') coeff = '-1';
          
          // Handle power
          if (term.includes('^')) {
            const powerMatch = term.match(/\^(\d+)/);
            if (powerMatch) power = parseInt(powerMatch[1]);
          }
          
          terms.push({ coefficient: parseFloat(coeff), power });
        } else {
          // Constant term
          const coeff = parseFloat(term);
          if (!isNaN(coeff)) {
            terms.push({ coefficient: coeff, power: 0 });
          }
        }
      });
      
      // Combine like terms
      const combined: { [key: number]: number } = {};
      terms.forEach(term => {
        combined[term.power] = (combined[term.power] || 0) + term.coefficient;
      });
      
      // Convert back to array and sort by power (highest first)
      return Object.entries(combined)
        .map(([power, coeff]) => ({ power: parseInt(power), coefficient: coeff }))
        .filter(term => Math.abs(term.coefficient) > 1e-10) // Remove near-zero coefficients
        .sort((a, b) => b.power - a.power);
        
    } catch (error) {
      return [];
    }
  };

  const formatPolynomial = (terms: PolynomialTerm[]): string => {
    if (terms.length === 0) return "0";
    
    let result = "";
    
    terms.forEach((term, index) => {
      const { coefficient, power } = term;
      
      // Skip zero coefficients
      if (Math.abs(coefficient) < 1e-10) return;
      
      // Add sign
      if (index === 0) {
        if (coefficient < 0) result += "-";
      } else {
        result += coefficient >= 0 ? " + " : " - ";
      }
      
      // Add coefficient
      const absCoeff = Math.abs(coefficient);
      if (power === 0) {
        // Constant term
        result += absCoeff.toString();
      } else if (absCoeff === 1) {
        // Coefficient is 1, don't show it unless it's constant
        if (power === 1) result += "x";
        else result += `x^${power}`;
      } else {
        // Show coefficient
        if (power === 1) result += `${absCoeff}x`;
        else result += `${absCoeff}x^${power}`;
      }
    });
    
    return result || "0";
  };

  const addPolynomials = (poly1: PolynomialTerm[], poly2: PolynomialTerm[]): PolynomialTerm[] => {
    const result: { [key: number]: number } = {};
    
    // Add coefficients from both polynomials
    [...poly1, ...poly2].forEach(term => {
      result[term.power] = (result[term.power] || 0) + term.coefficient;
    });
    
    return Object.entries(result)
      .map(([power, coeff]) => ({ power: parseInt(power), coefficient: coeff }))
      .filter(term => Math.abs(term.coefficient) > 1e-10)
      .sort((a, b) => b.power - a.power);
  };

  const subtractPolynomials = (poly1: PolynomialTerm[], poly2: PolynomialTerm[]): PolynomialTerm[] => {
    const negatedPoly2 = poly2.map(term => ({ ...term, coefficient: -term.coefficient }));
    return addPolynomials(poly1, negatedPoly2);
  };

  const multiplyPolynomials = (poly1: PolynomialTerm[], poly2: PolynomialTerm[]): PolynomialTerm[] => {
    const result: { [key: number]: number } = {};
    
    poly1.forEach(term1 => {
      poly2.forEach(term2 => {
        const newPower = term1.power + term2.power;
        const newCoeff = term1.coefficient * term2.coefficient;
        result[newPower] = (result[newPower] || 0) + newCoeff;
      });
    });
    
    return Object.entries(result)
      .map(([power, coeff]) => ({ power: parseInt(power), coefficient: coeff }))
      .filter(term => Math.abs(term.coefficient) > 1e-10)
      .sort((a, b) => b.power - a.power);
  };

  const dividePolynomials = (dividend: PolynomialTerm[], divisor: PolynomialTerm[]): { quotient: PolynomialTerm[], remainder: PolynomialTerm[] } => {
    if (divisor.length === 0 || divisor.every(term => Math.abs(term.coefficient) < 1e-10)) {
      return { quotient: [], remainder: dividend };
    }
    
    let remainder = [...dividend];
    const quotient: PolynomialTerm[] = [];
    
    // Get leading term of divisor
    const leadingDivisor = divisor[0];
    
    while (remainder.length > 0 && remainder[0].power >= leadingDivisor.power) {
      // Calculate next term of quotient
      const leadingRemainder = remainder[0];
      const quotientTerm: PolynomialTerm = {
        coefficient: leadingRemainder.coefficient / leadingDivisor.coefficient,
        power: leadingRemainder.power - leadingDivisor.power
      };
      
      quotient.push(quotientTerm);
      
      // Multiply divisor by quotient term
      const toSubtract = multiplyPolynomials([quotientTerm], divisor);
      
      // Subtract from remainder
      remainder = subtractPolynomials(remainder, toSubtract);
      remainder = remainder.filter(term => Math.abs(term.coefficient) > 1e-10);
      remainder.sort((a, b) => b.power - a.power);
    }
    
    return {
      quotient: quotient.length > 0 ? quotient : [{ coefficient: 0, power: 0 }],
      remainder: remainder.length > 0 ? remainder : [{ coefficient: 0, power: 0 }]
    };
  };

  const evaluatePolynomial = (terms: PolynomialTerm[], x: number): number => {
    return terms.reduce((sum, term) => sum + term.coefficient * Math.pow(x, term.power), 0);
  };

  const derivativePolynomial = (terms: PolynomialTerm[]): PolynomialTerm[] => {
    return terms
      .filter(term => term.power > 0) // Remove constants
      .map(term => ({
        coefficient: term.coefficient * term.power,
        power: term.power - 1
      }))
      .filter(term => Math.abs(term.coefficient) > 1e-10);
  };

  const reset = () => {
    setQuadA("1");
    setQuadB("-5");
    setQuadC("6");
    setSysA1("2");
    setSysB1("3");
    setSysC1("7");
    setSysA2("4");
    setSysB2("-1");
    setSysC2("1");
    setPoly1("x^2 + 3x + 2");
    setPoly2("x + 1");
    setPolyOperation(null);
    setPolyEvalX("2");
    setExpression("2x + 3x - 5 + 4x - 2");
  };

  const quadraticResult = solveQuadratic();
  const systemResult = solveSystem();
  const simplified = simplifyExpression(expression);
  const factored = factorQuadratic(quadraticResult.a, quadraticResult.b, quadraticResult.c);

  // Polynomial calculations
  const parsedPoly1 = parsePolynomial(poly1);
  const parsedPoly2 = parsePolynomial(poly2);
  const polyResult = useMemo((): PolynomialTerm[] | { quotient: PolynomialTerm[], remainder: PolynomialTerm[] } | null => {
    if (!polyOperation) return null;
    
    switch (polyOperation) {
      case 'add':
        return addPolynomials(parsedPoly1, parsedPoly2);
      case 'subtract':
        return subtractPolynomials(parsedPoly1, parsedPoly2);
      case 'multiply':
        return multiplyPolynomials(parsedPoly1, parsedPoly2);
      case 'divide':
        return dividePolynomials(parsedPoly1, parsedPoly2);
      default:
        return null;
    }
  }, [poly1, poly2, polyOperation]);

  const poly1Evaluation = useMemo(() => {
    const x = parseFloat(polyEvalX);
    return isNaN(x) ? null : evaluatePolynomial(parsedPoly1, x);
  }, [poly1, polyEvalX]);

  const poly1Derivative = useMemo(() => {
    return derivativePolynomial(parsedPoly1);
  }, [poly1]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Sigma className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Algebra Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Solve equations, simplify expressions, and perform algebraic operations
        </p>
      </div>

      <Tabs defaultValue="quadratic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quadratic">Quadratic</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
          <TabsTrigger value="simplify">Simplify</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="quadratic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quadratic Input */}
            <Card>
              <CardHeader>
                <CardTitle>Quadratic Equation Solver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-lg font-mono">
                  ax² + bx + c = 0
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Coefficient a</Label>
                    <Input
                      type="number"
                      step="any"
                      value={quadA}
                      onChange={(e) => setQuadA(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coefficient b</Label>
                    <Input
                      type="number"
                      step="any"
                      value={quadB}
                      onChange={(e) => setQuadB(e.target.value)}
                      placeholder="-5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coefficient c</Label>
                    <Input
                      type="number"
                      step="any"
                      value={quadC}
                      onChange={(e) => setQuadC(e.target.value)}
                      placeholder="6"
                    />
                  </div>
                </div>

                <div className="text-center bg-muted p-3 rounded-lg font-mono">
                  {quadraticResult.a}x² + {quadraticResult.b}x + {quadraticResult.c} = 0
                </div>

                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA("1");
                        setQuadB("-5");
                        setQuadC("6");
                      }}
                    >
                      x² - 5x + 6
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA("1");
                        setQuadB("0");
                        setQuadC("-4");
                      }}
                    >
                      x² - 4
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA("1");
                        setQuadB("-4");
                        setQuadC("4");
                      }}
                    >
                      x² - 4x + 4
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA("2");
                        setQuadB("3");
                        setQuadB("5");
                      }}
                    >
                      2x² + 3x + 5
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Solve Equation
                  </Button>
                  <Button variant="outline" onClick={copyQuadraticResult}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quadratic Results */}
            <Card>
              <CardHeader>
                <CardTitle>Solution & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">Nature of Roots</div>
                      <div className="font-semibold text-primary">{quadraticResult.nature}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Root 1 (x₁)</div>
                      <div className="font-mono text-lg">{quadraticResult.roots.x1}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Root 2 (x₂)</div>
                      <div className="font-mono text-lg">{quadraticResult.roots.x2}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Discriminant</div>
                      <div className="font-mono">{quadraticResult.discriminant}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Axis of Symmetry</div>
                      <div className="font-mono">x = {quadraticResult.axisOfSymmetry.toFixed(4)}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Vertex & Properties</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Vertex</div>
                        <div className="font-mono">({quadraticResult.vertex.x.toFixed(4)}, {quadraticResult.vertex.y.toFixed(4)})</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Opens</div>
                        <div className="font-mono">{quadraticResult.a > 0 ? "Upward" : "Downward"}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Factored Form</div>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      {factored}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Quadratic Formula</div>
                    <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                      x = (-b ± √(b² - 4ac)) / (2a)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* System Input */}
            <Card>
              <CardHeader>
                <CardTitle>System of Linear Equations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Solve: a₁x + b₁y = c₁ and a₂x + b₂y = c₂
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Equation 1: a₁x + b₁y = c₁</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={sysA1}
                        onChange={(e) => setSysA1(e.target.value)}
                        placeholder="a₁"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={sysB1}
                        onChange={(e) => setSysB1(e.target.value)}
                        placeholder="b₁"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={sysC1}
                        onChange={(e) => setSysC1(e.target.value)}
                        placeholder="c₁"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Equation 2: a₂x + b₂y = c₂</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={sysA2}
                        onChange={(e) => setSysA2(e.target.value)}
                        placeholder="a₂"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={sysB2}
                        onChange={(e) => setSysB2(e.target.value)}
                        placeholder="b₂"
                      />
                      <Input
                        type="number"
                        step="any"
                        value={sysC2}
                        onChange={(e) => setSysC2(e.target.value)}
                        placeholder="c₂"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  <div>{sysA1}x + {sysB1}y = {sysC1}</div>
                  <div>{sysA2}x + {sysB2}y = {sysC2}</div>
                </div>

                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSysA1("2"); setSysB1("3"); setSysC1("7");
                        setSysA2("4"); setSysB2("-1"); setSysC2("1");
                      }}
                    >
                      Standard System
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSysA1("1"); setSysB1("1"); setSysC1("5");
                        setSysA2("2"); setSysB2("2"); setSysC2("10");
                      }}
                    >
                      Infinite Solutions
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Solve System
                  </Button>
                  <Button variant="outline" onClick={copySystemResult}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Results */}
            <Card>
              <CardHeader>
                <CardTitle>Solution Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">Solution Type</div>
                      <div className="font-semibold text-primary capitalize">
                        {systemResult.type === "unique" ? "Unique Solution" : 
                         systemResult.type === "infinite" ? "Infinite Solutions" : 
                         "No Solution"}
                      </div>
                      {systemResult.solution && (
                        <div className="font-mono text-lg">
                          x = {systemResult.solution.x.toFixed(4)}, y = {systemResult.solution.y.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Method: {systemResult.method}</div>
                    <div className="bg-muted p-3 rounded-lg space-y-1 text-sm font-mono">
                      {systemResult.steps.map((step, index) => (
                        <div key={index}>{step}</div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div><strong>Cramer's Rule:</strong> For system Ax = b, x = A⁻¹b</div>
                    <div><strong>Determinant = 0:</strong> No unique solution exists</div>
                    <div><strong>Consistent:</strong> At least one solution exists</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simplify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expression Simplifier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Expression to Simplify</Label>
                    <Textarea
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      placeholder="2x + 3x - 5 + 4x - 2"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Examples</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpression("2x + 3x - 5 + 4x - 2")}
                      >
                        Like Terms
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpression("3(x + 2) + 4(x - 1)")}
                      >
                        Distributive
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpression("x^2 + 2x + x^2 - 3x + 5")}
                      >
                        Polynomial
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpression("5x - 2x + 7 - 3 + x")}
                      >
                        Mixed Terms
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">Simplified Expression</div>
                      <div className="text-xl font-mono font-bold text-primary">
                        {simplified}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div><strong>Note:</strong> This is a basic simplifier</div>
                    <div>• Combines like terms (ax + bx = (a+b)x)</div>
                    <div>• Adds/subtracts constants</div>
                    <div>• Works best with linear expressions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Polynomial Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Polynomial 1</Label>
                    <Input
                      value={poly1}
                      onChange={(e) => setPoly1(e.target.value)}
                      placeholder="x^2 + 3x + 2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Polynomial 2</Label>
                    <Input
                      value={poly2}
                      onChange={(e) => setPoly2(e.target.value)}
                      placeholder="x + 1"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Operations</div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button 
                        variant={polyOperation === 'add' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setPolyOperation('add')}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button 
                        variant={polyOperation === 'subtract' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setPolyOperation('subtract')}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Button 
                        variant={polyOperation === 'multiply' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setPolyOperation('multiply')}
                      >
                        <X className="size-4" />
                      </Button>
                      <Button 
                        variant={polyOperation === 'divide' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setPolyOperation('divide')}
                      >
                        <Divide className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Evaluate at x =</Label>
                    <Input
                      value={polyEvalX}
                      onChange={(e) => setPolyEvalX(e.target.value)}
                      placeholder="2"
                      className="w-20"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setPoly1("2x^3 - 5x^2 + 3x - 7"); setPoly2("x^2 - 2x + 1");}}
                    >
                      Example 1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setPoly1("x^4 + 2x^2 + 1"); setPoly2("x^2 + 1");}}
                    >
                      Example 2
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {polyOperation && polyResult && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium">
                        {polyOperation === 'add' && 'Addition Result'}
                        {polyOperation === 'subtract' && 'Subtraction Result'}
                        {polyOperation === 'multiply' && 'Multiplication Result'}
                        {polyOperation === 'divide' && 'Division Result'}
                      </div>
                      <div className="bg-background p-3 rounded border">
                        {polyOperation === 'divide' && polyResult && 'quotient' in polyResult ? (
                          <div className="space-y-2 font-mono text-sm">
                            <div><strong>Quotient:</strong> {formatPolynomial(polyResult.quotient || [])}</div>
                            <div><strong>Remainder:</strong> {formatPolynomial(polyResult.remainder || [])}</div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm">
                            {formatPolynomial(Array.isArray(polyResult) ? polyResult : [])}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Polynomial Analysis</div>
                    <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                      <div><strong>P₁(x):</strong> <span className="font-mono">{formatPolynomial(parsedPoly1)}</span></div>
                      <div><strong>P₂(x):</strong> <span className="font-mono">{formatPolynomial(parsedPoly2)}</span></div>
                      {poly1Evaluation !== null && (
                        <div><strong>P₁({polyEvalX}):</strong> {poly1Evaluation.toFixed(4)}</div>
                      )}
                      <div><strong>P₁'(x):</strong> <span className="font-mono">{formatPolynomial(poly1Derivative)}</span></div>
                      <div><strong>Degree:</strong> {Math.max(...parsedPoly1.map(t => t.power), 0)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features</div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div>✓ Polynomial arithmetic operations</div>
                      <div>✓ Polynomial evaluation</div>
                      <div>✓ Derivative calculation</div>
                      <div>✓ Automatic term combination</div>
                      <div>✓ Degree analysis</div>
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