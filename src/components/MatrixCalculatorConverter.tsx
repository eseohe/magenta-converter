import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Grid3X3, Copy, RotateCcw, Calculator, Plus, Minus, X } from "lucide-react";

interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

export function MatrixCalculatorConverter() {
  const [matrixA, setMatrixA] = useState<Matrix>({
    rows: 2,
    cols: 2,
    data: [[1, 2], [3, 4]]
  });

  const [matrixB, setMatrixB] = useState<Matrix>({
    rows: 2,
    cols: 2,
    data: [[5, 6], [7, 8]]
  });

  const [selectedOperation, setSelectedOperation] = useState<"add" | "subtract" | "multiply" | "determinant" | "inverse" | "transpose">("add");

  const createMatrix = (rows: number, cols: number): number[][] => {
    return Array(rows).fill(0).map(() => Array(cols).fill(0));
  };

  const updateMatrixSize = (matrix: "A" | "B", rows: number, cols: number) => {
    const newData = createMatrix(rows, cols);
    const oldMatrix = matrix === "A" ? matrixA : matrixB;
    
    // Copy existing values
    for (let i = 0; i < Math.min(rows, oldMatrix.rows); i++) {
      for (let j = 0; j < Math.min(cols, oldMatrix.cols); j++) {
        if (oldMatrix.data[i] && oldMatrix.data[i][j] !== undefined) {
          newData[i][j] = oldMatrix.data[i][j];
        }
      }
    }

    const newMatrix = { rows, cols, data: newData };
    
    if (matrix === "A") {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
  };

  const updateMatrixValue = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const targetMatrix = matrix === "A" ? matrixA : matrixB;
    const newData = [...targetMatrix.data];
    
    if (!newData[row]) newData[row] = [];
    newData[row][col] = numValue;
    
    const newMatrix = { ...targetMatrix, data: newData };
    
    if (matrix === "A") {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
  };

  const addMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.rows !== b.rows || a.cols !== b.cols) return null;
    
    const result = createMatrix(a.rows, a.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result[i][j] = (a.data[i]?.[j] || 0) + (b.data[i]?.[j] || 0);
      }
    }
    
    return { rows: a.rows, cols: a.cols, data: result };
  };

  const subtractMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.rows !== b.rows || a.cols !== b.cols) return null;
    
    const result = createMatrix(a.rows, a.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result[i][j] = (a.data[i]?.[j] || 0) - (b.data[i]?.[j] || 0);
      }
    }
    
    return { rows: a.rows, cols: a.cols, data: result };
  };

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.cols !== b.rows) return null;
    
    const result = createMatrix(a.rows, b.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += (a.data[i]?.[k] || 0) * (b.data[k]?.[j] || 0);
        }
        result[i][j] = sum;
      }
    }
    
    return { rows: a.rows, cols: b.cols, data: result };
  };

  const calculateDeterminant = (matrix: Matrix): number | null => {
    if (matrix.rows !== matrix.cols) return null;
    
    const n = matrix.rows;
    const data = matrix.data.map(row => [...row]);
    
    if (n === 1) return data[0][0];
    if (n === 2) return data[0][0] * data[1][1] - data[0][1] * data[1][0];
    
    // For larger matrices, use LU decomposition
    let det = 1;
    
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(data[k][i]) > Math.abs(data[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Swap rows
      if (maxRow !== i) {
        [data[i], data[maxRow]] = [data[maxRow], data[i]];
        det *= -1;
      }
      
      // Check for singular matrix
      if (Math.abs(data[i][i]) < 1e-10) return 0;
      
      det *= data[i][i];
      
      // Eliminate column
      for (let k = i + 1; k < n; k++) {
        const factor = data[k][i] / data[i][i];
        for (let j = i; j < n; j++) {
          data[k][j] -= factor * data[i][j];
        }
      }
    }
    
    return det;
  };

  const transposeMatrix = (matrix: Matrix): Matrix => {
    const result = createMatrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result[j][i] = matrix.data[i]?.[j] || 0;
      }
    }
    
    return { rows: matrix.cols, cols: matrix.rows, data: result };
  };

  const calculateInverse = (matrix: Matrix): Matrix | null => {
    if (matrix.rows !== matrix.cols) return null;
    
    const n = matrix.rows;
    const det = calculateDeterminant(matrix);
    
    if (!det || Math.abs(det) < 1e-10) return null;
    
    if (n === 1) {
      return { rows: 1, cols: 1, data: [[1 / matrix.data[0][0]]] };
    }
    
    if (n === 2) {
      const [[a, b], [c, d]] = matrix.data;
      const invDet = 1 / det;
      return {
        rows: 2,
        cols: 2,
        data: [
          [d * invDet, -b * invDet],
          [-c * invDet, a * invDet]
        ]
      };
    }
    
    // For larger matrices, use Gauss-Jordan elimination
    const augmented = matrix.data.map((row, i) => [
      ...row,
      ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))
    ]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Swap rows
      if (maxRow !== i) {
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      }
      
      // Check for singular matrix
      if (Math.abs(augmented[i][i]) < 1e-10) return null;
      
      // Scale pivot row
      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }
    
    // Extract inverse matrix
    const result = createMatrix(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = augmented[i][n + j];
      }
    }
    
    return { rows: n, cols: n, data: result };
  };

  const performOperation = (): Matrix | number | null => {
    switch (selectedOperation) {
      case "add":
        return addMatrices(matrixA, matrixB);
      case "subtract":
        return subtractMatrices(matrixA, matrixB);
      case "multiply":
        return multiplyMatrices(matrixA, matrixB);
      case "determinant":
        return calculateDeterminant(matrixA);
      case "inverse":
        return calculateInverse(matrixA);
      case "transpose":
        return transposeMatrix(matrixA);
      default:
        return null;
    }
  };

  const formatMatrix = (matrix: Matrix): string => {
    return matrix.data
      .map(row => 
        "[" + row.map(val => val.toFixed(3).padStart(8)).join(" ") + "]"
      )
      .join("\n");
  };

  const copyResult = async () => {
    const result = performOperation();
    
    if (result === null) {
      return;
    }
    
    let text = `Matrix Operation: ${selectedOperation.toUpperCase()}\n\n`;
    
    if (typeof result === "number") {
      text += `Result: ${result.toFixed(6)}`;
    } else {
      text += `Result Matrix (${result.rows}×${result.cols}):\n${formatMatrix(result)}`;
    }
    
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setMatrixA({
      rows: 2,
      cols: 2,
      data: [[1, 2], [3, 4]]
    });
    setMatrixB({
      rows: 2,
      cols: 2,
      data: [[5, 6], [7, 8]]
    });
    setSelectedOperation("add");
  };

  const loadExample = (example: string) => {
    switch (example) {
      case "identity":
        setMatrixA({ rows: 3, cols: 3, data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] });
        setMatrixB({ rows: 3, cols: 3, data: [[2, 3, 1], [1, 2, 3], [3, 1, 2]] });
        break;
      case "rotation":
        const angle = Math.PI / 4; // 45 degrees
        setMatrixA({ 
          rows: 2, 
          cols: 2, 
          data: [
            [Math.cos(angle), -Math.sin(angle)], 
            [Math.sin(angle), Math.cos(angle)]
          ] 
        });
        break;
      case "simple":
        setMatrixA({ rows: 2, cols: 2, data: [[1, 2], [3, 4]] });
        setMatrixB({ rows: 2, cols: 2, data: [[5, 6], [7, 8]] });
        break;
    }
  };

  const result = performOperation();
  const canPerformOperation = selectedOperation === "determinant" || 
                              selectedOperation === "inverse" || 
                              selectedOperation === "transpose" ||
                              (matrixA.rows === matrixB.rows && matrixA.cols === matrixB.cols && (selectedOperation === "add" || selectedOperation === "subtract")) ||
                              (matrixA.cols === matrixB.rows && selectedOperation === "multiply");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Grid3X3 className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Matrix Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Perform matrix operations, calculate determinants, and find inverses
        </p>
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Matrix A */}
            <Card>
              <CardHeader>
                <CardTitle>Matrix A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Rows</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={matrixA.rows}
                      onChange={(e) => updateMatrixSize("A", parseInt(e.target.value) || 1, matrixA.cols)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cols</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={matrixA.cols}
                      onChange={(e) => updateMatrixSize("A", matrixA.rows, parseInt(e.target.value) || 1)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: matrixA.rows }, (_, i) => (
                    <div key={i} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrixA.cols}, 1fr)` }}>
                      {Array.from({ length: matrixA.cols }, (_, j) => (
                        <Input
                          key={`${i}-${j}`}
                          type="number"
                          step="any"
                          value={matrixA.data[i]?.[j] || 0}
                          onChange={(e) => updateMatrixValue("A", i, j, e.target.value)}
                          className="h-8 text-xs text-center p-1"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-center text-muted-foreground">
                  {matrixA.rows}×{matrixA.cols} matrix
                </div>
              </CardContent>
            </Card>

            {/* Operation Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedOperation === "add" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("add")}
                    disabled={matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols}
                  >
                    <Plus className="size-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    variant={selectedOperation === "subtract" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("subtract")}
                    disabled={matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols}
                  >
                    <Minus className="size-4 mr-1" />
                    Subtract
                  </Button>
                  <Button
                    variant={selectedOperation === "multiply" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("multiply")}
                    disabled={matrixA.cols !== matrixB.rows}
                  >
                    <X className="size-4 mr-1" />
                    Multiply
                  </Button>
                  <Button
                    variant={selectedOperation === "transpose" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("transpose")}
                  >
                    Transpose
                  </Button>
                  <Button
                    variant={selectedOperation === "determinant" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("determinant")}
                    disabled={matrixA.rows !== matrixA.cols}
                  >
                    Det
                  </Button>
                  <Button
                    variant={selectedOperation === "inverse" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOperation("inverse")}
                    disabled={matrixA.rows !== matrixA.cols}
                  >
                    Inverse
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs">Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample("simple")}
                    >
                      2×2 Simple
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample("identity")}
                    >
                      3×3 Identity
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample("rotation")}
                    >
                      Rotation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={reset}
                    >
                      <RotateCcw className="size-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => {}} className="flex-1" disabled={!canPerformOperation}>
                    <Calculator className="size-4 mr-2" />
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={copyResult} disabled={!result}>
                    <Copy className="size-4" />
                  </Button>
                </div>

                {!canPerformOperation && (
                  <div className="text-xs text-destructive text-center">
                    {selectedOperation === "add" || selectedOperation === "subtract" 
                      ? "Matrices must have same dimensions" 
                      : selectedOperation === "multiply"
                      ? "A columns must equal B rows"
                      : selectedOperation === "determinant" || selectedOperation === "inverse"
                      ? "Matrix must be square"
                      : "Invalid operation"
                    }
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Matrix B or Result */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedOperation === "determinant" || selectedOperation === "inverse" || selectedOperation === "transpose" 
                    ? "Result" 
                    : "Matrix B"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOperation === "determinant" || selectedOperation === "inverse" || selectedOperation === "transpose" ? (
                  // Show result
                  <div className="space-y-4">
                    {result !== null && (
                      <div className="bg-muted p-4 rounded-lg">
                        {typeof result === "number" ? (
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">
                              {selectedOperation === "determinant" ? "Determinant" : "Result"}
                            </div>
                            <div className="text-2xl font-mono font-bold text-primary">
                              {result.toFixed(6)}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground text-center">
                              Result Matrix ({result.rows}×{result.cols})
                            </div>
                            <div className="font-mono text-xs bg-background p-2 rounded border overflow-auto">
                              {result.data.map((row, i) => (
                                <div key={i} className="whitespace-nowrap">
                                  [{row.map(val => val.toFixed(3).padStart(8)).join(" ")}]
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {result === null && selectedOperation === "inverse" && (
                      <div className="text-center text-destructive text-sm">
                        Matrix is singular (no inverse exists)
                      </div>
                    )}
                  </div>
                ) : (
                  // Show Matrix B input
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Rows</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={matrixB.rows}
                          onChange={(e) => updateMatrixSize("B", parseInt(e.target.value) || 1, matrixB.cols)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Cols</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={matrixB.cols}
                          onChange={(e) => updateMatrixSize("B", matrixB.rows, parseInt(e.target.value) || 1)}
                          className="h-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Array.from({ length: matrixB.rows }, (_, i) => (
                        <div key={i} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrixB.cols}, 1fr)` }}>
                          {Array.from({ length: matrixB.cols }, (_, j) => (
                            <Input
                              key={`${i}-${j}`}
                              type="number"
                              step="any"
                              value={matrixB.data[i]?.[j] || 0}
                              onChange={(e) => updateMatrixValue("B", i, j, e.target.value)}
                              className="h-8 text-xs text-center p-1"
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-center text-muted-foreground">
                      {matrixB.rows}×{matrixB.cols} matrix
                    </div>

                    {canPerformOperation && result && typeof result !== "number" && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground text-center">
                          Result ({result.rows}×{result.cols})
                        </div>
                        <div className="font-mono text-xs bg-muted p-2 rounded overflow-auto">
                          {result.data.map((row, i) => (
                            <div key={i} className="whitespace-nowrap">
                              [{row.map(val => val.toFixed(2).padStart(6)).join(" ")}]
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matrix Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Matrix A Properties</div>
                    <div className="space-y-1 text-xs">
                      <div>Dimensions: {matrixA.rows}×{matrixA.cols}</div>
                      <div>Square: {matrixA.rows === matrixA.cols ? "Yes" : "No"}</div>
                      {matrixA.rows === matrixA.cols && (
                        <>
                          <div>Determinant: {calculateDeterminant(matrixA)?.toFixed(4) || "N/A"}</div>
                          <div>Invertible: {calculateDeterminant(matrixA) !== 0 ? "Yes" : "No"}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Matrix B Properties</div>
                    <div className="space-y-1 text-xs">
                      <div>Dimensions: {matrixB.rows}×{matrixB.cols}</div>
                      <div>Square: {matrixB.rows === matrixB.cols ? "Yes" : "No"}</div>
                      {matrixB.rows === matrixB.cols && (
                        <>
                          <div>Determinant: {calculateDeterminant(matrixB)?.toFixed(4) || "N/A"}</div>
                          <div>Invertible: {calculateDeterminant(matrixB) !== 0 ? "Yes" : "No"}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Operation Compatibility</div>
                    <div className="space-y-1 text-xs">
                      <div>Addition/Subtraction: {matrixA.rows === matrixB.rows && matrixA.cols === matrixB.cols ? "✓" : "✗"}</div>
                      <div>A × B: {matrixA.cols === matrixB.rows ? "✓" : "✗"}</div>
                      <div>B × A: {matrixB.cols === matrixA.rows ? "✓" : "✗"}</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Matrix Facts</div>
                    <div className="space-y-1 text-xs">
                      <div>• Determinant exists only for square matrices</div>
                      <div>• Matrix is invertible if det ≠ 0</div>
                      <div>• (AB)ᵀ = BᵀAᵀ</div>
                      <div>• det(AB) = det(A) × det(B)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl">🔧</div>
                <div className="text-muted-foreground">
                  Advanced matrix operations coming soon
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Current Features:</div>
                    <div>• Basic operations (+, -, ×)</div>
                    <div>• Determinant calculation</div>
                    <div>• Matrix inverse</div>
                    <div>• Matrix transpose</div>
                    <div>• Up to 5×5 matrices</div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Planned Features:</div>
                    <div>• Eigenvalues & eigenvectors</div>
                    <div>• Matrix decomposition (LU, QR)</div>
                    <div>• Rank calculation</div>
                    <div>• Row reduction (RREF)</div>
                    <div>• Matrix powers</div>
                    <div>• Trace calculation</div>
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