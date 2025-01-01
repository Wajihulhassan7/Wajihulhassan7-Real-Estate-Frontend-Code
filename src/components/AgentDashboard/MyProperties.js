import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../const/url.const';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../Redux/authSlice';


const MyProperties = ({onViewDetailsClick}) => {
const [visibleDropdown, setVisibleDropdown] = useState(null);
 const dispatch = useDispatch();
    const [activeProperties, setActiveProperties] = useState([]);
    const [loading, setLoading] = useState(true);
  
   const landlord = useSelector((state) => state.landlord); 
  const agentLandlord = useSelector((state) => state.agentLandlord); 
    const [authToken, setAuthToken] = useState(null);
  
    const toggleDropdown = (id) => {
        setVisibleDropdown(visibleDropdown === id ? null : id); 
      };
    useEffect(() => {
      const landlordToken = localStorage.getItem('authToken');
      const agentLandlordToken = localStorage.getItem('authTokenAgentLandlord');
  
      if (landlordToken) {
        setAuthToken(landlordToken);
      } else if (agentLandlordToken) {
        setAuthToken(agentLandlordToken);
      } else {
        setAuthToken(null); 
      }
    }, []);
    const fetchProperties = async () => {
        try {
          // Fetch properties
          const response = await axios.get(`${baseUrl}/properties`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
  
          const properties = response.data.properties;
  
          const filteredProperties = properties.filter((property) => {
              if (authToken) {
                if (landlord && landlord.id && localStorage.getItem('authToken') === authToken) {
                  return property.userId === landlord.id;
                }
                if (agentLandlord && agentLandlord.id && localStorage.getItem('authTokenAgentLandlord') === authToken) {
                  return property.userId === agentLandlord.id;
                }
              }
              return false;
            });
            
  
         // Separate active and inactive properties
      const active = filteredProperties;
     
  
          // Update state
          setActiveProperties(active);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching properties:', error);
          setLoading(false);
        }
      };
  
    useEffect(() => {
      
        if (authToken) {
          fetchProperties();
        } else {
          setLoading(false);
        }
      }, [authToken, landlord, agentLandlord]);
    
  
    if (loading) {
      return <p>Loading properties...</p>;
    }
  
  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());    
  };
    const updatePropertyStatus = async (propertyId, status) => {
      try {
      
    
        if (!authToken) {
          toast.error("You are not authenticated. Please log in.");
          return;
        }
    
        const propertyToUpdate = activeProperties.find((property) => property.id === propertyId);
    
        if (!propertyToUpdate) {
          toast.error("Property not found!");
          return;
        }
    
        // Create FormData and append property details
        const formData = new FormData();
    
        Object.entries(propertyToUpdate).forEach(([key, value]) => {
          if (key === "status") {
            // Ensure the updated status is sent
            formData.append(key, status);
          } else if (Array.isArray(value)) {
            // Handle arrays
            value.forEach((item) => {
              if (item instanceof File) {
                formData.append(key, item); // Append file arrays (e.g., photos, floorPlans)
              } else {
                formData.append(key, item); // Append other array items
              }
            });
          } else if (typeof value === "boolean") {
            // Convert booleans to strings
            formData.append(key, value.toString());
          } else if (value instanceof File) {
            // Handle file uploads
            formData.append(key, value);
          } else {
            // Append other key-value pairs
            formData.append(key, value || "");
          }
        });
    
        // Log FormData content for debugging (optional)
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
    
        // Make PUT request with FormData
        const response = await fetch(`${baseUrl}/properties/${propertyId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
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
    
        const data = await response.json();
        fetchProperties();
        setVisibleDropdown(null);
        toast.success(`Property status updated to "${status}" successfully!`);
        console.log("Response from server:", data);
      } catch (error) {
        console.error("Error updating property status:", error);
        toast.error("Failed to update the property status. Please try again.");
      }
    };
    
    const handleViewDetails = (id) => {
        onViewDetailsClick(id);
      };
  return (
    <div
      className="bg-opacity-14 p-8 pb-14 shadow-md"
      style={{ borderTopLeftRadius: '30px', width: '100%', background: 'rgba(198, 76, 123, 0.10)' }}
    >
      {/* Active Properties Section */}
      <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">My All Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {activeProperties.length > 0 ? (
          activeProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
              <img
                src={`${baseUrl}/uploads/${property.photos[0].replace(/^.*[\\/]uploads[\\/]/, '')}`}
                alt="Property"
                className="w-full object-cover rounded-3xl mb-4"
              />
              <h3 className="text-md font-medium">{property.propertyDescription}</h3>
              <p className="text-sm">{property.rentAmount} USD</p>
              <p className="text-sm mb-4">{property.propertyType}</p>
              <div className="flex justify-between relative">
                <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]"  onClick={() => handleViewDetails(property.id)}>
                  View Details
                </button>
                 {/* Vertical Dots Button */}
                 <button
                  onClick={() => toggleDropdown(property.id)}
                  className="bg-gray-200 text-black text-[14px] px-3 py-1 rounded-full hover:bg-gray-300"
                >
                  &#8226;&#8226;&#8226;
                </button>


{visibleDropdown === property.id && (
  <div className="absolute right-0 mt-9 bg-white shadow-lg rounded-lg z-10">
    <button
      onClick={() => updatePropertyStatus(property.id, "Inactive")} // Set status to "Inactive"
      className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100 ${
        property.status === "Inactive" ? "bg-gray-200" : "" 
      }`}
    >
      Deactivate
    </button>
    <button
      className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100 ${
        property.status === "Let" ? "bg-green-200" : "" 
      }`}
      onClick={() => updatePropertyStatus(property.id, "Let")} // Set status to "To Let"
    >
      Let
    </button>
    {/* To Let Button */}
    <button
      className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100 ${
        property.status === "To Let" ? "bg-yellow-200" : "" // Highlight if status is "To Let"
      }`}
      onClick={() => updatePropertyStatus(property.id, "To Let")} // Set status to "To Let"
    >
      To Let
    </button>
  </div>
)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={require("../../assets/images/image6.png")}
                alt="No Saved Properties"
                className="w-60 h-50"
              />
            </div>
            <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Active Properties</p>
          </div>
        )}
      </div>

    </div>
  );
};


export default MyProperties