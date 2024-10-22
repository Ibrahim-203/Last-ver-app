import React from 'react';

const NavButton = ({handleclick}) => {
    return (
        <div className='d-flex justify-content-end'>
              <button className='btn btn-primary' onClick={handleclick}>Valider</button>
        </div>
    );
};

export default NavButton;