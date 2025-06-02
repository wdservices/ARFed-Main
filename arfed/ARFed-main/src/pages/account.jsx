import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Nav from "../components/MobileNav";
import { AvatarGenerator } from "random-avatar-generator";
import { getCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import Payment from "../components/Payment";
import Head from "next/head";

const account = () => {
  const generator = new AvatarGenerator();
  const id = getCookie("id");
  const [image, setImage] = useState("");
  const [user, setUser] = useState([]);
  const token = getCookie("token");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, openModal] = useState(false);

  useEffect(() => {
    try {
      axios
        .get(`https://arfed-api.onrender.com/api/user/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data[0]);
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
    setImage(generator.generateRandomAvatar(user.name));
  }, []);

  const logout = () => {
    deleteCookie("token");
    deleteCookie("id");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>ARFed || Account</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta
          name="description"
          content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D."
        />
      </Head>
      <Layout>
        <Nav />
        {loading ? (
          <div className="flex justify-center">
            <div className="lds-circle">
              <div></div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <img src={image} alt="" className="w-40 h-40 mx-auto" />
            </div>
            <div className="p-4">
              <div className="p-3 w-[90%] mx-auto border my-4 rounded-md capitalize">
                {user?.name}
              </div>
              <div className="p-3 w-[90%] mx-auto border my-4 rounded-md">
                {user?.email}
              </div>
              <div className="p-3 w-[90%] mx-auto border cursor-pointer my-4 rounded-md capitalize flex justify-between">
                <div> Plan: {user?.plan}</div>
                <div onClick={() => openModal(!open)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-caret-left-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                  </svg>
                </div>
              </div>
              <div
                onClick={() => logout()}
                className="p-3 w-[90%] mx-auto border my-4 rounded-md capitalize flex justify-between"
              >
                <div>Logout</div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-box-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
      <ToastContainer />
      <Payment closeModal={() => openModal(!open)} open={open} />
    </div>
  );
};

export default account;
