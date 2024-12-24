import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/authSlice";

const InactiveListing = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  // const [listings, setListings] = useState([]);  // Stores fetched properties
   const [visibleListings, setVisibleListings] = useState(2); // Start with 2 visible listings
  // const [loading, setLoading] = useState(true); // For loading state
  // const [error, setError] = useState(null); // For error handling
  // const landlord = useSelector((state) => state.landlord); // Access landlord details from Redux store
  
  
  // // Handle Logout
  // const handleLogout = () => {
  //   dispatch(logout());    
  //   navigate('/login');
  // };

  // const fetchProperties = async () => {
  //   try {
  //     const response = await fetch('http://172.25.0.226:3002/properties');
  //     const data = await response.json();
      
  //     // Filter properties with status "Inactive" and matching landlord ID
  //     const inactiveProperties = data.properties.filter(
  //       (property) => property.status === "Inactive" && property.userId === landlord.id
  //     );
      
  //     setListings(inactiveProperties);
  //   } catch (err) {
  //     setError("Failed to fetch properties.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 
  // useEffect(() => {
  //   fetchProperties();
  // }, [landlord.id]);
 
 
  const showMoreListings = () => {
    setVisibleListings((prevVisibleListings) => prevVisibleListings + 2);
  };

  // Show less listings
  const showLessListings = () => {
    setVisibleListings((prevVisibleListings) => Math.max(prevVisibleListings - 2, 2));
  };

  // Handle view details click
  // const handleViewDetails = (id) => {
  //   onViewDetailsInactiveListingClick(id);
  // };
  
  const Listings = [
    {
      id: 1,
      address: "123 Main Street, Springfield, IL",
      status: "Inactive",
      leaseDates: "2023-01-01 to 2023-12-31",
    },
    {
      id: 2,
      address: "456 Oak Avenue, Los Angeles, CA",
      status: "Inactive",
      leaseDates: "2023-02-15 to 2024-02-15",
    },
    {
      id: 3,
      address: "789 Pine Road, Austin, TX",
      status: "Inactive",
      leaseDates: "2022-05-01 to 2023-04-30",
    },
    {
      id: 4,
      address: "321 Maple Street, Miami, FL",
      status: "Inactive",
      leaseDates: "2023-03-10 to 2024-03-09",
    },
    {
      id: 5,
      address: "654 Elm Boulevard, Denver, CO",
      status: "Inactive",
      leaseDates: "2023-07-01 to 2024-06-30",
    },
    {
      id: 6,
      address: "987 Birch Lane, Seattle, WA",
      status: "Inactive",
      leaseDates: "2023-08-15 to 2024-08-14",
    },
    {
      id: 7,
      address: "741 Willow Drive, Phoenix, AZ",
      status: "Inactive",
      leaseDates: "2022-12-01 to 2023-11-30",
    },
    {
      id: 8,
      address: "852 Cedar Court, Boston, MA",
      status: "Inactive",
      leaseDates: "2023-06-01 to 2024-05-31",
    },
    {
      id: 9,
      address: "369 Redwood Way, San Diego, CA",
      status: "Inactive",
      leaseDates: "2023-04-15 to 2024-04-14",
    },
    {
      id: 10,
      address: "159 Ashwood Street, Chicago, IL",
      status: "Inactive",
      leaseDates: "2023-01-10 to 2023-12-10",
    },
  ];
  const [listings, setListings] = useState(Listings);
  

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (listings.length === 0) {
  //   return <div>No inactive listings found.</div>;
  // }

  // const updatePropertyStatus = async (propertyId, status) => {
  //   try {
  //     const authToken = localStorage.getItem("authToken");
  
  //     if (!authToken) {
  //       alert("You are not authenticated. Please log in.");
  //       return;
  //     }
  
  //     const propertyToUpdate = listings.find((property) => property.id === propertyId);
  
  //     if (!propertyToUpdate) {
  //       alert("Property not found!");
  //       return;
  //     }
  
  //     // Create FormData and append property details
  //     const formData = new FormData();
  
  //     Object.entries(propertyToUpdate).forEach(([key, value]) => {
  //       if (key === "status") {
  //         // Ensure the updated status is sent
  //         formData.append(key, status);
  //       } else if (Array.isArray(value)) {
  //         // Handle arrays
  //         value.forEach((item) => {
  //           if (item instanceof File) {
  //             formData.append(key, item); // Append file arrays (e.g., photos, floorPlans)
  //           } else {
  //             formData.append(key, item); // Append other array items
  //           }
  //         });
  //       } else if (typeof value === "boolean") {
  //         // Convert booleans to strings
  //         formData.append(key, value.toString());
  //       } else if (value instanceof File) {
  //         // Handle file uploads
  //         formData.append(key, value);
  //       } else {
  //         // Append other key-value pairs
  //         formData.append(key, value || "");
  //       }
  //     });
  
  //     // Log FormData content for debugging (optional)
  //     formData.forEach((value, key) => {
  //       console.log(`${key}:`, value);
  //     });
  
  //     // Make PUT request with FormData
  //     const response = await fetch(`http://172.25.0.226:3002/properties/${propertyId}`, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       console.error(`Error: ${response.status} - ${errorMessage}`);
  
  //       if (response.status === 401) {
  //         // Handle unauthorized error
  //         alert("Your session has expired. Please log in again.");
  //         handleLogout();
  //         return;
  //       }
  
  //       throw new Error(`Failed to update: ${response.statusText}`);
  //     }
  
  //     const data = await response.json();
  //     fetchProperties();
  //     alert(`Property status updated to "${status}" successfully!`);
  //     console.log("Response from server:", data);
  //   } catch (error) {
  //     console.error("Error updating property status:", error);
  //     alert("Failed to update the property status. Please try again.");
  //   }
  // };
  
  return (
    <div className="flex pt-8">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold pb-8 text-center font-raleway text-[#154D7C] mb-6">
            Inactive Listings
          </h1>

          {/* Table for larger screens */}
          <div className="hidden sm:block overflow-x-auto pb-24">
            <table className="w-full border-collapse border border-[#154D7C] min-w-[350px]">
              <thead>
                <tr className="bg-">
                  <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
                    Property Address
                  </th>
                  <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
                    Lease Dates
                  </th>
                  <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, visibleListings).map((listing, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                      {listing.address}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                      {listing.status}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                      {listing.leaseDates}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 border border-[#2E86AB]">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <button
  className="bg-[#154D7C] text-white px-4 py-1 rounded-full text-sm"
  // onClick={() => updatePropertyStatus(listing.id, "Active")} // Set status to "Active"
>
  Reactivate
</button>

                        <button
                          className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm"
                          // onClick={() => handleViewDetails(listing.id)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for smaller screens */}
          <div className="sm:hidden">
            {listings.slice(0, visibleListings).map((listing, index) => (
              <div
                key={index}
                className="border border-[#154D7C] rounded-xl mb-2 bg-white shadow-sm p-4"
              >
                <div className="text-sm font-bold text-[#000000]">
                  Property Address:
                </div>
                <div className="text-sm text-black">{listing.address}</div>

                <div className="text-sm font-bold text-[#000000] mt-2">
                  Status:
                </div>
                <div className="text-sm text-black">{listing.status}</div>

                <div className="text-sm font-bold text-[#000000] mt-2">
                  Lease Dates:
                </div>
                <div className="text-sm text-black">{listing.status}</div>

                <div className="mt-4 flex space-x-2">
                  <button className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm">
                    Reactivate
                  </button>
                  <button
                    className="bg-[#154D7C] text-white px-4 py-1 rounded-full text-sm"
                    // onClick={() => handleViewDetails(listing.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={showLessListings}
              className="py-2 px-4 bg-[#154D7C] text-sm text-white font-md rounded-3xl"
              disabled={visibleListings <= 2}
            >
              View Less
            </button>
            <button
              onClick={showMoreListings}
              className="py-2 px-4 bg-[#154D7C] text-sm text-white font-md rounded-3xl"
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactiveListing;
