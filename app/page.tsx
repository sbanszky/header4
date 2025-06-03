"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Network, Layers, Info } from "lucide-react"

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
    purpose: "Specifies the length of the IP header in 32-bit words. Minimum value is 5 (20 bytes).",
    example: "0101 (binary) = 5 words = 20 bytes",
  },
  {
    name: "Type of Service",
    bits: "8 bits",
    description: "Quality of Service parameters",
    purpose: "Defines the priority and type of service for the packet. Used for QoS routing decisions.",
    example: "00000000 = Normal service",
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
    purpose: "Controls packet fragmentation: Reserved bit, Don't Fragment (DF), More Fragments (MF).",
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
    description: "Optional header fields",
    purpose: "Variable-length field for additional IP options like source routing or timestamps.",
    example: "Usually empty in most packets",
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
        <Tabs defaultValue="ipv4-header" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ipv4-header">IPv4 Header</TabsTrigger>
            <TabsTrigger value="osi-model">OSI Model</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

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
                <div className="space-y-6">
                  {/* IPv4 Header Visualization */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold">IPv4 Packet Header (20-60 bytes)</h3>
                      <p className="text-sm text-muted-foreground">Hover over each field for detailed information</p>
                    </div>

                    {/* Bit position indicators */}
                    <div className="grid grid-cols-32 gap-px mb-2 text-xs text-center">
                      {Array.from({ length: 32 }, (_, i) => (
                        <div key={i} className="text-gray-500">
                          {i % 8 === 0 ? i : ""}
                        </div>
                      ))}
                    </div>

                    {/* Header fields visualization */}
                    <div className="space-y-px">
                      {/* Row 1: Version, IHL, Type of Service, Total Length */}
                      <div className="grid grid-cols-32 gap-px">
                        {/* Version - 4 bits */}
                        <div
                          className="col-span-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Version")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Ver
                        </div>
                        {/* IHL - 4 bits */}
                        <div
                          className="col-span-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          onMouseEnter={() => setHoveredField("IHL")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          IHL
                        </div>
                        {/* Type of Service - 8 bits */}
                        <div
                          className="col-span-8 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Type of Service")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Type of Service
                        </div>
                        {/* Total Length - 16 bits */}
                        <div
                          className="col-span-16 bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Total Length")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Total Length
                        </div>
                      </div>

                      {/* Row 2: Identification, Flags, Fragment Offset */}
                      <div className="grid grid-cols-32 gap-px">
                        {/* Identification - 16 bits */}
                        <div
                          className="col-span-16 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Identification")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Identification
                        </div>
                        {/* Flags - 3 bits */}
                        <div
                          className="col-span-3 bg-indigo-100 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Flags")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Flags
                        </div>
                        {/* Fragment Offset - 13 bits */}
                        <div
                          className="col-span-13 bg-pink-100 dark:bg-pink-900 border border-pink-300 dark:border-pink-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Fragment Offset")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Fragment Offset
                        </div>
                      </div>

                      {/* Row 3: TTL, Protocol, Header Checksum */}
                      <div className="grid grid-cols-32 gap-px">
                        {/* TTL - 8 bits */}
                        <div
                          className="col-span-8 bg-teal-100 dark:bg-teal-900 border border-teal-300 dark:border-teal-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Time to Live")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          TTL
                        </div>
                        {/* Protocol - 8 bits */}
                        <div
                          className="col-span-8 bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Protocol")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Protocol
                        </div>
                        {/* Header Checksum - 16 bits */}
                        <div
                          className="col-span-16 bg-cyan-100 dark:bg-cyan-900 border border-cyan-300 dark:border-cyan-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Header Checksum")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Header Checksum
                        </div>
                      </div>

                      {/* Row 4: Source IP Address */}
                      <div className="grid grid-cols-32 gap-px">
                        <div
                          className="col-span-32 bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Source IP Address")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Source IP Address (32 bits)
                        </div>
                      </div>

                      {/* Row 5: Destination IP Address */}
                      <div className="grid grid-cols-32 gap-px">
                        <div
                          className="col-span-32 bg-violet-100 dark:bg-violet-900 border border-violet-300 dark:border-violet-700 p-2 text-center text-xs font-medium cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors"
                          onMouseEnter={() => setHoveredField("Destination IP Address")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Destination IP Address (32 bits)
                        </div>
                      </div>

                      {/* Row 6: Options */}
                      <div className="grid grid-cols-32 gap-px">
                        <div
                          className="col-span-32 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-center text-xs font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          onMouseEnter={() => setHoveredField("Options")}
                          onMouseLeave={() => setHoveredField(null)}
                        >
                          Options (0-40 bytes, variable length)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Details */}
                  {hoveredField && (
                    <Card className="border-2 border-blue-500">
                      <CardContent className="pt-6">
                        {(() => {
                          const field = ipv4Fields.find((f) => f.name === hoveredField)
                          return field ? (
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{field.bits}</Badge>
                                <h4 className="text-lg font-semibold">{field.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{field.description}</p>
                              <p>{field.purpose}</p>
                              {field.example && (
                                <div className="bg-muted p-3 rounded-md">
                                  <p className="text-sm">
                                    <strong>Example:</strong> {field.example}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : null
                        })()}
                      </CardContent>
                    </Card>
                  )}
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
