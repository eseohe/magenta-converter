import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Calculator, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface TaxBracketBreakdown {
  min: number;
  max: string | number;
  rate: number;
  taxableAmount: number;
  tax: number;
}

const TAX_BRACKETS_2024: { [key: string]: TaxBracket[] } = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  marriedJointly: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ],
  marriedSeparately: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 }
  ]
};

const STANDARD_DEDUCTIONS_2024: { [key: string]: number } = {
  single: 13850,
  marriedJointly: 27700,
  marriedSeparately: 13850,
  headOfHousehold: 20800
};

export function TaxCalculatorConverter() {
  const [grossIncome, setGrossIncome] = useState("75000");
  const [filingStatus, setFilingStatus] = useState("single");
  const [itemizedDeductions, setItemizedDeductions] = useState("0");
  const [useItemized, setUseItemized] = useState(false);
  const [contributionsPre, setContributionsPre] = useState("5000"); // 401k, traditional IRA
  const [contributionsRoth, setContributionsRoth] = useState("0"); // Roth IRA, after-tax
  const [stateRate, setStateRate] = useState("7"); // State tax rate %
  const [ficaExempt, setFicaExempt] = useState(false);
  const [dependents, setDependents] = useState("0");
  const [childTaxCredit, setChildTaxCredit] = useState("0");

  const calculateTaxes = () => {
    const income = parseFloat(grossIncome) || 0;
    const itemized = parseFloat(itemizedDeductions) || 0;
    const preTaxContrib = parseFloat(contributionsPre) || 0;
    const rothContrib = parseFloat(contributionsRoth) || 0;
    const stateTaxRate = (parseFloat(stateRate) || 0) / 100;
    const numDependents = parseInt(dependents) || 0;
    const childCredit = parseFloat(childTaxCredit) || 0;

    // Standard deduction
    const standardDeduction = STANDARD_DEDUCTIONS_2024[filingStatus];
    const deduction = useItemized ? Math.max(itemized, standardDeduction) : standardDeduction;
    
    // Adjusted Gross Income (AGI)
    const agi = Math.max(0, income - preTaxContrib);
    
    // Taxable income
    const taxableIncome = Math.max(0, agi - deduction);
    
    // Federal tax calculation
    const brackets = TAX_BRACKETS_2024[filingStatus];
    let federalTax = 0;
    let remainingIncome = taxableIncome;
  const bracketBreakdown: TaxBracketBreakdown[] = [];
    
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      const taxInBracket = taxableInBracket * bracket.rate;
      
      if (taxableInBracket > 0) {
        bracketBreakdown.push({
          min: bracket.min,
          max: bracket.max === Infinity ? "∞" : bracket.max,
          rate: bracket.rate * 100,
          taxableAmount: taxableInBracket,
          tax: taxInBracket
        });
        
        federalTax += taxInBracket;
        remainingIncome -= taxableInBracket;
      }
    }

    // Tax credits
    const totalCredits = childCredit;
    const federalTaxAfterCredits = Math.max(0, federalTax - totalCredits);

    // FICA taxes (Social Security + Medicare)
    const socialSecurityWage = Math.min(income, 160200); // 2024 SS wage base
    const socialSecurityTax = ficaExempt ? 0 : socialSecurityWage * 0.062;
    const medicareTax = ficaExempt ? 0 : income * 0.0145;
    const additionalMedicareTax = income > (filingStatus.includes('married') && filingStatus.includes('Jointly') ? 250000 : 200000) ? 
      (income - (filingStatus.includes('married') && filingStatus.includes('Jointly') ? 250000 : 200000)) * 0.009 : 0;
    const totalFicaTax = socialSecurityTax + medicareTax + additionalMedicareTax;

    // State tax (simplified flat rate)
    const stateTax = agi * stateTaxRate;

    // Total taxes
    const totalTax = federalTaxAfterCredits + totalFicaTax + stateTax;
    
    // Net income
    const netIncome = income - totalTax - rothContrib;
    
    // Effective and marginal tax rates
    const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;
    
    // Find marginal rate
    let marginalRate = 0;
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        marginalRate = bracket.rate * 100;
      }
    }

    // Tax efficiency metrics
    const taxSavingsFromDeductions = (deduction - (useItemized ? 0 : standardDeduction)) * (marginalRate / 100);
    const taxSavingsFromPreTax = preTaxContrib * (marginalRate / 100);

    return {
      grossIncome: income,
      agi,
      taxableIncome,
      deduction,
      federalTax,
      federalTaxAfterCredits,
      totalCredits,
      socialSecurityTax,
      medicareTax,
      additionalMedicareTax,
      totalFicaTax,
      stateTax,
      totalTax,
      netIncome,
      effectiveTaxRate,
      marginalRate,
      bracketBreakdown,
      taxSavingsFromDeductions,
      taxSavingsFromPreTax,
      takeHomePercent: income > 0 ? (netIncome / income) * 100 : 0
    };
  };

  const results = calculateTaxes();

  const reset = () => {
    setGrossIncome("75000");
    setFilingStatus("single");
    setItemizedDeductions("0");
    setUseItemized(false);
    setContributionsPre("5000");
    setContributionsRoth("0");
    setStateRate("7");
    setFicaExempt(false);
    setDependents("0");
    setChildTaxCredit("0");
  };

  const copyResult = async () => {
    const text = `Tax Calculation Summary:
Gross Income: $${formatNumber(results.grossIncome)}
Adjusted Gross Income: $${formatNumber(results.agi)}
Taxable Income: $${formatNumber(results.taxableIncome)}
Total Deduction: $${formatNumber(results.deduction)}

Tax Breakdown:
Federal Tax (before credits): $${formatNumber(results.federalTax)}
Tax Credits Applied: $${formatNumber(results.totalCredits)}
Federal Tax (after credits): $${formatNumber(results.federalTaxAfterCredits)}
Social Security Tax: $${formatNumber(results.socialSecurityTax)}
Medicare Tax: $${formatNumber(results.medicareTax)}
${results.additionalMedicareTax > 0 ? `Additional Medicare Tax: $${formatNumber(results.additionalMedicareTax)}\n` : ''}State Tax: $${formatNumber(results.stateTax)}
Total Tax: $${formatNumber(results.totalTax)}

Net Income: $${formatNumber(results.netIncome)}
Effective Tax Rate: ${results.effectiveTaxRate.toFixed(2)}%
Marginal Tax Rate: ${results.marginalRate.toFixed(0)}%
Take-Home Percentage: ${results.takeHomePercent.toFixed(1)}%

Tax Bracket Breakdown:
${results.bracketBreakdown.map(b => 
`${b.rate.toFixed(0)}% bracket ($${formatNumber(b.min)} - $${b.max}): $${formatNumber(b.taxableAmount)} → $${formatNumber(b.tax)}`
).join('\n')}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Calculator className="size-4" />
          </span>
          Tax Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Income & Filing Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grossIncome">Gross Annual Income ($)</Label>
                <Input
                  id="grossIncome"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(e.target.value)}
                  placeholder="75000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select value={filingStatus} onValueChange={setFilingStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="marriedJointly">Married Filing Jointly</SelectItem>
                    <SelectItem value="marriedSeparately">Married Filing Separately</SelectItem>
                    <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Deductions & Contributions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useItemized"
                    checked={useItemized}
                    onChange={(e) => setUseItemized(e.target.checked)}
                    className="size-4"
                  />
                  <Label htmlFor="useItemized" className="text-sm">Use Itemized Deductions</Label>
                </div>
                <div className="text-xs text-muted-foreground">
                  Standard deduction: ${formatNumber(STANDARD_DEDUCTIONS_2024[filingStatus])}
                </div>
              </div>
              
              {useItemized && (
                <div className="space-y-2">
                  <Label htmlFor="itemizedDeductions">Itemized Deductions ($)</Label>
                  <Input
                    id="itemizedDeductions"
                    type="number"
                    value={itemizedDeductions}
                    onChange={(e) => setItemizedDeductions(e.target.value)}
                    placeholder="15000"
                  />
                  <div className="text-xs text-muted-foreground">
                    SALT, mortgage interest, charitable donations, etc.
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="contributionsPre">Pre-Tax Contributions ($)</Label>
                <Input
                  id="contributionsPre"
                  type="number"
                  value={contributionsPre}
                  onChange={(e) => setContributionsPre(e.target.value)}
                  placeholder="5000"
                />
                <div className="text-xs text-muted-foreground">
                  401k, traditional IRA, HSA contributions
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contributionsRoth">Roth Contributions ($)</Label>
                <Input
                  id="contributionsRoth"
                  type="number"
                  value={contributionsRoth}
                  onChange={(e) => setContributionsRoth(e.target.value)}
                  placeholder="0"
                />
                <div className="text-xs text-muted-foreground">
                  Roth IRA (after-tax dollars)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="childTaxCredit">Child Tax Credit ($)</Label>
            <Input
              id="childTaxCredit"
              type="number"
              value={childTaxCredit}
              onChange={(e) => setChildTaxCredit(e.target.value)}
              placeholder="0"
            />
            <div className="text-xs text-muted-foreground">
              $2,000 per qualifying child under 17
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stateRate">State Tax Rate (%)</Label>
            <Input
              id="stateRate"
              type="number"
              step="0.1"
              value={stateRate}
              onChange={(e) => setStateRate(e.target.value)}
              placeholder="7"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ficaExempt"
                checked={ficaExempt}
                onChange={(e) => setFicaExempt(e.target.checked)}
                className="size-4"
              />
              <Label htmlFor="ficaExempt" className="text-sm">FICA Exempt</Label>
            </div>
            <div className="text-xs text-muted-foreground">
              Some government employees are exempt
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tax Calculation Results</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Net Income</div>
                <div className="text-2xl font-bold text-green-600">
                  ${formatNumber(results.netIncome)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.takeHomePercent.toFixed(1)}% take-home
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Tax</div>
                <div className="text-2xl font-bold text-red-600">
                  ${formatNumber(results.totalTax)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.effectiveTaxRate.toFixed(2)}% effective rate
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Marginal Rate</div>
                <div className="text-2xl font-bold text-orange-600">
                  {results.marginalRate.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Next dollar taxed at
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Gross Income</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.grossIncome)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">AGI</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.agi)}
              </div>
              <div className="text-xs text-muted-foreground">
                After pre-tax contributions
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Taxable Income</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.taxableIncome)}
              </div>
              <div className="text-xs text-muted-foreground">
                After ${formatNumber(results.deduction)} deduction
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Tax Savings</div>
              <div className="text-lg font-semibold text-green-600">
                ${formatNumber(results.taxSavingsFromPreTax + results.taxSavingsFromDeductions)}
              </div>
              <div className="text-xs text-muted-foreground">
                From deductions & pre-tax
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Tax Breakdown</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-background border rounded">
                  <span className="text-sm">Federal Income Tax</span>
                  <span className="font-medium">${formatNumber(results.federalTaxAfterCredits)}</span>
                </div>
                {results.totalCredits > 0 && (
                  <div className="flex justify-between items-center p-2 bg-green-50 border rounded">
                    <span className="text-sm">Tax Credits Applied</span>
                    <span className="font-medium text-green-600">-${formatNumber(results.totalCredits)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-2 bg-background border rounded">
                  <span className="text-sm">Social Security Tax</span>
                  <span className="font-medium">${formatNumber(results.socialSecurityTax)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background border rounded">
                  <span className="text-sm">Medicare Tax</span>
                  <span className="font-medium">${formatNumber(results.medicareTax)}</span>
                </div>
                {results.additionalMedicareTax > 0 && (
                  <div className="flex justify-between items-center p-2 bg-background border rounded">
                    <span className="text-sm">Additional Medicare Tax</span>
                    <span className="font-medium">${formatNumber(results.additionalMedicareTax)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-2 bg-background border rounded">
                  <span className="text-sm">State Tax</span>
                  <span className="font-medium">${formatNumber(results.stateTax)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Federal Tax Brackets</div>
                {results.bracketBreakdown.map((bracket, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-background border rounded text-sm">
                    <span>{bracket.rate.toFixed(0)}% bracket</span>
                    <span>${formatNumber(bracket.tax)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Tax Planning Insights:</strong></div>
            <div><strong>Effective vs Marginal:</strong> You pay an effective rate of {results.effectiveTaxRate.toFixed(2)}%, but your next dollar of income is taxed at {results.marginalRate.toFixed(0)}%.</div>
            <div><strong>Pre-tax Savings:</strong> Every $1,000 in pre-tax contributions saves you ${formatNumber((results.marginalRate / 100) * 1000)} in taxes.</div>
            {results.taxableIncome < 95375 && filingStatus === 'single' && (
              <div><strong>Tax Planning:</strong> You're in the 22% bracket. Consider maximizing pre-tax contributions before moving to higher brackets.</div>
            )}
            <div className="text-xs mt-2">* 2024 tax brackets and standard deductions. Consult a tax professional for comprehensive planning.</div>
          </div>
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
        {/* Explanation Section */}
        <div className="mt-8 p-4 rounded-lg bg-muted/20 text-sm">
          <div className="font-semibold mb-1">How Tax Calculation Works</div>
          <div>
            <b>Formula:</b><br />
            <span className="font-mono">Taxable Income = Gross Income - Pre-tax Contributions - Deductions</span><br />
            <span className="font-mono">Federal Tax = Σ (taxable amount in bracket × rate)</span><br />
            <span className="font-mono">Total Tax = Federal Tax - Credits + FICA + State Tax</span><br /><br />
            <b>Variables:</b><br />
            <b>Gross Income</b>: total annual income<br />
            <b>Pre-tax Contributions</b>: 401k, IRA, HSA<br />
            <b>Deductions</b>: standard or itemized<br />
            <b>Taxable Income</b>: income after deductions<br />
            <b>Federal Tax</b>: calculated using progressive tax brackets<br />
            <b>Credits</b>: child tax credit, etc.<br />
            <b>FICA</b>: Social Security & Medicare<br />
            <b>State Tax</b>: flat rate on AGI<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Gross income:</b> ${formatNumber(results.grossIncome)}<br />
            2. <b>Pre-tax contributions:</b> ${formatNumber(parseFloat(contributionsPre))}<br />
            3. <b>Deductions used:</b> ${formatNumber(results.deduction)}<br />
            4. <b>Taxable income:</b> ${formatNumber(results.taxableIncome)}<br />
            5. <b>Federal tax:</b> ${formatNumber(results.federalTax)}<br />
            6. <b>Credits applied:</b> ${formatNumber(results.totalCredits)}<br />
            7. <b>FICA taxes:</b> ${formatNumber(results.totalFicaTax)}<br />
            8. <b>State tax:</b> ${formatNumber(results.stateTax)}<br />
            9. <b>Total tax:</b> ${formatNumber(results.totalTax)}<br />
            10. <b>Net income:</b> ${formatNumber(results.netIncome)}<br />
            11. <b>Effective tax rate:</b> {results.effectiveTaxRate.toFixed(2)}%<br />
            12. <b>Marginal tax rate:</b> {results.marginalRate.toFixed(0)}%<br /><br />
            <b>Summary:</b><br />
            With a gross income of <b>${formatNumber(results.grossIncome)}</b>, after pre-tax contributions and deductions, your taxable income is <b>${formatNumber(results.taxableIncome)}</b>. Your total tax (federal, FICA, state) is <b>${formatNumber(results.totalTax)}</b>, leaving you with a net income of <b>${formatNumber(results.netIncome)}</b>.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}