import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calculator, Copy, RotateCcw, History } from "lucide-react";

interface CalculatorHistory {
  expression: string;
  result: string;
  timestamp: number;
}

export function ScientificCalculatorConverter() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<CalculatorHistory[]>([]);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [lastResult, setLastResult] = useState<number | null>(null);

  const addToHistory = (expression: string, result: string) => {
    const newEntry: CalculatorHistory = {
      expression,
      result,
      timestamp: Date.now()
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
  };

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay("0");
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "*":
          result = currentValue * inputValue;
          break;
        case "/":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case "^":
          result = Math.pow(currentValue, inputValue);
          break;
        case "mod":
          result = currentValue % inputValue;
          break;
        default:
          return;
      }

      const expression = `${currentValue} ${operation} ${inputValue}`;
      addToHistory(expression, result.toString());
      setDisplay(result.toString());
      setPreviousValue(result);
      setLastResult(result);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation(null as any);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForNewValue(true);
  };

  const performUnaryOperation = (op: string) => {
    const currentValue = parseFloat(display);
    let result: number;
    let expression: string;

    switch (op) {
      case "sin":
        result = angleMode === "deg" ? Math.sin((currentValue * Math.PI) / 180) : Math.sin(currentValue);
        expression = `sin(${currentValue}${angleMode === "deg" ? "°" : "rad"})`;
        break;
      case "cos":
        result = angleMode === "deg" ? Math.cos((currentValue * Math.PI) / 180) : Math.cos(currentValue);
        expression = `cos(${currentValue}${angleMode === "deg" ? "°" : "rad"})`;
        break;
      case "tan":
        result = angleMode === "deg" ? Math.tan((currentValue * Math.PI) / 180) : Math.tan(currentValue);
        expression = `tan(${currentValue}${angleMode === "deg" ? "°" : "rad"})`;
        break;
      case "asin":
        result = angleMode === "deg" ? (Math.asin(currentValue) * 180) / Math.PI : Math.asin(currentValue);
        expression = `asin(${currentValue})`;
        break;
      case "acos":
        result = angleMode === "deg" ? (Math.acos(currentValue) * 180) / Math.PI : Math.acos(currentValue);
        expression = `acos(${currentValue})`;
        break;
      case "atan":
        result = angleMode === "deg" ? (Math.atan(currentValue) * 180) / Math.PI : Math.atan(currentValue);
        expression = `atan(${currentValue})`;
        break;
      case "log":
        result = Math.log10(currentValue);
        expression = `log(${currentValue})`;
        break;
      case "ln":
        result = Math.log(currentValue);
        expression = `ln(${currentValue})`;
        break;
      case "sqrt":
        result = Math.sqrt(currentValue);
        expression = `√(${currentValue})`;
        break;
      case "square":
        result = currentValue * currentValue;
        expression = `(${currentValue})²`;
        break;
      case "cube":
        result = currentValue * currentValue * currentValue;
        expression = `(${currentValue})³`;
        break;
      case "factorial":
        result = factorial(currentValue);
        expression = `${currentValue}!`;
        break;
      case "reciprocal":
        result = currentValue !== 0 ? 1 / currentValue : 0;
        expression = `1/(${currentValue})`;
        break;
      case "negate":
        result = -currentValue;
        expression = `-(${currentValue})`;
        break;
      case "exp":
        result = Math.exp(currentValue);
        expression = `e^(${currentValue})`;
        break;
      case "10^x":
        result = Math.pow(10, currentValue);
        expression = `10^(${currentValue})`;
        break;
      default:
        return;
    }

    if (!isNaN(result) && isFinite(result)) {
      addToHistory(expression, result.toString());
      setDisplay(result.toString());
      setLastResult(result);
      setWaitingForNewValue(true);
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const insertConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case "pi":
        value = Math.PI;
        break;
      case "e":
        value = Math.E;
        break;
      case "phi":
        value = (1 + Math.sqrt(5)) / 2; // Golden ratio
        break;
      default:
        return;
    }
    setDisplay(value.toString());
    setWaitingForNewValue(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setWaitingForNewValue(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(display);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Scientific Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Advanced mathematical calculator with trigonometric, logarithmic, and statistical functions
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="history">
            <History className="size-4 mr-2" />
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Display & Memory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Display
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
                    >
                      {angleMode.toUpperCase()}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyResult}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <Input
                    value={display}
                    readOnly
                    className="text-right text-2xl font-mono bg-transparent border-none text-foreground"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Memory: {memory}</div>
                  {lastResult !== null && <div>Last Result: {lastResult}</div>}
                  <div>Angle Mode: {angleMode === "deg" ? "Degrees" : "Radians"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  <Button variant="outline" onClick={clear} className="h-12 text-red-600">
                    C
                  </Button>
                  <Button variant="outline" onClick={clearEntry} className="h-12">
                    CE
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("mod")} className="h-12">
                    mod
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("/")} className="h-12 text-primary">
                    ÷
                  </Button>

                  {/* Row 2 */}
                  <Button variant="outline" onClick={() => inputNumber("7")} className="h-12">
                    7
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("8")} className="h-12">
                    8
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("9")} className="h-12">
                    9
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("*")} className="h-12 text-primary">
                    ×
                  </Button>

                  {/* Row 3 */}
                  <Button variant="outline" onClick={() => inputNumber("4")} className="h-12">
                    4
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("5")} className="h-12">
                    5
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("6")} className="h-12">
                    6
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("-")} className="h-12 text-primary">
                    −
                  </Button>

                  {/* Row 4 */}
                  <Button variant="outline" onClick={() => inputNumber("1")} className="h-12">
                    1
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("2")} className="h-12">
                    2
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("3")} className="h-12">
                    3
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("+")} className="h-12 text-primary">
                    +
                  </Button>

                  {/* Row 5 */}
                  <Button variant="outline" onClick={() => performUnaryOperation("negate")} className="h-12">
                    ±
                  </Button>
                  <Button variant="outline" onClick={() => inputNumber("0")} className="h-12">
                    0
                  </Button>
                  <Button variant="outline" onClick={inputDecimal} className="h-12">
                    .
                  </Button>
                  <Button onClick={calculate} className="h-12 bg-primary text-primary-foreground">
                    =
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Scientific Functions */}
            <Card>
              <CardHeader>
                <CardTitle>Scientific Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => performUnaryOperation("sin")} className="h-10">
                    sin
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("cos")} className="h-10">
                    cos
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("tan")} className="h-10">
                    tan
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("asin")} className="h-10">
                    asin
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("acos")} className="h-10">
                    acos
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("atan")} className="h-10">
                    atan
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("log")} className="h-10">
                    log
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("ln")} className="h-10">
                    ln
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Power & Root Functions */}
            <Card>
              <CardHeader>
                <CardTitle>Power & Root</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => performUnaryOperation("square")} className="h-10">
                    x²
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("cube")} className="h-10">
                    x³
                  </Button>
                  <Button variant="outline" onClick={() => performOperation("^")} className="h-10">
                    xʸ
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("sqrt")} className="h-10">
                    √x
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("exp")} className="h-10">
                    eˣ
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("10^x")} className="h-10">
                    10ˣ
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("factorial")} className="h-10">
                    x!
                  </Button>
                  <Button variant="outline" onClick={() => performUnaryOperation("reciprocal")} className="h-10">
                    1/x
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Constants & Memory */}
            <Card>
              <CardHeader>
                <CardTitle>Constants & Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => insertConstant("pi")} className="h-10">
                      π
                    </Button>
                    <Button variant="outline" onClick={() => insertConstant("e")} className="h-10">
                      e
                    </Button>
                    <Button variant="outline" onClick={() => insertConstant("phi")} className="h-10">
                      φ
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" onClick={memoryAdd} className="h-10 text-xs">
                      M+
                    </Button>
                    <Button variant="outline" onClick={memorySubtract} className="h-10 text-xs">
                      M-
                    </Button>
                    <Button variant="outline" onClick={memoryRecall} className="h-10 text-xs">
                      MR
                    </Button>
                    <Button variant="outline" onClick={memoryClear} className="h-10 text-xs">
                      MC
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Calculation History</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  disabled={history.length === 0}
                >
                  <RotateCcw className="size-4 mr-2" />
                  Clear History
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No calculations yet
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((entry, index) => (
                    <div
                      key={entry.timestamp}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                      onClick={() => {
                        setDisplay(entry.result);
                        setWaitingForNewValue(true);
                      }}
                    >
                      <div className="font-mono text-sm">
                        {entry.expression} = {entry.result}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}