import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat, ArrowLeft, Pizza, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        
        // Save username if Remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        
        toast.success(data.message);
        
        setTimeout(() => {
          setLocation("/admin/dashboard");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Nije moguće povezati se sa serverom");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden cursor-none">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/5 transform rotate-12">
          <Pizza className="w-32 h-32" />
        </div>
        <div className="absolute bottom-20 right-10 text-secondary/5 transform -rotate-12">
          <Pizza className="w-40 h-40" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-primary/5">
          <Flame className="w-24 h-24" />
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-white/60 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazad
        </Button>
      </div>

      <Card className="w-full max-w-md bg-background/90 backdrop-blur-md border-white/10 shadow-2xl relative z-10 mx-4">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="La Tavernetta" 
              className="h-20 sm:h-24 md:h-28"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-display mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tim Tavernetta
            </CardTitle>
            <Badge variant="outline" className="border-primary/50 text-primary text-xs">
              Pristup za osoblje
            </Badge>
          </div>
          <CardDescription className="text-white/60 text-sm">
            Dobrodošli nazad, šefe! Unesite vaše pristupne podatke.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90 font-semibold flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Korisničko ime
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="vaše_korisničko_ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="bg-background/50 border-white/20 focus:border-primary transition-all h-11 cursor-text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 text-secondary" />
                Lozinka
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-background/50 border-white/20 focus:border-primary transition-all h-11 cursor-text"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="cursor-pointer"
              />
              <Label 
                htmlFor="remember" 
                className="text-sm text-white/70 cursor-pointer select-none"
              >
                Zapamti me
              </Label>
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold h-12 text-base shadow-lg hover:shadow-primary/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                {isLoading ? "Prijavljivanje..." : "Prijavi se"}
              </span>
            </Button>
          </form>
          
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/40">
              La Tavernetta Admin Panel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
