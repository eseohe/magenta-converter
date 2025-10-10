import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Home, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function MortgageCalculatorConverter() {
  const [homePrice, setHomePrice] = useState("450000");
  const [downPayment, setDownPayment] = useState("90000");
  const [interestRate, setInterestRate] = useState("7.2");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTax, setPropertyTax] = useState("5400");
  const [homeInsurance, setHomeInsurance] = useState("1200");
  const [pmi, setPmi] = useState("300");
  const [hoaFees, setHoaFees] = useState("0");

  const calculateMortgage = () => {
    const principal = (parseFloat(homePrice) || 0) - (parseFloat(downPayment) || 0);
    const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
    const numberOfPayments = (parseFloat(loanTerm) || 0) * 12;
    
    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return {
        monthlyPrincipalInterest: 0,
        monthlyPropertyTax: 0,
        monthlyInsurance: 0,
        monthlyPMI: 0,
        monthlyHOA: 0,
        totalMonthlyPayment: 0,
        totalInterest: 0,
        downPaymentPercent: 0,
        loanToValue: 0,
        principal: 0
      };
    }

    // Monthly payment formula for principal and interest
    const monthlyPrincipalInterest = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const monthlyPropertyTax = (parseFloat(propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(pmi) || 0;
    const monthlyHOA = parseFloat(hoaFees) || 0;
    
    const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + 
                               monthlyInsurance + monthlyPMI + monthlyHOA;
    
    const totalInterest = (monthlyPrincipalInterest * numberOfPayments) - principal;
    const downPaymentPercent = ((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) * 100;
    const loanToValue = (principal / (parseFloat(homePrice) || 1)) * 100;

    return {
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment,
      totalInterest,
      downPaymentPercent,
      loanToValue,
      principal
    };
  };

  const results = calculateMortgage();

  const reset = () => {
    setHomePrice("450000");
    setDownPayment("90000");
    setInterestRate("7.2");
    setLoanTerm("30");
    setPropertyTax("5400");
    setHomeInsurance("1200");
    setPmi("300");
    setHoaFees("0");
  };

  const copyResult = async () => {
    const text = `Home Price: $${formatNumber(parseFloat(homePrice))}
Down Payment: $${formatNumber(parseFloat(downPayment))} (${results.downPaymentPercent.toFixed(1)}%)
Loan Amount: $${formatNumber(results.principal)}
Total Monthly Payment: $${formatNumber(results.totalMonthlyPayment)}
  - Principal & Interest: $${formatNumber(results.monthlyPrincipalInterest)}
  - Property Tax: $${formatNumber(results.monthlyPropertyTax)}
  - Insurance: $${formatNumber(results.monthlyInsurance)}
  - PMI: $${formatNumber(results.monthlyPMI)}
  - HOA: $${formatNumber(results.monthlyHOA)}
Total Interest: $${formatNumber(results.totalInterest)}
Loan-to-Value: ${results.loanToValue.toFixed(1)}%`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Home className="size-4" />
          </span>
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Loan Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homePrice">Home Price ($)</Label>
                <Input
                  id="homePrice"
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  placeholder="450000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment ($)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="90000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Monthly Costs</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyTax">Annual Property Tax ($)</Label>
                <Input
                  id="propertyTax"
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  placeholder="5400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="homeInsurance">Annual Home Insurance ($)</Label>
                <Input
                  id="homeInsurance"
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(e.target.value)}
                  placeholder="1200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pmi">Monthly PMI ($)</Label>
                <Input
                  id="pmi"
                  type="number"
                  value={pmi}
                  onChange={(e) => setPmi(e.target.value)}
                  placeholder="300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hoaFees">Monthly HOA Fees ($)</Label>
                <Input
                  id="hoaFees"
                  type="number"
                  value={hoaFees}
                  onChange={(e) => setHoaFees(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Monthly Payment Breakdown</h3>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Total Monthly Payment</div>
              <div className="text-3xl font-bold text-blue-600">
                ${formatNumber(results.totalMonthlyPayment)}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Principal & Interest</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.monthlyPrincipalInterest)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Property Tax</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.monthlyPropertyTax)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Home Insurance</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.monthlyInsurance)}
              </div>
            </div>
            
            {results.monthlyPMI > 0 && (
              <div className="space-y-1 p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">PMI</div>
                <div className="text-lg font-semibold text-orange-600">
                  ${formatNumber(results.monthlyPMI)}
                </div>
              </div>
            )}
            
            {results.monthlyHOA > 0 && (
              <div className="space-y-1 p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">HOA Fees</div>
                <div className="text-lg font-semibold">
                  ${formatNumber(results.monthlyHOA)}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Down Payment</div>
              <div className="text-base font-semibold text-green-600">
                ${formatNumber(parseFloat(downPayment))} ({results.downPaymentPercent.toFixed(1)}%)
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Loan Amount</div>
              <div className="text-base font-semibold">
                ${formatNumber(results.principal)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-base font-semibold text-red-600">
                ${formatNumber(results.totalInterest)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Loan-to-Value</div>
              <div className="text-base font-semibold text-purple-600">
                {results.loanToValue.toFixed(1)}%
              </div>
            </div>
          </div>

          {results.loanToValue > 80 && (
            <div className="text-sm text-muted-foreground bg-orange-50 border border-orange-200 p-3 rounded-md">
              <strong>Note:</strong> Your loan-to-value ratio is {results.loanToValue.toFixed(1)}%. 
              You may need to pay PMI until you reach 20% equity (80% LTV).
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
            Copy Breakdown
          </Button>
        </div>

        {/* Explanation Section */}
        <div className="mt-8 p-4 rounded-lg bg-muted/20 text-sm">
          <div className="font-semibold mb-1">How Mortgage Payments Work</div>
          <div>
            The monthly principal and interest payment is calculated using:<br />
            <span className="font-mono">M = P × [r(1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> - 1]</span><br /><br />
            <b>P</b> = loan amount<br />
            <b>r</b> = monthly interest rate (annual rate / 12)<br />
            <b>n</b> = total number of payments (months)<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Loan amount:</b> <span className="font-mono">{homePrice} - {downPayment} = {results.principal.toFixed(2)}</span><br />
            2. <b>Monthly interest rate:</b> <span className="font-mono">({interestRate} / 100) / 12 = {(parseFloat(interestRate)/100/12).toFixed(6)}</span><br />
            3. <b>Number of payments:</b> <span className="font-mono">{loanTerm} × 12 = {parseFloat(loanTerm)*12}</span><br />
            4. <b>Monthly principal & interest:</b> <span className="font-mono">{results.principal.toFixed(2)} × [{(parseFloat(interestRate)/100/12).toFixed(6)} × (1 + {(parseFloat(interestRate)/100/12).toFixed(6)})<sup>{parseFloat(loanTerm)*12}</sup>] / [(1 + {(parseFloat(interestRate)/100/12).toFixed(6)})<sup>{parseFloat(loanTerm)*12}</sup> - 1]</span> = <span className="font-mono">${formatNumber(results.monthlyPrincipalInterest)}</span><br />
            5. <b>Add monthly taxes, insurance, PMI, HOA:</b><br />
            &nbsp;&nbsp;Property Tax: <span className="font-mono">${formatNumber(results.monthlyPropertyTax)}</span><br />
            &nbsp;&nbsp;Insurance: <span className="font-mono">${formatNumber(results.monthlyInsurance)}</span><br />
            &nbsp;&nbsp;PMI: <span className="font-mono">${formatNumber(results.monthlyPMI)}</span><br />
            &nbsp;&nbsp;HOA: <span className="font-mono">${formatNumber(results.monthlyHOA)}</span><br />
            6. <b>Total monthly payment:</b> <span className="font-mono">${formatNumber(results.totalMonthlyPayment)}</span><br /><br />
            <b>Summary:</b><br />
            For a home price of <b>${homePrice}</b> with a <b>${downPayment}</b> down payment, a <b>{loanTerm}-year</b> loan at <b>{interestRate}%</b> interest, your total monthly payment will be <b>${formatNumber(results.totalMonthlyPayment)}</b>.<br />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}