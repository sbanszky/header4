"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Network, Layers, Info, BookOpen, Clock } from "lucide-react"

interface IPv6Field {
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
  isIPv6Layer?: boolean
}

const ipv6Fields: IPv6Field[] = [
  {
    name: "Version",
    bits: "4 bits",
    description: "IP version number",
    purpose: "Identifies the IP version being used. For IPv6, this value is always 6.",
    example: "0110 (binary) = 6 (decimal)",
  },
  {
    name: "Traffic Class",
    bits: "8 bits",
    description: "Quality of Service (QoS) marking",
    purpose:
      "Similar to the Type of Service field in IPv4. Used for packet prioritization and congestion control. First 6 bits are DSCP, last 2 bits are ECN.",
    example: "00000000 = Normal service, 10111000 = Expedited Forwarding",
  },
  {
    name: "Flow Label",
    bits: "20 bits",
    description: "Packet flow identification",
    purpose:
      "Identifies packets that belong to the same flow, allowing routers to process related packets together. Helps with quality of service and real-time data.",
    example: "0x12345 (20-bit value)",
  },
  {
    name: "Payload Length",
    bits: "16 bits",
    description: "Length of payload",
    purpose:
      "Specifies the length of the payload (data after the IPv6 header) in bytes. Does not include the header itself.",
    example: "1440 bytes for a typical payload",
  },
  {
    name: "Next Header",
    bits: "8 bits",
    description: "Next header type",
    purpose: "Identifies the type of header immediately following the IPv6 header (TCP=6, UDP=17, ICMPv6=58).",
    example: "6 = TCP, 17 = UDP, 58 = ICMPv6",
  },
  {
    name: "Hop Limit",
    bits: "8 bits",
    description: "Maximum hops allowed",
    purpose:
      "Prevents infinite routing loops by limiting packet lifetime. Decremented at each hop, similar to TTL in IPv4.",
    example: "64 hops (common default)",
  },
  {
    name: "Source Address",
    bits: "128 bits",
    description: "Sender's IPv6 address",
    purpose: "The IPv6 address of the device sending the packet. Four times larger than IPv4 addresses.",
    example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  },
  {
    name: "Destination Address",
    bits: "128 bits",
    description: "Receiver's IPv6 address",
    purpose: "The IPv6 address of the device that should receive the packet. Four times larger than IPv4 addresses.",
    example: "2001:4860:4860::8888 (Google's public DNS)",
  },
  {
    name: "Extension Headers",
    bits: "Variable",
    description: "Optional headers for special handling",
    purpose:
      "IPv6 uses extension headers instead of the options field in IPv4. These are placed between the IPv6 header and the upper-layer header. Common types include Hop-by-Hop Options, Routing, Fragment, Destination Options, Authentication, and Encapsulating Security Payload.",
    example: "Hop-by-Hop Options header (Next Header value = 0), Routing header (Next Header value = 43)",
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
    protocols: ["IPv6", "IPv4", "ICMPv6", "OSPF"],
    isIPv6Layer: true,
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

export default function IPv6OSIApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)
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
              <h1 className="text-2xl font-bold">IPv6 & OSI Model Explorer</h1>
            </div>
            <div className="flex-1 flex justify-center">
              <a
                href="https://subnetting.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-purple-600 font-semibold transition-colors"
              >
                subnetting.online
              </a>
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
            <TabsTrigger value="ipv6-header">IPv6 Header</TabsTrigger>
            <TabsTrigger value="osi-model">OSI Model</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* The Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6" />
                  <span>The Birth of IPv6: A Story of Evolution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-600">
                        1990s - The Need for a New Internet Protocol
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      By the early 1990s, the explosive growth of the internet made it clear that the 4.3 billion
                      addresses provided by IPv4 would eventually be exhausted. The Internet Engineering Task Force
                      (IETF) recognized this impending crisis and began work on a next-generation Internet Protocol that
                      would solve the address shortage and other limitations of IPv4.
                    </p>
                  </div>

                  <h3>The Problem: Preparing for Internet Growth</h3>
                  <p>
                    Imagine you're Steve Deering and Robert Hinden in 1994, tasked with designing the future of the
                    internet. You face several challenges:
                  </p>
                  <ul>
                    <li>
                      <strong>Address exhaustion:</strong> IPv4's 32-bit address space was rapidly running out
                    </li>
                    <li>
                      <strong>Routing table explosion:</strong> The growth of the internet was causing routing tables to
                      become unmanageably large
                    </li>
                    <li>
                      <strong>Configuration complexity:</strong> Manual configuration of network devices was becoming a
                      bottleneck
                    </li>
                    <li>
                      <strong>Security concerns:</strong> IPv4 was designed without built-in security
                    </li>
                  </ul>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">The "Aha!" Moment</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      The breakthrough came with the realization that they needed to{" "}
                      <strong>completely reimagine</strong> the Internet Protocol. Rather than just extending IPv4, they
                      would create a new protocol that would address all of its limitations while maintaining
                      compatibility with existing internet architecture. The most visible change would be expanding the
                      address space from 32 bits to 128 bits, providing an almost limitless number of unique addresses.
                    </p>
                  </div>

                  <h3>Designing the Perfect Header: Simplicity and Efficiency</h3>
                  <p>
                    The IPv6 header was designed with simplicity and efficiency in mind. Unlike IPv4's complex header
                    with many fields, IPv6 has a streamlined header with fewer fields:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                          The Addressing Revolution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How do you ensure we never run out of addresses again?
                        </p>
                        <p>
                          <strong>Solution:</strong> 128-bit addresses (Source & Destination IP) - enough for 340
                          undecillion unique addresses. That's 340 trillion trillion trillion addresses, or
                          approximately 667 quadrillion addresses per square millimeter of the Earth's surface!
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-600 dark:text-green-400">
                          The Extension Header Innovation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How do you maintain flexibility without complicating the base
                          header?
                        </p>
                        <p>
                          <strong>Solution:</strong> Extension headers - a modular approach that keeps the main header
                          simple while allowing for additional functionality through optional extension headers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-red-600 dark:text-red-400">
                          The Performance Enhancement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How do you make routing more efficient?
                        </p>
                        <p>
                          <strong>Solution:</strong> Simplified header format with fewer fields, aligned on 64-bit
                          boundaries for faster processing. Routers no longer need to recalculate checksums at each hop,
                          significantly improving performance.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 dark:border-purple-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-600 dark:text-purple-400">
                          The Flow Labeling Innovation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>
                          <strong>Problem:</strong> How do you handle real-time traffic more effectively?
                        </p>
                        <p>
                          <strong>Solution:</strong> Flow Label field - a new concept that allows routers to identify
                          packets belonging to the same "flow" or connection, enabling more efficient handling of
                          real-time applications like voice and video.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3>The Genius of Simplicity</h3>
                  <p>
                    What makes the IPv6 header brilliant is its elegant simplicity compared to IPv4. Consider these
                    design decisions:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Fixed header size:</strong> Unlike IPv4's variable-length header, IPv6 has a fixed
                        40-byte header, making processing more predictable and efficient.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>No header checksum:</strong> IPv6 eliminates the header checksum field, reducing
                        processing overhead since checksums are already handled at other layers.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>No fragmentation at routers:</strong> IPv6 requires hosts to perform Path MTU Discovery
                        to avoid fragmentation, improving network efficiency.
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Built-in extensibility:</strong> The Next Header field allows for a chain of extension
                        headers, providing flexibility without complicating the base header.
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800 mt-6">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                      The Legacy: The Future of Internet Addressing
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      Published as RFC 2460 in December 1998 and updated by RFC 8200 in July 2017, IPv6 represents the
                      future of internet addressing. While adoption has been slower than initially hoped, IPv6
                      deployment continues to grow worldwide. As of 2023, global IPv6 adoption has reached over 40%
                      according to Google statistics. The transition to IPv6 is inevitable as the internet continues to
                      grow, especially with the explosion of IoT devices that require unique IP addresses.
                    </p>
                  </div>

                  <h3>What's Next?</h3>
                  <p>
                    Now that you understand the story behind IPv6, let's explore the header structure in detail. Each
                    field you'll see was carefully designed to address the limitations of IPv4 while preparing the
                    internet for exponential growth. As you hover over each field in the interactive diagram, remember:
                    you're not just looking at bits and bytes - you're seeing the blueprint for the next generation of
                    the internet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IPv6 Header Tab */}
          <TabsContent value="ipv6-header" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-6 w-6" />
                  <span>IPv6 Header Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* IPv6 Header Visualization */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">IPv6 Packet Header</h3>
                        <p className="text-sm text-muted-foreground">Click on any field to learn more</p>
                        <div className="text-xs text-gray-500 mt-2">40 bytes fixed size</div>
                      </div>

                      {/* Simplified Header Visualization */}
                      <div className="space-y-2">
                        {/* Row 1: Version, Traffic Class, Flow Label */}
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
                            className="flex-none w-24 bg-green-200 dark:bg-green-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Traffic Class")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Traffic Class</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8b</div>
                            </div>
                          </div>
                          <div
                            className="flex-1 bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Flow Label")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Flow Label</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">20 bits</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Payload Length, Next Header, Hop Limit */}
                        <div className="flex h-12 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="flex-1 bg-purple-200 dark:bg-purple-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-purple-300 dark:hover:bg-purple-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Payload Length")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Payload Length</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">16 bits</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-24 bg-orange-200 dark:bg-orange-800 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-orange-300 dark:hover:bg-orange-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Next Header")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Next Header</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8b</div>
                            </div>
                          </div>
                          <div
                            className="flex-none w-24 bg-teal-200 dark:bg-teal-800 flex items-center justify-center cursor-pointer hover:bg-teal-300 dark:hover:bg-teal-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Hop Limit")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Hop Limit</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">8b</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 3-6: Source Address (128 bits) */}
                        <div className="flex h-16 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="w-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center cursor-pointer hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Source Address")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-sm font-semibold">Source Address</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                128 bits • Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 7-10: Destination Address (128 bits) */}
                        <div className="flex h-16 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <div
                            className="w-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center cursor-pointer hover:bg-violet-300 dark:hover:bg-violet-700 transition-colors"
                            onMouseEnter={() => setHoveredField("Destination Address")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-sm font-semibold">Destination Address</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                128 bits • Example: 2001:4860:4860::8888
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Extension Headers (Optional) */}
                        <div className="flex h-10 rounded-md overflow-hidden border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-75">
                          <div
                            className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            onMouseEnter={() => setHoveredField("Extension Headers")}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold">Extension Headers (Optional)</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Variable length • Hop-by-Hop, Routing, Fragment, etc.
                              </div>
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
                              <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                              <span>Flow Control</span>
                            </div>
                          </div>
                          <div className="text-xs">Total: 40 bytes fixed</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Explanations - Always Visible */}
                  <div className="lg:col-span-1">
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Field Explanations</h3>
                      {ipv6Fields.map((field) => (
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
                  <span>
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI Model
                    </a>{" "}
                    - 7 Layers
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    The Open Systems Interconnection (
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI model
                    </a>
                    ) is a conceptual framework that describes how network protocols interact and work together to
                    provide network services.
                  </p>

                  <div className="grid gap-2">
                    {osiLayers.map((layer) => (
                      <div
                        key={layer.number}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          layer.isIPv6Layer
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        } ${hoveredLayer === layer.number ? "scale-105 shadow-lg" : ""}`}
                        onMouseEnter={() => setHoveredLayer(layer.number)}
                        onMouseLeave={() => setHoveredLayer(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={layer.isIPv6Layer ? "default" : "secondary"} className="text-lg px-3 py-1">
                              {layer.number}
                            </Badge>
                            <div>
                              <h3 className="font-semibold text-lg">{layer.name}</h3>
                              <p className="text-sm text-muted-foreground">{layer.description}</p>
                            </div>
                          </div>
                          {layer.isIPv6Layer && (
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                              IPv6 Layer
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {layer.protocols.map((protocol) => (
                            <Badge
                              key={protocol}
                              variant="outline"
                              className={protocol === "IPv6" ? "bg-blue-100 dark:bg-blue-900 border-blue-300" : ""}
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
                  <span>
                    IPv6 Integration with{" "}
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI Model
                    </a>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>
                    How IPv6 Fits into the{" "}
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI Model
                    </a>
                  </h3>
                  <p>
                    IPv6 operates at <strong>Layer 3 (Network Layer)</strong> of the{" "}
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI model
                    </a>
                    . This layer is responsible for logical addressing, routing, and path determination across multiple
                    networks.
                  </p>

                  <h4>Key Functions of IPv6 at Layer 3:</h4>
                  <ul>
                    <li>
                      <strong>Logical Addressing:</strong> IPv6 provides unique 128-bit addresses to identify devices on
                      a network, a vast improvement over IPv4's 32-bit addresses
                    </li>
                    <li>
                      <strong>Routing:</strong> Determines the best path for data to travel from source to destination
                    </li>
                    <li>
                      <strong>Packet Forwarding:</strong> Forwards packets between different network segments
                    </li>
                    <li>
                      <strong>Flow Labeling:</strong> Identifies packets belonging to the same flow for more efficient
                      handling
                    </li>
                  </ul>

                  <h4>
                    Data Flow Through{" "}
                    <a
                      href="https://osimodel.subnetting.online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      OSI
                    </a>{" "}
                    Layers:
                  </h4>
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
                                  {layer.isIPv6Layer && (
                                    <span className="text-blue-600 dark:text-blue-400 ml-2">← IPv6 Header Added</span>
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
                                {layer.isIPv6Layer && (
                                  <span className="text-blue-600 dark:text-blue-400 ml-2">← IPv6 Header Processed</span>
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
                      IPv6 Header Processing at Layer 3
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">When Sending Data:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Layer 3 receives data from Layer 4 (Transport Layer)</li>
                          <li>IPv6 header is added with source and destination IPv6 addresses</li>
                          <li>Flow Label is set for packets belonging to the same flow</li>
                          <li>Hop Limit is set to prevent infinite loops</li>
                          <li>Next Header field identifies the type of the following header</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold">When Receiving Data:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>IPv6 header is examined for destination address</li>
                          <li>Hop Limit is decremented and checked</li>
                          <li>Flow Label is used to identify related packets</li>
                          <li>Extension headers are processed if present</li>
                          <li>Data is passed to Layer 4 based on Next Header field</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Key Takeaway</h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    IPv6 represents the future of internet addressing at Layer 3, providing the vastly expanded
                    addressing and improved routing mechanisms needed for the continued growth of the internet. With its
                    simplified header structure and advanced features like flow labeling, IPv6 is designed to support
                    the next generation of internet applications and devices.
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
