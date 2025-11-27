import { useQuery } from "@tanstack/react-query";

export function useSiteContent() {
  const { data } = useQuery<{ success: boolean; content: Record<string, string> }>({
    queryKey: ["/api/site-content"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const content = data?.content || {};

  return {
    hero_title: content.hero_title || "Ukus Prave Italije",
    hero_subtitle: content.hero_subtitle || "Autentična italijanska kuhinja u srcu Beograda. Doživite najbrže i najsvežije ukuse tradicionalne pizze.",
    about_text1: content.about_text1 || "Smeštena u srcu Zvezdare, La Tavernetta je premium italijanski brend posvećen kvalitetu. Pored vrhunskih pica, u našoj ponudi su i sendviči, lazanje i drugi specijaliteti pripremljeni po originalnim recepturama.",
    about_text2: content.about_text2 || "Ponosimo se prijatnom atmosferom idealnom za prijatelje i porodice. Naše osoblje je tu da vam pruži iskustvo koje se pamti, bilo da dolazite na večeru ili naručujete dostavu.",
    contact_phone: content.contact_phone || "011 2405320",
    contact_address: content.contact_address || "Dimitrija Tucovića 119",
    contact_city: content.contact_city || "Beograd",
    contact_postal: content.contact_postal || "11050",
    hours_weekdays: content.hours_weekdays || "Pon-Čet: 09:00 - 00:00",
    hours_weekend: content.hours_weekend || "Pet-Sub: 09:00 - 01:00",
    hours_sunday: content.hours_sunday || "Ned: 12:00 - 00:00",
  };
}
