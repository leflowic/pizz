import { Button } from "@/components/ui/button";
import { Home, Phone, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full relative cursor-none overflow-hidden">
      {/* Premium Background with Food Photography */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/generated_images/hero-pizza.png')`,
        }}
      >
        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-black/80" />
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          {/* Glass Morphism Panel */}
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-12 md:p-16 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="La Tavernetta" className="h-16 md:h-20 opacity-90" />
            </div>

            {/* 404 Number - Stately Typography */}
            <h1 className="text-8xl md:text-9xl font-serif font-bold text-center mb-6 bg-gradient-to-b from-primary via-primary to-red-800 bg-clip-text text-transparent">
              404
            </h1>

            {/* Heading with Gold Accent */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-4">
              Stranica nije pronađena
            </h2>

            {/* Hospitality-focused Copy */}
            <p className="text-gray-300 text-center mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Izgleda da se ova stranica izgubila kao pizza bez prave adrese. 
              Dozvolite nam da Vas vratimo na pravi put.
            </p>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="/">
                <Button className="bg-primary hover:bg-primary/90 text-white cursor-pointer font-semibold px-8 py-6 text-lg w-full sm:w-auto group transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                  <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Početna
                </Button>
              </a>
              <a href="tel:0112405320">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white cursor-pointer font-semibold px-8 py-6 text-lg w-full sm:w-auto backdrop-blur">
                  <Phone className="w-5 h-5 mr-2" />
                  Pozovite nas
                </Button>
              </a>
            </div>

            {/* Quick Contact Info */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-gray-400 text-center text-sm mb-3">Ili nas kontaktirajte direktno:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-300">
                <a href="tel:0112405320" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  011 2405320
                </a>
                <span className="hidden sm:block text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Dimitrija Tucovića 119
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Italian Flag Accent - Top */}
      <div className="absolute top-0 left-0 right-0 h-1 flex opacity-60">
        <div className="flex-1 bg-secondary"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-primary"></div>
      </div>
    </div>
  );
}
