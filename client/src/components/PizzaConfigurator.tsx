import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Pizza, Droplet, Milk, Beef, ShoppingCart, PhoneCall, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface PizzaConfiguratorProps {
  children?: React.ReactNode;
}

const doughOptions = [
  { id: "classic", name: "Klasično Testo", desc: "Standardno tanko testo", price: 0 },
  { id: "integral", name: "Integralno Testo", desc: "Integralno brašno, zdravije", price: 50 },
  { id: "stuffed", name: "Punjeni Rub", desc: "Rub punjen sirom", price: 150 },
];

const sauceOptions = [
  { id: "tomato", name: "Paradajz Sos", desc: "San Marzano Pelat", price: 0 },
  { id: "bbq", name: "BBQ Sos", desc: "Dimljeni BBQ Sos", price: 30 },
  { id: "cream", name: "Beli Sos", desc: "Pavlaka i Beli Luk", price: 30 },
];

const cheeseOptions = [
  { id: "mozzarella", name: "Mozzarella", price: 0 },
  { id: "gorgonzola", name: "Gorgonzola", price: 80 },
  { id: "parmesan", name: "Parmezan", price: 100 },
  { id: "vegan", name: "Veganski Sir", price: 50 },
];

const toppingOptions = [
  { id: "pepperoni", name: "Pepperoni", price: 120 },
  { id: "ham", name: "Šunka", price: 100 },
  { id: "mushrooms", name: "Pečurke", price: 60 },
  { id: "olives", name: "Masline", price: 50 },
  { id: "chili", name: "Ljute Feferone", price: 40 },
];

export default function PizzaConfigurator({ children }: PizzaConfiguratorProps) {
  const [step, setStep] = useState("dough");
  const [config, setConfig] = useState({
    dough: "classic",
    sauce: "tomato",
    cheese: "mozzarella",
    toppings: [] as string[],
  });
  const [isOrderingEnabled, setIsOrderingEnabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/settings/ordering-enabled")
      .then(res => res.json())
      .then(data => setIsOrderingEnabled(data.orderingEnabled))
      .catch(() => setIsOrderingEnabled(true));
  }, []);

  const calculateTotal = () => {
    let total = 950; // Base price
    const dough = doughOptions.find(c => c.id === config.dough);
    const sauce = sauceOptions.find(e => e.id === config.sauce);
    const cheese = cheeseOptions.find(f => f.id === config.cheese);
    
    if (dough) total += dough.price;
    if (sauce) total += sauce.price;
    if (cheese) total += cheese.price;
    
    config.toppings.forEach(s => {
      const topping = toppingOptions.find(opt => opt.id === s);
      if (topping) total += topping.price;
    });

    return total;
  };

  const handleToppingToggle = (id: string) => {
    setConfig(prev => {
      if (prev.toppings.includes(id)) {
        return { ...prev, toppings: prev.toppings.filter(s => s !== id) };
      } else {
        return { ...prev, toppings: [...prev.toppings, id] };
      }
    });
  };

  const nextStep = () => {
    if (step === "dough") setStep("sauce");
    else if (step === "sauce") setStep("cheese");
    else if (step === "cheese") setStep("toppings");
    else if (step === "toppings") setStep("review");
  };

  const handleOpenChange = (open: boolean) => {
    if (open && isOrderingEnabled === false) {
      toast.error(
        "Poručivanje trenutno nije dostupno",
        {
          description: "Pozovite nas na 011 2405320 da naručite.",
          action: {
            label: "Pozovi",
            onClick: () => window.location.href = "tel:+381112405320"
          },
          duration: 5000
        }
      );
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button className="bg-primary text-white skew-x-[-10deg]">Konfiguriši</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-zinc-950 text-white border-zinc-800 p-0 overflow-hidden flex flex-col h-[90vh] md:h-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Napravi svoju pizzu</DialogTitle>
          <DialogDescription>
            Izaberite testo, sos, sir i dodatke za vašu savršenu pizzu
          </DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="p-6 bg-carbon border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Pizza className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-display font-bold italic">Napravi svoju <span className="text-primary">Pizzu</span></h2>
          </div>
          <div className="text-xl font-bold font-mono bg-black px-4 py-2 rounded border border-white/10 text-secondary">
            {calculateTotal()} RSD
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Sidebar Steps */}
          <div className="w-full md:w-64 bg-zinc-900/50 border-r border-white/5 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {[
              { id: "dough", icon: Pizza, label: "Testo" },
              { id: "sauce", icon: Droplet, label: "Sos" },
              { id: "cheese", icon: Milk, label: "Sir" },
              { id: "toppings", icon: Beef, label: "Dodaci" },
              { id: "review", icon: ShoppingCart, label: "Pregled" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left whitespace-nowrap ${
                  step === s.id 
                    ? "bg-primary text-white font-bold shadow-[0_0_15px_rgba(220,20,60,0.4)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <s.icon className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-zinc-950 p-6 overflow-y-auto relative">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col relative z-10"
              >
                {step === "dough" && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-display text-white italic">Izaberi Testo</h3>
                    <RadioGroup value={config.dough} onValueChange={(v) => setConfig({...config, dough: v})} className="grid gap-4">
                      {doughOptions.map((opt) => (
                        <div key={opt.id}>
                          <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                          <Label
                            htmlFor={opt.id}
                            className="flex items-center justify-between p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                          >
                            <div>
                              <div className="text-lg font-bold uppercase">{opt.name}</div>
                              <div className="text-gray-400">{opt.desc}</div>
                            </div>
                            <div className="text-primary font-bold">
                              {opt.price > 0 ? `+${opt.price} RSD` : "STD"}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === "sauce" && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-display text-white italic">Izaberi Sos</h3>
                    <RadioGroup value={config.sauce} onValueChange={(v) => setConfig({...config, sauce: v})} className="grid gap-4">
                      {sauceOptions.map((opt) => (
                        <div key={opt.id}>
                          <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                          <Label
                            htmlFor={opt.id}
                            className="flex items-center justify-between p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                          >
                            <div>
                              <div className="text-lg font-bold uppercase">{opt.name}</div>
                              <div className="text-gray-400">{opt.desc}</div>
                            </div>
                            <div className="text-primary font-bold">
                              {opt.price > 0 ? `+${opt.price} RSD` : "STD"}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === "cheese" && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-display text-white italic">Izaberi Sir</h3>
                    <RadioGroup value={config.cheese} onValueChange={(v) => setConfig({...config, cheese: v})} className="grid gap-4">
                      {cheeseOptions.map((opt) => (
                        <div key={opt.id}>
                          <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                          <Label
                            htmlFor={opt.id}
                            className="flex items-center justify-between p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10"
                          >
                            <div className="text-lg font-bold uppercase">{opt.name}</div>
                            <div className="text-secondary font-bold">
                              {opt.price > 0 ? `+${opt.price} RSD` : "STD"}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === "toppings" && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-display text-white italic">Dodaj Dodatke</h3>
                    <div className="grid gap-4">
                      {toppingOptions.map((opt) => (
                        <div key={opt.id}>
                          <Checkbox 
                            id={opt.id} 
                            className="peer sr-only" 
                            checked={config.toppings.includes(opt.id)}
                            onCheckedChange={() => handleToppingToggle(opt.id)}
                          />
                          <Label
                            htmlFor={opt.id}
                            className={`flex items-center justify-between p-6 rounded-lg border bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all ${
                              config.toppings.includes(opt.id)
                                ? "border-primary bg-primary/10"
                                : "border-zinc-800"
                            }`}
                          >
                            <div className="text-lg font-bold uppercase">{opt.name}</div>
                            <div className="text-primary font-bold">+{opt.price} RSD</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === "review" && (
                  <div className="space-y-6 h-full flex flex-col">
                    <h3 className="text-3xl font-display text-white italic">Pregled Narudžbine</h3>
                    <Card className="bg-zinc-900 border-zinc-800 p-6 flex-grow space-y-4">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Testo</span>
                        <span className="font-bold">{doughOptions.find(c => c.id === config.dough)?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Sos</span>
                        <span className="font-bold">{sauceOptions.find(c => c.id === config.sauce)?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Sir</span>
                        <span className="font-bold">{cheeseOptions.find(c => c.id === config.cheese)?.name}</span>
                      </div>
                      {config.toppings.length > 0 && (
                        <div className="border-b border-white/10 pb-2">
                          <span className="text-gray-400 block mb-1">Dodaci</span>
                          <div className="flex flex-wrap gap-2">
                            {config.toppings.map(s => (
                              <span key={s} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary/20 uppercase font-bold">
                                {toppingOptions.find(opt => opt.id === s)?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 mt-auto">
                         <div className="flex justify-between items-center mb-4">
                           <span className="text-xl uppercase font-bold">Ukupno Vreme (Cena)</span>
                           <span className="text-3xl font-display text-primary italic">{calculateTotal()} RSD</span>
                         </div>
                         <Button className="w-full h-14 text-xl font-bold uppercase bg-green-600 hover:bg-green-700 skew-x-[-5deg]">
                           Potvrdi Narudžbinu
                         </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-white/10 bg-zinc-900 flex justify-between">
          <Button 
            variant="outline" 
            disabled={step === "dough"}
            onClick={() => {
              const steps = ["dough", "sauce", "cheese", "toppings", "review"];
              const idx = steps.indexOf(step);
              if (idx > 0) setStep(steps[idx - 1]);
            }}
            className="border-white/20 hover:bg-white/10"
          >
            Nazad
          </Button>
          
          {step !== "review" && (
            <Button 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 w-32"
            >
              Sledeće
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
