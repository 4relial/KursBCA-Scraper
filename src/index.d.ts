export interface BcaRate {
  mts: string;
  buy: number;
  sell: number;
  date: string | null;
}

export interface BcaResponse {
  date: string | null;
  data: BcaRate[];
}

export function kursBCA(): Promise<BcaResponse>;
export function convertToISODate(dateStr: string): string;
export function parseNumber(s?: string): number;

declare const _default: typeof kursBCA;
export default _default;
