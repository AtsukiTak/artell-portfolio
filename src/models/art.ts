export interface Art {
  id: string;
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen: number | null;
  rentalPriceYen: number | null;
  thumbnailUrl: string;
}
