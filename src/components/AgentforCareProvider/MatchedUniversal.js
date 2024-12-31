import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../const/url.const';
import { useSelector } from 'react-redux';

const MatchedUniversal = () => {
    const [matchedProperties, setMatchedProperties] = useState([]);
    const careprovider = useSelector((state) => state.careProvider); 
    useEffect(() => {
       const fetchData = async () => {
         try {
           // Fetch active requests
           const requestsResponse = await fetch(`${baseUrl}/properties/requests`);
           const requestsData = await requestsResponse.json();
     
           const filteredRequests = requestsData.filter(
             (request) =>
               !request.status.includes("Leased") &&
               !request.status.includes("Let")
           );
     
           // Fetch properties from /properties
           const propertiesResponse = await fetch(`${baseUrl}/properties`);
           const propertiesData = await propertiesResponse.json();
     
           // Filter matched properties based on postal code
           const matchedProperties = propertiesData.properties.filter((property) =>
             filteredRequests.some(
               (request) =>  property.city === request.city &&
               property.propertyType === request.propertyType &&
               property.postalCode === request.postalCode
             )
           );
     
           // Set matched properties data
           setMatchedProperties(matchedProperties);
         } catch (error) {
           console.error("Error fetching data:", error);
         }
       };
     
       if (careprovider.id) {
         fetchData();
       }
     }, [careprovider.id]);
     
return (
   <div className="bg-opacity-14 p-8 pb-14 shadow-md" style={{ borderTopLeftRadius: '30px', width: '100%', background: 'rgba(198, 76, 123, 0.10)' }}>
     <h2 className="text-2xl font-extrabold font-montserrat py-4 px-8 text-[#2E86AB] mb-6">Matched Properties</h2>
     {matchedProperties.length > 0 ? (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
         {matchedProperties.map((property) => (
           <div key={property.id} className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
             <img  src={`${baseUrl}/uploads/${property?.photos[0].replace(/^.*[\\/]uploads[\\/]/, '')}`} alt="Property" className="w-full object-cover rounded-3xl mb-4" />
             <h3 className="text-md font-medium">{property.propertyDescription}</h3>
             <p className="text-sm">{property.rentAmount} USD</p>
             <p className="text-sm mb-4">{property.propertyType}</p>
             <div className="flex justify-between relative">
               <button className="bg-[#a53864] text-white text-[14px] px-3 py-1 rounded-full hover:bg-[#1E5D7B]" >View Details</button>
             </div>
           </div>
         ))}
       </div>
     ) : (
       <div className="flex flex-col items-center justify-center">
         <div className="flex items-center justify-center mb-4">
           <img
             src={require("../../assets/images/image6.png")} 
             alt="No Saved Properties"
             className="w-60 h-50"
           />
         </div>
         <p className="text-[#000000] font-raleway font-semibold text-sxl mb-5">No Matched Properties</p>
       </div>
     )}
   </div>
 );
}

export default MatchedUniversal