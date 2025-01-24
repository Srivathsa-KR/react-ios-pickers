import './IosTimepicker.css';
import React, { useState, useRef, useEffect, useMemo } from "react";
import IosWheelpicker, { DEFAULT_SETTING_ENUM } from "../IosWheelpicker/IosWheelpicker";
import {
  TWELVE_HOUR_LIMIT, 
  TWELVE_HOURS_ARRAY_FORMATTED,
  TWENTY_FOUR_HOURS_ARRAY, 
  MINUTE_ARRAY, 
  MERIDIEM_ENUM, 
  MERIDIEM_ARRAY, 
  TIME_FORMAT_ENUM, 
  getSelectedMeridiem, 
  getValue, 
  getTwentyFourHourRepresentation
} from "./IosTimepicker.constants"

function IosTimepicker(props) {
  const { date: selectedDate } = props;
  const [meridiem, setMeridiem] = useState(getSelectedMeridiem(selectedDate));

  const defaultSetting = useRef(DEFAULT_SETTING_ENUM.DEFAULT_TO_START).current;
  const HOUR_ARRAY = useMemo(
    () =>
      props.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT
        ? TWELVE_HOURS_ARRAY_FORMATTED
        : TWENTY_FOUR_HOURS_ARRAY,
    [props.timeFormat]
  );
  const MIN_ARRAY_STATE = useMemo(() => {
    if (!props.intervalStep) {
      return MINUTE_ARRAY;
    } else {
      return MINUTE_ARRAY.filter(
        value => (value % props.intervalStep === 0)
      );
    }
  }, [props.intervalStep]);

  const setNewDate = dateObj => {
    props.onChange(dateObj);
  };

  const updateDate = timestamp => {
    setNewDate(new Date(timestamp));
  };
  useEffect(() => {
    if (
      meridiem == MERIDIEM_ENUM.AM &&
      selectedDate.getHours() >= TWELVE_HOUR_LIMIT
    ) {
      updateDate(
        selectedDate.setHours(selectedDate.getHours() - TWELVE_HOUR_LIMIT)
      );
    } else if (
      meridiem == MERIDIEM_ENUM.PM &&
      selectedDate.getHours() < TWELVE_HOUR_LIMIT
    ) {
      updateDate(
        selectedDate.setHours(selectedDate.getHours() + TWELVE_HOUR_LIMIT)
      );
    }
  }, [meridiem]);

  const onHourChange = changedHourIndex => {
    console.log({ changedHourIndex });
    if (props.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      if (
        meridiem === MERIDIEM_ENUM.PM &&
        TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex] !== TWELVE_HOUR_LIMIT
      ) {
        updateDate(
          selectedDate.setHours(
            getTwentyFourHourRepresentation(
              TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex]
            )
          )
        );
      } else if (
        meridiem === MERIDIEM_ENUM.AM &&
        TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex] === TWELVE_HOUR_LIMIT
      ) {
        updateDate(selectedDate.setHours(0));
      } else {
        updateDate(selectedDate.setHours(TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex]));
      }
    } else if (props.timeFormat === TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT) {
      updateDate(
        selectedDate.setHours(TWENTY_FOUR_HOURS_ARRAY[changedHourIndex])
      );
    }
  };

  const onMinuteChange = changedMinuteIndex => {
    updateDate(selectedDate.setMinutes(MIN_ARRAY_STATE[changedMinuteIndex]));
  };

  const onMeridiemChange = changedMeridiemIndex => {
    setMeridiem(MERIDIEM_ARRAY[changedMeridiemIndex]);
  };

  const getIndexOfSelectedHour = () => {
    if (props.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      return TWELVE_HOURS_ARRAY_FORMATTED.indexOf(
        getValue(selectedDate.getHours(), TWELVE_HOUR_LIMIT)
      );
    } else if (props.timeFormat === TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT) {
      return TWENTY_FOUR_HOURS_ARRAY.indexOf(selectedDate.getHours());
    }
  };

  return (
    <div className="timepicker">
      <IosWheelpicker
        dataList={HOUR_ARRAY}
        indexOfSelected={getIndexOfSelectedHour()}
        onValueChange={onHourChange}
        type="HOUR"
        defaultSetting={defaultSetting}
      />
      <IosWheelpicker
        dataList={MIN_ARRAY_STATE}
        indexOfSelected={MIN_ARRAY_STATE.indexOf(selectedDate.getMinutes())}
        onValueChange={onMinuteChange}
        targetValue={selectedDate.getMinutes()}
        type="MINUTE"
        defaultSetting={DEFAULT_SETTING_ENUM.DEFAULT_TO_CLOSEST}
      />
      {props.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT && (
        <IosWheelpicker
          dataList={MERIDIEM_ARRAY}
          indexOfSelected={MERIDIEM_ARRAY.indexOf(meridiem)}
          onValueChange={onMeridiemChange}
          type="MERIDIEM"
          defaultSetting={defaultSetting}
        />
      )}
    </div>
  );
}
export default IosTimepicker;
