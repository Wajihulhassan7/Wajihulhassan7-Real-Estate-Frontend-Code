import React, { useState} from "react";
import Footer from "../Footer";
import Header from "../Header";
import Image9 from "../../assets/images/image9.png";
import CurrentProperties from "../LandLordDasboard/CurrentProperties";
import EditProfile1 from "./EditProfile1";
import SideNavbar from "./SideNavbar";
import KeyStats1 from "./KeyStats1";
import SearchforCareProviders1 from "../LandLordDasboard/SearchforCareProviders1";
import RequestedProperties from "../LandLordDasboard/RequestedProperties";
import UploadPropertyForm from "../LandLordDasboard/UploadPropertyForm";
import EditPropertyForm from "../LandLordDasboard/EditProperty/EditPropertyForm";
import { useSelector } from "react-redux";
import ManageLandlords from "./ManageLandlords";
import RequestReceived from "./RequestReceived";
import InactiveListing from "../LandLordDasboard/InactiveListing";
import RequestDetails from "../CareProviderDashBoard/RequestDetails";
import ActiveInactiveListings from "./ActiveInactiveListings";
import LeasedProperties from "./LeasedProperties";
import MyProperties from "./MyProperties";

const AgentDashboard = () => {
  const agentLandlord = useSelector((state) => state.agentLandlord); 
  const [showMenu, setShowMenu] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeLink, setActiveLink] = useState("dashboard");
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
      setHistory((prevHistory) => [...prevHistory, activeComponent]);
      setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setActiveComponent(componentName);
    setActiveLink(linkName);
    setShowMenu(false);
  };

  const handleEditPropertyClick = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("editProperty"); // Switch to edit property component
    setActiveLink("editProperty");
  };
  
    
  const handleDetailsClickLeased = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewProperty"); // Switch to edit property component
    setActiveLink("dashboard");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    
  };
  const handleDetailsClickLandlord = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewProperty"); // Switch to edit property component
    setActiveLink("managelandlord");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    
  };
  const handleDetailsClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewProperty"); // Switch to edit property component
    setActiveLink("viewProperty");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    
  };

  const handleDetailsInactiveListingClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewPropertyInactive"); // Switch to edit property component
    setActiveLink("viewPropertyInactive");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

  const handleManageLandlordsClick = () => {
    setActiveComponent("managelandlord"); // Switch to edit property component
    setActiveLink("managelandlord");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

  // Function to toggle the 'show' class on the sidebar
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUploadClick = () => {
    setActiveComponent("uploadProperty"); 
    setActiveLink("uploadProperty");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const  handleLeasedPropertiesClick = () => {
    setActiveComponent("leasedProperties"); 
    setActiveLink("dashboard");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
 
  
  const handleUpdateSuccess = () => {
    setActiveComponent('allProperties');
    setActiveLink('allProperties');
  
   
  };
  
  
  
  const handleRequestsReceivedClick = () => {
    setActiveComponent("requestreceived"); 
    setActiveLink("requestreceived");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleViewDetailsRequestMatchmaker = (id) => {
    setSelectedPropertyId(id); 
    setActiveComponent('viewRequest'); 
    setActiveLink('matchmaker');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleViewDetailsRequest = (id) => {
    setSelectedPropertyId(id); 
    setActiveComponent('viewRequest'); 
    setActiveLink('viewRequest');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const manageViewDetailsActiveInactive = (email) => {
    setSelectedPropertyId(email); 
    setActiveComponent('viewLandlordDetails'); 
    setActiveLink('managelandlord');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const   handleDetailsClickAllProperties = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('allProperties');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleEditPropertyClickAllProperties = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
    setSelectedPropertyId(id);
    setActiveComponent('editProperty');
    setActiveLink('allProperties');
  };
  return (
    <div>
      <Header />

      
      <div className="bg-gradient-to-b from-[#154D7C]/25 to-white py-10">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center mb-8">
          <div className="text-center">
            <div>
              <h1 className="text-4xl md:text-4xl lg:text-5xl leading-normal font-raleway font-bold text-[#000000]">
                Agent Landlord Dashboard
              </h1>
            </div>
            <p className="text-3xl text-[#154D7C] font-bold font-montserrat mt-8">
              Welcome back, {agentLandlord.fullName}!
            </p>
            <p className="text-xl text-[#C64C7B] font-medium font-raleway mt-2">
              List, Manage, Connect – All in One Place.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={Image9}
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

        <SideNavbar
          showMenu={showMenu}
          toggleMenu={toggleMenu}
          onLinkClick={handleLinkClick}
          activeLink={activeLink}
        />
        {activeComponent === "dashboard" && (
          <KeyStats1
            onUploadClick={handleUploadClick}
            onManageLandlordsClick={handleManageLandlordsClick}
            onRequestsReceivedClick={handleRequestsReceivedClick}
            onLeasedPropertiesClick={handleLeasedPropertiesClick}
          /> 
        )}
        {activeComponent === "profile1" && <EditProfile1 />}
        {activeComponent === "matchmaker" && <SearchforCareProviders1 onViewDetailsRequest={handleViewDetailsRequestMatchmaker} />}
        {activeComponent === "uploadProperty" && <UploadPropertyForm onUpdateSuccess={handleUpdateSuccess} />}
        {activeComponent === "managelandlord" && <ManageLandlords handleViewDetails={manageViewDetailsActiveInactive} />}
        {activeComponent === "requestreceived" && <RequestReceived  onViewDetailsRequest={handleViewDetailsRequest} />}
        {activeComponent === "inactiveListings1" && (
          <InactiveListing onViewDetailsInactiveListingClick={handleDetailsInactiveListingClick}
           />
        )}
        {activeComponent === "currentProperties" && (
          <CurrentProperties
            onEditClick={handleEditPropertyClick}
            onUploadClick={handleUploadClick}
            onViewDetailsClick={handleDetailsClick}
          />
        )}
        {activeComponent === "editProperty" && (
          <EditPropertyForm propertyId={selectedPropertyId} onUpdateSuccess={handleUpdateSuccess} />
        )}
        {activeComponent === "viewProperty" && (
          <RequestedProperties propertyId={selectedPropertyId} />
        )}
        {activeComponent === "viewPropertyInactive" && (
          <RequestedProperties propertyId={selectedPropertyId} />
        )}
        {activeComponent === 'viewRequest' && <RequestDetails id={selectedPropertyId} />}
        {activeComponent === 'leasedProperties' && <LeasedProperties onViewDetailsClick={handleDetailsClickLeased}  />}
        {activeComponent === 'viewLandlordDetails' && <ActiveInactiveListings email={selectedPropertyId} onViewDetailsClick={handleDetailsClickLandlord}  />}
        
        {activeComponent === 'allProperties' && <MyProperties onViewDetailsClick={handleDetailsClickAllProperties}  onEditClick={handleEditPropertyClickAllProperties} />}
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboard;
