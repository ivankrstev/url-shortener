import "./styles/Main.css";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

async function checkAllPaths(customLinkPath) {
  // Check id of documents in collection "links"
  // To get only IDS (used as paths) from Firestore
  let status; // variable 'status' for returning false if there is same value as provided
  const querySnapshot = await getDocs(collection(db, "links"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id);
    if (doc.id === customLinkPath) {
      console.log("FALSEEEE");
      status = "false";
    }
  });
  console.log(Date.now() + " Done Query");
  if (status === "false") return false;
  else return true;
}

function Main() {
  const [user] = useAuthState(auth);
  const [targetUrl, setUrlToRedirect] = useState("");
  const [customLinkPath, setCustomLinkPath] = useState("");
  const [result, setResult] = useState("");
  const [localUrls, setLocalUrls] = useState(
    JSON.parse(localStorage.getItem("recenturls")) || []
  );
  useEffect(() => {
    // Handle validation
    if (targetUrl !== "") {
      if (
        targetUrl !== "" &&
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
          targetUrl
        )
      ) {
        document.querySelector("#mainurl-r").style.display = "block";
        document.querySelector("#mainurl-x").style.display = "none";
      } else {
        document.querySelector("#mainurl-r").style.display = "none";
        document.querySelector("#mainurl-x").style.display = "block";
      }
    }
  }, [targetUrl]);

  useEffect(() => {
    if (result !== "") {
      let items = JSON.parse(localStorage.getItem("recenturls")) || [];
      items.push(result);
      localStorage.setItem("recenturls", JSON.stringify(items));
      setLocalUrls(JSON.parse(localStorage.getItem("recenturls")));
    }
  }, [result]);

  async function runShortener(targetUrl, customLinkPath, user) {
    let res, status, idForDocument, generatedID;
    if (
      customLinkPath === "login" ||
      customLinkPath === "signup" ||
      customLinkPath === "reset-password" ||
      customLinkPath === "profile"
    ) {
      toast.error(`The path ${customLinkPath} is reserved.`);
    } else {
      if (targetUrl !== "") {
        if (
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
            targetUrl
          )
        ) {
          if (customLinkPath !== "") {
            res = await checkAllPaths(customLinkPath);
            if (res) idForDocument = customLinkPath;
          } else {
            const random = (min, max) =>
              Math.floor(Math.random() * (max - min)) + min;
            let length = random(3, 7);
            function makeid(length) {
              var result = "";
              var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              var charactersLength = characters.length;
              for (var i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * charactersLength)
                );
              }
              return result;
            }
            while (!res) {
              generatedID = makeid(length);
              res = await checkAllPaths(generatedID);
            }
            if (res) idForDocument = generatedID;
          }

          if (res === false) {
            toast.error("That custom URL already exists");
            document.querySelector("#custom-url").value = "";
          } else if (res === true) {
            try {
              await setDoc(doc(db, "links", idForDocument), {
                targetUrl,
                user: user || null,
                countOpener: 0,
                ipaddress: [],
                dateCreated: moment().format("dddd, Do MMMM YYYY, h:mm:ss"),
                lastAccessed: "No accessed yet.",
              });
              toast.success("Successfully Shortened");
              setResult(idForDocument);
              status = "created";
            } catch (e) {
              console.error("Error adding document: ", e);
              toast.error(e);
              status = e;
            }
          } else {
            toast.error("An error occurred");
            status = "error";
          }
        } else status = "invalid";
      } else status = "nourl";
    }
    return status;
  }

  return (
    <Fragment>
      <div className='main row justify-content-center align-items-center m-md-0 mt-5 mt-md-5'>
        <div className='maxw-80 col-12 col-md-6 d-flex justify-content-center'>
          <form
            className='d-flex justify-content-center'
            onSubmit={(e) => e.preventDefault()}>
            <div className='target-url d-flex flex-column align-items-start'>
              <label className='form-label' htmlFor='targetUrl'>
                Enter the Target Url to create a URLSH URL
              </label>
              <div className='position-relative'>
                <input
                  id='targetUrl'
                  type='text'
                  placeholder='Target Url'
                  className='form-control w-100'
                  required={true}
                  onChange={(e) => setUrlToRedirect(e.target.value)}
                />
                <span className='validator-icon' id='mainurl-r'>
                  &#10004;
                </span>
                <span className='validator-icon' id='mainurl-x'>
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
              className='btn btn-primary w-75'
              type='submit'
              onClick={async () => {
                const res = await runShortener(
                  targetUrl,
                  customLinkPath,
                  user && user.uid
                );
                console.log(res);
                if (res === "created") {
                  setCustomLinkPath("");
                  setUrlToRedirect("");
                  setResult("");
                  document.querySelector("#targetUrl").value = "";
                  document.querySelector("#custom-url").value = "";
                  document.querySelector("#mainurl-r").style.display = "none";
                  document.querySelector("#mainurl-x").style.display = "none";
                } else if (res === "invalid")
                  toast.error("Please provide a valid URL address");
                else if (res === "nourl")
                  toast.error("Please provide an URL address");
              }}>
              Shorten
            </button>
          </form>
        </div>
        <div className='maxw-80 blabla col-12 col-md-6 mt-4 mt-md-0'>
          <div className='maxw-80 d-flex align-items-baseline'>
            <h5>Recent URLs: </h5>
            {(localStorage.getItem("recenturls") || result) && (
              <button
                className='ms-3 btn btn-clear btn-sm btn-outline-danger d-flex align-items-center'
                onClick={() => {
                  localStorage.removeItem("recenturls");
                  setResult("");
                  setLocalUrls([]);
                }}>
                <i className='bi bi-trash me-1'></i>
                <span>Clear All</span>
              </button>
            )}
          </div>
          <ul>
            {localUrls.length > 0 ? (
              localUrls.map((e) => (
                <li key={e} className='copy mt-1'>
                  <div className='d-flex align-items-center'>
                    <Link to={"/" + e}>urlsh1.web.app/{e}</Link>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(
                          "https://" +
                            e.currentTarget.previousElementSibling.textContent
                        );
                      }}
                      title='Copy to clipboard'
                      className='btn btn btn-outline-primary ms-2'>
                      <i className='me-1 bi bi-clipboard'></i>
                      <span>Copy</span>
                    </button>
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
