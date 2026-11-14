import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';

interface Record {
  [key: string]: string;
}

export async function fetchCSVData(url: string): Promise<Record[]> {
  const response = await fetch(url);
  const text = await response.text();
  const records: Record[] = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true, // This helps remove any surrounding whitespace
  });

  // Filter out any empty objects that result from blank lines
  const filteredRecords = records.filter(record => {
    return Object.values(record).some(value => value.trim() !== '');
  });

  return filteredRecords;
}
