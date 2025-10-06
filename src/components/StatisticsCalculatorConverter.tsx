import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { BarChart3, Copy, RotateCcw, Calculator, TrendingUp } from "lucide-react";

interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  variance: number;
  standardDeviation: number;
  populationVariance: number;
  populationStandardDeviation: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
  };
  outliers: number[];
}

export function StatisticsCalculatorConverter() {
  const [dataInput, setDataInput] = useState("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");
  const [separatedInput, setSeparatedInput] = useState("5\n10\n15\n20\n25\n30\n35\n40");
  const [inputMethod, setInputMethod] = useState<"comma" | "line">("comma");
  const [result, setResult] = useState<StatisticsResult | null>(null);

  // Confidence interval inputs
  const [sampleMean, setSampleMean] = useState("100");
  const [sampleSize, setSampleSize] = useState("25");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [populationSD, setPopulationSD] = useState("15");

  // Regression inputs
  const [xValues, setXValues] = useState("1, 2, 3, 4, 5");
  const [yValues, setYValues] = useState("2, 4, 6, 8, 10");

  const parseData = (): number[] => {
    try {
      let data: number[];
      
      if (inputMethod === "comma") {
        data = dataInput
          .split(',')
          .map(item => parseFloat(item.trim()))
          .filter(num => !isNaN(num));
      } else {
        data = separatedInput
          .split('\n')
          .map(item => parseFloat(item.trim()))
          .filter(num => !isNaN(num));
      }
      
      return data.sort((a, b) => a - b);
    } catch (error) {
      return [];
    }
  };

  const calculateStatistics = (): StatisticsResult | null => {
    const data = parseData();
    
    if (data.length === 0) return null;

    const count = data.length;
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // Median calculation
    const median = count % 2 === 0
      ? (data[count / 2 - 1] + data[count / 2]) / 2
      : data[Math.floor(count / 2)];

    // Mode calculation
    const frequency: { [key: number]: number } = {};
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[parseFloat(key)] === maxFreq)
      .map(key => parseFloat(key));

    // Range, min, max
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Variance and Standard Deviation (sample)
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count - 1);
    const standardDeviation = Math.sqrt(variance);

    // Population variance and standard deviation
    const populationVariance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const populationStandardDeviation = Math.sqrt(populationVariance);

    // Quartiles
    const q1Index = Math.floor(count / 4);
    const q3Index = Math.floor((3 * count) / 4);
    const q1 = count % 4 === 0
      ? (data[q1Index - 1] + data[q1Index]) / 2
      : data[q1Index];
    const q3 = count % 4 === 0
      ? (data[q3Index - 1] + data[q3Index]) / 2
      : data[q3Index];
    const iqr = q3 - q1;

    // Outliers (using IQR method)
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = data.filter(val => val < lowerBound || val > upperBound);

    return {
      count,
      sum,
      mean,
      median,
      mode,
      range,
      min,
      max,
      variance,
      standardDeviation,
      populationVariance,
      populationStandardDeviation,
      quartiles: {
        q1,
        q2: median,
        q3,
        iqr
      },
      outliers
    };
  };

  const calculateConfidenceInterval = () => {
    const mean = parseFloat(sampleMean);
    const n = parseFloat(sampleSize);
    const confidence = parseFloat(confidenceLevel);
    const sigma = parseFloat(populationSD);

    // Z-scores for common confidence levels
    const zScores: { [key: number]: number } = {
      90: 1.645,
      95: 1.96,
      99: 2.576
    };

    const zScore = zScores[confidence] || 1.96;
    const marginOfError = zScore * (sigma / Math.sqrt(n));
    const lowerBound = mean - marginOfError;
    const upperBound = mean + marginOfError;

    return {
      lowerBound,
      upperBound,
      marginOfError,
      zScore
    };
  };

  const calculateLinearRegression = () => {
    const x = xValues.split(',').map(val => parseFloat(val.trim())).filter(num => !isNaN(num));
    const y = yValues.split(',').map(val => parseFloat(val.trim())).filter(num => !isNaN(num));

    if (x.length !== y.length || x.length < 2) return null;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    // Calculate slope (m) and y-intercept (b)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const yIntercept = (sumY - slope * sumX) / n;

    // Calculate correlation coefficient (r)
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const correlation = numerator / denominator;

    // Calculate R-squared
    const rSquared = correlation * correlation;

    return {
      slope,
      yIntercept,
      correlation,
      rSquared,
      equation: `y = ${slope.toFixed(4)}x + ${yIntercept.toFixed(4)}`,
      n
    };
  };

  const calculate = () => {
    const stats = calculateStatistics();
    setResult(stats);
  };

  const copyResult = async () => {
    if (!result) return;

    const text = `Statistical Analysis Results:

Dataset: ${parseData().join(', ')}

Descriptive Statistics:
Count: ${result.count}
Sum: ${result.sum.toFixed(3)}
Mean (Average): ${result.mean.toFixed(3)}
Median: ${result.median.toFixed(3)}
Mode: ${result.mode.join(', ')}
Range: ${result.range.toFixed(3)}
Minimum: ${result.min}
Maximum: ${result.max}

Variability Measures:
Sample Variance: ${result.variance.toFixed(6)}
Sample Standard Deviation: ${result.standardDeviation.toFixed(6)}
Population Variance: ${result.populationVariance.toFixed(6)}
Population Standard Deviation: ${result.populationStandardDeviation.toFixed(6)}

Quartiles:
Q1 (25th percentile): ${result.quartiles.q1.toFixed(3)}
Q2 (50th percentile/Median): ${result.quartiles.q2.toFixed(3)}
Q3 (75th percentile): ${result.quartiles.q3.toFixed(3)}
Interquartile Range (IQR): ${result.quartiles.iqr.toFixed(3)}

Outliers: ${result.outliers.length > 0 ? result.outliers.join(', ') : 'None detected'}
`;

    try {
      await navigator.clipboard.writeText(text.trim());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setDataInput("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");
    setSeparatedInput("5\n10\n15\n20\n25\n30\n35\n40");
    setSampleMean("100");
    setSampleSize("25");
    setConfidenceLevel("95");
    setPopulationSD("15");
    setXValues("1, 2, 3, 4, 5");
    setYValues("2, 4, 6, 8, 10");
    setResult(null);
  };

  const currentResult = result || calculateStatistics();
  const confidenceInterval = calculateConfidenceInterval();
  const regression = calculateLinearRegression();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <BarChart3 className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Statistics Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate mean, median, mode, standard deviation, and comprehensive statistical analysis
        </p>
      </div>

      <Tabs defaultValue="descriptive" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="descriptive">Descriptive</TabsTrigger>
          <TabsTrigger value="inference">Inference</TabsTrigger>
          <TabsTrigger value="regression">Regression</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="descriptive" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle>Data Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={inputMethod === "comma" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMethod("comma")}
                      className="flex-1"
                    >
                      Comma Separated
                    </Button>
                    <Button
                      variant={inputMethod === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMethod("line")}
                      className="flex-1"
                    >
                      Line Separated
                    </Button>
                  </div>

                  {inputMethod === "comma" ? (
                    <div className="space-y-2">
                      <Label>Data (comma separated)</Label>
                      <Textarea
                        value={dataInput}
                        onChange={(e) => setDataInput(e.target.value)}
                        placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Data (one value per line)</Label>
                      <Textarea
                        value={separatedInput}
                        onChange={(e) => setSeparatedInput(e.target.value)}
                        placeholder="5&#10;10&#10;15&#10;20"
                        rows={6}
                      />
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {parseData().length} values detected
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={calculate} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Calculate Statistics
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" onClick={copyResult} disabled={!currentResult}>
                    <Copy className="size-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Quick Sample Data</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDataInput("1, 2, 3, 4, 5, 6, 7, 8, 9, 10")}
                    >
                      Sequential 1-10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDataInput("85, 90, 78, 92, 88, 76, 95, 89, 82, 91")}
                    >
                      Test Scores
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDataInput("165, 170, 158, 172, 180, 175, 168, 162, 177, 169")}
                    >
                      Heights (cm)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDataInput("2.3, 1.8, 3.1, 2.7, 2.9, 1.9, 3.4, 2.1, 2.8, 3.0")}
                    >
                      Measurements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistical Results</CardTitle>
              </CardHeader>
              <CardContent>
                {currentResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Count</div>
                        <div className="text-lg font-semibold">{currentResult.count}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Sum</div>
                        <div className="text-lg font-semibold">{currentResult.sum.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Mean</div>
                        <div className="text-lg font-semibold text-primary">{currentResult.mean.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Median</div>
                        <div className="text-lg font-semibold text-primary">{currentResult.median.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Mode</div>
                        <div className="text-lg font-semibold">{currentResult.mode.join(', ')}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Range</div>
                        <div className="text-lg font-semibold">{currentResult.range.toFixed(3)}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Variability Measures</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Sample Std Dev</div>
                          <div className="font-mono text-primary">{currentResult.standardDeviation.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Population Std Dev</div>
                          <div className="font-mono">{currentResult.populationStandardDeviation.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Sample Variance</div>
                          <div className="font-mono">{currentResult.variance.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Population Variance</div>
                          <div className="font-mono">{currentResult.populationVariance.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Quartiles & Outliers</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Q1 (25%)</div>
                          <div className="font-mono">{currentResult.quartiles.q1.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Q3 (75%)</div>
                          <div className="font-mono">{currentResult.quartiles.q3.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">IQR</div>
                          <div className="font-mono">{currentResult.quartiles.iqr.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Outliers</div>
                          <div className="font-mono text-sm">
                            {currentResult.outliers.length > 0 ? currentResult.outliers.join(', ') : 'None'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-xs">
                      <div className="font-medium mb-1">Five Number Summary:</div>
                      <div>{currentResult.min} | {currentResult.quartiles.q1.toFixed(1)} | {currentResult.median.toFixed(1)} | {currentResult.quartiles.q3.toFixed(1)} | {currentResult.max}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Enter data and click Calculate to see statistical analysis
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Interval Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sample Mean</Label>
                      <Input
                        type="number"
                        step="any"
                        value={sampleMean}
                        onChange={(e) => setSampleMean(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sample Size</Label>
                      <Input
                        type="number"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Population Std Dev</Label>
                      <Input
                        type="number"
                        step="any"
                        value={populationSD}
                        onChange={(e) => setPopulationSD(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confidence Level (%)</Label>
                      <Input
                        type="number"
                        value={confidenceLevel}
                        onChange={(e) => setConfidenceLevel(e.target.value)}
                        placeholder="95"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[90, 95, 99].map(level => (
                      <Button
                        key={level}
                        variant="outline"
                        size="sm"
                        onClick={() => setConfidenceLevel(level.toString())}
                        className="flex-1"
                      >
                        {level}%
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {confidenceLevel}% Confidence Interval
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ({confidenceInterval.lowerBound.toFixed(3)}, {confidenceInterval.upperBound.toFixed(3)})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Margin of Error: ±{confidenceInterval.marginOfError.toFixed(3)}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div><strong>Z-Score:</strong> {confidenceInterval.zScore}</div>
                    <div><strong>Standard Error:</strong> {(parseFloat(populationSD) / Math.sqrt(parseFloat(sampleSize))).toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regression" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linear Regression Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>X Values (independent variable)</Label>
                    <Input
                      value={xValues}
                      onChange={(e) => setXValues(e.target.value)}
                      placeholder="1, 2, 3, 4, 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Values (dependent variable)</Label>
                    <Input
                      value={yValues}
                      onChange={(e) => setYValues(e.target.value)}
                      placeholder="2, 4, 6, 8, 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Datasets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setXValues("1, 2, 3, 4, 5");
                          setYValues("2, 4, 6, 8, 10");
                        }}
                      >
                        Perfect Linear
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setXValues("1, 2, 3, 4, 5");
                          setYValues("1, 4, 9, 16, 25");
                        }}
                      >
                        Quadratic
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {regression && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-primary">
                            {regression.equation}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-muted-foreground">Slope (m)</div>
                            <div className="font-mono">{regression.slope.toFixed(6)}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Y-intercept (b)</div>
                            <div className="font-mono">{regression.yIntercept.toFixed(6)}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Correlation (r)</div>
                            <div className="font-mono">{regression.correlation.toFixed(6)}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">R-squared</div>
                            <div className="font-mono">{regression.rSquared.toFixed(6)}</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Sample size: {regression.n} pairs
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted p-3 rounded-lg text-xs">
                    <div className="font-medium mb-1">Correlation Strength:</div>
                    <div>0.7-1.0: Strong positive</div>
                    <div>0.3-0.7: Moderate positive</div>
                    <div>-0.3-0.3: Weak/No correlation</div>
                    <div>-0.7--0.3: Moderate negative</div>
                    <div>-1.0--0.7: Strong negative</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl">📈</div>
                <div className="text-muted-foreground">
                  Advanced distribution analysis and probability calculations coming soon
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Current Features:</div>
                    <div>• Descriptive statistics</div>
                    <div>• Confidence intervals</div>
                    <div>• Linear regression</div>
                    <div>• Outlier detection</div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Planned Features:</div>
                    <div>• Normal distribution</div>
                    <div>• t-distribution</div>
                    <div>• Chi-square tests</div>
                    <div>• Hypothesis testing</div>
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