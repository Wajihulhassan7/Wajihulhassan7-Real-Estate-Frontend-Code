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
import LeasedProperties from "../CareProviderDashBoard/LeasedProperties";
import ActiveInactiveListings from "./ActiveInactiveListings";

const AgentDashboard = () => {
  const agentLandlord = useSelector((state) => state.agentLandlord); 
console.log(agentLandlord);
  const [showMenu, setShowMenu] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeLink, setActiveLink] = useState("dashboard");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const handleLinkClick = (componentName, linkName) => {
    setActiveComponent(componentName);
    setActiveLink(linkName);
    setShowMenu(false);
  };

  const handleEditPropertyClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("editProperty"); // Switch to edit property component
    setActiveLink("editProperty");
  };

  const handleDetailsClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewProperty"); // Switch to edit property component
    setActiveLink("viewProperty");
    
  };

  const handleDetailsInactiveListingClick = (id) => {
    setSelectedPropertyId(id); // Store the selected property ID
    setActiveComponent("viewPropertyInactive"); // Switch to edit property component
    setActiveLink("viewPropertyInactive");
  };

  const handleManageLandlordsClick = () => {
    setActiveComponent("managelandlord"); // Switch to edit property component
    setActiveLink("managelandlord");
  };

  // Function to toggle the 'show' class on the sidebar
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUploadClick = () => {
    setActiveComponent("uploadProperty"); 
    setActiveLink("uploadProperty");
  };
  
  const  handleLeasedPropertiesClick = () => {
    setActiveComponent("leasedProperties"); 
    setActiveLink("dashboard");
  };
 
  
  const handleUpdateSuccess = () => {
    setActiveComponent('currentProperties'); // Update the state to render the CurrentProperties component
    setActiveLink("currentProperties");
  };
  
  
  
  const handleRequestsReceivedClick = () => {
    setActiveComponent("requestreceived"); 
    setActiveLink("requestreceived");
  };
  const handleViewDetailsRequest = (id) => {
    setSelectedPropertyId(id); 
    setActiveComponent('viewRequest'); 
    setActiveLink('viewRequest');
  };
  
  const manageViewDetailsActiveInactive = (email) => {
    setSelectedPropertyId(email); 
    setActiveComponent('viewLandlordDetails'); 
    setActiveLink('managelandlord');
  };
  
  return (
    <div>
      <Header />

      
      <div className="bg-gradient-to-b from-[#154D7C]/25 to-white py-10">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center mb-8">
          <div className="text-center">
            <div>
              <h1 className="text-4xl md:text-4xl lg:text-5xl leading-normal font-raleway font-bold text-[#000000]">
                Agent Dashboard
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
        {activeComponent === "matchmaker" && <SearchforCareProviders1 />}
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
        {activeComponent === 'leasedProperties' && <LeasedProperties onViewDetailsClick={handleDetailsClick}  />}
        {activeComponent === 'viewLandlordDetails' && <ActiveInactiveListings email={selectedPropertyId} onViewDetailsClick={handleDetailsClick}  />}
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboard;
