
import Image14 from '../../assets/images/image2.png';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestDetails = ({id}) => {
  const [property, setProperty] = useState(id);
 
  if (!property) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(0.3turn, rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${Image14})`,
        width: '100%',
        borderTopLeftRadius: '30px'
      }}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold font-raleway text-center text-white pt-10 mb-8">
          Request Details
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <PropertyDetail title="Request Type" value={property.propertyType} />
          <PropertyDetail title="Request Status" value={property.status} />
          <PropertyDetail title="Property Address" value={property.address} />
          <PropertyDetail title="City" value={property.city} />
          <PropertyDetail title="Postal Code" value={property.postalCode} />
        
          <PropertyDetail title="Number of Bedrooms" value={property.numOfBedrooms} />
          <PropertyDetail title="HMO" value={property.isHMO ? "Yes" : "No"} />
          <PropertyDetail title="Article 4" value={property.isArticle4 ? "Yes" : "No"} />
          <PropertyDetail title="HMO License" value={property.hmoLicense ? "Yes" : "No"} />
          <PropertyDetail title="Fire Door" value={property.fireDoor ? "Yes" : "No"} />
          <PropertyDetail title="Fire Alarm" value={property.fireAlarm ? "Yes" : "No"} />
          <PropertyDetail title="Number of Reception Rooms" value={property.numOfReceptionRooms} />
          <PropertyDetail
            title="Bathrooms"
            value={`Upstairs: ${property.numBathrooms}, Downstairs: ${property.numBathroomsInLocation}`}
          />
          <PropertyDetail
            title="Separate Toilets"
            value={`Upstairs: ${property.numToilets}, Downstairs: ${property.numToiletsInLocation}`}
          />
          <PropertyDetail title="Double Glazing" value={property.doubleGlazing ? "Yes" : "No"} />
          <PropertyDetail title="Central Heating" value={property.centralHeating ? "Yes" : "No"} />
          <PropertyDetail title="Furnished" value={property.furnished ? "Yes" : "No"} />
          <PropertyDetail title="Partly Furnished" value={property.partlyFurnished ? "Yes" : "No"} />
          <PropertyDetail title="Unfurnished" value={property.unfurnished ? "Yes" : "No"} />
          <PropertyDetail title="Rent Amount" value={`${property.rentAmount}`} />
          <PropertyDetail 
  title="Available Date" 
  value={property.availableDate.split('T')[0]} 
/>
  <PropertyDetail title="Lease Terms" value={property.leaseTerms.join(", ")} />
          <PropertyDetail title="Parking Availability" value={property.parkingAvailability} />
          <PropertyDetail
            title="Accessibility Features"
            value={property.accessibilityFeatures?.join(", ")}
          />
          <PropertyDetail title="Request Description" value={property.propertyDescription} />
          <PropertyDetail title="Latitude" value={property.latitude} />  
          <PropertyDetail title="longitude" value={property.longitude} />
        </div>
      </div>
    </div>
  );
    
  };

const PropertyDetail = ({ title, value }) => (
  <div className="border rounded-md bg-white font-montserrat shadow-md p-4">
    <h2 className="text-lg font-semibold text-[#154D7C] mb-2">{title}</h2>
    <p>{value}</p>
  </div>
);

export default RequestDetails