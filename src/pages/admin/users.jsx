import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaSearch, FaCopy, FaTrash, FaEnvelope } from "react-icons/fa";

const Users = () => {
  const token = getCookie("token");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://arfed-api.onrender.com/api/user", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://arfed-api.onrender.com/api/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const copyAllEmails = () => {
    const emails = users.map(user => user.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied to clipboard!");
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <Head>
        <title>ARFed Admin - Users</title>
        <meta name="description" content="ARFed Admin - Users Management" />
      </Head>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-3 h-3" />
        </div>
        <button
          onClick={copyAllEmails}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaCopy className="mr-2 w-3 h-3" />
          Copy All Emails
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="flex">
              <div className="w-16 bg-white/5 p-4 flex flex-col items-center justify-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.email);
                    toast.success("Email copied to clipboard!");
                  }}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaEnvelope className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <span className="text-white/60 text-xs">
                  Joined {new Date(user.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ToastContainer />
    </AdminLayout>
  );
};

export default Users;
