import Swal from "sweetalert2";

export const  successModal = (title = "Success", text = "Operation completed successfully") =>{
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonText: "OK",
 timer:1500,
  });
}

export const errorModal = (title = "Error", text = "An error occurred") => {
  Swal.fire({
        title,
        text,
        icon: "error",
        confirmButtonText: "OK",
        timer: 1500,
      });
};