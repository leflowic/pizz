import { motion } from "framer-motion";
import { Play, ChefHat } from "lucide-react";

interface YouTubeVideoSectionProps {
  videoId?: string;
}

export default function YouTubeVideoSection({ 
  videoId = "WYLNX6DImTo" 
}: YouTubeVideoSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6"
          >
            <ChefHat className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
            Naša Kuhinja u Akciji
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Pogledajte kako naši majstori kreiraju autentične italijanske specijalitete
            sa strašću i preciznom tehnikom
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative group">
            {/* Glassmorphism Card */}
            <div className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-4 md:p-6 shadow-2xl overflow-hidden">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-xl" />
              
              {/* Video Wrapper */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm shadow-inner">
                {/* YouTube Embed */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="La Tavernetta - Naša Kuhinja"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Loading State Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-0 transition-opacity">
                  <Play className="w-20 h-20 text-primary animate-pulse" />
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-500/50 rounded-bl-xl" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
            </div>

            {/* Floating Particles Effect */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"
            />
          </div>

          {/* Bottom Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-white/70">
                  Autentična Italijanska Kuhinja
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-300" />
                <span className="text-sm text-white/70">
                  Sveži Sastojci
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700" />
                <span className="text-sm text-white/70">
                  Majstorska Priprema
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
