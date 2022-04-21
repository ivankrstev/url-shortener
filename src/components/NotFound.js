import "./styles/NotFound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className='box'>
      <div className='err'>
        <span className='err1'>4</span>
        <span className='err2'>0</span>
        <span className='err3'>4</span>
      </div>
      <div className='msg'>
        Maybe this page moved? Got deleted? Is hiding out in quarantine? Never
        existed in the first place?
        <p>
          Let's go <Link to='/'>home</Link> and try from there.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
