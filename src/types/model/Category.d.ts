declare namespace Model {
  module Category {
    interface CategoryData {
      id: number
      namaKategori: string,
      statusKategori: boolean,
      createdAt: DateTime,
      updatedAt: DateTime
    }
  }
}