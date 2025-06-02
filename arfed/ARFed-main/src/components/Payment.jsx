import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { Modal } from "antd";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";

const Payment = ({ open, closeModal }) => {
  const [user, setUser] = useState([]);
  const id = getCookie("id");
  const token = getCookie("token");

  useEffect(() => {
    try {
      axios
        .get(`https://arfed-api.vercel.app/api/user/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setUser(response.data[0]);
          // setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  function generateReferenceKey(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }
  const config1 = {
    public_key: "FLWPUBK-f1ca421754831757166c4e74547967c0-X",
    tx_ref: generateReferenceKey(25),
    amount: 1.99,
    payment_plan: 95523,
    currency: "USD",
    payment_options: "card",
    customer: {
      email: user?.email,
      name: user?.name,
    },
    customizations: {
      title: "ARFed",
      description: "ArFed Monthly Subscription Payment.",
      logo: "./images/logo.svg",
    },
  };
  const config2 = {
    public_key: "FLWPUBK-f1ca421754831757166c4e74547967c0-X",
    tx_ref: generateReferenceKey(25),
    amount: 6.99,
    payment_plan: 95524,
    currency: "USD",
    payment_options: "card",
    customer: {
      email: user?.email,
      name: user?.name,
    },
    customizations: {
      title: "ARFed",
      description: "ArFed Monthly Subscription Payment.",
      logo: "./images/logo.svg",
    },
  };
  const handleFlutterPayment1 = useFlutterwave(config1);
  const handleFlutterPayment2 = useFlutterwave(config2);

  return (
    <div>
      <Modal
        title="Subscription"
        centered
        style={{ top: 20 }}
        open={open}
        footer={null}
        onCancel={closeModal}
        width={500}
      >
        <div
          onClick={() =>
            handleFlutterPayment1({
              callback: (response) => {
                console.log(response);
                try {
                  axios
                    .put(
                      `https://arfed-api.vercel.app/api/user/suscribe/${id}`,
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
                      toast.success("Payment Successful");
                      closePaymentModal();
                    });
                } catch (e) {
                  console.log(e);
                  toast.error("Payment Failed");
                }
              },
            })
          }
          className="lg:w-[30%] border cursor-pointer border-[#5925DC] p-6 text-center rounded-md my-4"
        >
          <div className="text-2xl text-[#39F9CD]">Single User</div>
          <div className="text-sm w-[80%] my-4 mx-auto">
            Individuals are eligible to enroll in this plan
          </div>
          <div className="flex w-28 mx-auto justify-between">
            <div className="text-3xl text-[#39F9CD]">$1.99</div>
            <div className="my-auto text-[#39F9CD]">/monthly</div>
          </div>
          <div className="text-left text-sm my-1">
            <span className="text-xl text-[#39F9CD]">+</span> An unlimited
            amount of ARFed access is available.
            <br />
            <span className="text-xl text-[#39F9CD]">+</span> You can upload
            your own 3D model
          </div>
        </div>
        <div
          onClick={() =>
            handleFlutterPayment2({
              callback: (response) => {
                console.log(response);
                try {
                  axios
                    .put(
                      `https://arfed-api.vercel.app/api/user/suscribe/${id}`,
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
                      toast.success("Payment Successful");
                      closePaymentModal();
                    });
                } catch (e) {
                  console.log(e);
                  toast.error("Payment Failed");
                }
              },
            })
          }
          className="lg:w-[30%] border cursor-pointer border-[#39F9CD] p-6 text-center rounded-md my-4"
        >
          <div className="text-2xl text-[#39F9CD]">Group Users</div>
          <div className="text-sm w-[80%] my-4 mx-auto">
            Nowadays, it isn’t uncommon to see lenders rapidly adopting a
            digital
          </div>
          <div className="flex w-40 mx-auto justify-between">
            <div className="text-3xl text-[#39F9CD]">$6.99</div>
            <div className="my-auto text-[#39F9CD]">/monthly</div>
          </div>
          <div className="text-left text-sm my-1">
            <span className="text-xl text-[#39F9CD]">+</span> An unlimited
            amount of ARFed access is available.
            <br />
            <span className="text-xl text-[#39F9CD]">+</span> You can upload
            your own 3D model
            <br />
            <span className="text-xl text-[#39F9CD]">+</span> Unlimited users
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
