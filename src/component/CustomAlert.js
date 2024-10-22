import React from 'react';
import Swal from 'sweetalert2'
const CustomAlert = ({title, content})=>{
    return Swal.fire({
      title: title,
      text: content,
      confirmButtonText: 'Ok',
      backdrop: 'swal2-backdrop-hide',
      buttonsStyling : false,
      height:"60px",
      confirmButtonColor:"orange",
      customClass: {
        title: 'modal_title',
        htmlContainer:'modal_text',
        confirmButton :"modal_confirm_button"
      }
    })
  }

export default CustomAlert;