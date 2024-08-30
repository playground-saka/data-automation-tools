declare namespace Model {
  module Formula {
    interface FormulaData {
      id: number;
      pelanggan_id: string;
      faktorArus: string;
      faktorTegangan: string;
      faktorPower: string;
      createdAt: DateTime;
      updatedAt: DateTime;
      pelanggan: {
        id: number;
        pelangganId: string;
        namaPelanggan: string;
        kategoriId: number;
        statusPelanggan: boolean;
        createdAt: DateTime;
        updatedAt: DateTime;
      };
    }
  }
}