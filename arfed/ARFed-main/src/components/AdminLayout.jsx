import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaBook, 
  FaCube, 
  FaChartLine, 
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';

const AdminLayout = ({ children, title }) => {
  const router = useRouter();

  const logout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]">
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
            {/* Header with Back Button */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-white hover:text-white/80 mr-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
            </div>

            {/* Page Content */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 