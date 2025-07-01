import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
import { FaVrCardboard } from "react-icons/fa";
import { useRouter } from "next/router";

const VRPage = () => {
  const [vrLink, setVrLink] = useState("");
  const [imageCover, setImageCover] = useState("");
  const [audio, setAudio] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");
  const token = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      setSubjectsError("");
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
        setSubjectsError("Failed to fetch subjects. Please try again.");
        setSubjects([]);
        toast.error("Failed to fetch subjects. Please try again.");
      } finally {
        setSubjectsLoading(false);
      }
    };
    if (token) {
      fetchSubjects();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vrLink && !videoUrl) {
      toast.error("At least one of 360 VR Link or 360 Video URL is required.");
      return;
    }
    if (!imageCover || !subjectId) {
      toast.error("Image Cover and Subject are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://arfed-api.onrender.com/api/vr-content",
        {
          vrLink,
          imageCover,
          audio,
          videoUrl,
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
      setVrLink("");
      setImageCover("");
      setAudio("");
      setVideoUrl("");
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
      <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        {/* Close Button */}
        <button
          onClick={() => router.push('/admin')}
          className="absolute top-4 right-4 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
        >
          Close
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FaVrCardboard className="mr-3" />
          Upload 360 VR Content
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-indigo-200 mb-2">360 VR Image URL</label>
            <input
              type="text"
              value={vrLink}
              onChange={(e) => setVrLink(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter the 360 VR image URL"
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-2">360 Video URL (mp4, optional)</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[#181f2a] border border-indigo-400 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:border-indigo-500 shadow-md"
              placeholder="Enter the 360 video URL (mp4)"
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
            {subjectsLoading ? (
              <div className="text-indigo-200">Loading subjects...</div>
            ) : subjectsError ? (
              <div className="text-red-400">{subjectsError}</div>
            ) : subjects.length === 0 ? (
              <div className="text-yellow-400">No subjects found. Please add a subject first.</div>
            ) : (
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
            )}
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