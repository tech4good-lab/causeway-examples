/** Helper function for calculating quarter name and year */
export function getQuarterAndYear() {
  const quarter = new Date();
  const quarterYear = new Date(new Date().setFullYear(quarter.getFullYear()));

  switch (quarter.getMonth() + 1) {
    case 1:
    case 2:
    case 3:
      return 'Winter' + ' ' + quarterYear.getFullYear();
    case 4:
    case 5:
    case 6:
      return 'Spring' + ' ' + quarterYear.getFullYear();
    case 7:
    case 8:
    case 9:
      return 'Summer' + ' ' + quarterYear.getFullYear();
    case 10:
    case 11:
    case 12:
      return 'Fall' + ' ' + quarterYear.getFullYear();
    default:
      return 'Invalid Month';
  }
}

/** Helper function for calculating the start and end of a quarter */
export function getStartAndEndDate() {
  const today = new Date();
  const currentQuarter = Math.floor((today.getMonth() / 3)) + 1; // 1 = Q1, 2 = Q2, 3 = Q3, 4 = Q4
  let quarterStartDate: Date;
  let quarterEndDate: Date;

  switch (currentQuarter) {
    case 1: // Winter (Jan-Mar)
      quarterStartDate = new Date(today.getFullYear(), 0, 1); // January 1st
      quarterEndDate = new Date(today.getFullYear(), 2, 31); // March 31st
      break;
    case 2: // Spring (Apr-Jun)
      quarterStartDate = new Date(today.getFullYear(), 3, 1); // April 1st
      quarterEndDate = new Date(today.getFullYear(), 5, 30); // June 30th
      break;
    case 3: // Summer (Jul-Sep)
      quarterStartDate = new Date(today.getFullYear(), 6, 1); // July 1st
      quarterEndDate = new Date(today.getFullYear(), 8, 30); // September 30th
      break;
    case 4: // Autumn (Oct-Dec)
      quarterStartDate = new Date(today.getFullYear(), 9, 1); // October 1st
      quarterEndDate = new Date(today.getFullYear(), 11, 31); // December 31st
      break;
    default: // Handle invalid quarter
      throw new Error('Invalid quarter number');
  }
  return [quarterStartDate, quarterEndDate];
}

/** Helper function to get the start of the week as a string. */
export function startOfWeek() {
  const today = new Date();
  const startDate = new Date(new Date().setDate(today.getDate() - today.getDay()));
  return (startDate.getMonth() + 1) + '/' + startDate.getDate();
}

/**
 * Helper function to get the start of the week as a date object.
 * Citation: https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
 * */
export function getStartWeekDate() {
  const today = new Date();
  const day = today.getDay() || 7;
  if ( day !== 1 ) {
    today.setHours(-24 * (day - 1));
  }
  return today;
}

/** Helper function to get the end of the week as a string. */
export function endOfWeek() {
  const today = new Date();
  const endDate = new Date(new Date().setDate(today.getDate() + (6 - today.getDay())));
  return (endDate.getMonth() + 1) + '/' + endDate.getDate();
}
