import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { BarChart3, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function BreakEvenConverter() {
  const [fixedCosts, setFixedCosts] = useState("50000");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("15");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("25");
  const [targetProfit, setTargetProfit] = useState("20000");
  const [currentVolume, setCurrentVolume] = useState("8000");

  const calculateBreakEven = () => {
    const fixed = parseFloat(fixedCosts) || 0;
    const variableCost = parseFloat(variableCostPerUnit) || 0;
    const sellingPrice = parseFloat(sellingPricePerUnit) || 0;
    const profit = parseFloat(targetProfit) || 0;
    const volume = parseFloat(currentVolume) || 0;

    if (sellingPrice <= variableCost) {
      return {
        breakEvenUnits: 0,
        breakEvenRevenue: 0,
        contributionMargin: 0,
        contributionMarginRatio: 0,
        unitsForTargetProfit: 0,
        revenueForTargetProfit: 0,
        marginOfSafety: 0,
        marginOfSafetyPercent: 0,
        currentProfit: -fixed,
        currentTotalCosts: fixed,
        currentRevenue: 0,
        operatingLeverage: 0
      };
    }

    const contributionMargin = sellingPrice - variableCost;
    const contributionMarginRatio = (contributionMargin / sellingPrice) * 100;
    
    const breakEvenUnits = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    
    const unitsForTargetProfit = (fixed + profit) / contributionMargin;
    const revenueForTargetProfit = unitsForTargetProfit * sellingPrice;
    
    // Current performance
    const currentRevenue = volume * sellingPrice;
    const currentVariableCosts = volume * variableCost;
    const currentTotalCosts = fixed + currentVariableCosts;
    const currentProfit = currentRevenue - currentTotalCosts;
    
    // Margin of safety
    const marginOfSafety = currentRevenue - breakEvenRevenue;
    const marginOfSafetyPercent = marginOfSafety > 0 ? (marginOfSafety / currentRevenue) * 100 : 0;
    
    // Operating leverage
    const operatingLeverage = currentProfit > 0 ? (contributionMargin * volume) / currentProfit : 0;

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
      unitsForTargetProfit,
      revenueForTargetProfit,
      marginOfSafety,
      marginOfSafetyPercent,
      currentProfit,
      currentTotalCosts,
      currentRevenue,
      currentVariableCosts: currentVariableCosts || 0,
      operatingLeverage
    };
  };

  const results = calculateBreakEven();

  const reset = () => {
    setFixedCosts("50000");
    setVariableCostPerUnit("15");
    setSellingPricePerUnit("25");
    setTargetProfit("20000");
    setCurrentVolume("8000");
  };

  const copyResult = async () => {
    const text = `Break-Even Analysis:
Fixed Costs: $${formatNumber(parseFloat(fixedCosts))}
Variable Cost per Unit: $${parseFloat(variableCostPerUnit)}
Selling Price per Unit: $${parseFloat(sellingPricePerUnit)}
Contribution Margin: $${results.contributionMargin.toFixed(2)} (${results.contributionMarginRatio.toFixed(1)}%)

Break-Even Analysis:
Break-Even Units: ${formatNumber(results.breakEvenUnits)}
Break-Even Revenue: $${formatNumber(results.breakEvenRevenue)}

Target Profit Analysis (${formatNumber(parseFloat(targetProfit))}):
Units Needed: ${formatNumber(results.unitsForTargetProfit)}
Revenue Needed: $${formatNumber(results.revenueForTargetProfit)}

Current Performance:
Volume: ${formatNumber(parseFloat(currentVolume))} units
Revenue: $${formatNumber(results.currentRevenue)}
Profit: $${formatNumber(results.currentProfit)}
Margin of Safety: ${results.marginOfSafetyPercent.toFixed(1)}%`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </span>
          Break-Even Analysis Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Cost Structure</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fixedCosts">Total Fixed Costs ($)</Label>
                <Input
                  id="fixedCosts"
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(e.target.value)}
                  placeholder="50000"
                />
                <div className="text-xs text-muted-foreground">
                  Rent, salaries, insurance, etc.
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variableCostPerUnit">Variable Cost per Unit ($)</Label>
                <Input
                  id="variableCostPerUnit"
                  type="number"
                  step="0.01"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(e.target.value)}
                  placeholder="15"
                />
                <div className="text-xs text-muted-foreground">
                  Materials, direct labor, etc.
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sellingPricePerUnit">Selling Price per Unit ($)</Label>
                <Input
                  id="sellingPricePerUnit"
                  type="number"
                  step="0.01"
                  value={sellingPricePerUnit}
                  onChange={(e) => setSellingPricePerUnit(e.target.value)}
                  placeholder="25"
                />
              </div>
              
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Contribution Margin:</strong><br/>
                ${results.contributionMargin.toFixed(2)} per unit<br/>
                {results.contributionMarginRatio.toFixed(1)}% of selling price
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Analysis Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetProfit">Target Profit Goal ($)</Label>
                <Input
                  id="targetProfit"
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(e.target.value)}
                  placeholder="20000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentVolume">Current/Projected Volume (Units)</Label>
                <Input
                  id="currentVolume"
                  type="number"
                  value={currentVolume}
                  onChange={(e) => setCurrentVolume(e.target.value)}
                  placeholder="8000"
                />
              </div>
              
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Current Performance:</strong><br/>
                Revenue: ${formatNumber(results.currentRevenue)}<br/>
                Total Costs: ${formatNumber(results.currentTotalCosts)}<br/>
                Profit: ${formatNumber(results.currentProfit)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Break-Even Analysis Results</h3>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-2 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Break-Even Volume</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(results.breakEvenUnits)} units
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Break-Even Revenue</div>
                <div className="text-2xl font-bold text-red-600">
                  ${formatNumber(results.breakEvenRevenue)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Units for Target Profit</div>
              <div className="text-xl font-semibold text-green-600">
                {formatNumber(results.unitsForTargetProfit)}
              </div>
              <div className="text-xs text-muted-foreground">
                ${formatNumber(parseFloat(targetProfit))} profit
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Revenue for Target</div>
              <div className="text-xl font-semibold text-blue-600">
                ${formatNumber(results.revenueForTargetProfit)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Margin of Safety</div>
              <div className={`text-xl font-semibold ${results.marginOfSafety >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.marginOfSafetyPercent.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                ${formatNumber(results.marginOfSafety)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Operating Leverage</div>
              <div className="text-xl font-semibold text-purple-600">
                {results.operatingLeverage.toFixed(2)}×
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Cost Structure Analysis</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Fixed Costs</div>
                <div className="text-lg font-semibold text-red-600">
                  ${formatNumber(parseFloat(fixedCosts))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((parseFloat(fixedCosts) / results.currentTotalCosts) * 100).toFixed(1)}% of total
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Variable Costs</div>
                <div className="text-lg font-semibold text-orange-600">
                  ${formatNumber(results.currentVariableCosts ?? 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(((results.currentVariableCosts ?? 0) / results.currentTotalCosts) * 100).toFixed(1)}% of total
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Current Profit Margin</div>
                <div className={`text-lg font-semibold ${results.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.currentRevenue > 0 ? ((results.currentProfit / results.currentRevenue) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Break-Even Insights:</strong></div>
            {results.currentProfit >= 0 ? (
              <div>✅ You're currently profitable! Your margin of safety is {results.marginOfSafetyPercent.toFixed(1)}%, 
              meaning sales can drop by that amount before reaching break-even.</div>
            ) : (
              <div>⚠️ You need to sell {formatNumber(results.breakEvenUnits - parseFloat(currentVolume))} more units 
              to reach break-even point.</div>
            )}
            <div><strong>Operating Leverage:</strong> A {results.operatingLeverage.toFixed(1)}× leverage means that 
            a 10% increase in sales will result in a {(results.operatingLeverage * 10).toFixed(1)}% increase in profit.</div>
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
          <div className="font-semibold mb-1">How Break-Even Analysis Works</div>
          <div>
            <b>Formula:</b><br />
            <span className="font-mono">Break-Even Units = Fixed Costs / (Selling Price - Variable Cost)</span><br />
            <span className="font-mono">Contribution Margin = Selling Price - Variable Cost</span><br />
            <span className="font-mono">Units for Target Profit = (Fixed Costs + Target Profit) / Contribution Margin</span><br /><br />
            <b>Variables:</b><br />
            <b>Fixed Costs</b>: ${parseFloat(fixedCosts)}<br />
            <b>Variable Cost per Unit</b>: ${parseFloat(variableCostPerUnit)}<br />
            <b>Selling Price per Unit</b>: ${parseFloat(sellingPricePerUnit)}<br />
            <b>Target Profit</b>: ${parseFloat(targetProfit)}<br />
            <b>Current Volume</b>: {parseFloat(currentVolume)} units<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Contribution margin:</b> <span className="font-mono">${results.contributionMargin.toFixed(2)}</span><br />
            2. <b>Break-even units:</b> <span className="font-mono">{formatNumber(results.breakEvenUnits)}</span><br />
            3. <b>Break-even revenue:</b> <span className="font-mono">${formatNumber(results.breakEvenRevenue)}</span><br />
            4. <b>Units for target profit:</b> <span className="font-mono">{formatNumber(results.unitsForTargetProfit)}</span><br />
            5. <b>Revenue for target profit:</b> <span className="font-mono">${formatNumber(results.revenueForTargetProfit)}</span><br />
            6. <b>Margin of safety:</b> <span className="font-mono">{results.marginOfSafetyPercent.toFixed(1)}%</span><br />
            7. <b>Operating leverage:</b> <span className="font-mono">{results.operatingLeverage.toFixed(2)}×</span><br /><br />
            <b>Summary:</b><br />
            This analysis shows how many units you need to sell to break even and reach your profit goal, with all calculations using strict number types for accuracy and safety.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}