import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Wifi, Copy, RefreshCcw, Download, Upload, Globe, Clock, HardDrive } from "lucide-react";
import { formatNumber } from "../lib/format";

interface TransferCalculation {
  transferTime: number;
  formattedTime: string;
  throughputMbps: number;
  throughputMBps: number;
  isValid: boolean;
}

interface WebsiteBandwidth {
  dailyVisitors: number;
  avgPageSize: number;
  pagesPerVisit: number;
  peakConcurrentUsers: number;
  requiredBandwidth: number;
  recommendedBandwidth: number;
  monthlyDataTransfer: number;
  isValid: boolean;
}

export function BandwidthCalculatorConverter() {
  // Download/Upload Time Calculator
  const [fileSize, setFileSize] = useState("1");
  const [fileSizeUnit, setFileSizeUnit] = useState("GB");
  const [connectionSpeed, setConnectionSpeed] = useState("100");
  const [speedUnit, setSpeedUnit] = useState("Mbps");
  const [efficiency, setEfficiency] = useState("80");

  // Website Bandwidth Calculator
  const [dailyVisitors, setDailyVisitors] = useState("1000");
  const [avgPageSize, setAvgPageSize] = useState("2");
  const [pageSizeUnit, setPageSizeUnit] = useState("MB");
  const [pagesPerVisit, setPagesPerVisit] = useState("5");
  const [peakHours, setPeakHours] = useState("4");
  const [peakMultiplier, setPeakMultiplier] = useState("3");

  const calculateTransferTime = (): TransferCalculation => {
    try {
      const fileSizeValue = parseFloat(fileSize);
      const speedValue = parseFloat(connectionSpeed);
      const efficiencyValue = parseFloat(efficiency);

      if (!fileSizeValue || fileSizeValue <= 0 || !speedValue || speedValue <= 0 || 
          efficiencyValue <= 0 || efficiencyValue > 100) {
        return { transferTime: 0, formattedTime: "", throughputMbps: 0, throughputMBps: 0, isValid: false };
      }

      // Convert file size to bytes (using binary prefixes for accuracy)
      let fileSizeBytes = fileSizeValue;
      switch (fileSizeUnit) {
        case "KB": fileSizeBytes *= 1024; break; // KiB
        case "MB": fileSizeBytes *= 1024 * 1024; break; // MiB  
        case "GB": fileSizeBytes *= 1024 * 1024 * 1024; break; // GiB
        case "TB": fileSizeBytes *= 1024 * 1024 * 1024 * 1024; break; // TiB
      }

      // Convert speed to bits per second (using proper SI/binary conversions)
      let speedBps = speedValue;
      switch (speedUnit) {
        case "Kbps": speedBps *= 1000; break; // SI decimal
        case "Mbps": speedBps *= 1000000; break; // SI decimal
        case "Gbps": speedBps *= 1000000000; break; // SI decimal
        case "KBps": speedBps *= 8 * 1024; break; // Binary bytes to bits
        case "MBps": speedBps *= 8 * 1024 * 1024; break; // Binary bytes to bits
        case "GBps": speedBps *= 8 * 1024 * 1024 * 1024; break; // Binary bytes to bits
      }

      // Apply efficiency factor (accounts for TCP/IP overhead, network congestion, etc.)
      const effectiveSpeedBps = speedBps * (efficiencyValue / 100);
      
      // Calculate transfer time in seconds
      const transferTimeSeconds = (fileSizeBytes * 8) / effectiveSpeedBps;

      // Format time
      const formatTime = (seconds: number): string => {
        if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
        if (seconds < 60) return `${seconds.toFixed(1)}s`;
        if (seconds < 3600) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          return `${minutes}m ${remainingSeconds}s`;
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours < 24) {
          return `${hours}h ${minutes}m`;
        }
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
      };

      return {
        transferTime: transferTimeSeconds,
        formattedTime: formatTime(transferTimeSeconds),
        throughputMbps: effectiveSpeedBps / 1000000,
        throughputMBps: effectiveSpeedBps / (8 * 1024 * 1024),
        isValid: true
      };
    } catch (error) {
      return { transferTime: 0, formattedTime: "", throughputMbps: 0, throughputMBps: 0, isValid: false };
    }
  };

  const calculateWebsiteBandwidth = (): WebsiteBandwidth => {
    try {
      const visitors = parseFloat(dailyVisitors);
      const pageSize = parseFloat(avgPageSize);
      const pagesPerVisitValue = parseFloat(pagesPerVisit);
      const peakHoursValue = parseFloat(peakHours);
      const peakMultiplierValue = parseFloat(peakMultiplier);

      if (!visitors || visitors <= 0 || !pageSize || pageSize <= 0 || 
          !pagesPerVisitValue || pagesPerVisitValue <= 0 || !peakHoursValue || 
          peakHoursValue <= 0 || peakHoursValue > 24 || !peakMultiplierValue || 
          peakMultiplierValue <= 0) {
        return {
          dailyVisitors: 0, avgPageSize: 0, pagesPerVisit: 0, peakConcurrentUsers: 0,
          requiredBandwidth: 0, recommendedBandwidth: 0, monthlyDataTransfer: 0, isValid: false
        };
      }

      // Convert page size to bytes (binary prefixes for accuracy)
      let pageSizeBytes = pageSize;
      switch (pageSizeUnit) {
        case "KB": pageSizeBytes *= 1024; break;
        case "MB": pageSizeBytes *= 1024 * 1024; break;
        case "GB": pageSizeBytes *= 1024 * 1024 * 1024; break;
      }

      // Calculate daily data transfer
      const dailyDataTransferBytes = visitors * pagesPerVisitValue * pageSizeBytes;
      
      // Calculate peak concurrent users using proper statistical distribution
      // Assumption: Traffic follows normal distribution with peak hours concentrated
      const avgVisitorsPerHour = visitors / 24;
      const peakVisitorsPerHour = avgVisitorsPerHour * peakMultiplierValue;
      
      // Estimate concurrent users (typical visit duration 2-3 minutes)
      const avgVisitDurationMinutes = 2.5;
      const peakConcurrentUsers = (peakVisitorsPerHour * avgVisitDurationMinutes) / 60;
      
      // Calculate bandwidth requirements
      // Average page load time assumption: 3-5 seconds for total session
      const avgPageLoadTime = 4; // seconds
      const simultaneousPageLoads = (peakConcurrentUsers * pagesPerVisitValue) / avgPageLoadTime;
      
      // Base bandwidth requirement (bytes per second)
      const baseBandwidthBps = simultaneousPageLoads * pageSizeBytes;
      
      // Apply protocol overhead factors:
      // - HTTP headers: ~5-10% overhead
      // - TCP overhead: ~3-5% overhead  
      // - IP overhead: ~1-3% overhead
      // - Ethernet overhead: ~1-2% overhead
      // - Total overhead: ~15-25% (use 20%)
      const protocolOverhead = 1.20;
      
      // Apply burstiness factor (web traffic is bursty, not constant)
      const burstinessFactor = 1.5;
      
      // Required bandwidth with overheads
      const requiredBandwidthBps = baseBandwidthBps * protocolOverhead * burstinessFactor;
      const requiredBandwidthMbps = (requiredBandwidthBps * 8) / 1000000;
      
      // Recommended bandwidth with safety margin (2.5x for 95th percentile)
      const recommendedBandwidthMbps = requiredBandwidthMbps * 2.5;
      
      // Monthly data transfer in GB (including all overhead)
      const monthlyDataTransferGB = (dailyDataTransferBytes * 30 * protocolOverhead) / (1024 * 1024 * 1024);

      return {
        dailyVisitors: visitors,
        avgPageSize: pageSize,
        pagesPerVisit: pagesPerVisitValue,
        peakConcurrentUsers: Math.round(peakConcurrentUsers),
        requiredBandwidth: requiredBandwidthMbps,
        recommendedBandwidth: recommendedBandwidthMbps,
        monthlyDataTransfer: monthlyDataTransferGB,
        isValid: true
      };
    } catch (error) {
      return {
        dailyVisitors: 0, avgPageSize: 0, pagesPerVisit: 0, peakConcurrentUsers: 0,
        requiredBandwidth: 0, recommendedBandwidth: 0, monthlyDataTransfer: 0, isValid: false
      };
    }
  };

  const transferResult = calculateTransferTime();
  const bandwidthResult = calculateWebsiteBandwidth();

  const resetTransfer = () => {
    setFileSize("1");
    setFileSizeUnit("GB");
    setConnectionSpeed("100");
    setSpeedUnit("Mbps");
    setEfficiency("80");
  };

  const resetWebsite = () => {
    setDailyVisitors("1000");
    setAvgPageSize("2");
    setPageSizeUnit("MB");
    setPagesPerVisit("5");
    setPeakHours("4");
    setPeakMultiplier("3");
  };

  const copyTransferResult = async () => {
    if (!transferResult.isValid) return;

    const text = `Download/Upload Time Calculation:

File Size: ${fileSize} ${fileSizeUnit}
Connection Speed: ${connectionSpeed} ${speedUnit}
Efficiency: ${efficiency}%

Results:
Transfer Time: ${transferResult.formattedTime}
Effective Throughput: ${transferResult.throughputMbps.toFixed(2)} Mbps (${transferResult.throughputMBps.toFixed(2)} MB/s)

Technical Details:
- File sizes use binary prefixes (1024-based)
- Network speeds use decimal prefixes (1000-based) 
- Efficiency accounts for TCP window scaling, congestion control
- Real-world factors: packet loss, retransmissions, protocol overhead

Note: Transfer time includes ${100 - parseFloat(efficiency)}% overhead for real-world network conditions.`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyBandwidthResult = async () => {
    if (!bandwidthResult.isValid) return;

    const text = `Website Bandwidth Requirements:

Website Statistics:
Daily Visitors: ${formatNumber(bandwidthResult.dailyVisitors)}
Average Page Size: ${bandwidthResult.avgPageSize} ${pageSizeUnit}
Pages per Visit: ${bandwidthResult.pagesPerVisit}
Peak Hours: ${peakHours}h/day
Peak Traffic Multiplier: ${peakMultiplier}x

Bandwidth Requirements:
Peak Concurrent Users: ${formatNumber(bandwidthResult.peakConcurrentUsers)}
Required Bandwidth: ${bandwidthResult.requiredBandwidth.toFixed(2)} Mbps
Recommended Bandwidth: ${bandwidthResult.recommendedBandwidth.toFixed(2)} Mbps
Monthly Data Transfer: ${bandwidthResult.monthlyDataTransfer.toFixed(2)} GB

Calculation Methodology:
- Concurrent users based on 2.5min avg visit duration
- Protocol overhead: 20% (HTTP, TCP, IP, Ethernet)
- Burstiness factor: 1.5x (web traffic variability)
- Safety margin: 2.5x for 95th percentile performance

Note: Recommended bandwidth accounts for protocol overhead, traffic burstiness, and statistical peak loads.`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Wifi className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Bandwidth Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate download/upload times and website bandwidth requirements
        </p>
      </div>

      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transfer">Download/Upload Time</TabsTrigger>
          <TabsTrigger value="website">Website Bandwidth</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transfer Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="size-5" />
                  Transfer Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input
                      id="fileSize"
                      type="number"
                      step="0.1"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileSizeUnit">Unit</Label>
                    <Select value={fileSizeUnit} onValueChange={setFileSizeUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KB">Kilobytes (KB)</SelectItem>
                        <SelectItem value="MB">Megabytes (MB)</SelectItem>
                        <SelectItem value="GB">Gigabytes (GB)</SelectItem>
                        <SelectItem value="TB">Terabytes (TB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="speed">Connection Speed</Label>
                    <Input
                      id="speed"
                      type="number"
                      step="0.1"
                      value={connectionSpeed}
                      onChange={(e) => setConnectionSpeed(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speedUnit">Unit</Label>
                    <Select value={speedUnit} onValueChange={setSpeedUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kbps">Kbps (Kilobit/s)</SelectItem>
                        <SelectItem value="Mbps">Mbps (Megabit/s)</SelectItem>
                        <SelectItem value="Gbps">Gbps (Gigabit/s)</SelectItem>
                        <SelectItem value="KBps">KBps (Kilobyte/s)</SelectItem>
                        <SelectItem value="MBps">MBps (Megabyte/s)</SelectItem>
                        <SelectItem value="GBps">GBps (Gigabyte/s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">Network Efficiency (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    min="1"
                    max="100"
                    value={efficiency}
                    onChange={(e) => setEfficiency(e.target.value)}
                    placeholder="80"
                  />
                  <div className="text-xs text-muted-foreground">
                    Accounts for real-world conditions (TCP overhead, network congestion, etc.)
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={resetTransfer} variant="outline" className="flex-1 cursor-pointer">
                    <RefreshCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                  <Button onClick={copyTransferResult} variant="outline" disabled={!transferResult.isValid} className="cursor-pointer">
                    <Copy className="mr-2 size-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Transfer Time Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transferResult.isValid ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {transferResult.formattedTime}
                      </div>
                      <div className="text-lg font-medium">Transfer Time</div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Throughput Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Effective Speed</div>
                          <div>{transferResult.throughputMbps.toFixed(2)} Mbps</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Transfer Rate</div>
                          <div>{transferResult.throughputMBps.toFixed(2)} MB/s</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Transfer Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Size:</span>
                          <span>{fileSize} {fileSizeUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connection:</span>
                          <span>{connectionSpeed} {speedUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Efficiency:</span>
                          <span>{efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                      <strong>Note:</strong> This calculation includes network overhead and real-world efficiency factors. 
                      Actual transfer times may vary based on server performance, network congestion, and other factors.
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <Clock className="size-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Configure transfer settings
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enter file size and connection speed to calculate transfer time
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Website Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5" />
                  Website Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visitors">Daily Visitors</Label>
                  <Input
                    id="visitors"
                    type="number"
                    value={dailyVisitors}
                    onChange={(e) => setDailyVisitors(e.target.value)}
                    placeholder="1000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="pageSize">Average Page Size</Label>
                    <Input
                      id="pageSize"
                      type="number"
                      step="0.1"
                      value={avgPageSize}
                      onChange={(e) => setAvgPageSize(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pageSizeUnit">Unit</Label>
                    <Select value={pageSizeUnit} onValueChange={setPageSizeUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KB">Kilobytes (KB)</SelectItem>
                        <SelectItem value="MB">Megabytes (MB)</SelectItem>
                        <SelectItem value="GB">Gigabytes (GB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pagesPerVisit">Pages per Visit</Label>
                  <Input
                    id="pagesPerVisit"
                    type="number"
                    step="0.1"
                    value={pagesPerVisit}
                    onChange={(e) => setPagesPerVisit(e.target.value)}
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peakHours">Peak Hours per Day</Label>
                  <Input
                    id="peakHours"
                    type="number"
                    step="0.5"
                    value={peakHours}
                    onChange={(e) => setPeakHours(e.target.value)}
                    placeholder="4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peakMultiplier">Peak Traffic Multiplier</Label>
                  <Input
                    id="peakMultiplier"
                    type="number"
                    step="0.1"
                    value={peakMultiplier}
                    onChange={(e) => setPeakMultiplier(e.target.value)}
                    placeholder="3"
                  />
                  <div className="text-xs text-muted-foreground">
                    How many times higher is peak traffic vs average (e.g., 3x means 3 times higher)
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={resetWebsite} variant="outline" className="flex-1 cursor-pointer">
                    <RefreshCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                  <Button onClick={copyBandwidthResult} variant="outline" disabled={!bandwidthResult.isValid} className="cursor-pointer">
                    <Copy className="mr-2 size-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Website Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5" />
                  Bandwidth Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bandwidthResult.isValid ? (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <HardDrive className="size-4" />
                        Traffic Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Peak Concurrent Users</div>
                          <div className="text-lg font-semibold">{formatNumber(bandwidthResult.peakConcurrentUsers)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Monthly Data Transfer</div>
                          <div className="text-lg font-semibold">{bandwidthResult.monthlyDataTransfer.toFixed(1)} GB</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Bandwidth Requirements</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded">
                          <span className="font-medium">Required Bandwidth</span>
                          <span className="text-lg font-bold text-orange-600">
                            {bandwidthResult.requiredBandwidth.toFixed(2)} Mbps
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded">
                          <span className="font-medium">Recommended Bandwidth</span>
                          <span className="text-lg font-bold text-green-600">
                            {bandwidthResult.recommendedBandwidth.toFixed(2)} Mbps
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Website Statistics Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Daily Visitors:</span>
                          <span>{formatNumber(bandwidthResult.dailyVisitors)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Page Size:</span>
                          <span>{bandwidthResult.avgPageSize} {pageSizeUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pages/Visit:</span>
                          <span>{bandwidthResult.pagesPerVisit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peak Hours:</span>
                          <span>{peakHours}h/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peak Multiplier:</span>
                          <span>{peakMultiplier}x</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded space-y-1">
                      <div><strong>Calculation Notes:</strong></div>
                      <div>• Concurrent users: {(bandwidthResult.peakConcurrentUsers * 2.5 / 60).toFixed(1)} visitors/hour × 2.5min avg session</div>
                      <div>• Protocol overhead: 20% (HTTP, TCP, IP, Ethernet headers)</div>
                      <div>• Burstiness factor: 1.5x for traffic variability</div>
                      <div>• Safety margin: 2.5x for 95th percentile performance</div>
                      <div><strong>Optimization:</strong> Consider CDN, caching, compression to reduce requirements.</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <Globe className="size-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Configure website settings
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enter website statistics to calculate bandwidth requirements
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}