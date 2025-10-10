import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { TrendingUp, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function InvestmentReturnsConverter() {
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [expectedReturn, setExpectedReturn] = useState("8");
  const [timeHorizon, setTimeHorizon] = useState("20");
  const [inflationRate, setInflationRate] = useState("3");

  const calculateInvestmentReturns = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const annualReturn = (parseFloat(expectedReturn) || 0) / 100;
    const years = parseFloat(timeHorizon) || 0;
    const inflation = (parseFloat(inflationRate) || 0) / 100;
    
    if (initial === 0 && monthly === 0) {
      return {
        futureValue: 0,
        totalContributions: 0,
        totalGains: 0,
        realValue: 0,
        realGains: 0,
        monthlyReturnNeeded: 0,
        annualizedReturn: 0,
        initialFV: 0,
        monthlyFV: 0
      };
    }

    const monthlyReturn = annualReturn / 12;
    const months = years * 12;

    // Future value of initial investment
    const initialFV = initial * Math.pow(1 + annualReturn, years);

    // Future value of monthly contributions (ordinary annuity)
    let monthlyFV = 0;
    if (monthly > 0 && monthlyReturn > 0) {
      monthlyFV = monthly * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    } else if (monthly > 0) {
      monthlyFV = monthly * months;
    }

    const futureValue = initialFV + monthlyFV;
    const totalContributions = initial + (monthly * months);
    const totalGains = futureValue - totalContributions;

    // Adjust for inflation
    const realValue = futureValue / Math.pow(1 + inflation, years);
    const realGains = realValue - totalContributions;

    // Calculate what monthly return is needed to beat inflation
    const realReturnNeeded = annualReturn - inflation;
    const monthlyReturnNeeded = realReturnNeeded / 12;

    return {
      futureValue,
      totalContributions,
      totalGains,
      realValue,
      realGains,
      monthlyReturnNeeded: monthlyReturnNeeded * 100,
      annualizedReturn: ((futureValue / totalContributions) ** (1/years) - 1) * 100,
      initialFV,
      monthlyFV
    };
  };

  const results = calculateInvestmentReturns();

  const reset = () => {
    setInitialInvestment("10000");
    setMonthlyContribution("500");
    setExpectedReturn("8");
    setTimeHorizon("20");
    setInflationRate("3");
  };

  const copyResult = async () => {
    const text = `Investment Projection (${timeHorizon} years):
Initial Investment: $${formatNumber(parseFloat(initialInvestment))}
Monthly Contribution: $${formatNumber(parseFloat(monthlyContribution))}
Expected Annual Return: ${expectedReturn}%

Results:
Future Value: $${formatNumber(results.futureValue)}
Total Contributions: $${formatNumber(results.totalContributions)}
Total Gains: $${formatNumber(results.totalGains)}
Real Value (inflation-adjusted): $${formatNumber(results.realValue)}
Annualized Return: ${results.annualizedReturn.toFixed(2)}%`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </span>
          Investment Returns Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              placeholder="10000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
            <Input
              id="monthlyContribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
            <Input
              id="expectedReturn"
              type="number"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="8"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time Horizon (Years)</Label>
            <Input
              id="timeHorizon"
              type="number"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              placeholder="20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inflationRate">Expected Inflation Rate (%)</Label>
            <Input
              id="inflationRate"
              type="number"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="3"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Projection</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Future Value (Nominal)</div>
              <div className="text-3xl font-bold text-green-600">
                ${formatNumber(results.futureValue)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Contributions</div>
              <div className="text-xl font-semibold">
                ${formatNumber(results.totalContributions)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Gains</div>
              <div className="text-xl font-semibold text-green-600">
                ${formatNumber(results.totalGains)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Real Value</div>
              <div className="text-xl font-semibold text-blue-600">
                ${formatNumber(results.realValue)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Annualized Return</div>
              <div className="text-xl font-semibold text-purple-600">
                {results.annualizedReturn.toFixed(2)}%
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Breakdown</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Initial Investment Growth</div>
                <div className="text-lg font-semibold">
                  ${formatNumber(parseFloat(initialInvestment))} → ${formatNumber(results.initialFV)}
                </div>
                <div className="text-sm text-green-600">
                  +${formatNumber(results.initialFV - parseFloat(initialInvestment))}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Contributions Growth</div>
                <div className="text-lg font-semibold">
                  ${formatNumber(parseFloat(monthlyContribution) * 12 * parseFloat(timeHorizon))} → ${formatNumber(results.monthlyFV)}
                </div>
                <div className="text-sm text-green-600">
                  +${formatNumber(results.monthlyFV - (parseFloat(monthlyContribution) * 12 * parseFloat(timeHorizon)))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Inflation Impact:</strong> Your ${formatNumber(results.futureValue)} in {timeHorizon} years 
            will have the purchasing power of ${formatNumber(results.realValue)} in today's dollars 
            (assuming {inflationRate}% annual inflation). Real gains after inflation: ${formatNumber(results.realGains)}.
          </div>

          <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 p-3 rounded-md">
            <strong>Investment Breakdown:</strong> You're investing ${formatNumber(parseFloat(initialInvestment))} initially 
            plus ${formatNumber(parseFloat(monthlyContribution))}/month (${formatNumber(parseFloat(monthlyContribution) * 12)}/year) 
            for {timeHorizon} years, expecting {expectedReturn}% annual returns.
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
            <div className="font-semibold mb-1">How Investment Returns Work</div>
            <div>
              The future value of your investment is calculated using:<br />
              <span className="font-mono">FV = P(1 + r)<sup>t</sup> + PMT × [((1 + r/12)<sup>n</sup> - 1) / (r/12)]</span><br /><br />
              <b>P</b> = initial investment<br />
              <b>r</b> = annual return rate (decimal)<br />
              <b>t</b> = number of years<br />
              <b>PMT</b> = monthly contribution<br />
              <b>n</b> = total months<br /><br />
              <b>Step-by-step for your values:</b><br />
              1. <b>Future value of initial investment:</b> <span className="font-mono">{initialInvestment} × (1 + {parseFloat(expectedReturn)/100})<sup>{timeHorizon}</sup> = {formatNumber(results.initialFV)}</span><br />
              2. <b>Future value of monthly contributions:</b> <span className="font-mono">{monthlyContribution} × [((1 + {(parseFloat(expectedReturn)/100/12).toFixed(6)})<sup>{parseFloat(timeHorizon)*12}</sup> - 1) / {(parseFloat(expectedReturn)/100/12).toFixed(6)}]</span> = {formatNumber(results.monthlyFV)}<br />
              3. <b>Total future value:</b> <span className="font-mono">{formatNumber(results.futureValue)}</span><br />
              4. <b>Total contributions:</b> <span className="font-mono">{formatNumber(results.totalContributions)}</span><br />
              5. <b>Total gains:</b> <span className="font-mono">{formatNumber(results.totalGains)}</span><br />
              6. <b>Adjusted for inflation ({inflationRate}%):</b> <span className="font-mono">{formatNumber(results.realValue)}</span><br /><br />
              <b>Summary:</b><br />
              If you invest <b>${initialInvestment}</b> with <b>${monthlyContribution}</b> monthly contributions, at <b>{expectedReturn}%</b> expected annual return for <b>{timeHorizon} years</b>, your investment will grow to <b>${formatNumber(results.futureValue)}</b> (real value: <b>${formatNumber(results.realValue)}</b> after inflation).
            </div>
          </div>
      </CardContent>
    </Card>
  );
}