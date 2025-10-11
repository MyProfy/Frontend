import { Category, SubCategory } from "../../components/types/apiTypes";

export interface Filters {
  price: Set<string>;
  hours: Set<string>;
  experience: Set<string>;
  category: string;
  subcategory: Set<string>;
  region: string;
}

export interface Image {
  id: number;
  image: string;
  uploaded_at: string;
}