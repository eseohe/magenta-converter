import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { PiggyBank, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function RetirementPlanningConverter() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSalary, setCurrentSalary] = useState("75000");
  const [currentBalance, setCurrentBalance] = useState("25000");
  const [contribution, setContribution] = useState("15");
  const [employerMatch, setEmployerMatch] = useState("6");
  const [salaryGrowth, setSalaryGrowth] = useState("3");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("2.5");

  const calculateRetirement = () => {
    const age = parseFloat(currentAge) || 30;
    const retAge = parseFloat(retirementAge) || 65;
    const salary = parseFloat(currentSalary) || 0;
    const balance = parseFloat(currentBalance) || 0;
    const contribPercent = (parseFloat(contribution) || 0) / 100;
    const matchPercent = (parseFloat(employerMatch) || 0) / 100;
    const salGrowthRate = (parseFloat(salaryGrowth) || 0) / 100;
    const annualReturn = (parseFloat(returnRate) || 0) / 100;
    const inflation = (parseFloat(inflationRate) || 0) / 100;
    
    const yearsToRetirement = retAge - age;
    
    if (yearsToRetirement <= 0) {
      return {
        finalBalance: balance,
        totalContributions: 0,
        employerContributions: 0,
        investmentGains: 0,
        realValue: balance,
        monthlyIncome: 0,
        realMonthlyIncome: 0,
        replacementRatio: 0,
        yearlyContribution: 0,
        finalSalary: salary,
        yearsToRetirement: 0
      };
    }

    let projectedBalance = balance;
    let totalPersonalContrib = 0;
    let totalEmployerContrib = 0;
    let currentYearlySalary = salary;

    // Project year by year
    for (let year = 0; year < yearsToRetirement; year++) {
      // Calculate contributions for this year
      const yearlyPersonalContrib = currentYearlySalary * contribPercent;
      const yearlyEmployerContrib = Math.min(
        currentYearlySalary * matchPercent,
        yearlyPersonalContrib
      );
      
      // Add contributions
      projectedBalance += yearlyPersonalContrib + yearlyEmployerContrib;
      totalPersonalContrib += yearlyPersonalContrib;
      totalEmployerContrib += yearlyEmployerContrib;
      
      // Apply investment return
      projectedBalance *= (1 + annualReturn);
      
      // Grow salary for next year
      currentYearlySalary *= (1 + salGrowthRate);
    }

    const totalContributions = totalPersonalContrib + totalEmployerContrib;
    const investmentGains = projectedBalance - balance - totalContributions;
    const realValue = projectedBalance / Math.pow(1 + inflation, yearsToRetirement);
    
    // Calculate retirement income (4% rule)
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    const realMonthlyIncome = (realValue * 0.04) / 12;
    
    // Replacement ratio
    const finalSalary = salary * Math.pow(1 + salGrowthRate, yearsToRetirement);
    const replacementRatio = (monthlyIncome * 12) / finalSalary * 100;

    return {
      finalBalance: projectedBalance,
      totalContributions: totalPersonalContrib,
      employerContributions: totalEmployerContrib,
      investmentGains,
      realValue,
      monthlyIncome,
      realMonthlyIncome: realMonthlyIncome || 0,
      replacementRatio,
      yearlyContribution: salary * contribPercent,
      finalSalary,
      yearsToRetirement
    };
  };

  const results = calculateRetirement();

  const reset = () => {
    setCurrentAge("30");
    setRetirementAge("65");
    setCurrentSalary("75000");
    setCurrentBalance("25000");
    setContribution("15");
    setEmployerMatch("6");
    setSalaryGrowth("3");
    setReturnRate("7");
    setInflationRate("2.5");
  };

  const copyResult = async () => {
    const text = `Retirement Projection:
Current Age: ${currentAge} → Retirement Age: ${retirementAge} (${results.yearsToRetirement} years)
Starting Balance: $${formatNumber(parseFloat(currentBalance))}
Final Balance: $${formatNumber(results.finalBalance)}
Real Value: $${formatNumber(results.realValue)}

Contributions:
Personal: $${formatNumber(results.totalContributions)}
Employer Match: $${formatNumber(results.employerContributions)}
Investment Gains: $${formatNumber(results.investmentGains)}

Retirement Income:
Monthly Income: $${formatNumber(results.monthlyIncome)}
Real Monthly Income: $${formatNumber(results.realMonthlyIncome)}
Income Replacement: ${results.replacementRatio.toFixed(1)}%`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <PiggyBank className="size-4" />
          </span>
          Retirement Planning Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Personal Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  placeholder="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  placeholder="65"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentSalary">Current Annual Salary ($)</Label>
                <Input
                  id="currentSalary"
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  placeholder="75000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentBalance">Current 401k Balance ($)</Label>
                <Input
                  id="currentBalance"
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder="25000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Contribution Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contribution">Your Contribution (%)</Label>
                <Input
                  id="contribution"
                  type="number"
                  step="0.5"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employerMatch">Employer Match (%)</Label>
                <Input
                  id="employerMatch"
                  type="number"
                  step="0.5"
                  value={employerMatch}
                  onChange={(e) => setEmployerMatch(e.target.value)}
                  placeholder="6"
                />
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Annual Contributions:</strong><br/>
                Your: ${formatNumber(results.yearlyContribution)}<br/>
                Employer: ${formatNumber(Math.min(parseFloat(currentSalary) * parseFloat(employerMatch) / 100, results.yearlyContribution))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Growth Assumptions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returnRate">Annual Return Rate (%)</Label>
                <Input
                  id="returnRate"
                  type="number"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(e.target.value)}
                  placeholder="7"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryGrowth">Annual Salary Growth (%)</Label>
                <Input
                  id="salaryGrowth"
                  type="number"
                  step="0.1"
                  value={salaryGrowth}
                  onChange={(e) => setSalaryGrowth(e.target.value)}
                  placeholder="3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Retirement Projection</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Projected Balance at Retirement</div>
              <div className="text-3xl font-bold text-green-600">
                ${formatNumber(results.finalBalance)}
              </div>
              <div className="text-sm text-muted-foreground">
                Real Value (Today's Dollars): ${formatNumber(results.realValue)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Your Total Contributions</div>
              <div className="text-xl font-semibold text-blue-600">
                ${formatNumber(results.totalContributions)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Employer Match Total</div>
              <div className="text-xl font-semibold text-green-600">
                ${formatNumber(results.employerContributions)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Investment Gains</div>
              <div className="text-xl font-semibold text-purple-600">
                ${formatNumber(results.investmentGains)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Years to Retirement</div>
              <div className="text-xl font-semibold">
                {results.yearsToRetirement}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Retirement Income (4% Withdrawal Rule)</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Income</div>
                <div className="text-2xl font-bold text-green-600">
                  ${formatNumber(results.monthlyIncome)}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Real Monthly Income</div>
                <div className="text-xl font-semibold text-blue-600">
                  ${formatNumber(results.realMonthlyIncome)}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Income Replacement</div>
                <div className="text-xl font-semibold text-purple-600">
                  {results.replacementRatio.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Retirement Readiness:</strong> Financial experts typically recommend replacing 70-90% of your pre-retirement income. 
            Your projected replacement ratio is {results.replacementRatio.toFixed(1)}%. 
            {results.replacementRatio >= 70 
              ? "You're on track for a comfortable retirement! 🎉" 
              : "Consider increasing your contribution rate or working longer to improve your retirement security."
            }
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={reset}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={copyResult}>
            <Copy className="mr-2 size-4" />
            Copy Projection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}