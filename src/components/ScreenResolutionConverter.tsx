import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Combobox } from "./ui/combobox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Copy, RefreshCcw, Monitor } from "lucide-react";

interface Resolution {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: string;
  ppi?: number; // pixels per inch for common screen sizes
}

const resolutions: Resolution[] = [
  // Common display resolutions
  { id: "480p", name: "480p (SD)", width: 720, height: 480, aspectRatio: "3:2", category: "Standard" },
  { id: "720p", name: "720p (HD)", width: 1280, height: 720, aspectRatio: "16:9", category: "HD" },
  { id: "1080p", name: "1080p (Full HD)", width: 1920, height: 1080, aspectRatio: "16:9", category: "Full HD" },
  { id: "1440p", name: "1440p (2K QHD)", width: 2560, height: 1440, aspectRatio: "16:9", category: "2K" },
  { id: "4k", name: "4K UHD", width: 3840, height: 2160, aspectRatio: "16:9", category: "4K" },
  { id: "5k", name: "5K", width: 5120, height: 2880, aspectRatio: "16:9", category: "5K" },
  { id: "8k", name: "8K UHD", width: 7680, height: 4320, aspectRatio: "16:9", category: "8K" },
  
  // Mobile/Tablet resolutions
  { id: "iphone-se", name: "iPhone SE", width: 750, height: 1334, aspectRatio: "9:16", category: "Mobile" },
  { id: "iphone-15", name: "iPhone 15", width: 1179, height: 2556, aspectRatio: "9:19.5", category: "Mobile" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro Max", width: 1290, height: 2796, aspectRatio: "9:19.5", category: "Mobile" },
  { id: "ipad", name: "iPad (10.9\")", width: 1640, height: 2360, aspectRatio: "4:3", category: "Tablet" },
  { id: "ipad-pro", name: "iPad Pro (12.9\")", width: 2048, height: 2732, aspectRatio: "4:3", category: "Tablet" },
  
  // Computer displays
  { id: "macbook-air", name: "MacBook Air 13\"", width: 2560, height: 1664, aspectRatio: "16:10", category: "Laptop" },
  { id: "macbook-pro-14", name: "MacBook Pro 14\"", width: 3024, height: 1964, aspectRatio: "16:10", category: "Laptop" },
  { id: "macbook-pro-16", name: "MacBook Pro 16\"", width: 3456, height: 2234, aspectRatio: "16:10", category: "Laptop" },
  { id: "imac-24", name: "iMac 24\"", width: 4480, height: 2520, aspectRatio: "16:9", category: "Desktop" },
  
  // Ultrawide
  { id: "ultrawide-1080", name: "Ultrawide 1080p", width: 2560, height: 1080, aspectRatio: "21:9", category: "Ultrawide" },
  { id: "ultrawide-1440", name: "Ultrawide 1440p", width: 3440, height: 1440, aspectRatio: "21:9", category: "Ultrawide" },
  { id: "ultrawide-4k", name: "Ultrawide 4K", width: 5120, height: 2160, aspectRatio: "21:9", category: "Ultrawide" },
];

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function calculateMegapixels(width: number, height: number): number {
  return Math.round((width * height) / 1000000 * 10) / 10;
}

function calculatePPI(width: number, height: number, diagonalInches: number): number {
  const diagonalPixels = Math.sqrt(width * width + height * height);
  return Math.round(diagonalPixels / diagonalInches);
}

export function ScreenResolutionConverter() {
  const [selectedResolution, setSelectedResolution] = useState("1080p");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [screenSize, setScreenSize] = useState("24"); // inches
  
  const currentResolution = resolutions.find(r => r.id === selectedResolution);
  const width = currentResolution ? currentResolution.width : parseInt(customWidth) || 0;
  const height = currentResolution ? currentResolution.height : parseInt(customHeight) || 0;
  
  const calculations = useMemo(() => {
    if (!width || !height) return null;
    
    const aspectRatio = calculateAspectRatio(width, height);
    const megapixels = calculateMegapixels(width, height);
    const screenSizeNum = parseFloat(screenSize);
    const ppi = screenSizeNum ? calculatePPI(width, height, screenSizeNum) : null;
    
    return {
      aspectRatio,
      megapixels,
      ppi,
      totalPixels: width * height,
    };
  }, [width, height, screenSize]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const popularResolutions = [
    { id: "1080p", label: "1080p" },
    { id: "1440p", label: "1440p" },
    { id: "4k", label: "4K" },
    { id: "iphone-15", label: "iPhone 15" },
    { id: "ultrawide-1440", label: "Ultrawide" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Monitor className="size-4" />
          </span>
          Screen Resolution Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Preset Resolutions</div>
              <Combobox
                options={resolutions.map(res => ({
                  value: res.id,
                  label: `${res.name} (${res.width}×${res.height}) - ${res.category}`
                }))}
                value={selectedResolution}
                onValueChange={setSelectedResolution}
                placeholder="Search resolution..."
                searchPlaceholder="Search resolutions..."
                emptyMessage="No resolution found."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Custom Resolution</div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={customWidth}
                  onChange={(e) => {
                    setCustomWidth(e.target.value);
                    setSelectedResolution("");
                  }}
                  placeholder="Width"
                  type="number"
                />
                <Input
                  value={customHeight}
                  onChange={(e) => {
                    setCustomHeight(e.target.value);
                    setSelectedResolution("");
                  }}
                  placeholder="Height"
                  type="number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Screen Size (inches)</div>
              <Input
                value={screenSize}
                onChange={(e) => setScreenSize(e.target.value)}
                placeholder="Diagonal size in inches"
                type="number"
                step="0.1"
              />
            </div>
          </div>

          <div className="space-y-4">
            {currentResolution && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Resolution Details</div>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {currentResolution.name}</div>
                  <div><span className="text-muted-foreground">Dimensions:</span> {currentResolution.width}×{currentResolution.height}</div>
                  <div><span className="text-muted-foreground">Category:</span> {currentResolution.category}</div>
                </div>
              </div>
            )}

            {calculations && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Calculations</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aspect Ratio:</span>
                    <span>{calculations.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Megapixels:</span>
                    <span>{calculations.megapixels} MP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pixels:</span>
                    <span>{calculations.totalPixels.toLocaleString()}</span>
                  </div>
                  {calculations.ppi && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PPI:</span>
                      <span>{calculations.ppi}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedResolution("1080p");
              setCustomWidth("");
              setCustomHeight("");
              setScreenSize("24");
            }}
          >
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          {width && height && (
            <>
              <Button
                variant="outline"
                onClick={() => copy(`${width}×${height}`)}
              >
                <Copy className="mr-2 size-4" />
                Copy Resolution
              </Button>
              {calculations?.aspectRatio && (
                <Button
                  variant="outline"
                  onClick={() => copy(calculations.aspectRatio)}
                >
                  <Copy className="mr-2 size-4" />
                  Copy Aspect Ratio
                </Button>
              )}
            </>
          )}
        </div>

        <div>
          <Separator className="my-2" />
          <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Popular resolutions</div>
          <div className="flex flex-wrap gap-2">
            {popularResolutions.map((res) => (
              <Badge
                key={res.id}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/15 hover:text-primary"
                onClick={() => {
                  setSelectedResolution(res.id);
                  setCustomWidth("");
                  setCustomHeight("");
                }}
              >
                {res.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}