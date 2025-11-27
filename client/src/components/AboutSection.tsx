import { motion } from "framer-motion";
import Flame from "@/components/Flame";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { useSiteContent } from "@/hooks/useSiteContent";

const interiorImage = "/attached_assets/Blizi se neka nova nadamo se bolja godina❤️_1763921243080.webp";

export default function AboutSection() {
  const siteContent = useSiteContent();
  return (
    <section id="about" className="py-24 bg-zinc-900 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-primary z-10" />
            <div className="relative z-0 overflow-hidden skew-x-[-3deg] border-r-4 border-secondary aspect-[4/3]">
              <img 
                src={interiorImage} 
                alt="La Tavernetta - Novogodišnja atmosfera"
                loading="lazy"
                width="1200"
                height="900"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-primary z-10" />
          </motion.div>

          {/* Text Side */}
          <div className="space-y-6">
            <ScrollFadeIn direction="right" delay={0.1} blur={true}>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase italic text-white leading-none">
                Vođeni <br />
                <span className="text-primary">Strašću</span>
              </h2>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="right" delay={0.2} blur={true}>
              <div className="h-1 w-20 bg-secondary" />
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="right" delay={0.3} blur={true}>
              <p className="text-gray-300 text-lg leading-relaxed">
                {siteContent.about_text1}
              </p>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="right" delay={0.4} blur={true}>
              <p className="text-gray-300 text-lg leading-relaxed">
                {siteContent.about_text2}
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn direction="up" delay={0.5} blur={true}>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <span className="block text-4xl font-display font-bold text-white">7 dana</span>
                  <span className="text-sm text-gray-400 uppercase tracking-widest">Otvoreno Nedeljno</span>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="block text-4xl font-display font-bold text-white">100%</span>
                    <Flame className="w-8 h-10" />
                  </div>
                  <span className="text-sm text-gray-400 uppercase tracking-widest">Kvalitet i Zadovoljstvo</span>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
