import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth, sendPasswordReset } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import emailStyleValidator from "./scripts/emailStyleValidator";
import errorHandler from "./scripts/errorHandler";

function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [user] = useAuthState(auth);
  // eslint-disable-next-line
  useEffect(() => user && navigate("/"), [user]);
  useEffect(() => {
    if (
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    )
      document.getElementById("resetPwdBtn").removeAttribute("disabled");
    else
      document.getElementById("resetPwdBtn").setAttribute("disabled", "true");
  }, [email]);

  async function runReset() {
    const res = await sendPasswordReset(email);
    if (res === "sent") {
      toast.success("Password reset link sent");
      setTimeout(() => navigate("/login"), 1000);
    } else if (res) errorHandler();
  }

  return (
    <div className='login-signup'>
      <h2>Reset your password</h2>
      <p>You will get an email with reset link</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            className='form-control'
            id='email-reset'
            type='email'
            required={true}
            placeholder='Enter email address'
            onChange={(e) => {
              setEmail(e.target.value);
              emailStyleValidator(
                e.target.value,
                "email-reset",
                "reset-r",
                "reset-x"
              );
            }}
          />
          <span
            className='validator-icon'
            id='reset-r'
            style={{ color: "#90EE90", display: "none" }}>
            &#10004;
          </span>
          <span
            className='validator-icon'
            id='reset-x'
            style={{ color: "#F00", display: "none" }}>
            &#10006;
          </span>
        </div>
        <button
          onClick={runReset}
          id='resetPwdBtn'
          type='submit'
          className='btn btn-outline-primary'>
          Send Link
        </button>
      </form>
    </div>
  );
}

export default PasswordReset;
