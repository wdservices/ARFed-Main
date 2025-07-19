import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { getCookie } from "cookies-next";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../lib/firebaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubjectModal = ({ open, closeModal }) => {
  const token = getCookie("token");
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);

  const addSubject = async () => {
    if (title && description && image !== "") {
      try {
        setLoading(true);
        await addDoc(collection(db, "subjects"), {
          title,
          description,
          image,
        });
        setLoading(false);
        closeModal();
        setDesc("");
        setImage("");
        setTitle("");
        toast.success("Subject Created Successfully");
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
        title={"Add Subject"}
        centered
        style={{ top: 20 }}
        open={open}
        footer={null}
        onCancel={closeModal}
        width={500}
      >
        <div className="my-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="p-3 w-full bg-white border"
            placeholder="Enter Title"
            value={title}
          />
        </div>
        <div className="my-2">
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            name=""
            className="p-3 h-20 w-full  bg-white border"
            placeholder="Enter Subject Description"
            value={description}
          ></textarea>
        </div>
        <div className="my-2">
          <input
            onChange={(e) => setImage(e.target.value)}
            type="text"
            className="p-3  w-full  bg-white border"
            placeholder="Enter Subject Image URL"
            value={image}
          />
        </div>
        <div>
          <Button
            loading={loading}
            onClick={() => {
              addSubject();
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};
export default SubjectModal;
