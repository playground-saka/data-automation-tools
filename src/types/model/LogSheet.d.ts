declare namespace Model {
  module LogSheet {
    interface LogSheetData {
      id: number;
      date: DateTime;
      month: string;
      years: string;
      logsheetManual: boolean;
      logsheetSistem: boolean;
      createdAt: DateTime;
      updatedAt: DateTime;
      pelanggan: Model.Customer.CustomerData;
    }
  }
}