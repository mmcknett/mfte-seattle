import React, {useEffect, useRef, useState, useCallback} from 'react';
import './Map.scss';
import 'firebase/firestore';
import IMap from "../interfaces/IMap";
import IBuilding from "../interfaces/IBuilding";

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type InfoWindow = google.maps.InfoWindow;

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, filteredBuildings }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    }
  };

  const initMap = useCallback((zoomLevel: number, address: GoogleLatLng): void => {
    if (ref.current) {
      setMap( 
        new google.maps.Map(ref.current, {
          zoom: zoomLevel,
          center: address,
          mapTypeControl: mapTypeControl,
          scaleControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          mapTypeId: mapType,
          draggableCursor: 'pointer',
        })
      )
    }
  }, [mapType, mapTypeControl]);

  const defaultMapStart = useCallback((): void => {
    const defaultAddress = new google.maps.LatLng(47.608013, -122.315);
    initMap(14, defaultAddress);
  }, [initMap]);

  useEffect(startMap, [map, defaultMapStart]);

  function setMapOnAll(map: google.maps.Map | null) {
    markers.forEach((marker: any) => {
      marker.setMap(map);
    });
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

  function deleteMarkers() {
    clearMarkers();
    setMarkers([]);
  }

  useEffect(() => {
    drop(filteredBuildings);
  }, [filteredBuildings]);

  function drop(filteredBuildings:Array<IBuilding>) {
    const infoWindow = new google.maps.InfoWindow({content: ''});
    deleteMarkers();
    const newMarkers = filteredBuildings.map(building => addMarker(building, infoWindow));
    setMarkers(newMarkers);
  }

  function addMarker(building:IBuilding, infoWindow:InfoWindow) {
    const marker = new google.maps.Marker({ 
      position: new google.maps.LatLng({lat: building.lat, lng: building.lng}),
      map: map,
      animation: google.maps.Animation.DROP,
    });

    const phone1Ref = `tel:${building.phone}`;
    const phone2Ref = `tel:${building.phone2}`;

    let contentString = 
      '<strong><a href=' + 
      building.urlForBuilding + ' ' +
      `target='_blank' rel='noreferrer'>` +
      '<br>' +
      building.buildingName + '</a></strong>' + 
      '<br>' +
      '<strong>' + building.residentialTargetedArea + '</strong>' + 
      '<br>' +
      building.streetNum + " " +
      building.street +
      '<br>' +
      building.city + ', ' +
      building.state + ' ' +
      building.zip  + 
      '<br>' +
      '<a href=' + 
      phone1Ref + ' ' +
      '<br>' +
      building.phone + '</a>' + 
      '<br>'
  
    marker.addListener("click", () => {
      infoWindow.setContent(contentString)
      infoWindow.open(map, marker);
    });

    return marker;
  }

  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;