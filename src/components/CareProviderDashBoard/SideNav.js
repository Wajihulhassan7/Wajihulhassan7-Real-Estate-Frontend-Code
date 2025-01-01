import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseUrl } from '../../const/url.const';
const SideNavCareProvider = ({ showMenu, toggleMenu, onLinkClick, activeLink }) => {
  const careProvider = useSelector((state) => state.careProvider); // Ensure correct state mapping
  const [listings, setListings] = useState([]);
      
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleLogout = () => {
      dispatch(logout());    
        toast.success("Successfully logged out 👋");
      navigate('/');
    };


       const fetchRequests = async () => {
        try {
          const response = await fetch(`${baseUrl}/properties/requests`);
          if (!response.ok) {
            throw new Error("Failed to fetch property requests.");
          }
          
          const data = await response.json();
    
         
          if (data.message && data.message === "Error fetching all requests") {
            throw new Error("Error fetching all property requests.");
          }
    
          // Filter listings by careProvider ID
          const filteredListings = data.filter((item) => 
            item.userId === careProvider.id && 
            (item.status.includes('Resolved') || item.status.includes('Leased'))
          );
            setListings(filteredListings);
        } catch (error) {
          console.error("Error fetching requests:", error);
         
        }
      };
   useEffect(() => {
      fetchRequests();
    }, [careProvider.id]);

    const unreadNotificationsCount = listings.filter((listing) => !listing.notificationView).length;


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
        > Notifications
  {unreadNotificationsCount > 0 && ` (${unreadNotificationsCount})`}

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
