declare namespace Model {
  module ReportDifferent {
    interface ReportDifferentData {
      id: number;
      dateTime: Date;
      pelangganId: number;
      logsheetManualId: number;
      currentRDifference: number;
      currentSDifference: number;
      currentTDifference: number;
      voltageRDifference: number;
      voltageSDifference: number;
      voltageTDifference: number;
      totalPowerPDifference: number;
      totalPowerQDifference: number;
      pfDifference: number;
      freqDifference: number;
      createdAt: Date;
      updatedAt: Date;
      logsheetManual: {
        id: number;
        dateTime: Date;
        pelangganId: number;
        totalPowerP: number;
        totalPowerQ: number;
        powerFactor: number;
        frequency: number;
        currentR: number;
        currentS: number;
        currentT: number;
        voltageRS: number;
        voltageST: number;
        voltageTR: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}