import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../const/url.const';

function KeyStats({ onUploadClick, onCurrentPropertiesClick, onRequestsReceivedClick , onLeasedPropertiesClick }) {
  const landlord = useSelector((state) => state.landlord); // Access landlord details from Redux store
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [requests, setRequests] = useState([]);
  
 useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties/requests`);
  
        const data = await response.json();
  
        // Handle cases where the response contains a "message" field
        if (data.message) {
          setRequests([]); // Set an empty array if no requests are found
          setError(''); // Clear the error message to avoid rendering it
          return;
        }
  
        // Ensure data is an array before filtering
        if (Array.isArray(data)) {
          const filteredData = data.filter(
            (request) => request.property.userId === landlord.id
          );
          setRequests(filteredData);
          setError(''); // Clear the error message if requests are successfully fetched
        } else {
          throw new Error('Unexpected data format received from the backend');
        }
      } catch (err) {
        setRequests([]); // Set requests to an empty array on error
        setError(err.message); // Set the error message for unexpected errors
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, [landlord.id]); // Dependency array to re-fetch if landlord.id changes
   

  // Filter properties based on landlord ID
  const landlordProperties = properties?.filter(
    (property) => property.userId === landlord.id
  );

  // Count active properties
  const activePropertiesCount = landlordProperties.filter(
    (property) => property.status === 'To Let'
  ).length;
  
  // Count leased properties
  const leasedPropertiesCount =  landlordProperties.filter(
    (property) => property.status === 'Leased' || property.status === 'Let'
  ).length;

  return (
    <div
      className="flex flex-col items-center justify-center space-y-8 p-4"
      style={{ width: '100%', maxWidth: '1200px' }}
    >
      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-full pt-8 justify-center">
            {/* Active Listings Card */}
            <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
              <h2 className="text-md font-bold font-montserrat text-[#000000]">
                Active Listings
              </h2>
              <p className="text-5xl font-inria font-light text-[#000000] my-4">
                {activePropertiesCount}
              </p>
              <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={onCurrentPropertiesClick}>
                View All
              </button>
            </div>
  
            {/* Leased Properties Card */}
            <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
              <h2 className="text-md font-bold font-montserrat text-[#000000]">
                Leased Properties
              </h2>
              <p className="text-5xl font-inria font-light text-[#000000] my-4">
                {leasedPropertiesCount}
              </p>
              <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={onLeasedPropertiesClick}>
                View All
              </button>
            </div>
  
            {/* Interested in Selling Card */}
            <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
              <h2 className="text-md font-bold font-montserrat text-[#000000]">
                Requests Received
              </h2>
              <p className="text-5xl font-inria font-light text-[#000000] my-4">
              {requests?.length}
              </p>
              <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={onRequestsReceivedClick}>
                View All
              </button>
            </div>
          </div>
  
          {/* Upload Button */}
          <div className="pt-8 pb-20">
            <button
              className="bg-[#C64C7B] text-white px-6 py-3 rounded-full text-sm hover:bg-[#9e3f60] transition duration-300"
              onClick={onUploadClick}
            >
              Upload Property
            </button>
          </div>
        </>
      )}
    </div>
  );
}  
export default KeyStats;
