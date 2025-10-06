import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { TrendingUp, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function CompoundInterestConverter() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [compoundFrequency, setCompoundFrequency] = useState("12"); // Monthly
  const [monthlyContribution, setMonthlyContribution] = useState("0");

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compoundFrequency) || 1;
    const PMT = parseFloat(monthlyContribution) || 0;

    // Compound interest formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    if (P === 0 && PMT === 0) return { 
      futureValue: 0, 
      totalInterest: 0, 
      totalContributions: 0,
      principalGrowth: 0,
      contributionsGrowth: 0
    };

    const compoundFactor = Math.pow(1 + r/n, n * t);
    
    // Future value of principal
    const principalFV = P * compoundFactor;
    
    // Future value of annuity (monthly contributions)
    let annuityFV = 0;
    if (PMT > 0 && r > 0) {
      const monthlyRate = r / 12;
      const months = t * 12;
      annuityFV = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (PMT > 0) {
      annuityFV = PMT * t * 12; // No interest case
    }

    const futureValue = principalFV + annuityFV;
    const totalContributions = P + (PMT * 12 * t);
    const totalInterest = futureValue - totalContributions;

    return {
      futureValue,
      totalInterest,
      totalContributions,
      principalGrowth: principalFV - P,
      contributionsGrowth: annuityFV - (PMT * 12 * t)
    };
  };

  const results = calculateCompoundInterest();

  const reset = () => {
    setPrincipal("10000");
    setRate("7");
    setYears("10");
    setCompoundFrequency("12");
    setMonthlyContribution("0");
  };

  const copyResult = async () => {
    const text = `Future Value: $${formatNumber(results.futureValue)}
Total Interest Earned: $${formatNumber(results.totalInterest)}
Total Contributions: $${formatNumber(results.totalContributions)}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </span>
          Compound Interest Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Initial Investment ($)</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="7"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="years">Time Period (Years)</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Compounding Frequency</Label>
              <select
                id="frequency"
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="52">Weekly</option>
                <option value="365">Daily</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution ($)</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Future Value</div>
              <div className="text-2xl font-bold text-green-600">
                ${formatNumber(results.futureValue)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-xl font-semibold text-blue-600">
                ${formatNumber(results.totalInterest)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Contributions</div>
              <div className="text-xl font-semibold">
                ${formatNumber(results.totalContributions)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Interest Rate</div>
              <div className="text-xl font-semibold text-purple-600">
                {((results.totalInterest / results.totalContributions) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {results.principalGrowth > 0 && (
            <div className="text-sm text-muted-foreground">
              Your initial ${formatNumber(parseFloat(principal))} will grow to ${formatNumber(parseFloat(principal) + results.principalGrowth)} 
              {results.contributionsGrowth > 0 && (
                <span>, and your ${formatNumber(parseFloat(monthlyContribution) * 12 * parseFloat(years))} in contributions will grow to ${formatNumber(parseFloat(monthlyContribution) * 12 * parseFloat(years) + results.contributionsGrowth)}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={reset}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={copyResult}>
            <Copy className="mr-2 size-4" />
            Copy Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}