import "./styles/Main.css";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import QRcode from "./QRcode";

function Main() {
  const [user] = useAuthState(auth);
  const [targetUrl, setTargetUrl] = useState("");
  const [customLinkPath, setCustomLinkPath] = useState("");
  const [result, setResult] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [localUrls, setLocalUrls] = useState(
    JSON.parse(localStorage.getItem("recentUrls")) || []
  );
  const [createLink, setCreateLink] = useState(false);
  const [status, setStatus] = useState(false);

  const linkCanBeUsed = async (customLinkPath) => {
    // Check id of documents in collection "links"
    // To get only IDS (used as paths) from Firestore
    let status; // variable 'status' for returning false if there is same value as provided
    const querySnapshot = await getDocs(collection(db, "links"));
    querySnapshot.forEach(
      (doc) => doc.id === customLinkPath && (status = "false")
    );
    if (status === "false") return false;
    else return true;
  };

  const handleTargetUrlValidate = (targetUrl) => {
    // Handle Target Url style validation
    if (
      // eslint-disable-next-line
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
        targetUrl
      )
    ) {
      document.querySelector("#mainUrl-r").style.display = "block";
      document.querySelector("#mainUrl-x").style.display = "none";
    } else {
      document.querySelector("#mainUrl-r").style.display = "none";
      document.querySelector("#mainUrl-x").style.display = "block";
    }
  };

  const resetLinkForm = () => {
    document.querySelector("#mainUrl-r").style.display = "none";
    document.querySelector("#mainUrl-x").style.display = "none";
    document.querySelector("#targetUrl").value = "";
    document.querySelector("#custom-url").value = "";
    setCustomLinkPath("");
    setTargetUrl("");
  };

  useEffect(() => {
    if (result !== "") {
      let items = JSON.parse(localStorage.getItem("recentUrls")) || [];
      items.push(result);
      localStorage.setItem("recentUrls", JSON.stringify(items));
      setLocalUrls(JSON.parse(localStorage.getItem("recentUrls")));
    }
  }, [result]);

  async function handleShortener() {
    let res, idForDocument, generatedID;
    if (
      customLinkPath === "login" ||
      customLinkPath === "signup" ||
      customLinkPath === "reset-password" ||
      customLinkPath === "profile" ||
      customLinkPath === "notfound"
    ) {
      setStatus(`The path ${customLinkPath} is reserved.`);
    } else {
      if (targetUrl !== "") {
        if (
          // eslint-disable-next-line
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
            targetUrl
          )
        ) {
          if (customLinkPath !== "") {
            res = await linkCanBeUsed(customLinkPath);
            if (res) idForDocument = customLinkPath;
          } else {
            while (!res) {
              generatedID = new Date().getTime().toString(36);
              res = await linkCanBeUsed(generatedID);
            }
            if (res) idForDocument = generatedID;
          }
          if (res === false && customLinkPath !== "") {
            setStatus("exists");
            document.querySelector("#custom-url").value = "";
            setCustomLinkPath("");
          } else if (res === true) {
          } else setStatus("error");
        } else setStatus("invalid");
      } else setStatus("nourl");
    }
    return idForDocument;
  }

  async function createLinkFunc(idForDocument) {
    try {
      await setDoc(doc(db, "links", idForDocument), {
        targetUrl,
        user: user?.uid || null,
        countOpener: 0,
        ipAddress: [],
        dateCreated: Date.now(),
        lastAccessed: "No accessed yet.",
      });
      toast.success("Successfully Shortened");
      setResult(idForDocument);
      setStatus("created");
      setBtnLoading(false);
      setCreateLink(false);
      resetLinkForm();
    } catch (e) {
      let res;
      let arr = e.message.split(" ");
      for (let a of arr) {
        if (a === "Missing" || a === "insufficient" || a === "permissions")
          res = "exists";
      }
      if (res !== "exists") {
        setStatus(e);
        console.error("Error adding link: \n", e);
      } else if (res === "exists" && customLinkPath === "") {
        // I use this in case there is a same generatedID on 2 clients
        res = undefined;
        // I use the next 2 lines to run the whole functions again in useEffect Hook [createLink]
        setCreateLink(false);
        setCreateLink(true);
      } else if (res === "exists") setStatus("exists");
    }
  }
  useEffect(() => {
    //  immediately run
    if (createLink) {
      (async function runImmediately() {
        const result = await handleShortener();
        if (result) createLinkFunc(result);
        else {
          setBtnLoading(false);
          setCreateLink(false);
          setStatus(false);
          setCreateLink(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [createLink]);

  useEffect(() => {
    status && setBtnLoading(false);
    if (status === "created") {
      resetLinkForm();
    } else if (status === "invalid")
      toast.error("Please provide a valid URL address");
    else if (status === "exists") {
      toast.error("That custom URL already exists");
      document.querySelector("#custom-url").value = "";
      setCustomLinkPath("");
    } else if (status === "nourl") toast.error("Please provide an URL address");
    else if (status === "error") toast.error("An error occurred");
    else if (status) toast.error(status);
  }, [status]);

  return (
    <Fragment>
      <div className='main row justify-content-center align-items-start m-md-0 mt-5 mt-md-5'>
        <div className='maxw-80 col-12 col-md-6 d-flex justify-content-center'>
          <form
            className='d-flex justify-content-center'
            onSubmit={(e) => e.preventDefault()}>
            <div className='target-url d-flex flex-column align-items-start'>
              <label className='form-label' htmlFor='targetUrl'>
                Enter the Target Url to create a URLSH URL
              </label>
              <div className='w-100 position-relative'>
                <input
                  id='targetUrl'
                  type='text'
                  placeholder='Target Url'
                  className='form-control w-100'
                  required={true}
                  onChange={(e) => {
                    handleTargetUrlValidate(e.target.value);
                    setTargetUrl(e.target.value);
                  }}
                />
                <span className='validator-icon' id='mainUrl-r'>
                  &#10004;
                </span>
                <span className='validator-icon' id='mainUrl-x'>
                  &#10006;
                </span>
              </div>
            </div>
            <div className='mt-2 d-flex flex-column align-items-start'>
              <label className='form-label' htmlFor='custom-url'>
                Enter a custom URL or leave it blank for random
              </label>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon3'>
                  /
                </span>
                <input
                  className='form-control'
                  id='custom-url'
                  type='text'
                  placeholder='Custom Url'
                  onChange={(e) => setCustomLinkPath(e.target.value)}
                />
              </div>
            </div>
            <button
              id='btn-shorten'
              className='btn btn-primary w-75 mb-4'
              type='submit'
              onClick={async () => {
                setBtnLoading(true);
                setCreateLink(true);
              }}>
              {btnLoading ? <Loader className='fs-6' /> : "Shorten"}
            </button>
          </form>
        </div>
        <div className='maxw-80 col-12 col-md-6 mt-4 mt-md-0'>
          <div className='d-flex align-items-baseline'>
            <h5>Recent URLs: </h5>
            {(localStorage.getItem("recentUrls") || result) && (
              <button
                className='ms-3 btn btn-clear btn-sm btn-outline-danger d-flex align-items-center'
                onClick={() => {
                  localStorage.removeItem("recentUrls");
                  setResult("");
                  setLocalUrls([]);
                }}>
                <i className='bi bi-trash me-1'></i>
                <span>Clear All</span>
              </button>
            )}
          </div>
          <ul className='recentUrls'>
            {localUrls.length > 0 ? (
              localUrls.map((e) => (
                <li key={e} className='d-flex link mt-1'>
                  <div className='d-flex align-items-center'>
                    <Link to={"/" + e}>
                      {window.location.hostname + "/" + e}
                    </Link>
                    <button
                      onClick={(event) => {
                        navigator?.clipboard?.writeText(
                          event.currentTarget.previousElementSibling.textContent
                        );
                      }}
                      title='Copy to clipboard'
                      className='btn btn-outline-primary ms-2 btn-copy'>
                      <i className='bi bi-files'></i>
                    </button>
                    <QRcode
                      elID={e}
                      link={window.location.hostname + "/" + e}
                    />
                    <button
                      title='Share'
                      onClick={() => {}}
                      className='btn btn-outline-primary ms-1 share-btn'>
                      <i className='bi bi-share'></i>
                    </button>
                    <a
                      href={
                        "mailto:?subject=Link%20Sharing%20from%20Url%20Shortener&body=https://" +
                        window.location.hostname +
                        "/" +
                        e
                      }>
                      Send mail
                    </a>
                  </div>
                </li>
              ))
            ) : (
              <li className='text-start'>No recent URLs</li>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default Main;
