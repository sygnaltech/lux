import { fetchCSVData } from './csvData';
import { MaternityCalc } from '../src/maternityCalc';

/**
 * Unit Test Data 
 * https://docs.google.com/spreadsheets/d/1DREayEscT7YyWCNQQLSkHjeVFi5bON1KODZxTIJQEnk/edit#gid=0
 */

describe('MaternityCalc', () => {
  let sheetData: any[];

  beforeAll(async () => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/1DREayEscT7YyWCNQQLSkHjeVFi5bON1KODZxTIJQEnk/export?format=csv';
    sheetData = await fetchCSVData(csvUrl);
  });

  test('should calculate correct day date', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const expectedDayDate = new Date(row.RndDayDate);
      const maternityCalc = new MaternityCalc(edd);
      expect(maternityCalc.getDayDate(row.RndDay))
        .toEqual(expectedDayDate);
    });
  });

  test('should calculate correct week start date', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const expectedWeekStartDate = new Date(row.RndWeekStartDate);
      const maternityCalc = new MaternityCalc(edd);
      expect(maternityCalc.getWeekStartDate(row.RndWeek))
        .toEqual(expectedWeekStartDate);
    });
  });
  
  test('should calculate correct week end date', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const expectedWeekEndDate = new Date(row.RndWeekEndDate);
      const maternityCalc = new MaternityCalc(edd);
      expect(maternityCalc.getWeekEndDate(row.RndWeek)).toEqual(expectedWeekEndDate);
    });
  });

  // https://www.stanfordchildrens.org/en/topic/default?id=due-date-calculator-41-DueDateCalc&DueDateCalc_Parameters=05-31-2024
  test('should create instance from LMP date correctly', () => {
    sheetData.forEach(row => {
      const lmp = new Date(row.LMP);
      const expectedEdd = new Date(row.EDD);
      const instance = MaternityCalc.createFromLMP(lmp);
      expect(instance._edd.toISOString().split('T')[0])
        .toBe(expectedEdd.toISOString().split('T')[0]);
    });
  });

  test('should calculate LMP date correctly', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const expectedLmpDate = new Date(row.EDDtoLMP); 
      const maternityCalc = new MaternityCalc(edd);
      expect(maternityCalc.lmpDate.toISOString().split('T')[0]).toBe(expectedLmpDate.toISOString().split('T')[0]);
    });
  });

  test('should calculate correct dayOf', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const today = new Date();  
      const expectedDayOf = parseInt(row.DayOf, 10);
      const maternityCalc = new MaternityCalc(edd);
      expect(maternityCalc.dayOf).toBe(expectedDayOf);
    });
  });

  test('should calculate correct weekOf', () => {
    sheetData.forEach(row => {
      const edd = new Date(row.EDD);
      const today = new Date(); 
      const expectedWeekOf = parseInt(row.WeekOf, 10); 
      const maternityCalc = new MaternityCalc(edd);
      jest.setSystemTime(today);
      expect(maternityCalc.weekOf).toBe(expectedWeekOf);
    });
  });

});
