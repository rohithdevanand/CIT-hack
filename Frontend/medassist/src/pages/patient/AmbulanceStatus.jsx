import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "../../styles/patient.css";

function AmbulanceStatus() {

  const hospital = [12.9910, 77.6880];
  const patient = [12.9969, 77.6947];
  const kamdhenu = [12.9948, 77.6915];

  const [route, setRoute] = useState([]);
  const [trafficSegment, setTrafficSegment] = useState([]);
  const [ambulanceIndex, setAmbulanceIndex] = useState(0);
  const [stage, setStage] = useState("toPatient");
  const [distance, setDistance] = useState(0);
  const [trafficTriggered, setTrafficTriggered] = useState(false);

  // smooth position state
  const [ambulancePos, setAmbulancePos] = useState(hospital);

  const driver = {
    name: "Ramesh Kumar",
    phone: "+91 9876543210",
    vehicle: "KA-03-AMB-2211"
  };

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
    setAmbulancePos(coords[0]);

    const km = data.routes[0].distance / 1000;
    setDistance(km.toFixed(2));
  };

  const fetchAlternateRoute = async (start) => {

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${kamdhenu[1]},${kamdhenu[0]};${patient[1]},${patient[0]}` +
      `?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    const coords =
      data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

    setRoute(coords);
    setAmbulanceIndex(0);
    setAmbulancePos(coords[0]);
  };

  useEffect(() => {
    fetchRoute(hospital, patient);
  }, []);

  // ORIGINAL MOVEMENT LOGIC
  useEffect(() => {

    if (route.length === 0) return;

    const interval = setInterval(() => {

      setAmbulanceIndex(prev => {

        const next = prev + 1;

        // TRAFFIC near hospital
        if (
          stage === "toPatient" &&
          !trafficTriggered &&
          next > route.length * 0.2
        ) {

          setTrafficTriggered(true);

          const trafficPart = route.slice(next, next + 25);
          setTrafficSegment(trafficPart);

          const currentLocation = route[next];

          setTimeout(() => {

            setTrafficSegment([]);
            fetchAlternateRoute(currentLocation);

          }, 2000);

          return prev;
        }

        if (next >= route.length) {

          setDistance(0);

          if (stage === "toPatient") {

            alert("🚑 Ambulance reached patient");

            setStage("toHospital");
            setTrafficTriggered(false);

            fetchRoute(patient, hospital);

            return 0;
          }

          if (stage === "toHospital") {

            alert("🏥 Patient reached hospital");
            clearInterval(interval);

            return prev;
          }
        }

        const remaining =
          ((route.length - next) / route.length) * distance;

        setDistance(remaining.toFixed(2));

        return next;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [route, stage, trafficTriggered]);

  // SMOOTH ANIMATION
  useEffect(() => {

    if (route.length < 2) return;

    let frame;

    const animate = () => {

      setAmbulancePos(prev => {

        const i = ambulanceIndex;

        if (i >= route.length - 1) return prev;

        const start = route[i];
        const end = route[i + 1];

        const lat = prev[0] + (end[0] - prev[0]) * 0.08;
        const lng = prev[1] + (end[1] - prev[1]) * 0.08;

        return [lat, lng];
      });

      frame = requestAnimationFrame(animate);

    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);

  }, [ambulanceIndex, route]);

  const ambulance = ambulancePos;
  const remainingRoute = route.slice(ambulanceIndex);

  return (

    <div style={{ textAlign: "center", marginTop: "20px" }}>

      <h2>🚑 Emergency Ambulance Tracking</h2>

      <h3>
        Status: {stage === "toPatient"
          ? "🚑 Going to Patient"
          : "🏥 Going to Hospital"}
      </h3>

      <h3>Distance Remaining: {distance} km</h3>

      <div style={{
        width: "85%",
        margin: "20px auto",
        height: "450px"
      }}>

        <MapContainer
          center={patient}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={remainingRoute}
            pathOptions={{ color: "red", weight: 5 }}
          />

          {trafficSegment.length > 0 && (
            <Polyline
              positions={trafficSegment}
              pathOptions={{
                color: "orange",
                weight: 10,
                dashArray: "8,12"
              }}
            />
          )}

          {stage === "toPatient" && (
            <Marker position={patient}>
              <Popup>📍 Patient Location</Popup>
            </Marker>
          )}

          <Marker position={hospital}>
            <Popup>🏥 Hospital</Popup>
          </Marker>

          <Marker position={ambulance}>
            <Popup>
              <b>🚑 Ambulance</b><br /><br />
              Driver: {driver.name}<br />
              Phone: {driver.phone}<br />
              Vehicle: {driver.vehicle}
            </Popup>
          </Marker>

        </MapContainer>

      </div>

    </div>

  );
}

export default AmbulanceStatus;