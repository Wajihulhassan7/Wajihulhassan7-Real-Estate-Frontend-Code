import React, { useState, useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux'; // Import the useSelector hook to access Redux store
import axios from 'axios'; // Use axios to fetch data
import '../CareProviderDashBoard/style.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/authSlice';
import { baseUrl } from '../../const/url.const';
import { toast } from 'react-toastify';

const CurrentProperties = ({ onEditClick, onViewDetailsClick, onUploadClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const landlord = useSelector((state) => state.landlord); 
   const agentLandlord = useSelector((state) => state.agentLandlord); 
   const isAuthenticatedLandlord = useSelector((state) => state.auth.isAuthenticatedLandlord);
  const isAuthenticatedAgentLandlord = useSelector((state) => state.auth.isAuthenticatedAgentLandlord);

  const [visibleDropdown, setVisibleDropdown] = useState(null);
 const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Check for the logged-in user's token
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

  const toggleDropdown = (id) => {
    setVisibleDropdown(visibleDropdown === id ? null : id); 
  };
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${baseUrl}/properties`);
  
      // Determine the logged-in user's ID based on authentication
      let userId = null;
      if (isAuthenticatedLandlord && landlord?.id) {
        userId = landlord.id;
      } else if (isAuthenticatedAgentLandlord && agentLandlord?.id) {
        userId = agentLandlord.id;
      } else {
        console.error("No valid authenticated user found.");
        setProperties([]); // Clear properties if no user is authenticated
        return;
      }
  
      // Filter properties based on the logged-in user's ID and status
      const filteredProperties = response.data.properties.filter(
        (property) =>
          property.userId === userId &&
          ["To Let"].includes(property.status) // Include only specified statuses
      );
  
      setProperties(filteredProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };
  

  useEffect(() => {
    fetchProperties();
  }, [landlord.id, agentLandlord.id]);

  
  const handleEdit = (id) => {
    onEditClick(id);
  };

  const handleViewDetails = (id) => {
    onViewDetailsClick(id);
  };
// Handle Logout
const handleLogout = () => {
  dispatch(logout());    
  navigate('/login');
};

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any other loading indicator
  }
  const updatePropertyStatus = async (propertyId, status) => {
    try {
    
  
      if (!authToken) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }
  
      const propertyToUpdate = properties.find((property) => property.id === propertyId);
  
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
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(property.id)}
                  className="bg-[#2E86AB] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]"
                >
                  Edit
                </button>

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
      className="block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100"
      onClick={() => updatePropertyStatus(property.id, "Inactive")} // Set status to "Inactive"
    >
      Deactivate
    </button>
 
   
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
      <div className="mt-8 flex pt-2 pb-6 justify-center">
        <button className="bg-[#C64C7B] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E77A56]" onClick={onUploadClick}>
          Upload New Property
        </button>
      </div>
    </div>
  );
};

export default CurrentProperties;
