import { Icon } from '@iconify-icon/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const navContent = [
        {title : "Installation Solaire", link: "/installation", icon: "mdi:solar-panel"},
        {title : "Etude de consommation", link: "/calc-conso", icon: "game-icons:desk-lamp"},
        {title : "Dimensionnement onduleur", link: "/dim-ond", icon: "cbi:huawei-solar-inverter"},
        {title : "Dimensionnement batterie", link: "/dim-batt", icon: "fa6-solid:car-battery"},
        {title : "Sécurité du matériel", link: "/sec-mat", icon: "ic:outline-cable"},
        {title : "Autoconsommation", link: "/autocons", icon: "fluent:data-pie-24-regular"},
        {title : "Etude économique", link: "/etude-eco", icon: "streamline:decent-work-and-economic-growth"},
        {title : "Edition du rapport", link: "/report", icon: "icon-park-outline:table-report"},
    ]
    return (
        <aside className= "left-sidebar">
        {/* Sidebar scroll*/}
        <div>
          <div className= "brand-logo d-flex align-items-center justify-content-between">
            <h3 className='text-light d-flex align-items-center '>
            Etapes 
            </h3>
            <div className= "close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
              <i className= "ti ti-x fs-8"></i>
            </div>
          </div>
          {/* Sidebar navigation*/}
          <nav className= "sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">

              {navContent.map((item, index)=>(
                <li className= "sidebar-item " key={index}>
                <NavLink className= "sidebar-link disabled" to={item.link} aria-expanded="false">
                  <span>
                    <iconify-icon icon={item.icon} className= "fs-6"></iconify-icon>
                  </span>
                  <span className= "hide-menu">{item.title}</span>
                </NavLink>
              </li>
              )) }
            </ul>
          </nav>
          {/* End Sidebar navigation */}
        </div>
        {/* End Sidebar scroll*/}
      </aside>
    );
};

export default SideBar;