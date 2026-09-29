export type OccurrenceType =
  | "intrusion"
  | "perimeter_breach"
  | "low_battery"
  | "signal_loss";

export type Status = "open" | "acknowledged" | "resolved";

export interface Occurrence {
  _id: string;
  siteId: string;
  droneId: string;
  type: OccurrenceType;
  severity: number;
  detectedAt: string;
  status: Status;
  count: number;
  note?: string;
}

export const TYPE_WEIGHT: Record<OccurrenceType, number> = {
  intrusion: 3,
  perimeter_breach: 2,
  low_battery: 1,
  signal_loss: 1,
};

export const TYPE_LABEL: Record<OccurrenceType, string> = {
  intrusion: "Intrusão",
  perimeter_breach: "Violação de perímetro",
  low_battery: "Bateria baixa",
  signal_loss: "Perda de sinal",
};

export const STATUS_LABEL: Record<Status, string> = {
  open: "Aberta",
  acknowledged: "Reconhecida",
  resolved: "Resolvida",
};
