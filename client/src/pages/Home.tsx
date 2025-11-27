import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import DeliverySection from "@/components/DeliverySection";
import SocialProofSection from "@/components/SocialProofSection";
import ContactSection from "@/components/ContactSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ReviewForm } from "@/components/ReviewForm";
import YouTubeVideoSection from "@/components/YouTubeVideoSection";
import SEO from "@/components/SEO";
import { restaurantStructuredData, websiteStructuredData, videoStructuredData, localBusinessStructuredData } from "@/lib/structuredData";

export default function Home() {
  // Combine all structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      restaurantStructuredData,
      websiteStructuredData,
      videoStructuredData,
      localBusinessStructuredData
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary selection:text-white cursor-none">
      <SEO
        title="La Tavernetta - Autentična Italijanska Kuhinja | Pizza & Pasta Beograd"
        description="Najbolja pizza i pasta u Beogradu! Autentična italijanska kuhinja, sveži sastojci, hrskavo testo. Dostava na kućnu adresu. Dimitrija Tucovića 119, Zvezdara. ☎ 011 240 5320"
        canonical="https://latavernetta.rs"
        keywords="pizza beograd, italijanski restoran beograd, pasta beograd, dostava hrane, pizza zvezdara, italijanska kuhinja, la tavernetta, autentična pizza, hrskavo testo"
        ogImage="https://latavernetta.rs/logo.png"
        structuredData={homepageStructuredData}
      />
      
      <Navbar />
      <main className="relative">
        <Hero />
        <MenuSection />
        <AboutSection />
        <GallerySection />
        <YouTubeVideoSection />
        <ReviewsSection />
        <ReviewForm />
        <SocialProofSection />
        <DeliverySection />
      </main>
      <ContactSection />
    </div>
  );
}
