export const LOCATIONS = [
  "Hargeisa",
  "Berbera",
  "Burco",
  "Borama",
  "Wajaale",
  "Erigavo",
  "Gabiley"
];

export const DEFAULT_CATEGORIES = [
  "Men",
  "Women",
  "Electronics",
  "Home",
  "Sports",
  "Baby",
  "Beauty",
  "Cosmetics",
  "Cafeteria",
  "Restaurant",
  "Restaurant & Cafeteria",
  "Shoes",
  "Other"
];

export type Merchant = {
  id: string;
  username: string;
  password: string;
  storeName: string;
  ownerName: string;
  location: string;
  category: string;
  zaadNumber: string;
  eDahabNumber: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Product = {
  id: string;
  merchantId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  relatedKeywords?: string;
};

export type Order = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  merchantId: string;
  merchantName: string;
  customerName: string;
  quantity: number;
  senderNumber: string;
  paymentScreenshot?: string;
  date: string;
};
