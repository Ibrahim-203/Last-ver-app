import React from 'react';

const Header = ({step}) => {
    return (
        <header className= "app-header">
        <nav className= "navbar navbar-expand-lg ">
          <ul className= "navbar-nav">
            <li className= "nav-item d-block d-xl-none">
              <a className= "nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="javascript:void(0)">
                <i className= "ti ti-menu-2"></i>
              </a>
            </li>
            <li className= "nav-item">
              <a className= "nav-link nav-icon-hover" href="javascript:void(0)">
                <i className= "ti ti-bell-ringing"></i>
                <div className= "notification bg-primary rounded-circle"></div>
              </a>
            </li>
          </ul>
          <div className= "navbar-collapse justify-content-end pe-3" id="navbarNav">
            <h5>{step}</h5>
          </div>
        </nav>
      </header>
    );
};

export default Header;