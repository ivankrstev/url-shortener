import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import useDetectOffline from "use-detect-offline";
import { toast } from "react-toastify";

function Urlredirect() {
  const params = useParams();
  const [status, setStatus] = useState("loading");
  const [wasOffline, setWasOffline] = useState(false);
  const { offline } = useDetectOffline();

  async function checkData(params) {
    const docRef = doc(db, "links", params["*"]);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().user) {
        await updateDoc(docRef, {
          countOpener: docSnap.data().countOpener + 1,
          lastAccessed: Date.now(),
        });
        try {
          // We use try because the fetch can be blocked by Ad Blocker
          // const ip = await fetch("https://api.ipify.org/?format=json").then(
          //   (res) => res.json().then((res) => res.ip)
          // );
          const ipData = await fetch("https://geolocation-db.com/json/").then(
            (res) => res.json().then((res) => res)
          );
          await updateDoc(docRef, {
            ipAddress: arrayUnion(
              ipData.IPv4 + " - " + ipData.city + ", " + ipData.country_name
            ),
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
    if (!navigator.onLine) {
      toast.error("You are offline");
      setWasOffline(true);
    }
    return () => {
      setStatus(undefined);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // If the user was offline and then went back online, run the redirect
    if (wasOffline && !offline) checkData(params);
    // eslint-disable-next-line
  }, [offline]);

  useEffect(() => {
    function run(link) {
      window.location.href = link;
      return null;
    }
    if (status && status !== "loading" && status !== "notfound") run(status);
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
          className='spinner-border text-primary fs-2'
          role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      )}
      {status === "notfound" && <NotFound />}
    </div>
  );
}

export default Urlredirect;
