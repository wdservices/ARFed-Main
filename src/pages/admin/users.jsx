import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/AdminLayout";
import { motion } from "framer-motion";
import { FaSearch, FaCopy, FaTrash, FaEnvelope } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../lib/firebaseClient";

const db = getFirestore(app);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setError(null);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (userData) => {
    try {
      await addDoc(collection(db, "users"), userData);
      toast.success("User created successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await updateDoc(doc(db, "users", id), userData);
      toast.success("User updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const copyAllEmails = () => {
    const emails = users.map(user => user.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied to clipboard!");
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Delete ${selectedUsers.length} selected user(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedUsers.map((id) =>
        deleteDoc(doc(db, "users", id))
      ));
      toast.success("Selected users deleted successfully");
      setSelectedUsers([]);
      setSelectAll(false);
      fetchUsers();
    } catch (error) {
      console.error('Bulk delete error:', error);
      const message = error?.message || 'Failed to delete selected users';
      toast.error(`Failed to delete selected users: ${message}`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <Head>
        <title>ARFed Admin - Users</title>
        <meta name="description" content="ARFed Admin - Users Management" />
      </Head>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="checkbox"
            checked={selectAll && filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
            onChange={handleSelectAll}
            className="accent-indigo-600 w-5 h-5"
            title="Select All"
          />
          <span className="text-white/80 text-sm">Select All</span>
          <div className="relative w-96 ml-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-3 h-3" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyAllEmails}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaCopy className="mr-2 w-3 h-3" />
            Copy All Emails
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedUsers.length === 0}
            className={`flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaTrash className="mr-2 w-3 h-3" />
            Delete Selected
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="ml-4 text-white/80">Loading users...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center my-8">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-white/60 text-center my-8">No users found.</div>
      ) : (
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
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="accent-indigo-600 w-5 h-5 mb-2"
                    title="Select user"
                  />
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
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-white/60 text-xs">
                    Joined {user.date?.toDate ? user.date.toDate().toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ToastContainer />
    </AdminLayout>
  );
};

export default Users;
