import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Modal } from "antd";

const Ads = () => {
  const token = getCookie("token");
  const [ads, setAds] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const [link, setLink] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [newAdData, setNewAdData] = useState({ image: "", link: "" });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get("https://arfed-api.onrender.com/api/ads", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Failed to fetch ads");
    }
  };

  const addAd = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://arfed-api.onrender.com/api/ads",
        {
          image: img,
          link: link,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        }
      );
      toast.success("Ad added successfully");
      setLoading(false);
      setOpen(false);
      setImg("");
      setLink("");
      fetchAds();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to add ad");
    }
  };

  const deleteAd = async (id) => {
    try {
      await axios.delete(`https://arfed-api.onrender.com/api/ads/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      toast.success("Ad deleted successfully");
      fetchAds();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete ad");
    }
  };

  const handleEditClick = (ad) => {
    setEditingAd(ad);
    setNewAdData({ image: ad.image, link: ad.link });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdData({ ...newAdData, [name]: value });
  };

  const updateAd = async () => {
    setLoading(true);
    try {
      await axios.put(`https://arfed-api.onrender.com/api/ads/${editingAd._id}`, newAdData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      toast.success("Ad updated successfully");
      setLoading(false);
      setEditingAd(null);
      setNewAdData({ image: "", link: "" });
      fetchAds();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to update ad");
    }
  };

  return (
    <AdminLayout title="Ads">
      <Head>
        <title>ARFed Admin - Ads</title>
        <meta name="description" content="ARFed Admin - Ads Management" />
      </Head>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
        >
          <FaPlus className="mr-2" />
          Add New Ad
        </button>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden group"
          >
            <div className="relative">
              <a href={ad.link} target="_blank" rel="noopener noreferrer"> 
                <img
                  src={ad.image}
                  alt={`Ad ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4"> 
                <button
                  onClick={() => handleEditClick(ad)} 
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteAd(ad._id)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-white/60 text-sm">
                Added {new Date(ad.date).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        title="Add New Ad"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div className="space-y-4 bg-white p-6 rounded-lg text-gray-800"> 
          <div>
            <label className="block text-gray-700 mb-2">Image URL</label> 
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 bg-white" 
              placeholder="Enter image URL"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Link (optional)</label> 
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 bg-white" 
              placeholder="Enter link (e.g. https://example.com)"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={addAd}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Adding..." : "Add Ad"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      {editingAd && (
        <Modal
          title="Edit Ad"
          centered
          open={!!editingAd}
          onCancel={() => setEditingAd(null)}
          footer={null}
        >
           <div className="space-y-4 bg-white p-6 rounded-lg text-gray-800"> 
            <div>
              <label className="block text-gray-700 mb-2">Image URL</label> 
              <input
                type="text"
                name="image"
                value={newAdData.image}
                onChange={handleEditInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 bg-white" 
                placeholder="Image URL"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Link</label> 
              <input
                type="text"
                name="link"
                value={newAdData.link}
                onChange={handleEditInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 bg-white" 
                placeholder="Link"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={updateAd} disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl">{loading ? "Updating..." : "Update Ad"}</button>
              <button onClick={() => setEditingAd(null)} className="px-6 py-2 bg-red-600 hover:bg-red-600 text-white rounded-lg transition-all duration-200 ml-2">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer />
    </AdminLayout>
  );
};

export default Ads; 