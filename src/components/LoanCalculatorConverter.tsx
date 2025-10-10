import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Calculator, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function LoanCalculatorConverter() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [downPayment, setDownPayment] = useState("60000");

  const calculateLoan = () => {
    const principal = (parseFloat(loanAmount) || 0) - (parseFloat(downPayment) || 0);
    const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
    const numberOfPayments = (parseFloat(loanTerm) || 0) * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalAmount: principal,
        principal: principal,
        downPaymentPercent: 0
      };
    }

    // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - principal;
    const downPaymentPercent = ((parseFloat(downPayment) || 0) / (parseFloat(loanAmount) || 1)) * 100;

    return {
      monthlyPayment,
      totalInterest,
      totalAmount,
      principal,
      downPaymentPercent
    };
  };

  const results = calculateLoan();

  const reset = () => {
    setLoanAmount("300000");
    setInterestRate("6.5");
    setLoanTerm("30");
    setDownPayment("60000");
  };

  const copyResult = async () => {
    const text = `Loan Amount: $${formatNumber(parseFloat(loanAmount))}
Down Payment: $${formatNumber(parseFloat(downPayment))} (${results.downPaymentPercent.toFixed(1)}%)
Principal: $${formatNumber(results.principal)}
Monthly Payment: $${formatNumber(results.monthlyPayment)}
Total Interest: $${formatNumber(results.totalInterest)}
Total Amount Paid: $${formatNumber(results.totalAmount + parseFloat(downPayment))}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Calculator className="size-4" />
          </span>
          Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount ($)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="300000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment ($)</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="60000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="6.5"
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

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loan Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-2xl font-bold text-blue-600">
                ${formatNumber(results.monthlyPayment)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-xl font-semibold text-red-600">
                ${formatNumber(results.totalInterest)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Principal Amount</div>
              <div className="text-xl font-semibold">
                ${formatNumber(results.principal)}
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Down Payment</div>
              <div className="text-lg font-semibold text-green-600">
                ${formatNumber(parseFloat(downPayment))} ({results.downPaymentPercent.toFixed(1)}%)
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-lg font-semibold text-purple-600">
                ${formatNumber(results.totalAmount + parseFloat(downPayment))}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            Over {loanTerm} years, you'll pay ${formatNumber(results.totalInterest)} in interest on top of the ${formatNumber(results.principal)} principal, 
            for a total of ${formatNumber(results.totalAmount + parseFloat(downPayment))} including your down payment.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={reset}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={copyResult}>
            <Copy className="mr-2 size-4" />
            Copy Summary
          </Button>
        </div>

        {/* Explanation Section */}
        <div className="mt-8 p-4 rounded-lg bg-muted/20 text-sm">
          <div className="font-semibold mb-1">How Loan Payments Work</div>
          <div>
            The monthly payment is calculated using:<br />
            <span className="font-mono">M = P × [r(1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> - 1]</span><br /><br />
            <b>P</b> = principal (loan amount minus down payment)<br />
            <b>r</b> = monthly interest rate (annual rate / 12)<br />
            <b>n</b> = total number of payments (months)<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Principal:</b> <span className="font-mono">{loanAmount} - {downPayment} = {results.principal.toFixed(2)}</span><br />
            2. <b>Monthly interest rate:</b> <span className="font-mono">({interestRate} / 100) / 12 = {(parseFloat(interestRate)/100/12).toFixed(6)}</span><br />
            3. <b>Number of payments:</b> <span className="font-mono">{loanTerm} × 12 = {parseFloat(loanTerm)*12}</span><br />
            4. <b>Monthly payment:</b> <span className="font-mono">{results.principal.toFixed(2)} × [{(parseFloat(interestRate)/100/12).toFixed(6)} × (1 + {(parseFloat(interestRate)/100/12).toFixed(6)})<sup>{parseFloat(loanTerm)*12}</sup>] / [(1 + {(parseFloat(interestRate)/100/12).toFixed(6)})<sup>{parseFloat(loanTerm)*12}</sup> - 1]</span> = <span className="font-mono">${formatNumber(results.monthlyPayment)}</span><br />
            5. <b>Total interest paid:</b> <span className="font-mono">${formatNumber(results.totalInterest)}</span><br />
            6. <b>Total cost (including down payment):</b> <span className="font-mono">${formatNumber(results.totalAmount + parseFloat(downPayment))}</span><br /><br />
            <b>Summary:</b><br />
            For a loan amount of <b>${loanAmount}</b> with a <b>${downPayment}</b> down payment, a <b>{loanTerm}-year</b> loan at <b>{interestRate}%</b> interest, your monthly payment will be <b>${formatNumber(results.monthlyPayment)}</b> and the total cost will be <b>${formatNumber(results.totalAmount + parseFloat(downPayment))}</b>.<br />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}