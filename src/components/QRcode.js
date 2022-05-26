import "./styles/QRcode.css";
import { useState, Fragment, useEffect } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

function QRcode({ elID, link }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [target, setTarget] = useState();
  const [pngImage, setPngImage] = useState();
  const [jpegImage, setJpegImage] = useState();
  const [svgImage, setSvgImage] = useState();

  const convertSvg = () => {
    const svg = document?.querySelector(`#${elID} svg`);
    if (svg) {
      const serializer = new XMLSerializer();
      let source = serializer?.serializeToString(svg);
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      var url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      setSvgImage(url);
    }
  };

  const convertPng = () => {
    const canvas = document?.querySelector("canvas");
    const img = canvas?.toDataURL("image/png", 1.0);
    setPngImage(img);
  };

  const convertJpeg = () => {
    const canvas = document?.querySelector("canvas");
    const img = canvas?.toDataURL("image/jpeg", 1.0);
    setJpegImage(img);
  };

  const handlemouse = (event) => {
    let overlayClicked = false;
    event?.path?.forEach((e) => {
      if (e.id === elID) overlayClicked = true;
    });
    if (!overlayClicked) {
      setShowOverlay(false);
      setTarget(null);
      document.body.removeEventListener("click", handlemouse, true);
    }
  };

  useEffect(() => {
    if (showOverlay) {
      document.body.addEventListener("click", handlemouse, true);
      // setTimeout(() => {
      convertJpeg();
      convertPng();
      convertSvg();
      // }, 150);
    } else document.body.removeEventListener("click", handlemouse, true);
    // eslint-disable-next-line
  }, [showOverlay]);

  return (
    <Fragment>
      <button
        title='Get QR Code'
        id={"btn-" + elID}
        onClick={(event) => {
          setTarget(event.currentTarget);
          setShowOverlay(!showOverlay);
          if (document.querySelectorAll('[role="tooltip"]')?.length < 2) {
            setShowOverlay(true);
          } else setShowOverlay(false);
        }}
        className='btn btn-outline-primary qr-code-btn'>
        <i className='bi bi-qr-code'></i>
      </button>
      <Overlay
        show={showOverlay}
        target={target}
        placement='left'
        containerPadding={10}>
        <Popover id={elID}>
          <Popover.Header
            className='py-1 d-flex align-items-center justify-content-between'
            as='p'>
            <span>QR Code</span>
            <button
              onClick={() => setShowOverlay(false)}
              className='btn btn-outline-danger'>
              Close
            </button>
          </Popover.Header>
          <Popover.Body>
            <div className='text-center'>
              <QRCodeCanvas level='M' size={150} value={link} />
            </div>
            {showOverlay && (
              <div className='download-buttons'>
                <a
                  className='btn btn-outline-primary'
                  href={svgImage}
                  download={elID.replaceAll("/", "-") + ".svg"}>
                  <i className='bi bi-download'></i>
                  svg
                  <QRCodeSVG
                    id={"svg-" + elID}
                    className='d-none'
                    value={link}
                  />
                </a>
                <a
                  className='btn btn-outline-primary'
                  href={jpegImage}
                  download={elID.replaceAll("/", "-") + ".jpeg"}>
                  <i className='bi bi-download'></i>
                  jpeg
                </a>
                <a
                  className='btn btn-outline-primary'
                  href={pngImage}
                  download={elID.replaceAll("/", "-") + ".png"}>
                  <i className='bi bi-download'></i>
                  png
                </a>
              </div>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </Fragment>
  );
}
export default QRcode;
