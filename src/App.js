import './App.css';
import { useState } from 'react';
import { format } from "date-fns";
import IosDatePicker from "./components/IosDatepicker/IosDatepicker"
import { ALLOWED_DATES_ENUM } from './components/IosDatepicker/IosDatepicker.constants';
import IosTimepicker from './components/IosTimepicker/IosTimepicker';
import { TIME_FORMAT_ENUM } from './components/IosTimepicker/IosTimepicker.constants';

function App() {

  const [selectedFutureDate, setFutureDate] =useState(new Date());
  const [selectedPastDate, setPastDate] = useState(new Date());
  const [dateFor12HourTime, setDate12HourTime] = useState(new Date());
  const [dateFor24HourTime, setDate24HourTime] = useState(new Date());

  return (
    <div className="app-container">
    <div className="widget-container dates-container">
        <div className="date-picker-container">
            <p className="selected-date"> {format(selectedFutureDate, 'dd MMM y')}</p>
            <IosDatePicker date={selectedFutureDate} allowedDates={ALLOWED_DATES_ENUM.FUTURE_DATES} onDateChange={setFutureDate}></IosDatePicker>
        </div>
        <div className="date-picker-container">
            <p className="selected-date"> {format(selectedPastDate, 'dd MMM y')}</p>
            <IosDatePicker date={selectedPastDate} allowedDates={ALLOWED_DATES_ENUM.PAST_DATES} onDateChange={setPastDate} />
        </div>
    </div>
    <div className="widget-container time-container">
        <div className="time-picker-container">
            <p className="selected-time"> {format(dateFor12HourTime, 'h:mm a')	}</p>
            <IosTimepicker date={dateFor12HourTime} timeFormat={TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT} onChange={setDate12HourTime}></IosTimepicker>
        </div>
        <div className="time-picker-container">
            <p className="selected-time"> {format(dateFor24HourTime, 'HH:mm')}</p>
            <IosTimepicker date={dateFor24HourTime} timeFormat={TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT} onChange={setDate24HourTime} intervalStep={15} />
        </div>
    </div>
</div>
  );
}

export default App;
