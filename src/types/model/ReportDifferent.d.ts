declare namespace Model {
  module ReportDifferent {
    interface ReportDifferentData {
      id: number;
      dateTime: Date;
      pelangganId: number;
      logsheetManualId: number;
      currentRHourly: number;
      currentSHourly: number;
      currentTHourly: number;
      voltageRHourly: number;
      voltageSHourly: number;
      voltageTHourly: number;
      whExportHourly: number;
      varhExportHourly: number;
      powerFactorHourly: number;
      freqDifference: number;
      selisihPowerP: number;
      selisihCurrentR: number;
      selisihVoltageRS: number;
      totalPowerPManual: number;
      currentRManual: number;
      voltageRSManual: number;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}