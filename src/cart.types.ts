export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: {
    [attributeName: string]: string;
  };
  attributes: {
    id: string;
    name: string;
    type: string;
    items: {
      id: string;
      displayValue: string;
      value: string;
    }[];
  }[];
}
