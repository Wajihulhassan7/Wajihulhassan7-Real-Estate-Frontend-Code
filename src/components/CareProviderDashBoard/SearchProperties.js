import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiSearch } from 'react-icons/fi';
import MarkerHouse from "../../assets/images/houseWithLocationSymbol.png"; // Import your image
import { baseUrl } from '../../const/url.const';

const SearchProperties = () => {
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
        const response = await fetch(`${baseUrl}/properties`);
        const data = await response.json();
        setProperties(data.properties);
        setFilteredProperties(data.properties); // Initially display all properties
      } catch (error) {
        console.error("Error fetching properties:", error);
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
      const { latitude, longitude } = property;
      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const marker = L.marker([lat, lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<b>${property.address}</b><br>${property.city}<br>${property.postalCode}`
          );
        markersRef.current.push(marker);
      }
    });

    // Adjust map bounds to fit markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds());
    }
  }, [filteredProperties]);

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

    setFilteredProperties(filtered);
  };

  return (
    <div className="matchMakerWrapper">
      <h1>Search For Properties</h1>

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
            <option value="">City of Operation</option>
            <option value="Durham">Durham</option>
            <option value="Rawalpindi">Rawalpindi</option>
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

        {/* Display message when no properties match the filters */}
        {filteredProperties.length === 0 && (
          <div className="noResultsMessage">
            <p>No properties found matching your search criteria.</p>
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

export default SearchProperties;
