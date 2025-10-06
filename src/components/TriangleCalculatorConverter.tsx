import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Triangle, Copy, RotateCcw, Calculator } from "lucide-react";

interface TriangleResult {
  area?: number;
  perimeter?: number;
  sideA?: number;
  sideB?: number;
  sideC?: number;
  angleA?: number;
  angleB?: number;
  angleC?: number;
  height?: number;
  type?: string;
  isValid?: boolean;
}

export function TriangleCalculatorConverter() {
  // Side inputs
  const [sideA, setSideA] = useState("3");
  const [sideB, setSideB] = useState("4");
  const [sideC, setSideC] = useState("5");

  // Angle inputs (in degrees)
  const [angleA, setAngleA] = useState("60");
  const [angleB, setAngleB] = useState("60");
  const [angleC, setAngleC] = useState("60");

  // Area calculation inputs
  const [base, setBase] = useState("6");
  const [height, setHeight] = useState("4");

  // Right triangle inputs
  const [rtSideA, setRtSideA] = useState("3");
  const [rtSideB, setRtSideB] = useState("4");
  const [rtHypotenuse, setRtHypotenuse] = useState("");

  // Calculation mode
  const [calculationMode, setCalculationMode] = useState<"sss" | "sas" | "asa" | "aas" | "ssa">("sss");
  
  // Results
  const [result, setResult] = useState<TriangleResult | null>(null);

  // Helper functions
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  const toDegrees = (radians: number): number => radians * (180 / Math.PI);

  const isValidTriangle = (a: number, b: number, c: number): boolean => {
    return (a + b > c) && (a + c > b) && (b + c > a);
  };

  const getTriangleType = (a: number, b: number, c: number): string => {
    const sides = [a, b, c].sort((x, y) => x - y);
    const [short, medium, long] = sides;
    
    // Check if it's a right triangle (Pythagorean theorem)
    if (Math.abs(short * short + medium * medium - long * long) < 0.001) {
      return "Right Triangle";
    }
    
    // Check angles
    if (short === medium && medium === long) {
      return "Equilateral Triangle";
    } else if (short === medium || medium === long || short === long) {
      return "Isosceles Triangle";
    } else {
      return "Scalene Triangle";
    }
  };

  const calculateFromSSS = (): TriangleResult => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (!isValidTriangle(a, b, c)) {
      return { isValid: false };
    }

    // Calculate angles using Law of Cosines
    const angleArad = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const angleBrad = Math.acos((a * a + c * c - b * b) / (2 * a * c));
    const angleCrad = Math.PI - angleArad - angleBrad;

    const angleADeg = toDegrees(angleArad);
    const angleBDeg = toDegrees(angleBrad);
    const angleCDeg = toDegrees(angleCrad);

    // Calculate area using Heron's formula
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const perimeter = a + b + c;

    // Calculate height (using area = 0.5 * base * height)
    const heightToA = (2 * area) / a;

    return {
      sideA: a,
      sideB: b,
      sideC: c,
      angleA: angleADeg,
      angleB: angleBDeg,
      angleC: angleCDeg,
      area,
      perimeter,
      height: heightToA,
      type: getTriangleType(a, b, c),
      isValid: true
    };
  };

  const calculateFromSAS = (): TriangleResult => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const angleCValue = parseFloat(angleC);

    if (angleCValue >= 180 || angleCValue <= 0) {
      return { isValid: false };
    }

    // Calculate third side using Law of Cosines
    const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRadians(angleCValue)));

    // Calculate other angles
    const angleArad = Math.asin((a * Math.sin(toRadians(angleCValue))) / c);
    const angleBrad = Math.PI - toRadians(angleCValue) - angleArad;

    const angleADeg = toDegrees(angleArad);
    const angleBDeg = toDegrees(angleBrad);

    // Calculate area
    const area = 0.5 * a * b * Math.sin(toRadians(angleCValue));
    const perimeter = a + b + c;
    const height = (2 * area) / a;

    return {
      sideA: a,
      sideB: b,
      sideC: c,
      angleA: angleADeg,
      angleB: angleBDeg,
      angleC: angleCValue,
      area,
      perimeter,
      height,
      type: getTriangleType(a, b, c),
      isValid: true
    };
  };

  const calculateFromASA = (): TriangleResult => {
    const angleADeg = parseFloat(angleA);
    const angleBDeg = parseFloat(angleB);
    const c = parseFloat(sideC);

    const angleCDeg = 180 - angleADeg - angleBDeg;

    if (angleCDeg <= 0 || angleADeg <= 0 || angleBDeg <= 0) {
      return { isValid: false };
    }

    // Calculate sides using Law of Sines
    const angleArad = toRadians(angleADeg);
    const angleBrad = toRadians(angleBDeg);
    const angleCrad = toRadians(angleCDeg);

    const a = (c * Math.sin(angleArad)) / Math.sin(angleCrad);
    const b = (c * Math.sin(angleBrad)) / Math.sin(angleCrad);

    // Calculate area
    const area = 0.5 * a * b * Math.sin(angleCrad);
    const perimeter = a + b + c;
    const height = (2 * area) / a;

    return {
      sideA: a,
      sideB: b,
      sideC: c,
      angleA: angleADeg,
      angleB: angleBDeg,
      angleC: angleCDeg,
      area,
      perimeter,
      height,
      type: getTriangleType(a, b, c),
      isValid: true
    };
  };

  const calculateAreaFromBaseHeight = (): TriangleResult => {
    const baseValue = parseFloat(base);
    const heightValue = parseFloat(height);

    const area = 0.5 * baseValue * heightValue;

    return {
      area,
      height: heightValue,
      isValid: true
    };
  };

  const calculateRightTriangle = (): TriangleResult => {
    const a = parseFloat(rtSideA);
    const b = parseFloat(rtSideB);
    
    let c: number;
    if (rtHypotenuse) {
      c = parseFloat(rtHypotenuse);
      // Verify it's a valid right triangle
      if (Math.abs(a * a + b * b - c * c) > 0.001) {
        return { isValid: false };
      }
    } else {
      // Calculate hypotenuse
      c = Math.sqrt(a * a + b * b);
    }

    // Calculate angles
    const angleADeg = toDegrees(Math.atan(a / b));
    const angleBDeg = toDegrees(Math.atan(b / a));
    const angleCDeg = 90;

    const area = 0.5 * a * b;
    const perimeter = a + b + c;

    return {
      sideA: a,
      sideB: b,
      sideC: c,
      angleA: angleADeg,
      angleB: angleBDeg,
      angleC: angleCDeg,
      area,
      perimeter,
      height: b, // Height is one of the sides in a right triangle
      type: "Right Triangle",
      isValid: true
    };
  };

  const calculate = () => {
    let calculationResult: TriangleResult;

    switch (calculationMode) {
      case "sss":
        calculationResult = calculateFromSSS();
        break;
      case "sas":
        calculationResult = calculateFromSAS();
        break;
      case "asa":
        calculationResult = calculateFromASA();
        break;
      default:
        calculationResult = calculateFromSSS();
    }

    setResult(calculationResult);
  };

  const calculateArea = () => {
    const areaResult = calculateAreaFromBaseHeight();
    setResult(areaResult);
  };

  const calculateRT = () => {
    const rtResult = calculateRightTriangle();
    setResult(rtResult);
  };

  const copyResult = async () => {
    if (!result || !result.isValid) return;

    const text = `Triangle Calculation Results:

${result.type || 'Triangle'}
${result.sideA ? `Side A: ${result.sideA.toFixed(3)}` : ''}
${result.sideB ? `Side B: ${result.sideB.toFixed(3)}` : ''}
${result.sideC ? `Side C: ${result.sideC.toFixed(3)}` : ''}
${result.angleA ? `Angle A: ${result.angleA.toFixed(2)}°` : ''}
${result.angleB ? `Angle B: ${result.angleB.toFixed(2)}°` : ''}
${result.angleC ? `Angle C: ${result.angleC.toFixed(2)}°` : ''}
${result.area ? `Area: ${result.area.toFixed(3)} sq units` : ''}
${result.perimeter ? `Perimeter: ${result.perimeter.toFixed(3)} units` : ''}
${result.height ? `Height: ${result.height.toFixed(3)} units` : ''}
`;

    try {
      await navigator.clipboard.writeText(text.trim());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setSideA("3");
    setSideB("4");
    setSideC("5");
    setAngleA("60");
    setAngleB("60");
    setAngleC("60");
    setBase("6");
    setHeight("4");
    setRtSideA("3");
    setRtSideB("4");
    setRtHypotenuse("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Triangle className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Triangle Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate triangle properties including area, perimeter, angles, and side lengths
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="right">Right Triangle</TabsTrigger>
          <TabsTrigger value="area">Area Only</TabsTrigger>
          <TabsTrigger value="solver">Triangle Solver</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle>Triangle Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Calculation Method</Label>
                    <Select value={calculationMode} onValueChange={(value: any) => setCalculationMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sss">SSS (3 Sides)</SelectItem>
                        <SelectItem value="sas">SAS (2 Sides + Included Angle)</SelectItem>
                        <SelectItem value="asa">ASA (2 Angles + Included Side)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {calculationMode === "sss" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Side A</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideA}
                            onChange={(e) => setSideA(e.target.value)}
                            placeholder="3"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Side B</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideB}
                            onChange={(e) => setSideB(e.target.value)}
                            placeholder="4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Side C</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideC}
                            onChange={(e) => setSideC(e.target.value)}
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {calculationMode === "sas" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Side A</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideA}
                            onChange={(e) => setSideA(e.target.value)}
                            placeholder="3"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Side B</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideB}
                            onChange={(e) => setSideB(e.target.value)}
                            placeholder="4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Angle C (°)</Label>
                          <Input
                            type="number"
                            step="any"
                            value={angleC}
                            onChange={(e) => setAngleC(e.target.value)}
                            placeholder="90"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {calculationMode === "asa" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Angle A (°)</Label>
                          <Input
                            type="number"
                            step="any"
                            value={angleA}
                            onChange={(e) => setAngleA(e.target.value)}
                            placeholder="60"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Angle B (°)</Label>
                          <Input
                            type="number"
                            step="any"
                            value={angleB}
                            onChange={(e) => setAngleB(e.target.value)}
                            placeholder="60"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Side C</Label>
                          <Input
                            type="number"
                            step="any"
                            value={sideC}
                            onChange={(e) => setSideC(e.target.value)}
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={calculate} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" onClick={copyResult} disabled={!result?.isValid}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result && result.isValid ? (
                  <div className="space-y-4">
                    {result.type && (
                      <div className="text-center bg-primary/10 p-3 rounded-lg">
                        <div className="font-semibold text-primary">{result.type}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.sideA && (
                        <div>
                          <div className="font-medium text-muted-foreground">Side A</div>
                          <div className="font-mono">{result.sideA.toFixed(3)}</div>
                        </div>
                      )}
                      {result.sideB && (
                        <div>
                          <div className="font-medium text-muted-foreground">Side B</div>
                          <div className="font-mono">{result.sideB.toFixed(3)}</div>
                        </div>
                      )}
                      {result.sideC && (
                        <div>
                          <div className="font-medium text-muted-foreground">Side C</div>
                          <div className="font-mono">{result.sideC.toFixed(3)}</div>
                        </div>
                      )}
                      {result.angleA && (
                        <div>
                          <div className="font-medium text-muted-foreground">Angle A</div>
                          <div className="font-mono">{result.angleA.toFixed(2)}°</div>
                        </div>
                      )}
                      {result.angleB && (
                        <div>
                          <div className="font-medium text-muted-foreground">Angle B</div>
                          <div className="font-mono">{result.angleB.toFixed(2)}°</div>
                        </div>
                      )}
                      {result.angleC && (
                        <div>
                          <div className="font-medium text-muted-foreground">Angle C</div>
                          <div className="font-mono">{result.angleC.toFixed(2)}°</div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.area && (
                        <div>
                          <div className="font-medium text-muted-foreground">Area</div>
                          <div className="font-mono text-lg font-semibold text-primary">
                            {result.area.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">square units</div>
                        </div>
                      )}
                      {result.perimeter && (
                        <div>
                          <div className="font-medium text-muted-foreground">Perimeter</div>
                          <div className="font-mono text-lg font-semibold text-primary">
                            {result.perimeter.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">units</div>
                        </div>
                      )}
                      {result.height && (
                        <div className="col-span-2">
                          <div className="font-medium text-muted-foreground">Height (to side A)</div>
                          <div className="font-mono">{result.height.toFixed(3)} units</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : result && !result.isValid ? (
                  <div className="text-center text-red-600 py-8">
                    <div className="text-lg font-medium">Invalid Triangle</div>
                    <div className="text-sm">Please check your input values</div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Enter triangle properties and click Calculate
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="right" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Right Triangle Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Side A (adjacent)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={rtSideA}
                          onChange={(e) => setRtSideA(e.target.value)}
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Side B (opposite)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={rtSideB}
                          onChange={(e) => setRtSideB(e.target.value)}
                          placeholder="4"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Hypotenuse (optional)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={rtHypotenuse}
                        onChange={(e) => setRtHypotenuse(e.target.value)}
                        placeholder="Leave empty to calculate"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateRT} className="w-full">
                    <Calculator className="size-4 mr-2" />
                    Calculate Right Triangle
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📐</div>
                    <div className="text-sm text-muted-foreground">
                      Right Triangle (90° angle)
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg text-xs">
                    <div className="font-medium mb-2">Formulas:</div>
                    <div>• Pythagorean: a² + b² = c²</div>
                    <div>• Area: ½ × a × b</div>
                    <div>• Angle A: arctan(a/b)</div>
                    <div>• Angle B: arctan(b/a)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="area" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Triangle Area Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Base</Label>
                      <Input
                        type="number"
                        step="any"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        placeholder="6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        step="any"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="4"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateArea} className="w-full">
                    <Calculator className="size-4 mr-2" />
                    Calculate Area
                  </Button>

                  {result?.area && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">Area:</div>
                      <div className="text-3xl font-bold text-primary">
                        {result.area.toFixed(3)}
                      </div>
                      <div className="text-sm text-muted-foreground">square units</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-xs">
                    <div className="font-medium mb-2">Area Formula:</div>
                    <div className="text-center text-lg font-mono">
                      Area = ½ × base × height
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg text-xs">
                    <div className="font-medium mb-2">Other Area Formulas:</div>
                    <div>• Heron's: √(s(s-a)(s-b)(s-c))</div>
                    <div>• SAS: ½ab sin(C)</div>
                    <div>• Coordinate: ½|x₁(y₂-y₃)+x₂(y₃-y₁)+x₃(y₁-y₂)|</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solver" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Triangle Solver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl">🔺</div>
                <div className="text-muted-foreground">
                  Use the General tab above for comprehensive triangle solving with different input methods
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Supported Methods:</div>
                    <div>• SSS: Three sides known</div>
                    <div>• SAS: Two sides + included angle</div>
                    <div>• ASA: Two angles + included side</div>
                    <div>• Right triangle solver</div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Calculated Properties:</div>
                    <div>• All side lengths</div>
                    <div>• All angles</div>
                    <div>• Area and perimeter</div>
                    <div>• Triangle type classification</div>
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