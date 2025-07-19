import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useUser } from "../context/UserContext";

const Layout = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [open, openModal] = useState(false);
  
  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      router.push("/login");
    }
    // Commenting out desktop restriction for now to facilitate tablet optimization
    // if (window.innerWidth > 820) {
    //   openModal(true);
    //   document.body.classList.add(`overflow-hidden`);
    // }
  }, [user, loading, router]);
  
  return (
    <div>
      <Head>
        <link rel="icon" href="/arfed.ico" />
      </Head>
      {children}
      {open ? (
        <div className="w-screen z-10 h-screen bg-white fixed top-0 text-center">
          <img
            src="./images/error.gif"
            className="w-[40%] mt-6 mx-auto"
            alt=""
          />
          <div className="text-black text-base w-1/2 mx-auto p-6 ">
            ARFed operates on augmented reality technology, which is optimally
            designed for mobile devices. <br /> To ensure the most optimal
            experience, we kindly request that you log in using your mobile
            phone at <br />
            <span className="font-bold cursor-pointer">
              <Link href={"/"}>arfed.live</Link>.
            </span>
            <br /> Thank you for your cooperation.
          </div>
          <Link href={"/"}>
            <button className="p-3 border border-black w-44 text-black">
              Go Home
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Layout;
