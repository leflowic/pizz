import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ScrollFadeIn from "./ScrollFadeIn";
import { useQuery } from "@tanstack/react-query";
import type { Review } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch reviews from API
  const { data, isLoading } = useQuery<{ success: boolean; reviews: Review[] }>({
    queryKey: ["reviews-public"],
    queryFn: async () => {
      const response = await fetch("/api/reviews");
      return response.json();
    },
  });

  const reviews = data?.reviews?.filter(r => r.isApproved && r.rating >= 4) || [];

  // Format date helper
  const formatReviewDate = (date: Date | string | null) => {
    if (!date) return "";
    try {
      const distance = formatDistanceToNow(new Date(date), { 
        addSuffix: true
      });
      // Simple Serbian translation
      return distance
        .replace("about", "oko")
        .replace("less than", "manje od")
        .replace("over", "preko")
        .replace("almost", "skoro")
        .replace("months", "meseci")
        .replace("month", "mesec")
        .replace("days", "dana")
        .replace("day", "dan")
        .replace("hours", "sati")
        .replace("hour", "sat")
        .replace("minutes", "minuta")
        .replace("minute", "minut")
        .replace("seconds", "sekundi")
        .replace("ago", "ranije");
    } catch {
      return "";
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  // No reviews state
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">
              Šta Kažu Naši Gosti
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-400 text-lg">
              Autentične recenzije naših zadovoljnih gostiju
            </p>
          </div>
        </ScrollFadeIn>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div key={review.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <ScrollFadeIn>
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                      <div className="flex items-center gap-1 mb-6">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                        "{review.comment}"
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                          {review.profilePhotoUrl && (
                            <img 
                              src={review.profilePhotoUrl} 
                              alt={review.customerName}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {review.customerName}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {review.source === "google" ? "Google" : ""} • {formatReviewDate(review.reviewDate || review.createdAt)}
                            </p>
                          </div>
                        </div>
                        {review.source === "google" && (
                          <img 
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                            alt="Google"
                            className="h-6 opacity-70"
                          />
                        )}
                      </div>
                    </div>
                  </ScrollFadeIn>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-none group"
            aria-label="Prethodna recenzija"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-none group"
            aria-label="Sledeća recenzija"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all cursor-none ${
                  index === selectedIndex
                    ? "bg-white w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Idi na recenziju ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
