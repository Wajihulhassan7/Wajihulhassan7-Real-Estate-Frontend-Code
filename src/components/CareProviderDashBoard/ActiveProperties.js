import React, { useState, useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux'; 
import axios from 'axios'; // Use axios to fetch data
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/authSlice';
import { baseUrl } from '../../const/url.const';

const ActiveProperties = ({  onViewDetailsClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
   const careprovider = useSelector((state) => state.careProvider); 
      const [visibleDropdown, setVisibleDropdown] = useState(null);
  
    const toggleDropdown = (id) => {
      setVisibleDropdown(visibleDropdown === id ? null : id); // Toggle visibility for the clicked property
    };
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${baseUrl}/properties`);
        setProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false); 
      }
    };
    
    const handleBookmarkClick = async (propertyId) => {
      
        try {
            const updatedSavedProperties = [...careprovider.savedProperties, propertyId];
          const token = localStorage.getItem('authTokenCareProvider'); 
      
          if (!token) {
            alert('No token found, please log in');
            return;
          }
      
          // Send PUT request with the property ID and the token
          const response = await fetch(`${baseUrl}/auth/careprovider/${careprovider.providerId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Attach token to Authorization header
            },
            body: JSON.stringify({
              savedProperties: updatedSavedProperties, 
            }),
          });
      
          if (response.ok) {
            alert('Property bookmarked successfully!');
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