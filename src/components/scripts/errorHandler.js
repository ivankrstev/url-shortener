import { toast } from "react-toastify";

export default function errorHandler(result, password) {
  let errorMessage = result;
  errorMessage = errorMessage.replace("(", "").replace(").", "");
  const array = errorMessage.split(" ");
  let exactmessage = array[array.length - 1].split("/");
  let array2 = exactmessage[1].split("-");
  let finalmessage = "Error: ";
  for (let item of array2) finalmessage += " " + item;
  if (finalmessage === "Error: internal error" && password?.length < 8)
    finalmessage = "Error: invalid password";
  toast.error(finalmessage);
}
