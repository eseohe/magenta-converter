import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Network, Copy, RefreshCcw, Router, Globe, Shield, Users } from "lucide-react";
import { formatNumber } from "../lib/format";

interface IPAddressList {
  addresses: string[];
  canShowAll: boolean;
  totalCount: number;
}

interface IPv4SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  firstUsableIP: string;
  lastUsableIP: string;
  ipClass: string;
  isPrivate: boolean;
  binarySubnetMask: string;
  cidrNotation: string;
  addressType: string;
  allIPs: IPAddressList;
}

interface IPv6SubnetInfo {
  networkAddress: string;
  prefixLength: number;
  totalAddresses: string;
  abbreviatedForm: string;
  expandedForm: string;
  isLinkLocal: boolean;
  isUniqueLocal: boolean;
  isGlobal: boolean;
  isLoopback: boolean;
  isUnspecified: boolean;
  isMulticast: boolean;
  addressCategory: string;
}

export function IPSubnetCalculatorConverter() {
  const [ipv4Address, setIpv4Address] = useState("192.168.1.100");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [cidr, setCidr] = useState("24");
  const [ipv6Address, setIpv6Address] = useState("2001:db8:85a3::8a2e:370:7334");
  const [ipv6Prefix, setIpv6Prefix] = useState("64");
  const [inputMethod, setInputMethod] = useState<"mask" | "cidr">("cidr");
  const [ipClassFilter, setIpClassFilter] = useState("any");
  const [showAllIPs, setShowAllIPs] = useState(false);

  // Generate suggested IP addresses based on class selection
  const generateSuggestedIPs = (selectedClass: string) => {
    switch (selectedClass) {
      case "A":
        setIpv4Address("10.0.1.100");
        setCidr("8");
        break;
      case "B":
        setIpv4Address("172.16.1.100");
        setCidr("16");
        break;
      case "C":
        setIpv4Address("192.168.1.100");
        setCidr("24");
        break;
      default:
        // Keep current values for "any"
        break;
    }
  };

  // Generate all IP addresses in subnet
  const generateAllIPs = (networkStart: number, hostBits: number): IPAddressList => {
    const totalHosts = Math.pow(2, hostBits);
    const maxDisplayable = 1000; // Limit display for performance
    
    if (totalHosts > maxDisplayable) {
      return {
        addresses: [],
        canShowAll: false,
        totalCount: totalHosts
      };
    }

    const addresses: string[] = [];
    for (let i = 0; i < totalHosts; i++) {
      const ipInt = networkStart + i;
      const address = [
        (ipInt >>> 24) & 0xff,
        (ipInt >>> 16) & 0xff,
        (ipInt >>> 8) & 0xff,
        ipInt & 0xff
      ].join('.');
      addresses.push(address);
    }

    return {
      addresses,
      canShowAll: true,
      totalCount: totalHosts
    };
  };

  const calculateIPv4Subnet = (): IPv4SubnetInfo | null => {
    try {
      let maskBits: number;
      let maskArray: number[];

      if (inputMethod === "cidr") {
        maskBits = parseInt(cidr);
        if (maskBits < 0 || maskBits > 32) return null;
        
        // Convert CIDR to subnet mask
        const mask = maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
        maskArray = [
          (mask >>> 24) & 0xff,
          (mask >>> 16) & 0xff,
          (mask >>> 8) & 0xff,
          mask & 0xff
        ];
      } else {
        // Parse and validate subnet mask
        maskArray = subnetMask.split('.').map(Number);
        if (maskArray.length !== 4 || maskArray.some(x => x < 0 || x > 255)) return null;
        
        // Validate subnet mask is contiguous (proper CIDR mask)
        const mask = (maskArray[0] << 24) | (maskArray[1] << 16) | (maskArray[2] << 8) | maskArray[3];
        const inverted = (~mask >>> 0);
        if ((inverted & (inverted + 1)) !== 0 && mask !== 0) return null; // Not a valid subnet mask
        
        // Convert to CIDR
        maskBits = mask === 0 ? 0 : 32 - Math.log2(inverted + 1);
        if (!Number.isInteger(maskBits)) return null;
      }

      // Parse and validate IP address
      const ipArray = ipv4Address.split('.').map(Number);
      if (ipArray.length !== 4 || ipArray.some(x => x < 0 || x > 255)) return null;

      const ip = (ipArray[0] << 24) | (ipArray[1] << 16) | (ipArray[2] << 8) | ipArray[3];
      const mask = maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
      const network = (ip & mask) >>> 0;
      const broadcast = maskBits === 32 ? network : (network | (~mask >>> 0)) >>> 0;

      // Convert back to dotted decimal
      const networkAddr = [
        (network >>> 24) & 0xff,
        (network >>> 16) & 0xff,
        (network >>> 8) & 0xff,
        network & 0xff
      ].join('.');

      const broadcastAddr = [
        (broadcast >>> 24) & 0xff,
        (broadcast >>> 16) & 0xff,
        (broadcast >>> 8) & 0xff,
        broadcast & 0xff
      ].join('.');

      const subnetMaskStr = maskArray.join('.');
      const wildcardMask = maskArray.map(x => 255 - x).join('.');

      const hostBits = 32 - maskBits;
      const totalHosts = hostBits === 0 ? 1 : Math.pow(2, hostBits);
      
      // Handle special cases for /31 and /32 networks
      let usableHosts: number;
      let firstUsable: string;
      let lastUsable: string;

      if (maskBits === 32) {
        // Host route - single IP
        usableHosts = 1;
        firstUsable = networkAddr;
        lastUsable = networkAddr;
      } else if (maskBits === 31) {
        // Point-to-point link (RFC 3021) - no network/broadcast addresses
        usableHosts = 2;
        firstUsable = networkAddr;
        lastUsable = broadcastAddr;
      } else {
        // Standard subnet - exclude network and broadcast
        usableHosts = Math.max(0, totalHosts - 2);
        
        // Calculate first and last usable IPs
        const firstUsableInt = network + 1;
        const lastUsableInt = broadcast - 1;
        
        firstUsable = [
          (firstUsableInt >>> 24) & 0xff,
          (firstUsableInt >>> 16) & 0xff,
          (firstUsableInt >>> 8) & 0xff,
          firstUsableInt & 0xff
        ].join('.');

        lastUsable = [
          (lastUsableInt >>> 24) & 0xff,
          (lastUsableInt >>> 16) & 0xff,
          (lastUsableInt >>> 8) & 0xff,
          lastUsableInt & 0xff
        ].join('.');
      }

      // Determine IP class and type
      const firstOctet = ipArray[0];
      let ipClass = "Unknown";
      let addressType = "Unknown";
      
      // Classful addressing
      if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = "A";
      } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = "B";
      } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = "C";
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = "D (Multicast)";
      } else if (firstOctet >= 240 && firstOctet <= 255) {
        ipClass = "E (Reserved)";
      } else if (firstOctet === 0) {
        ipClass = "Reserved (0.0.0.0/8)";
      } else if (firstOctet === 127) {
        ipClass = "Loopback (127.0.0.0/8)";
      }

      // Determine address type with comprehensive private/special address detection
      const isPrivate = 
        (firstOctet === 10) || // 10.0.0.0/8
        (firstOctet === 172 && ipArray[1] >= 16 && ipArray[1] <= 31) || // 172.16.0.0/12
        (firstOctet === 192 && ipArray[1] === 168); // 192.168.0.0/16
      
      const isSpecial = 
        (firstOctet === 0) || // This network (0.0.0.0/8)
        (firstOctet === 127) || // Loopback (127.0.0.0/8)
        (firstOctet === 169 && ipArray[1] === 254) || // Link-local (169.254.0.0/16)
        (firstOctet === 224) || // Multicast (224.0.0.0/4)
        (firstOctet >= 240); // Reserved (240.0.0.0/4)
      
      if (isPrivate) {
        addressType = "Private (RFC 1918)";
      } else if (firstOctet === 169 && ipArray[1] === 254) {
        addressType = "Link-local (APIPA)";
      } else if (firstOctet === 127) {
        addressType = "Loopback";
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        addressType = "Multicast";
      } else if (firstOctet >= 240) {
        addressType = "Reserved";
      } else if (firstOctet === 0) {
        addressType = "This Network";
      } else if (!isSpecial) {
        addressType = "Public";
      }

      // Binary subnet mask
      const binarySubnetMask = maskArray.map(x => 
        x.toString(2).padStart(8, '0')
      ).join('.');

      return {
        networkAddress: networkAddr,
        broadcastAddress: broadcastAddr,
        subnetMask: subnetMaskStr,
        wildcardMask,
        totalHosts,
        usableHosts,
        firstUsableIP: firstUsable,
        lastUsableIP: lastUsable,
        ipClass,
        isPrivate,
        binarySubnetMask,
        cidrNotation: `${networkAddr}/${maskBits}`,
        addressType,
        allIPs: generateAllIPs(network, hostBits)
      };
    } catch (error) {
      return null;
    }
  };

  const calculateIPv6Subnet = (): IPv6SubnetInfo | null => {
    try {
      const prefix = parseInt(ipv6Prefix);
      if (prefix < 0 || prefix > 128) return null;

      // Clean and validate IPv6 address
      const cleanAddress = ipv6Address.toLowerCase().replace(/\s/g, '');
      
      // Basic IPv6 format validation
      if (!/^[0-9a-f:]+$/.test(cleanAddress)) return null;
      if (cleanAddress.split('::').length > 2) return null; // Multiple ::
      
      // Expand abbreviated form properly
      let expandedAddress = cleanAddress;
      if (cleanAddress.includes('::')) {
        const parts = cleanAddress.split('::');
        const leftParts = parts[0] ? parts[0].split(':').filter(p => p !== '') : [];
        const rightParts = parts[1] ? parts[1].split(':').filter(p => p !== '') : [];
        const missingParts = 8 - leftParts.length - rightParts.length;
        
        if (missingParts < 0) return null; // Invalid format
        
        const zeros = Array(Math.max(1, missingParts)).fill('0');
        expandedAddress = [...leftParts, ...zeros, ...rightParts].join(':');
      }

      // Validate and pad each segment
      const segments = expandedAddress.split(':');
      if (segments.length !== 8) return null;
      
      const paddedSegments = segments.map(seg => {
        if (seg.length > 4 || !/^[0-9a-f]*$/.test(seg)) return null;
        return seg.padStart(4, '0');
      });
      
      if (paddedSegments.some(seg => seg === null)) return null;
      const fullyExpanded = (paddedSegments as string[]).join(':');

      // Calculate network address with proper bit masking
      const prefixBytes = Math.floor(prefix / 16);
      const remainingBits = prefix % 16;
      
      let networkSegments = [...paddedSegments] as string[];
      
      // Zero out host portion
      for (let i = prefixBytes; i < 8; i++) {
        if (i === prefixBytes && remainingBits > 0) {
          const mask = (0xffff << (16 - remainingBits)) & 0xffff;
          const segmentValue = parseInt(paddedSegments[i] as string, 16);
          networkSegments[i] = (segmentValue & mask).toString(16).padStart(4, '0');
        } else {
          networkSegments[i] = '0000';
        }
      }

      const networkAddress = networkSegments.join(':');
      
      // Properly abbreviate IPv6 address (RFC 5952)
      const abbreviateIPv6 = (addr: string): string => {
        // Remove leading zeros
        let abbreviated = addr.replace(/(^|:)0+([0-9a-f])/g, '$1$2');
        
        // Find longest sequence of consecutive zero groups
        const zeroGroups = abbreviated.match(/:0(:0)*/g);
        if (zeroGroups) {
          const longest = zeroGroups.reduce((a, b) => a.length >= b.length ? a : b);
          abbreviated = abbreviated.replace(longest, '::');
          
          // Handle edge cases
          if (abbreviated.startsWith(':::')) abbreviated = abbreviated.substring(1);
          if (abbreviated.endsWith(':::')) abbreviated = abbreviated.slice(0, -1);
        }
        
        // Special case for all zeros
        if (abbreviated === '' || abbreviated === '::0') abbreviated = '::';
        
        return abbreviated;
      };
      
      const abbreviatedNetwork = abbreviateIPv6(networkAddress);

      // Calculate total addresses
      const hostBits = 128 - prefix;
      let totalAddresses: string;
      if (hostBits > 64) {
        totalAddresses = `2^${hostBits} (${(Math.pow(2, 64) * Math.pow(2, hostBits - 64)).toExponential(2)})`;
      } else if (hostBits > 32) {
        totalAddresses = `2^${hostBits} (${(Math.pow(2, hostBits)).toExponential(2)})`;
      } else {
        totalAddresses = Math.pow(2, hostBits).toLocaleString();
      }

      // Comprehensive IPv6 address type detection
      const firstSegment = paddedSegments[0] as string;
      const secondSegment = paddedSegments[1] as string;
      
      // RFC 4291 and related RFCs address classifications
      const isLoopback = fullyExpanded === '0000:0000:0000:0000:0000:0000:0000:0001';
      const isUnspecified = fullyExpanded === '0000:0000:0000:0000:0000:0000:0000:0000';
      const isLinkLocal = firstSegment === 'fe80';
      const isUniqueLocal = firstSegment.startsWith('fc') || firstSegment.startsWith('fd');
      const isMulticast = firstSegment.startsWith('ff');
      const is6to4 = firstSegment === '2002';
      const isTeredo = firstSegment === '2001' && secondSegment === '0000';
      const is6Bone = firstSegment === '3ffe'; // Historical
      const isDocumentation = firstSegment === '2001' && secondSegment === '0db8';
      
      // Global Unicast: 2000::/3 (starts with 2 or 3)
      const isGlobal = !isLoopback && !isUnspecified && !isLinkLocal && 
                      !isUniqueLocal && !isMulticast && !is6to4 && !isTeredo && 
                      !is6Bone && !isDocumentation && 
                      (firstSegment.charAt(0) === '2' || firstSegment.charAt(0) === '3');

      // Determine specific address type
      let addressCategory = 'Unknown';
      if (isUnspecified) addressCategory = 'Unspecified (::)';
      else if (isLoopback) addressCategory = 'Loopback (::1)';
      else if (isLinkLocal) addressCategory = 'Link-Local (fe80::/10)';
      else if (isUniqueLocal) addressCategory = 'Unique Local (fc00::/7)';
      else if (isMulticast) addressCategory = 'Multicast (ff00::/8)';
      else if (is6to4) addressCategory = '6to4 (2002::/16)';
      else if (isTeredo) addressCategory = 'Teredo (2001::/32)';
      else if (isDocumentation) addressCategory = 'Documentation (2001:db8::/32)';
      else if (isGlobal) addressCategory = 'Global Unicast (2000::/3)';
      else addressCategory = 'Reserved or Special Use';

      return {
        networkAddress: abbreviatedNetwork,
        prefixLength: prefix,
        totalAddresses,
        abbreviatedForm: abbreviateIPv6(cleanAddress),
        expandedForm: fullyExpanded,
        isLinkLocal,
        isUniqueLocal,
        isGlobal,
        isLoopback,
        isUnspecified,
        isMulticast,
        addressCategory
      };
    } catch (error) {
      return null;
    }
  };

  const ipv4Info = calculateIPv4Subnet();
  const ipv6Info = calculateIPv6Subnet();

  const resetIPv4 = () => {
    setIpv4Address("192.168.1.100");
    setSubnetMask("255.255.255.0");
    setCidr("24");
    setInputMethod("cidr");
    setIpClassFilter("any");
    setShowAllIPs(false);
  };

  const resetIPv6 = () => {
    setIpv6Address("2001:db8:85a3::8a2e:370:7334");
    setIpv6Prefix("64");
  };

  const copyIPv4Result = async () => {
    if (!ipv4Info) return;

    const text = `IPv4 Subnet Calculation Results:

IP Address: ${ipv4Address}
Subnet Mask: ${ipv4Info.subnetMask}
CIDR Notation: ${ipv4Info.cidrNotation}

Network Information:
Network Address: ${ipv4Info.networkAddress}
Broadcast Address: ${ipv4Info.broadcastAddress}
Wildcard Mask: ${ipv4Info.wildcardMask}

Host Information:
Total Hosts: ${formatNumber(ipv4Info.totalHosts)}
Usable Hosts: ${formatNumber(ipv4Info.usableHosts)}
First Usable IP: ${ipv4Info.firstUsableIP}
Last Usable IP: ${ipv4Info.lastUsableIP}

Classification:
IP Class: ${ipv4Info.ipClass}
Address Type: ${ipv4Info.addressType}
Private Network: ${ipv4Info.isPrivate ? 'Yes' : 'No'}

Binary Subnet Mask: ${ipv4Info.binarySubnetMask}

Address List:
${ipv4Info.allIPs.canShowAll ? 
  `All ${ipv4Info.allIPs.totalCount} addresses:\n${ipv4Info.allIPs.addresses.join(', ')}` : 
  `Large subnet: ${formatNumber(ipv4Info.allIPs.totalCount)} addresses (too many to list)`
}

Special Notes:
- /31 networks (RFC 3021): Point-to-point links, no network/broadcast addresses
- /32 networks: Host routes, single IP address
- Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyIPv6Result = async () => {
    if (!ipv6Info) return;

    const text = `IPv6 Subnet Calculation Results:

IPv6 Address: ${ipv6Address}
Prefix Length: /${ipv6Info.prefixLength}

Network Information:
Network Address: ${ipv6Info.networkAddress}/${ipv6Info.prefixLength}
Total Addresses: ${ipv6Info.totalAddresses}

Address Forms:
Abbreviated: ${ipv6Info.abbreviatedForm}
Expanded: ${ipv6Info.expandedForm}

Classification:
Address Type: ${ipv6Info.addressCategory}
Link-Local: ${ipv6Info.isLinkLocal ? 'Yes' : 'No'}
Unique Local: ${ipv6Info.isUniqueLocal ? 'Yes' : 'No'}
Global Unicast: ${ipv6Info.isGlobal ? 'Yes' : 'No'}
Multicast: ${ipv6Info.isMulticast ? 'Yes' : 'No'}
Loopback: ${ipv6Info.isLoopback ? 'Yes' : 'No'}

IPv6 Address Ranges:
- Loopback: ::1/128
- Link-Local: fe80::/10
- Unique Local: fc00::/7
- Global Unicast: 2000::/3
- Multicast: ff00::/8`;

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
          <Network className="size-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">IP Address & Subnet Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate IPv4 and IPv6 subnet information, network addresses, and host ranges
        </p>
      </div>

      <Tabs defaultValue="ipv4" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ipv4">IPv4 Subnetting</TabsTrigger>
          <TabsTrigger value="ipv6">IPv6 Subnetting</TabsTrigger>
        </TabsList>

        <TabsContent value="ipv4" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* IPv4 Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Router className="size-5" />
                  IPv4 Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ipv4">IP Address</Label>
                  <Input
                    id="ipv4"
                    value={ipv4Address}
                    onChange={(e) => setIpv4Address(e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Input Method</Label>
                  <Select value={inputMethod} onValueChange={(value: "mask" | "cidr") => setInputMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cidr">CIDR Notation (/24)</SelectItem>
                      <SelectItem value="mask">Subnet Mask (255.255.255.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>IP Class Suggestion</Label>
                  <Select value={ipClassFilter} onValueChange={(value) => {
                    setIpClassFilter(value);
                    generateSuggestedIPs(value);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Class (Manual Entry)</SelectItem>
                      <SelectItem value="A">Class A - Large Networks (16M hosts)</SelectItem>
                      <SelectItem value="B">Class B - Medium Networks (65K hosts)</SelectItem>
                      <SelectItem value="C">Class C - Small Networks (254 hosts)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Automatically sets common private IP ranges:</div>
                    <div>• Class A: 10.0.0.0/8 (Large enterprise networks)</div>
                    <div>• Class B: 172.16.0.0/12 (Medium enterprise networks)</div>
                    <div>• Class C: 192.168.0.0/24 (Home/small office networks)</div>
                  </div>
                </div>

                {inputMethod === "cidr" ? (
                  <div className="space-y-2">
                    <Label htmlFor="cidr">CIDR Prefix Length</Label>
                    <Input
                      id="cidr"
                      type="number"
                      min="0"
                      max="30"
                      value={cidr}
                      onChange={(e) => setCidr(e.target.value)}
                      placeholder="24"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="mask">Subnet Mask</Label>
                    <Input
                      id="mask"
                      value={subnetMask}
                      onChange={(e) => setSubnetMask(e.target.value)}
                      placeholder="255.255.255.0"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button onClick={resetIPv4} variant="outline" className="flex-1 cursor-pointer">
                    <RefreshCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                  <Button onClick={copyIPv4Result} variant="outline" disabled={!ipv4Info} className="cursor-pointer">
                    <Copy className="mr-2 size-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* IPv4 Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5" />
                  IPv4 Subnet Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ipv4Info ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Network Address</div>
                        <div className="font-mono">{ipv4Info.networkAddress}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Broadcast Address</div>
                        <div className="font-mono">{ipv4Info.broadcastAddress}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Subnet Mask</div>
                        <div className="font-mono">{ipv4Info.subnetMask}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Wildcard Mask</div>
                        <div className="font-mono">{ipv4Info.wildcardMask}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="size-4" />
                        Host Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Total Hosts</div>
                          <div>{formatNumber(ipv4Info.totalHosts)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Usable Hosts</div>
                          <div>{formatNumber(ipv4Info.usableHosts)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">First Usable IP</div>
                          <div className="font-mono">{ipv4Info.firstUsableIP}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Last Usable IP</div>
                          <div className="font-mono">{ipv4Info.lastUsableIP}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="size-4" />
                        Classification
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">IP Class</div>
                          <div>{ipv4Info.ipClass}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Address Type</div>
                          <div className={
                            ipv4Info.isPrivate ? 'text-green-600' : 
                            ipv4Info.addressType.includes('Reserved') || ipv4Info.addressType.includes('Loopback') ? 'text-blue-600' :
                            ipv4Info.addressType.includes('Multicast') ? 'text-purple-600' : 'text-orange-600'
                          }>
                            {ipv4Info.addressType}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="font-medium text-muted-foreground">CIDR Notation</div>
                          <div className="font-mono">{ipv4Info.cidrNotation}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="font-medium text-muted-foreground">Binary Subnet Mask</div>
                      <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                        {ipv4Info.binarySubnetMask}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <Users className="size-4" />
                          All IP Addresses
                        </h4>
                        {ipv4Info.allIPs.canShowAll && (
                          <Button 
                            onClick={() => setShowAllIPs(!showAllIPs)} 
                            variant="outline" 
                            size="sm"
                            className="cursor-pointer"
                          >
                            {showAllIPs ? "Hide" : "Show"} All ({ipv4Info.allIPs.totalCount})
                          </Button>
                        )}
                      </div>
                      
                      {!ipv4Info.allIPs.canShowAll ? (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded">
                          <strong>Large subnet detected:</strong> {formatNumber(ipv4Info.allIPs.totalCount)} addresses. 
                          Too many to display. Consider using network scanning tools for large subnets.
                        </div>
                      ) : showAllIPs ? (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Showing all {ipv4Info.allIPs.addresses.length} addresses in subnet:
                          </div>
                          <div className="max-h-40 overflow-y-auto bg-muted p-3 rounded">
                            <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                              {ipv4Info.allIPs.addresses.map((ip, index) => (
                                <div 
                                  key={index} 
                                  className={`p-1 rounded text-center ${
                                    ip === ipv4Info.networkAddress ? 'bg-blue-100 dark:bg-blue-900 font-bold' :
                                    ip === ipv4Info.broadcastAddress ? 'bg-red-100 dark:bg-red-900 font-bold' :
                                    ip === ipv4Info.firstUsableIP || ip === ipv4Info.lastUsableIP ? 'bg-green-100 dark:bg-green-900' :
                                    ip === ipv4Address ? 'bg-yellow-100 dark:bg-yellow-900 font-bold' :
                                    'hover:bg-background'
                                  }`}
                                  title={
                                    ip === ipv4Info.networkAddress ? 'Network Address' :
                                    ip === ipv4Info.broadcastAddress ? 'Broadcast Address' :
                                    ip === ipv4Info.firstUsableIP ? 'First Usable IP' :
                                    ip === ipv4Info.lastUsableIP ? 'Last Usable IP' :
                                    ip === ipv4Address ? 'Your Input IP' : 'Host Address'
                                  }
                                >
                                  {ip}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex flex-wrap gap-4">
                              <span>🔵 Network Address</span>
                              <span>🔴 Broadcast Address</span>
                              <span>🟢 First/Last Usable</span>
                              <span>🟡 Your Input IP</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Click "Show All" to display all {ipv4Info.allIPs.totalCount} IP addresses in this subnet
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <Network className="size-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Enter valid IP and subnet
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Provide a valid IPv4 address and subnet mask or CIDR
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ipv6" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* IPv6 Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Router className="size-5" />
                  IPv6 Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ipv6">IPv6 Address</Label>
                  <Input
                    id="ipv6"
                    value={ipv6Address}
                    onChange={(e) => setIpv6Address(e.target.value)}
                    placeholder="2001:db8:85a3::8a2e:370:7334"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipv6prefix">Prefix Length</Label>
                  <Input
                    id="ipv6prefix"
                    type="number"
                    min="0"
                    max="128"
                    value={ipv6Prefix}
                    onChange={(e) => setIpv6Prefix(e.target.value)}
                    placeholder="64"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={resetIPv6} variant="outline" className="flex-1 cursor-pointer">
                    <RefreshCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                  <Button onClick={copyIPv6Result} variant="outline" disabled={!ipv6Info} className="cursor-pointer">
                    <Copy className="mr-2 size-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* IPv6 Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5" />
                  IPv6 Subnet Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ipv6Info ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-muted-foreground">Network Address</div>
                        <div className="font-mono text-sm break-all">{ipv6Info.networkAddress}/{ipv6Info.prefixLength}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Total Addresses</div>
                        <div>{ipv6Info.totalAddresses}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Address Forms</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Abbreviated Form</div>
                          <div className="font-mono break-all bg-muted p-2 rounded">{ipv6Info.abbreviatedForm}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Expanded Form</div>
                          <div className="font-mono text-xs break-all bg-muted p-2 rounded">{ipv6Info.expandedForm}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="size-4" />
                        Address Classification
                      </h4>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-muted">
                          <div className="font-medium text-sm">{ipv6Info.addressCategory}</div>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Loopback:</span>
                            <span className={ipv6Info.isLoopback ? 'text-blue-600' : 'text-muted-foreground'}>
                              {ipv6Info.isLoopback ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Link-Local:</span>
                            <span className={ipv6Info.isLinkLocal ? 'text-yellow-600' : 'text-muted-foreground'}>
                              {ipv6Info.isLinkLocal ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Unique Local:</span>
                            <span className={ipv6Info.isUniqueLocal ? 'text-green-600' : 'text-muted-foreground'}>
                              {ipv6Info.isUniqueLocal ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Global Unicast:</span>
                            <span className={ipv6Info.isGlobal ? 'text-green-600' : 'text-muted-foreground'}>
                              {ipv6Info.isGlobal ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Multicast:</span>
                            <span className={ipv6Info.isMulticast ? 'text-purple-600' : 'text-muted-foreground'}>
                              {ipv6Info.isMulticast ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <Network className="size-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Enter valid IPv6 address
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Provide a valid IPv6 address and prefix length
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