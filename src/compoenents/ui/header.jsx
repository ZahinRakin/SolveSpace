import styles from './header.module.css';
import commonStyles from './sidebar-header.module.css';
import toggleSidebar from '../toggleSidebar';

import { RxHamburgerMenu } from "react-icons/rx";
import redHandLogo from "../../../public/svg/just-hand-red.svg";

import { IoMdNotificationsOutline } from "react-icons/io";
import { LuUser } from "react-icons/lu";


export default function Header({sidebarRef}){

  return(
    <header className={`${styles.header}`}>
        <div className={`${commonStyles[`logo-holder`]}`}>
          <button onClick={() => toggleSidebar(sidebarRef)} className={`button ${styles[`hamburger-icon`]}`}>
            <RxHamburgerMenu/>
            <div className="tooltip">
              menu
            </div>
          </button>
          <div>
            <img src={redHandLogo} alt="logo" className={commonStyles["logo"]}/>
          </div>
        </div>
        <input type="text" placeholder='Search bar' />
        <button className="button">
          <IoMdNotificationsOutline />
          <div className={styles["notifications-count"]}>
            1
          </div>
          <div className="tooltip">
            notifications
          </div>
        </button>
        <button className="button">
          <LuUser />
          {/**if you want to add tooltip for the user */}
        </button>
      </header>
  );
}