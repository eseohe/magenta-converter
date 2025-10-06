import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowUpDown, Copy, RefreshCcw, Globe2 } from "lucide-react";
import { formatNumber } from "../lib/format";

const CACHE_KEY = "fx:frankfurter:USD";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

type FxPayload = {
  base: string; // from API
  rates: Record<string, number>;
  date: string; // YYYY-MM-DD
};

type FxStore = FxPayload & { timestamp: number };

async function fetchRates(): Promise<FxPayload> {
  const url = "https://api.frankfurter.app/latest?from=USD";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch FX rates");
  const json = await res.json();
  if (!json || !json.rates) throw new Error("Unexpected FX payload");
  const base = json.base ?? "USD";
  const withBase = { ...json.rates, [base]: 1 } as Record<string, number>;
  return { base, rates: withBase, date: json.date };
}

function deriveRates(store: FxPayload, desiredBase: string): FxPayload {
  if (desiredBase === store.base) return store;
  const baseRate = store.rates[desiredBase];
  if (!baseRate) return store; // fallback to original base
  const derived: Record<string, number> = {};
  Object.entries(store.rates).forEach(([code, rate]) => {
    derived[code] = rate / baseRate;
  });
  derived[desiredBase] = 1;
  return { base: desiredBase, rates: derived, date: store.date };
}

const COMMON = ["USD","EUR","GBP","JPY","CNY","CAD","AUD","CHF","INR","BRL","ZAR","HKD","SGD","KRW","MXN","SEK","NOK","DKK","NZD","TRY","PLN","THB","TWD","RUB","ILS","SAR","AED","CLP","COP"] as const;

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [base, setBase] = useState("USD");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [store, setStore] = useState<FxStore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from cache or fetch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as FxStore;
        if (Date.now() - s.timestamp < TTL_MS) setStore(s);
      }
    } catch {}
    (async () => {
      if (!store) {
        try {
          setLoading(true);
          const payload = await fetchRates();
          const s: FxStore = { ...payload, timestamp: Date.now() };
          localStorage.setItem(CACHE_KEY, JSON.stringify(s));
          setStore(s);
        } catch (e: any) {
          setError(e?.message ?? "Failed to load FX");
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payload = useMemo(() => (store ? deriveRates(store, base) : null), [store, base]);

  const result = useMemo(() => {
    const v = Number.parseFloat(amount.replace(/,/g, ""));
    if (!payload || !Number.isFinite(v)) return NaN;
    const rf = payload.rates[from];
    const rt = payload.rates[to];
    if (!rf || !rt) return NaN;
    return v * (rt / rf);
  }, [payload, amount, from, to]);

  const swap = () => { setFrom(to); setTo(from); };
  const copy = async () => { if (Number.isFinite(result)) await navigator.clipboard.writeText(String(result)); };

  const refresh = async () => {
    try {
      setLoading(true); setError(null);
      const payload = await fetchRates();
      const s: FxStore = { ...payload, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(s));
      setStore(s);
    } catch (e: any) {
      setError(e?.message ?? "Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const codes = useMemo(() => {
    if (payload) {
      const arr = Object.keys(payload.rates);
      if (!arr.includes(payload.base)) arr.push(payload.base);
      return arr.sort();
    }
    const set = new Set<string>(COMMON as unknown as string[]);
    set.add(base);
    return Array.from(set).sort();
  }, [payload, base]);

  const currencyOptions = useMemo(() => {
    return codes.map(code => ({
      value: code,
      label: code,
    }));
  }, [codes]);

  const lastUpdated = store ? new Date(store.timestamp) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary"><Globe2 className="size-4"/></span>
          Currency (Live)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] md:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Enter amount" />
              <Combobox
                options={currencyOptions}
                value={from}
                onValueChange={setFrom}
                placeholder="Currency"
                searchPlaceholder="Search currencies..."
                className="w-[180px]"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center pb-2">
            <Button type="button" variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={swap}><ArrowUpDown className="size-4"/></Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-2">
              <Input readOnly value={Number.isFinite(result) ? formatNumber(result) : ""} />
              <Combobox
                options={currencyOptions}
                value={to}
                onValueChange={setTo}
                placeholder="Currency"
                searchPlaceholder="Search currencies..."
                className="w-[180px]"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] md:items-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Base:
            <Combobox
              options={[
                ...COMMON.filter(c=>codes.includes(c) || c===base).map(c => ({ value: c, label: c })),
                ...codes.map(c => ({ value: c, label: c }))
              ]}
              value={base}
              onValueChange={setBase}
              placeholder="Search base..."
              searchPlaceholder="Search currencies..."
              emptyMessage="No currency found."
              className="w-[140px] h-8 text-xs"
            />
            <Badge variant="secondary" className="ml-2">{payload?.base ?? "—"}</Badge>
          </div>
          <div className="hidden md:block"/>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={()=>setAmount("1")}><RefreshCcw className="mr-2 size-4"/>Reset</Button>
            <Button variant="outline" size="sm" onClick={copy}><Copy className="mr-2 size-4"/>Copy result</Button>
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}><RefreshCcw className="mr-2 size-4"/>{loading?"Refreshing...":"Refresh rates"}</Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : (
            <>
              Last updated: {store?.date ?? (lastUpdated ? lastUpdated.toLocaleString() : "—")}
              {store && <span className="ml-2">(source: frankfurter.app, ECB)</span>}
            </>
          )}
        </div>

        {payload && (
          <div>
            <Separator className="my-2" />
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Popular pairs</div>
            <div className="flex flex-wrap gap-2">
              {[["USD","EUR"],["USD","JPY"],["EUR","GBP"],["USD","INR"],["USD","CNY"]].map(([a,b]) => (
                <Badge key={`${a}-${b}`} variant="secondary" className="cursor-pointer hover:bg-primary/15 hover:text-primary" onClick={() => { setFrom(a); setTo(b); }}>
                  {a} → {b}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
