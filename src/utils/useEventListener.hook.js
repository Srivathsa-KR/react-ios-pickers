import React, {
    useEffect,
    useRef,
  } from "react";
export default function useEventListener(eventName, handler, shouldAddEvent, element = document) {
    const savedHandler = useRef(); //Ref to store reference to the eventHandler
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
  
    useEffect(
        () => {
          if (shouldAddEvent) {
            const isEventListenerSupported = element && element.addEventListener;
            if (!isEventListenerSupported) return;
            const eventListener = event => savedHandler.current(event);
    
            // Add event listener
            element.addEventListener(eventName, eventListener);
    
            // Remove event listener on cleanup
            return () => {
              element.removeEventListener(eventName, eventListener);
            };
          }
        },
      [eventName, element, shouldAddEvent] // Re-run if eventName or element changes
    );
  }