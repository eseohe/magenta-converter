import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Percent, Copy, RotateCcw, TrendingUp, TrendingDown, Calculator } from "lucide-react";

interface PercentageResult {
  value: number;
  formatted: string;
  calculation: string;
}

export function PercentageCalculatorConverter() {
  // Basic percentage calculations
  const [basicValue, setBasicValue] = useState("50");
  const [basicTotal, setBasicTotal] = useState("200");
  const [basicPercent, setBasicPercent] = useState("25");
  const [basicBase, setBasicBase] = useState("80");

  // Percentage change
  const [originalValue, setOriginalValue] = useState("100");
  const [newValue, setNewValue] = useState("120");

  // Tips and discounts
  const [billAmount, setBillAmount] = useState("85.50");
  const [tipPercent, setTipPercent] = useState("18");
  const [itemPrice, setItemPrice] = useState("150");
  const [discountPercent, setDiscountPercent] = useState("20");

  // Tax calculations
  const [preTaxAmount, setPreTaxAmount] = useState("100");
  const [taxRate, setTaxRate] = useState("8.5");
  const [afterTaxAmount, setAfterTaxAmount] = useState("108.50");

  // Interest calculations
  const [principal, setPrincipal] = useState("1000");
  const [interestRate, setInterestRate] = useState("5");
  const [timePeriod, setTimePeriod] = useState("2");

  // Grade calculations
  const [correctAnswers, setCorrectAnswers] = useState("18");
  const [totalQuestions, setTotalQuestions] = useState("20");

  const calculateBasicPercentage = (): PercentageResult => {
    const value = parseFloat(basicValue);
    const total = parseFloat(basicTotal);
    const percentage = (value / total) * 100;
    
    return {
      value: percentage,
      formatted: `${percentage.toFixed(2)}%`,
      calculation: `(${value} ÷ ${total}) × 100`
    };
  };

  const calculatePercentOf = (): PercentageResult => {
    const percent = parseFloat(basicPercent);
    const base = parseFloat(basicBase);
    const result = (percent / 100) * base;
    
    return {
      value: result,
      formatted: result.toFixed(2),
      calculation: `(${percent}% × ${base})`
    };
  };

  const calculatePercentChange = (): { increase: PercentageResult; isIncrease: boolean } => {
    const original = parseFloat(originalValue);
    const current = parseFloat(newValue);
    const change = ((current - original) / original) * 100;
    const isIncrease = change >= 0;
    
    return {
      increase: {
        value: Math.abs(change),
        formatted: `${Math.abs(change).toFixed(2)}%`,
        calculation: `((${current} - ${original}) ÷ ${original}) × 100`
      },
      isIncrease
    };
  };

  const calculateTip = (): { tip: number; total: number; perPerson?: number } => {
    const bill = parseFloat(billAmount);
    const tip = (parseFloat(tipPercent) / 100) * bill;
    const total = bill + tip;
    
    return {
      tip,
      total,
      perPerson: total / 2 // Assuming 2 people for simplicity
    };
  };

  const calculateDiscount = (): { discount: number; finalPrice: number; savings: number } => {
    const price = parseFloat(itemPrice);
    const discount = (parseFloat(discountPercent) / 100) * price;
    const finalPrice = price - discount;
    
    return {
      discount,
      finalPrice,
      savings: discount
    };
  };

  const calculateTax = (): { tax: number; totalWithTax: number } => {
    const amount = parseFloat(preTaxAmount);
    const rate = parseFloat(taxRate);
    const tax = (rate / 100) * amount;
    const totalWithTax = amount + tax;
    
    return {
      tax,
      totalWithTax
    };
  };

  const calculatePreTaxAmount = (): { preTax: number; taxAmount: number } => {
    const afterTax = parseFloat(afterTaxAmount);
    const rate = parseFloat(taxRate);
    const preTax = afterTax / (1 + rate / 100);
    const taxAmount = afterTax - preTax;
    
    return {
      preTax,
      taxAmount
    };
  };

  const calculateSimpleInterest = (): { interest: number; totalAmount: number; monthlyPayment: number } => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timePeriod);
    
    const interest = p * r * t;
    const totalAmount = p + interest;
    const monthlyPayment = totalAmount / (t * 12);
    
    return {
      interest,
      totalAmount,
      monthlyPayment
    };
  };

  const calculateGrade = (): { percentage: number; letterGrade: string; points: number } => {
    const correct = parseFloat(correctAnswers);
    const total = parseFloat(totalQuestions);
    const percentage = (correct / total) * 100;
    
    let letterGrade = 'F';
    if (percentage >= 97) letterGrade = 'A+';
    else if (percentage >= 93) letterGrade = 'A';
    else if (percentage >= 90) letterGrade = 'A-';
    else if (percentage >= 87) letterGrade = 'B+';
    else if (percentage >= 83) letterGrade = 'B';
    else if (percentage >= 80) letterGrade = 'B-';
    else if (percentage >= 77) letterGrade = 'C+';
    else if (percentage >= 73) letterGrade = 'C';
    else if (percentage >= 70) letterGrade = 'C-';
    else if (percentage >= 67) letterGrade = 'D+';
    else if (percentage >= 65) letterGrade = 'D';
    
    const points = percentage >= 97 ? 4.0 :
                   percentage >= 93 ? 4.0 :
                   percentage >= 90 ? 3.7 :
                   percentage >= 87 ? 3.3 :
                   percentage >= 83 ? 3.0 :
                   percentage >= 80 ? 2.7 :
                   percentage >= 77 ? 2.3 :
                   percentage >= 73 ? 2.0 :
                   percentage >= 70 ? 1.7 :
                   percentage >= 67 ? 1.3 :
                   percentage >= 65 ? 1.0 : 0.0;
    
    return {
      percentage,
      letterGrade,
      points
    };
  };

  const copyResults = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setBasicValue("50");
    setBasicTotal("200");
    setBasicPercent("25");
    setBasicBase("80");
    setOriginalValue("100");
    setNewValue("120");
    setBillAmount("85.50");
    setTipPercent("18");
    setItemPrice("150");
    setDiscountPercent("20");
    setPreTaxAmount("100");
    setTaxRate("8.5");
    setAfterTaxAmount("108.50");
    setPrincipal("1000");
    setInterestRate("5");
    setTimePeriod("2");
    setCorrectAnswers("18");
    setTotalQuestions("20");
  };

  const basicPercentResult = calculateBasicPercentage();
  const percentOfResult = calculatePercentOf();
  const changeResult = calculatePercentChange();
  const tipResult = calculateTip();
  const discountResult = calculateDiscount();
  const taxResult = calculateTax();
  const preTaxResult = calculatePreTaxAmount();
  const interestResult = calculateSimpleInterest();
  const gradeResult = calculateGrade();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Percent className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Percentage Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate percentages, increases, decreases, tips, discounts, and more
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="change">Change</TabsTrigger>
          <TabsTrigger value="money">Money</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* What percentage is X of Y? */}
            <Card>
              <CardHeader>
                <CardTitle>What percentage is X of Y?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Value (X)</Label>
                      <Input
                        type="number"
                        value={basicValue}
                        onChange={(e) => setBasicValue(e.target.value)}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total (Y)</Label>
                      <Input
                        type="number"
                        value={basicTotal}
                        onChange={(e) => setBasicTotal(e.target.value)}
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Result:</div>
                    <div className="text-3xl font-bold text-primary">
                      {basicPercentResult.formatted}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {basicPercentResult.calculation}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyResults(`${basicValue} is ${basicPercentResult.formatted} of ${basicTotal}`)}
                  className="w-full"
                >
                  <Copy className="size-4 mr-2" />
                  Copy Result
                </Button>
              </CardContent>
            </Card>

            {/* What is X% of Y? */}
            <Card>
              <CardHeader>
                <CardTitle>What is X% of Y?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Percentage (%)</Label>
                      <Input
                        type="number"
                        value={basicPercent}
                        onChange={(e) => setBasicPercent(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Base Value</Label>
                      <Input
                        type="number"
                        value={basicBase}
                        onChange={(e) => setBasicBase(e.target.value)}
                        placeholder="80"
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Result:</div>
                    <div className="text-3xl font-bold text-primary">
                      {percentOfResult.formatted}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {percentOfResult.calculation}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyResults(`${basicPercent}% of ${basicBase} = ${percentOfResult.formatted}`)}
                  className="w-full"
                >
                  <Copy className="size-4 mr-2" />
                  Copy Result
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="change" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {changeResult.isIncrease ? 
                  <TrendingUp className="size-5 text-green-600" /> : 
                  <TrendingDown className="size-5 text-red-600" />
                }
                Percentage Change Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Original Value</Label>
                  <Input
                    type="number"
                    value={originalValue}
                    onChange={(e) => setOriginalValue(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Value</Label>
                  <Input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <div className="text-center space-y-3">
                  <div className={`text-4xl font-bold ${changeResult.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {changeResult.isIncrease ? '+' : '-'}{changeResult.increase.formatted}
                  </div>
                  <div className="text-lg">
                    {changeResult.isIncrease ? 'Increase' : 'Decrease'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {changeResult.increase.calculation}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Original</div>
                      <div className="text-lg font-semibold">{originalValue}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">New</div>
                      <div className="text-lg font-semibold">{newValue}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Difference</div>
                      <div className="text-lg font-semibold">
                        {(parseFloat(newValue) - parseFloat(originalValue)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => copyResults(`Change from ${originalValue} to ${newValue}: ${changeResult.isIncrease ? '+' : '-'}${changeResult.increase.formatted} (${changeResult.isIncrease ? 'increase' : 'decrease'})`)}
                className="w-full"
              >
                <Copy className="size-4 mr-2" />
                Copy Result
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="money" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tip Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Tip Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bill Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="85.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tip Percentage (%)</Label>
                    <Input
                      type="number"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(e.target.value)}
                      placeholder="18"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Bill Amount:</span>
                    <span>${parseFloat(billAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip ({tipPercent}%):</span>
                    <span className="text-primary font-semibold">
                      ${tipResult.tip.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${tipResult.total.toFixed(2)}</span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Per person (2): ${(tipResult.total / 2).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {[15, 18, 20, 25].map(percent => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setTipPercent(percent.toString())}
                      className="flex-1"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discount Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Discount Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Original Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>${parseFloat(itemPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="text-red-600 font-semibold">
                      -${discountResult.discount.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Price:</span>
                    <span className="text-green-600">
                      ${discountResult.finalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    You save: ${discountResult.savings.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {[10, 15, 20, 25, 30, 50].map(percent => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setDiscountPercent(percent.toString())}
                      className="flex-1 text-xs"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tax Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pre-tax Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={preTaxAmount}
                      onChange={(e) => setPreTaxAmount(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="8.5"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Pre-tax Amount:</span>
                    <span>${parseFloat(preTaxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span className="text-primary font-semibold">
                      ${taxResult.tax.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total with Tax:</span>
                    <span>${taxResult.totalWithTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>After-tax Amount (Reverse)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={afterTaxAmount}
                    onChange={(e) => setAfterTaxAmount(e.target.value)}
                    placeholder="108.50"
                  />
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    Pre-tax: ${preTaxResult.preTax.toFixed(2)} | 
                    Tax: ${preTaxResult.taxAmount.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simple Interest Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Simple Interest Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Principal Amount ($)</Label>
                    <Input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Annual Interest Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Period (years)</Label>
                      <Input
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        placeholder="2"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Principal:</span>
                    <span>${parseFloat(principal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Earned:</span>
                    <span className="text-green-600 font-semibold">
                      ${interestResult.interest.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>${interestResult.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Monthly payment: ${interestResult.monthlyPayment.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Correct Answers</Label>
                  <Input
                    type="number"
                    value={correctAnswers}
                    onChange={(e) => setCorrectAnswers(e.target.value)}
                    placeholder="18"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Questions</Label>
                  <Input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">
                        {gradeResult.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Percentage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {gradeResult.letterGrade}
                      </div>
                      <div className="text-sm text-muted-foreground">Letter Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {gradeResult.points}
                      </div>
                      <div className="text-sm text-muted-foreground">GPA Points</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    {correctAnswers} out of {totalQuestions} questions correct
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-medium">Grade Scale:</div>
                  <div>A+: 97-100% (4.0)</div>
                  <div>A: 93-96% (4.0)</div>
                  <div>A-: 90-92% (3.7)</div>
                  <div>B+: 87-89% (3.3)</div>
                  <div>B: 83-86% (3.0)</div>
                  <div>B-: 80-82% (2.7)</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">&nbsp;</div>
                  <div>C+: 77-79% (2.3)</div>
                  <div>C: 73-76% (2.0)</div>
                  <div>C-: 70-72% (1.7)</div>
                  <div>D+: 67-69% (1.3)</div>
                  <div>D: 65-66% (1.0)</div>
                  <div>F: Below 65% (0.0)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="size-4 mr-2" />
          Reset All Values
        </Button>
      </div>
    </div>
  );
}