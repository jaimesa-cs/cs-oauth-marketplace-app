import Icon from "../images/sidebarwidget.svg";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="entry-sidebar">
      <div className="entry-sidebar-container">
        <div className="entry-sidebar-icon">
          <img src={Icon} alt="icon" />
        </div>

        <div className="app-component-content">
          <h4>OAuth Example</h4>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
