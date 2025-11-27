import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import Flame from "@/components/Flame";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem } from "@shared/schema";

const pizzaPlaceholder = "/logo.png";

const getCategoryTag = (category: string) => {
  switch (category) {
    case "pizza":
      return "Pizza";
    case "pasta":
      return "Pasta";
    case "salad":
      return "Salata";
    case "breakfast":
      return "Doručak";
    case "sandwich":
      return "Sendvič";
    case "main_course":
      return "Glavno Jelo";
    default:
      return "Specijalitet";
  }
};

export default function MenuSection() {
  const { data, isLoading } = useQuery<{ success: boolean; items: MenuItem[] }>({
    queryKey: ["/api/menu-items/featured"],
  });
  return (
    <section id="menu" className="py-24 bg-background relative overflow-hidden">
      {/* Background Grid Line */}
      <div className="absolute inset-0 opacity-5" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollFadeIn direction="up" delay={0.1} blur={true}>
          <div className="flex flex-col items-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase mb-2">Naša Ponuda</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white uppercase italic">
              Istaknute <span className="text-primary">Pizze</span>
            </h2>
            <p className="text-gray-400 text-lg mt-4 max-w-2xl text-center">
              Probajte naše najomiljenije pizze spremljene po originalnim italijanskim recepturama
            </p>
          </div>
        </ScrollFadeIn>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.items.map((item, index) => {
              const isPizza = item.category === "pizza";
              let displayPrice = "";
              
              if (isPizza) {
                if (item.price32 && item.price42) {
                  displayPrice = `${item.price32} / ${item.price42} RSD`;
                } else if (item.price32) {
                  displayPrice = `${item.price32} RSD (32cm)`;
                } else if (item.price42) {
                  displayPrice = `${item.price42} RSD (42cm)`;
                } else {
                  displayPrice = "Cena na upit";
                }
              } else {
                displayPrice = item.price ? `${item.price} RSD` : "Cena na upit";
              }
              
              const itemImage = item.imageUrl || pizzaPlaceholder;
              const isSpicy = item.name.toLowerCase().includes("diavola");

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-card/50 border-white/5 hover:border-primary/50 transition-all duration-300 overflow-hidden group h-full flex flex-col relative">
                    {isSpicy && (
                      <div className="absolute top-0 right-0 z-20 -mt-4 -mr-2 rotate-12 pointer-events-none">
                        <Flame className="w-12 h-16" />
                      </div>
                    )}
                    <div className="relative aspect-square overflow-hidden p-4 bg-white/5">
                      <img 
                        src={itemImage} 
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      />
                      <Badge className="absolute top-4 right-4 bg-secondary text-black font-bold uppercase rounded-none skew-x-[-10deg]">
                        {getCategoryTag(item.category)}
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow relative">
                      <div className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-l-[20px] border-t-primary border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <h3 className="text-2xl font-display font-bold text-white uppercase italic mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className="text-xl font-bold text-primary">{displayPrice}</span>
                        <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          +
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nema istaknutih proizvoda za prikaz</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/jelovnik">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest px-8 py-6 rounded-none skew-x-[-10deg] cursor-pointer group">
              <span className="skew-x-[10deg] flex items-center gap-2">
                Pogledaj Kompletan Jelovnik
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
