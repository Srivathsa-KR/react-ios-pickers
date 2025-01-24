import './IosDatepicker.css';
import React, {useRef, useEffect, useState } from "react";
import IosWheelpicker from "../IosWheelpicker/IosWheelpicker";
import {YEARS, MONTHS, ALLOWED_DATES_ENUM } from "./IosDatepicker.constants";
import { getMaxDaysInMonth, getListOfAllDates } from '../../utils/utils';

function IosDatePicker(props) {

  const { date: selectedDate } = props;
  const currentDateRef = useRef(new Date())

  const [daysList, setDaysList] = useState(getListOfAllDates(selectedDate.getFullYear(), selectedDate.getMonth()));

  const [monthList, setMonthList] = useState(MONTHS);
  const [yearList, setYearList] = useState(YEARS);
  const [defaultSetting, setDefultSetting] = useState(null);

  useEffect(() => {
    if(props.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
      const pastYearList = YEARS.slice(0, YEARS.indexOf(selectedDate.getFullYear() + 1));
      setYearList(pastYearList);
      setDefultSetting("DEFAULT_TO_END");
    }
    else if(props.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
      const futureYearList = YEARS.slice(YEARS.indexOf(selectedDate.getFullYear()), YEARS.length);
      setYearList(futureYearList);
      setDefultSetting("DEFAULT_TO_START");
    }
  }, [props.allowedDates]);

  useEffect(() => {
    if(selectedDate.getFullYear() === currentDateRef.current.getFullYear()) {
        
      if(props.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousMonths = MONTHS.slice(0, currentDateRef.current.getMonth() + 1);
        setMonthList(previousMonths);
      }
      else if(props.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureMonths = MONTHS.slice(currentDateRef.current.getMonth(), MONTHS.length);
        setMonthList(futureMonths);
      }
    }
    else {
      setMonthList(MONTHS);
    }
  }, [selectedDate.getFullYear(), props.allowedDates]);

  useEffect(() => {
    if(selectedDate.getFullYear() === currentDateRef.current.getFullYear() && selectedDate.getMonth() === currentDateRef.current.getMonth()) {  
      if(props.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousDaysList = daysList.slice(0, daysList.indexOf(currentDateRef.current.getDate()));
        setDaysList(previousDaysList);
      }
      else if(props.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureDaysList = daysList.slice(daysList.indexOf(currentDateRef.current.getDate() + 1), daysList.length + 1);
        setDaysList(futureDaysList);
      }
    }
    else {
      setDaysList(getListOfAllDates(selectedDate.getFullYear(), selectedDate.getMonth()));
    }
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), props.allowedDates]);

  const _getMinOfDays = maxDaysInMonth => {
    return Math.min(selectedDate.getDate(), maxDaysInMonth);
  };

  const _getDayToBeSet = (year, month) => {
    const maxDaysInMonth = getMaxDaysInMonth(year, month);
    return _getMinOfDays(maxDaysInMonth);
  };

  const setNewDate = (year, month, date) => {
    const newDate = new Date(year, month, date);
    props.onDateChange(newDate);
  };

  const onDayChange = changedDayIndex => {
    setNewDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      daysList[changedDayIndex]
    );
  };

  const onMonthChange = changedMonthIndex => {
    const dayToBeSet = _getDayToBeSet(
      selectedDate.getFullYear(),
      MONTHS.indexOf(monthList[changedMonthIndex])
    );
    setNewDate(selectedDate.getFullYear(), MONTHS.indexOf(monthList[changedMonthIndex]), dayToBeSet);
  };

  const onYearChange = changedYearIndex => {
    const yearToBeSet = yearList[changedYearIndex];
    const dayToBeSet = _getDayToBeSet(yearToBeSet, selectedDate.getMonth());
    setNewDate(yearToBeSet, selectedDate.getMonth(), dayToBeSet);
  };
  return (
    <div className="date-picker">
      <IosWheelpicker
        dataList={daysList}
        indexOfSelected={daysList.indexOf(selectedDate.getDate())}
        onValueChange={onDayChange}
        type="DATE"
        defaultSetting={defaultSetting}
      />
      <IosWheelpicker
        dataList={monthList}
        indexOfSelected={monthList.indexOf(MONTHS[selectedDate.getMonth()])}
        onValueChange={onMonthChange}
        type="MONTH"
        defaultSetting={defaultSetting}
      />
      <IosWheelpicker
        dataList={yearList}
        indexOfSelected={yearList.indexOf(selectedDate.getFullYear())}
        onValueChange={onYearChange}
        type="YEAR"
        defaultSetting={defaultSetting}
      />
    </div>
  );
}

export default IosDatePicker;
