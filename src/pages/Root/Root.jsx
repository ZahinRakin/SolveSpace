import styles from './Root.module.css'

import { Outlet } from 'react-router-dom';

export default function Root(){
  return (
    <div className={`${styles.container}`}>
      <header className={`${styles.header}`}>This is the header</header>
      <div className={`${styles.sidebar}`}>
        this is sidebar
      </div>
      <div className={`${styles.header}`}>
        <Outlet />
      </div>
    </div>
  );
}