import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import SubjectModal from "../../components/SubjectModal";
import AddModel from "../../components/AddModel";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaBook, 
  FaCube, 
  FaChartLine, 
  FaCopy, 
  FaSignOutAlt,
  FaUserPlus,
  FaPlus,
  FaSearch,
  FaFilter,
  FaAd,
  FaVrCardboard
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

const Admin = () => {
  const { user, loading, logoutUser } = useUser();
  const token = getCookie("token");
  const [users, setUsers] = useState([]);
  const [models, setModels] = useState([]);
  const [subject, openSubject] = useState(false);
  const [model, openModel] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!user) {
          router.replace('/login');
          return;
        }
        
        if (user.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          router.replace('/subjects');
          return;
        }

        // Only fetch data if user is admin
        await fetchData();
      }
    };

    checkAdminAccess();
  }, [loading, user]);

  const fetchData = async () => {
    try {
      const [usersRes, subjectsRes, modelsRes] = await Promise.all([
        axios.get("https://arfed-api.onrender.com/api/user", {
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
        }),
        axios.get("https://arfed-api.onrender.com/api/models", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        })
      ]);

      setUsers(usersRes.data);
      setSubjects(subjectsRes.data);
      setModels(modelsRes.data);

      // Calculate monthly users
      const currentMonth = new Date().getMonth();
      const monthlyUsers = usersRes.data.filter(u => {
        const userMonth = new Date(u.date).getMonth();
        return userMonth === currentMonth;
      }).length;
      setMonthlyUsers(monthlyUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const logout = () => {
    logoutUser();
    router.replace("/login");
  };

  const copyAllEmails = () => {
    const emails = users.map(user => user.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied to clipboard!");
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModels = models.filter(model =>
    model.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-white text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]">
      <Head>
        <title>ARFed Admin Dashboard</title>
        <meta name="description" content="ARFed Admin Dashboard" />
      </Head>

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/20"
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">ARFed</h1>
            <p className="text-white/60 text-sm">Admin Dashboard</p>
          </div>

          <nav className="mt-8">
            <Link href="/admin" className="block">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaChartLine className="mr-3" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/admin/users" className="block">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaUsers className="mr-3" />
                <span>Users</span>
              </div>
            </Link>
            <Link href="/admin/subjects" className="block">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaBook className="mr-3" />
                <span>Subjects</span>
              </div>
            </Link>
            <Link href="/admin/models" className="block">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaCube className="mr-3" />
                <span>Models</span>
              </div>
            </Link>
            <Link href="/admin/ads" className="block">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaAd className="mr-3" />
                <span>Ads</span>
              </div>
            </Link>
            <div 
              onClick={logout}
              className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </div>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-white/60">Welcome back, Admin</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => openSubject(true)}
                  className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  <FaPlus className="mr-2" />
                  Add Subject
                </button>
                <button
                  onClick={() => openModel(true)}
                  className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  <FaPlus className="mr-2" />
                  Add Model
                </button>
                <button
                  onClick={() => router.push('/admin/vr')}
                  className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  <FaVrCardboard className="mr-2" />
                  Add 360 VR
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60">Total Users</p>
                    <h2 className="text-3xl font-bold text-white mt-2">{users.length}</h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FaUsers className="text-white text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Monthly Active Users</p>
                  <p className="text-white font-semibold">{monthlyUsers}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60">Total Subjects</p>
                    <h2 className="text-3xl font-bold text-white mt-2">{subjects.length}</h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FaBook className="text-white text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Active Subjects</p>
                  <p className="text-white font-semibold">{subjects.length}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60">Total Models</p>
                    <h2 className="text-3xl font-bold text-white mt-2">{models.length}</h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FaCube className="text-white text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Active Models</p>
                  <p className="text-white font-semibold">{models.length}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60">Total Active Ads</p>
                    <h2 className="text-3xl font-bold text-white mt-2">{models.length}</h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FaAd className="text-white text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Ad Clicks (Last 30 Days)</p>
                  <p className="text-white font-semibold">N/A</p>
                </div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search users or models..."
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40 placeholder-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
            </div>

            {/* User and Model Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users List */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaUsers className="mr-2" /> Recent Users
                  <button onClick={copyAllEmails} className="ml-auto text-sm text-white/60 hover:text-white flex items-center">
                    <FaCopy className="mr-1" /> Copy Emails
                  </button>
                </h3>
                <div className="space-y-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.slice(0, 5).map(u => (
                      <div key={u._id} className="flex items-center bg-white/5 rounded-lg p-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-semibold">{u.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{u.name}</p>
                          <p className="text-white/60 text-sm">{u.email}</p>
                        </div>
                        <Link href={`/admin/users?id=${u._id}`} className="ml-auto text-blue-300 hover:underline text-sm">
                          View Details
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No users found.</p>
                  )}
                </div>
              </div>

              {/* Models List */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaCube className="mr-2" /> Recent Models
                </h3>
                <div className="space-y-4">
                  {filteredModels.length > 0 ? (
                    filteredModels.slice(0, 5).map(model => (
                      <div key={model._id} className="flex items-center bg-white/5 rounded-lg p-3">
                        <img src={model.image} alt={model.title} className="w-10 h-10 object-cover rounded-md mr-3" />
                        <div>
                          <p className="text-white font-semibold">{model.title}</p>
                          <p className="text-white/60 text-sm">{model.subject}</p>
                        </div>
                        <Link href={`/admin/models?id=${model._id}`} className="ml-auto text-blue-300 hover:underline text-sm">
                          View Details
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No models found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubjectModal open={subject} closeModal={() => openSubject(false)} refetch={fetchData} />
      <AddModel open={model} closeModal={() => openModel(false)} refetch={fetchData} />
    </div>
  );
};

export default Admin;
