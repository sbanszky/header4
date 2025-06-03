"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Network, Layers, Info, BookOpen, Clock } from "lucide-react"

interface IPv4Field {
  name: string
  bits: string
  description: string
  purpose: string
  example?: string
}

interface OSILayer {
  number: number
  name: string
  description: string
  protocols: string[]
  isIPv4Layer?: boolean
}

const ipv4Fields: IPv4Field[] = [
  {
    name: "Version",
    bits: "4 bits",
    description: "IP version number",
    purpose: "Identifies the IP version being used. For IPv4, this value is always 4.",
    example: "0100 (binary) = 4 (decimal)",
  },
  {
    name: "IHL",
    bits: "4 bits",
    description: "Internet Header Length",
    purpose:
      "Specifies the length of the IP header in 32-bit words (4-byte units). Minimum value is 5 (20 bytes) for a header with no options. Maximum is 15 (60 bytes).",
    example: "5 = 20 bytes (no options), 8 = 32 bytes (12 bytes of options)",
  },
  {
    name: "Type of Service",
    bits: "8 bits",
    description: "Type of Service (DSCP + ECN)",
    purpose:
      "Defines how the packet should be handled in terms of priority, delay, throughput, and reliability. First 6 bits are DSCP, last 2 bits are ECN.",
    example: "00000000 = Normal service, 10111000 = Expedited Forwarding",
  },
  {
    name: "Total Length",
    bits: "16 bits",
    description: "Total packet length",
    purpose: "Specifies the total length of the IP packet (header + data) in bytes. Maximum is 65,535 bytes.",
    example: "1500 bytes for standard Ethernet frame",
  },
  {
    name: "Identification",
    bits: "16 bits",
    description: "Unique packet identifier",
    purpose: "Uniquely identifies fragments of an original IP packet. All fragments have the same ID.",
    example: "12345 (decimal)",
  },
  {
    name: "Flags",
    bits: "3 bits",
    description: "Control fragmentation",
    purpose: "Controls packet fragmentation: Reserved bit (must be 0), Don't Fragment (DF), More Fragments (MF).",
    example: "010 = Don't Fragment set",
  },
  {
    name: "Fragment Offset",
    bits: "13 bits",
    description: "Fragment position",
    purpose: "Indicates where this fragment belongs in the original packet, measured in 8-byte units.",
    example: "0 for first fragment",
  },
  {
    name: "Time to Live",
    bits: "8 bits",
    description: "Maximum hops allowed",
    purpose: "Prevents infinite routing loops by limiting packet lifetime. Decremented at each hop.",
    example: "64 hops (common default)",
  },
  {
    name: "Protocol",
    bits: "8 bits",
    description: "Next layer protocol",
    purpose: "Identifies the protocol used in the data portion (TCP=6, UDP=17, ICMP=1).",
    example: "6 = TCP, 17 = UDP",
  },
  {
    name: "Header Checksum",
    bits: "16 bits",
    description: "Error detection",
    purpose: "Provides error detection for the header only. Recalculated at each hop due to TTL changes.",
    example: "Calculated using one's complement",
  },
  {
    name: "Source IP Address",
    bits: "32 bits",
    description: "Sender's IP address",
    purpose: "The IP address of the device sending the packet.",
    example: "192.168.1.100",
  },
  {
    name: "Destination IP Address",
    bits: "32 bits",
    description: "Receiver's IP address",
    purpose: "The IP address of the device that should receive the packet.",
    example: "8.8.8.8",
  },
  {
    name: "Options",
    bits: "0-40 bytes",
    description: "Optional header fields with padding",
    purpose:
      "Variable-length field for additional IP options like source routing, timestamps, or security. Must be padded to ensure the header length is a multiple of 32 bits.",
    example: "Usually empty in most packets. When present, often includes padding to align to 32-bit boundary.",
  },
]

const osiLayers: OSILayer[] = [
  {
    number: 7,
    name: "Application Layer",
    description: "Network services to applications",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS"],
  },
  {
    number: 6,
    name: "Presentation Layer",
    description: "Data translation, encryption, compression",
    protocols: ["SSL/TLS", "JPEG", "GIF", "ASCII"],
  },
  {
    number: 5,
    name: "Session Layer",
    description: "Establishes, manages, terminates connections",
    protocols: ["NetBIOS", "RPC", "SQL"],
  },
  {
    number: 4,
    name: "Transport Layer",
    description: "Reliable data transfer, error recovery",
    protocols: ["TCP", "UDP", "SCTP"],
  },
  {
    number: 3,
    name: "Network Layer",
    description: "Routing, logical addressing",
    protocols: ["IPv4", "IPv6", "ICMP", "OSPF"],
    isIPv4Layer: true,
  },
  {
    number: 2,
    name: "Data Link Layer",
    description: "Node-to-node delivery, error detection",
    protocols: ["Ethernet", "Wi-Fi", "PPP"],
  },
  {
    number: 1,
    name: "Physical Layer",
    description: "Physical transmission of raw bits",
    protocols: ["Cable", "Fiber", "Radio waves"],
  },
]

export default function IPv4OSIApp() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">IPv4 & OSI Model Explorer</h1>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme} className="ml-auto">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="story" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="story">The Story</TabsTrigger>
            <TabsTrigger value="ipv4-header">IPv4 Header</TabsTrigger>
            <TabsTrigger value="osi-model">OSI Model</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* The Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6" />
                  <span>The Birth of IPv4: A Story of Innovation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-600">1970s - The Dawn of Internetworking</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      In the early 1970s, computer networks were isolated islands. ARPANET connected a few universities,
                      but there was no way for different networks to communicate with each other. The challenge was
                      immense: how do you create a universal addressing system that could work across any type of
                      network?
                    </p>
                  </div>

                  <h3>The Problem: Connecting the Unconnectable</h3>
                  <p>
                    Imagine you're Vint Cerf and Bob Kahn in 1973, tasked with solving an impossible puzzle. You have:
                  </p>
                  <ul>
                    <li>
                      <strong>Different network technologies:</strong> Ethernet, radio networks, satellite links
                    </li>
                    <li>
                      <strong>Varying packet sizes:</strong> Some networks could handle large packets, others couldn't
                    </li>
                    <li>
                      <strong>Unreliable connections:</strong> Packets could get lost, duplicated, or arrive out of
                      order
                    </li>
                    <li>
                      <strong>No central authority:</strong> No single entity could control all networks
                    </li>
                  </ul>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">The "Aha!" Moment</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      The breakthrough came with the realization that they needed a <strong>universal envelope</strong>{" "}
                      - a standardized header that could carry any type of data across any type of network. This
                      envelope would contain all the information needed to route data from any point A to any point B on
                      the planet.
                    </p>
                  </div>

                  <h3>Designing the Perfect Header: Every Bit Counts</h3>
                  <p>
                    The IPv4 header wasn't designed in a day. Each field was carefully crafted to solve specific
                    problems:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                          The Addressing Challenge
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How do you uniquely identify every computer on Earth?
                        </p>
                        <p>
                          <strong>Solution:</strong> 32-bit addresses (Source & Destination IP) - enough for 4.3 billion
                          unique addresses. In 1981, this seemed infinite!
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-600 dark:text-green-400">
                          The Fragmentation Dilemma
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> Different networks had different maximum packet sizes.
                        </p>
                        <p>
                          <strong>Solution:</strong> Identification, Flags, and Fragment Offset fields - allowing large
                          packets to be split and reassembled seamlessly.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-red-600 dark:text-red-400">
                          The Loop Prevention Problem
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> What if packets get stuck in routing loops forever?
                        </p>
                        <p>
                          <strong>Solution:</strong> Time to Live (TTL) field - each router decrements this value, and
                          when it reaches zero, the packet is discarded.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 dark:border-purple-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-600 dark:text-purple-400">
                          The Protocol Multiplexing Need
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How does the receiving computer know what type of data is inside?
                        </p>
                        <p>
                          <strong>Solution:</strong> Protocol field - a simple number that identifies whether the
                          payload is TCP, UDP, ICMP, or something else.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3>The Genius of Simplicity</h3>
                  <p>
                    What makes the IPv4 header brilliant isn't its complexity - it's its elegant simplicity. Consider
                    these design decisions:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Fixed 32-bit alignment:</strong> Every row in the header is exactly 32 bits wide, making
                        it easy for computers to process efficiently.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Variable header length:</strong> The IHL field allows for optional fields while keeping
                        most headers compact at just 20 bytes.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Future-proofing:</strong> The Version field allows for future IP versions (like IPv6)
                        while maintaining backward compatibility.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Error detection:</strong> The Header Checksum ensures that routing information isn't
                        corrupted during transmission.
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800 mt-6">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                      The Legacy: 50+ Years and Counting
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      Published as RFC 791 in September 1981, the IPv4 header design has remained virtually unchanged
                      for over 40 years. It has successfully routed trillions of packets across billions of devices,
                      enabling the global internet as we know it today. The fact that a protocol designed when the
                      entire internet had fewer than 1,000 computers still powers our modern world of smartphones, IoT
                      devices, and cloud computing is a testament to the brilliance of its original design.
                    </p>
                  </div>

                  <h3>What's Next?</h3>
                  <p>
                    Now that you understand the story behind IPv4, let's explore the header structure in detail. Each
                    field you'll see was carefully designed to solve real problems that the internet's pioneers faced.
                    As you hover over each field in the interactive diagram, remember: you're not just looking at bits
                    and bytes - you're seeing the DNA of the modern internet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IPv4 Header Tab */}
          <TabsContent value="ipv4-header" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-6 w-6" />
                  <span>IPv4 Header Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* IPv4 Header Visualization */}
                  {/* IPv4 Header Visualization - Simplified */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">IPv4 Packet Header</h3>
                        <p className="text-sm text-muted-foreground">Click on any field to learn more</p>
                        <div className="text-xs text-gray-500 mt-2">20 bytes minimum • 60 bytes maximum</div>
                      </div>

                      {/* Simplified Header Visualization */}
                      <div className="space-y-2">
                        {/* Row 1: Version, IHL, ToS, Total Length */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="flex-none w-16 bg-blue-200 dark:bg-blue-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Version")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Ver</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">4b</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-16 bg-green-200 dark:bg-green-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
                            onMouseEnter={() => setHoveredField("IHL")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">IHL</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">4b</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-24 bg-yellow-200 dark:bg-yellow-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Type of Service")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Type of Service</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8 bits</div>
                            </div>
                          </div>
                          <div
                            className="flex-1 bg-purple-200 dark:bg-purple-800 flex items-center justify-center cursor-pointer hover:bg-purple-300 dark:hover:bg-purple-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Total Length")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Total Length</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">16 bits</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Identification, Flags, Fragment Offset */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="flex-1 bg-red-200 dark:bg-red-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Identification")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Identification</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">16 bits</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-20 bg-indigo-200 dark:bg-indigo-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-indigo-300 dark:hover:bg-indigo-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Flags")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Flags</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">3b</div>
                            </div>
                          </div>
                          <div
                            className="flex-1 bg-pink-200 dark:bg-pink-800 flex items-center justify-center cursor-pointer hover:bg-pink-300 dark:hover:bg-pink-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Fragment Offset")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Fragment Offset</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">13 bits</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: TTL, Protocol, Header Checksum */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="flex-none w-24 bg-teal-200 dark:bg-teal-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-teal-300 dark:hover:bg-teal-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Time to Live")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">TTL</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8 bits</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-24 bg-orange-200 dark:bg-orange-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-orange-300 dark:hover:bg-orange-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Protocol")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Protocol</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8 bits</div>
                            </div>
                          </div>
                          <div
                            className="flex-1 bg-cyan-200 dark:bg-cyan-800 flex items-center justify-center cursor-pointer hover:bg-cyan-300 dark:hover:bg-cyan-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Header Checksum")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Header Checksum</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">16 bits</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Source IP Address */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="w-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center cursor-pointer hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Source IP Address")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-sm font-semibold">Source IP Address</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                32 bits • Example: 192.168.1.100
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 5: Destination IP Address */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="w-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center cursor-pointer hover:bg-violet-300 dark:hover:bg-violet-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Destination IP Address")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-sm font-semibold">Destination IP Address</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">32 bits • Example: 8.8.8.8</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 6: Options (Optional) */}
                        <div className="flex h-10 rounded-md overflow-hidden border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-75">
                          <div
                            className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            onMouseEnter={() => setHoveredField("Options")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Options + Padding (Optional)</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">0-40 bytes • Rarely used</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Legend */}
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
                              <span>Control Fields</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                              <span>Addressing</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
                              <span>Fragmentation</span>
                            </div>
                          </div>
                          <div className="text-xs">Total: 20-60 bytes</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Explanations - Always Visible */}
                  <div className="lg:col-span-1">
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Field Explanations</h3>
                      {ipv4Fields.map((field) => (
                        <Card
                          key={field.name}
                          className={`transition-all duration-200 ${
                            hoveredField === field.name
                              ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg scale-105"
                              : "border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {field.bits}
                                </Badge>
                                <h4 className="font-semibold text-sm">{field.name}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground">{field.description}</p>
                              <p className="text-xs">{field.purpose}</p>
                              {field.example && (
                                <div className="bg-muted p-2 rounded-md">
                                  <p className="text-xs">
                                    <strong>Example:</strong> {field.example}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OSI Model Tab */}
          <TabsContent value="osi-model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-6 w-6" />
                  <span>OSI Model - 7 Layers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    The Open Systems Interconnection (OSI) model is a conceptual framework that describes how network
                    protocols interact and work together to provide network services.
                  </p>

                  <div className="grid gap-2">
                    {osiLayers.map((layer) => (
                      <div
                        key={layer.number}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          layer.isIPv4Layer
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        } ${hoveredLayer === layer.number ? "scale-105 shadow-lg" : ""}`}
                        onMouseEnter={() => setHoveredLayer(layer.number)}
                        onMouseLeave={() => setHoveredLayer(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={layer.isIPv4Layer ? "default" : "secondary"} className="text-lg px-3 py-1">
                              {layer.number}
                            </Badge>
                            <div>
                              <h3 className="font-semibold text-lg">{layer.name}</h3>
                              <p className="text-sm text-muted-foreground">{layer.description}</p>
                            </div>
                          </div>
                          {layer.isIPv4Layer && (
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                              IPv4 Layer
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {layer.protocols.map((protocol) => (
                            <Badge
                              key={protocol}
                              variant="outline"
                              className={protocol === "IPv4" ? "bg-blue-100 dark:bg-blue-900 border-blue-300" : ""}
                            >
                              {protocol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-6 w-6" />
                  <span>IPv4 Integration with OSI Model</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>How IPv4 Fits into the OSI Model</h3>
                  <p>
                    IPv4 operates at <strong>Layer 3 (Network Layer)</strong> of the OSI model. This layer is
                    responsible for logical addressing, routing, and path determination across multiple networks.
                  </p>

                  <h4>Key Functions of IPv4 at Layer 3:</h4>
                  <ul>
                    <li>
                      <strong>Logical Addressing:</strong> IPv4 provides unique 32-bit addresses to identify devices on
                      a network
                    </li>
                    <li>
                      <strong>Routing:</strong> Determines the best path for data to travel from source to destination
                    </li>
                    <li>
                      <strong>Packet Forwarding:</strong> Forwards packets between different network segments
                    </li>
                    <li>
                      <strong>Fragmentation:</strong> Breaks large packets into smaller fragments when necessary
                    </li>
                  </ul>

                  <h4>Data Flow Through OSI Layers:</h4>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <div className="space-y-3">
                    <div className="text-center font-semibold mb-4">Data Transmission Process</div>

                    {/* Sending Process */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">Sending (Top to Bottom)</h4>
                        <div className="space-y-2">
                          {osiLayers
                            .slice()
                            .reverse()
                            .map((layer, index) => (
                              <div key={layer.number} className="flex items-center space-x-2">
                                <Badge variant="outline" className="w-8 text-center">
                                  {layer.number}
                                </Badge>
                                <div className="text-sm">
                                  <span className="font-medium">{layer.name}</span>
                                  {layer.isIPv4Layer && (
                                    <span className="text-blue-600 dark:text-blue-400 ml-2">← IPv4 Header Added</span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Receiving (Bottom to Top)</h4>
                        <div className="space-y-2">
                          {osiLayers.map((layer, index) => (
                            <div key={layer.number} className="flex items-center space-x-2">
                              <Badge variant="outline" className="w-8 text-center">
                                {layer.number}
                              </Badge>
                              <div className="text-sm">
                                <span className="font-medium">{layer.name}</span>
                                {layer.isIPv4Layer && (
                                  <span className="text-blue-600 dark:text-blue-400 ml-2">← IPv4 Header Processed</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400">
                      IPv4 Header Processing at Layer 3
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">When Sending Data:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Layer 3 receives data from Layer 4 (Transport Layer)</li>
                          <li>IPv4 header is added with source and destination IP addresses</li>
                          <li>Routing decisions are made based on destination IP</li>
                          <li>TTL is set to prevent infinite loops</li>
                          <li>Fragmentation occurs if packet exceeds MTU</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold">When Receiving Data:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>IPv4 header is examined for destination IP</li>
                          <li>TTL is decremented and checked</li>
                          <li>Header checksum is verified</li>
                          <li>Fragments are reassembled if necessary</li>
                          <li>Data is passed to Layer 4 based on Protocol field</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Key Takeaway</h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    IPv4 is the backbone of internet communication at Layer 3, providing the addressing and routing
                    mechanisms that allow data to travel across complex networks from source to destination. Every field
                    in the IPv4 header serves a specific purpose in this process.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
