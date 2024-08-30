declare namespace Model {
  module Customer {
    interface CustomerData {
      id: number;
      pelangganId:number,
      namaPelanggan: string;
      kategori:Model.Category.CategoryData;
      statusPelanggan: boolean;
    }

    interface CustomerAllData {
      id: number;
      pelangganId: number;
      namaPelanggan: string;
    }
  }
}