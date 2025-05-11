import { recordIconMap } from '../data/record-icon-map';

export function getIcon(recordName: string): string {
  return recordIconMap.get(recordName) ?? '';
}
