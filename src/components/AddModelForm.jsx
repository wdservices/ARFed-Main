import React, { useState } from "react";
import app from "../lib/firebaseClient";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore(app);

export default function AddModelForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [iosModelUrl, setIosModelUrl] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "models"), {
      title,
      description,
      imageUrl,
      modelUrl,
      iosModelUrl,
      subjectId,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setDescription("");
    setImageUrl("");
    setModelUrl("");
    setIosModelUrl("");
    setSubjectId("");
    setLoading(false);
    alert("Model added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Model</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required /><br />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required /><br />
      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" required /><br />
      <input value={modelUrl} onChange={e => setModelUrl(e.target.value)} placeholder="Model URL" required /><br />
      <input value={iosModelUrl} onChange={e => setIosModelUrl(e.target.value)} placeholder="iOS Model URL" /><br />
      <input value={subjectId} onChange={e => setSubjectId(e.target.value)} placeholder="Subject ID" /><br />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Model"}</button>
    </form>
  );
}