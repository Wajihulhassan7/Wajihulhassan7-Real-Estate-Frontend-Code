import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiSearch } from 'react-icons/fi';
import MarkerHouse from "../../assets/images/houseWithLocationSymbol.png"; // Import your image
import { baseUrl } from '../../const/url.const';
import "../../assets/css/dashboardMatchmaker/dashboardMatchmaker.css"

const SearchforCareProviders1 = ({onViewDetailsClick, onViewDetailsRequest}) => {
  const mapContainerRef = useRef(null); // Ref for the map container
  const mapInstanceRef = useRef(null); // Ref for the map instance
  const markersRef = useRef([]); // Ref to store markers
  const [postcode, setPostcode] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [numOfBedrooms, setNumOfBedrooms] = useState("");

  useEffect(() => {
    // Fetch properties from the API when the component mounts
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties/requests`);
        const data = await response.json();

        // Ensure data is an array, else set to an empty array
        if (Array.isArray(data)) {
          setProperties(data); // Set the properties array
          setFilteredProperties(data); // Initially display all properties
        } else {
          console.error("Expected an array, but received:", data);
          setFilteredProperties([]); // Handle unexpected response by setting empty array
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setFilteredProperties([]); // Set to empty array in case of an error
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    // Initialize the map only once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([51.5074, -0.1278], 6); // Default position
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Property Care Hub",
      }).addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
  
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  
    // Define custom icon for the marker
    const customIcon = L.icon({
      iconUrl: MarkerHouse,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  
    // Add markers for filtered properties based on latitude and longitude
    filteredProperties.forEach((property) => {
      const { latitude, longitude, id, address, city, postalCode } = property;
      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const marker = L.marker([lat, lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `
              <div>
                <b>${address}</b><br>${city}<br>${postalCode}<br>
                <button id="view-details-${id}" style="background-color: #007bff; color: white; padding: 4px 20px; border: none; border-radius: 5px; font-size: 14px;margin-top:15px; cursor: pointer; transition: all 0.3s ease;">View more details</button>
              </div>
            `
          );
  
        // Attach the event listener manually to the button
        marker.on('popupopen', () => {
          const viewButton = document.getElementById(`view-details-${id}`);
          if (viewButton) {
            viewButton.addEventListener('click', () => handleViewDetails(id));
          }
        });
  
        markersRef.current.push(marker);
      }
    });
  
    // Adjust map bounds to fit markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds());
    }
  }, [filteredProperties]);
  
  const handleViewDetails = (id) => {
    // Find the property with the given id from the properties array
    const property = properties.find((property) => property.id === id);
  
    // If the property is found, pass it to onViewDetailsRequest
    if (property) {
      onViewDetailsRequest(property); // Assuming onViewDetailsRequest is a function you want to call with the property data
    } else {
      alert('Property not found!');
    }
  };
  
  
  const handleSearch = () => {
    const matched = properties.filter((property) =>
      property.postalCode.toString().startsWith(postcode)
    );
    setFilteredProperties(matched);
  };

  const handleFiltersChange = () => {
    let filtered = properties;

    if (city) {
      filtered = filtered.filter((property) => property.city === city);
    }
    if (propertyType) {
      filtered = filtered.filter((property) => property.propertyType === propertyType);
    }
    if (numOfBedrooms) {
      filtered = filtered.filter((property) => property.numOfBedrooms === parseInt(numOfBedrooms));
    }

    if (postcode) {
      filtered = filtered.filter((property) =>
        property.postalCode.toString().startsWith(postcode)
      );
    }
    setFilteredProperties(filtered);
  };

  const handleRemoveFilters = () => {
    // Reset all filters
    setCity('');
    setPropertyType('');
    setNumOfBedrooms('');
    setPostcode('');

    // Reset the filtered properties to the full list
    setFilteredProperties(properties);
  };
 
    return (
      <div className="matchMakerWrapper">
        <h1>Search For Properties Requests</h1>
  
        <div className="matchMakerMain">
          <div className="matchMakerInput">
            <input
              type="text"
              placeholder="Search with Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <FiSearch className="searchIcon" onClick={handleSearch} />
          </div>
  
          <p>Use the filters to customize your search and find properties that match your specific criteria.</p>
  
          <div className="matchMakerButtonsWrapper">
            <select
              className="border rounded-lg matchMakerSelect"
              name="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                handleFiltersChange();
              }}
            >
             <option value="">Select a city</option>
    <optgroup label="England">
      <option value="Bath">Bath</option>
      <option value="Birmingham">Birmingham*</option>
      <option value="Bradford">Bradford*</option>
      <option value="Brighton & Hove">Brighton & Hove</option>
      <option value="Bristol">Bristol*</option>
      <option value="Cambridge">Cambridge</option>
      <option value="Canterbury">Canterbury*</option>
      <option value="Carlisle">Carlisle</option>
      <option value="Chelmsford">Chelmsford</option>
      <option value="Chester">Chester*</option>
      <option value="Chichester">Chichester</option>
      <option value="Colchester">Colchester</option>
      <option value="Coventry">Coventry*</option>
      <option value="Derby">Derby</option>
      <option value="Doncaster">Doncaster</option>
      <option value="Durham">Durham</option>
      <option value="Ely">Ely</option>
      <option value="Exeter">Exeter*</option>
      <option value="Gloucester">Gloucester</option>
      <option value="Hereford">Hereford</option>
      <option value="Kingston-upon-Hull">Kingston-upon-Hull*</option>
      <option value="Lancaster">Lancaster</option>
      <option value="Leeds">Leeds*</option>
      <option value="Leicester">Leicester*</option>
      <option value="Lichfield">Lichfield</option>
      <option value="Lincoln">Lincoln</option>
      <option value="Liverpool">Liverpool*</option>
      <option value="London">London*</option>
      <option value="Manchester">Manchester*</option>
      <option value="Milton Keynes">Milton Keynes</option>
      <option value="Newcastle-upon-Tyne">Newcastle-upon-Tyne*</option>
      <option value="Norwich">Norwich*</option>
      <option value="Nottingham">Nottingham*</option>
      <option value="Oxford">Oxford*</option>
      <option value="Peterborough">Peterborough</option>
      <option value="Plymouth">Plymouth*</option>
      <option value="Portsmouth">Portsmouth*</option>
      <option value="Preston">Preston</option>
      <option value="Ripon">Ripon</option>
      <option value="Salford">Salford</option>
      <option value="Salisbury">Salisbury</option>
      <option value="Sheffield">Sheffield*</option>
      <option value="Southampton">Southampton*</option>
      <option value="Southend-on-Sea">Southend-on-Sea</option>
      <option value="St Albans">St Albans</option>
      <option value="Stoke on Trent">Stoke on Trent*</option>
      <option value="Sunderland">Sunderland</option>
      <option value="Truro">Truro</option>
      <option value="Wakefield">Wakefield</option>
      <option value="Wells">Wells</option>
      <option value="Westminster">Westminster*</option>
      <option value="Winchester">Winchester</option>
      <option value="Wolverhampton">Wolverhampton</option>
      <option value="Worcester">Worcester</option>
      <option value="York">York*</option>
    </optgroup>
    <optgroup label="Northern Ireland">
      <option value="Armagh">Armagh*</option>
      <option value="Bangor">Bangor</option>
      <option value="Belfast">Belfast*</option>
      <option value="Lisburn">Lisburn</option>
      <option value="Londonderry">Londonderry</option>
      <option value="Newry">Newry</option>
    </optgroup>
    <optgroup label="Scotland">
      <option value="Aberdeen">Aberdeen*</option>
      <option value="Dundee">Dundee*</option>
      <option value="Dunfermline">Dunfermline</option>
      <option value="Edinburgh">Edinburgh*</option>
      <option value="Glasgow">Glasgow*</option>
      <option value="Inverness">Inverness</option>
      <option value="Perth">Perth</option>
      <option value="Stirling">Stirling</option>
    </optgroup>
    <optgroup label="Wales">
      <option value="Bangor">Bangor</option>
      <option value="Cardiff">Cardiff*</option>
      <option value="Newport">Newport</option>
      <option value="St Asaph">St Asaph</option>
      <option value="St Davids">St Davids</option>
      <option value="Swansea">Swansea*</option>
      <option value="Wrexham">Wrexham</option>
    </optgroup>
            </select>
  
            <select
              className="border rounded-lg matchMakerSelect"
              name="propertyType"
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                handleFiltersChange();
              }}
            >
           <option value="">Choose a Property type</option>
            <option value="Detached House">Detached House</option>
            <option value="Semi-Detached House">Semi-Detached House</option>
            <option value="Terraced House">Terraced House</option>
            <option value="End-of-Terrace House">End-of-Terrace House</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Apartment/Flat">Apartment/Flat</option>
            <option value="Studio">Studio</option>
            <option value="Maisonette">Maisonette</option>
            <option value="Room in a Shared House">Room in a Shared House</option>
            <option value="Commercial Property">Commercial Property</option>
            </select>
  
            <select
              className="border rounded-lg matchMakerSelect"
              name="numOfBedrooms"
              value={numOfBedrooms}
              onChange={(e) => {
                setNumOfBedrooms(e.target.value);
                handleFiltersChange();
              }}
            >
              <option value="">Choose a Number</option>
              {[...Array(10).keys()].map((num) => (
                <option key={num} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>
  
          <div style={{ display: 'flex', gap: '10px' }}>
  <button
    onClick={handleFiltersChange}
    className="text-white rounded-lg px-6 py-2 font-bold transition-all duration-300"
    style={{
      backgroundColor: '#a53864',
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#912e4c')}
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#a53864')}
  >
    Search
  </button>
  {(city || propertyType || numOfBedrooms || postcode) && (
  <button
    onClick={handleRemoveFilters}
    className="text-white rounded-lg px-6 py-2 font-bold transition-all duration-300"
    style={{
      backgroundColor: '#154D7C', // Default background color
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#1D3557')} // Hover background color
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#154D7C')} // Revert to default
  >
    Reset Filters
  </button>
)}


</div>


{filteredProperties.length === 0 && (city || propertyType || numOfBedrooms || postcode) && (
  <div className="noResultsMessage">
    <p style={{ color: 'red' }}>No properties found matching your search criteria.</p>
  </div>
)}


  
          <div
            style={{
              width: "100%",
              height: "auto",
              marginTop: "20px",
              padding: "15px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              background: "#fff",
              borderRadius: "10px",
            }}
          >
            <div
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  
export default SearchforCareProviders1;
