import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from "../../assets/images/image5.png"; // Placeholder for property images
import { baseUrl } from '../../const/url.const';

const SavedProperties = ({  onViewDetailsClick, onUploadingRequestClick }) => {
  const careprovider = useSelector((state) => state.careProvider);
  const [properties, setProperties] = useState([]);
const [visibleDropdown, setVisibleDropdown] = useState(null);

const toggleDropdown = (id) => {
  setVisibleDropdown(visibleDropdown === id ? null : id); // Toggle visibility for the clicked property
};
  useEffect(() => {
    // Fetch properties from the API
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json(); // Parse the JSON response
        
        // Check if the 'properties' array is available
        if (!data.properties || data.properties.length === 0) {
          throw new Error('No properties found');
        }

        const fetchedProperties = data.properties;

        // Filter the fetched properties based on careprovider's saved properties
        const savedProperties = careprovider.savedProperties || [];
        
        // Convert savedProperties to numbers for comparison, if they are strings
        const savedPropertyIds = savedProperties.map((id) => Number(id)); 

        // Filter properties where the id is in the savedPropertyIds array
        const filteredProperties = fetchedProperties.filter((property) =>
          savedPropertyIds.includes(property.id) 
        );

        // Remove duplicates by the property ID
        const uniqueProperties = Array.from(new Set(filteredProperties.map((property) => property.id)))
          .map((id) => filteredProperties.find((property) => property.id === id));

        setProperties(uniqueProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [careprovider.savedProperties]);
 
  const handleViewDetails = (id) => {
    onViewDetailsClick(id);
  };
   
  const handleUploadRequestClick = (id) => {
    onUploadingRequestClick(id);
  };
  return (
    <div className="bg-opacity-14 p-8 pb-14 shadow-md" style={{ borderTopLeftRadius: '30px', width: '100%', background: 'rgba(198, 76, 123, 0.10)' }}>
      <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Saved Properties</h2>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
              <img  src={`${baseUrl}/uploads/${property.photos[0].replace(/^.*[\\/]uploads[\\/]/, '')}`} alt="Property" className="w-full object-cover rounded-3xl mb-4" />
              <h3 className="text-md font-medium">{property.propertyDescription}</h3>
              <p className="text-sm">{property.rentAmount} USD</p>
              <p className="text-sm mb-4">{property.propertyType}</p>
              <div className="flex justify-between relative">
                <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]" onClick={() => handleViewDetails(property.id)}>View Details</button>
            {/* Vertical Dots Button */}
          { ["Active", "To Let"].includes(property.status) &&  <button
                    onClick={() => toggleDropdown(property.id)}
                    className="bg-gray-200 text-black text-[14px] px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    &#8226;&#8226;&#8226;
                  </button>}
  
  {/* Dropdown Menu */}
  {visibleDropdown === property.id && (
    <div className="absolute right-0 mt-9 bg-white shadow-lg rounded-lg z-10">
     
 <button
        className={`block w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-100`}      onClick={() => handleUploadRequestClick(property.id)}  >
       Make a Request
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
              src={require("../../assets/images/image6.png")} // Placeholder for no saved properties
              alt="No Saved Properties"
              className="w-60 h-50"
            />
          </div>
          <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Saved Properties</p>
        </div>
      )}
    </div>
  );
}

export default SavedProperties;
