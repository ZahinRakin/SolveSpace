import styles from './header.module.css';
import sidebarStyles from './sidebar.module.css'

import { RxHamburgerMenu } from "react-icons/rx";
import redHandLogo from "../../../public/svg/just-hand-red.svg";
// import blackHandLogo from "../../../public/svg/just-hand-black.svg";
// import whiteHandLogo from "../../../public/svg/just-hand-white.svg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuUser } from "react-icons/lu";


export default function Header({sidebarRef}){
  function toggleSidebar(){
    const sidebarElem = sidebarRef.current;
    sidebarElem.classList.toggle(sidebarStyles.hidden);
  }

  return(
    <header className={`${styles.header}`}>
        <div className={`${styles[`start-part`]}`}>
          <button onClick={toggleSidebar} className={`button ${styles[`hamburger-icon`]}`}>
            <RxHamburgerMenu/>
            <div className="tooltip">
              menu
            </div>
          </button>
          <div className="logo">
            <img src={redHandLogo} alt="logo" className={styles["header-logo"]}/>
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