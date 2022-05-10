import { Fragment, useState, useEffect } from "react";
import "./styles/Modal.css";
import { db } from "../firebase/firebase";
import { onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader";
import moment from "moment";

function Popup(props) {
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    handleShow();
    const unsubscribe = onSnapshot(
      doc(db, "links", props.id ? props.id : "a"),
      (doc) => {
        setData({ id: doc.id, ...doc.data() });
        setLoading(false);
      }
    );
    return () => {
      setData(undefined);
      unsubscribe();
    };
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      centered>
      <Modal.Header>
        <Modal.Title>
          Live statistics for link /
          {data.id ? data.id : <Loader strokeWidth='1' />}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loader className='my-5 d-flex justify-content-center' />
        ) : data.id ? (
          <Fragment>
            <p className='mb-1 text-break'>
              <span>Target Url: </span>
              {data.targetUrl}
            </p>
            <p className='my-1'>
              The link was opened {data.countOpener} times.
            </p>
            <p className='my-1'>
              <span>Date Created: </span>
              {moment(data.dateCreated).format("dddd, Do MMMM YYYY, H:mm:ss")}
            </p>
            <p className='my-1'>
              <span>Last Accessed: </span>
              {data.lastAccessed !== "No accessed yet."
                ? moment(data.lastAccessed).format(
                    "dddd, Do MMMM YYYY, H:mm:ss"
                  )
                : "No accessed yet."}
            </p>
            <ul className='list-group my-1'>
              <h6 className='m-0 my-1'>Locations</h6>
              {data.ipaddress && data.ipaddress.length > 0 ? (
                data.ipaddress.map((e) => (
                  <li key={e} className='list-group-item'>
                    {e}
                  </li>
                ))
              ) : (
                <li className='list-group-item' key='key'>
                  No location yet
                </li>
              )}
            </ul>
          </Fragment>
        ) : (
          <div>Error!</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='danger'
          onClick={async () => {
            props.setModalData(undefined);
            await deleteDoc(doc(db, "links", props.id));
          }}>
          Delete
        </Button>
        <Button
          variant='secondary'
          onClick={() => (handleClose, props.setModalData(undefined))}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default Popup;
