export function getClosestArrayElementToTarget(targetNum, numArray) {
    return numArray.reduce((acc, currEle) => {
        return Math.abs(currEle - targetNum) < Math.abs(acc - targetNum) ? currEle : acc
    }, numArray[0]);
}

export const getMaxDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  export const getListOfAllDates = (year, month) => {
    return new Array(getMaxDaysInMonth(year, month)).fill(1).map((value, index) => value + index);
  };