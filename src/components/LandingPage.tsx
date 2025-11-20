import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  QrCode,
  Shield,
  Zap,
  Globe,
  Check,
  ArrowRight,
  Code,
  Lock,
  Users,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import QRCode from "qrcode";

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
}

export function LandingPage({ onGetStarted, onViewPricing }: LandingPageProps) {
  const [demoText, setDemoText] = useState("");
  const [demoQR, setDemoQR] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (demoText.trim()) {
      generateDemoQR(demoText);
    } else {
      setDemoQR("");
    }
  }, [demoText]);

  const generateDemoQR = async (text: string) => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, text, {
          width: 200,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        const url = canvas.toDataURL();
        setDemoQR(url);
      }
    } catch (err) {
      console.error("Error generating QR:", err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Trusted by 50,000+ businesses worldwide
                </Badge>
                <h1 className="text-white">
                  Transform Text to QR Code in Seconds
                </h1>
                <p className="text-xl text-indigo-100">
                  Professional QR code generation with powerful API access. Generate unlimited QR codes 
                  for URLs, text, contact cards, and more. Secure, fast, and reliable.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={onGetStarted}
                    className="bg-white text-indigo-600 hover:bg-gray-100 gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onViewPricing}
                    className="border-white text-white hover:bg-white/10"
                  >
                    View Pricing
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-indigo-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>SSL Secured</span>
                  </div>
                </div>
              </div>

              {/* Right - Demo QR Generator */}
              <div>
                <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl">
                  <h3 className="text-gray-900 mb-4">Try it now - Free Demo</h3>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Enter text or URL to generate QR code..."
                        value={demoText}
                        onChange={(e) => setDemoText(e.target.value)}
                        className="text-base"
                      />
                    </div>
                    {demoQR ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                          <canvas ref={canvasRef} />
                        </div>
                        <p className="text-sm text-gray-600">
                          ✨ Your QR code is ready! Sign up to download and track analytics.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-400">
                          <QrCode className="w-12 h-12 mx-auto mb-2" />
                          <p>QR code will appear here</p>
                        </div>
                      </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Why Choose QR Generator Pro?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade QR code generation with advanced features and reliable API access
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate QR codes instantly with our optimized API. Average response time under 100ms.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Bank-level encryption. Your data is never stored or shared. GDPR compliant.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Developer API</h3>
              <p className="text-gray-600">
                RESTful API with comprehensive documentation. Integrate in minutes.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">
                Enterprise infrastructure with global CDN. Always available when you need it.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to generate professional QR codes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  1
                </div>
                <h3 className="text-gray-900 mb-3">Enter Your Content</h3>
                <p className="text-gray-600">
                  Input any text, URL, contact information, or data you want to encode
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  2
                </div>
                <h3 className="text-gray-900 mb-3">Generate QR Code</h3>
                <p className="text-gray-600">
                  Our system instantly creates a high-quality, scannable QR code
                </p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  3
                </div>
                <h3 className="text-gray-900 mb-3">Download & Use</h3>
                <p className="text-gray-600">
                  Download in multiple formats and track scans with built-in analytics
                </p>
              </div>
            </div>
          </div>

          {/* API Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <Card className="p-8 bg-gray-900 text-white">
              <div className="flex items-start gap-6">
                <div className="bg-indigo-600 p-4 rounded-lg">
                  <Code className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-3">Developer API Access</h3>
                  <p className="text-gray-300 mb-4">
                    Integrate QR code generation directly into your applications with our RESTful API
                  </p>
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="text-green-400">POST /api/generate</div>
                    <div className="text-gray-400 mt-2">{"{"}</div>
                    <div className="text-gray-400 ml-4">"text": "https://example.com",</div>
                    <div className="text-gray-400 ml-4">"format": "png",</div>
                    <div className="text-gray-400 ml-4">"size": 500</div>
                    <div className="text-gray-400">{"}"}</div>
                  </div>
                  <Button variant="outline" className="mt-4 border-white text-white hover:bg-white/10">
                    View API Documentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-gray-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-gray-900">$9</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">100 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">PNG downloads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              <Button onClick={onViewPricing} className="w-full">Subscribe Now</Button>
            </Card>

            {/* Professional Plan - Popular */}
            <Card className="p-8 border-2 border-indigo-600 relative hover:shadow-xl transition-shadow">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">
                Most Popular
              </Badge>
              <h3 className="text-gray-900 mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">500 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">PNG & SVG downloads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">API access (5,000 calls/mo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Priority support</span>
                </li>
              </ul>
              <Button onClick={onViewPricing} className="w-full">Subscribe Now</Button>
            </Card>

            {/* Business Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-gray-900 mb-2">Business</h3>
              <div className="mb-6">
                <span className="text-gray-900">$79</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">2,000 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">All formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Full analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited API calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">24/7 dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Custom branding</span>
                </li>
              </ul>
              <Button onClick={onViewPricing} className="w-full">Subscribe Now</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Trusted & Secure</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your security and privacy are our top priorities
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Payment Gateways */}
            <Card className="p-8 mb-8">
              <h3 className="text-center text-gray-900 mb-6">Secure Payment Methods</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-center">
                  <div className="bg-blue-50 p-4 rounded-lg mb-2">
                    <svg className="w-24 h-12" viewBox="0 0 124 33" fill="none">
                      <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                      <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                      <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/>
                      <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                      <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                      <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">PayPal</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-50 p-4 rounded-lg mb-2 flex items-center justify-center h-20">
                    <svg className="w-20 h-8" viewBox="0 0 60 25" fill="none">
                      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#6772E5"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Stripe</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-50 p-4 rounded-lg mb-2 flex items-center justify-center h-20">
                    <div className="text-blue-600 font-bold text-2xl">Razorpay</div>
                  </div>
                  <p className="text-xs text-gray-600">Razorpay</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 p-4 rounded-lg mb-2 flex items-center justify-center h-20">
                    <div className="text-green-700 font-bold text-2xl">PayU</div>
                  </div>
                  <p className="text-xs text-gray-600">PayU</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <Badge variant="secondary" className="gap-2">
                  <Lock className="w-4 h-4" />
                  256-bit SSL Encryption
                </Badge>
              </div>
            </Card>

            {/* Trust Badges */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <h3 className="text-gray-900 mb-2">GDPR Compliant</h3>
                <p className="text-sm text-gray-600">
                  Full compliance with EU data protection regulations
                </p>
              </Card>

              <Card className="p-6 text-center">
                <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="text-gray-900 mb-2">PCI DSS Certified</h3>
                <p className="text-sm text-gray-600">
                  Payment card industry data security standards certified
                </p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <h3 className="text-gray-900 mb-2">50,000+ Users</h3>
                <p className="text-sm text-gray-600">
                  Trusted by businesses and individuals worldwide
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-gray-900 mb-8">Join Our Community</h2>
            <div className="flex justify-center gap-6 mb-8">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-full hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-full hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-full hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-full hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users. Start generating QR codes today with our free plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-indigo-600 hover:bg-gray-100 gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-8 h-8 text-indigo-400" />
                <span className="text-white text-lg">QR Generator Pro</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Professional QR code generation service trusted by businesses worldwide.
              </p>
              <div className="flex gap-3">
                <a href="https://linkedin.com" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://twitter.com" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://facebook.com" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="/compliance" className="hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@qrgenpro.com" className="hover:text-white transition-colors">
                    support@qrgenpro.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Tech Street, San Francisco, CA 94105</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 QR Generator Pro. All rights reserved. | Payments secured by Stripe, PayPal, Razorpay & PayU</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
