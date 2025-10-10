import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ArrowRightLeft, Copy, RefreshCcw, Plus, Minus } from "lucide-react";
import { formatNumber } from "../lib/format";

export function CashFlowConverter() {
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [discountRate, setDiscountRate] = useState("10");
  const [cashFlows, setCashFlows] = useState([
    "25000", "30000", "35000", "40000", "45000"
  ]);

  const addCashFlow = () => {
    setCashFlows([...cashFlows, "0"]);
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  };

  const updateCashFlow = (index: number, value: string) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  const calculateCashFlowMetrics = () => {
    const investment = parseFloat(initialInvestment) || 0;
    const rate = (parseFloat(discountRate) || 0) / 100;
    const flows = cashFlows.map(cf => parseFloat(cf) || 0);
    
    if (investment === 0 || flows.length === 0) {
      return {
        npv: 0,
        irr: 0,
        paybackPeriod: 0,
        discountedPaybackPeriod: 0,
        profitabilityIndex: 0,
        totalCashFlow: 0,
        presentValueOfCashFlows: 0,
        cumulativeCashFlows: [],
        discountedCashFlows: []
      };
    }

    // Calculate NPV
    let npv = -investment;
    const discountedCashFlows: number[] = [];
    const cumulativeCashFlows: number[] = [];
    let cumulative = -investment;
    
    for (let i = 0; i < flows.length; i++) {
      const discountedFlow = flows[i] / Math.pow(1 + rate, i + 1);
      discountedCashFlows.push(discountedFlow);
      npv += discountedFlow;
      
      cumulative += flows[i];
      cumulativeCashFlows.push(cumulative);
    }

    const presentValueOfCashFlows = discountedCashFlows.reduce((sum, flow) => sum + flow, 0);
    const profitabilityIndex = presentValueOfCashFlows / investment;

    // Calculate IRR using Newton-Raphson method
    let irr = 0.1; // Starting guess
    for (let iteration = 0; iteration < 100; iteration++) {
      let npvAtIRR = -investment;
      let derivativeNPV = 0;
      
      for (let i = 0; i < flows.length; i++) {
        const period = i + 1;
        const discountFactor = Math.pow(1 + irr, period);
        npvAtIRR += flows[i] / discountFactor;
        derivativeNPV -= (flows[i] * period) / (discountFactor * (1 + irr));
      }
      
      if (Math.abs(npvAtIRR) < 0.01) break;
      
      if (derivativeNPV === 0) break;
      
      const newIRR = irr - npvAtIRR / derivativeNPV;
      if (Math.abs(newIRR - irr) < 0.0001) break;
      
      irr = newIRR;
      if (irr < -0.99) irr = -0.99; // Prevent extreme values
      if (irr > 10) irr = 10; // Cap at 1000%
    }

    // Calculate Payback Period
    let paybackPeriod = 0;
    let discountedPaybackPeriod = 0;
    let cumulativeUndiscounted = -investment;
    let cumulativeDiscounted = -investment;
    
    for (let i = 0; i < flows.length; i++) {
      cumulativeUndiscounted += flows[i];
      cumulativeDiscounted += discountedCashFlows[i];
      
      if (cumulativeUndiscounted >= 0 && paybackPeriod === 0) {
        paybackPeriod = i + 1 - (cumulativeUndiscounted - flows[i]) / flows[i];
      }
      
      if (cumulativeDiscounted >= 0 && discountedPaybackPeriod === 0) {
        discountedPaybackPeriod = i + 1 - (cumulativeDiscounted - discountedCashFlows[i]) / discountedCashFlows[i];
      }
    }

    if (paybackPeriod === 0) paybackPeriod = flows.length + 1; // Never pays back
    if (discountedPaybackPeriod === 0) discountedPaybackPeriod = flows.length + 1;

    const totalCashFlow = flows.reduce((sum, flow) => sum + flow, 0);

    return {
      npv,
      irr: irr * 100,
      paybackPeriod,
      discountedPaybackPeriod,
      profitabilityIndex,
      totalCashFlow,
      presentValueOfCashFlows,
      cumulativeCashFlows,
      discountedCashFlows,
      netCashFlow: totalCashFlow - investment
    };
  };

  const results = calculateCashFlowMetrics();

  const reset = () => {
    setInitialInvestment("100000");
    setDiscountRate("10");
    setCashFlows(["25000", "30000", "35000", "40000", "45000"]);
  };

  const copyResult = async () => {
    const text = `Cash Flow Analysis:
Initial Investment: $${formatNumber(parseFloat(initialInvestment))}
Discount Rate: ${parseFloat(discountRate)}%
Project Period: ${cashFlows.length} years

Results:
Net Present Value (NPV): $${formatNumber(results.npv)}
Internal Rate of Return (IRR): ${results.irr.toFixed(2)}%
Payback Period: ${results.paybackPeriod.toFixed(1)} years
Discounted Payback: ${results.discountedPaybackPeriod.toFixed(1)} years
Profitability Index: ${results.profitabilityIndex.toFixed(2)}

Cash Flow Summary:
Total Cash Inflows: $${formatNumber(results.totalCashFlow)}
Present Value of Inflows: $${formatNumber(results.presentValueOfCashFlows)}
Net Cash Flow: $${formatNumber(results.netCashFlow ?? 0)}

Investment Decision: ${results.npv > 0 ? 'ACCEPT' : 'REJECT'} (${results.npv > 0 ? 'Positive NPV' : 'Negative NPV'})

Key Terms:
- NPV: Present value of future cash flows minus initial investment
- IRR: Rate of return that makes NPV equal to zero
- Profitability Index: Present value of cash flows divided by initial investment`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ArrowRightLeft className="size-4" />
          </span>
          Cash Flow Analysis (NPV/IRR)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Investment Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="100000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (WACC) (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  step="0.1"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  placeholder="10"
                />
                <div className="text-xs text-muted-foreground">
                  Required rate of return or cost of capital
                </div>
              </div>
              
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Project Summary:</strong><br/>
                Investment: $${formatNumber(parseFloat(initialInvestment))}<br/>
                Project Period: ${cashFlows.length} years<br/>
                Total Inflows: $${formatNumber(results.totalCashFlow)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Annual Cash Flows</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCashFlow}
                  className="flex items-center gap-1"
                >
                  <Plus className="size-3" />
                  Add Year
                </Button>
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cashFlows.map((cashFlow, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-sm font-medium w-16">Year {index + 1}:</div>
                  <Input
                    type="number"
                    value={cashFlow}
                    onChange={(e) => updateCashFlow(index, e.target.value)}
                    placeholder="0"
                    className="flex-1"
                  />
                  {cashFlows.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCashFlow(index)}
                    >
                      <Minus className="size-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Analysis Results</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-2 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Net Present Value (NPV)</div>
                <div className={`text-3xl font-bold ${results.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${formatNumber(results.npv)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {results.npv >= 0 ? 'Project adds value' : 'Project destroys value'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Internal Rate of Return (IRR)</div>
                <div className={`text-3xl font-bold ${results.irr >= parseFloat(discountRate) ? 'text-green-600' : 'text-red-600'}`}>
                  {results.irr.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  vs {discountRate}% required return
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Payback Period</div>
              <div className="text-xl font-semibold text-blue-600">
                {results.paybackPeriod.toFixed(1)} years
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Discounted Payback</div>
              <div className="text-xl font-semibold text-purple-600">
                {results.discountedPaybackPeriod.toFixed(1)} years
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Profitability Index</div>
              <div className={`text-xl font-semibold ${results.profitabilityIndex >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {results.profitabilityIndex.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {results.profitabilityIndex >= 1 ? '>1 = Good' : '<1 = Poor'}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Net Cash Flow</div>
              <div className={`text-xl font-semibold ${(results.netCashFlow ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatNumber(results.netCashFlow ?? 0)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Cash Flow Schedule</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-gray-300 p-2 text-left">Year</th>
                    <th className="border border-gray-300 p-2 text-right">Cash Flow</th>
                    <th className="border border-gray-300 p-2 text-right">Present Value</th>
                    <th className="border border-gray-300 p-2 text-right">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2 text-right text-red-600">
                      -${formatNumber(parseFloat(initialInvestment))}
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-red-600">
                      -${formatNumber(parseFloat(initialInvestment))}
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-red-600">
                      -${formatNumber(parseFloat(initialInvestment))}
                    </td>
                  </tr>
                  {cashFlows.map((flow, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        ${formatNumber(parseFloat(flow))}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        ${formatNumber(results.discountedCashFlows[index])}
                      </td>
                      <td className={`border border-gray-300 p-2 text-right ${results.cumulativeCashFlows[index] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${formatNumber(results.cumulativeCashFlows[index])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <div className="space-y-2">
              <div><strong>Investment Decision:</strong></div>
              <div className={`font-semibold ${results.npv >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {results.npv >= 0 ? '✅ ACCEPT PROJECT' : '❌ REJECT PROJECT'}
              </div>
              <div>
                <strong>Rationale:</strong> NPV is {results.npv >= 0 ? 'positive' : 'negative'} 
                (${formatNumber(results.npv)}) and IRR is {results.irr >= parseFloat(discountRate) ? 'above' : 'below'} 
                the required return ({results.irr.toFixed(2)}% vs {discountRate}%).
              </div>
            </div>
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
        {/* Explanation Section */}
        <div className="mt-8 p-4 rounded-lg bg-muted/20 text-sm">
          <div className="font-semibold mb-1">How NPV & IRR Analysis Works</div>
          <div>
            <b>Formulas:</b><br />
            <span className="font-mono">NPV = Σ [Cash Flow<sub>t</sub> / (1 + r)<sup>t</sup>] - Initial Investment</span><br />
            <span className="font-mono">IRR: Rate where NPV = 0</span><br />
            <span className="font-mono">Payback Period: Years to recover initial investment</span><br />
            <span className="font-mono">Profitability Index = PV of Cash Flows / Initial Investment</span><br /><br />
            <b>Variables:</b><br />
            <b>Initial Investment</b>: ${parseFloat(initialInvestment)}<br />
            <b>Discount Rate</b>: {parseFloat(discountRate)}%<br />
            <b>Cash Flows</b>: [{cashFlows.map(cf => parseFloat(cf)).join(", ")}]<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>NPV:</b> <span className="font-mono">${formatNumber(results.npv)}</span><br />
            2. <b>IRR:</b> <span className="font-mono">{results.irr.toFixed(2)}%</span><br />
            3. <b>Payback period:</b> <span className="font-mono">{results.paybackPeriod.toFixed(1)} years</span><br />
            4. <b>Discounted payback:</b> <span className="font-mono">{results.discountedPaybackPeriod.toFixed(1)} years</span><br />
            5. <b>Profitability index:</b> <span className="font-mono">{results.profitabilityIndex.toFixed(2)}</span><br />
            6. <b>Total cash inflows:</b> <span className="font-mono">${formatNumber(results.totalCashFlow)}</span><br />
            7. <b>Present value of inflows:</b> <span className="font-mono">${formatNumber(results.presentValueOfCashFlows)}</span><br /><br />
            <b>Summary:</b><br />
            This analysis shows the NPV, IRR, payback, and profitability index for your project, with all calculations using strict number types for accuracy and safety.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}