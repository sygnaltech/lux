/*
 * SITE 
 * Maternity Calc
 * 
 */

import { DateTime } from 'luxon';

// Standard gestation period of 40 weeks
const DAYS_IN_PREGNANCY = 280;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export class MaternityCalc {

    _edd: Date;

    constructor(edd: Date) {
      
      this._edd = edd;

    }
    
    // Gestational Age
    // This is the age of the pregnancy calculated from the first day of the LMP. This method assumes a standard 28-day menstrual cycle and a 40-week pregnancy duration (280 days).
    get lmpDate(): Date {

      const eddDate = new Date(this._edd);
  
      // Calculate the LMP by subtracting 280 days from the EDD
      const lmpDate = new Date(
        eddDate.getTime() - DAYS_IN_PREGNANCY * MS_PER_DAY
      );
  
      return lmpDate;
    }

    // Embryonic Age
    // This is the actual age of the embryo, which is approximately 2 weeks less than the gestational age, as it starts counting from the time of conception, which usually occurs about 2 weeks after the LMP.
    get conceptionDate(): Date {
      const lmpDate = new Date(this.lmpDate);
  
      // Calculate the LMP by subtracting 280 days from the EDD
      const conceptionDate = new Date(
        lmpDate.getTime() + 14 * MS_PER_DAY
      );

      return conceptionDate;
    }

    // 1-based
    get dayOf(): number {

      // Get the current date in the user's local timezone, 
      // normalized to the start of the day
      const today = DateTime.local().startOf('day'); 

      const eddDate = DateTime.fromJSDate(this.lmpDate).startOf('day'); 

      const diffDays = Math.ceil(today.diff(eddDate, 'days').days);

      return diffDays + 1;
  }
  

    // 1-based
    get weekOf(): number {

      const weeks = Math.floor(this.dayOf / 7);

      return weeks + 1;
    }

    // Gestational age today, in whole days since the LMP, using the standard
    // convention where the LMP is day 0 (0w0d). This is the day-precise basis
    // for both the "X weeks Y days" progress and the card show/hide logic.
    // Math.round keeps this correct across NZ daylight-saving transitions
    // (where a local day is 23 or 25 hours long).
    get gestationDays(): number {
      const today = DateTime.local().startOf('day');
      const lmp = DateTime.fromJSDate(this.lmpDate).startOf('day');
      return Math.round(today.diff(lmp, 'days').days);
    }

    // getDayDate(day: number): Date {
    //   return this._edd;
    // }

    // getWeekStartDate(week: number): Date {
    //   return this._edd;
    // }

    // getWeekEndDate(week: number): Date {
    //   return this._edd;
    // }

    getDayDate(day: number): Date {
        const lmpDate = DateTime.fromJSDate(this.lmpDate)
          .startOf('day');
        const dayDate = lmpDate.plus({ days: day - 1 });
//          .toJSDate();
        return MaternityCalc.convertToJSDate(dayDate);
    }

    getWeekStartDate(week: number): Date {
        const lmpDate = DateTime.fromJSDate(this.lmpDate)
          .startOf('day');
        const weekStartDate = lmpDate.plus({ weeks: week - 1 })
          .startOf('day'); 
        return MaternityCalc.convertToJSDate(weekStartDate);
    }

    getWeekEndDate(week: number): Date {
        const lmpDate = DateTime.fromJSDate(this.lmpDate)
          .startOf('day');
        const weekEndDate = lmpDate
          .plus({ weeks: week - 1, days: 6 })
          .startOf('day');
        return MaternityCalc.convertToJSDate(weekEndDate);
    }

    /**
     * Parses a gestational-age token of the form "W" or "W.D", where
     * W = completed gestational weeks and D = additional days (0-6),
     * measured from the LMP (gestational age 0w0d = the LMP date).
     *
     * The scan-planner markup encodes each window this way, e.g. the nuchal
     * window is authored as "12.5" (12 weeks 5 days) to "13.5" (13 weeks 5 days).
     *
     * @returns null for empty/invalid tokens (the caller should skip these).
     */
    static parseGestationToken(token: string | number): { weeks: number; days: number; hasDays: boolean } | null {
      if (token === null || token === undefined) return null;
      const trimmed = String(token).trim();
      if (trimmed === '') return null;

      const parts = trimmed.split('.');
      const weeks = parseInt(parts[0], 10);
      if (isNaN(weeks)) return null;

      const hasDays = parts.length > 1 && parts[1] !== '';
      const days = hasDays ? parseInt(parts[1], 10) : 0;
      if (isNaN(days)) return null;

      return { weeks, days, hasDays };
    }

    /**
     * Returns the calendar date at a given gestational age, measured from the
     * LMP where LMP = 0w0d. This is the standard obstetric convention and is
     * what the scan-window dates are built on.
     *
     * @param weeks completed gestational weeks
     * @param days  additional days (default 0)
     */
    getGestationDate(weeks: number, days: number = 0): Date {
      const lmpDate = DateTime.fromJSDate(this.lmpDate).startOf('day');
      const dayDate = lmpDate.plus({ days: weeks * 7 + days });
      return MaternityCalc.convertToJSDate(dayDate);
    }

    /**
     * Start date of a scan window, from a gestational-age token ("W" or "W.D").
     * e.g. "12.5" -> 12w5d, "6" -> 6w0d.
     *
     * @returns null if the token is empty/invalid.
     */
    getScanWindowStartDate(token: string | number): Date | null {
      const g = MaternityCalc.parseGestationToken(token);
      if (!g) return null;
      return this.getGestationDate(g.weeks, g.days);
    }

    /**
     * End date of a scan window, from a gestational-age token ("W" or "W.D").
     *
     * A whole-week token (e.g. "24") is an inclusive range end and resolves to
     * the last day of that gestational week (24w6d). A token carrying explicit
     * days (e.g. "13.5") is an exact milestone and is used as-is (13w5d).
     *
     * @returns null if the token is empty/invalid.
     */
    getScanWindowEndDate(token: string | number): Date | null {
      const g = MaternityCalc.parseGestationToken(token);
      if (!g) return null;
      const extraDays = g.hasDays ? 0 : 6;
      return this.getGestationDate(g.weeks, g.days + extraDays);
    }

    /**
     * Estimates the due date using +280 rule 
     * @param lmp Date of last menstral period (LMP)
     * @returns MaternityCalc instance
     */
    static createFromLMP(lmp: Date): MaternityCalc {

      const lmpDate = DateTime.fromJSDate(lmp); 

      let eddDate = lmpDate.plus({ days: 280 });

      const eddJSDate = this.convertToJSDate(eddDate); 
//      const eddJSDate = new Date(`${eddDate.year}-${String(eddDate.month).padStart(2, '0')}-${String(eddDate.day).padStart(2, '0')}`);

      return new MaternityCalc(eddJSDate);
    }

    static convertToJSDate(dateTime: DateTime): Date {
      return new Date(`${dateTime.year}-${String(dateTime.month).padStart(2, '0')}-${String(dateTime.day).padStart(2, '0')}`);
    }

    /**
     * Estimates the due date using Naegele's rule 
     * @param lmp Date of last menstral period (LMP)
     * @returns MaternityCalc instance
     */
    static createFromLMPNaegele(lmp: Date): MaternityCalc {

      const lmpDate = DateTime.fromJSDate(lmp); 

      // Naegele's rule
      const eddDate = lmpDate
        .plus({ years: 1 }) // Add one year
        .minus({ months: 3 }) // Subtract three months
        .plus({ days: 7 }) // Add seven days
        .startOf('day'); 

      const eddJSDate = new Date(`${eddDate.year}-${String(eddDate.month).padStart(2, '0')}-${String(eddDate.day).padStart(2, '0')}`);

      return new MaternityCalc(eddJSDate);
    }

}

