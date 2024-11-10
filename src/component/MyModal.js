import React from 'react';

const MyModal = ({title,children, handleValidate}) => {
    return (
<div class="modal fade modal-lg" id="mymodalcomponent" style={{zIndex:500000}} tabindex="-1" aria-labelledby="mymodalcomponent" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">{title}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      {children}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleValidate}>Valider</button>
      </div>
    </div>
  </div>
</div>
    );
};


export default MyModal;