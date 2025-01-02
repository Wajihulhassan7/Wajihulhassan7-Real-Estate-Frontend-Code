import React, { useState, useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/authSlice';
import { baseUrl } from '../../const/url.const';
import { setCareProvider } from '../../Redux/careProviderSlice';
import { setAgentCareProvider } from '../../Redux/agentCareProviderSlice';
import { toast } from 'react-toastify';

const ActiveProperties = ({  onViewDetailsClick, onUploadingRequestClick}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
   const careprovider = useSelector((state) => state.careProvider); 
    const agentCareProvider = useSelector((state) => state.agentCareProvider);   
   const [visibleDropdown, setVisibleDropdown] = useState(null);
  
    const toggleDropdown = (id) => {
      setVisibleDropdown(visibleDropdown === id ? null : id); // Toggle visibility for the clicked property
    };
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${baseUrl}/properties`);
        const filteredProperties = response.data.properties.filter(
          (property) =>
            
            ["To Let"].includes(property.status) 
        );
    
        setProperties(filteredProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false); 
      }
    };
    
    const handleBookmarkClick = async (propertyId) => {
    
    
      try {
        // Check which type of user is authenticated
        const tokenCareProvider = localStorage.getItem('authTokenCareProvider');
        const tokenAgentCareProvider = localStorage.getItem('authTokenAgentCareProvider');
    
        const isCareProvider = tokenCareProvider && !tokenAgentCareProvider;  // If CareProvider token exists but not AgentCareProvider
        const isAgentCareProvider = tokenAgentCareProvider && !tokenCareProvider;  // If AgentCareProvider token exists but not CareProvider
    
        if (!isCareProvider && !isAgentCareProvider) {
          alert('No valid token found, please log in');
          return;
        }
    
        let updatedSavedProperties = [];
        let providerId = '';
        let providerType = '';
        let apiUrl = '';
        let fetchUrl = '';
    
        // Determine the correct provider and update the saved properties
        if (isCareProvider) {
          providerId = careprovider.providerId;
          providerType = 'careprovider';
          updatedSavedProperties = [...careprovider.savedProperties, propertyId];
          apiUrl = `${baseUrl}/auth/careprovider/${careprovider.providerId}`;
          fetchUrl = `${baseUrl}/auth/users/${careprovider.id}`;  // Fetch the updated data
        } else if (isAgentCareProvider) {
          providerId = agentCareProvider.agentCareProviderId;
          providerType = 'agentCareProvider';
          updatedSavedProperties = [...agentCareProvider.savedProperties, propertyId];
          apiUrl = `${baseUrl}/auth/agent-care-provider/${agentCareProvider.agentCareProviderId}`;
          fetchUrl = `${baseUrl}/auth/users/${agentCareProvider.id}`;  // Fetch the updated data
        }
    
        const token = isCareProvider ? tokenCareProvider : tokenAgentCareProvider;
    
        // Send PUT request with the property ID and the token
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach token to Authorization header
          },
          body: JSON.stringify({
            savedProperties: updatedSavedProperties,
          }),
        });
    
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error(`Error: ${response.status} - ${errorMessage}`);
    
          if (response.status === 401) {
            toast.dismiss();
            toast.error(`Your session has expired. Please log in again.`);
            handleLogout();
            return;
          }
    
    
          throw new Error(`Failed to update: ${response.statusText}`);
        }
        if (response.ok) {
           toast.success('Property bookmarked successfully!');
          setVisibleDropdown(null);
          // After success, fetch the updated user data
          const userResponse = await fetch(fetchUrl, {
            headers: {
              'Authorization': `Bearer ${token}`, // Attach token to Authorization header
            },
          });
    
          if (userResponse.ok) {
            const updatedUserData = await userResponse.json();
    
            // Dispatch updated data to Redux store
            if (isCareProvider) {
              dispatch(setCareProvider(updatedUserData));  // Dispatch for care provider
            } else if (isAgentCareProvider) {
              dispatch(setAgentCareProvider(updatedUserData));  // Dispatch for agent care provider
            }
    
            console.log('Updated user data:', updatedUserData);
          } else {
            alert('Failed to fetch updated user data');
          }
        } else {
          alert('Failed to bookmark property');
        }
      } catch (error) {
        alert('Error occurred while bookmarking');
        console.error(error);
      }
    };
            
      
  
    useEffect(() => {
      fetchProperties();
    }, [careprovider.id]);
  
    
    const handleViewDetails = (id) => {
      onViewDetailsClick(id);
    };
 
  const handleLogout = () => {
    dispatch(logout());    
    navigate('/login');
  };
  
    if (loading) {
      return <div>Loading...</div>; 
    }
    
  const handleUploadRequestClick = (id) => {
    onUploadingRequestClick(id);
  };
    return (
      <div className="bg-opacity-14 p-8 pb-14 shadow-md" style={{ borderTopLeftRadius: '30px', width:'100%', background: 'rgba(198, 76, 123, 0.10)' }}>
        <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Active Properties</h2>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
         <img
    src={`${baseUrl}/uploads/${property.photos[0].replace(/^.*[\\/]uploads[\\/]/, '')}`}
    alt="Property"
    className="w-full object-cover rounded-3xl mb-4"
    style={{maxWidth:'100%', maxHeight:'250px'}}
  />
  
  
                <h3 className="text-md font-medium">{property.propertyDescription}</h3>
                <p className="text-sm">{property.rentAmount} USD</p>
                <p className="text-sm mb-4">{property.propertyType}</p>
                <div className="flex justify-between relative">
                 
                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(property.id)}
                    className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]"
                  >
                    View Details
                  </button>
  
                  {/* Vertical Dots Button */}
                  <button
                    onClick={() => toggleDropdown(property.id)}
                    className="bg-gray-200 text-black text-[14px] px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    &#8226;&#8226;&#8226;
                  </button>
  
  {/* Dropdown Menu */}
  {visibleDropdown === property.id && (
    <div className="absolute right-0 mt-9 bg-white shadow-lg rounded-lg z-10">
    
     
      <button
        className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100`}       onClick={() => handleBookmarkClick(property.id)} >
       Bookmark
      </button>
   {careprovider.id !== "" && localStorage.getItem('authTokenCareProvider') &&  <button
        className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100`}       onClick={() => handleUploadRequestClick(property.id)} >
       Make a Request
      </button> }
    </div>
  )}
  
  
  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={require("../../assets/images/image6.png")} // Placeholder for no requests
                alt="No Request"
                className="w-60 h-50"
              />
            </div>
            <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Current Request</p>
          </div>
        )}
      
      </div>
    );
  };

export default ActiveProperties