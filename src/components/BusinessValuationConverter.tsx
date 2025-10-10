import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Building, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function BusinessValuationConverter() {
  const [revenue, setRevenue] = useState("5000000");
  const [netIncome, setNetIncome] = useState("750000");
  const [assets, setAssets] = useState("2000000");
  const [liabilities, setLiabilities] = useState("500000");
  const [cashFlow, setCashFlow] = useState("850000");
  const [growthRate, setGrowthRate] = useState("8");
  const [discountRate, setDiscountRate] = useState("12");
  const [terminalMultiple, setTerminalMultiple] = useState("15");
  const [projectionYears, setProjectionYears] = useState("5");

  // Industry multiples (typical ranges)
  const [peRatio, setPeRatio] = useState("18");
  const [psRatio, setPsRatio] = useState("3.5");
  const [evEbitda, setEvEbitda] = useState("12");

  const calculateValuation = () => {
    const annualRevenue = parseFloat(revenue) || 0;
    const earnings = parseFloat(netIncome) || 0;
    const totalAssets = parseFloat(assets) || 0;
    const totalLiabilities = parseFloat(liabilities) || 0;
    const fcf = parseFloat(cashFlow) || 0;
    const growth = (parseFloat(growthRate) || 0) / 100;
    const discount = (parseFloat(discountRate) || 0) / 100;
    const terminalMult = parseFloat(terminalMultiple) || 15;
    const years = parseInt(projectionYears) || 5;

    // Asset-Based Valuation
    const bookValue = totalAssets - totalLiabilities;
    
    // Market Multiple Valuations
    const peValuation = earnings * parseFloat(peRatio);
    const psValuation = annualRevenue * parseFloat(psRatio);
    const ebitda = earnings + (earnings * 0.3); // Rough EBITDA estimate
    const evEbitdaValuation = ebitda * parseFloat(evEbitda);

    // DCF Valuation
    let dcfValue = 0;
    let projectedCashFlow = fcf;
    
    // Present value of projected cash flows
    for (let year = 1; year <= years; year++) {
      projectedCashFlow *= (1 + growth);
      const presentValue = projectedCashFlow / Math.pow(1 + discount, year);
      dcfValue += presentValue;
    }
    
    // Terminal value
    const finalYearCashFlow = projectedCashFlow * (1 + growth);
    const terminalValue = (finalYearCashFlow * terminalMult) / Math.pow(1 + discount, years);
    dcfValue += terminalValue;

    // Weighted Average (DCF heavy)
    const weightedValue = (dcfValue * 0.4) + (peValuation * 0.25) + (psValuation * 0.15) + (evEbitdaValuation * 0.2);

    return {
      dcfValue,
      peValuation,
      psValuation,
      evEbitdaValuation,
      bookValue,
      weightedValue,
      terminalValue,
      projectedFinalCashFlow: finalYearCashFlow,
      
      // Per-share if we assume 1M shares outstanding
      dcfPerShare: dcfValue / 1000000,
      pePerShare: peValuation / 1000000,
      weightedPerShare: weightedValue / 1000000,
      
      // Ratios
      priceToBook: weightedValue / bookValue,
      priceToSales: weightedValue / annualRevenue,
      priceToEarnings: weightedValue / earnings
    };
  };

  const results = calculateValuation();

  const reset = () => {
    setRevenue("5000000");
    setNetIncome("750000");
    setAssets("2000000");
    setLiabilities("500000");
    setCashFlow("850000");
    setGrowthRate("8");
    setDiscountRate("12");
    setTerminalMultiple("15");
    setProjectionYears("5");
    setPeRatio("18");
    setPsRatio("3.5");
    setEvEbitda("12");
  };

  const copyResult = async () => {
    const text = `Business Valuation Analysis:
Company Financials:
Revenue: $${formatNumber(parseFloat(revenue))}
Net Income: $${formatNumber(parseFloat(netIncome))}
Free Cash Flow (FCF): $${formatNumber(parseFloat(cashFlow))}
Book Value: $${formatNumber(results.bookValue)}

Valuation Methods:
Discounted Cash Flow (DCF) Valuation: $${formatNumber(results.dcfValue)}
Price-to-Earnings (P/E) Multiple: $${formatNumber(results.peValuation)}
Price-to-Sales (P/S) Multiple: $${formatNumber(results.psValuation)}
Enterprise Value/EBITDA (EV/EBITDA): $${formatNumber(results.evEbitdaValuation)}
Asset-Based Valuation: $${formatNumber(results.bookValue)}

Weighted Average Valuation: $${formatNumber(results.weightedValue)}
Per Share (1M shares): $${results.weightedPerShare.toFixed(2)}

Key Terms:
- DCF: Projects future cash flows discounted to present value
- P/E: Stock price divided by earnings per share
- P/S: Market cap divided by annual revenue  
- EV/EBITDA: Enterprise value divided by earnings before interest, taxes, depreciation & amortization
- WACC: Weighted Average Cost of Capital (discount rate)
- FCF: Free Cash Flow available to investors`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building className="size-4" />
          </span>
          Business Valuation Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Financial Data</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="5000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netIncome">Net Income ($)</Label>
                <Input
                  id="netIncome"
                  type="number"
                  value={netIncome}
                  onChange={(e) => setNetIncome(e.target.value)}
                  placeholder="750000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cashFlow">Free Cash Flow ($)</Label>
                <Input
                  id="cashFlow"
                  type="number"
                  value={cashFlow}
                  onChange={(e) => setCashFlow(e.target.value)}
                  placeholder="850000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assets">Total Assets ($)</Label>
                <Input
                  id="assets"
                  type="number"
                  value={assets}
                  onChange={(e) => setAssets(e.target.value)}
                  placeholder="2000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liabilities">Total Liabilities ($)</Label>
                <Input
                  id="liabilities"
                  type="number"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  placeholder="500000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Discounted Cash Flow (DCF) Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="growthRate">Growth Rate (%)</Label>
                <Input
                  id="growthRate"
                  type="number"
                  step="0.1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  placeholder="8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountRate">Weighted Average Cost of Capital (WACC) (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  step="0.1"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  placeholder="12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="terminalMultiple">Terminal Multiple</Label>
                <Input
                  id="terminalMultiple"
                  type="number"
                  step="0.5"
                  value={terminalMultiple}
                  onChange={(e) => setTerminalMultiple(e.target.value)}
                  placeholder="15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectionYears">Projection Years</Label>
                <Input
                  id="projectionYears"
                  type="number"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Market Multiples</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="peRatio">Price-to-Earnings Ratio (P/E)</Label>
                <Input
                  id="peRatio"
                  type="number"
                  step="0.1"
                  value={peRatio}
                  onChange={(e) => setPeRatio(e.target.value)}
                  placeholder="18"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="psRatio">Price-to-Sales Ratio (P/S)</Label>
                <Input
                  id="psRatio"
                  type="number"
                  step="0.1"
                  value={psRatio}
                  onChange={(e) => setPsRatio(e.target.value)}
                  placeholder="3.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evEbitda">Enterprise Value to EBITDA (EV/EBITDA)</Label>
                <Input
                  id="evEbitda"
                  type="number"
                  step="0.1"
                  value={evEbitda}
                  onChange={(e) => setEvEbitda(e.target.value)}
                  placeholder="12"
                />
                <div className="text-xs text-muted-foreground">
                  EBITDA = Earnings Before Interest, Taxes, Depreciation & Amortization
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Book Value:</strong> ${formatNumber(results.bookValue)}<br/>
                <strong>Net Profit Margin:</strong> {((parseFloat(netIncome) / parseFloat(revenue)) * 100).toFixed(1)}%<br/>
                <div className="text-xs mt-2">
                  <em>Book Value = Total Assets - Total Liabilities</em>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Valuation Results</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Weighted Average Valuation</div>
              <div className="text-3xl font-bold text-green-600">
                ${formatNumber(results.weightedValue)}
              </div>
              <div className="text-sm text-muted-foreground">
                Per Share (1M shares): ${results.weightedPerShare.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Discounted Cash Flow (DCF) Valuation (40%)</div>
              <div className="text-xl font-bold text-blue-600">
                ${formatNumber(results.dcfValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                ${results.dcfPerShare.toFixed(2)}/share
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Price-to-Earnings (P/E) Multiple (25%)</div>
              <div className="text-xl font-semibold text-purple-600">
                ${formatNumber(results.peValuation)}
              </div>
              <div className="text-xs text-muted-foreground">
                ${results.pePerShare.toFixed(2)}/share
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Price-to-Sales (P/S) Multiple (15%)</div>
              <div className="text-xl font-semibold text-orange-600">
                ${formatNumber(results.psValuation)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Enterprise Value/EBITDA (EV/EBITDA) (20%)</div>
              <div className="text-xl font-semibold text-cyan-600">
                ${formatNumber(results.evEbitdaValuation)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Asset-Based</div>
              <div className="text-xl font-semibold">
                ${formatNumber(results.bookValue)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Terminal Value</div>
              <div className="text-xl font-semibold text-green-600">
                ${formatNumber(results.terminalValue)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Key Ratios</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Price-to-Book</div>
                <div className="text-lg font-semibold">
                  {results.priceToBook.toFixed(2)}×
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Price-to-Sales</div>
                <div className="text-lg font-semibold">
                  {results.priceToSales.toFixed(2)}×
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Price-to-Earnings</div>
                <div className="text-lg font-semibold">
                  {results.priceToEarnings.toFixed(2)}×
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Methodology:</strong> This valuation uses a weighted approach combining Discounted Cash Flow (DCF) analysis (40%), 
            Price-to-Earnings (P/E) multiples (25%), Price-to-Sales (P/S) multiples (15%), and Enterprise Value to EBITDA (EV/EBITDA) (20%). 
            The DCF projects {projectionYears} years of cash flows growing at {growthRate}% annually, discounted at {discountRate}% 
            Weighted Average Cost of Capital (WACC) with a terminal multiple of {terminalMultiple}×.
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
          <div className="font-semibold mb-1">How Business Valuation Works</div>
          <div>
            <b>Formulas:</b><br />
            <span className="font-mono">DCF = Σ [FCF × (1 + g)<sup>year</sup> / (1 + r)<sup>year</sup>] + Terminal Value</span><br />
            <span className="font-mono">Terminal Value = Final Year FCF × Terminal Multiple / (1 + r)<sup>years</sup></span><br />
            <span className="font-mono">P/E Valuation = Net Income × P/E Ratio</span><br />
            <span className="font-mono">P/S Valuation = Revenue × P/S Ratio</span><br />
            <span className="font-mono">EV/EBITDA = EBITDA × EV/EBITDA Ratio</span><br />
            <span className="font-mono">Book Value = Assets - Liabilities</span><br /><br />
            <b>Variables:</b><br />
            <b>FCF</b>: Free Cash Flow<br />
            <b>g</b>: Growth Rate<br />
            <b>r</b>: Discount Rate (WACC)<br />
            <b>years</b>: Projection Years<br />
            <b>Terminal Multiple</b>: Industry exit multiple<br />
            <b>P/E, P/S, EV/EBITDA</b>: Market multiples<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Book value:</b> <span className="font-mono">{assets} - {liabilities} = {formatNumber(results.bookValue)}</span><br />
            2. <b>DCF valuation:</b> Project {projectionYears} years of FCF ({cashFlow}) growing at {growthRate}%, discounted at {discountRate}%. Terminal value added using {terminalMultiple}× multiple.<br />
            3. <b>P/E valuation:</b> <span className="font-mono">{netIncome} × {peRatio} = {formatNumber(results.peValuation)}</span><br />
            4. <b>P/S valuation:</b> <span className="font-mono">{revenue} × {psRatio} = {formatNumber(results.psValuation)}</span><br />
            5. <b>EV/EBITDA valuation:</b> EBITDA estimated as Net Income + 30%, then × {evEbitda} = {formatNumber(results.evEbitdaValuation)}<br />
            6. <b>Weighted average valuation:</b> 40% DCF, 25% P/E, 15% P/S, 20% EV/EBITDA = <span className="font-mono">{formatNumber(results.weightedValue)}</span><br /><br />
            <b>Summary:</b><br />
            Using your inputs, the weighted business valuation is <b>${formatNumber(results.weightedValue)}</b>, combining DCF, market multiples, and asset-based approaches for a comprehensive estimate.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}