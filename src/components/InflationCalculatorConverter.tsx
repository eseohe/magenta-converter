import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { TrendingDown, Copy, RefreshCcw, DollarSign } from "lucide-react";
import { formatNumber } from "../lib/format";

interface YearlyData {
  year: number;
  value: number;
  cumulativeInflation: number;
  realValue: number;
}

export function InflationCalculatorConverter() {
  const [initialAmount, setInitialAmount] = useState("10000");
  const [startYear, setStartYear] = useState("2020");
  const [endYear, setEndYear] = useState("2024");
  const [inflationRate, setInflationRate] = useState("3.5");
  const [calculationType, setCalculationType] = useState("future"); // future, past, purchasing-power
  const [salaryAmount, setSalaryAmount] = useState("50000");
  const [customRates, setCustomRates] = useState("3.5,2.8,4.2,6.5"); // Comma-separated rates
  const [useCustomRates, setUseCustomRates] = useState(false);

  const calculateInflation = () => {
    const amount = parseFloat(initialAmount) || 0;
    const start = parseInt(startYear) || 2020;
    const end = parseInt(endYear) || 2024;
    const avgRate = (parseFloat(inflationRate) || 0) / 100;
    const salary = parseFloat(salaryAmount) || 0;
    
    // Parse custom rates if used
    let rates: number[] = [];
    if (useCustomRates) {
      rates = customRates.split(',').map(r => (parseFloat(r.trim()) || 0) / 100);
    }
    
    const years = Math.abs(end - start);
    let yearlyData: YearlyData[] = [];
    let cumulativeInflationFactor = 1;
    
    // Calculate year by year
    for (let i = 0; i <= years; i++) {
      const currentYear = start + i;
      let yearRate = avgRate;
      
      if (useCustomRates && i > 0 && i - 1 < rates.length) {
        yearRate = rates[i - 1];
      }
      
      if (i > 0) {
        cumulativeInflationFactor *= (1 + yearRate);
      }
      
      const currentValue = calculationType === 'past' ? 
        amount / cumulativeInflationFactor : 
        amount * cumulativeInflationFactor;
        
      const realValue = amount / cumulativeInflationFactor; // Always relative to start
      
      yearlyData.push({
        year: currentYear,
        value: currentValue,
        cumulativeInflation: (cumulativeInflationFactor - 1) * 100,
        realValue: realValue
      });
    }
    
    // Summary calculations
    const totalInflation = (cumulativeInflationFactor - 1) * 100;
    const finalValue = yearlyData[yearlyData.length - 1].value;
    const purchasingPowerLoss = ((amount - yearlyData[yearlyData.length - 1].realValue) / amount) * 100;
    
    // Salary analysis
    const salaryNeeded = salary * cumulativeInflationFactor;
    const salaryGap = salaryNeeded - salary;
    const salaryGapPercent = salary > 0 ? ((salaryNeeded - salary) / salary) * 100 : 0;
    
    // Investment needed to beat inflation
    const realReturnNeeded = avgRate; // Just to match inflation
    const nominalReturnNeeded = ((1 + avgRate) * (1 + avgRate)) - 1; // Rough approximation
    const investmentNeeded = amount * Math.pow(1 + nominalReturnNeeded, years);
    
    // Rule of 70 - years to double prices
    const doublingYears = avgRate > 0 ? 70 / (avgRate * 100) : 0;
    
    return {
      initialAmount: amount,
      finalValue,
      totalInflation,
      purchasingPowerLoss,
      yearlyData,
      years,
      avgInflationRate: avgRate * 100,
      salaryNeeded,
      salaryGap,
      salaryGapPercent,
      investmentNeeded,
      doublingYears,
      realReturnNeeded: realReturnNeeded * 100,
      cumulativeInflationFactor
    };
  };

  const results = calculateInflation();

    // Dynamic explanation logic
    const getExplanation = () => {
      const amount = results.initialAmount;
      const years = results.years;
      const avgRate = results.avgInflationRate / 100;
      const cumulativeFactor = results.cumulativeInflationFactor;
      let formula = "";
      let flow = "";
      if (calculationType === "future") {
        formula = `Future Value = Initial Amount × (1 + Inflation Rate)^Years`;
        flow = `FV = ${amount} × (1 + ${avgRate.toFixed(4)})^${years} = ${(amount * Math.pow(1 + avgRate, years)).toFixed(2)}`;
      } else if (calculationType === "past") {
        formula = `Past Value = Initial Amount / (1 + Inflation Rate)^Years`;
        flow = `PV = ${amount} / (1 + ${avgRate.toFixed(4)})^${years} = ${(amount / Math.pow(1 + avgRate, years)).toFixed(2)}`;
      } else {
        formula = `Purchasing Power = Initial Amount / (1 + Inflation Rate)^Years`;
        flow = `PP = ${amount} / (1 + ${avgRate.toFixed(4)})^${years} = ${(amount / Math.pow(1 + avgRate, years)).toFixed(2)}`;
      }
      return { formula, flow };
    };

    const explanation = getExplanation();

  const reset = () => {
    setInitialAmount("10000");
    setStartYear("2020");
    setEndYear("2024");
    setInflationRate("3.5");
    setCalculationType("future");
    setSalaryAmount("50000");
    setCustomRates("3.5,2.8,4.2,6.5");
    setUseCustomRates(false);
  };

  const copyResult = async () => {
    const text = `Inflation Analysis (${startYear}-${endYear}):

Initial Amount: $${formatNumber(results.initialAmount)}
${calculationType === 'future' ? 'Future Value' : calculationType === 'past' ? 'Past Value' : 'Current Value'}: $${formatNumber(results.finalValue)}
Total Inflation: ${results.totalInflation.toFixed(2)}%
Purchasing Power Loss: ${results.purchasingPowerLoss.toFixed(2)}%

Time Analysis:
Period: ${results.years} years
Average Inflation Rate: ${results.avgInflationRate.toFixed(2)}%
Price Doubling Time: ${results.doublingYears.toFixed(1)} years

Salary Analysis:
Current Salary: $${formatNumber(parseFloat(salaryAmount))}
Equivalent Salary Needed: $${formatNumber(results.salaryNeeded)}
Salary Gap: $${formatNumber(results.salaryGap)} (${results.salaryGapPercent.toFixed(2)}% increase needed)

Investment Strategy:
Real Return Needed: ${results.realReturnNeeded.toFixed(2)}%
Investment Value to Maintain Purchasing Power: $${formatNumber(results.investmentNeeded)}

Year-by-Year Breakdown:
${results.yearlyData.map(data => 
`${data.year}: $${formatNumber(data.value)} (Real: $${formatNumber(data.realValue)}, Inflation: ${data.cumulativeInflation.toFixed(1)}%)`
).join('\n')}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TrendingDown className="size-4" />
          </span>
          Inflation Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Inflation Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calculationType">Calculation Type</Label>
                <Select value={calculationType} onValueChange={setCalculationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="future">Future Value (with inflation)</SelectItem>
                    <SelectItem value="past">Past Value (deflated)</SelectItem>
                    <SelectItem value="purchasing-power">Purchasing Power Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initialAmount">Initial Amount ($)</Label>
                <Input
                  id="initialAmount"
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="10000"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="2020"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    type="number"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inflationRate">Average Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3.5"
                  disabled={useCustomRates}
                />
                <div className="text-xs text-muted-foreground">
                  US historical average: ~3.2% | Recent years: 2-8%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Advanced Options</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustomRates"
                    checked={useCustomRates}
                    onChange={(e) => setUseCustomRates(e.target.checked)}
                    className="size-4"
                  />
                  <Label htmlFor="useCustomRates" className="text-sm">Use Custom Year-by-Year Rates</Label>
                </div>
                
                {useCustomRates && (
                  <div className="space-y-2">
                    <Label htmlFor="customRates">Annual Rates (%) - Comma Separated</Label>
                    <Input
                      id="customRates"
                      type="text"
                      value={customRates}
                      onChange={(e) => setCustomRates(e.target.value)}
                      placeholder="3.5,2.8,4.2,6.5"
                    />
                    <div className="text-xs text-muted-foreground">
                      Enter rates for each year in order (e.g., 2021: 3.5%, 2022: 2.8%, etc.)
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryAmount">Current Salary ($)</Label>
                <Input
                  id="salaryAmount"
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  placeholder="50000"
                />
                <div className="text-xs text-muted-foreground">
                  For salary adjustment analysis
                </div>
              </div>
              
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Quick Facts:</strong><br/>
                Period: {results.years} years<br/>
                Avg. Rate: {results.avgInflationRate.toFixed(2)}%/year<br/>
                Price Doubling: {results.doublingYears.toFixed(1)} years
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Inflation Impact Analysis</h3>

          {/* Dynamic Explanation Section */}
          <div className="bg-background border rounded-lg p-4 mb-4">
            <div className="font-semibold mb-2">How the Calculation Works</div>
            <div className="text-sm mb-1"><strong>Formula:</strong> {explanation.formula}</div>
            <div className="text-sm"><strong>Example:</strong> {explanation.flow}</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <div className="text-sm text-muted-foreground">
                  {calculationType === 'future' ? 'Future Value' : 
                   calculationType === 'past' ? 'Past Value' : 'Current Value'}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${formatNumber(results.finalValue)}
                </div>
                <div className="text-xs text-muted-foreground">
                  from ${formatNumber(results.initialAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Inflation</div>
                <div className="text-2xl font-bold text-red-600">
                  {results.totalInflation.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  over {results.years} years
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Purchasing Power Loss</div>
                <div className="text-2xl font-bold text-orange-600">
                  {results.purchasingPowerLoss.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  real value decline
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Years Analyzed</div>
              <div className="text-xl font-semibold">
                {results.years}
              </div>
              <div className="text-xs text-muted-foreground">
                {startYear} to {endYear}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Average Rate</div>
              <div className="text-xl font-semibold">
                {results.avgInflationRate.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Annual inflation
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Price Doubling</div>
              <div className="text-xl font-semibold">
                {results.doublingYears.toFixed(1)} yrs
              </div>
              <div className="text-xs text-muted-foreground">
                Rule of 70
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Inflation Factor</div>
              <div className="text-xl font-semibold">
                {results.cumulativeInflationFactor.toFixed(3)}×
              </div>
              <div className="text-xs text-muted-foreground">
                Cumulative multiplier
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Salary & Investment Analysis</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="p-3 bg-background border rounded-lg">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="size-4" />
                    Salary Adjustment Needed
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Salary:</span>
                      <span>${formatNumber(parseFloat(salaryAmount))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Equivalent Needed:</span>
                      <span className="font-medium">${formatNumber(results.salaryNeeded)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Increase Required:</span>
                      <span className={`font-medium ${results.salaryGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${formatNumber(results.salaryGap)} ({results.salaryGapPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-background border rounded-lg">
                  <div className="text-sm font-medium mb-2">Investment Strategy</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Real Return Needed:</span>
                      <span className="font-medium">{results.realReturnNeeded.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Target:</span>
                      <span className="font-medium">${formatNumber(results.investmentNeeded)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      To maintain purchasing power of ${formatNumber(results.initialAmount)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Year-by-Year Breakdown</div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {results.yearlyData.slice(0, 10).map((data, index) => (
                    <div key={data.year} className="flex justify-between items-center p-2 bg-background border rounded text-sm">
                      <span>{data.year}</span>
                      <div className="text-right">
                        <div className="font-medium">${formatNumber(data.value)}</div>
                        <div className="text-xs text-muted-foreground">
                          Real: ${formatNumber(data.realValue)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {results.yearlyData.length > 10 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      ... and {results.yearlyData.length - 10} more years
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Inflation Insights:</strong></div>
            <div><strong>Purchasing Power:</strong> Your ${formatNumber(results.initialAmount)} from {startYear} has the same buying power as ${formatNumber(results.yearlyData[results.yearlyData.length - 1].realValue)} today - a {results.purchasingPowerLoss.toFixed(1)}% loss in purchasing power.</div>
            <div><strong>Salary Planning:</strong> To maintain the same standard of living, a ${formatNumber(parseFloat(salaryAmount))} salary from {startYear} should be ${formatNumber(results.salaryNeeded)} today.</div>
            <div><strong>Investment Strategy:</strong> You need at least {results.realReturnNeeded.toFixed(1)}% annual returns to preserve purchasing power against inflation.</div>
            <div><strong>Price Doubling:</strong> At {results.avgInflationRate.toFixed(1)}% inflation, prices will double approximately every {results.doublingYears.toFixed(1)} years.</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={reset}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={copyResult}>
            <Copy className="mr-2 size-4" />
            Copy Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}