import { auth, logOut } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (loading)
      document.querySelector(".navbar-corner").className += " spinner-border";
    if (user) {
      setIsLoggedIn(true);
    } else setIsLoggedIn(false);
  }, [user, loading]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "1em",
        padding: "1em",
      }}>
      <Link className='btn' to='/'>
        Home
      </Link>
      <div className='d-flex align-items-baseline'>
        {loading ? (
          <div
            className='d-flex align-items-center navbar-corner text-primary'
            role='status'></div>
        ) : isLoggedIn ? (
          <div className='dropdown text-primary ms-3'>
            <button
              className='btn btn-primary dropdown-toggle'
              type='button'
              id='dropdownMenuButton1'
              data-bs-toggle='dropdown'
              aria-expanded='false'>
              <i className='bi bi-person-circle'></i>
            </button>
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
              <Link to='/profile' className='dropdown-item d-flex minw-100'>
                Your Profile
              </Link>
              <li className='dropdown-item'>
                <div className='form-check form-switch'>
                  <label
                    className='form-check-label'
                    htmlFor='flexSwitchCheckDefault'>
                    Dark Mode
                  </label>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    role='switch'
                    id='flexSwitchCheckDefault'
                    onChange={(e) => {
                      let bgColor = document.body.style.backgroundColor;
                      console.log(bgColor);
                      if (bgColor === "#404040") console.log("#404040");
                    }}
                  />
                </div>
              </li>
              <li>
                <button onClick={logOut} className='dropdown-item' href='#'>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <Link className='btn' to='/signup'>
              Sign Up
            </Link>
            <Link className='btn' to='/login'>
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
