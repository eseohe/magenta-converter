import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Target, Copy, RefreshCcw } from "lucide-react";
import { formatNumber } from "../lib/format";

export function OptionsPricingConverter() {
  const [spotPrice, setSpotPrice] = useState("100");
  const [strikePrice, setStrikePrice] = useState("105");
  const [timeToExpiry, setTimeToExpiry] = useState("0.25"); // 3 months
  const [volatility, setVolatility] = useState("20");
  const [riskFreeRate, setRiskFreeRate] = useState("5");
  const [dividendYield, setDividendYield] = useState("2");
  const [optionType, setOptionType] = useState("call");

  // Standard normal cumulative distribution function
  const normalCDF = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
  };

  // Standard normal probability density function
  const normalPDF = (x: number): number => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  };

  const calculateBlackScholes = () => {
    const S = parseFloat(spotPrice) || 100;
    const K = parseFloat(strikePrice) || 100;
    const T = parseFloat(timeToExpiry) || 0;
    const sigma = (parseFloat(volatility) || 0) / 100;
    const r = (parseFloat(riskFreeRate) || 0) / 100;
    const q = (parseFloat(dividendYield) || 0) / 100;

    if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
      return {
        optionPrice: 0,
        delta: 0,
        gamma: 0,
        theta: 0,
        vega: 0,
        rho: 0,
        intrinsicValue: 0,
        timeValue: 0,
        d1: 0,
        d2: 0,
        impliedVolatility: 0
      };
    }

    // Calculate d1 and d2
    const d1 = (Math.log(S / K) + (r - q + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Calculate option prices
    let callPrice: number;
    let putPrice: number;

    if (optionType === "call") {
      callPrice = S * Math.exp(-q * T) * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
      putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * Math.exp(-q * T) * normalCDF(-d1);
    } else {
      putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * Math.exp(-q * T) * normalCDF(-d1);
      callPrice = S * Math.exp(-q * T) * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    }

    const optionPrice = optionType === "call" ? callPrice : putPrice;

    // Calculate Greeks
    const delta = optionType === "call" 
      ? Math.exp(-q * T) * normalCDF(d1)
      : Math.exp(-q * T) * (normalCDF(d1) - 1);

    const gamma = (Math.exp(-q * T) * normalPDF(d1)) / (S * sigma * Math.sqrt(T));

    const theta = optionType === "call"
      ? (-S * Math.exp(-q * T) * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) 
         - r * K * Math.exp(-r * T) * normalCDF(d2) 
         + q * S * Math.exp(-q * T) * normalCDF(d1)) / 365
      : (-S * Math.exp(-q * T) * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) 
         + r * K * Math.exp(-r * T) * normalCDF(-d2) 
         - q * S * Math.exp(-q * T) * normalCDF(-d1)) / 365;

    const vega = (S * Math.exp(-q * T) * normalPDF(d1) * Math.sqrt(T)) / 100;

    const rho = optionType === "call"
      ? (K * T * Math.exp(-r * T) * normalCDF(d2)) / 100
      : (-K * T * Math.exp(-r * T) * normalCDF(-d2)) / 100;

    // Intrinsic and time value
    const intrinsicValue = optionType === "call" 
      ? Math.max(S - K, 0) 
      : Math.max(K - S, 0);
    const timeValue = optionPrice - intrinsicValue;

    return {
      optionPrice,
      callPrice,
      putPrice,
      delta,
      gamma,
      theta,
      vega,
      rho,
      intrinsicValue,
      timeValue,
      d1,
      d2,
      moneyness: S / K,
      daysToExpiry: T * 365
    };
  };

  const results = calculateBlackScholes();

  const reset = () => {
    setSpotPrice("100");
    setStrikePrice("105");
    setTimeToExpiry("0.25");
    setVolatility("20");
    setRiskFreeRate("5");
    setDividendYield("2");
    setOptionType("call");
  };

  const copyResult = async () => {
    const text = `Black-Scholes Options Analysis:
Option Type: ${optionType.toUpperCase()}
Spot Price: $${parseFloat(spotPrice)}
Strike Price: $${parseFloat(strikePrice)}
Time to Expiry: ${parseFloat(timeToExpiry)} years (${(results.daysToExpiry ?? 0).toFixed(0)} days)
Volatility: ${parseFloat(volatility)}%
Risk-Free Rate: ${parseFloat(riskFreeRate)}%

Option Price: $${results.optionPrice.toFixed(4)}
Intrinsic Value: $${results.intrinsicValue.toFixed(4)}
Time Value: $${results.timeValue.toFixed(4)}

Greeks:
Delta: ${results.delta.toFixed(4)}
Gamma: ${results.gamma.toFixed(4)}
Theta: $${results.theta.toFixed(4)}/day
Vega: $${results.vega.toFixed(4)}
Rho: $${results.rho.toFixed(4)}

Moneyness: ${(results.moneyness ?? 0).toFixed(3)} (${(results.moneyness ?? 0) > 1 ? 'ITM' : (results.moneyness ?? 0) < 1 ? 'OTM' : 'ATM'})`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Target className="size-4" />
          </span>
          Options Pricing (Black-Scholes)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Option Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="optionType">Option Type</Label>
                <select
                  id="optionType"
                  value={optionType}
                  onChange={(e) => setOptionType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="call">Call Option</option>
                  <option value="put">Put Option</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spotPrice">Spot Price ($)</Label>
                <Input
                  id="spotPrice"
                  type="number"
                  step="0.01"
                  value={spotPrice}
                  onChange={(e) => setSpotPrice(e.target.value)}
                  placeholder="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strikePrice">Strike Price ($)</Label>
                <Input
                  id="strikePrice"
                  type="number"
                  step="0.01"
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                  placeholder="105"
                />
              </div>

              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Moneyness:</strong> {(results.moneyness ?? 0).toFixed(3)}<br/>
                <strong>Status:</strong> {(results.moneyness ?? 0) > 1.02 ? 'In-the-Money (ITM)' : 
                                       (results.moneyness ?? 0) < 0.98 ? 'Out-of-the-Money (OTM)' : 
                                       'At-the-Money (ATM)'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Market Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeToExpiry">Time to Expiry (Years)</Label>
                <Input
                  id="timeToExpiry"
                  type="number"
                  step="0.01"
                  value={timeToExpiry}
                  onChange={(e) => setTimeToExpiry(e.target.value)}
                  placeholder="0.25"
                />
                <div className="text-xs text-muted-foreground">
                  {(results.daysToExpiry ?? 0).toFixed(0)} days
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="volatility">Implied Volatility (%)</Label>
                <Input
                  id="volatility"
                  type="number"
                  step="0.1"
                  value={volatility}
                  onChange={(e) => setVolatility(e.target.value)}
                  placeholder="20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                <Input
                  id="riskFreeRate"
                  type="number"
                  step="0.01"
                  value={riskFreeRate}
                  onChange={(e) => setRiskFreeRate(e.target.value)}
                  placeholder="5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
                <Input
                  id="dividendYield"
                  type="number"
                  step="0.01"
                  value={dividendYield}
                  onChange={(e) => setDividendYield(e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Option Values</h3>
            <div className="space-y-4">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Call Option Price</div>
                <div className="text-xl font-bold text-green-600">
                  ${results.callPrice?.toFixed(4) || '0.0000'}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Put Option Price</div>
                <div className="text-xl font-bold text-red-600">
                  ${results.putPrice?.toFixed(4) || '0.0000'}
                </div>
              </div>
              
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-sm text-muted-foreground">Put-Call Parity Check</div>
                <div className="text-sm">
                  Call - Put = ${((results.callPrice ?? 0) - (results.putPrice ?? 0)).toFixed(4)}<br/>
                  S - K*e^(-rT) = ${(parseFloat(spotPrice) - parseFloat(strikePrice) * Math.exp(-parseFloat(riskFreeRate)/100 * parseFloat(timeToExpiry))).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Option Analysis</h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{optionType.charAt(0).toUpperCase() + optionType.slice(1)} Option Price</div>
              <div className="text-4xl font-bold text-purple-600">
                ${results.optionPrice.toFixed(4)}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Intrinsic Value</div>
                  <div className="font-semibold">${results.intrinsicValue.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Time Value</div>
                  <div className="font-semibold">${results.timeValue.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Delta (Δ)</div>
              <div className={`text-lg font-semibold ${results.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.delta.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Price sensitivity
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Gamma (Γ)</div>
              <div className="text-lg font-semibold text-blue-600">
                {results.gamma.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Delta sensitivity
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Theta (Θ)</div>
              <div className={`text-lg font-semibold ${results.theta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.theta.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Time decay/day
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Vega (ν)</div>
              <div className="text-lg font-semibold text-purple-600">
                ${results.vega.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Volatility sensitivity
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Rho (ρ)</div>
              <div className={`text-lg font-semibold ${results.rho >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.rho.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Interest rate sensitivity
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Greeks Interpretation:</strong></div>
            <div><strong>Delta:</strong> A ${results.delta.toFixed(2)} delta means the option price changes by ~${Math.abs(results.delta).toFixed(2)} for every $1 move in the underlying.</div>
            <div><strong>Theta:</strong> Time decay of ${Math.abs(results.theta).toFixed(4)} per day - the option loses this much value daily (all else equal).</div>
            <div><strong>Vega:</strong> A 1% change in implied volatility changes the option price by ~${results.vega.toFixed(4)}.</div>
            <div><strong>Model:</strong> Black-Scholes assumes constant volatility, no dividends during life, European exercise, and log-normal price distribution.</div>
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
          <div className="font-semibold mb-1">How Black-Scholes Option Pricing Works</div>
          <div>
            <b>Formula:</b><br />
            <span className="font-mono">C = S·e<sup>-qT</sup>·N(d₁) - K·e<sup>-rT</sup>·N(d₂)</span> (Call)<br />
            <span className="font-mono">P = K·e<sup>-rT</sup>·N(-d₂) - S·e<sup>-qT</sup>·N(-d₁)</span> (Put)<br /><br />
            <b>Variables:</b><br />
            <b>S</b>: Spot price (${parseFloat(spotPrice)})<br />
            <b>K</b>: Strike price (${parseFloat(strikePrice)})<br />
            <b>T</b>: Time to expiry ({parseFloat(timeToExpiry)} years)<br />
            <b>σ</b>: Volatility ({parseFloat(volatility)}%)<br />
            <b>r</b>: Risk-free rate ({parseFloat(riskFreeRate)}%)<br />
            <b>q</b>: Dividend yield ({parseFloat(dividendYield)}%)<br /><br />
            <b>Step-by-step for your values:</b><br />
            1. <b>Calculate d₁:</b> <span className="font-mono">d₁ = [ln(S/K) + (r - q + σ²/2)·T] / (σ·√T)</span> = {(results.d1 ?? 0).toFixed(4)}<br />
            2. <b>Calculate d₂:</b> <span className="font-mono">d₂ = d₁ - σ·√T</span> = {(results.d2 ?? 0).toFixed(4)}<br />
            3. <b>Call price:</b> <span className="font-mono">${(results.callPrice ?? 0).toFixed(4)}</span><br />
            4. <b>Put price:</b> <span className="font-mono">${(results.putPrice ?? 0).toFixed(4)}</span><br />
            5. <b>Intrinsic value:</b> <span className="font-mono">${(results.intrinsicValue ?? 0).toFixed(4)}</span><br />
            6. <b>Time value:</b> <span className="font-mono">${(results.timeValue ?? 0).toFixed(4)}</span><br />
            7. <b>Delta:</b> <span className="font-mono">{(results.delta ?? 0).toFixed(4)}</span><br />
            8. <b>Gamma:</b> <span className="font-mono">{(results.gamma ?? 0).toFixed(4)}</span><br />
            9. <b>Theta:</b> <span className="font-mono">${(results.theta ?? 0).toFixed(4)}/day</span><br />
            10. <b>Vega:</b> <span className="font-mono">${(results.vega ?? 0).toFixed(4)}</span><br />
            11. <b>Rho:</b> <span className="font-mono">${(results.rho ?? 0).toFixed(4)}</span><br /><br />
            <b>Summary:</b><br />
            Using your inputs, the Black-Scholes model calculates the option price and Greeks, showing how each parameter affects the value and risk profile of the option.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}