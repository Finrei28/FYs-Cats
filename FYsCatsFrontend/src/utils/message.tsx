import React, { useState, useEffect } from "react";

type MessageProps = {
  message: string;
  duration?: number; // Optional duration for how long the message should be visible
  setsuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  success: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

const Message: React.FC<MessageProps> = ({
  message,
  duration = 3000,
  setsuccess,
  setMessage,
  success,
  setError,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration); // Duration after which to start fading out
    const successTimer = setTimeout(() => {
      setsuccess(false);
      setMessage("");
      setError(false);
    }, duration + 2000);

    // Clear timeout if the component unmounts before the timeout completes
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(successTimer);
    };
  }, [duration, setsuccess]);

  return (
    <div
      className={`${success ? "success" : "error"} message ${!isVisible ? "fade-out" : ""}`}
    >
      {message}
    </div>
  );
};

export default Message;
