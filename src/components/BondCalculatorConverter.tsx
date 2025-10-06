import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { FileText, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function BondCalculatorConverter() {
  const [faceValue, setFaceValue] = useState("1000");
  const [couponRate, setCouponRate] = useState("5");
  const [currentPrice, setCurrentPrice] = useState("950");
  const [yearsToMaturity, setYearsToMaturity] = useState("10");
  const [requiredReturn, setRequiredReturn] = useState("6");
  const [couponFrequency, setCouponFrequency] = useState("2"); // Semi-annual

  const calculateBond = () => {
    const face = parseFloat(faceValue) || 1000;
    const coupon = (parseFloat(couponRate) || 0) / 100;
    const price = parseFloat(currentPrice) || face;
    const years = parseFloat(yearsToMaturity) || 0;
    const requiredYield = (parseFloat(requiredReturn) || 0) / 100;
    const frequency = parseFloat(couponFrequency) || 2;
    
    if (years <= 0) {
      return {
        currentYield: 0,
        yieldToMaturity: 0,
        presentValue: face,
        duration: 0,
        convexity: 0,
        accruedInterest: 0,
        totalReturn: 0,
        annualCoupon: 0,
        periodicCoupon: 0
      };
    }

    const annualCoupon = face * coupon;
    const periodicCoupon = annualCoupon / frequency;
    const totalPeriods = years * frequency;
    const periodicRequiredYield = requiredYield / frequency;

    // Current Yield
    const currentYield = (annualCoupon / price) * 100;

    // Present Value (theoretical price)
    let presentValue = 0;
    for (let t = 1; t <= totalPeriods; t++) {
      presentValue += periodicCoupon / Math.pow(1 + periodicRequiredYield, t);
    }
    presentValue += face / Math.pow(1 + periodicRequiredYield, totalPeriods);

    // Yield to Maturity (Newton-Raphson approximation)
    let ytm = coupon; // Starting guess
    for (let i = 0; i < 20; i++) {
      const periodicYtm = ytm / frequency;
      let pv = 0;
      let duration_calc = 0;
      
      for (let t = 1; t <= totalPeriods; t++) {
        const discountFactor = Math.pow(1 + periodicYtm, t);
        pv += periodicCoupon / discountFactor;
        duration_calc += (periodicCoupon * t) / discountFactor;
      }
      
      const faceDiscounted = face / Math.pow(1 + periodicYtm, totalPeriods);
      pv += faceDiscounted;
      duration_calc += (face * totalPeriods) / Math.pow(1 + periodicYtm, totalPeriods);
      
      const f = pv - price;
      const fp = -duration_calc / (1 + periodicYtm); // Derivative
      
      if (Math.abs(f) < 0.01) break;
      
      ytm = ytm - f / fp;
      if (ytm < 0) ytm = 0.001;
    }

    // Modified Duration
    const periodicYtm = ytm / frequency;
    let duration = 0;
    let pvWeightedTime = 0;
    
    for (let t = 1; t <= totalPeriods; t++) {
      const cashFlow = periodicCoupon;
      const pv = cashFlow / Math.pow(1 + periodicYtm, t);
      pvWeightedTime += (pv * t) / frequency;
    }
    
    const facePV = face / Math.pow(1 + periodicYtm, totalPeriods);
    pvWeightedTime += (facePV * years);
    
    duration = pvWeightedTime / price;
    const modifiedDuration = duration / (1 + periodicYtm);

    // Convexity (simplified)
    let convexity = 0;
    for (let t = 1; t <= totalPeriods; t++) {
      const cashFlow = periodicCoupon;
      const pv = cashFlow / Math.pow(1 + periodicYtm, t);
      convexity += (pv * t * (t + 1)) / (price * Math.pow(1 + periodicYtm, 2));
    }
    convexity += (facePV * totalPeriods * (totalPeriods + 1)) / (price * Math.pow(1 + periodicYtm, 2));
    convexity = convexity / (frequency * frequency);

    // Total Return if held to maturity
    const totalInterest = annualCoupon * years;
    const capitalGain = face - price;
    const totalReturn = ((totalInterest + capitalGain) / price) * 100;

    return {
      currentYield,
      yieldToMaturity: ytm * 100,
      presentValue,
      duration: modifiedDuration,
      convexity,
      accruedInterest: 0, // Simplified - would need settlement date
      totalReturn,
      annualCoupon,
      periodicCoupon,
      capitalGain: capitalGain || 0,
      totalInterest: totalInterest || 0,
      priceChange: presentValue - price
    };
  };

  const results = calculateBond();

  const reset = () => {
    setFaceValue("1000");
    setCouponRate("5");
    setCurrentPrice("950");
    setYearsToMaturity("10");
    setRequiredReturn("6");
    setCouponFrequency("2");
  };

  const copyResult = async () => {
    const text = `Bond Analysis:
Face Value: $${formatNumber(parseFloat(faceValue))}
Coupon Rate: ${couponRate}%
Current Price: $${formatNumber(parseFloat(currentPrice))}
Years to Maturity: ${yearsToMaturity}

Results:
Current Yield: ${results.currentYield.toFixed(2)}%
Yield to Maturity (YTM): ${results.yieldToMaturity.toFixed(2)}%
Present Value: $${formatNumber(results.presentValue)}
Modified Duration: ${results.duration.toFixed(2)} years
Convexity: ${results.convexity.toFixed(2)}
Total Return: ${results.totalReturn.toFixed(2)}%

Annual Coupon: $${formatNumber(results.annualCoupon)}
Capital Gain/Loss: $${formatNumber(results.capitalGain)}

Key Terms:
- YTM: Annual return if held to maturity
- Duration: Price sensitivity to interest rate changes
- Convexity: Measures curvature of price-yield relationship`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="size-4" />
          </span>
          Bond Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Bond Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faceValue">Face Value (Par) ($)</Label>
                <Input
                  id="faceValue"
                  type="number"
                  value={faceValue}
                  onChange={(e) => setFaceValue(e.target.value)}
                  placeholder="1000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="couponRate">Annual Coupon Rate (%)</Label>
                <Input
                  id="couponRate"
                  type="number"
                  step="0.1"
                  value={couponRate}
                  onChange={(e) => setCouponRate(e.target.value)}
                  placeholder="5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Market Price ($)</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  placeholder="950"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsToMaturity">Years to Maturity</Label>
                <Input
                  id="yearsToMaturity"
                  type="number"
                  step="0.5"
                  value={yearsToMaturity}
                  onChange={(e) => setYearsToMaturity(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Market Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requiredReturn">Required Rate of Return (%)</Label>
                <Input
                  id="requiredReturn"
                  type="number"
                  step="0.1"
                  value={requiredReturn}
                  onChange={(e) => setRequiredReturn(e.target.value)}
                  placeholder="6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="couponFrequency">Coupon Frequency</Label>
                <select
                  id="couponFrequency"
                  value={couponFrequency}
                  onChange={(e) => setCouponFrequency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">Annual</option>
                  <option value="2">Semi-Annual</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Coupon Details:</strong><br/>
                Annual Coupon: ${formatNumber(results.annualCoupon)}<br/>
                Periodic Coupon: ${formatNumber(results.periodicCoupon)}<br/>
                {parseFloat(currentPrice) < parseFloat(faceValue) ? "Trading at Discount" : 
                 parseFloat(currentPrice) > parseFloat(faceValue) ? "Trading at Premium" : "Trading at Par"}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bond Analysis</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-2 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Yield to Maturity (YTM)</div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.yieldToMaturity.toFixed(3)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Yield</div>
                <div className="text-2xl font-bold text-green-600">
                  {results.currentYield.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Present Value</div>
              <div className="text-xl font-semibold text-green-600">
                ${formatNumber(results.presentValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                Theoretical Price
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Modified Duration</div>
              <div className="text-xl font-semibold text-blue-600">
                {results.duration.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Years
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Convexity</div>
              <div className="text-xl font-semibold text-purple-600">
                {results.convexity.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className={`text-xl font-semibold ${results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.totalReturn.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">
                If held to maturity
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Cash Flow Breakdown</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Total Interest Income</div>
                <div className="text-lg font-semibold text-green-600">
                  ${formatNumber(results.totalInterest)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {yearsToMaturity} years of coupons
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Capital Gain/Loss</div>
                <div className={`text-lg font-semibold ${results.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${formatNumber(results.capitalGain)}
                </div>
                <div className="text-xs text-muted-foreground">
                  At maturity
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Price vs Fair Value</div>
                <div className={`text-lg font-semibold ${results.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${formatNumber(results.priceChange)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.priceChange >= 0 ? 'Undervalued' : 'Overvalued'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Risk Metrics:</strong> Duration measures price sensitivity to interest rate changes 
            (~{results.duration.toFixed(1)}% price change per 1% yield change). Convexity measures the curvature 
            of the price-yield relationship. A YTM of {results.yieldToMaturity.toFixed(2)}% assumes you hold until maturity 
            and reinvest coupons at the same rate.
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