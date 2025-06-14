import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { getCookie } from "cookies-next";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddModel = ({ open, setOpen }) => {
  const token = getCookie("token");
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [ios, setIos] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [audio, setAudio] = useState("");

  useEffect(() => {
    console.log("Current token:", token);
    const fetchSubjects = async () => {
      if (!token) {
        console.warn("No token found, skipping subject fetch.");
        toast.warn("Authentication token not found. Please log in again.");
        return;
      }
      try {
        const response = await axios.get("https://arfed-api.onrender.com/api/subject", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        });
        setSubjects(response.data);
        console.log("Subjects fetched successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        toast.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, [token]);

  const addSubject = () => {
    if (title && description && image && model !== "") {
      try {
        setLoading(true);
        axios
          .post(
            "https://arfed-api.onrender.com/api/models",
            {
              title,
              description,
              audio,
              image,
              model,
              subjectId: subject,
              iosModel: ios,
              audio
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "auth-token": token,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            setLoading(false);
            setOpen();
            setDesc("");
            setImage("");
            setTitle("");
            setModel("");
            toast.success("Model Created Successfully");
          });
      } catch (err) {
        console.log(err);
        toast.error("Oops! some error occurred");
      }
    } else {
      toast.warn("All input fields are required");
    }
  };

  return (
    <div>
      <Modal
        title="Add Model"
        centered
        style={{ top: 20 }}
        open={open}
        footer={null}
        onCancel={setOpen}
        width={500}
      >
        <div className="my-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="p-3 w-full bg-white border"
            placeholder="Enter Model Title"
          />
        </div>
        <div className="my-2">
          <select
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 w-full bg-white border"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>
        <div className="my-2">
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            name=""
            className="p-3 h-20 w-full  bg-white border"
            placeholder="Enter Model Description"
          ></textarea>
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setImage(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model Image URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setModel(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setIos(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter IOS Model URL"
          />
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setAudio(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Model Audio URL"
          />
        </div>
        <div>
          <Button loading={loading} onClick={() => addSubject()}>
            Submit
          </Button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};
export default AddModel;
