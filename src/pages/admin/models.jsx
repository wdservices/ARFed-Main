import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaCopy, FaCube } from "react-icons/fa";
import ModelCanvas from "@/components/ModelViewer/ModelCanvas";
import app from "../../lib/firebaseClient";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore(app);

const Models = () => {
  const [models, setModels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [open, openModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [single, setSingle] = useState("");
  const [iosModel, setIos] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [show3DConfig, setShow3DConfig] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [modelToDuplicate, setModelToDuplicate] = useState(null);
  const [duplicateTargetSubject, setDuplicateTargetSubject] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch models
      const modelsSnap = await getDocs(collection(db, "models"));
      const modelsArr = modelsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setModels(modelsArr);
      // Fetch subjects
      const subjectsSnap = await getDocs(collection(db, "subjects"));
      const subjectsArr = subjectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsArr);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const setOpenModal = (model) => {
    openModal(true);
    setDesc(model.description || "");
    setImage(model.image || "");
    setTitle(model.title || "");
    setModel(model.model || "");
    setSingle(model.id || "");
    setIos(model.iosModel || "");
    setSelectedSubject(model.subjectId || "");
  };

  const clearModal = () => {
    setDesc("");
    setImage("");
    setTitle("");
    setModel("");
    setSingle("");
    setIos("");
    setSelectedSubject("");
  };

  const editModel = async () => {
    setLoading(true);
    try {
      if (single) {
        // Update existing model
        await updateDoc(doc(db, "models", single), {
          title,
          description,
          image,
          model,
          iosModel,
          subjectId: selectedSubject,
        });
        toast.success("Model updated successfully");
      } else {
        // Add new model
        await addDoc(collection(db, "models"), {
          title,
          description,
          image,
          model,
          iosModel,
          subjectId: selectedSubject,
          date: serverTimestamp(),
        });
        toast.success("Model created successfully");
      }
      setLoading(false);
      openModal(false);
      clearModal();
      fetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Oops! some error occurred");
    }
  };

  const deleteModel = async (id) => {
    try {
      await deleteDoc(doc(db, "models", id));
      toast.success("Model deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete model");
    }
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subject || model.subjectId === subject;
    return matchesSearch && matchesSubject;
  });

  return (
    <AdminLayout title="Models">
      <Head>
        <title>ARFed Admin - Models</title>
        <meta name="description" content="ARFed Admin - Models Management" />
      </Head>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-3 h-3" />
        </div>
        <div className="flex gap-4">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 shadow-md min-w-[200px]"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject.id}>
                {subject.title}
              </option>
            ))}
          </select>
          {(subject || searchTerm) && (
            <button
              onClick={() => {
                setSubject("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-md"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Models Grid */}
      {filteredModels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-white/60 text-lg mb-4">
            {searchTerm || subject ? "No models found matching your filters." : "No models found."}
          </div>
          {(searchTerm || subject) && (
            <button
              onClick={() => {
                setSubject("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
            >
              <img
                src={model.image}
                alt={model.title}
                className="w-full h-48 object-contain bg-[#181f2a]"
              />
              <div className="flex">
                <div className="w-16 bg-white/5 p-4 flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => setOpenModal(model)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteModel(model.id)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setModelToDuplicate(model);
                      setDuplicateTargetSubject("");
                      setDuplicateModalOpen(true);
                    }}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Duplicate to another subject"
                  >
                    <FaCopy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setModelUrl(model.model);
                      setShow3DConfig(true);
                    }}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="3D Configuration"
                  >
                    <FaCube className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{model.title}</h3>
                  <div className="text-white/60 text-sm mb-4 max-h-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent">
                    {model.description}
                  </div>
                  <div className="flex justify-between items-center text-white/60 text-xs">
                    <span>{model.date?.toDate ? model.date.toDate().toLocaleDateString() : ""}</span>
                    {model.subjectId && (
                      <span className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
                        {subjects.find((s) => s.id === model.subjectId)?.title || "Unknown Subject"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal
        title={single ? "Edit Model" : "Add New Model"}
        centered
        open={open}
        onCancel={() => {
          openModal(false);
          clearModal();
        }}
        footer={null}
        className="!bg-white !rounded-xl"
        styles={{ body: { background: '#fff', borderRadius: '0.75rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' } }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model title"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model description"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 shadow-md"
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.id}>
                  {subject.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter image URL"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Model URL</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model URL"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">iOS Model URL</label>
            <input
              type="text"
              value={iosModel}
              onChange={(e) => setIos(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter iOS model URL"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={editModel}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        title="Duplicate Model to Another Subject"
        centered
        open={duplicateModalOpen}
        onCancel={() => setDuplicateModalOpen(false)}
        footer={null}
        className="!bg-white !rounded-xl"
        styles={{ body: { background: '#fff', borderRadius: '0.75rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' } }}
      >
        {modelToDuplicate ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Select Subject</label>
              <select
                value={duplicateTargetSubject}
                onChange={e => setDuplicateTargetSubject(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 shadow-md"
              >
                <option value="">Choose a subject</option>
                {subjects.filter(s => s.id !== modelToDuplicate.subjectId).map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.title}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!duplicateTargetSubject || !modelToDuplicate) return;
                  try {
                    await addDoc(collection(db, "models"), {
                      title: modelToDuplicate.title,
                      description: modelToDuplicate.description,
                      image: modelToDuplicate.image,
                      model: modelToDuplicate.model,
                      iosModel: modelToDuplicate.iosModel,
                      subjectId: duplicateTargetSubject,
                      date: serverTimestamp(),
                    });
                    toast.success("Model duplicated successfully!");
                    setDuplicateModalOpen(false);
                    setModelToDuplicate(null);
                    setDuplicateTargetSubject("");
                    fetchData();
                  } catch (err) {
                    toast.error("Failed to duplicate model");
                  }
                }}
                disabled={!duplicateTargetSubject}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                Duplicate
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">No model selected for duplication.</div>
        )}
      </Modal>

      {/* 3D Configurator Modal */}
      {show3DConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => setShow3DConfig(false)}
              className="absolute top-4 right-4 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              Close
            </button>
            {/* Simple header with model URL input */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-4">
                <input
                  type="url"
                  placeholder="Enter model URL (.glb or .gltf)"
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px]"
                />
                <button
                  onClick={() => {
                    if (modelUrl) {
                      setIsModelLoading(true);
                      setIsModelLoaded(false);
                    }
                  }}
                  disabled={!modelUrl || isModelLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isModelLoading ? "Loading..." : "Load Model"}
                </button>
              </div>
            </div>
            {/* Model Canvas */}
            <div className="w-full h-full overflow-hidden">
              <ModelCanvas
                canvasRef={null}
                modelUrl={modelUrl}
                modelScale={1.0}
                isLoading={isModelLoading}
                isModelLoaded={isModelLoaded}
                annotations={[]}
                isAddingAnnotation={false}
                handleModelLoaded={() => {
                  setIsModelLoading(false);
                  setIsModelLoaded(true);
                  toast.success("Model loaded successfully");
                }}
                handleModelError={(error) => {
                  setIsModelLoading(false);
                  setIsModelLoaded(false);
                  toast.error("Failed to load model");
                }}
                handleAnimationSetup={() => {}}
                handleCanvasClick={() => {}}
                handleDeleteAnnotation={() => {}}
                modelColor="#ffffff"
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </AdminLayout>
  );
};

export default Models;
