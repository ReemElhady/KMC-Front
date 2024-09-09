import { Articles } from "./article-model";
import { Product } from "./products.models";

export interface Home {
    Home_Swiper: HomeSwiper[];
    Latest_Articles: Articles;
    Popular_Products: Product;
    home_details: HomeDetails;
}
export interface HomeSwiper {
    id: number
    button_text: string
    is_video: boolean
    link: string
    media: string
    quote: string
    title: string
}
export interface HomeDetails {
    about_us_1_caption: string;
    about_us_1_image: string;
    about_us_2_caption: string;
    about_us_2_image: string;
    about_us_3_image: string;
    about_us_4_image: string;
    categories_caption: string;
}