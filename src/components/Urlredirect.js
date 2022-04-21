import NotFound from "./NotFound";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import moment from "moment";

function Urlredirect() {
  const params = useParams();
  const [status, setStatus] = useState("");

  const id = params;
  console.log(id);

  async function checkData(params) {
    setStatus("loading");
    const docRef = doc(db, "links", params["*"]);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().user) {
        await updateDoc(docRef, {
          countOpener: docSnap.data().countOpener + 1,
          lastAccessed: moment().format("dddd, Do MMMM YYYY, h:mm:ss"),
        });
        try {
          // We use try because the fetch can be blocked by Ad Blocker
          const ip = await fetch("https://api.ipify.org/?format=json").then(
            (res) => res.json().then((res) => res.ip)
          );
          await updateDoc(docRef, {
            ipaddress: arrayUnion(ip),
          });
        } catch (e) {
          console.log(e);
        }
      }
      setStatus(docSnap.data().targetUrl);
    } else {
      setStatus("notfound");
    }
  }

  useEffect(() => {
    checkData(params);
    return () => {
      setStatus(undefined);
    };
  }, []);

  useEffect(() => {
    function run(link) {
      window.location.href = link;
      return null;
    }
    if (status !== "loading") {
      if (status && status !== "notfound") {
        run(status);
      } else if (status === "notfound") {
      } else if (status) run("/");
    }
  }, [status]);

  useEffect(() => console.log(status), [status]);

  return (
    <div className='mt-5'>
      {status === "loading" && (
        <div
          style={{
            width: "7rem",
            height: "7rem",
            marginTop: "14rem",
          }}
          className='spinner-border text-primary fs-3'
          role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      )}
      {status === "notfound" && <NotFound />}
    </div>
  );
}

export default Urlredirect;
