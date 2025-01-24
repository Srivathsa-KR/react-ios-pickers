import './IosWheelpicker.css';
import React, {
    useState,
    useRef,
    useMemo,
    useEffect,
  } from "react";

import useEventListener from "../../utils/useEventListener.hook";
import useDebounce from "../../utils/useDebounce.hook";

import { getClosestArrayElementToTarget } from "../../utils/utils";


export const DEFAULT_SETTING_ENUM = {
  DEFAULT_TO_START: "DEFAULT_TO_START",
  DEFAULT_TO_END: "DEFAULT_TO_END",
  DEFAULT_TO_CLOSEST: "DEFAULT_TO_CLOSEST"
}

const LIST_ITEM_HEIGHT = 50; //Height of each Item : px

const computeSelectedItemPosition = (itemIndex) => {
  return -1 * itemIndex * LIST_ITEM_HEIGHT;
};

const getClientY = (pointerEvent) => {
  return pointerEvent.touches ? pointerEvent.touches[0].clientY : pointerEvent.clientY;
}

function IosWheelpicker(props) {

  const MAX_POSSIBLE_POSITION = useMemo(() => {
    return -1 * (props.dataList.length - 1) * LIST_ITEM_HEIGHT;
  }, [props.dataList.length]);

  const getDefaultIndex = (defaultSetting, targetValue = props.dataList[0]) => {
    if (defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_END) {
      return props.dataList.length - 1;
    } else if (defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_START) {
      return 0;
    } else if (defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_CLOSEST) {
      const closestElement = getClosestArrayElementToTarget(
        targetValue,
        props.dataList
      );
      return props.dataList.indexOf(closestElement);
    }
  };

  const offsetRef = useRef(0);
  const elementRef = useRef(null);
  //const scrollTimeoutRef = useRef(null);

  const [isDragging, setDraggingFlag] = useState(false);
  const previousYCoordinateRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(
    props.indexOfSelected
      ? computeSelectedItemPosition(props.indexOfSelected)
      : 0
  );

  useEffect(() => {
    const { indexOfSelected, defaultSetting } = props;
    if (indexOfSelected === -1) {
      //Item not in the array
      const defaultIndex = getDefaultIndex(defaultSetting, props.targetValue);
      props.onValueChange(defaultIndex);
    } else {
      const computedPosition = computeSelectedItemPosition(indexOfSelected);
      setCurrentPosition(computedPosition);
    }
  }, [props.indexOfSelected, MAX_POSSIBLE_POSITION]);

  const setActivePositionAndOffset = offsetAmt => {
    const computedPosition = currentPosition + offsetAmt;
    offsetRef.current = offsetAmt;
    const positionToBeSet = Math.max(
      MAX_POSSIBLE_POSITION,
      Math.min(LIST_ITEM_HEIGHT, computedPosition)
    );
    setCurrentPosition(positionToBeSet);
  };

  const handleScrollEnd = () => {
    const posToBeRounded = currentPosition + offsetRef.current * 5;
    const roundedPosition =
      Math.round(posToBeRounded / LIST_ITEM_HEIGHT) * LIST_ITEM_HEIGHT;
    const finalPosition = Math.max(
      MAX_POSSIBLE_POSITION,
      Math.min(0, roundedPosition)
    );
    props.onValueChange((-1 * finalPosition) / LIST_ITEM_HEIGHT);
    setCurrentPosition(finalPosition);
  };

  const handleMouseMove = event => {
    const currentYCoordinate = getClientY(event); //handling multiple touches at any given time
    const computedOffset = currentYCoordinate - previousYCoordinateRef.current;
    previousYCoordinateRef.current = currentYCoordinate;
    setActivePositionAndOffset(computedOffset);
  };

  const handleMouseUp = () => {
    handleScrollEnd();
    setDraggingFlag(false);
  };

  const handleMouseDown = event => {
    previousYCoordinateRef.current = getClientY(event); //handling multiple touches at any given time
    setDraggingFlag(true);
  };

  const handleScrollEndDebouce = useDebounce(handleScrollEnd, 225);

  const onWheelMoved = event => {
    //window.clearTimeout(scrollTimeoutRef.current);
    const scrollAmt = event.deltaY * -1;
    setActivePositionAndOffset(scrollAmt);
    handleScrollEndDebouce();
    //scrollTimeoutRef.current = setTimeout(handleScrollEnd, 225);
    return false;
  };

  useEventListener("mousemove", handleMouseMove, isDragging, elementRef.current);
  useEventListener("touchmove", handleMouseMove, isDragging, elementRef.current);
  useEventListener("mouseup", handleMouseUp, isDragging);
  useEventListener("touchend", handleMouseUp, isDragging);

  useEventListener("mouseup", handleMouseUp, isDragging, elementRef.current);
  useEventListener("touchend", handleMouseUp, isDragging, elementRef.current);

  const inlineListStyle = {
    transition: `transform ${Math.abs(offsetRef.current) / 100 + 0.1}s`,
    transform: `translateY(${currentPosition}px)`
  };

  return (
    <div
      className="wheel-picker-container"
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onWheel={onWheelMoved}
    >
      <div className="wheel-container">
        <ul className="handle" style={inlineListStyle}>
          {props.dataList.map(listItem => (
            <li key={listItem}>{listItem}</li>
          ))}
        </ul>
      </div>
      <div className="overlay-panel">
        <div className="active-panel" />
      </div>
    </div>
  );
}

export default IosWheelpicker;
