import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import type { GalleryImage } from "@shared/schema";

export default function GallerySection() {
  const { data: galleryData } = useQuery<{ success: boolean; images: GalleryImage[] }>({
    queryKey: ["/api/gallery-images"],
  });

  const galleryImages = galleryData?.images || [];
  return (
    <section id="gallery" className="py-24 bg-zinc-950 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <ScrollFadeIn direction="left" delay={0.1} blur={true}>
            <div>
              <span className="text-secondary font-bold tracking-widest uppercase mb-2 block">Vizuelno Iskustvo</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase italic">
                Naša <span className="text-primary">Galerija</span>
              </h2>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn direction="right" delay={0.2} blur={true}>
            <div className="hidden md:block pb-4">
              <div className="flex gap-2">
                <div className="w-12 h-2 bg-primary skew-x-[-20deg]" />
                <div className="w-12 h-2 bg-white skew-x-[-20deg]" />
                <div className="w-12 h-2 bg-secondary skew-x-[-20deg]" />
              </div>
            </div>
          </ScrollFadeIn>
        </div>

        <ScrollFadeIn direction="up" delay={0.3} blur={true}>
          {galleryImages.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p className="text-lg">Galerija je prazna</p>
            </div>
          ) : (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {galleryImages.map((img) => (
                  <CarouselItem key={img.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 group cursor-pointer"
                    >
                      <img 
                        src={img.imageUrl} 
                        alt={img.altText}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 grayscale-[50%]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white font-bold uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          {img.altText}
                        </p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-4 mt-8 pr-4">
                <CarouselPrevious className="static translate-y-0 bg-black/50 hover:bg-primary border-white/20 text-white rounded-none skew-x-[-10deg]" />
                <CarouselNext className="static translate-y-0 bg-black/50 hover:bg-primary border-white/20 text-white rounded-none skew-x-[-10deg]" />
              </div>
            </Carousel>
          )}
        </ScrollFadeIn>
      </div>
    </section>
  );
}
