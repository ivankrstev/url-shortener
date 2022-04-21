export default function emailStyleValidator(
  inputValue,
  idInput,
  idCheck,
  idCross
) {
  if (
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      inputValue
    )
  ) {
    document.getElementById(idInput).style.borderColor = "#90EE90";
    document.getElementById(idCheck).style.display = "block";
    document.getElementById(idCross).style.display = "none";
  } else {
    document.getElementById(idInput).style.borderColor = "#F00";
    document.getElementById(idCheck).style.display = "none";
    document.getElementById(idCross).style.display = "block";
  }
}
