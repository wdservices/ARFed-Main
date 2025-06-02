import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal } from "antd";

const Subjects = () => {
  const token = getCookie("token");
  const [subjects, setSubjects] = useState([]);
  const [newSubjects, setNewSubjects] = useState([]);
  const [subject, openSubject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [single, setSingle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://arfed-api.onrender.com/api/subject", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      setSubjects(response.data);
      setNewSubjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const openModal = (subject) => {
    setTitle(subject.title);
    setDesc(subject.description);
    setImage(subject.image);
    setSingle(subject._id);
    openSubject(true);
  };

  const editSubject = async () => {
    setLoading(true);
    try {
      await axios.put(
        `https://arfed-api.onrender.com/api/subject/${single}`,
        {
          title,
          description,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        }
      );
      toast.success("Subject updated successfully");
      setLoading(false);
      openSubject(false);
      fetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to update subject");
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`https://arfed-api.onrender.com/api/subject/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      toast.success("Subject deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subject");
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Subjects">
      <Head>
        <title>ARFed Admin - Subjects</title>
        <meta name="description" content="ARFed Admin - Subjects Management" />
      </Head>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[#232946] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-3 h-3" />
        </div>
        <button
          onClick={() => openModal({})}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="mr-2 w-3 h-3" />
          Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/30 bg-clip-padding backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <img
              src={subject.image}
              alt={subject.title}
              className="w-full h-48 object-contain bg-[#181f2a]"
            />
            <div className="flex">
              <div className="w-16 bg-white/5 p-4 flex flex-col items-center justify-center gap-4">
                <button
                  onClick={() => openModal(subject)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteSubject(subject._id)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{subject.title}</h3>
                <div className="text-white/60 text-sm mb-4 max-h-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent">
                  {subject.description}
                </div>
                <span className="text-white/60 text-xs">
                  {new Date(subject.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        title={single ? "Edit Subject" : "Add New Subject"}
        centered
        open={subject}
        onCancel={() => openSubject(false)}
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
              placeholder="Enter subject title"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter subject description"
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
          <div className="flex justify-end">
            <button
              onClick={editSubject}
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

export default Subjects;
