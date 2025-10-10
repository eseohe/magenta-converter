import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { PieChart, Copy, RefreshCcw, Plus, Minus } from "lucide-react";
import { formatNumber } from "../lib/format";

interface Holding {
  symbol: string;
  allocation: string;
  expectedReturn: string;
  beta: string;
}

export function PortfolioAnalyzerConverter() {
  const [marketReturn, setMarketReturn] = useState("10");
  const [riskFreeRate, setRiskFreeRate] = useState("3");
  const [portfolioValue, setPortfolioValue] = useState("100000");
  const [holdings, setHoldings] = useState<Holding[]>([
    { symbol: "AAPL", allocation: "25", expectedReturn: "12", beta: "1.2" },
    { symbol: "MSFT", allocation: "20", expectedReturn: "11", beta: "0.9" },
    { symbol: "GOOGL", allocation: "15", expectedReturn: "13", beta: "1.1" },
    { symbol: "BONDS", allocation: "25", expectedReturn: "5", beta: "0.2" },
    { symbol: "CASH", allocation: "15", expectedReturn: "3", beta: "0.0" }
  ]);

  const addHolding = () => {
    setHoldings([...holdings, { symbol: "", allocation: "0", expectedReturn: "0", beta: "1.0" }]);
  };

  const removeHolding = (index: number) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter((_, i) => i !== index));
    }
  };

  const updateHolding = (index: number, field: keyof Holding, value: string) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const calculatePortfolioMetrics = () => {
    const totalValue = parseFloat(portfolioValue) || 100000;
    const marketRet = (parseFloat(marketReturn) || 0) / 100;
    const riskFree = (parseFloat(riskFreeRate) || 0) / 100;
    
    let totalAllocation = 0;
    let weightedReturn = 0;
    let weightedBeta = 0;
    let diversificationScore = 0;
    
    const validHoldings = holdings.filter(h => 
      parseFloat(h.allocation) > 0 && 
      h.symbol.trim() !== ""
    );

    if (validHoldings.length === 0) {
      return {
        portfolioReturn: 0,
        portfolioBeta: 0,
        sharpeRatio: 0,
        treynorRatio: 0,
        alpha: 0,
        diversificationScore: 0,
        totalAllocation: 0,
        largestHolding: 0,
        numberOfHoldings: 0,
        concentrationRisk: "High",
        riskLevel: "Unknown",
        expectedVolatility: 0,
        valueAtRisk: 0,
        maxDrawdown: 0,
        holdingValues: []
      };
    }

    const holdingValues = validHoldings.map(holding => {
      const allocation = parseFloat(holding.allocation) || 0;
      const expectedRet = (parseFloat(holding.expectedReturn) || 0) / 100;
      const beta = parseFloat(holding.beta) || 0;
      const weight = allocation / 100;
      const value = totalValue * weight;

      totalAllocation += allocation;
      weightedReturn += weight * expectedRet;
      weightedBeta += weight * beta;

      return {
        symbol: holding.symbol,
        allocation,
        value,
        expectedReturn: expectedRet,
        beta,
        weight
      };
    });

    // Diversification Score (Herfindahl-Hirschman Index based)
    const hhi = holdingValues.reduce((sum, h) => sum + Math.pow(h.weight, 2), 0);
    diversificationScore = Math.max(0, (1 - hhi) * 100); // Convert to 0-100 scale

    // Risk metrics
    const largestHolding = Math.max(...holdingValues.map(h => h.allocation));
    const numberOfHoldings = validHoldings.length;
    
    // Concentration risk assessment
    const concentrationRisk = largestHolding > 40 ? "Very High" :
                             largestHolding > 25 ? "High" :
                             largestHolding > 15 ? "Medium" : "Low";

    // Portfolio volatility (simplified - assumes correlations)
    const avgCorrelation = numberOfHoldings > 1 ? 0.3 : 0; // Assumed average correlation
    const avgVolatility = 0.2; // Assumed average asset volatility
    const expectedVolatility = avgVolatility * Math.sqrt(
      hhi + (1 - hhi) * avgCorrelation
    ) * 100;

    // Risk-adjusted performance
    const excessReturn = weightedReturn - riskFree;
    const marketExcessReturn = marketRet - riskFree;
    const sharpeRatio = expectedVolatility > 0 ? (excessReturn * 100) / expectedVolatility : 0;
    const treynorRatio = weightedBeta !== 0 ? excessReturn / weightedBeta : 0;
    const alpha = excessReturn - (weightedBeta * marketExcessReturn);

    // Value at Risk (95% confidence, 1 day)
    const valueAtRisk = totalValue * (expectedVolatility / 100) * 1.65; // 1.65 for 95% confidence

    // Risk level assessment
    const riskLevel = weightedBeta > 1.5 ? "Very High" :
                     weightedBeta > 1.2 ? "High" :
                     weightedBeta > 0.8 ? "Medium" : "Low";

    return {
      portfolioReturn: weightedReturn * 100,
      portfolioBeta: weightedBeta,
      sharpeRatio,
      treynorRatio: treynorRatio * 100,
      alpha: alpha * 100,
      diversificationScore,
      totalAllocation,
      largestHolding,
      numberOfHoldings,
      concentrationRisk,
      riskLevel,
      expectedVolatility,
      valueAtRisk,
      holdingValues
    };
  };

  const results = calculatePortfolioMetrics();

    // Dynamic explanation logic
    const getExplanation = () => {
      // Weighted Return
      const weightedReturnFormula = "Portfolio Return = Σ (Weight × Expected Return)";
      const weightedReturnFlow = results.holdingValues.length > 0
        ? `= ${results.holdingValues.map(h => `${h.weight.toFixed(2)} × ${(h.expectedReturn * 100).toFixed(2)}%`).join(' + ')} = ${results.portfolioReturn.toFixed(2)}%`
        : "";

      // Weighted Beta
      const weightedBetaFormula = "Portfolio Beta = Σ (Weight × Beta)";
      const weightedBetaFlow = results.holdingValues.length > 0
        ? `= ${results.holdingValues.map(h => `${h.weight.toFixed(2)} × ${h.beta.toFixed(2)}`).join(' + ')} = ${results.portfolioBeta.toFixed(2)}`
        : "";

      // Sharpe Ratio
      const sharpeFormula = "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Volatility";
      const sharpeFlow = `= (${results.portfolioReturn.toFixed(2)}% - ${(parseFloat(riskFreeRate)).toFixed(2)}%) / ${results.expectedVolatility.toFixed(2)}% = ${results.sharpeRatio.toFixed(2)}`;

      // Treynor Ratio
      const treynorFormula = "Treynor Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Beta";
      const treynorFlow = `= (${results.portfolioReturn.toFixed(2)}% - ${(parseFloat(riskFreeRate)).toFixed(2)}%) / ${results.portfolioBeta.toFixed(2)} = ${results.treynorRatio.toFixed(2)}%`;

      // Alpha
      const alphaFormula = "Alpha = Portfolio Return - [Beta × (Market Return - Risk-Free Rate)]";
      const alphaFlow = `= ${results.portfolioReturn.toFixed(2)}% - [${results.portfolioBeta.toFixed(2)} × (${(parseFloat(marketReturn)).toFixed(2)}% - ${(parseFloat(riskFreeRate)).toFixed(2)}%)] = ${results.alpha.toFixed(2)}%`;

      return {
        weightedReturnFormula,
        weightedReturnFlow,
        weightedBetaFormula,
        weightedBetaFlow,
        sharpeFormula,
        sharpeFlow,
        treynorFormula,
        treynorFlow,
        alphaFormula,
        alphaFlow
      };
    };

    const explanation = getExplanation();

  const reset = () => {
    setMarketReturn("10");
    setRiskFreeRate("3");
    setPortfolioValue("100000");
    setHoldings([
      { symbol: "AAPL", allocation: "25", expectedReturn: "12", beta: "1.2" },
      { symbol: "MSFT", allocation: "20", expectedReturn: "11", beta: "0.9" },
      { symbol: "GOOGL", allocation: "15", expectedReturn: "13", beta: "1.1" },
      { symbol: "BONDS", allocation: "25", expectedReturn: "5", beta: "0.2" },
      { symbol: "CASH", allocation: "15", expectedReturn: "3", beta: "0.0" }
    ]);
  };

  const copyResult = async () => {
    const text = `Portfolio Analysis:
Total Portfolio Value: $${formatNumber(parseFloat(portfolioValue))}
Number of Holdings: ${results.numberOfHoldings}
Total Allocation: ${results.totalAllocation.toFixed(1)}%

Performance Metrics:
Expected Return: ${results.portfolioReturn.toFixed(2)}%
Portfolio Beta: ${results.portfolioBeta.toFixed(2)}
Sharpe Ratio: ${results.sharpeRatio.toFixed(2)}
Treynor Ratio: ${results.treynorRatio.toFixed(2)}%
Alpha: ${results.alpha.toFixed(2)}%

Risk Metrics:
Expected Volatility: ${results.expectedVolatility.toFixed(1)}%
Value at Risk (95%): $${formatNumber(results.valueAtRisk)}
Risk Level: ${results.riskLevel}
Diversification Score: ${results.diversificationScore.toFixed(1)}/100
Concentration Risk: ${results.concentrationRisk}
Largest Holding: ${results.largestHolding.toFixed(1)}%

Holdings Breakdown:
${results.holdingValues.map(h => 
`${h.symbol}: ${h.allocation.toFixed(1)}% ($${formatNumber(h.value)}) - Expected Return: ${(h.expectedReturn * 100).toFixed(1)}%`
).join('\n')}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <PieChart className="size-4" />
          </span>
          Portfolio Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Portfolio Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioValue">Portfolio Value ($)</Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(e.target.value)}
                  placeholder="100000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="marketReturn">Market Return (%)</Label>
                <Input
                  id="marketReturn"
                  type="number"
                  step="0.1"
                  value={marketReturn}
                  onChange={(e) => setMarketReturn(e.target.value)}
                  placeholder="10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                <Input
                  id="riskFreeRate"
                  type="number"
                  step="0.1"
                  value={riskFreeRate}
                  onChange={(e) => setRiskFreeRate(e.target.value)}
                  placeholder="3"
                />
              </div>
              
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Portfolio Summary:</strong><br/>
                Holdings: {results.numberOfHoldings}<br/>
                Total Allocation: {results.totalAllocation.toFixed(1)}%<br/>
                {results.totalAllocation !== 100 && (
                  <span className="text-red-600">⚠️ Allocation doesn't equal 100%</span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Holdings</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHolding}
                className="flex items-center gap-1"
              >
                <Plus className="size-3" />
                Add Holding
              </Button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2 text-sm font-medium text-muted-foreground">
                <div>Symbol</div>
                <div>Allocation %</div>
                <div>Expected Return %</div>
                <div>Beta</div>
                <div>Value</div>
                <div></div>
              </div>
              
              {holdings.map((holding, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Input
                    type="text"
                    value={holding.symbol}
                    onChange={(e) => updateHolding(index, 'symbol', e.target.value)}
                    placeholder="AAPL"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={holding.allocation}
                    onChange={(e) => updateHolding(index, 'allocation', e.target.value)}
                    placeholder="25"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={holding.expectedReturn}
                    onChange={(e) => updateHolding(index, 'expectedReturn', e.target.value)}
                    placeholder="12"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={holding.beta}
                    onChange={(e) => updateHolding(index, 'beta', e.target.value)}
                    placeholder="1.0"
                    className="text-sm"
                  />
                  <div className="text-sm text-muted-foreground">
                    ${formatNumber((parseFloat(portfolioValue) || 0) * (parseFloat(holding.allocation) || 0) / 100)}
                  </div>
                  {holdings.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHolding(index)}
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
          <h3 className="text-lg font-semibold">Portfolio Analysis</h3>

          {/* Dynamic Explanation Section */}
          <div className="bg-background border rounded-lg p-4 mb-4">
            <div className="font-semibold mb-2">How the Key Metrics Are Calculated</div>
            <div className="text-sm mb-1"><strong>Portfolio Return:</strong> {explanation.weightedReturnFormula}<br /><span className="text-muted-foreground">{explanation.weightedReturnFlow}</span></div>
            <div className="text-sm mb-1"><strong>Portfolio Beta:</strong> {explanation.weightedBetaFormula}<br /><span className="text-muted-foreground">{explanation.weightedBetaFlow}</span></div>
            <div className="text-sm mb-1"><strong>Sharpe Ratio:</strong> {explanation.sharpeFormula}<br /><span className="text-muted-foreground">{explanation.sharpeFlow}</span></div>
            <div className="text-sm mb-1"><strong>Treynor Ratio:</strong> {explanation.treynorFormula}<br /><span className="text-muted-foreground">{explanation.treynorFlow}</span></div>
            <div className="text-sm"><strong>Alpha:</strong> {explanation.alphaFormula}<br /><span className="text-muted-foreground">{explanation.alphaFlow}</span></div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Expected Return</div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.portfolioReturn.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Portfolio Beta</div>
                <div className={`text-2xl font-bold ${results.portfolioBeta > 1 ? 'text-red-600' : 'text-green-600'}`}>
                  {results.portfolioBeta.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                <div className={`text-2xl font-bold ${results.sharpeRatio > 1 ? 'text-green-600' : 'text-orange-600'}`}>
                  {results.sharpeRatio.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Alpha</div>
              <div className={`text-xl font-semibold ${results.alpha > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.alpha.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Excess return vs market
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Treynor Ratio</div>
              <div className="text-xl font-semibold text-purple-600">
                {results.treynorRatio.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Return per unit of systematic risk
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Expected Volatility</div>
              <div className="text-xl font-semibold text-orange-600">
                {results.expectedVolatility.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Annualized standard deviation
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Value at Risk (95%)</div>
              <div className="text-xl font-semibold text-red-600">
                ${formatNumber(results.valueAtRisk)}
              </div>
              <div className="text-xs text-muted-foreground">
                1-day potential loss
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Risk Assessment</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Diversification Score</div>
                <div className={`text-2xl font-bold ${results.diversificationScore > 70 ? 'text-green-600' : 
                                                    results.diversificationScore > 40 ? 'text-orange-600' : 'text-red-600'}`}>
                  {results.diversificationScore.toFixed(1)}/100
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.diversificationScore > 70 ? 'Well diversified' :
                   results.diversificationScore > 40 ? 'Moderately diversified' : 'Poorly diversified'}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Concentration Risk</div>
                <div className={`text-lg font-semibold ${results.concentrationRisk === 'Low' ? 'text-green-600' :
                                                          results.concentrationRisk === 'Medium' ? 'text-orange-600' : 'text-red-600'}`}>
                  {results.concentrationRisk}
                </div>
                <div className="text-xs text-muted-foreground">
                  Largest: {results.largestHolding.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div className={`text-lg font-semibold ${results.riskLevel === 'Low' ? 'text-green-600' :
                                                         results.riskLevel === 'Medium' ? 'text-orange-600' : 'text-red-600'}`}>
                  {results.riskLevel}
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on beta {results.portfolioBeta.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Portfolio Insights:</strong></div>
            <div><strong>Performance:</strong> {results.alpha > 0 ? 
              `Your portfolio is generating ${results.alpha.toFixed(2)}% alpha, outperforming the market.` :
              `Your portfolio is underperforming the market by ${Math.abs(results.alpha).toFixed(2)}%.`}
            </div>
            <div><strong>Risk:</strong> With a beta of {results.portfolioBeta.toFixed(2)}, your portfolio is {
              results.portfolioBeta > 1 ? `${((results.portfolioBeta - 1) * 100).toFixed(0)}% more volatile than the market` :
              results.portfolioBeta < 1 ? `${((1 - results.portfolioBeta) * 100).toFixed(0)}% less volatile than the market` :
              'as volatile as the market'}.
            </div>
            <div><strong>Diversification:</strong> {results.diversificationScore < 50 ? 
              'Consider adding more holdings or rebalancing to improve diversification.' :
              'Good diversification helps reduce portfolio-specific risk.'}
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
      </CardContent>
    </Card>
  );
}