import React, { useState} from 'react';
import Footer from '../Footer';
import CurrentProperties from './CurrentProperties';
import Image8 from '../../assets/images/image8.png';
import Header from '../Header';
import "../../assets/css/dashboardSideNavogation/dashboardSideNavigation.css";
import EditProfile from './EditProfile';
import SideNav from './SideNav';
import KeyStats from './KeyStats';
import InactiveListing from './InactiveListing';
import SearchforCareProviders1 from './SearchforCareProviders1';
import RequestedProperties from './RequestedProperties';
import UploadPropertyForm from './UploadPropertyForm';
import EditPropertyForm from './EditProperty/EditPropertyForm';
import { useSelector } from 'react-redux';
import RequestReceived from '../AgentDashboard/RequestReceived';
import RequestDetails from '../CareProviderDashBoard/RequestDetails';
import LeasedProperties from '../CareProviderDashBoard/LeasedProperties';
import MyProperties from '../AgentDashboard/MyProperties';

const LandlordDashboard = () => {
  const landlord = useSelector((state) => state.landlord); // Access user details from Redux store
const [history, setHistory] = useState([]);

const [showMenu, setShowMenu] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [activeLink, setActiveLink] = useState('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
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
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setActiveComponent(componentName);
    setActiveLink(linkName);
    setShowMenu(false);
  };

  const handleEditPropertyClickAllProperties = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setSelectedPropertyId(id);
    setActiveComponent('editProperty');
    setActiveLink('allProperties');
  };
  
  const handleEditPropertyClick = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setSelectedPropertyId(id);
    setActiveComponent('editProperty');
    setActiveLink('editProperty');
  };
  
  const handleDetailsClickLeased = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewProperty');
    setActiveLink('dashboard');
  };
  
  const handleDetailsClick = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewProperty');
    setActiveLink('viewProperty');
  };

  const handleDetailsClickAllProperties = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewProperty');
    setActiveLink('allProperties');
  };

  const handleDetailsInactiveListingClick = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewPropertyInactive');
    setActiveLink('viewPropertyInactive');
  };

  const handleCurrentPropertiesClick = () => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setActiveComponent('currentProperties');
    setActiveLink('currentProperties');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUploadClick = () => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setActiveComponent('uploadProperty');
    setActiveLink('uploadProperty');
  };

  const handleUpdateSuccess = () => {
    setActiveComponent('allProperties');
    setActiveLink('allProperties');
  };

  const handleRequestsReceivedClick = () => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setActiveComponent('requestreceived');
    setActiveLink('dashboard');
  };
  
  
  const handleViewDetailsRequestMatchmaker = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewRequest');
    setActiveLink('matchmaker');
  };
  const handleViewDetailsRequest = (id) => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setSelectedPropertyId(id);
    setActiveComponent('viewRequest');
    setActiveLink('dashboard');
  };

  const handleLeasedPropertiesClick = () => {
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setActiveComponent('leasedProperties');
    setActiveLink('dashboard');
  };


  return (
    <div className="shadow-lg rounded-lg">
      <Header />
      

      {/* Dashboard Content */}
      <div className="bg-gradient-to-b from-[#154D7C]/25 to-white py-[100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-4xl lg:text-5xl leading-normal font-raleway font-bold text-[#000000]">
            Landlord Dashboard
          </h1>
          <p className="text-3xl text-[#154D7C] font-bold font-montserrat mt-8">
            Welcome back, {landlord.fullName}!
          </p>
          <p className="text-xl text-[#C64C7B] font-medium font-raleway mt-2">
            Maximize Your Reach, Minimize the Hassle.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={Image8}
            alt="Care Provider"
            className="w-1/2 sm:w-3/4 md:w-2/3 max-w-xl h-auto"
          />
        </div>
      </div>

      
    </div>

    <div className="dashboardDynamicSection">
      
      {history.length > 0 && (
     <button className="back-button" onClick={handleBack}>
     <i className="fa fa-arrow-circle-left"></i>
   </button>
   
      )}

      
      {/* Dynamic Components */}
      <SideNav
        showMenu={showMenu}
        toggleMenu={toggleMenu}
        onLinkClick={handleLinkClick}
        activeLink={activeLink}
      />
      {activeComponent === 'dashboard' && (
        <KeyStats
          onUploadClick={handleUploadClick}
          onCurrentPropertiesClick={handleCurrentPropertiesClick}
          onRequestsReceivedClick={handleRequestsReceivedClick}
          onLeasedPropertiesClick={handleLeasedPropertiesClick}
        />
      )}
      {activeComponent === 'profile' && <EditProfile />}
      {activeComponent === 'matchmaker' && (
        <SearchforCareProviders1
          onViewDetailsClick={handleDetailsClick}
          onViewDetailsRequest={handleViewDetailsRequestMatchmaker}
        />
      )}
      {activeComponent === 'uploadProperty' && <UploadPropertyForm onUpdateSuccess={handleUpdateSuccess} />}
      {activeComponent === 'inactiveListings' && (
        <InactiveListing onViewDetailsInactiveListingClick={handleDetailsInactiveListingClick} />
      )}
      {activeComponent === 'currentProperties' && (
        <CurrentProperties
          onEditClick={handleEditPropertyClick}
          onUploadClick={handleUploadClick}
          onViewDetailsClick={handleDetailsClick}
        />
      )}
      {activeComponent === 'editProperty' && (
        <EditPropertyForm propertyId={selectedPropertyId} onUpdateSuccess={handleUpdateSuccess} />
      )}
      {activeComponent === 'viewProperty' && <RequestedProperties propertyId={selectedPropertyId} />}
      {activeComponent === 'viewPropertyInactive' && <RequestedProperties propertyId={selectedPropertyId} />}
      {activeComponent === 'requestreceived' && (
        <RequestReceived onViewDetailsRequest={handleViewDetailsRequest} />
      )}
      {activeComponent === 'viewRequest' && <RequestDetails id={selectedPropertyId} />}
      {activeComponent === 'leasedProperties' && (
        <LeasedProperties onViewDetailsClick={handleDetailsClickLeased} />
      )}
      {activeComponent === 'allProperties' && (
        <MyProperties onViewDetailsClick={handleDetailsClickAllProperties}  onEditClick={handleEditPropertyClickAllProperties} />
      )}   </div>   
      
      <Footer />
    </div>
  );
};

export default LandlordDashboard;
