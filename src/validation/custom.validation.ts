// Custom validation utils - For now checking is not empty

import { VALID_CHARACTERS } from "./regex/regex.validation";
import { DateTime } from "luxon";

export const checkFieldIfRadioButtonSelected = (selected: boolean, errMsg: string, value: string = "") => {
  if ( selected && !value.trim() ) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkMaxFieldIfRadioButtonSelected = (selected: boolean, errMsg: string, maxValue: number, value: string = "") => {
  if ( selected && value.length > maxValue) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkInvalidCharactersIfRadioButtonSelected = (selected: boolean, errMsg: string, value: string) => {
  if (selected && !value.match(VALID_CHARACTERS)) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDate = (errMsg: string, day: string = "", month: string = "", year: string = "") => {
  if ( !day.trim() || !month.trim() || !year.trim() ) {
    throw new Error(errMsg);
  }
  return true;
};

export const checkDateIsNotFuture = (errMsg: string, day: string = "", month: string = "", year: string = "") => {
  const inputDate = DateTime.utc(Number(year), Number(month), Number(day));
  const now = DateTime.now();
  const currentDate = DateTime.utc(now.year, now.month, now.day); // exclude time of day
  if (inputDate  >= currentDate) {
    throw new Error(errMsg);
  }
  return true;
};
