import React, { useState } from "react";
import { Event } from "../models/event";
import { JS_MAPS_API_KEY } from "./secret";
import { GoogleMap, Marker, useLoadScript, InfoWindow, MarkerClusterer } from "@react-google-maps/api";

import moment from 'moment'

interface googleMapProps {
  allEvents: Event[];
}

interface MarkerInterface {
  lat: number;
  lng: number;
}

const Map: React.FC<googleMapProps> = ({ allEvents }): any => {
    const [selected, setSelected] = useState<Event | undefined>(undefined);

  const mapContainerStyle = {
    width: "60vw",
    height: "60vh",
  };

  //center map in israel
  const center = {
    lat: 31.768318,
    lng: 35.213711,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: JS_MAPS_API_KEY || "",
  });

  //generate markers array from data

  console.log(isLoaded);

  if (loadError) return "Error loading Map";
  if (!isLoaded) return "Loading Map";
  

  return (
    <div className="mapContainer">
      <h1>GoogleMap</h1>
      <GoogleMap center={center} zoom={8} mapContainerStyle={mapContainerStyle}>
      <MarkerClusterer>
              {(clusterer)=> 
              allEvents? allEvents!.map((marker)=>{
             return <Marker key={marker._id} position={marker.geolocation.location} clusterer={clusterer}/> 
          }):null}
          </MarkerClusterer>
          {selected ? (
            <InfoWindow
              onCloseClick={() => {
                setSelected(undefined);
              }}
              position={selected.geolocation.location}
            >
              <div>
                <h2>{selected.name}</h2>
                <p>{moment(selected.date).format('MMMM Do YYYY')}</p>
              </div>
            </InfoWindow>
          ) : null}
      </GoogleMap>
    </div>
  );
};

export default Map;
