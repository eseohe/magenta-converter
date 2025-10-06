import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Circle, Square, Hexagon, Copy, RotateCcw, Calculator } from "lucide-react";

interface GeometryResult {
  area?: number;
  perimeter?: number;
  circumference?: number;
  diameter?: number;
  radius?: number;
  diagonal?: number;
  apothem?: number;
  arcLength?: number;
  sectorArea?: number;
  volume?: number;
  surfaceArea?: number;
  isValid?: boolean;
  shape?: string;
}

export function GeometryCalculatorConverter() {
  // Circle inputs
  const [circleRadius, setCircleRadius] = useState("5");
  const [circleDiameter, setCircleDiameter] = useState("");
  const [circleCircumference, setCircleCircumference] = useState("");
  const [arcAngle, setArcAngle] = useState("90");
  const [sectorAngle, setSectorAngle] = useState("90");

  // Rectangle inputs
  const [rectLength, setRectLength] = useState("8");
  const [rectWidth, setRectWidth] = useState("6");
  const [rectHeight, setRectHeight] = useState("4"); // For 3D calculations

  // Regular polygon inputs
  const [polyNumSides, setPolyNumSides] = useState("6");
  const [polySideLength, setPolySideLength] = useState("5");

  // Ellipse inputs
  const [ellipseSemiMajor, setEllipseSemiMajor] = useState("8");
  const [ellipseSemiMinor, setEllipseSemiMinor] = useState("5");

  // Trapezoid inputs
  const [trapBase1, setTrapBase1] = useState("10");
  const [trapBase2, setTrapBase2] = useState("6");
  const [trapHeight, setTrapHeight] = useState("4");

  // Results
  const [result, setResult] = useState<GeometryResult | null>(null);

  // Circle calculations
  const calculateCircle = (): GeometryResult => {
    let radius = 0;

    // Determine radius from available inputs
    if (circleRadius) {
      radius = parseFloat(circleRadius);
    } else if (circleDiameter) {
      radius = parseFloat(circleDiameter) / 2;
    } else if (circleCircumference) {
      radius = parseFloat(circleCircumference) / (2 * Math.PI);
    } else {
      return { isValid: false };
    }

    if (radius <= 0) return { isValid: false };

    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const diameter = 2 * radius;

    // Arc calculations
    const arcAngleRad = (parseFloat(arcAngle) * Math.PI) / 180;
    const arcLength = radius * arcAngleRad;

    // Sector calculations
    const sectorAngleRad = (parseFloat(sectorAngle) * Math.PI) / 180;
    const sectorArea = 0.5 * radius * radius * sectorAngleRad;

    return {
      area,
      circumference,
      perimeter: circumference,
      diameter,
      radius,
      arcLength,
      sectorArea,
      isValid: true,
      shape: "Circle"
    };
  };

  // Rectangle/Square calculations
  const calculateRectangle = (): GeometryResult => {
    const length = parseFloat(rectLength);
    const width = parseFloat(rectWidth);
    const height = parseFloat(rectHeight);

    if (length <= 0 || width <= 0) return { isValid: false };

    const area = length * width;
    const perimeter = 2 * (length + width);
    const diagonal = Math.sqrt(length * length + width * width);

    // 3D calculations (rectangular prism)
    const volume = length * width * height;
    const surfaceArea = 2 * (length * width + length * height + width * height);

    const isSquare = Math.abs(length - width) < 0.001;

    return {
      area,
      perimeter,
      diagonal,
      volume: height > 0 ? volume : undefined,
      surfaceArea: height > 0 ? surfaceArea : undefined,
      isValid: true,
      shape: isSquare ? "Square" : "Rectangle"
    };
  };

  // Regular polygon calculations
  const calculateRegularPolygon = (): GeometryResult => {
    const n = parseInt(polyNumSides);
    const s = parseFloat(polySideLength);

    if (n < 3 || s <= 0) return { isValid: false };

    // Calculate apothem (distance from center to side)
    const apothem = s / (2 * Math.tan(Math.PI / n));
    
    // Calculate area using apothem formula
    const perimeter = n * s;
    const area = 0.5 * perimeter * apothem;
    
    // Calculate circumradius (distance from center to vertex)
    const circumradius = s / (2 * Math.sin(Math.PI / n));

    const polygonNames: { [key: number]: string } = {
      3: "Triangle", 4: "Square", 5: "Pentagon", 6: "Hexagon",
      7: "Heptagon", 8: "Octagon", 9: "Nonagon", 10: "Decagon"
    };

    return {
      area,
      perimeter,
      apothem,
      radius: circumradius,
      isValid: true,
      shape: polygonNames[n] || `${n}-sided polygon`
    };
  };

  // Ellipse calculations
  const calculateEllipse = (): GeometryResult => {
    const a = parseFloat(ellipseSemiMajor); // Semi-major axis
    const b = parseFloat(ellipseSemiMinor); // Semi-minor axis

    if (a <= 0 || b <= 0) return { isValid: false };

    const area = Math.PI * a * b;
    
    // Approximate perimeter using Ramanujan's formula
    const h = Math.pow((a - b) / (a + b), 2);
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    
    // Eccentricity
    const eccentricity = a > b ? Math.sqrt(1 - (b * b) / (a * a)) : Math.sqrt(1 - (a * a) / (b * b));

    return {
      area,
      perimeter,
      isValid: true,
      shape: `Ellipse (e=${eccentricity.toFixed(3)})`
    };
  };

  // Trapezoid calculations
  const calculateTrapezoid = (): GeometryResult => {
    const base1 = parseFloat(trapBase1);
    const base2 = parseFloat(trapBase2);
    const height = parseFloat(trapHeight);

    if (base1 <= 0 || base2 <= 0 || height <= 0) return { isValid: false };

    const area = 0.5 * (base1 + base2) * height;

    // For perimeter, we need to calculate the slant sides
    // Assuming isosceles trapezoid for simplicity
    const baseDiff = Math.abs(base1 - base2) / 2;
    const slantSide = Math.sqrt(height * height + baseDiff * baseDiff);
    const perimeter = base1 + base2 + 2 * slantSide;

    return {
      area,
      perimeter,
      isValid: true,
      shape: "Trapezoid"
    };
  };

  const copyResult = async () => {
    if (!result || !result.isValid) return;

    const lines = [`${result.shape} Calculation Results:`];
    
    if (result.area) lines.push(`Area: ${result.area.toFixed(4)} sq units`);
    if (result.perimeter) lines.push(`Perimeter: ${result.perimeter.toFixed(4)} units`);
    if (result.circumference) lines.push(`Circumference: ${result.circumference.toFixed(4)} units`);
    if (result.diameter) lines.push(`Diameter: ${result.diameter.toFixed(4)} units`);
    if (result.radius) lines.push(`Radius: ${result.radius.toFixed(4)} units`);
    if (result.diagonal) lines.push(`Diagonal: ${result.diagonal.toFixed(4)} units`);
    if (result.apothem) lines.push(`Apothem: ${result.apothem.toFixed(4)} units`);
    if (result.arcLength) lines.push(`Arc Length: ${result.arcLength.toFixed(4)} units`);
    if (result.sectorArea) lines.push(`Sector Area: ${result.sectorArea.toFixed(4)} sq units`);
    if (result.volume) lines.push(`Volume: ${result.volume.toFixed(4)} cubic units`);
    if (result.surfaceArea) lines.push(`Surface Area: ${result.surfaceArea.toFixed(4)} sq units`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setCircleRadius("5");
    setCircleDiameter("");
    setCircleCircumference("");
    setArcAngle("90");
    setSectorAngle("90");
    setRectLength("8");
    setRectWidth("6");
    setRectHeight("4");
    setPolyNumSides("6");
    setPolySideLength("5");
    setEllipseSemiMajor("8");
    setEllipseSemiMinor("5");
    setTrapBase1("10");
    setTrapBase2("6");
    setTrapHeight("4");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Circle className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Geometry Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate area, perimeter, and properties of various geometric shapes
        </p>
      </div>

      <Tabs defaultValue="circle" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="circle">Circle</TabsTrigger>
          <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
          <TabsTrigger value="polygon">Polygons</TabsTrigger>
          <TabsTrigger value="ellipse">Ellipse</TabsTrigger>
          <TabsTrigger value="trapezoid">Trapezoid</TabsTrigger>
        </TabsList>

        <TabsContent value="circle" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Circle Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Enter any one value to calculate the others:
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Radius</Label>
                      <Input
                        type="number"
                        step="any"
                        value={circleRadius}
                        onChange={(e) => {
                          setCircleRadius(e.target.value);
                          setCircleDiameter("");
                          setCircleCircumference("");
                        }}
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diameter</Label>
                      <Input
                        type="number"
                        step="any"
                        value={circleDiameter}
                        onChange={(e) => {
                          setCircleDiameter(e.target.value);
                          setCircleRadius("");
                          setCircleCircumference("");
                        }}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Circumference</Label>
                      <Input
                        type="number"
                        step="any"
                        value={circleCircumference}
                        onChange={(e) => {
                          setCircleCircumference(e.target.value);
                          setCircleRadius("");
                          setCircleDiameter("");
                        }}
                        placeholder="31.416"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="text-sm font-medium">Arc & Sector Calculations</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Arc Angle (°)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={arcAngle}
                          onChange={(e) => setArcAngle(e.target.value)}
                          placeholder="90"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sector Angle (°)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={sectorAngle}
                          onChange={(e) => setSectorAngle(e.target.value)}
                          placeholder="90"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setResult(calculateCircle())} className="flex-1">
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

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result && result.isValid ? (
                  <div className="space-y-4">
                    <div className="text-center bg-primary/10 p-3 rounded-lg">
                      <div className="font-semibold text-primary">{result.shape}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.radius && (
                        <div>
                          <div className="font-medium text-muted-foreground">Radius</div>
                          <div className="font-mono text-lg">{result.radius.toFixed(4)}</div>
                        </div>
                      )}
                      {result.diameter && (
                        <div>
                          <div className="font-medium text-muted-foreground">Diameter</div>
                          <div className="font-mono text-lg">{result.diameter.toFixed(4)}</div>
                        </div>
                      )}
                      {result.circumference && (
                        <div>
                          <div className="font-medium text-muted-foreground">Circumference</div>
                          <div className="font-mono text-lg">{result.circumference.toFixed(4)}</div>
                        </div>
                      )}
                      {result.area && (
                        <div>
                          <div className="font-medium text-muted-foreground">Area</div>
                          <div className="font-mono text-lg font-semibold text-primary">
                            {result.area.toFixed(4)}
                          </div>
                        </div>
                      )}
                      {result.arcLength && (
                        <div>
                          <div className="font-medium text-muted-foreground">Arc Length ({arcAngle}°)</div>
                          <div className="font-mono">{result.arcLength.toFixed(4)}</div>
                        </div>
                      )}
                      {result.sectorArea && (
                        <div>
                          <div className="font-medium text-muted-foreground">Sector Area ({sectorAngle}°)</div>
                          <div className="font-mono">{result.sectorArea.toFixed(4)}</div>
                        </div>
                      )}
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                      <div><strong>Formulas:</strong></div>
                      <div>• Area: π × r²</div>
                      <div>• Circumference: 2π × r</div>
                      <div>• Arc Length: r × θ (radians)</div>
                      <div>• Sector Area: ½ × r² × θ (radians)</div>
                    </div>
                  </div>
                ) : result && !result.isValid ? (
                  <div className="text-center text-red-600 py-8">
                    <div className="text-lg font-medium">Invalid Input</div>
                    <div className="text-sm">Please check your input values</div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-6xl mb-4">⭕</div>
                    <div>Enter circle properties and click Calculate</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rectangle Tab - I'll implement this next */}
        <TabsContent value="rectangle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rectangle/Square Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Length</Label>
                        <Input
                          type="number"
                          step="any"
                          value={rectLength}
                          onChange={(e) => setRectLength(e.target.value)}
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <Input
                          type="number"
                          step="any"
                          value={rectWidth}
                          onChange={(e) => setRectWidth(e.target.value)}
                          placeholder="6"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Height (for 3D calculations)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={rectHeight}
                        onChange={(e) => setRectHeight(e.target.value)}
                        placeholder="4"
                      />
                    </div>
                  </div>

                  <Button onClick={() => setResult(calculateRectangle())} className="w-full">
                    <Calculator className="size-4 mr-2" />
                    Calculate Rectangle
                  </Button>
                </div>

                <div className="space-y-4">
                  {result && result.isValid && (result.shape?.includes('Rectangle') || result.shape?.includes('Square')) ? (
                    <div className="space-y-3">
                      <div className="text-center bg-primary/10 p-3 rounded-lg">
                        <div className="font-semibold text-primary">{result.shape}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Area</div>
                          <div className="font-mono text-lg">{result.area?.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Perimeter</div>
                          <div className="font-mono text-lg">{result.perimeter?.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Diagonal</div>
                          <div className="font-mono">{result.diagonal?.toFixed(4)}</div>
                        </div>
                        {result.volume && (
                          <div>
                            <div className="font-medium text-muted-foreground">Volume</div>
                            <div className="font-mono">{result.volume.toFixed(4)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-6xl">⬛</div>
                      <div className="text-muted-foreground">Rectangle/Square Calculator</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="polygon" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regular Polygon Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of Sides</Label>
                      <Select value={polyNumSides} onValueChange={setPolyNumSides}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">Triangle (3)</SelectItem>
                          <SelectItem value="4">Square (4)</SelectItem>
                          <SelectItem value="5">Pentagon (5)</SelectItem>
                          <SelectItem value="6">Hexagon (6)</SelectItem>
                          <SelectItem value="7">Heptagon (7)</SelectItem>
                          <SelectItem value="8">Octagon (8)</SelectItem>
                          <SelectItem value="9">Nonagon (9)</SelectItem>
                          <SelectItem value="10">Decagon (10)</SelectItem>
                          <SelectItem value="12">Dodecagon (12)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Side Length</Label>
                      <Input
                        type="number"
                        step="any"
                        value={polySideLength}
                        onChange={(e) => setPolySideLength(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setPolyNumSides("6"); setPolySideLength("4");}}
                    >
                      Hexagon Example
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setPolyNumSides("8"); setPolySideLength("3");}}
                    >
                      Octagon Example
                    </Button>
                  </div>
                </div>

                <Button onClick={() => setResult(calculateRegularPolygon())} className="w-full">
                  <Calculator className="size-4 mr-2" />
                  Calculate Polygon
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Polygon Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result && result.isValid && (result.shape?.includes('gon') || result.shape?.includes('Triangle') || result.shape?.includes('Square')) ? (
                  <div className="space-y-4">
                    <div className="text-center bg-primary/10 p-3 rounded-lg">
                      <div className="font-semibold text-primary">{result.shape}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Area</div>
                        <div className="font-mono text-lg font-semibold text-primary">
                          {result.area?.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Perimeter</div>
                        <div className="font-mono text-lg">{result.perimeter?.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Apothem</div>
                        <div className="font-mono">{result.apothem?.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Circumradius</div>
                        <div className="font-mono">{result.radius?.toFixed(4)}</div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                      <div><strong>Formulas:</strong></div>
                      <div>• Area: ½ × perimeter × apothem</div>
                      <div>• Apothem: s / (2 × tan(π/n))</div>
                      <div>• Circumradius: s / (2 × sin(π/n))</div>
                      <div>• Interior angle: (n-2) × 180° / n</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⬡</div>
                    <div className="text-muted-foreground">Select polygon type and enter side length</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ellipse" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ellipse Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Semi-major Axis (a)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={ellipseSemiMajor}
                        onChange={(e) => setEllipseSemiMajor(e.target.value)}
                        placeholder="8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Semi-minor Axis (b)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={ellipseSemiMinor}
                        onChange={(e) => setEllipseSemiMinor(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setEllipseSemiMajor("10"); setEllipseSemiMinor("6");}}
                    >
                      Example 1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setEllipseSemiMajor("5"); setEllipseSemiMinor("5");}}
                    >
                      Circle (a=b)
                    </Button>
                  </div>
                </div>

                <Button onClick={() => setResult(calculateEllipse())} className="w-full">
                  <Calculator className="size-4 mr-2" />
                  Calculate Ellipse
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ellipse Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result && result.isValid && result.shape?.includes('Ellipse') ? (
                  <div className="space-y-4">
                    <div className="text-center bg-primary/10 p-3 rounded-lg">
                      <div className="font-semibold text-primary">{result.shape}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Area</div>
                        <div className="font-mono text-lg font-semibold text-primary">
                          {result.area?.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Perimeter (approx)</div>
                        <div className="font-mono text-lg">{result.perimeter?.toFixed(4)}</div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                      <div><strong>Formulas:</strong></div>
                      <div>• Area: π × a × b</div>
                      <div>• Perimeter: π(a+b)[1 + 3h/(10+√(4-3h))] (Ramanujan)</div>
                      <div>• where h = (a-b)²/(a+b)²</div>
                      <div>• Eccentricity: √(1 - b²/a²) for a {'>'} b</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⭕</div>
                    <div className="text-muted-foreground">Enter semi-major and semi-minor axes</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trapezoid" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trapezoid Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Isosceles trapezoid calculator (parallel bases)
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base 1 (top)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={trapBase1}
                          onChange={(e) => setTrapBase1(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Base 2 (bottom)</Label>
                        <Input
                          type="number"
                          step="any"
                          value={trapBase2}
                          onChange={(e) => setTrapBase2(e.target.value)}
                          placeholder="6"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        step="any"
                        value={trapHeight}
                        onChange={(e) => setTrapHeight(e.target.value)}
                        placeholder="4"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setTrapBase1("12"); setTrapBase2("8"); setTrapHeight("5");}}
                    >
                      Example 1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setTrapBase1("6"); setTrapBase2("6"); setTrapHeight("4");}}
                    >
                      Rectangle
                    </Button>
                  </div>
                </div>

                <Button onClick={() => setResult(calculateTrapezoid())} className="w-full">
                  <Calculator className="size-4 mr-2" />
                  Calculate Trapezoid
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trapezoid Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result && result.isValid && result.shape?.includes('Trapezoid') ? (
                  <div className="space-y-4">
                    <div className="text-center bg-primary/10 p-3 rounded-lg">
                      <div className="font-semibold text-primary">{result.shape}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Area</div>
                        <div className="font-mono text-lg font-semibold text-primary">
                          {result.area?.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Perimeter (approx)</div>
                        <div className="font-mono text-lg">{result.perimeter?.toFixed(4)}</div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                      <div><strong>Formulas:</strong></div>
                      <div>• Area: ½ × (b₁ + b₂) × h</div>
                      <div>• Perimeter: b₁ + b₂ + 2s (where s = slant side)</div>
                      <div>• Slant side: √(h² + ((b₁-b₂)/2)²)</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔷</div>
                    <div className="text-muted-foreground">Enter trapezoid dimensions</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}