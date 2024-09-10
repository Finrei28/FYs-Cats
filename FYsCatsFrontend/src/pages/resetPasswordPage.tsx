import { ChangeEvent, FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormRow from "../utils/formRow";
import LocalStates from "../utils/localStates";
import "../index.css";
import { resetPassword } from "../components/services";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    alert,
    showAlert,
    hideAlert,
    loading,
    setLoading,
    success,
    setSuccess,
  } = LocalStates();

  const query = useQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // showAlert({text:'This function is unavailable', type:'danger'})
    // return
    hideAlert();
    setLoading(true);
    if (!password) {
      showAlert({ text: "please enter password" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      showAlert({ text: "Passwords do not match" });
      setLoading(false);
      return;
    }
    const token = query.get("token");
    const email = query.get("email");
    if (password && token && email) {
      const result = await resetPassword(password, token, email);
      if (result === "true") {
        setLoading(false);
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        showAlert({
          text: `Password has been changed, redirecting to Home page shortly`,
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        showAlert({ text: result });
        setLoading(false);
      }
    }
  };
  return (
    <div className="resetPassword-container">
      <img
        className="logo"
        src="https://res.cloudinary.com/dpwtcr4cz/image/upload/t_cropped logo/v1725073729/FYs-Cats_logo_msv4qf.png"
        alt="FYs Cats Logo"
      />
      {!success ? (
        <form
          className={loading ? "form form-loading" : "resetPassword-form"}
          onSubmit={handleSubmit}
        >
          <h1 style={{ textAlign: "center" }}>Reset Password</h1>
          <FormRow
            type="password"
            label="password"
            name="password"
            value={password}
            handlechange={handleChange}
          />
          <FormRow
            type="password"
            label="Confirm Password"
            name="confirmpassword"
            value={confirmPassword}
            handlechange={(e) => setConfirmPassword(e.target.value)}
          />
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>{alert.text}</div>
          )}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Please Wait..." : "Change Password"}
          </button>
        </form>
      ) : (
        alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.text}</div>
        )
      )}
    </div>
  );
};

export default ResetPasswordForm;
