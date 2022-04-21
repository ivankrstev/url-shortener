import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getDocs, collection, query, where } from "firebase/firestore";
import Popup from "./Popup";

function Profile(props) {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [data, setData] = useState();
  const [links, setLinks] = useState([]);
  const [popupData, setPopupData] = useState();

  useEffect(() => {
    setData(props.userData);
  }, [props]);

  useEffect(() => {
    if (!user && !loading) {
      toast.error("You are not logged in");
      navigate("/");
    }
  }, [user, loading]);

  useEffect(async () => {
    if (user) {
      const l = query(collection(db, "links"), where("user", "==", user.uid));
      const linksSnapshot = await getDocs(l);
      linksSnapshot.forEach((doc) =>
        setLinks((elements) => [...elements, { id: doc.id, ...doc.data() }])
      );
      if (linksSnapshot) {
      }
    }
  }, [user]);

  useEffect(() => {
    console.log(links);
  }, [links]);

  useEffect(() => {
    console.log(popupData);
  }, [popupData]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className='mt-5 d-flex text-start flex-column align-items-center h-75'>
      {popupData && <Popup id={popupData} setModalData={setPopupData} />}
      <h1>Profile</h1>
      <div className='w-75 flex-column align-items-start'>
        {data && (
          <Fragment>
            <h3>Your Name: {data.name}</h3>
            <h4 className='text-start'>Your email: {data.email}</h4>
            <p className='mb-0'>Your Links:</p>
          </Fragment>
        )}
        {links ? (
          <Fragment>
            <ul>
              {links.length > 0 ? (
                links.map((e) => (
                  <li className='mt-1' style={{ textAlign: "left" }} key={e.id}>
                    <Link to={"/" + e.id}>urlsh1.web.app/{e.id}</Link>
                    <button
                      onClick={() => setPopupData(e.id)}
                      className='ms-1 btn btn-sm btn-outline-primary stats-btn'>
                      View Stats
                    </button>
                  </li>
                ))
              ) : (
                <li>You don't have any URLs.</li>
              )}
            </ul>
          </Fragment>
        ) : (
          <p>Error!</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
