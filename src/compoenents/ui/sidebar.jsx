import styles from './sidebar.module.css'
import commonStyles from './sidebar-header.module.css'
import toggleSidebar from '../toggleSidebar';

import redHandLogo from "../../../public/svg/just-hand-red.svg"
import { RxHamburgerMenu } from "react-icons/rx";

export default function Sidebar({sidebarRef}){
  return(
    <div className={`${styles[`sidebar`]}`} ref={sidebarRef}>
      <div className={`${commonStyles[`logo-holder`]}`}>
        <button onClick={() => toggleSidebar(sidebarRef)} className={`button`}>
          <RxHamburgerMenu/>
          <div className="tooltip">
            menu
          </div>
        </button>
        <div className="logo">
          <img src={redHandLogo} alt="logo" className={commonStyles["logo"]}/>
        </div>
      </div>
    </div>
  );
}