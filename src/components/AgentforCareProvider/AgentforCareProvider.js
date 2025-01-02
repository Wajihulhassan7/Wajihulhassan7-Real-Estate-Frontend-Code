import React, { useState} from "react";
import Footer from "../Footer";
import Header from "../Header";
import Image7 from "../../assets/images/image7.png";
import EditProfile1 from "./EditProfile1";
import SideNavbar from "./SideNavbar";
import KeyStats1 from "./KeyStats1";
import { useSelector } from "react-redux";
import SavedProperties from "./SavedProperties";
import ManageClients from "./ManageClients";
import LeasedProperties from "../CareProviderDashBoard/LeasedProperties";
import RequestedProperties from "../LandLordDasboard/RequestedProperties";
import SearchProperties from "../CareProviderDashBoard/SearchProperties";
import ProviderDetails from "../AgentDashboard/ProviderDetails";
import RequestDetails from "../CareProviderDashBoard/RequestDetails";
import ActiveProperties from "../CareProviderDashBoard/ActiveProperties";
import NewListing from "../CareProviderDashBoard/NewListing";
import MatchedUniversal from "./MatchedUniversal";
import RequestReceived from "./RequestRceived";
const AgentforCareProvider = () => {
  const agentCareProvider = useSelector((state) => state.agentCareProvider); 
 const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeLink, setActiveLink] = useState("dashboard");
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
    setActiveComponent(componentName);
    setActiveLink(linkName);
    setShowMenu(false);
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

  const handleCurrentPropertiesClick = () => {
    setActiveComponent("currentProperties"); 
    setActiveLink("currentProperties");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

 
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUploadClick = () => {
    setActiveComponent("uploadProperty"); 
    setActiveLink("uploadProperty");
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

  const handleDetailsClickMatched = (id) => {
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('dashboard');
  };
  const handleDetailsClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('activeProperties');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleDetailsClickSearch = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('searchProperties');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  const handleDetailsClickSaved = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('savedProperties');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleDetailsClickLeased = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent('viewProperty'); // Switch to edit property component
    setActiveLink('leasedProperties');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const handleDetailsClickRequestDashboard = (id) => {
    setSelectedPropertyId(id); 
    setActiveComponent('viewRequest'); 
    setActiveLink('dashboard');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  const handleDetailsClickRequest = (id) => {
    setSelectedPropertyId(id); 
    setActiveComponent('viewRequest'); 
    setActiveLink('manageClients');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };

  const manageViewDetailsActiveInactive = (email) => {
    setSelectedPropertyId(email); 
    setActiveComponent('viewProviderDetails'); 
    setActiveLink('manageClients');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
 
  const handleActiveRequestsClick = () => {
    setActiveComponent('activeRequests'); 
    setActiveLink('dashboard');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const  handleNewListingsClick = () => {
    setActiveComponent('newProperties');
    setActiveLink('dashboard');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };
  
  const  handleMatchedPropertiesClick = () => {
    setActiveComponent('matchedProperties');
    setActiveLink('dashboard');
    setHistory((prevHistory) => [...prevHistory, activeComponent]);
    setHistoryLink((prevHistoryLink) => [...prevHistoryLink, activeLink]);
   
  };



  return (
    <div>
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-b from-[#154D7C]/25 to-white py-10" style={{padding:'80px 0'}}>
        {/* Dashboard View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center mb-8">
          <div className="text-center">
            <div>
              <h1 className="text-4xl md:text-4xl lg:text-5xl leading-normal font-raleway font-bold text-[#000000]" style={{lineHeight:'1.3'}}>
                Care Provider Agent <br />Dashboard
              </h1>
            </div>
            <p className="text-3xl text-[#154D7C] font-bold font-montserrat mt-8">
              Welcome back, {agentCareProvider.fullName}!
            </p>
            <p className="text-xl text-[#C64C7B] font-medium font-raleway mt-2" style={{fontWeight:"800"}}>
            Your Hub for Care-Driven Property Solutions.
            </p>
          </div>
          <div className="flex justify-center">
          <img
  src={Image7}
  alt="Care Provider"
  className="w-full sm:w-5/6 md:w-3/4 max-w-2xl h-auto"
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
          onActiveRequestsClick={handleActiveRequestsClick}
          onMatchedPropertiesClick={handleMatchedPropertiesClick} 
          onNewListingsClick={handleNewListingsClick}
          /> 
        )}
        {activeComponent === "profile1" && <EditProfile1 />}
        {activeComponent === "searchProperties" && <SearchProperties onViewDetailsClick={handleDetailsClickSearch} />}
        {activeComponent === "manageClients" && <ManageClients handleViewDetails={manageViewDetailsActiveInactive}  />}
    
{activeComponent === 'savedProperties' && <SavedProperties onViewDetailsClick={handleDetailsClickSaved} />}
{activeComponent === 'leasedProperties' && <LeasedProperties onViewDetailsClick={handleDetailsClickLeased} />}
{activeComponent === 'viewProperty' && <RequestedProperties propertyId={selectedPropertyId} />}
{activeComponent === 'viewProviderDetails' && <ProviderDetails email={selectedPropertyId} onViewDetailsClick={handleDetailsClickRequest}  />}
{activeComponent === 'viewRequest' && <RequestDetails id={selectedPropertyId} />}
{activeComponent === 'activeProperties' && <ActiveProperties onViewDetailsClick={handleDetailsClick} />}
{activeComponent === 'newProperties' && <NewListing onViewDetailsClick={handleDetailsClick} />}
{activeComponent === 'activeRequests' && <RequestReceived onViewDetailsRequest={handleDetailsClickRequestDashboard}  />}
{activeComponent === 'matchedProperties' && <MatchedUniversal  onViewDetailsClick={handleDetailsClickMatched} />}



      </div>
      <Footer />
     
    </div>
  );
};

export default AgentforCareProvider;
