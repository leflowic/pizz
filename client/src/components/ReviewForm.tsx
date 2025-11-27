import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ScrollFadeIn from "./ScrollFadeIn";

export function ReviewForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error("Molimo unesite vaše ime");
      return;
    }

    if (formData.rating === 0) {
      toast.error("Molimo odaberite ocenu");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Molimo unesite komentar");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          source: "manual",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Hvala na recenziji!", {
          description: "Vaša recenzija će biti objavljena nakon odobrenja.",
        });
        // Reset form
        setFormData({
          customerName: "",
          rating: 0,
          comment: "",
        });
      } else {
        toast.error("Greška", {
          description: data.message || "Pokušajte ponovo",
        });
      }
    } catch (error) {
      toast.error("Greška", {
        description: "Problem sa mrežom. Pokušajte ponovo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollFadeIn>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Ostavite Recenziju
              </h2>
              <p className="text-gray-400 text-lg">
                Podelite vaše iskustvo sa nama i pomozite drugim gostima
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl"
            >
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">
                    Vaše Ime
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Unesite vaše ime"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="bg-zinc-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Ocena
                  </label>
                  <div className="flex gap-2 relative">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isOnFire = hoveredStar === 5;
                      
                      return (
                        <div key={star} className="relative">
                          {/* Flame particles above star when all 5 are hovered */}
                          {isOnFire && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{
                                  opacity: [0, 1, 0.8, 1, 0],
                                  y: [0, -15, -25, -35, -45],
                                  x: [0, -2, 2, -1, 0],
                                  scale: [0.5, 0.8, 1, 0.9, 0.6],
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: star * 0.1,
                                  ease: "easeOut"
                                }}
                                className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl pointer-events-none z-10"
                              >
                                🔥
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{
                                  opacity: [0, 0.8, 1, 0.7, 0],
                                  y: [0, -10, -20, -30, -40],
                                  x: [0, 3, -2, 1, 0],
                                  scale: [0.4, 0.7, 0.9, 0.8, 0.5],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: star * 0.1 + 0.3,
                                  ease: "easeOut"
                                }}
                                className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl pointer-events-none z-10"
                              >
                                🔥
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{
                                  opacity: [0, 0.6, 0.8, 0.5, 0],
                                  y: [0, -8, -15, -22, -30],
                                  x: [0, -3, 1, -2, 0],
                                  scale: [0.3, 0.6, 0.8, 0.7, 0.4],
                                }}
                                transition={{
                                  duration: 0.9,
                                  repeat: Infinity,
                                  delay: star * 0.1 + 0.6,
                                  ease: "easeOut"
                                }}
                                className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl pointer-events-none z-10"
                              >
                                🔥
                              </motion.div>
                            </>
                          )}
                          
                          <motion.button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, rating: star })
                            }
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            whileHover={{ 
                              scale: 1.25, 
                              rotate: [0, -10, 10, -10, 0],
                              transition: { 
                                duration: 0.4,
                                rotate: {
                                  repeat: 0,
                                  duration: 0.5
                                }
                              }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-1 cursor-pointer relative z-0"
                            disabled={isSubmitting}
                          >
                            <motion.div
                              animate={
                                isOnFire
                                  ? {
                                      scale: [1, 1.1, 1, 1.1, 1],
                                      filter: [
                                        "drop-shadow(0 0 12px rgb(251 146 60)) brightness(1.2)",
                                        "drop-shadow(0 0 20px rgb(249 115 22)) brightness(1.4)",
                                        "drop-shadow(0 0 12px rgb(251 146 60)) brightness(1.2)",
                                      ],
                                    }
                                  : {
                                      filter: star <= (hoveredStar || formData.rating) 
                                        ? "drop-shadow(0 0 8px rgb(250 204 21))" 
                                        : "drop-shadow(0 0 0px rgb(0 0 0))"
                                    }
                              }
                              transition={
                                isOnFire
                                  ? { 
                                      duration: 0.6,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }
                                  : { duration: 0.2 }
                              }
                            >
                              <Star
                                className={`w-10 h-10 transition-colors ${
                                  isOnFire
                                    ? "fill-orange-500 text-orange-500"
                                    : star <= (hoveredStar || formData.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            </motion.div>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {formData.rating === 5 && "Odlično! ⭐"}
                      {formData.rating === 4 && "Vrlo dobro! 👍"}
                      {formData.rating === 3 && "Dobro 👌"}
                      {formData.rating === 2 && "Može bolje 😐"}
                      {formData.rating === 1 && "Razočarani smo 😔"}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-white font-semibold mb-2">
                    Komentar
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Opišite vaše iskustvo..."
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    rows={5}
                    className="bg-zinc-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-semibold py-6 rounded-lg shadow-[0_0_30px_rgba(205,33,42,0.5)] hover:shadow-[0_0_50px_rgba(205,33,42,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Slanje...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Pošaljite Recenziju
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Vaša recenzija će biti pregledana i objavljena od strane administratora
                </p>
              </div>
            </motion.form>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
