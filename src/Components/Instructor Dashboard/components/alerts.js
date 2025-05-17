import Swal from "sweetalert2";

export const deleteModal = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      return true;
    } else {
      return false;
    }
  });
};
export const successModal = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "success",
    timer: 1500,
  });
};
export const errorModal = (title, text) => {
  Swal.fire({
    icon: "error",
    title:title || "Oops...",
    text:text|| "Something went wrong!",
  });
};
