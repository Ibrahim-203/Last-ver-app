import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

const Print = () => {
  const modalContentRef = useRef();

  return (
    <>
      <div className="modal-body" ref={modalContentRef}>
        <div className='text-center'>
          <h4>Facture de vente</h4>
        </div>
        <hr />
        <h6>Information du client</h6>
        <div className="row mt-3 mb-3">
         

        </div>
        <hr />
        <table className="table table-striped">
          <tr className='table-secondary'>
            <th>Produit</th>
            <th>Quantite</th>
            <th>Prix</th>
          </tr>
          
          <tr>
            <td colSpan={2}>Total</td>
            <td> Ar</td>
          </tr>
        </table>
        <div>
          <p></p>
        </div>
        </div>
        <ReactToPrint
                trigger={() => <button type="button" className="btn btn-primary">Imprimer</button>}
                content={() => modalContentRef.current} // Impression du contenu du modal
            />
      </>
      );
};

      export default Print;
