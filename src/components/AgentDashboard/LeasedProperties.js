import React, { useEffect, useState } from 'react';
import Image from "../../assets/images/image5.png";
import { baseUrl } from '../../const/url.const';
import { useSelector } from 'react-redux';

const LeasedProperties = ({  onViewDetailsClick }) => {
  const [properties, setProperties] = useState([]);
 const agentLandlord = useSelector((state) => state.agentLandlord); 
    
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties`);
        if (!response.ok) {
          throw new Error("Failed to fetch property requests.");
        }
  
        const data = await response.json();
  
const leasedProperties = data.properties.filter(
    (property) => 
      (property.status === 'Leased' || property.status === 'Let') && 
      property.userId === agentLandlord.id
  );
        setProperties(leasedProperties);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
  
    fetchRequests();
  }, [agentLandlord.id]);
  
  
  const handleViewDetails = (id) => {
    onViewDetailsClick(id);
  };
  return (
    <div className="bg-opacity-14 p-8 pb-14 shadow-md" style={{ borderTopLeftRadius: '30px', width: '100%', background: 'rgba(198, 76, 123, 0.10)' }}>
      <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Leased Properties</h2>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
              <img   src={`${baseUrl}/uploads/${property.photos[0].replace(/^.*[\\/]uploads[\\/]/, '')}`} alt="Property" className="w-full object-cover rounded-3xl mb-4" />
              <h3 className="text-md font-medium">{property.propertyDescription}</h3>
              <p className="text-sm">{property.rentAmount} USD</p>
              <p className="text-sm mb-4">{property.propertyType}</p>
              <div className="flex justify-between relative">
                <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]" onClick={() => handleViewDetails(property.id)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src={require("../../assets/images/image6.png")} // Placeholder for no properties
              alt="No Leased Properties"
              className="w-60 h-50"
            />
          </div>
          <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Leased Properties</p>
        </div>
      )}
    </div>
  );
}

export default LeasedProperties;