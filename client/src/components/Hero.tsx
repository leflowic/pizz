import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PizzaConfigurator from "@/components/PizzaConfigurator";
import { useParallax } from "@/hooks/useParallax";
import { useSiteContent } from "@/hooks/useSiteContent";

const heroImage = "/generated_images/Dark_moody_pizza_hero_9b10e75f.png";

export default function Hero() {
  const parallaxOffset = useParallax(0.4);
  const siteContent = useSiteContent();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background z-10" />
        <img 
          src={heroImage} 
          alt="Autentična italijanska pizza sa svežim sastojcima - La Tavernetta Beograd"
          width="1920"
          height="1080"
          fetchPriority="high"
          className="w-full h-full object-cover scale-110"
          style={{ 
            transform: `translateY(${parallaxOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      </div>


      {/* Content */}
      <div className="container relative z-20 px-4 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
            <div className="h-[2px] w-12 bg-secondary" />
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-sm">Osnovano u Beogradu</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.85] italic tracking-tighter text-white mb-6 drop-shadow-2xl">
            {siteContent.hero_title}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8 font-sans font-light leading-relaxed">
            {siteContent.hero_subtitle}
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <PizzaConfigurator>
              <Button 
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white text-lg font-bold uppercase tracking-widest rounded-none skew-x-[-10deg] border-l-4 border-secondary shadow-[0_0_20px_rgba(220,20,60,0.5)] hover:shadow-[0_0_30px_rgba(220,20,60,0.8)] transition-all cursor-none"
              >
                <span className="skew-x-[10deg]">Naruči Dostavu</span>
              </Button>
            </PizzaConfigurator>
            
            <a 
              href="tel:+381112405320"
              className="inline-flex items-center justify-center h-14 px-8 border border-white/20 hover:bg-white/10 text-white text-lg font-bold uppercase tracking-widest rounded-none skew-x-[-10deg] backdrop-blur-sm cursor-none transition-all"
            >
              <span className="skew-x-[10deg]">Rezerviši Sto</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      
      <div className="absolute bottom-10 right-10 hidden md:flex gap-2 z-20">
        <div className="w-2 h-12 bg-primary skew-x-[-20deg]" />
        <div className="w-2 h-12 bg-white skew-x-[-20deg]" />
        <div className="w-2 h-12 bg-secondary skew-x-[-20deg]" />
      </div>
    </section>
  );
}
