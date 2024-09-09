export interface Footer {
  contact_us: contact_us;
  service: service[];
}

export interface service {
  description: string;
  title: string;
  slug?: string;
}
export interface contact_us {
  email: string;
  phone: string;
  phone1: string;
}
