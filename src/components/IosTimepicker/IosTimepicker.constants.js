const arrayFillCB = (initial, index) => initial + index;
export const TWELVE_HOUR_LIMIT = 12;

export const MERIDIEM_ENUM = {
  AM: "AM",
  PM: "PM"
};

export const TIME_FORMAT_ENUM = {
  TWELVE_HOUR_FORMAT: 'HOUR12',
  TWENTY_FOUR_HOUR_FORMAT: 'HOUR24',
};

export const getSelectedMeridiem = dateObj => {
  return dateObj.getHours() < TWELVE_HOUR_LIMIT
    ? MERIDIEM_ENUM.AM
    : MERIDIEM_ENUM.PM;
};

export const getValue = (value, limit) => {
  const mod = value % limit;
  if (mod !== 0) {
    return mod;
  }
  return limit;
};

const TWELVE_HOURS_ARRAY = new Array(TWELVE_HOUR_LIMIT)
  .fill(1)
  .map(arrayFillCB);

export const TWELVE_HOURS_ARRAY_FORMATTED =  [TWELVE_HOURS_ARRAY.pop()].concat(TWELVE_HOURS_ARRAY);


export const getTwentyFourHourRepresentation = hour => {
  if (TWELVE_HOURS_ARRAY_FORMATTED.includes(hour)) {
    return TWELVE_HOUR_LIMIT + hour;
  }
};
export const MINUTE_ARRAY = new Array(60).fill(0).map(arrayFillCB);
export const MERIDIEM_ARRAY = Object.values(MERIDIEM_ENUM);
export const TWENTY_FOUR_HOURS_ARRAY = new Array(24).fill(0).map(arrayFillCB);