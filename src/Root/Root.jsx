import styles from './Root.module.css'

import { Outlet } from 'react-router-dom';

export default function Root(){
  return (
    <>
      <div className="sidebar">
        this is sidebar
      </div>
      <div className="detail">
        <Outlet />
      </div>
    </>
  );
}