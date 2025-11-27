import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pizza, UtensilsCrossed, Salad, Cookie, Wine, Phone, Search, ArrowLeft, Loader2, Coffee, Sandwich, Beef, Beer, GlassWater, AppleIcon, Utensils } from "lucide-react";
import { Link } from "wouter";
import type { MenuItem } from "@shared/schema";
import SEO from "@/components/SEO";
import { breadcrumbStructuredData, restaurantStructuredData } from "@/lib/structuredData";

const categories = [
  { id: "pizze", name: "Pizze", icon: Pizza, color: "bg-primary" },
  { id: "paste", name: "Paste", icon: UtensilsCrossed, color: "bg-secondary" },
  { id: "salate", name: "Salate", icon: Salad, color: "bg-primary" },
  { id: "sendvici", name: "Sendviči", icon: Sandwich, color: "bg-secondary" },
  { id: "jela", name: "Glavna Jela", icon: Beef, color: "bg-primary" },
  { id: "dodaci", name: "Prilozi", icon: Utensils, color: "bg-secondary" },
  { id: "dorucak", name: "Doručak", icon: Cookie, color: "bg-primary" },
  { id: "deserti", name: "Deserti", icon: Cookie, color: "bg-secondary" },
  { id: "kafa", name: "Topli Napici", icon: Coffee, color: "bg-primary" },
  { id: "sokovi", name: "Bezalkoholna", icon: GlassWater, color: "bg-secondary" },
  { id: "alkohol", name: "Alkohol", icon: Wine, color: "bg-primary" },
];

// Mapping database categories to UI categories
const categoryMapping: Record<string, string> = {
  "pizza": "pizze",
  "pasta": "paste",
  "salad": "salate",
  "appetizer": "dodaci",
  "side": "dodaci",
  "breakfast": "dorucak",
  "sandwich": "sendvici",
  "main_course": "jela",
  "dessert": "deserti",
  "coffee": "kafa",
  "juice": "sokovi",
  "alcohol": "alkohol"
};

const pizzaImages: Record<string, string> = {
  "Margarita": "/pizzas/margherita.png",
  "Capricciosa": "/pizzas/capricciosa.png",
  "Quattro Formaggi": "/pizzas/quattro-formaggi.png",
  "Diavola": "/pizzas/diavola.png",
  "Vesuvio": "/pizzas/margherita.png",
  "Funghi": "/pizzas/margherita.png",
  "Vegetariana": "/pizzas/margherita.png",
  "Tonno": "/pizzas/margherita.png",
  "Parmegiana": "/pizzas/margherita.png",
  "Quattro Stagioni": "/pizzas/margherita.png",
  "Paragina": "/pizzas/prosciutto.png",
  "Fuoco Nel Corpo": "/pizzas/diavola.png",
  "Caesar Pizza": "/pizzas/capricciosa.png",
  "Bergamo": "/pizzas/quattro-formaggi.png",
  "Pulled Pork": "/pizzas/margherita.png",
  "Siciliana": "/pizzas/diavola.png",
  "Calabrese": "/pizzas/diavola.png",
};

// Type for UI menu item
type UIMenuItem = {
  name: string;
  desc: string;
  price?: string;
  sizes?: Array<{ name: string; price: number }>;
  imageUrl?: string | null;
};

export default function Jelovnik() {
  const [activeCategory, setActiveCategory] = useState("pizze");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<Record<string, UIMenuItem[]>>({
    pizze: [],
    paste: [],
    salate: [],
    sendvici: [],
    jela: [],
    dodaci: [],
    dorucak: [],
    deserti: [],
    kafa: [],
    sokovi: [],
    alkohol: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu items from database on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/menu-items");
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || "Greška pri učitavanju podataka");
        }
        
        // Group items by category and map to UI format
        const grouped: Record<string, UIMenuItem[]> = {
          pizze: [],
          paste: [],
          salate: [],
          sendvici: [],
          jela: [],
          dodaci: [],
          dorucak: [],
          deserti: [],
          kafa: [],
          sokovi: [],
          alkohol: []
        };
        
        data.items.forEach((item: MenuItem) => {
          // Only show available items
          if (!item.available) return;
          
          // Map database fields to UI fields
          const uiItem: UIMenuItem = {
            name: item.name,
            desc: item.description,
            imageUrl: item.imageUrl
          };
          
          // Handle pricing - sizes or regular price
          // Try to parse sizes first (accept both string and array formats)
          let parsedSuccessfully = false;
          if (item.sizes) {
            let parsedSizes = null;
            
            // If already an array, use it directly
            if (Array.isArray(item.sizes)) {
              parsedSizes = item.sizes;
            }
            // If it's a string, try to parse it
            else if (typeof item.sizes === 'string' && item.sizes.trim() !== '') {
              try {
                parsedSizes = JSON.parse(item.sizes);
              } catch (e) {
                console.error('Error parsing sizes for item:', item.name, e);
              }
            }
            
            // Validate parsed result
            if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
              uiItem.sizes = parsedSizes;
              parsedSuccessfully = true;
            }
          }
          
          // Fallback to legacy pricing if sizes parsing failed
          if (!parsedSuccessfully) {
            if (item.price32 || item.price42) {
              // Legacy support: convert price32/price42 to sizes format
              const legacySizes = [];
              if (item.price32) legacySizes.push({ name: "32cm", price: item.price32 });
              if (item.price42) legacySizes.push({ name: "42cm", price: item.price42 });
              if (legacySizes.length > 0) {
                uiItem.sizes = legacySizes;
              }
            } else if (item.price) {
              // Regular single price
              uiItem.price = item.price.toString();
            }
          }
          
          // Add to appropriate category
          const uiCategory = categoryMapping[item.category];
          if (uiCategory && grouped[uiCategory]) {
            grouped[uiCategory].push(uiItem);
          }
        });
        
        setMenuItems(grouped);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err instanceof Error ? err.message : "Greška pri učitavanju jelovnika");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  const filteredItems = useMemo(() => {
    const items = menuItems[activeCategory as keyof typeof menuItems];
    if (!searchQuery.trim()) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery, menuItems]);

  // Breadcrumb structured data
  const breadcrumbData = breadcrumbStructuredData([
    { name: "Početna", url: "https://latavernetta.rs" },
    { name: "Jelovnik", url: "https://latavernetta.rs/jelovnik" }
  ]);

  // Combined structured data for menu page
  const menuPageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      restaurantStructuredData,
      breadcrumbData
    ]
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <SEO
        title="Jelovnik - Pizza, Pasta, Salate | La Tavernetta Beograd"
        description="Kompletan jelovnik La Tavernetta restorana: autentične italijanske pizze (32cm, 42cm, 50cm), paste, salate, deserti, pića. Pregledajte cene i naručite online. Dimitrija Tucovića 119."
        canonical="https://latavernetta.rs/jelovnik"
        keywords="jelovnik beograd, pizza cene, pasta cene, italijanski restoran meni, la tavernetta jelovnik, dostava pizza, online naručivanje"
        ogImage="https://latavernetta.rs/pizzas/margherita.png"
        structuredData={menuPageStructuredData}
      />
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/pizza-pattern.png)',
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Italian Flag Header */}
      <div className="h-3 flex relative z-10">
        <div className="flex-1 bg-secondary"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-primary"></div>
      </div>

      {/* Back to Home Button */}
      <Link href="/" className="fixed top-4 left-4 z-[60] flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/20 hover:scale-105 transition-all cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:inline">Nazad na Sajt</span>
      </Link>

      {/* Hero Section with Glassmorphism */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/generated_images/margherita_pizza_food_photography.png)',
          }}
        />
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/30" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="text-center"
          >
            <Link href="/" className="inline-block cursor-pointer">
              <img 
                src="/logo-jelovnik.png" 
                alt="La Tavernetta" 
                className="h-24 md:h-32 mx-auto mb-4 drop-shadow-2xl hover:scale-105 transition-transform"
              />
            </Link>
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-[2px] w-10 bg-secondary" />
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs">Osnovano u Beogradu</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase text-white mb-3 drop-shadow-2xl">
              Jelovnik
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide drop-shadow-lg">
              Autentična Italijanska Kuhinja
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs with Glow Effect */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-white/10 shadow-xl overflow-visible">
        <div className="container mx-auto px-4 py-12 overflow-visible">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-10 px-16 -mx-16">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap border-2 ${
                    isActive
                      ? `${category.color} text-white border-transparent`
                      : "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm tracking-wide uppercase">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Bar with Glassmorphism */}
      <div className="sticky top-[72px] z-40 backdrop-blur-xl bg-background/60 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretražite naš meni..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>


      {/* Menu Items with Premium Cards */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl relative z-10">
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-white/70 text-lg">Učitavanje jelovnika...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="text-center py-16"
          >
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
            >
              Pokušaj ponovo
            </button>
          </motion.div>
        )}

        {/* Menu Items */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    className="text-center py-16"
                  >
                    <p className="text-white/70 text-lg">
                      {searchQuery 
                        ? `Nema rezultata za "${searchQuery}"` 
                        : "Nema stavki u jelovniku"}
                    </p>
                  </motion.div>
                ) : (
                  filteredItems.map((item, index) => {
                    const hasSizes = item.sizes && item.sizes.length > 0;
                    // Use database imageUrl if available, otherwise fallback to pizzaImages
                    const itemImage = item.imageUrl || (hasSizes ? pizzaImages[item.name] : null);

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.05
                        }}
                        className="group bg-zinc-900/80 border-2 border-white/10 rounded-xl hover:border-primary/30 transition-all overflow-hidden"
                      >
                        <div className={`flex ${itemImage ? 'flex-col md:flex-row' : 'flex-row'} gap-4 md:gap-6`}>
                          {itemImage && (
                            <div className="md:w-48 md:h-48 w-full h-48 flex-shrink-0 overflow-hidden rounded-tl-2xl md:rounded-l-2xl md:rounded-tr-none rounded-tr-2xl">
                              <img
                                src={itemImage}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}
                        
                        <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 group-hover:text-primary transition-colors italic">
                              {item.name}
                            </h3>
                            <p className="text-white/70 text-sm md:text-base leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                          
                          <div className="flex md:flex-col gap-3 items-start md:items-end justify-start md:justify-center shrink-0">
                            {hasSizes ? (
                              <>
                                {item.sizes!.map((size, sizeIdx) => (
                                  <div key={sizeIdx} className="flex flex-col items-start md:items-end gap-1">
                                    <div className="text-xs text-white/50 font-semibold uppercase tracking-wider">{size.name}</div>
                                    <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-base">
                                      {size.price} RSD
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-lg whitespace-nowrap">
                                {item.price} RSD
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        )}
      </div>

      {/* Footer Contact with Glassmorphism */}
      <div className="backdrop-blur-xl bg-gray-900/50 border-t border-white/10 py-12 mt-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.a
            href="tel:0112405320"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-[0_0_50px_rgba(205,33,42,0.7),0_0_100px_rgba(205,33,42,0.4)] hover:shadow-[0_0_70px_rgba(205,33,42,0.9),0_0_140px_rgba(205,33,42,0.5)] transition-all cursor-pointer mb-6"
          >
            <Phone className="w-5 h-5" />
            <span>011 2405320</span>
          </motion.a>
          <p className="text-white/70 mt-6 text-lg">
            Dimitrija Tucovića 119, Belgrade, Serbia 11000
          </p>
        </div>
      </div>

      {/* Italian Flag Footer */}
      <div className="h-3 flex relative z-10">
        <div className="flex-1 bg-secondary"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-primary"></div>
      </div>
    </div>
  );
}
