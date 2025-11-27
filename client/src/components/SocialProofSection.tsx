import { motion } from "framer-motion";
import { Star, MapPin, Users } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

export default function SocialProofSection() {
  return (
    <section className="py-20 bg-zinc-950 border-y border-white/5">
      <div className="container mx-auto px-4">
        <ScrollFadeIn delay={0.1} direction="up">
          <div className="text-center mb-12">
            <span className="text-secondary font-bold tracking-widest uppercase mb-2 block">Poverenje naših gostiju</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase italic">
              Ocene & <span className="text-primary">Recenzije</span>
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Google Reviews */}
          <ScrollFadeIn delay={0.2} direction="left">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center group hover:border-primary/50 transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Google</h3>
              
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <div className="text-3xl font-display font-bold text-white mb-1">4.8</div>
              <div className="text-gray-400 text-sm">Iz 320+ recenzija</div>
            </motion.div>
          </ScrollFadeIn>

          {/* TripAdvisor */}
          <ScrollFadeIn delay={0.3} direction="up">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center group hover:border-secondary/50 transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,140,69,0.5)]">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="1.5"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9l1.43 1.43C6.45 9.21 6 10.55 6 12c0 3.31 2.69 6 6 6 1.45 0 2.79-.45 3.88-1.12l1.43 1.43C15.55 19.37 13.85 20 12 20zm5.31-6.1l-1.43-1.43C16.55 11.79 17 10.45 17 9c0-3.31-2.69-6-6-6-1.45 0-2.79.45-3.88 1.12L5.69 2.69C7.45 1.63 9.15 1 11 1c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">TripAdvisor</h3>
              
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <div className="text-3xl font-display font-bold text-white mb-1">4.9</div>
              <div className="text-gray-400 text-sm">Iz 180+ recenzija</div>
            </motion.div>
          </ScrollFadeIn>

          {/* Local Favorite */}
          <ScrollFadeIn delay={0.4} direction="right">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center group hover:border-primary/50 transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(205,33,42,0.5)]">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Lokal Omiljeni</h3>
              
              <div className="flex justify-center items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-secondary font-bold">Zvezdara</span>
              </div>
              
              <div className="text-3xl font-display font-bold text-white mb-1">5,000+</div>
              <div className="text-gray-400 text-sm">Zadovoljnih gostiju</div>
            </motion.div>
          </ScrollFadeIn>
        </div>

        {/* Highlighted Review */}
        <ScrollFadeIn delay={0.5} direction="up" className="mt-12">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-bold">Marko S.</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed">
                  "Najbolja pizza u Beogradu! Autentična italijanska kuhinja, vrhunski sastojci i neverovatna atmosfera. 
                  Svaki put kada dođem, osećam se kao da sam u Italiji. Toplo preporučujem svima koji cene pravu 
                  italijansku pizzu pripremljenu po tradicionalnim recepturama."
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Google • Pre 2 nedelje
                </div>
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
