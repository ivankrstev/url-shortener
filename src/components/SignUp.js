import "./styles/UserForms.css";
import { auth, registerWithEmailAndPassword } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import emailStyleValidator from "./scripts/emailStyleValidator";
import errorHandler from "./scripts/errorHandler";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggleSignUp, setToggleSignUp] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // If user is logged in, navigate to main page
  // eslint-disable-next-line
  useEffect(() => user && navigate("/"), [user]);

  async function runSignUp() {
    const res = await registerWithEmailAndPassword(name, email, password);
    if (res === "registered") {
      toast.success("Successfully Registered");
      setTimeout(() => navigate("/"), 1000);
    } else if (res) errorHandler(res, password);
  }

  // If values are not valid, disable the Sign Up Button
  useEffect(() => {
    if (
      /^[a-zA-Z ]+$/.test(name) &&
      name.split(" ").length > 1 &&
      name.split(" ")[1] !== "" &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) &&
      password === confirmPassword &&
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    )
      document.getElementById("btnSignUp").removeAttribute("disabled");
    else document.getElementById("btnSignUp").setAttribute("disabled", "true");
  }, [name, email, password, confirmPassword]);

  useEffect(() => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      if (confirmPassword !== "") {
        if (password === confirmPassword) {
          document.getElementById("password-confirm").style.borderColor =
            "#90EE90";
          document.getElementById("passwordConfirm-r").style.display = "block";
          document.getElementById("passwordConfirm-x").style.display = "none";
        } else {
          document.getElementById("password-confirm").style.borderColor =
            "#F00";
          document.getElementById("passwordConfirm-r").style.display = "none";
          document.getElementById("passwordConfirm-x").style.display = "block";
        }
      }
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (toggleSignUp) {
      if (name.split(" ").length < 2 || name.split(" ")[1] === "")
        toast.error("Please provide a valid name");
      else if (
        // eslint-disable-next-line
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      )
        toast.error("Please provide a valid email address");
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password))
        toast.error("Please provide a valid password");
      else runSignUp();
      setToggleSignUp(false);
    }
    // eslint-disable-next-line
  }, [toggleSignUp]);

  return (
    <Fragment>
      <div className='login-signup'>
        <h1>Sign Up</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              className='form-control'
              id='name-signup'
              type='text'
              required={true}
              placeholder='Full Name'
              onChange={(e) => {
                setName(e.target.value);
                function func() {
                  if (
                    /^[a-zA-Z ]+$/.test(e.target.value) &&
                    e.target.value.split(" ").length > 1 &&
                    e.target.value.split(" ")[1] !== ""
                  ) {
                    document.getElementById("name-signup").style.borderColor =
                      "#90EE90";
                    document.getElementById("name-r").style.display = "block";
                    document.getElementById("name-x").style.display = "none";
                  } else {
                    document.getElementById("name-signup").style.borderColor =
                      "#F00";
                    document.getElementById("name-r").style.display = "none";
                    document.getElementById("name-x").style.display = "block";
                  }
                }
                func();
              }}
            />
            <span
              className='validator-icon'
              id='name-r'
              style={{ color: "#90EE90", display: "none" }}>
              &#10004;
            </span>
            <span
              className='validator-icon'
              id='name-x'
              style={{ color: "#F00", display: "none" }}>
              &#10006;
            </span>
          </div>
          <div>
            <input
              className='form-control'
              id='email-signup'
              type='email'
              required={true}
              placeholder='Email'
              onChange={(e) => {
                setEmail(e.target.value);
                emailStyleValidator(
                  e.target.value,
                  "email-signup",
                  "email-r",
                  "email-x"
                );
              }}
            />
            <span
              className='validator-icon'
              id='email-r'
              style={{ color: "#90EE90", display: "none" }}>
              &#10004;
            </span>
            <span
              className='validator-icon'
              id='email-x'
              style={{ color: "#F00", display: "none" }}>
              &#10006;
            </span>
          </div>
          <div>
            <input
              className='form-control'
              id='password-signup'
              type='password'
              required={true}
              placeholder='Password'
              onChange={(e) => {
                setPassword(e.target.value);
                function func() {
                  if (
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
                      e.target.value
                    )
                  ) {
                    document.getElementById(
                      "password-signup"
                    ).style.borderColor = "#90EE90";
                    document.getElementById("password-r").style.display =
                      "block";
                    document.getElementById("password-x").style.display =
                      "none";
                  } else {
                    document.getElementById(
                      "password-signup"
                    ).style.borderColor = "#F00";
                    document.getElementById("password-r").style.display =
                      "none";
                    document.getElementById("password-x").style.display =
                      "block";
                  }
                }
                func();
              }}
            />
            <span
              className='validator-icon'
              id='password-r'
              style={{ color: "#90EE90", display: "none" }}>
              &#10004;
            </span>
            <span
              className='validator-icon'
              id='password-x'
              style={{ color: "#F00", display: "none" }}>
              &#10006;
            </span>
          </div>
          <div>
            <input
              className='form-control'
              id='password-confirm'
              type='password'
              required={true}
              placeholder='Confirm Password'
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value === password) {
                  document.getElementById(
                    "password-confirm"
                  ).style.borderColor = "#90EE90";
                  document.getElementById("passwordConfirm-r").style.display =
                    "block";
                  document.getElementById("passwordConfirm-x").style.display =
                    "none";
                } else {
                  document.getElementById(
                    "password-confirm"
                  ).style.borderColor = "#F00";
                  document.getElementById("passwordConfirm-r").style.display =
                    "none";
                  document.getElementById("passwordConfirm-x").style.display =
                    "block";
                }
              }}
            />
            <span
              className='validator-icon'
              id='passwordConfirm-r'
              style={{ color: "#90EE90", display: "none" }}>
              &#10004;
            </span>
            <span
              className='validator-icon'
              id='passwordConfirm-x'
              style={{ color: "#F00", display: "none" }}>
              &#10006;
            </span>
          </div>
          <button
            id='btnSignUp'
            type='submit'
            className='btn btn-outline-primary'
            onClick={() => setToggleSignUp(true)}>
            Sign Up
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default SignUp;
