declare namespace Model {
  module ReportDifferent {
    interface ReportDifferentData {
      id: number;
      dateTime: string;
      pelangganId: number
      logsheetManualId: number
      currentRHourly: number
      currentSHourly: number
      currentTHourly: number
      voltageRHourly: number
      voltageSHourly: number
      voltageTHourly: number
      whExportHourly: number
      varhExportHourly: number
      powerFactorHourly: number
      freqDifference: number
      createdAt: string
      updatedAt: string
      totalPowerPManual: number
      currentRManual: number
      voltageRSManual: number
      selisihPowerP: number
      selisihCurrentR: number
      selisihVoltageRS: number
    }
  }
}