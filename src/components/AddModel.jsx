[16:11:37.621] Running build in Washington, D.C., USA (East) – iad1
[16:11:37.624] Build machine configuration: 2 cores, 8 GB
[16:11:37.651] Cloning github.com/wdservices/ARFed-Main (Branch: main, Commit: 320c04a)
[16:11:39.363] Cloning completed: 1.711s
[16:11:42.570] Restored build cache from previous deployment (9s5sqZJexw5DA6ckHBrBexzwt77p)
[16:11:45.223] Running "vercel build"
[16:11:45.739] Vercel CLI 44.3.0
[16:11:46.074] Installing dependencies...
[16:11:50.727] 
[16:11:50.728] added 3 packages, and changed 1 package in 4s
[16:11:50.728] 
[16:11:50.728] 182 packages are looking for funding
[16:11:50.729]   run `npm fund` for details
[16:11:50.776] Detected Next.js version: 13.5.11
[16:11:50.777] Running "next build"
[16:11:52.098]    Linting and checking validity of types ...
[16:11:52.316]  ⚠ No ESLint configuration detected. Run next lint to begin setup
[16:12:03.051]    Creating an optimized production build ...
[16:12:03.584] > [PWA] Compile server
[16:12:03.586] > [PWA] Compile server
[16:12:03.586] > [PWA] Compile client (static)
[16:12:03.587] > [PWA] Auto register service worker with: /vercel/path0/node_modules/next-pwa/register.js
[16:12:03.587] > [PWA] Service worker: /vercel/path0/public/sw.js
[16:12:03.587] > [PWA]   url: /sw.js
[16:12:03.588] > [PWA]   scope: /
[16:12:09.145] Failed to compile.
[16:12:09.145] 
[16:12:09.146] ./src/pages/api/github-list.js
[16:12:09.146] Module not found: Can't resolve 'node-fetch'
[16:12:09.146] 
[16:12:09.146] https://nextjs.org/docs/messages/module-not-found
[16:12:09.146] 
[16:12:09.146] 
[16:12:09.147] > Build failed because of webpack errors
[16:12:09.172] Error: Command "next build" exited with 1
[16:12:09.910] 
[16:12:12.670] Exiting build containerimport React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { getCookie } from "cookies-next";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddModel = ({ open, closeModal }) => {
  const token = getCookie("token");
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [ios, setIos] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [audio, setAudio] = useState("");
  
  // Annotation states
  const [annotations, setAnnotations] = useState([]);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState({
    title: "",
    content: "",
    position: { x: 0, y: 0, z: 0 }
  });
  
  // Annotation states
  const [annotations, setAnnotations] = useState([]);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState({
    title: "",
    content: "",
    position: { x: 0, y: 0, z: 0 }
  });

  useEffect(() => {
    console.log("Current token:", token);
    const fetchSubjects = async () => {
      if (!token) {
        console.warn("No token found, skipping subject fetch.");
        toast.warn("Authentication token not found. Please log in again.");
        return;
      }
      try {
        const response = await axios.get("https://arfed-api.onrender.com/api/subject", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        });
        setSubjects(response.data);
        console.log("Subjects fetched successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        toast.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, [token]);

  const addSubject = () => {
    if (title && description && image && model !== "") {
      try {
        setLoading(true);
        axios
          .post(
            "https://arfed-api.onrender.com/api/models",
            {
              title,
              description,
              audio,
              image,
              model,
              subjectId: subject,
              iosModel: ios,
              audio,
              annotations: annotations.map((annotation, index) => ({
                id: annotation.id || `annotation-${index}`,
                title: annotation.title,
                content: annotation.content,
                position: annotation.position
              }))
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "auth-token": token,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            setLoading(false);
            closeModal();
            setDesc("");
            setImage("");
            setTitle("");
            setModel("");
            setAnnotations([]);
            toast.success("Model Created Successfully");
          });
      } catch (err) {
        console.log(err);
        toast.error("Oops! some error occurred");
      }
    } else {
      toast.warn("All input fields are required");
    }
  };

  const addAnnotation = () => {
    if (currentAnnotation.title && currentAnnotation.content) {
      const newAnnotation = {
        id: Date.now().toString(),
        title: currentAnnotation.title,
        content: currentAnnotation.content,
        position: currentAnnotation.position
      };
      setAnnotations([...annotations, newAnnotation]);
      setCurrentAnnotation({ title: "", content: "", position: { x: 0, y: 0, z: 0 } });
      setShowAnnotationForm(false);
      toast.success("Annotation added successfully");
    } else {
      toast.warn("Please fill in both title and content for the annotation");
    }
  };

  const removeAnnotation = (id) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
    toast.success("Annotation removed");
  };

  const updateAnnotationPosition = (id, field, value) => {
    setAnnotations(annotations.map(ann => 
      ann.id === id 
        ? { ...ann, position: { ...ann.position, [field]: parseFloat(value) || 0 } }
        : ann
    ));
  };

  return (
    <div>
      <Modal
        title="Add Model"
        centered
        style={{ top: 20 }}
        open={open}
        footer={null}
        onCancel={closeModal}
        width={600}
      >
        <div className="my-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="p-3 w-full bg-white border"
            placeholder="Enter Model Title"
          />
        </div>
        <div className="my-2">
          <select
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 w-full bg-white border"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>
        <div className="my-2">
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            name=""
            className="p-3 h-20 w-full  bg-white border"
            placeholder="Enter Model Description"
          ></textarea>
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setImage(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model Image URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setModel(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setIos(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter IOS Model URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setAudio(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model Audio URL"
          />
        </div>

        {/* Annotations Section */}
        <div className="my-4 border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-medium">Annotations ({annotations.length})</h4>
            <Button 
              type="primary" 
              onClick={() => setShowAnnotationForm(true)}
              className="bg-blue-500"
            >
              Add Annotation
            </Button>
          </div>

          {/* Annotation Form */}
          {showAnnotationForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-3 border">
              <h5 className="font-medium mb-2">New Annotation</h5>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Annotation Title"
                  value={currentAnnotation.title}
                  onChange={(e) => setCurrentAnnotation({...currentAnnotation, title: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Annotation Content"
                  value={currentAnnotation.content}
                  onChange={(e) => setCurrentAnnotation({...currentAnnotation, content: e.target.value})}
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="number"
                  placeholder="X Position"
                  value={currentAnnotation.position.x}
                  onChange={(e) => setCurrentAnnotation({
                    ...currentAnnotation, 
                    position: {...currentAnnotation.position, x: parseFloat(e.target.value) || 0}
                  })}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Y Position"
                  value={currentAnnotation.position.y}
                  onChange={(e) => setCurrentAnnotation({
                    ...currentAnnotation, 
                    position: {...currentAnnotation.position, y: parseFloat(e.target.value) || 0}
                  })}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Z Position"
                  value={currentAnnotation.position.z}
                  onChange={(e) => setCurrentAnnotation({
                    ...currentAnnotation, 
                    position: {...currentAnnotation.position, z: parseFloat(e.target.value) || 0}
                  })}
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addAnnotation} type="primary" className="bg-green-500">
                  Save Annotation
                </Button>
                <Button onClick={() => setShowAnnotationForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Annotations */}
          {annotations.map((annotation, index) => (
            <div key={annotation.id} className="bg-white border rounded-lg p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h6 className="font-medium text-blue-600">{annotation.title}</h6>
                  <p className="text-sm text-gray-600">{annotation.content}</p>
                </div>
                <Button 
                  type="text" 
                  danger 
                  onClick={() => removeAnnotation(annotation.id)}
                  className="text-red-500"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-gray-500">X:</label>
                  <input
                    type="number"
                    value={annotation.position.x}
                    onChange={(e) => updateAnnotationPosition(annotation.id, 'x', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500">Y:</label>
                  <input
                    type="number"
                    value={annotation.position.y}
                    onChange={(e) => updateAnnotationPosition(annotation.id, 'y', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500">Z:</label>
                  <input
                    type="number"
                    value={annotation.position.z}
                    onChange={(e) => updateAnnotationPosition(annotation.id, 'z', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Button loading={loading} onClick={() => addSubject()}>
            Submit
          </Button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};
export default AddModel;
