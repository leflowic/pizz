import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PizzaConfigurator from "@/components/PizzaConfigurator";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Jelovnik", href: "/jelovnik", isRoute: true },
    { name: "O nama", href: "#about" },
    { name: "Galerija", href: "#gallery" },
    { name: "Kontakt", href: "#contact" },
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-white/10 py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center cursor-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/logo.png" 
            alt="La Tavernetta - Autentična Italijanska Pizza i Pasta Beograd"
            fetchPriority="high"
            className={cn(
              "transition-all duration-300",
              isScrolled ? "h-16 md:h-16" : "h-20 md:h-24"
            )}
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link key={link.name} href={link.href}>
                <button
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group cursor-none"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full skew-x-[-20deg]" />
                </button>
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group cursor-none"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full skew-x-[-20deg]" />
              </button>
            )
          ))}
          
          <PizzaConfigurator>
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest skew-x-[-10deg] rounded-none border-l-4 border-secondary cursor-none"
            >
              <span className="skew-x-[10deg]">Naruči Odmah</span>
            </Button>
          </PizzaConfigurator>
          
          {/* Admin Login Icon */}
          <Link href="/admin">
            <button
              className="text-white/40 hover:text-primary transition-colors p-2 group cursor-none"
              title="Admin"
            >
              <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="La Tavernetta" 
              className="h-15"
            />
          </div>
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link key={link.name} href={link.href}>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-left hover:text-primary w-full"
                >
                  {link.name}
                </button>
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-lg font-bold uppercase tracking-widest text-left hover:text-primary"
              >
                {link.name}
              </button>
            )
          ))}
          <PizzaConfigurator>
             <Button 
              className="w-full bg-primary hover:bg-primary/90 font-bold uppercase"
            >
              Naruči Odmah
            </Button>
          </PizzaConfigurator>
        </div>
      )}
    </nav>
  );
}
