import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Copy, RefreshCcw } from "lucide-react";

function sanitize(str: string) { return str.trim(); }

function clampBase(n: number) { return Math.min(36, Math.max(2, Math.trunc(n))); }

function convertBase(value: string, fromBase: number, toBase: number): string {
  const s = sanitize(value).toLowerCase();
  const valid = /^[+-]?[0-9a-z]+$/i.test(s);
  if (!valid) return "";
  const sign = s.startsWith("-") ? -1 : 1;
  const body = s.replace(/^[-+]/, "");
  const n = parseInt(body, fromBase);
  if (!Number.isFinite(n)) return "";
  const out = Math.trunc(Math.abs(n)).toString(toBase);
  return (sign < 0 ? "-" : "") + out;
}

export function NumericBaseConverter() {
  const [dec, setDec] = useState("0");
  const [hex, setHex] = useState("0");
  const [bin, setBin] = useState("0");
  const [oct, setOct] = useState("0");

  // Custom any-base converter
  const [anyIn, setAnyIn] = useState("0");
  const [fromBase, setFromBase] = useState(3);
  const [toBase, setToBase] = useState(10);

  const anyOut = useMemo(() => convertBase(anyIn, clampBase(fromBase), clampBase(toBase)), [anyIn, fromBase, toBase]);

  const syncFromDec = (v: string) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    setDec(String(n));
    setHex(Math.trunc(n).toString(16));
    setBin(Math.trunc(n).toString(2));
    setOct(Math.trunc(n).toString(8));
  };

  const syncFrom = (v: string, base: number) => {
    const s = sanitize(v);
    const n = parseInt(s, base);
    if (!Number.isFinite(n)) return;
    syncFromDec(String(n));
  };

  const copy = async (text: string) => navigator.clipboard.writeText(text);

  const reset = () => { syncFromDec("0"); setAnyIn("0"); setFromBase(3); setToBase(10); };

  const baseOptions = Array.from({ length: 35 }, (_, i) => i + 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">#</span>
          Number Bases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Decimal</div>
            <div className="flex gap-2">
              <Input value={dec} onChange={(e) => syncFromDec(e.target.value)} inputMode="numeric" />
              <Button variant="outline" onClick={() => copy(dec)}><Copy className="mr-2 size-4"/>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Hexadecimal</div>
            <div className="flex gap-2">
              <Input value={hex} onChange={(e) => { setHex(e.target.value); syncFrom(e.target.value, 16); }} />
              <Button variant="outline" onClick={() => copy(hex)}><Copy className="mr-2 size-4"/>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Binary</div>
            <div className="flex gap-2">
              <Input value={bin} onChange={(e) => { setBin(e.target.value); syncFrom(e.target.value, 2); }} />
              <Button variant="outline" onClick={() => copy(bin)}><Copy className="mr-2 size-4"/>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Octal</div>
            <div className="flex gap-2">
              <Input value={oct} onChange={(e) => { setOct(e.target.value); syncFrom(e.target.value, 8); }} />
              <Button variant="outline" onClick={() => copy(oct)}><Copy className="mr-2 size-4"/>Copy</Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Any base (2–36)</div>
          <div className="grid gap-3 md:grid-cols-[1fr,auto,auto,1fr] md:items-end">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Value</div>
              <Input value={anyIn} onChange={(e)=>setAnyIn(e.target.value)} placeholder="Enter value (0-9 a-z)" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">From base</div>
              <Select value={String(fromBase)} onValueChange={(v)=>setFromBase(parseInt(v))}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {baseOptions.map((b)=>(<SelectItem key={b} value={String(b)}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">To base</div>
              <Select value={String(toBase)} onValueChange={(v)=>setToBase(parseInt(v))}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {baseOptions.map((b)=>(<SelectItem key={b} value={String(b)}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Result</div>
              <div className="flex gap-2">
                <Input readOnly value={anyOut} />
                <Button variant="outline" onClick={() => copy(anyOut)} disabled={!anyOut}><Copy className="mr-2 size-4"/>Copy</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Button variant="secondary" onClick={reset}><RefreshCcw className="mr-2 size-4"/>Reset</Button>
      </CardContent>
    </Card>
  );
}
