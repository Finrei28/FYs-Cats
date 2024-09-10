import { useState } from "react";

type alertProp = {
  text: string;
  type?: string;
};

const LocalState = () => {
  const [alert, setAlert] = useState({
    show: false,
    text: "",
    type: "danger",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const showAlert = ({ text, type = "danger" }: alertProp) => {
    setAlert({ show: true, text, type });
  };
  const hideAlert = () => {
    setAlert({ show: false, text: "", type: "danger" });
  };
  return {
    alert,
    showAlert,
    loading,
    setLoading,
    success,
    setSuccess,
    hideAlert,
    error,
    setError,
  };
};

export default LocalState;
