declare namespace Model {
  module ReportManual {
    interface ReportManualData {
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
    }
  }
}