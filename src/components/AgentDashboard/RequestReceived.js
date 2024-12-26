import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { baseUrl } from '../../const/url.const';

function RequestReceived({onViewDetailsRequest}) {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  const [loading, setLoading] = useState(true);
  const [sortStatusDropdown, setSortStatusDropdown] = useState(false);
  const [sortPropertyDropdown, setSortPropertyDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState({ propertyReference: 'asc', status: '' });


  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties/requests`);
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      const filtered = requests.filter((request) => 
        request.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toString().includes(searchTerm) ||
        new Date(request.availableDate).toLocaleDateString().includes(searchTerm)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  };
  

  const handleSortStatus = () => {
    setSortStatusDropdown((prev) => !prev);
    setSortPropertyDropdown(false); // Close other dropdown
  };

  const handleSortProperty = () => {
    setSortPropertyDropdown((prev) => !prev);
    setSortStatusDropdown(false); // Close other dropdown
  };

  const handleSortChange = (type, order) => {
    setSortOrder((prev) => ({
      ...prev,
      [type]: order,
    }));

    let sortedRequests;
    if (type === 'status') {
      sortedRequests = requests.filter((request) =>
        order ? request.status.includes(order) : true
      );
      setFilteredRequests(sortedRequests);
    } else if (type === 'propertyReference') {
      sortedRequests = [...requests].sort((a, b) => {
        return order === 'asc' ? a.id - b.id : b.id - a.id;
      });
      setFilteredRequests(sortedRequests);
    }

    // Close the dropdown after selecting
    if (type === 'status') setSortStatusDropdown(false);
    if (type === 'propertyReference') setSortPropertyDropdown(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }


  const handleViewDetails = (id) => {
    onViewDetailsRequest(id);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-extrabold font-montserrat text-center pb-4 px-8 text-[#154D7C] mb-6">
        Requests Received
      </h2>
      <div className="flex flex-col items-center space-y-6 mb-8">
        {/* Search Section */}
        <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg pb-4">
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for Requests"
            type="search"
            className="border border-[#C64C7B] rounded-full px-4 py-2 w-full focus:outline-none"
          />
          <button
            onClick={handleSearchClick}
            className="absolute inset-y-0 right-4 flex items-center justify-center text-[#C64C7B] hover:text-pink-500"
            style={{ top: '50%', right: '16px', transform: 'translateY(-70%)', background:'#fff' }}
          >
            <FiSearch size={24} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center font-montserrat space-y-4 sm:space-y-4 md:space-y-4 lg:space-y-0 lg:space-x-4 py-6">
        <div className="relative inline-block">
          <button
            onClick={handleSortStatus}
            className="bg-[#9FC8DA] text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#7BAAC8] transition"
          >
            Sort by Status
            <span className="absolute top-0 right-0 w-5 h-5 bg-white -translate-y-[55%] translate-x-[5%] rotate-45"></span>
          </button>
          {sortStatusDropdown && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-[#C64C7B]">
              <button
                onClick={() => handleSortChange('status', 'Saved')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Saved
              </button>
              <button
                onClick={() => handleSortChange('status', 'Pending')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Pending
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block">
          <button
            onClick={handleSortProperty}
            className="bg-[#9FC8DA] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-[#7BAAC8] transition"
          >
            Sort by Property Reference
            <span className="absolute top-0 right-0 w-5 h-5 bg-white -translate-y-[55%] translate-x-[5%] rotate-45"></span>
          </button>
          {sortPropertyDropdown && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-[#C64C7B]">
              <button
                onClick={() => handleSortChange('propertyReference', 'asc')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Sort Ascending
              </button>
              <button
                onClick={() => handleSortChange('propertyReference', 'desc')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Sort Descending
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Cards View for Small and Medium Screens */}
      <div className="block lg:hidden overflow-x-auto px-4 pb-24">
        {filteredRequests.map((request, index) => (
          <div key={request.id} className="border border-[#154D7C] rounded-xl mb-4 bg-white shadow-sm p-4">
            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000]">Landlord Name:</div>
            <div className="text-sm md:text-lg text-black">{request.userId}</div>

            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Request Date:</div>
            <div className="text-sm md:text-lg text-black">{new Date(request.createdAt).toLocaleDateString()}</div>

            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Property Reference:</div>
            <div className="text-sm md:text-lg text-black">{request.propertyReference}</div>

            <div className="text-sm md:md:text-xl font-bold font-montserrat text-[#000000] mt-2">Status:</div>
            <div className="text-sm md:text-lg text-black">{request.status.join(', ')}</div>

            <div className="mt-4 md:pt-4  md:space-x-6 flex justify-center space-x-2">
              <button className="bg-[#C64C7B] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl">
                View Request
              </button>
              <button className="bg-[#154D7C] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl">
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table View for Large Screens */}
      <div className="hidden lg:block justify-center overflow-x-auto pb-24">
        <div className="w-full max-w-5xl">
          <table className="w-full border-collapse border border-[#154D7C] mx-auto">
            <thead>
              <tr className="bg-[#F0F4F8] font-montserrat">
                <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">
                  Property Reference
                </th>
                <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="bg-white">
                  <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">{request.id}</td>
                  <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">{request.propertyType}</td>
                  <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                    {request.status.join(', ')}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 border border-[#2E86AB]">
                    <div className="flex flex-col space-y-2 lg:flex-col">
                      <button className="bg-[#154D7C] text-white px-4 py-1 rounded-full text-xs" onClick={() => handleViewDetails(request)}>
                        View Request
                      </button>
                      <button className="bg-[#C64C7B] text-white px-4 py-1 whitespace-nowrap rounded-full text-xs mt-2">
                        Respond
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestReceived;
