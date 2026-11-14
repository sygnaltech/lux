import { MaternityCalc } from "./maternityCalc";


// Formats as ISO8601 Date format YYYY-MM-DD, using the date's LOCAL calendar
// components. Do NOT use toISOString() here: the date picker returns a Date at
// local midnight, and toISOString() converts to UTC, which shifts the calendar
// day backwards for NZ's positive offset (e.g. picking 15 Apr yields 14 Apr).
export function formatISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Estimates the due date using Naegele's rule 
 * @param lmp Date of last menstral period (LMP)
 * @returns 
 */
// export function calculateEDDfromLMP(lmp: string): Date {

//     const maternityCalc: MaternityCalc = MaternityCalc.createFromLMP(new Date(lmp)); 

//     return maternityCalc._edd; 
// }

export function calculateLMPfromEDD(edd: string): Date {

    const maternityCalc: MaternityCalc = new MaternityCalc(new Date(edd)); 

    return maternityCalc.lmpDate;
}


// Example usage
// const lmp = '2023-09-14';
// const dueDate = calculateDueDate(lmp);
// console.log('Estimated Due Date:', dueDate);


function calculatePregnancyWeek(lmp: string): number {
    const lmpDate = new Date(lmp);
    const todayDate = new Date();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor((todayDate.getTime() - lmpDate.getTime()) / millisecondsPerDay);
    const currentWeek = Math.floor(daysDifference / 7);

    return currentWeek;
}


// Example usage
// const lmp = '2023-02-01'; // An example last menstrual period date
// const currentWeek = calculatePregnancyWeek(lmp);
// console.log('Current week of pregnancy:', currentWeek);