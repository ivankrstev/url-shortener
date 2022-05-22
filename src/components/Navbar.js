import { auth, logOut } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Loader";

function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // if (loading)
    //   document.querySelector(".navbar-corner").className += " spinner-border";
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
          <Loader id='navbar-loader' />
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
              <Link to='/profile' className='dropdown-item d-flex'>
                Your Profile
              </Link>
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
