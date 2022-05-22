import "./App.css";
import { Fragment, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Urlredirect from "./components/Urlredirect";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import PasswordReset from "./components/PasswordReset";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

function App() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState();

  useEffect(() => {
    async function getUser() {
      if (user) {
        const u = query(collection(db, "users"), where("uid", "==", user.uid));
        const usersSnapshot = await getDocs(u);
        usersSnapshot.forEach((doc) => setUserData(doc.data()));
      }
    }
    getUser();
    if (loading) setUserData("loading");
  }, [user]);

  return (
    <div className='App'>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={true}
        draggable={false}
        pauseOnHover={false}
      />
      <Routes>
        <Route
          exact
          path='/'
          element={
            <Fragment>
              <Navbar />
              <Main />
            </Fragment>
          }
        />
        <Route
          exact
          path='/signup'
          element={
            <Fragment>
              <Navbar />
              <SignUp />
            </Fragment>
          }
        />
        <Route
          exact
          path='/login'
          element={
            <Fragment>
              <Navbar />
              <Login />
            </Fragment>
          }
        />
        <Route
          exact
          path='/reset-password'
          element={
            <Fragment>
              <Navbar />
              <PasswordReset />
            </Fragment>
          }
        />
        <Route
          exact
          path='/profile'
          element={
            <Fragment>
              <Navbar />
              <Profile userData={userData} />
            </Fragment>
          }
        />
        <Route path='*' element={<Urlredirect />} />
      </Routes>
    </div>
  );
}

export default App;
