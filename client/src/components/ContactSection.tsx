import { MapPin, Phone, Instagram, Facebook, KeyRound } from "lucide-react";
import WorkingHoursStatus from "./WorkingHoursStatus";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function ContactSection() {
  const siteContent = useSiteContent();
  return (
    <footer id="contact" className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <ScrollFadeIn direction="left" delay={0.1} blur={true}>
            <div>
              <h3 className="text-4xl font-display font-bold uppercase italic mb-6">
                La <span className="text-primary">Tavernetta</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Autentična italijanska kuhinja u srcu Beograda. Napravljeno sa strašću, servirano sa brzinom.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/latavernetta.beograd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/latavernetta.beograd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.google.com/maps/place/La+Tavernetta/@44.8016361,20.4935459,17z" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Google Maps - La Tavernetta" title="Pogledajte nas na Google Maps">
                  <MapPin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </ScrollFadeIn>

          {/* Contact Info */}
          <ScrollFadeIn direction="up" delay={0.2} blur={true}>
            <div>
              <h4 className="text-xl font-bold uppercase tracking-widest mb-6 text-secondary">Kontakt</h4>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <span className="text-gray-300">
                    {siteContent.contact_address}<br />
                    {siteContent.contact_city}, Serbia {siteContent.contact_postal} (Zvezdara)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:+${siteContent.contact_phone.replace(/[\s+]/g, '')}`} className="text-gray-300 text-lg font-display hover:text-primary transition-colors">
                    {siteContent.contact_phone}
                  </a>
                </li>
              </ul>
              <WorkingHoursStatus />
            </div>
          </ScrollFadeIn>

          {/* Google Maps */}
          <ScrollFadeIn direction="right" delay={0.3} blur={true}>
            <div className="h-48 bg-zinc-900 rounded-lg border border-white/10 overflow-hidden relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.8234!2d20.493545890830816!3d44.80163611164573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzA1LjkiTiAyMMKwMjknMzYuOCJF!5e0!3m2!1ssr!2srs!4v1732383500000!5m2!1ssr!2srs&q=La+Tavernetta,+Dimitrija+Tucovi%C4%87a+119,+Beograd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="La Tavernetta - Dimitrija Tucovića 119, Beograd"
                className="invert-[90%] hue-rotate-180 brightness-95 contrast-90 hover:invert-0 hover:hue-rotate-0 hover:brightness-100 hover:contrast-100 transition-all duration-300"
              />
            </div>
          </ScrollFadeIn>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 La Tavernetta. Sva prava zadržana.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-white">Politika Privatnosti</a>
            <a href="#" className="hover:text-white">Uslovi Korišćenja</a>
            <a 
              href="/admin" 
              className="flex items-center gap-1.5 hover:text-white transition-colors opacity-50 hover:opacity-100"
              title="Admin Panel"
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
