import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, CreditCard } from "lucide-react";
import { RingingPhone } from "@/components/CartoonIcons";
import PizzaConfigurator from "@/components/PizzaConfigurator";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function DeliverySection() {
  return (
    <section id="delivery" className="py-24 bg-primary text-white relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10 text-center">
        <ScrollFadeIn direction="up" delay={0.1} blur={true}>
          <div className="flex justify-center items-end gap-4 mb-6">
            <h2 className="text-5xl md:text-8xl font-display font-bold uppercase italic">
              Brza <span className="text-black">Dostava</span>
            </h2>
          </div>
        </ScrollFadeIn>
        
        <ScrollFadeIn direction="up" delay={0.2} blur={true}>
          <p className="text-xl md:text-2xl font-medium mb-8 max-w-2xl mx-auto">
            Vruće, sveže i brzo. Dostava dostupna svakog dana do 22:00.
          </p>
        </ScrollFadeIn>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <ScrollFadeIn direction="left" delay={0.3} blur={true}>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-lg backdrop-blur-sm min-w-[250px]">
              <Clock className="w-6 h-6 flex-shrink-0" />
              <div className="text-left">
                <div className="font-bold uppercase text-sm">Radno Vreme</div>
                <div className="text-sm">Pon-Čet: 09:00 – 00:00</div>
                <div className="text-sm">Pet-Sub: 09:00 – 01:00</div>
                <div className="text-sm">Nedelja: 12:00 – 00:00</div>
              </div>
            </div>
          </ScrollFadeIn>
          
          <ScrollFadeIn direction="up" delay={0.4} blur={true}>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-lg backdrop-blur-sm min-w-[250px] group">
              <div className="relative">
                 <RingingPhone className="w-8 h-8 flex-shrink-0 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold uppercase text-sm">Pozovi za Dostavu</div>
                <div className="text-lg font-display tracking-wider">011 240 5320</div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn direction="right" delay={0.5} blur={true}>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-lg backdrop-blur-sm min-w-[250px]">
              <CreditCard className="w-6 h-6 flex-shrink-0" />
              <div className="text-left">
                <div className="font-bold uppercase text-sm">Način Plaćanja</div>
                <div className="text-sm">Kartice i NFC plaćanje</div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>

        <ScrollFadeIn direction="up" delay={0.6} blur={true}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PizzaConfigurator>
              <Button 
                size="lg" 
                className="h-16 px-12 bg-black hover:bg-black/80 text-white text-xl font-bold uppercase tracking-widest rounded-none skew-x-[-10deg] border-r-4 border-secondary cursor-none"
              >
                <span className="skew-x-[10deg]">Naruči Online</span>
              </Button>
            </PizzaConfigurator>
            
            <a 
              href="tel:+381112405320"
              className="inline-flex items-center justify-center h-16 px-12 bg-white hover:bg-gray-100 text-black text-xl font-bold uppercase tracking-widest rounded-none skew-x-[-10deg] cursor-none transition-all"
            >
              <span className="skew-x-[10deg]">Rezerviši Sto</span>
            </a>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
