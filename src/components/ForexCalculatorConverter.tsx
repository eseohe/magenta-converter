import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Combobox } from "./ui/combobox";
import { Separator } from "./ui/separator";
import { DollarSign, Copy, RefreshCcw, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "../lib/format";

interface CurrencyPair {
  symbol: string;
  name: string;
  pipValue: number;
  baseDecimals: number;
}

const CURRENCY_PAIRS: CurrencyPair[] = [
  { symbol: "EURUSD", name: "Euro / US Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", pipValue: 10, baseDecimals: 2 },
  { symbol: "USDCHF", name: "US Dollar / Swiss Franc", pipValue: 10, baseDecimals: 4 },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "EURJPY", name: "Euro / Japanese Yen", pipValue: 10, baseDecimals: 2 },
  { symbol: "GBPJPY", name: "British Pound / Japanese Yen", pipValue: 10, baseDecimals: 2 },
  { symbol: "EURGBP", name: "Euro / British Pound", pipValue: 10, baseDecimals: 4 },
  { symbol: "AUDCAD", name: "Australian Dollar / Canadian Dollar", pipValue: 10, baseDecimals: 4 },
  { symbol: "CADJPY", name: "Canadian Dollar / Japanese Yen", pipValue: 10, baseDecimals: 2 }
];

export function ForexCalculatorConverter() {
  const [currencyPair, setCurrencyPair] = useState("EURUSD");
  const [entryPrice, setEntryPrice] = useState("1.0850");
  const [exitPrice, setExitPrice] = useState("1.0950");
  const [positionSize, setPositionSize] = useState("100000"); // Standard lot
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [accountBalance, setAccountBalance] = useState("10000");
  const [leverage, setLeverage] = useState("100");
  const [riskPercent, setRiskPercent] = useState("2");
  const [stopLoss, setStopLoss] = useState("1.0800");
  const [takeProfit, setTakeProfit] = useState("1.1000");
  const [tradingDirection, setTradingDirection] = useState("long");

  const getSelectedPair = () => {
    return CURRENCY_PAIRS.find(pair => pair.symbol === currencyPair) || CURRENCY_PAIRS[0];
  };

  const calculateForexMetrics = () => {
    const pair = getSelectedPair();
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const size = parseFloat(positionSize) || 0;
    const balance = parseFloat(accountBalance) || 0;
    const lev = parseFloat(leverage) || 1;
    const riskPct = parseFloat(riskPercent) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const tp = parseFloat(takeProfit) || 0;
    const isLong = tradingDirection === "long";

    // Calculate pip movement
    const pipMultiplier = pair.baseDecimals === 2 ? 0.01 : 0.0001;
    let pipMovement = 0;
    let profitLoss = 0;
    
    if (isLong) {
      pipMovement = (exit - entry) / pipMultiplier;
      profitLoss = pipMovement * pair.pipValue * (size / 100000);
    } else {
      pipMovement = (entry - exit) / pipMultiplier;
      profitLoss = pipMovement * pair.pipValue * (size / 100000);
    }

    // Calculate margin required
    const marginRequired = size / lev;
    
    // Calculate position value in account currency
    const positionValue = size * entry;
    
    // Risk management calculations
    const riskAmount = balance * (riskPct / 100);
    
    // Stop loss calculations
    let stopLossPips = 0;
    let stopLossAmount = 0;
    if (sl > 0) {
      if (isLong) {
        stopLossPips = (entry - sl) / pipMultiplier;
        stopLossAmount = stopLossPips * pair.pipValue * (size / 100000);
      } else {
        stopLossPips = (sl - entry) / pipMultiplier;
        stopLossAmount = stopLossPips * pair.pipValue * (size / 100000);
      }
    }
    
    // Take profit calculations
    let takeProfitPips = 0;
    let takeProfitAmount = 0;
    if (tp > 0) {
      if (isLong) {
        takeProfitPips = (tp - entry) / pipMultiplier;
        takeProfitAmount = takeProfitPips * pair.pipValue * (size / 100000);
      } else {
        takeProfitPips = (entry - tp) / pipMultiplier;
        takeProfitAmount = takeProfitPips * pair.pipValue * (size / 100000);
      }
    }

    // Risk-reward ratio
    const riskRewardRatio = takeProfitAmount > 0 && stopLossAmount > 0 ? 
      takeProfitAmount / stopLossAmount : 0;

    // Position sizing based on risk
    const optimalPositionSize = riskAmount > 0 && stopLossPips > 0 ? 
      (riskAmount / (stopLossPips * pair.pipValue)) * 100000 : 0;

    // Percentage returns
    const returnPercent = balance > 0 ? (profitLoss / balance) * 100 : 0;
    const maxRiskPercent = balance > 0 ? (stopLossAmount / balance) * 100 : 0;
    const maxRewardPercent = balance > 0 ? (takeProfitAmount / balance) * 100 : 0;

    // Margin level
    const marginLevel = marginRequired > 0 ? ((balance + profitLoss) / marginRequired) * 100 : 0;

    // Swap calculations (simplified - overnight financing)
    const dailySwap = size * 0.00002; // Simplified 2 basis points per day
    
    return {
      pipMovement: Math.abs(pipMovement),
      profitLoss,
      profitLossPercent: returnPercent,
      marginRequired,
      positionValue,
      stopLossPips: Math.abs(stopLossPips),
      stopLossAmount,
      takeProfitPips: Math.abs(takeProfitPips),
      takeProfitAmount,
      riskRewardRatio,
      optimalPositionSize,
      maxRiskPercent,
      maxRewardPercent,
      marginLevel,
      dailySwap,
      pipValue: pair.pipValue * (size / 100000),
      isProfit: profitLoss > 0,
      leverage: lev,
      marginUtilization: balance > 0 ? (marginRequired / balance) * 100 : 0
    };
  };

  const results = calculateForexMetrics();
  const selectedPair = getSelectedPair();

  const reset = () => {
    setCurrencyPair("EURUSD");
    setEntryPrice("1.0850");
    setExitPrice("1.0950");
    setPositionSize("100000");
    setAccountCurrency("USD");
    setAccountBalance("10000");
    setLeverage("100");
    setRiskPercent("2");
    setStopLoss("1.0800");
    setTakeProfit("1.1000");
    setTradingDirection("long");
  };

  const copyResult = async () => {
    const text = `Forex Trading Analysis:
Currency Pair: ${currencyPair}
Position: ${tradingDirection.toUpperCase()} ${formatNumber(parseFloat(positionSize))} units
Entry Price: ${entryPrice}
Exit Price: ${exitPrice}

Trade Results:
Pip Movement: ${results.pipMovement.toFixed(1)} pips
Profit/Loss: ${results.profitLoss >= 0 ? '+' : ''}$${formatNumber(results.profitLoss)}
Return: ${results.profitLossPercent >= 0 ? '+' : ''}${results.profitLossPercent.toFixed(2)}%

Position Details:
Position Value: $${formatNumber(results.positionValue)}
Margin Required: $${formatNumber(results.marginRequired)}
Margin Utilization: ${results.marginUtilization.toFixed(1)}%
Pip Value: $${results.pipValue.toFixed(2)} per pip

Risk Management:
Stop Loss: ${results.stopLossPips.toFixed(1)} pips → -$${formatNumber(results.stopLossAmount)}
Take Profit: ${results.takeProfitPips.toFixed(1)} pips → +$${formatNumber(results.takeProfitAmount)}
Risk/Reward Ratio: ${results.riskRewardRatio > 0 ? `1:${results.riskRewardRatio.toFixed(2)}` : 'N/A'}
Max Risk: ${results.maxRiskPercent.toFixed(2)}% of account
Max Reward: ${results.maxRewardPercent.toFixed(2)}% of account

Position Sizing:
Optimal Size for ${riskPercent}% risk: ${formatNumber(results.optimalPositionSize)} units
Current Leverage: ${results.leverage}:1
Margin Level: ${results.marginLevel.toFixed(0)}%`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <DollarSign className="size-4" />
          </span>
          Forex Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Currency Pair & Position</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currencyPair">Currency Pair</Label>
                <Combobox
                  options={CURRENCY_PAIRS.map(pair => ({
                    value: pair.symbol,
                    label: `${pair.symbol} - ${pair.name}`
                  }))}
                  value={currencyPair}
                  onValueChange={setCurrencyPair}
                  placeholder="Search currency pair..."
                  searchPlaceholder="Search currency pairs..."
                  emptyMessage="No currency pair found."
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Pip value: ${selectedPair.pipValue} per standard lot (100K units)
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tradingDirection">Position Direction</Label>
                <Combobox
                  options={[
                    { value: "long", label: "Long (Buy)" },
                    { value: "short", label: "Short (Sell)" }
                  ]}
                  value={tradingDirection}
                  onValueChange={setTradingDirection}
                  placeholder="Select position direction..."
                  searchPlaceholder="Search direction..."
                  emptyMessage="No direction found."
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="positionSize">Position Size (Units)</Label>
                <Input
                  id="positionSize"
                  type="number"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                  placeholder="100000"
                />
                <div className="text-xs text-muted-foreground">
                  Standard lot: 100,000 | Mini lot: 10,000 | Micro lot: 1,000
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step={selectedPair.baseDecimals === 2 ? "0.01" : "0.0001"}
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="1.0850"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step={selectedPair.baseDecimals === 2 ? "0.01" : "0.0001"}
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    placeholder="1.0950"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Account & Risk Management</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountBalance">Account Balance ($)</Label>
                  <Input
                    id="accountBalance"
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage</Label>
                  <Combobox
                    options={[
                      { value: "1", label: "1:1" },
                      { value: "10", label: "10:1" },
                      { value: "25", label: "25:1" },
                      { value: "50", label: "50:1" },
                      { value: "100", label: "100:1" },
                      { value: "200", label: "200:1" },
                      { value: "400", label: "400:1" },
                      { value: "500", label: "500:1" }
                    ]}
                    value={leverage}
                    onValueChange={setLeverage}
                    placeholder="Select leverage..."
                    searchPlaceholder="Search leverage..."
                    emptyMessage="No leverage found."
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskPercent">Risk Per Trade (%)</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  placeholder="2"
                />
                <div className="text-xs text-muted-foreground">
                  Recommended: 1-2% of account balance
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss Price</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step={selectedPair.baseDecimals === 2 ? "0.01" : "0.0001"}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="1.0800"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit Price</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step={selectedPair.baseDecimals === 2 ? "0.01" : "0.0001"}
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="1.1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trade Analysis</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Profit/Loss</div>
                <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                  results.isProfit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.isProfit ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                  {results.profitLoss >= 0 ? '+' : ''}${formatNumber(results.profitLoss)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.profitLossPercent >= 0 ? '+' : ''}{results.profitLossPercent.toFixed(2)}% of account
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pip Movement</div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.pipMovement.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  pips ({tradingDirection})
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pip Value</div>
                <div className="text-2xl font-bold text-purple-600">
                  ${results.pipValue.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per pip movement
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Position Value</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.positionValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatNumber(parseFloat(positionSize))} units
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Margin Required</div>
              <div className="text-lg font-semibold">
                ${formatNumber(results.marginRequired)}
              </div>
              <div className="text-xs text-muted-foreground">
                {results.marginUtilization.toFixed(1)}% of account
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Leverage</div>
              <div className="text-lg font-semibold">
                {results.leverage}:1
              </div>
              <div className="text-xs text-muted-foreground">
                Trading leverage
              </div>
            </div>
            
            <div className="space-y-1 p-3 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground">Margin Level</div>
              <div className={`text-lg font-semibold ${
                results.marginLevel > 200 ? 'text-green-600' : 
                results.marginLevel > 100 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {results.marginLevel.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Equity/Margin ratio
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Risk Management Analysis</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Stop Loss</div>
                    <div className="text-xs text-muted-foreground">
                      {results.stopLossPips.toFixed(1)} pips at {stopLoss}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-600">
                      -${formatNumber(results.stopLossAmount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {results.maxRiskPercent.toFixed(2)}% risk
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Take Profit</div>
                    <div className="text-xs text-muted-foreground">
                      {results.takeProfitPips.toFixed(1)} pips at {takeProfit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      +${formatNumber(results.takeProfitAmount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {results.maxRewardPercent.toFixed(2)}% reward
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Risk/Reward Ratio</div>
                    <div className="text-xs text-muted-foreground">
                      Target minimum 1:2
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      results.riskRewardRatio >= 2 ? 'text-green-600' : 
                      results.riskRewardRatio >= 1 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {results.riskRewardRatio > 0 ? `1:${results.riskRewardRatio.toFixed(2)}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-background border rounded-lg">
                  <div className="text-sm font-medium mb-2">Optimal Position Sizing</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Position:</span>
                      <span>{formatNumber(parseFloat(positionSize))} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimal for {riskPercent}% risk:</span>
                      <span className="font-medium">{formatNumber(results.optimalPositionSize)} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Amount:</span>
                      <span>${formatNumber(parseFloat(accountBalance) * parseFloat(riskPercent) / 100)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-background border rounded-lg">
                  <div className="text-sm font-medium mb-2">Additional Costs</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Swap (est.):</span>
                      <span>${results.dailySwap.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Overnight financing cost per day
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-2">
            <div><strong>Trading Insights:</strong></div>
            <div><strong>Position Size:</strong> {parseFloat(positionSize) > results.optimalPositionSize * 1.5 ? 
              `Your position size is larger than recommended for ${riskPercent}% risk. Consider reducing to ${formatNumber(results.optimalPositionSize)} units.` :
              `Your position size is appropriate for your risk management strategy.`}
            </div>
            <div><strong>Risk/Reward:</strong> {results.riskRewardRatio >= 2 ? 
              'Excellent risk/reward ratio. This trade has favorable risk management.' :
              results.riskRewardRatio >= 1 ? 'Acceptable risk/reward ratio, but consider targeting higher rewards.' :
              'Poor risk/reward ratio. Consider adjusting stop loss or take profit levels.'}
            </div>
            <div><strong>Margin Safety:</strong> {results.marginLevel > 200 ? 
              'Safe margin levels with good buffer for adverse price movements.' :
              results.marginLevel > 100 ? 'Moderate margin usage. Monitor positions carefully.' :
              'High margin usage. Risk of margin calls if position moves against you.'}
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