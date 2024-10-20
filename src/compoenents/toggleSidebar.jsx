import sidebarStyles from "./ui/sidebar.module.css";

export default function toggleSidebar(sidebarRef){
  const sidebarElem = sidebarRef.current;
  sidebarElem.classList.toggle(sidebarStyles.hidden);
}