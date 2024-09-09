interface AboutAsTestimonial {
  // id: number;
  name: string;
  // title: string;
  text: string;
  image:string;
}

interface AboutUsStatistics {
  id: number;
  sav: string;
  number: number;
  text: string;
}

export interface AboutUs {
  id: number;
  about_us_testimonial: AboutAsTestimonial[] | null;
  about_us_statistics: AboutUsStatistics[] | null;
  about_title: string;
  about_text: string;
  about_image: string;
  testimonial_title: string;
  testimonial_subtitle: string;
  testimonial_image: string;
}
