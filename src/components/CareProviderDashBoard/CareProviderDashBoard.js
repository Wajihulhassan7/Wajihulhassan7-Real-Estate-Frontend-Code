import React, { useState } from 'react';
import myImage from '../../assets/img/house5.png';
import './style.css'
import Footer from '../Footer.js'
import Header from '../Header.js'
import SideNavCareProvider from './SideNav.js';
import KeyStatsCareProvider from './KeyStats.js';
import EditProfileCareProvider from './EditProfile.js';
import SavedProperties from './SavedProperties.js';
import LeasedProperties from './LeasedProperties.js';
import MyRequests from './MyRequests.js';
import RequestPropertyForm from './RequestProperty/RequestPropertyForm.js';
import SearchProperties from './SearchProperties.js';
import { useSelector } from 'react-redux';
import RequestDetails from './RequestDetails.jsx';
import ActiveProperties from './ActiveProperties.js';
import RequestedProperties from '../LandLordDasboard/RequestedProperties.js';
import MatchedProperties from './MatchedProperties.js';
import NewListing from './NewListing.js';
import Notifications from './Notifications.js';
function CareProviderDashBoard() {
  const careprovider = useSelector((state) => state.careProvider); 
  console.log(careprovider);
  const [showMenu, setShowMenu] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [activeLink, setActiveLink] = useState('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [history, setHistory] = useState([]);
    const [historyLink, setHistoryLink] = useState([]);
  
    const handleBack = () => {
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        const previousComponent = newHistory.pop();
        setActiveComponent(previousComponent || 'dashboard'); // Restore the previous component or default to 'dashboard'
        return newHistory;
      });
    
      setHistoryLink((prevHistoryLink) => {
        const newHistoryLink = [...prevHistoryLink];
        const previousLink = newHistoryLink.pop();
        setActiveLink(previousLink || 'dashboard'); // Restore the previous link or default to null
        return newHistoryLink;
      });
    };
    
  const handleLinkClick = (componentName, linkName) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setActiveComponent(componentName);
    setActiveLink(linkName);  
    setShowMenu(false); 
  };
  
  

  // Function to toggle the 'show' class on the sidebar
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  
  const handleViewDetailsRequest = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewRequest'); // Switch to edit Request component
    setActiveLink('viewRequest');
  };
  
  
  const handleActiveRequestsClick = () => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setActiveComponent('myRequests'); // Update the state to render the CurrentProperties component
    setActiveLink('myRequests');
  };
  
  
  
  
  const handleUploadingRequestClick = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('requestProperty'); // Switch to edit property component
    setActiveLink('activeProperties');
  };
  
  const handleDetailsClickMatched = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('dashboard');
  };
  const handleDetailsClickSaved = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('savedProperties');
  };
  
  const handleDetailsClickLeased = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('leasedProperties');
  };

  
  const handleDetailsClickSearch = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('searchProperties');
  };
  const handleDetailsClick = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('viewProperty');
  };

  const handleUpdateSuccess = () => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setActiveComponent('myRequests'); // Update the state to render the CurrentProperties component
    setActiveLink('myRequests');
  };
  const handleMatchedPropertiesClick = () => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setActiveComponent('matchedProperties'); // Update the state to render the CurrentProperties component
    setActiveLink('dashboard');
  };
  
  const handleNewListingsClick = () => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setActiveComponent('newProperties'); // Update the state to render the CurrentProperties component
    setActiveLink('dashboard');
  };
  
  
  return (
    <div className="bg-white shadow-lg rounded-lg ">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center  mb-8 py-[100px] bg-gradient-to-b from-[#154D7C]/25 to-white">
        <div className='text-center'>
        <div>
          <h1 className="text-4xl  md:text-4xl lg:text-6xl leading-normal font-raleway font-bold text-[#000000]">
            Care Provider
          </h1>
          <h1 className="text-4xl  md:text-4xl lg:text-6xl leading-normal font-raleway font-bold text-[#000000]">
          Dashboard
          </h1> 
          </div>
          <p className="text-3xl text-[#2E86AB] font-bold font-montserrat mt-2">
            Welcome back, {careprovider.fullName}!
          </p>
          
          <p className="text-xl text-[#C64C7B] font-medium font-raleway mt-2">
            Live in Comfort, Care with Confidence.
          </p>
        </div>

        <div className="flex justify-center">
        <img 
  src={myImage} 
  alt="Care Provider" 
  className="w-full sm:w-4/5 md:w-3/4 h-auto"
/>

</div>

      </div>




      
<div className='dashboardDynamicSection'>     
{history.length > 0 && (
     <button className="back-button" onClick={handleBack}>
     <i className="fa fa-arrow-circle-left"></i>
   </button>
   
      )}

<SideNavCareProvider showMenu={showMenu} toggleMenu={toggleMenu} onLinkClick={handleLinkClick} activeLink={activeLink} />
{activeComponent === 'dashboard' && <KeyStatsCareProvider activeRequestsClick={handleActiveRequestsClick} 
matchedPropertiesClick={handleMatchedPropertiesClick}
onNewListingsClick={handleNewListingsClick}
/>}
{activeComponent === 'profile' && <EditProfileCareProvider />}

{activeComponent === 'savedProperties' && <SavedProperties onViewDetailsClick={handleDetailsClickSaved} onUploadingRequestClick={handleUploadingRequestClick} />}
{activeComponent === 'leasedProperties' && <LeasedProperties onViewDetailsClick={handleDetailsClickLeased} />}
{activeComponent === 'requestProperty' && <RequestPropertyForm onUpdateSuccess={handleUpdateSuccess} propertyId={selectedPropertyId} />}
{activeComponent === 'myRequests' && <MyRequests onViewDetailsRequest={handleViewDetailsRequest} />}
{activeComponent === 'searchProperties' && <SearchProperties onViewDetailsClick={handleDetailsClickSearch} />}
{activeComponent === 'viewRequest' && <RequestDetails id={selectedPropertyId} />}
{activeComponent === 'activeProperties' && <ActiveProperties onViewDetailsClick={handleDetailsClick} onUploadingRequestClick={handleUploadingRequestClick} />}
{activeComponent === 'matchedProperties' && <MatchedProperties onViewDetailsClick={handleDetailsClickMatched} />}
{activeComponent === 'viewProperty' && <RequestedProperties propertyId={selectedPropertyId} />}
{activeComponent === 'newProperties' && <NewListing onViewDetailsClick={handleDetailsClick} />}

{activeComponent === 'notifications' && <Notifications />}
    </div>
    
    
      <Footer />
    </div>
  );
}

export default CareProviderDashBoard;
