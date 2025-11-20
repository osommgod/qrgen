import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Download, Copy, Check, Upload, Eye, EyeOff, Code } from "lucide-react";
import QRCode from "qrcode";
import jsQR from "jsqr";

interface QRGeneratorProps {
  onConversion: (text: string, qrCodeUrl: string) => void;
  conversionsUsed: number;
  isLoggedIn: boolean;
  conversionHistory: Array<{ text: string; qrCodeUrl: string }>;
  userPlan?: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
}

export function QRGenerator({ onConversion, conversionsUsed, isLoggedIn, conversionHistory, userPlan }: QRGeneratorProps) {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [decodedText, setDecodedText] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showBearerToken, setShowBearerToken] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock API credentials
  const apiKey = "qr_ZmJyc3RAdXNlci5jb20";
  const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
  const apiEndpoint = "https://fqcajytfzytdqpkodjvf.supabase.co/functions/v1/generate-qr";

  const generateQRCode = async (value: string) => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, value, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        const url = canvas.toDataURL();
        setQrCodeUrl(url);
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  // Define plan limits
  const planLimits: Record<string, number> = {
    free: 10,
    starter: 100,
    professional: 500,
    business: 2000,
    enterprise: 999999,
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    // Calculate conversion limit: plan limit + 2 extra conversions
    const basePlanLimit = userPlan ? planLimits[userPlan] : 10; // Default to free plan
    const CONVERSION_LIMIT = basePlanLimit + 2;

    if (conversionsUsed >= CONVERSION_LIMIT) {
      alert(`You have reached the maximum limit of ${CONVERSION_LIMIT} QR code conversions (${basePlanLimit} from your ${userPlan || 'free'} plan + 2 bonus). Please upgrade your plan to continue.`);
      return;
    }

    // Check if this text already exists in conversion history
    const isDuplicate = conversionHistory.some(conv => conv.text === text.trim());

    setGenerating(true);
    try {
      // Ensure canvas is ready by waiting for next tick
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
      await generateQRCode(text);

      // Only track conversion if it's not a duplicate
      if (!isDuplicate) {
        onConversion(text, "");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = qrCodeUrl;
      link.click();
      // Removed onConversion call from here
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopied(true);
            // Removed onConversion call from here
            setTimeout(() => setCopied(false), 2000);
          }
        });
      }
    } catch (err) {
      console.error("Error copying image:", err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDecoding(true);
    setDecodedText("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setDecodedText(code.data);
        } else {
          setDecodedText("No QR code found in image");
        }
        setDecoding(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopyText = async (textToCopy: string, field: string) => {
    await navigator.clipboard.writeText(textToCopy);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const curlExample = `curl -X POST ${apiEndpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${bearerToken}" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "X-Bearer-Token: your_bearer_token" \\
  -d '{
    "text": "https://example.com/invoice/123"
  }'`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="decode">Decode QR</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate">
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="qr-text" className="block mb-2 text-gray-700">
                    Enter Text or URL
                  </label>
                  <Textarea
                    id="qr-text"
                    placeholder="https://example.com or any text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={!text.trim() || generating || conversionsUsed >= (userPlan ? planLimits[userPlan] : 10) + 2}
                  className="w-full cursor-pointer"
                >
                  {generating ? "Generating..." : conversionsUsed >= (userPlan ? planLimits[userPlan] : 10) + 2 ? "Limit Reached" : "Generate QR Code"}
                </Button>
                <div className="text-sm text-gray-500">
                  {isLoggedIn ? "Total conversions" : "Conversions today"}: <span className={conversionsUsed >= (userPlan ? planLimits[userPlan] : 10) + 2 ? "text-red-600 font-semibold" : "text-indigo-600"}>{conversionsUsed}/{(userPlan ? planLimits[userPlan] : 10) + 2}</span>
                </div>
                {conversionsUsed >= (userPlan ? planLimits[userPlan] : 10) + 2 && (
                  <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                    ⚠️ You've reached your limit of {(userPlan ? planLimits[userPlan] : 10) + 2} conversions ({userPlan ? planLimits[userPlan] : 10} from your {userPlan || 'free'} plan + 2 bonus). Upgrade to continue generating QR codes!
                  </div>
                )}
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full"
                    style={{ display: qrCodeUrl ? 'block' : 'none' }}
                  />
                  {!qrCodeUrl && (
                    <div className="flex items-center justify-center w-[300px] h-[300px]">
                      <p className="text-gray-400">QR code will appear here</p>
                    </div>
                  )}
                </div>
                {qrCodeUrl && (
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 gap-2"
                      variant="default"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      onClick={handleCopyImage}
                      className="flex-1 gap-2"
                      variant="outline"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Decode Tab */}
        <TabsContent value="decode">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Decode QR Code to Text</h3>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload a QR code image to decode</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={decoding}
                >
                  {decoding ? "Decoding..." : "Choose Image"}
                </Button>
              </div>

              {decodedText && (
                <div className="space-y-2">
                  <label className="block text-gray-700">Decoded Text:</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-900 break-all">{decodedText}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(decodedText, "decoded")}
                    className="gap-2"
                  >
                    {copiedField === "decoded" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Beta</Badge>
                  <h3 className="text-gray-900">Developer API Access</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Authenticate each request with your API key and Bearer token using the{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">X-API-Key</code> and{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">X-Bearer-Token</code> headers.
                  The JSON payload only accepts a textfield. Rotate/Reset your Bearer token anytime.
                </p>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">API Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm">
                    {apiKey}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(apiKey, "apiKey")}
                  >
                    {copiedField === "apiKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Bearer Token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-700">Bearer Token</label>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Reset token
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm">
                    {showBearerToken ? bearerToken : "••••••••••••••••••••••••••••"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBearerToken(!showBearerToken)}
                  >
                    {showBearerToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(bearerToken, "bearer")}
                  >
                    {copiedField === "bearer" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Required Headers */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Required Headers</label>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-100 overflow-x-auto">
                  <div className="text-green-400">Authorization: Bearer {showBearerToken ? bearerToken : "your_bearer_token"}</div>
                  <div className="text-blue-400">X-API-Key: {apiKey}</div>
                  <div className="text-purple-400">X-Bearer-Token: your_bearer_token</div>
                </div>
              </div>

              {/* Endpoint */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Endpoint</label>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="shrink-0">POST</Badge>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm overflow-x-auto">
                    {apiEndpoint}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(apiEndpoint, "endpoint")}
                  >
                    {copiedField === "endpoint" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Body (JSON) */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Body (JSON)</label>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-100">
                  <div className="text-gray-400">{"{"}</div>
                  <div className="ml-4">
                    <span className="text-blue-400">"text"</span>
                    <span className="text-gray-400">: </span>
                    <span className="text-green-400">"https://example.com/invoice/123"</span>
                  </div>
                  <div className="text-gray-400">{"}"}</div>
                </div>
              </div>

              {/* cURL Example */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">cURL Example</label>
                <div className="relative">
                  <div className="bg-gray-900 p-4 rounded-lg font-mono text-xs text-gray-100 overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all">{curlExample}</pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyText(curlExample, "curl")}
                  >
                    {copiedField === "curl" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Response */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Successful Response</label>
                <p className="text-xs text-gray-600 mb-2">
                  Successful responses include status, message, and a qrCodeUrl data URL that you can embed anywhere.
                </p>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-100">
                  <div className="text-gray-400">{"{"}</div>
                  <div className="ml-4">
                    <div>
                      <span className="text-blue-400">"status"</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">"success"</span>
                      <span className="text-gray-400">,</span>
                    </div>
                    <div>
                      <span className="text-blue-400">"message"</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">"QR code generated successfully"</span>
                      <span className="text-gray-400">,</span>
                    </div>
                    <div>
                      <span className="text-blue-400">"qrCodeUrl"</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">"data:image/png;base64,iVBORw0KG..."</span>
                    </div>
                  </div>
                  <div className="text-gray-400">{"}"}</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
