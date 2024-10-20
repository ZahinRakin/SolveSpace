import styles from './Root.module.css'

import { Outlet } from 'react-router-dom'
import { useRef } from 'react'

import Header from '../../compoenents/ui/header'
import Sidebar from '../../compoenents/ui/sidebar'


export default function Root(){
  const sidebarRef = useRef(null);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles[`header-holder`]}`}>
        <Header sidebarRef={sidebarRef}/>
      </div>
      <Sidebar sidebarRef={sidebarRef} className={styles.sidebar}/>
      <Outlet className={styles.outlet}/>
    </div>
  );
}