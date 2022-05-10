import { RotatingLines } from "react-loader-spinner";

function Loader(props) {
  return (
    <div
      id={props.id && props.id}
      className={"loader-spinner " + props.className ? props.className : ""}>
      <RotatingLines width='100' strokeColor='#0d6efd' strokeWidth='2' />
    </div>
  );
}

export default Loader;
