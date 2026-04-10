import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "../../styles/patient.css";

function AmbulanceStatus() {

  const hospital = [12.9910, 77.6880];
  const patient = [12.9969, 77.6947];

  const [route, setRoute] = useState([]);
  const [altRoute, setAltRoute] = useState([]);
  const [ambulanceIndex, setAmbulanceIndex] = useState(0);
  const [stage, setStage] = useState("toPatient");
  const [distance, setDistance] = useState(0);
  const [rerouted, setRerouted] = useState(false);

  const driver = {
    name: "Ramesh Kumar",
    phone: "+91 9876543210",
    vehicle: "KA-03-AMB-2211"
  };

  // fetch main route
  const fetchRoute = async (start, end) => {

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${end[1]},${end[0]}` +
      `?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    const coords =
      data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

    setRoute(coords);
    setAmbulanceIndex(0);

    const km = data.routes[0].distance / 1000;
    setDistance(km.toFixed(2));
  };

  // fetch alternate route (simulated traffic reroute)
  const fetchAltRoute = async (start, end) => {

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${end[1]},${end[0]}` +
      `?overview=full&geometries=geojson&alternatives=true`;

    const res = await fetch(url);
    const data = await res.json();

    if(data.routes.length > 1){

      const coords =
        data.routes[1].geometry.coordinates.map(c => [c[1], c[0]]);

      setAltRoute(coords);

    }

  };

  // initial route
  useEffect(() => {

    fetchRoute(hospital, patient);
    fetchAltRoute(hospital, patient);

  }, []);

  // movement
  useEffect(() => {

    if(route.length === 0) return;

    const interval = setInterval(() => {

      setAmbulanceIndex(prev => {

        const next = prev + 1;

        // simulate reroute after 40% travel
        if(!rerouted && next > route.length * 0.4){

          setRerouted(true);

          if(altRoute.length > 0){

            setRoute(altRoute);
            return 0;

          }

        }

        if(next >= route.length){

          setDistance(0);

          if(stage === "toPatient"){

            setStage("toHospital");
            setRerouted(false);

            fetchRoute(patient, hospital);
            fetchAltRoute(patient, hospital);

            return 0;

          }

          if(stage === "toHospital"){

            clearInterval(interval);
            return prev;

          }

        }

        const remaining =
          ((route.length - next) / route.length) * distance;

        setDistance(remaining.toFixed(2));

        return next;

      });

    },1000);

    return () => clearInterval(interval);

  },[route, stage, altRoute, rerouted]);

  const ambulance = route[ambulanceIndex] || hospital;
  const remainingRoute = route.slice(ambulanceIndex);

  return (

    <div style={{ textAlign:"center", marginTop:"20px" }}>

      <h2>🚑 Smart Ambulance Navigation</h2>

      <h3>Distance Remaining: {distance} km</h3>

      <div style={{
        width:"85%",
        margin:"20px auto",
        height:"450px"
      }}>

        <MapContainer
          center={hospital}
          zoom={14}
          style={{ height:"100%", width:"100%" }}
        >

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* current route */}
          <Polyline positions={remainingRoute} color="red"/>

          {/* alternate route */}
          {altRoute.length > 0 && (
            <Polyline positions={altRoute} color="blue"/>
          )}

          {/* hospital */}
          <Marker position={hospital}>
            <Popup>🏥 Hospital</Popup>
          </Marker>

          {/* patient */}
          {stage === "toPatient" && (
            <Marker position={patient}>
              <Popup>📍 Patient</Popup>
            </Marker>
          )}

          {/* ambulance */}
          <Marker position={ambulance}>
            <Popup>

              <b>🚑 Ambulance</b><br/><br/>

              Driver: {driver.name}<br/>
              Phone: {driver.phone}<br/>
              Vehicle: {driver.vehicle}

            </Popup>
          </Marker>

        </MapContainer>

      </div>

    </div>

  );

}

export default AmbulanceStatus;