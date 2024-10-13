import styles from './Root.module.css'

import { useRef } from 'react';
import { Outlet } from 'react-router-dom';

import { RxHamburgerMenu } from "react-icons/rx";
import redHandLogo from "../../../public/svg/just-hand-red.svg";
import blackHandLogo from "../../../public/svg/just-hand-black.svg";
import whiteHandLogo from "../../../public/svg/just-hand-white.svg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuUser } from "react-icons/lu";


export default function Root(){
  const sidebarRef = useRef(null);

  function toggleSidebar(){
    console.log("menu button pressed.");
    console.log(sidebarRef);
    const sidebarElem = sidebarRef.current;
    sidebarElem.classList.toggle(styles.hidden);
  }

  return (
    <div className={`${styles.container}`}>
      <header className={`${styles.header}`}>
        <div className={`${styles[`start-part`]}`}>
          <button onClick={toggleSidebar} className={`button`}>
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
      <div className={`${styles.sidebar}`} ref={sidebarRef}>
        this is sidebar
      </div>
      <div className={`${styles.details}`}>
        <Outlet />
      </div>
    </div>
  );
}