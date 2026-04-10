import { useState } from "react";
import "../../styles/patient.css";
import { useNavigate } from "react-router-dom";

function ChatTriage() {

  const navigate = useNavigate();   // ✅ THIS WAS MISSING

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if(message.trim() === "") return;

    setChat([...chat, {text: message, type:"user"}]);
    setMessage("");

    setTimeout(()=>{
      setChat(prev => [...prev,{
        text:"AI analyzing symptoms...",
        type:"ai"
      }]);
    },700);
  };

  const selectSymptom = (symptom) => {

  setChat([...chat,{text:symptom,type:"user"}]);

setTimeout(() => {

  let response = "";

  if(
  symptom === "Severe Chest Pain" ||
  symptom === "Unconscious / Not Responding" ||
  symptom === "Heavy Bleeding" ||
  symptom === "Stroke Symptoms (Face drooping / Weak arm)"
){
  response =
`⚠️ Critical Emergency Detected

🚑 Dispatching nearest ambulance...
🏥 Hospital: Apollo Hospital
⏱ ETA: 6 minutes

Please stay calm. Help is on the way.`;

  setChat(prev => [...prev,{
    text: response,
    type: "ai"
  }]);

  setTimeout(()=>{
    navigate("/ambulance");   // 🚑 page will open
  },3000);

  return;
}

  else if(
    symptom === "Severe Head Injury" ||
    symptom === "Seizure / Convulsions" ||
    symptom === "Severe Burn Injury"
  ){
    response =
`⚠️ Serious Condition Detected

Please go to the nearest hospital immediately.
If condition worsens, emergency services will be contacted.`;
  }

  else{
    response =
`Condition appears moderate.

Please monitor symptoms and seek medical care if necessary.`;
  }

  setChat(prev => [...prev,{
    text: response,
    type: "ai"
  }]);

},700);

};

  return (
    <div className="ai-layout">

      <div className="chat-messages">

        {chat.map((msg,index)=>(
          <div key={index} className={msg.type==="user" ? "user-msg":"ai-msg"}>
            {msg.text}
          </div>
        ))}

      </div>

      <div className="suggestions">

  <button onClick={()=>selectSymptom("Severe Chest Pain")}>
    ❤️ Severe Chest Pain
  </button>

  <button onClick={()=>selectSymptom("Difficulty Breathing")}>
    🫁 Difficulty Breathing
  </button>

  <button onClick={()=>selectSymptom("Heavy Bleeding")}>
    🩸 Heavy Bleeding
  </button>

  <button onClick={()=>selectSymptom("Unconscious / Not Responding")}>
    😵 Unconscious
  </button>

  <button onClick={()=>selectSymptom("Stroke Symptoms (Face drooping / Weak arm)")}>
    🧠 Stroke Symptoms
  </button>

  <button onClick={()=>selectSymptom("Severe Head Injury")}>
    🤕 Severe Head Injury
  </button>

  <button onClick={()=>selectSymptom("Seizure / Convulsions")}>
    ⚡ Seizure
  </button>

  <button onClick={()=>selectSymptom("Severe Burn Injury")}>
    🔥 Severe Burn
  </button>

  <button onClick={()=>selectSymptom("Severe Allergic Reaction")}>
    ⚠️ Severe Allergy
  </button>

  <button onClick={()=>selectSymptom("Major Accident Injury")}>
    🚑 Major Accident
  </button>

</div>

      <div className="input-area">

        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Describe your symptoms..."
        />

        <button onClick={sendMessage}>Send</button>

      </div>

    </div>
  );
}

export default ChatTriage;