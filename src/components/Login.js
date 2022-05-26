import "./styles/UserForms.css";
import { auth, logInWithEmailAndPassword } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import emailStyleValidator from "./scripts/emailStyleValidator";
import errorHandler from "./scripts/errorHandler";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);

  // If user is logged in, navigate to main page
  // eslint-disable-next-line
  useEffect(() => user && navigate("/"), [user]);
  // If values are not valid, disable the Log In Button
  useEffect(() => {
    if (
      password.length > 7 &&
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    )
      document.getElementById("btnLogin").removeAttribute("disabled");
    else document.getElementById("btnLogin").setAttribute("disabled", "true");
  }, [email, password]);

  async function runLogin() {
    const res = await logInWithEmailAndPassword(email, password);
    if (res === "loggedin") {
      toast.success("Successfully Logged In");
      navigate("/");
    } else if (res) errorHandler(res, password);
  }

  return (
    <div className='login-signup'>
      <h1>Login</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            className='form-control'
            id='email-login'
            type='email'
            required={true}
            placeholder='Email'
            onChange={(e) => {
              setEmail(e.target.value);
              emailStyleValidator(
                e.target.value,
                "email-login",
                "logine-r",
                "logine-x"
              );
            }}
          />
          <span
            className='validator-icon'
            id='logine-r'
            style={{ color: "#90EE90", display: "none" }}>
            &#10004;
          </span>
          <span
            className='validator-icon'
            id='logine-x'
            style={{ color: "#F00", display: "none" }}>
            &#10006;
          </span>
        </div>
        <div>
          <input
            className='form-control'
            id='password-login'
            type='password'
            required={true}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          id='btnLogin'
          type='submit'
          className='btn btn-outline-primary mb-2'
          onClick={runLogin}>
          Login
        </button>
      </form>
      <Link to='/reset-password' className='btn btn-sm btn-outline-primary'>
        Reset Password
      </Link>
    </div>
  );
}

export default Login;
