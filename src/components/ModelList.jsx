import React, { useEffect, useState } from "react";
import app from "../lib/firebaseClient";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export default function ModelList() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      const querySnapshot = await getDocs(collection(db, "models"));
      const modelsArr = [];
      querySnapshot.forEach((doc) => {
        modelsArr.push({ id: doc.id, ...doc.data() });
      });
      setModels(modelsArr);
      setLoading(false);
    }
    fetchModels();
  }, []);

  if (loading) return <div>Loading models...</div>;

  return (
    <div>
      <h2>Models</h2>
      <ul>
        {models.map((model) => (
          <li key={model.id}>
            <strong>{model.title}</strong> <br />
            <img src={model.imageUrl} alt={model.title} width={100} />
            <p>{model.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}