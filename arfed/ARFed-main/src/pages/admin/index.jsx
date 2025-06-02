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
  FaFilter
} from "react-icons/fa";
import { toast } from "react-toastify";

const Admin = () => {
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
    fetchData();
  }, []);

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
      const monthlyUsers = usersRes.data.filter(user => {
        const userMonth = new Date(user.date).getMonth();
        return userMonth === currentMonth;
      }).length;
      setMonthlyUsers(monthlyUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const logout = () => {
    deleteCookie("token");
    router.push("/login");
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

  const filteredModels = models.filter(model =>
    model.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Link href="/admin">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaChartLine className="mr-3" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/admin/users">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaUsers className="mr-3" />
                <span>Users</span>
              </div>
            </Link>
            <Link href="/admin/subjects">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaBook className="mr-3" />
                <span>Subjects</span>
              </div>
            </Link>
            <Link href="/admin/models">
              <div className="flex items-center px-6 py-3 text-white hover:bg-white/10 cursor-pointer">
                <FaCube className="mr-3" />
                <span>Models</span>
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
                  <p className="text-white/60 text-sm">Models This Month</p>
                  <p className="text-white font-semibold">
                    {models.filter(m => new Date(m.date).getMonth() === new Date().getMonth()).length}
                  </p>
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
                    <p className="text-white/60">User Growth</p>
                    <h2 className="text-3xl font-bold text-white mt-2">
                      {((monthlyUsers / users.length) * 100).toFixed(1)}%
                    </h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FaUserPlus className="text-white text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Monthly Growth Rate</p>
                  <p className="text-white font-semibold">
                    {((monthlyUsers / users.length) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search users or models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
              <button
                onClick={copyAllEmails}
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
              >
                <FaCopy className="mr-2" />
                Copy All Emails
              </button>
            </div>

            {/* Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
              >
                <div className="p-4 border-b border-white/20">
                  <h3 className="text-lg font-semibold text-white">Recent Users</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {filteredUsers.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-white/60 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-white/60 text-sm">
                          {new Date(user.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  {users.length > 5 && (
                    <Link href="/admin/users">
                      <div className="text-white/60 text-sm mt-4 hover:text-white cursor-pointer">
                        View all users →
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Recent Models */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
              >
                <div className="p-4 border-b border-white/20">
                  <h3 className="text-lg font-semibold text-white">Recent Models</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {filteredModels.slice(0, 5).map((model, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={model.image}
                            alt={model.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <p className="text-white font-medium">{model.title}</p>
                            <p className="text-white/60 text-sm">
                              {new Date(model.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {models.length > 5 && (
                    <Link href="/admin/models">
                      <div className="text-white/60 text-sm mt-4 hover:text-white cursor-pointer">
                        View all models →
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <SubjectModal
        open={subject}
        setOpen={() => openSubject(!subject)}
        subject={null}
      />
      <AddModel open={model} setOpen={() => openModel(!model)} />
    </div>
  );
};

export default Admin;
