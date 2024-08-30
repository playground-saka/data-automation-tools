declare namespace Model {
  module ReportSystem {
    interface ReportSystemData {
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