import React, {
    useEffect,
    useRef,
  } from "react";
export default function useDebounce(callback, delay) {
    const timeoutRef = useRef(null); //Ref to store reference to the eventHandler
    
    return () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
    };
  }