import { useCallback, useEffect, useState, useRef } from "react";
import { QRGenerator } from "./components/QRGenerator";
import { PricingSection } from "./components/PricingSection";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { History } from "./components/History";
import { Admin } from "./components/Admin";
import { LandingPage } from "./components/LandingPage";
import { Checkout } from "./components/Checkout";
import { QrCode, LayoutDashboard, Home, DollarSign, LogIn, LogOut, History as HistoryIcon, Shield } from "lucide-react";
import { Button } from "./components/ui/button";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";

export type PlanType = "free" | "starter" | "professional" | "business" | "enterprise";

export interface User {
  id?: string;
  name: string;
  email: string;
  plan: PlanType;
  conversionsUsed: number;
  isAdmin?: boolean;
}

export interface ConversionRecord {
  id: string;
  text: string;
  qrCodeUrl: string;
  timestamp: string;
  type: "url" | "text";
}

type ViewType = "home" | "dashboard" | "pricing" | "login" | "signup" | "history" | "admin" | "landing" | "checkout";

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  plan: PlanType | null;
  conversions_used: number | null;
  role: string | null;
};

type ConversionRow = {
  id: string | number;
  text: string;
  qr_code_url: string | null;
  created_at: string;
  type: "url" | "text" | null;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [conversions, setConversions] = useState(0);
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const mapProfileToUser = useCallback((sessionUser: SupabaseAuthUser, profile?: ProfileRow | null): User => {
    const defaultName = sessionUser.user_metadata?.full_name ?? sessionUser.email ?? "QR User";
    return {
      id: sessionUser.id,
      name: profile?.name ?? defaultName,
      email: sessionUser.email ?? profile?.email ?? "",
      plan: (profile?.plan as PlanType) ?? "free",
      conversionsUsed: profile?.conversions_used ?? 0,
      isAdmin: profile?.role === "admin",
    };
  }, []);

  const ensureProfile = useCallback(async (sessionUser: SupabaseAuthUser) => {
    const selectColumns = "id, name, email, plan, conversions_used, role";
    const { data, error } = await supabase
      .from("users_custom")
      .select(selectColumns)
      .eq("id", sessionUser.id)
      .single();

    if (error) {
      const isNoRows = error.code === "PGRST116" || error.message?.toLowerCase().includes("no rows");
      if (!isNoRows) {
        throw error;
      }

      // Note: The trigger on auth.users should normally handle creation, 
      // but we keep this as a fallback or for immediate consistency if the trigger is slow/fails.
      // However, with the new schema, we might want to rely on the trigger or insert with api_key generation if we do it here.
      // For now, let's try to fetch again after a short delay or insert if we are sure.
      // Since we have a trigger, let's just wait a moment or return a default structure.
      // Actually, let's try to insert if it's missing, but we need to generate api_keys if we do it client side? 
      // No, better to let the database handle it. 
      // But if we MUST insert:
      const { data: inserted, error: insertError } = await supabase
        .from("users_custom")
        .insert({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.full_name ?? sessionUser.email,
          plan: "free",
          conversions_used: 0,
          role: sessionUser.user_metadata?.role === "admin" ? "admin" : "user",
        })
        .select(selectColumns)
        .single();

      if (insertError) {
        // If insert fails (e.g. trigger already did it), try select again
        const { data: retryData, error: retryError } = await supabase
          .from("users_custom")
          .select(selectColumns)
          .eq("id", sessionUser.id)
          .single();

        if (retryError) throw retryError;
        return retryData as ProfileRow;
      }

      return inserted as ProfileRow;
    }

    return data as ProfileRow;
  }, []);

  const fetchConversionHistory = useCallback(async (profileId: string) => {
    setHistoryLoading(true);
    setHistoryError(null);

    const { data, error } = await supabase
      .from("conversion_history")
      .select("id, text, qr_code_url, created_at, type")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading conversion history", error);
      setHistoryError("Unable to load conversion history right now.");
      setHistoryLoading(false);
      return;
    }

    const parsed = (data as ConversionRow[]).map(record => ({
      id: record.id.toString(),
      text: record.text,
      qrCodeUrl: record.qr_code_url ?? "",
      timestamp: record.created_at,
      type: (record.type as "url" | "text") ?? (record.text.match(/^https?:\/\//) ? "url" : "text"),
    }));

    setConversionHistory(parsed);
    setHistoryLoading(false);
  }, []);

  // Track current view to avoid unnecessary re-subscriptions
  const currentViewRef = useRef(currentView);
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to fetch session", error);
        setAuthLoading(false);
        return;
      }

      if (data.session?.user) {
        try {
          const profile = await ensureProfile(data.session.user);
          if (!isMounted) return;
          const mappedUser = mapProfileToUser(data.session.user, profile);
          setUser(mappedUser);
          if (mappedUser.id) {
            fetchConversionHistory(mappedUser.id);
          }
        } catch (profileError) {
          console.error("Failed to load profile", profileError);
        } finally {
          if (isMounted) {
            setAuthLoading(false);
          }
        }
      } else {
        setUser(null);
        setConversionHistory([]);
        setAuthLoading(false);
      }
    };

    loadSession();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      if (session?.user) {
        console.log("User authenticated, fetching profile...");
        ensureProfile(session.user).then((profile) => {
          if (!isMounted) return;
          console.log("Profile fetched:", profile);
          const mappedUser = mapProfileToUser(session.user, profile);
          setUser(mappedUser);

          // Use ref to get current value without re-subscribing
          const view = currentViewRef.current;
          // Only redirect if we're on an auth page or landing page
          if (
            view === "login" ||
            view === "signup" ||
            view === "landing"
          ) {
            if (mappedUser.isAdmin) {
              setCurrentView("admin");
            } else {
              setCurrentView("dashboard");
            }
          }
        }).catch(err => {
          console.error("Error fetching profile:", err);
        });
      } else {
        console.log("User signed out or no session.");
        setUser(null);
        setConversionHistory([]);

        // Use ref to get current value without re-subscribing
        const view = currentViewRef.current;
        // Only redirect if we're on a protected page
        if (
          view === "dashboard" ||
          view === "history" ||
          view === "admin"
        ) {
          setCurrentView("landing");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [ensureProfile, fetchConversionHistory, mapProfileToUser]);

  useEffect(() => {
    if (user) {
      setCurrentView(prev => {
        if (prev === "login" || prev === "signup" || prev === "landing") {
          return user.isAdmin ? "admin" : "dashboard";
        }
        return prev;
      });
    } else {
      setCurrentView(prev => {
        if (prev === "dashboard" || prev === "history" || prev === "admin") {
          return "landing";
        }
        return prev;
      });
    }
  }, [user]);

  const handleLogout = async () => {
    // Optimistic update: Clear state immediately
    setUser(null);
    setCurrentView("landing");
    setConversions(0);
    setConversionHistory([]);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleConversion = useCallback(
    async (text: string, qrCodeUrl: string) => {
      setConversions(prev => prev + 1);
      const recordType: "url" | "text" = text.match(/^https?:\/\//) ? "url" : "text";
      const fallbackRecord: ConversionRecord = {
        id: Date.now().toString(),
        text,
        qrCodeUrl,
        timestamp: new Date().toISOString(),
        type: recordType,
      };

      if (!user?.id) {
        setConversionHistory(prev => [fallbackRecord, ...prev]);
        return;
      }

      const { data, error } = await supabase
        .from("conversion_history")
        .insert({
          user_id: user.id,
          text,
          qr_code_url: qrCodeUrl,
          type: recordType,
        })
        .select("id, text, qr_code_url, created_at, type")
        .single();

      if (error) {
        console.error("Failed to save conversion", error);
        setConversionHistory(prev => [fallbackRecord, ...prev]);
        return;
      }

      const newRecord: ConversionRecord = {
        id: data.id.toString(),
        text: data.text,
        qrCodeUrl: data.qr_code_url ?? qrCodeUrl,
        timestamp: data.created_at,
        type: (data.type as "url" | "text") ?? recordType,
      };

      setConversionHistory(prev => [newRecord, ...prev]);

      const nextCount = (user.conversionsUsed ?? 0) + 1;
      setUser(prev => (prev ? { ...prev, conversionsUsed: nextCount } : prev));
      await supabase.from("users_custom").update({ conversions_used: nextCount }).eq("id", user.id);
    },
    [user]
  );

  const handleDeleteConversion = useCallback(
    async (id: string) => {
      setConversionHistory(prev => prev.filter(c => c.id !== id));
      if (!user?.id) return;

      const { error } = await supabase.from("conversion_history").delete().eq("id", id).eq("user_id", user.id);
      if (error) {
        console.error("Failed to delete conversion", error);
        // Optional: refetch to stay consistent
        fetchConversionHistory(user.id);
      }
    },
    [fetchConversionHistory, user]
  );

  // Show login/signup pages without header
  if (currentView === "login") {
    return <Login onSwitchToSignup={() => setCurrentView("signup")} />;
  }

  if (currentView === "signup") {
    return <Signup onSwitchToLogin={() => setCurrentView("login")} />;
  }

  // Show landing page without app header
  if (currentView === "landing") {
    return (
      <LandingPage
        onGetStarted={() => (user ? setCurrentView("home") : setCurrentView("signup"))}
        onViewPricing={() => setCurrentView("pricing")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-indigo-600" />
              <h1 className="text-indigo-600">QR Generator Pro</h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === "landing" ? "default" : "ghost"}
                onClick={() => setCurrentView("landing")}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button
                variant={currentView === "home" ? "default" : "ghost"}
                onClick={() => (user ? setCurrentView("home") : setCurrentView("login"))}
                className="gap-2"
              >
                <QrCode className="w-4 h-4" />
                Generator
              </Button>
              {user && (
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  onClick={() => setCurrentView("dashboard")}
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              )}
              {user && (
                <Button
                  variant={currentView === "history" ? "default" : "ghost"}
                  onClick={() => setCurrentView("history")}
                  className="gap-2"
                >
                  <HistoryIcon className="w-4 h-4" />
                  History
                </Button>
              )}
              {user?.isAdmin && (
                <Button
                  variant={currentView === "admin" ? "default" : "ghost"}
                  onClick={() => setCurrentView("admin")}
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              )}
              <Button
                variant={currentView === "pricing" ? "default" : "ghost"}
                onClick={() => setCurrentView("pricing")}
                className="gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Pricing
              </Button>

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.plan} Plan</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setCurrentView("login")} className="gap-2 ml-4">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === "home" && (
        <>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 text-center">
            <h2 className="mb-4 text-indigo-900">
              Generate QR Codes Instantly
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform any text, URL, or data into a professional QR code in seconds.
              Perfect for businesses, events, and personal use.
            </p>
          </section>

          {/* QR Generator Section */}
          <section className="container mx-auto px-4 pb-16">
            <QRGenerator
              onConversion={handleConversion}
              conversionsUsed={user ? user.conversionsUsed : conversions}
              isLoggedIn={!!user}
              conversionHistory={conversionHistory}
              userPlan={user?.plan}
            />
          </section>
        </>
      )}

      {currentView === "dashboard" && user && (
        <section className="container mx-auto px-4 py-8">
          <Dashboard
            user={user}
            setUser={setUser}
            onUpgrade={() => setCurrentView("pricing")}
          />
        </section>
      )}

      {currentView === "history" && user && (
        <section className="container mx-auto px-4 py-8 space-y-4">
          {historyError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {historyError}
            </div>
          )}
          {historyLoading ? (
            <div className="p-8 text-center text-gray-600">Loading history...</div>
          ) : (
            <History
              conversions={conversionHistory}
              onDeleteConversion={handleDeleteConversion}
            />
          )}
        </section>
      )}

      {currentView === "admin" && user?.isAdmin && (
        <section className="container mx-auto px-4 py-8">
          <Admin currentUser={user} />
        </section>
      )}

      {currentView === "pricing" && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">
              Simple, Usage-Based Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pay only for what you use. Our pricing scales with your conversion needs.
            </p>
          </div>
          <PricingSection
            currentPlan={user?.plan}
            onPlanSelect={(plan) => {
              if (user) {
                setSelectedPlan(plan);
                setCurrentView("checkout");
              } else {
                setCurrentView("signup");
              }
            }}
          />
        </section>
      )}

      {currentView === "checkout" && user && selectedPlan && (
        <Checkout
          selectedPlan={selectedPlan}
          onBack={() => setCurrentView("pricing")}
          onComplete={() => {
            // Update user plan in database here
            setUser({ ...user, plan: selectedPlan });
            setCurrentView("dashboard");
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 QR Generator Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}