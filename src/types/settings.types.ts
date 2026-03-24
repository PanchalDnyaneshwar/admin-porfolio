export interface Settings {
  _id?: string;
  siteTitle?: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
    mapUrl?: string;
  };
}
