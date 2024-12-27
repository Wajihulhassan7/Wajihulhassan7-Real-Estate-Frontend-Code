import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../const/url.const';


const ProviderDetails = ({ email, onViewDetailsClick }) => {

    const [activeProperties, setActiveProperties] = useState([]);
    const [inactiveProperties, setInactiveProperties] = useState([]);
    const [loading, setLoading] = useState(true);
   const [token, setToken] = useState(null);
    useEffect(() => {
      const fetchPropertiesByLandlordEmail = async () => {
        try {
          // Fetch landlord details using the email
          const userResponse = await axios.get(`${baseUrl}/users/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          });
  
          // Extract the landlord's ID from the response data
          const providerId = userResponse.data.id;
  
         
          const requestsResponse = await axios.get(`${baseUrl}/properties/requests`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token for property API as well
            },
          });
  
          if (requestsResponse.data) {
            const properties = requestsResponse.data;
  
            // Filter properties based on the landlord ID and status
            const active = properties.filter((property) =>
              property.userId === providerId &&
              (property.status.includes("Open") || property.status.includes("Pending") || property.status.includes("Saved"))
            );
            
            const inactive = properties.filter((property) =>
              property.userId === providerId && property.status.includes("Resolved")
            );
            
  
            // Update state
            setActiveProperties(active);
            setInactiveProperties(inactive);
          }
        } catch (error) {
          console.error("Error fetching landlord details or properties:", error);
          setActiveProperties([]);
          setInactiveProperties([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPropertiesByLandlordEmail();
    }, [email, baseUrl]); 
  
    if (loading) {
      return <p>Loading properties...</p>;
    }
  
    const handleViewDetails = (id) => {
        onViewDetailsClick(id);
      };
  return (
    <div
      className="bg-opacity-14 p-8 pb-14 shadow-md"
      style={{ borderTopLeftRadius: '30px', width: '100%', background: 'rgba(198, 76, 123, 0.10)' }}
    >
      {/* Active Properties Section */}
      <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Active Requests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {activeProperties.length > 0 ? (
          activeProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
             
              <h3 className="text-md font-medium">{property.propertyDescription}</h3>
              <p className="text-sm">{property.rentAmount} USD</p>
              <p className="text-sm mb-4">{property.propertyType}</p>
              <div className="flex justify-between relative">
                <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]"  onClick={() => handleViewDetails(property)}>
                  View Details
                </button>
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
            <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Active Requests</p>
          </div>
        )}
      </div>

      {/* Inactive Requests Section */}
      <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Inactive Requests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {inactiveProperties.length > 0 ? (
          inactiveProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
             
              <h3 className="text-md font-medium">{property.propertyDescription}</h3>
              <p className="text-sm">{property.rentAmount} USD</p>
              <p className="text-sm mb-4">{property.propertyType}</p>
              <div className="flex justify-between relative">
                <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]"  onClick={() => handleViewDetails(property)}>
                  View Details
                </button>
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
            <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Inactive Requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails