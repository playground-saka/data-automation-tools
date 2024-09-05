declare namespace Model {
  module Grafik {
    interface GrafikManualData {
      date: string;
      voltage: number;
      current: number;
      totalPowerP: number;
    }

    interface GrafikSistemData {
      date: string;
      voltage: number;
      current: number;
      whExport: number;
    }

    interface GrafikSelisihData {
      date: string;
      selisihPowerP: number;
      selisihCurrentR: number;
      selisihVoltageRS: number;
    }
  }
}