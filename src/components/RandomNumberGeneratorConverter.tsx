import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Shuffle, Copy, RotateCcw, Dices, Coins, Hash, List } from "lucide-react";

interface RandomResult {
  value: any;
  timestamp: number;
  type: string;
}

export function RandomNumberGeneratorConverter() {
  // Basic random number
  const [minValue, setMinValue] = useState("1");
  const [maxValue, setMaxValue] = useState("100");
  const [count, setCount] = useState("1");
  
  // Decimal random
  const [decimalMin, setDecimalMin] = useState("0");
  const [decimalMax, setDecimalMax] = useState("1");
  const [decimalPlaces, setDecimalPlaces] = useState("2");
  
  // List picker
  const [itemList, setItemList] = useState("Apple\nBanana\nCherry\nDate\nElderry");
  const [pickCount, setPickCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  
  // Dice
  const [diceType, setDiceType] = useState("6");
  const [diceCount, setDiceCount] = useState("1");
  
  // Password generator
  const [passwordLength, setPasswordLength] = useState("12");
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  
  // Color generator
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  
  // History
  const [history, setHistory] = useState<RandomResult[]>([]);
  
  const addToHistory = useCallback((value: any, type: string) => {
    const result: RandomResult = {
      value,
      timestamp: Date.now(),
      type
    };
    setHistory(prev => [result, ...prev.slice(0, 19)]); // Keep last 20
  }, []);

  const generateRandomNumber = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const num = parseInt(count);
    
    if (min > max || num < 1) return;
    
    const results: number[] = [];
    for (let i = 0; i < num; i++) {
      results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    
    addToHistory(results, `Random Numbers (${min}-${max})`);
  };

  const generateDecimalNumber = () => {
    const min = parseFloat(decimalMin);
    const max = parseFloat(decimalMax);
    const places = parseInt(decimalPlaces);
    
    if (min > max || places < 0) return;
    
    const result = (Math.random() * (max - min) + min).toFixed(places);
    addToHistory(parseFloat(result), `Decimal Number (${min}-${max})`);
  };

  const pickFromList = () => {
    const items = itemList.split('\n').filter(item => item.trim() !== '');
    const num = parseInt(pickCount);
    
    if (items.length === 0 || num < 1) return;
    
    let results: string[] = [];
    let availableItems = [...items];
    
    for (let i = 0; i < Math.min(num, allowDuplicates ? num : items.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const selected = availableItems[randomIndex];
      results.push(selected);
      
      if (!allowDuplicates) {
        availableItems.splice(randomIndex, 1);
      }
    }
    
    addToHistory(results, `List Pick (${results.length} items)`);
  };

  const rollDice = () => {
    const sides = parseInt(diceType);
    const num = parseInt(diceCount);
    
    if (sides < 2 || num < 1) return;
    
    const results: number[] = [];
    let total = 0;
    
    for (let i = 0; i < num; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }
    
    addToHistory({ rolls: results, total }, `Dice Roll (${num}d${sides})`);
  };

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    addToHistory(result, "Coin Flip");
  };

  const generatePassword = () => {
    const length = parseInt(passwordLength);
    if (length < 1) return;
    
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (charset === "") return;
    
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    addToHistory(password, "Password");
  };

  const generateColor = () => {
    let color: string;
    
    switch (colorFormat) {
      case "hex":
        color = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        break;
      case "rgb":
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        color = `rgb(${r}, ${g}, ${b})`;
        break;
      case "hsl":
        const h = Math.floor(Math.random() * 361);
        const s = Math.floor(Math.random() * 101);
        const l = Math.floor(Math.random() * 101);
        color = `hsl(${h}, ${s}%, ${l}%)`;
        break;
      default:
        color = "#000000";
    }
    
    addToHistory(color, `Color (${colorFormat.toUpperCase()})`);
  };

  const generateGUID = () => {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    addToHistory(guid, "GUID/UUID");
  };

  const copyResult = async (value: any) => {
    const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString();
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const reset = () => {
    setMinValue("1");
    setMaxValue("100");
    setCount("1");
    setDecimalMin("0");
    setDecimalMax("1");
    setDecimalPlaces("2");
    setItemList("Apple\nBanana\nCherry\nDate\nElderry");
    setPickCount("1");
    setAllowDuplicates(true);
    setDiceType("6");
    setDiceCount("1");
    setPasswordLength("12");
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(false);
    setColorFormat("hex");
  };

  const latestResult = history[0];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Shuffle className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Random Number Generator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Generate random numbers, pick from lists, roll dice, and create passwords
        </p>
      </div>

      <Tabs defaultValue="numbers" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="numbers"><Hash className="size-4 mr-1" />Numbers</TabsTrigger>
          <TabsTrigger value="lists"><List className="size-4 mr-1" />Lists</TabsTrigger>
          <TabsTrigger value="games"><Dices className="size-4 mr-1" />Games</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="color">Colors</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Integer Random Numbers */}
            <Card>
              <CardHeader>
                <CardTitle>Random Integers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <Button onClick={generateRandomNumber} className="w-full">
                  <Shuffle className="size-4 mr-2" />
                  Generate Random Numbers
                </Button>

                <div className="flex gap-2">
                  {[
                    { min: "1", max: "10", label: "1-10" },
                    { min: "1", max: "100", label: "1-100" },
                    { min: "1", max: "1000", label: "1-1000" }
                  ].map(preset => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMinValue(preset.min);
                        setMaxValue(preset.max);
                      }}
                      className="flex-1"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Decimal Random Numbers */}
            <Card>
              <CardHeader>
                <CardTitle>Random Decimals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      step="any"
                      value={decimalMin}
                      onChange={(e) => setDecimalMin(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      step="any"
                      value={decimalMax}
                      onChange={(e) => setDecimalMax(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Decimals</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={decimalPlaces}
                      onChange={(e) => setDecimalPlaces(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>

                <Button onClick={generateDecimalNumber} className="w-full">
                  <Shuffle className="size-4 mr-2" />
                  Generate Decimal Number
                </Button>

                <div className="flex gap-2">
                  {[
                    { min: "0", max: "1", places: "2", label: "0-1" },
                    { min: "-1", max: "1", places: "3", label: "-1 to 1" },
                    { min: "0", max: "100", places: "1", label: "0-100" }
                  ].map(preset => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDecimalMin(preset.min);
                        setDecimalMax(preset.max);
                        setDecimalPlaces(preset.places);
                      }}
                      className="flex-1"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Result Display */}
          {latestResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Latest Result
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyResult(latestResult.value)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-2">{latestResult.type}</div>
                  <div className="text-3xl font-mono font-bold text-primary">
                    {Array.isArray(latestResult.value) 
                      ? latestResult.value.join(", ")
                      : typeof latestResult.value === 'object'
                        ? JSON.stringify(latestResult.value)
                        : latestResult.value.toString()
                    }
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Generated at {new Date(latestResult.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Random List Picker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Items (one per line)</Label>
                    <Textarea
                      value={itemList}
                      onChange={(e) => setItemList(e.target.value)}
                      placeholder="Enter items, one per line"
                      rows={8}
                    />
                    <div className="text-xs text-muted-foreground">
                      {itemList.split('\n').filter(item => item.trim() !== '').length} items
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pick Count</Label>
                      <Input
                        type="number"
                        min="1"
                        value={pickCount}
                        onChange={(e) => setPickCount(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Allow Duplicates</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={allowDuplicates}
                          onChange={(e) => setAllowDuplicates(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{allowDuplicates ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button onClick={pickFromList} className="w-full">
                    <List className="size-4 mr-2" />
                    Pick Random Items
                  </Button>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Lists:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemList("Monday\nTuesday\nWednesday\nThursday\nFriday\nSaturday\nSunday")}
                      >
                        Days of Week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemList("January\nFebruary\nMarch\nApril\nMay\nJune\nJuly\nAugust\nSeptember\nOctober\nNovember\nDecember")}
                      >
                        Months
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemList("Red\nBlue\nGreen\nYellow\nPurple\nOrange\nPink\nBlack\nWhite")}
                      >
                        Colors
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemList("Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry")}
                      >
                        Names
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Dice Roller */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dices className="size-5" />
                  Dice Roller
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dice Type</Label>
                    <Input
                      type="number"
                      min="2"
                      value={diceType}
                      onChange={(e) => setDiceType(e.target.value)}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Dice</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={diceCount}
                      onChange={(e) => setDiceCount(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <Button onClick={rollDice} className="w-full">
                  <Dices className="size-4 mr-2" />
                  Roll Dice
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  {[4, 6, 8, 10, 12, 20].map(sides => (
                    <Button
                      key={sides}
                      variant="outline"
                      size="sm"
                      onClick={() => setDiceType(sides.toString())}
                    >
                      d{sides}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coin Flipper */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="size-5" />
                  Coin Flipper
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🪙</div>
                  <Button onClick={flipCoin} className="w-full">
                    <Coins className="size-4 mr-2" />
                    Flip Coin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Password Generator */}
            <Card>
              <CardHeader>
                <CardTitle>Password Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password Length</Label>
                    <Input
                      type="number"
                      min="4"
                      max="128"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(e.target.value)}
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Character Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeUppercase}
                          onChange={(e) => setIncludeUppercase(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Uppercase (A-Z)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeLowercase}
                          onChange={(e) => setIncludeLowercase(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Lowercase (a-z)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeNumbers}
                          onChange={(e) => setIncludeNumbers(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Numbers (0-9)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeSymbols}
                          onChange={(e) => setIncludeSymbols(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Symbols (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={generatePassword} className="w-full">
                    <Shuffle className="size-4 mr-2" />
                    Generate Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GUID Generator */}
            <Card>
              <CardHeader>
                <CardTitle>GUID/UUID Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Generate universally unique identifiers (UUIDs) in standard format
                  </div>
                  <Button onClick={generateGUID} className="w-full">
                    <Hash className="size-4 mr-2" />
                    Generate GUID
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Random Color Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Color Format</Label>
                    <div className="flex gap-2">
                      {(["hex", "rgb", "hsl"] as const).map(format => (
                        <Button
                          key={format}
                          variant={colorFormat === format ? "default" : "outline"}
                          size="sm"
                          onClick={() => setColorFormat(format)}
                          className="flex-1"
                        >
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={generateColor} className="w-full">
                    <Shuffle className="size-4 mr-2" />
                    Generate Random Color
                  </Button>
                </div>

                <div className="space-y-4">
                  {latestResult && latestResult.type.includes("Color") && (
                    <div className="space-y-2">
                      <div
                        className="w-full h-24 rounded-lg border-2"
                        style={{ backgroundColor: latestResult.value }}
                      />
                      <div className="text-center font-mono text-sm bg-muted p-2 rounded">
                        {latestResult.value}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generation History
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  disabled={history.length === 0}
                >
                  <RotateCcw className="size-4 mr-2" />
                  Clear History
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No generation history yet
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((result, index) => (
                    <div
                      key={result.timestamp}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="font-medium text-sm">{result.type}</div>
                        <div className="font-mono text-xs">
                          {Array.isArray(result.value) 
                            ? result.value.join(", ")
                            : typeof result.value === 'object'
                              ? JSON.stringify(result.value)
                              : result.value.toString()
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyResult(result.value)}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="size-4 mr-2" />
          Reset All Settings
        </Button>
      </div>
    </div>
  );
}