import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { FaVrCardboard } from "react-icons/fa";

const VRPage = () => {
  const [vrLink, setVrLink] = useState("");
  const [imageCover, setImageCover] = useState("");
  const [audio, setAudio] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("https://arfed-api.onrender.com/api/subject", {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "auth-token": token,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        toast.error("Failed to fetch subjects. Please try again.");
      }
    };
    if (token) {
      fetchSubjects();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vrLink || !imageCover || !subjectId) {
      toast.error("VR Link, Image Cover, and Subject are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://arfed-api.onrender.com/api/vr-content", // Assuming this is the endpoint
        {
          vrLink,
          imageCover,
          audio,
          subjectId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "auth-token": token,
          },
        }
      );
      toast.success("360 VR Content added successfully!");
      // Clear form
      setVrLink("");
      setImageCover("");
      setAudio("");
      setSubjectId("");
    } catch (error) {
      console.error("Failed to add VR content:", error);
      toast.error("Failed to add VR content. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add 360 VR Content">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FaVrCardboard className="mr-3" />
          Upload 360 VR Content
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-indigo-200 mb-2">360 VR Link</label>
            <input
              type="text"
              value={vrLink}
              onChange={(e) => setVrLink(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter the 360 VR content URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Image Cover URL</label>
            <input
              type="text"
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter the image cover URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Audio URL (Optional)</label>
            <input
              type="text"
              value={audio}
              onChange={(e) => setAudio(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter the audio URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">Select Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white focus:outline-none focus:border-indigo-500 shadow-md"
            >
              <option value="">-- Choose a Subject --</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Uploading..." : "Add VR Content"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default VRPage; 