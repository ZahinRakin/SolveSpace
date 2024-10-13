import styles from './sidebar.module.css'

export default function Sidebar({sidebarRef}){
  return(
    <div className={`${styles.sidebar}`} ref={sidebarRef}>
        this is sidebar
    </div>
  );
}