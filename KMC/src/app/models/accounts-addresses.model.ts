export interface AccountAddresses {
  id?: number;
  name: string;
  country: string;
  city: string;
  city_name: string;
  phone: string;
  phone_country_code: string;
  building: string;
  floor: string;
  address: string;
  apartment: string;
  is_default: boolean;
  shipping_details: { shipping_cost: number; cod_cost: number };
}
