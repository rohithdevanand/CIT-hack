import { useNavigate } from "react-router-dom";
import "../../styles/patient.css";

function PatientLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/chat");
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1 className="logo">🚑 MedAssist</h1>
        <p className="tagline">AI Powered Emergency Healthcare</p>

        <input
          type="text"
          placeholder="Enter Mobile Number"
          className="login-input"
        />

        <button onClick={handleLogin} className="login-button">
          Continue
        </button>

        <p className="secure-text">
          🔒 Secure emergency access
        </p>

      </div>

    </div>
  );
}

export default PatientLogin;