import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
const SideNavCareProvider = ({ showMenu, toggleMenu, onLinkClick, activeLink }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleLogout = () => {
      dispatch(logout());    
        toast.success("Successfully logged out 👋");
      navigate('/');
    };


  return (
    <div>
      <div className="toggleSideMenu" onClick={toggleMenu}>
        <p>{showMenu ? 'Close Menu' : 'Menu'}</p>
      </div>
      <div className={`dashboardNavigationDynamic ${showMenu ? 'show' : ''}`}>
        <Link
          className={`sideNavLink ${activeLink === 'dashboard' ? 'active' : ''}`}
          onClick={() => onLinkClick('dashboard', 'dashboard')}
        >
          Dashboard
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'profile' ? 'active' : ''}`}
          onClick={() => onLinkClick('profile', 'profile')}
        >
          My Profile
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'searchProperties' ? 'active' : ''}`}
          onClick={() => onLinkClick('searchProperties', 'searchProperties')}
        >
          Search Properties 
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'activeProperties' || activeLink === "viewProperty" ? 'active' : ''}`}
          onClick={() => onLinkClick('activeProperties', 'activeProperties')}
        >
          Active Properties 
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'myRequests' || activeLink === 'viewRequest' ? 'active' : ''}`}
          onClick={() => onLinkClick('myRequests', 'myRequests')}
        >
          My Requests
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'savedProperties' ? 'active' : ''}`}
          onClick={() => onLinkClick('savedProperties', 'savedProperties')}
        >
         Saved Properties
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'leasedProperties' ? 'active' : ''}`}
          onClick={() => onLinkClick('leasedProperties', 'leasedProperties')}
        >
          Leased Properties
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'notifications' ? 'active' : ''}`}
          onClick={() => onLinkClick('notifications', 'notifications')}
        >
         Notifications
        </Link>
        <Link
          className={`sideNavLink ${activeLink === 'logout' ? 'active' : ''}`}
         onClick={handleLogout}
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default SideNavCareProvider;
