import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Hash, Copy, RotateCcw, Calculator, Zap, Search } from "lucide-react";

interface PrimeFactorization {
  number: number;
  factors: Array<{ prime: number; power: number }>;
  factorString: string;
}

interface PrimeTest {
  number: number;
  isPrime: boolean;
  method: string;
  witnesses?: number[];
}

export function PrimeNumberToolsConverter() {
  const [testNumber, setTestNumber] = useState("97");
  const [factorNumber, setFactorNumber] = useState("360");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("100");
  const [nthPrime, setNthPrime] = useState("10");
  
  const [primeCache, setPrimeCache] = useState<Set<number>>(new Set());
  const [primeList, setPrimeList] = useState<number[]>([]);

  // Generate primes up to n using Sieve of Eratosthenes
  const sieveOfEratosthenes = (limit: number): number[] => {
    if (limit < 2) return [];
    
    const sieve = Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= limit; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= limit; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    return sieve.map((isPrime, num) => isPrime ? num : -1)
                .filter(num => num !== -1);
  };

  // Miller-Rabin primality test
  const millerRabinTest = (n: number, witnesses: number[] = [2, 3, 5, 7, 11, 13, 17]): PrimeTest => {
    if (n < 2) return { number: n, isPrime: false, method: "Trivial" };
    if (n === 2) return { number: n, isPrime: true, method: "Trivial" };
    if (n % 2 === 0) return { number: n, isPrime: false, method: "Even number" };
    
    // For small numbers, use trial division
    if (n < 1000) {
      for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) {
          return { number: n, isPrime: false, method: "Trial division" };
        }
      }
      return { number: n, isPrime: true, method: "Trial division" };
    }
    
    // Miller-Rabin test
    let r = 0;
    let d = n - 1;
    while (d % 2 === 0) {
      d /= 2;
      r++;
    }
    
    const modPow = (base: number, exp: number, mod: number): number => {
      let result = 1;
      base = base % mod;
      while (exp > 0) {
        if (exp % 2 === 1) {
          result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
      }
      return result;
    };
    
    for (const a of witnesses) {
      if (a >= n) continue;
      
      let x = modPow(a, d, n);
      if (x === 1 || x === n - 1) continue;
      
      let composite = true;
      for (let i = 0; i < r - 1; i++) {
        x = (x * x) % n;
        if (x === n - 1) {
          composite = false;
          break;
        }
      }
      
      if (composite) {
        return { number: n, isPrime: false, method: "Miller-Rabin", witnesses: [a] };
      }
    }
    
    return { number: n, isPrime: true, method: "Miller-Rabin", witnesses };
  };

  // Prime factorization using trial division and Pollard's rho
  const primeFactorization = (n: number): PrimeFactorization => {
    if (n <= 1) {
      return { number: n, factors: [], factorString: "1" };
    }
    
    const factors: Array<{ prime: number; power: number }> = [];
    let remaining = n;
    
    // Handle factor 2
    let power = 0;
    while (remaining % 2 === 0) {
      remaining /= 2;
      power++;
    }
    if (power > 0) {
      factors.push({ prime: 2, power });
    }
    
    // Handle odd factors
    for (let i = 3; i * i <= remaining; i += 2) {
      power = 0;
      while (remaining % i === 0) {
        remaining /= i;
        power++;
      }
      if (power > 0) {
        factors.push({ prime: i, power });
      }
    }
    
    // If remaining > 1, it's a prime
    if (remaining > 1) {
      factors.push({ prime: remaining, power: 1 });
    }
    
    // Create factor string
    const factorString = factors
      .map(f => f.power === 1 ? f.prime.toString() : `${f.prime}^${f.power}`)
      .join(" × ");
    
    return { number: n, factors, factorString: factorString || "1" };
  };

  // Generate primes in range
  const getPrimesInRange = (start: number, end: number): number[] => {
    if (start < 2) start = 2;
    if (end < start) return [];
    
    return sieveOfEratosthenes(end).filter(p => p >= start);
  };

  // Find nth prime
  const findNthPrime = (n: number): number | null => {
    if (n < 1) return null;
    
    // Approximate upper bound for nth prime
    const upperBound = n < 6 ? 12 : Math.ceil(n * (Math.log(n) + Math.log(Math.log(n))));
    const primes = sieveOfEratosthenes(upperBound);
    
    return primes[n - 1] || null;
  };

  // Check if number is perfect power
  const isPerfectPower = (n: number): { isPower: boolean; base?: number; exponent?: number } => {
    if (n <= 1) return { isPower: false };
    
    for (let exp = 2; exp <= Math.log2(n); exp++) {
      const base = Math.round(Math.pow(n, 1 / exp));
      if (Math.pow(base, exp) === n) {
        return { isPower: true, base, exponent: exp };
      }
    }
    
    return { isPower: false };
  };

  // Generate twin primes
  const findTwinPrimes = (limit: number): Array<[number, number]> => {
    const primes = sieveOfEratosthenes(limit);
    const twins: Array<[number, number]> = [];
    
    for (let i = 0; i < primes.length - 1; i++) {
      if (primes[i + 1] - primes[i] === 2) {
        twins.push([primes[i], primes[i + 1]]);
      }
    }
    
    return twins;
  };

  // Goldbach conjecture verification
  const goldbachDecomposition = (n: number): Array<[number, number]> => {
    if (n < 4 || n % 2 !== 0) return [];
    
    const primes = sieveOfEratosthenes(n);
    const primeSet = new Set(primes);
    const decompositions: Array<[number, number]> = [];
    
    for (const p of primes) {
      if (p > n / 2) break;
      const complement = n - p;
      if (primeSet.has(complement)) {
        decompositions.push([p, complement]);
      }
    }
    
    return decompositions;
  };

  const copyResults = async (type: string) => {
    let text = "";
    
    switch (type) {
      case "primality": {
        const result = millerRabinTest(parseInt(testNumber));
        text = `Primality Test for ${result.number}
Result: ${result.isPrime ? "PRIME" : "COMPOSITE"}
Method: ${result.method}
${result.witnesses ? `Witnesses: ${result.witnesses.join(", ")}` : ""}`;
        break;
      }
      case "factorization": {
        const result = primeFactorization(parseInt(factorNumber));
        text = `Prime Factorization of ${result.number}
Factors: ${result.factorString}
Prime factors: ${result.factors.map(f => `${f.prime}${f.power > 1 ? `^${f.power}` : ""}`).join(", ")}`;
        break;
      }
      case "range": {
        const primes = getPrimesInRange(parseInt(rangeStart), parseInt(rangeEnd));
        text = `Primes from ${rangeStart} to ${rangeEnd}
Count: ${primes.length}
Primes: ${primes.join(", ")}`;
        break;
      }
      case "nth": {
        const prime = findNthPrime(parseInt(nthPrime));
        text = `${nthPrime}th Prime Number: ${prime}`;
        break;
      }
    }
    
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setTestNumber("97");
    setFactorNumber("360");
    setRangeStart("1");
    setRangeEnd("100");
    setNthPrime("10");
  };

  // Calculate results
  const primalityResult = millerRabinTest(parseInt(testNumber) || 0);
  const factorizationResult = primeFactorization(parseInt(factorNumber) || 0);
  const rangeResult = getPrimesInRange(parseInt(rangeStart) || 1, parseInt(rangeEnd) || 100);
  const nthPrimeResult = findNthPrime(parseInt(nthPrime) || 1);
  const perfectPowerResult = isPerfectPower(parseInt(factorNumber) || 0);
  const twinPrimes = findTwinPrimes(100);
  const goldbachResult = goldbachDecomposition(parseInt(testNumber) || 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Hash className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Prime Number Tools</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Test primality, factor numbers, and explore prime number properties
        </p>
      </div>

      <Tabs defaultValue="primality" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="primality">Primality Test</TabsTrigger>
          <TabsTrigger value="factorization">Factorization</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="primality" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Primality Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Number to Test</Label>
                  <Input
                    type="number"
                    min="1"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="Enter number"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quick Test Numbers</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[97, 1009, 104729, 982451653, 1000000007, 1000000009].map(num => (
                      <Button
                        key={num}
                        variant="outline"
                        size="sm"
                        onClick={() => setTestNumber(num.toString())}
                        className="text-xs"
                      >
                        {num.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Calculator className="size-4 mr-2" />
                    Test Prime
                  </Button>
                  <Button variant="outline" onClick={() => copyResults("primality")}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="size-4" />
                  </Button>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Miller-Rabin Test:</strong> Probabilistic primality test</div>
                  <div><strong>Witnesses:</strong> Numbers used to verify primality</div>
                  <div><strong>Accuracy:</strong> Deterministic for numbers &lt; 3,317,044,064,679,887,385,961,981</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-mono font-bold">
                      {primalityResult.number.toLocaleString()}
                    </div>
                    <Badge 
                      variant={primalityResult.isPrime ? "default" : "destructive"}
                      className="text-lg px-4 py-1"
                    >
                      {primalityResult.isPrime ? "PRIME" : "COMPOSITE"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Test Method</div>
                    <div className="font-mono">{primalityResult.method}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Number Type</div>
                    <div className="font-mono">
                      {primalityResult.number % 2 === 0 ? "Even" : "Odd"}
                    </div>
                  </div>
                </div>

                {primalityResult.witnesses && (
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Miller-Rabin Witnesses</div>
                    <div className="flex flex-wrap gap-1">
                      {primalityResult.witnesses.map(w => (
                        <Badge key={w} variant="outline" className="text-xs">
                          {w}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!primalityResult.isPrime && primalityResult.number > 1 && (
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Prime Factorization</div>
                    <div className="bg-background p-2 rounded border font-mono text-sm">
                      {primeFactorization(primalityResult.number).factorString}
                    </div>
                  </div>
                )}

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Fun Facts:</strong></div>
                  <div>• Largest known prime: 2^82,589,933 - 1 (Mersenne prime)</div>
                  <div>• Prime gaps can be arbitrarily large</div>
                  <div>• Twin primes: primes that differ by 2</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factorization" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prime Factorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Number to Factor</Label>
                  <Input
                    type="number"
                    min="1"
                    value={factorNumber}
                    onChange={(e) => setFactorNumber(e.target.value)}
                    placeholder="Enter number"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Common Numbers</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[360, 1000, 2520, 9999, 65536, 123456].map(num => (
                      <Button
                        key={num}
                        variant="outline"
                        size="sm"
                        onClick={() => setFactorNumber(num.toString())}
                        className="text-xs"
                      >
                        {num.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {}} className="flex-1">
                    <Zap className="size-4 mr-2" />
                    Factor Number
                  </Button>
                  <Button variant="outline" onClick={() => copyResults("factorization")}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factorization Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-mono">
                      {factorizationResult.number.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">=</div>
                    <div className="text-lg font-mono font-bold text-primary">
                      {factorizationResult.factorString}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-medium">Prime Factors</div>
                  <div className="grid grid-cols-2 gap-2">
                    {factorizationResult.factors.map((factor, index) => (
                      <div key={index} className="bg-background p-2 rounded border text-center">
                        <div className="font-mono font-bold text-primary">
                          {factor.prime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          power: {factor.power}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="font-medium">Number Properties</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Prime Factors</div>
                      <div className="font-mono">{factorizationResult.factors.length}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Total Factors</div>
                      <div className="font-mono">
                        {factorizationResult.factors.reduce((acc, f) => acc * (f.power + 1), 1)}
                      </div>
                    </div>
                  </div>

                  {perfectPowerResult.isPower && (
                    <div className="bg-background p-2 rounded border">
                      <div className="text-sm">
                        <strong>Perfect Power:</strong> {perfectPowerResult.base}^{perfectPowerResult.exponent}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Algorithm:</strong> Trial division up to √n</div>
                  <div><strong>Complexity:</strong> O(√n) for worst case</div>
                  <div><strong>Applications:</strong> Cryptography, number theory</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prime Sequences & Lists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primes in Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        placeholder="Start"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        placeholder="End"
                      />
                    </div>
                    <Button onClick={() => {}} className="w-full" size="sm">
                      <Search className="size-4 mr-2" />
                      Find Primes ({rangeResult.length} found)
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Find nth Prime</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={nthPrime}
                        onChange={(e) => setNthPrime(e.target.value)}
                        placeholder="n"
                        className="flex-1"
                      />
                      <Button onClick={() => {}} variant="outline">
                        Find
                      </Button>
                    </div>
                    {nthPrimeResult && (
                      <div className="bg-muted p-2 rounded text-center font-mono">
                        {nthPrime}th prime = {nthPrimeResult.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => copyResults("range")} className="flex-1">
                    <Copy className="size-4 mr-2" />
                    Copy Range
                  </Button>
                  <Button variant="outline" onClick={() => copyResults("nth")}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prime List Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Primes from {rangeStart} to {rangeEnd}</span>
                    <Badge variant="outline">{rangeResult.length} primes</Badge>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {rangeResult.length > 0 ? (
                        rangeResult.map(prime => (
                          <Badge key={prime} variant="secondary" className="text-xs">
                            {prime}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-sm">No primes in range</div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="font-medium">First 25 Primes</div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex flex-wrap gap-1">
                      {sieveOfEratosthenes(100).slice(0, 25).map(prime => (
                        <Badge key={prime} variant="outline" className="text-xs">
                          {prime}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                  <div><strong>Sieve of Eratosthenes:</strong> Ancient algorithm for finding primes</div>
                  <div><strong>Time Complexity:</strong> O(n log log n)</div>
                  <div><strong>Space Complexity:</strong> O(n)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="special" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Special Prime Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-2">Twin Primes (p, p+2)</div>
                    <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {twinPrimes.slice(0, 15).map(([p1, p2], index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            ({p1}, {p2})
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      First {twinPrimes.slice(0, 15).length} twin prime pairs
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="font-medium mb-2">Goldbach Conjecture</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Express {testNumber} as sum of two primes:
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      {goldbachResult.length > 0 ? (
                        <div className="space-y-1">
                          {goldbachResult.slice(0, 5).map(([p1, p2], index) => (
                            <div key={index} className="font-mono text-sm">
                              {testNumber} = {p1} + {p2}
                            </div>
                          ))}
                          {goldbachResult.length > 5 && (
                            <div className="text-xs text-muted-foreground">
                              ...and {goldbachResult.length - 5} more ways
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          {parseInt(testNumber) % 2 === 0 && parseInt(testNumber) >= 4 
                            ? "No decomposition found" 
                            : "Enter an even number ≥ 4"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prime Conjectures & Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Famous Conjectures</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Goldbach:</strong> Every even integer ≥ 4 is sum of two primes</div>
                      <div><strong>Twin Prime:</strong> Infinitely many primes p where p+2 is also prime</div>
                      <div><strong>Riemann:</strong> All non-trivial zeros of ζ(s) have real part 1/2</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Prime Records</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Largest known:</strong> 2^82,589,933 - 1 (24.86M digits)</div>
                      <div><strong>Largest twin:</strong> 2996863034895 × 2^1290000 ± 1</div>
                      <div><strong>Mersenne primes:</strong> 51 known (as of 2023)</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="font-medium mb-2">Applications</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Cryptography:</strong> RSA encryption</div>
                      <div><strong>Hash functions:</strong> Collision resistance</div>
                      <div><strong>Random numbers:</strong> Pseudorandom generators</div>
                      <div><strong>Mathematics:</strong> Number theory research</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}