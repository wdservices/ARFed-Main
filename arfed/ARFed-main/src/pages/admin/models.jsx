import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import axios from "axios";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Models = () => {
  const [models, setModels] = useState([]);
  const [newModels, setNewModels] = useState([]);
  const token = getCookie("token");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [open, openModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [single, setSingle] = useState("");
  const [iosModel, setIos] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modelsRes, subjectsRes] = await Promise.all([
        axios.get("https://arfed-api.onrender.com/api/models", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        }),
        axios.get("https://arfed-api.onrender.com/api/subject", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        })
      ]);

      setModels(modelsRes.data);
      setNewModels(modelsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const setOpenModal = (model) => {
    openModal(true);
    setDesc(model.description);
    setImage(model.image);
    setTitle(model.title);
    setModel(model.model);
    setSingle(model._id);
    setIos(model?.iosModel);
  };

  const editModel = async () => {
    setLoading(true);
    try {
      await axios.put(
        `https://arfed-api.onrender.com/api/models/${single}`,
        {
          title,
          description,
          image,
          model,
          iosModel
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        }
      );
      toast.success("Model Updated successfully");
      setLoading(false);
      openModal(false);
      fetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Oops! some error occurred");
    }
  };

  const deleteModel = async (id) => {
    try {
      await axios.delete(`https://arfed-api.onrender.com/api/models/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      toast.success("Model deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete model");
    }
  };

  const filteredModels = models.filter(model =>
    model.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="w-full px-4 py-2 pl-10 bg-[#232946] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-3 h-3" />
        </div>
        <div className="flex gap-4">
          <select
            onChange={(e) => setSubject(e.target.value)}
            className="px-4 py-2 bg-[#232946] border border-indigo-400 rounded-lg text-white focus:outline-none focus:border-indigo-500 shadow-md"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setOpenModal({})}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaPlus className="mr-2 w-3 h-3" />
            Add Model
          </button>
        </div>
      </div>

      {/* Models Grid */}
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
                  onClick={() => deleteModel(model._id)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{model.title}</h3>
                <div className="text-white/60 text-sm mb-4 max-h-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent">
                  {model.description}
                </div>
                <span className="text-white/60 text-xs">
                  {new Date(model.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        title={single ? "Edit Model" : "Add New Model"}
        centered
        open={open}
        onCancel={() => openModal(false)}
        footer={null}
        className="!bg-[#181f2a] !rounded-xl"
        bodyStyle={{ background: '#232946', borderRadius: '0.75rem', boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-indigo-200 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model title"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model description"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter image URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Model URL</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter model URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">iOS Model URL</label>
            <input
              type="text"
              value={iosModel}
              onChange={(e) => setIos(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
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

      <ToastContainer />
    </AdminLayout>
  );
};

export default Models;
