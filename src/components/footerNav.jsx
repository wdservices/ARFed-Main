import React from "react";
import Link from "next/link.js";
import Image from "next/image";

const FooterNav = () => {
  return (
    <div className="lg:flex justify-between p-4 lg:px-20 py-6 border-t border-[#D2D2D2]">
      <Link href={"/"} className="flex items-center space-x-2">
        <Image src="/arfed.png" alt="ARFed Logo" width={40} height={40} className="rounded-lg" />
        <span className="text-xl font-bold text-gray-800">ARFed</span>
      </Link>
      <div className="lg:flex w-1/2 my-auto justify-evenly text-sm">
        <a href="#about">
          <div className="lg:my-0 my-4">About Us</div>
        </a>
        <a href="#features">
          <div className="lg:my-0 my-4">Features</div>
        </a>
        <a href="#pricing">
          <div className="lg:my-0 my-4">Pricing</div>
        </a>
        <a href="mailto:hello.arfed@gmail.com">
          <div className="lg:my-0 my-4">Contact Us</div>
        </a>
        <Link href="/privacy">
          <div className="lg:my-0 my-4">Policies</div>
        </Link>
        <Link href="/credits">
          <div className="lg:my-0 my-4">Credits</div>
        </Link>
      </div>
      <div className="flex justify-between my-auto lg:w-40">
        <a href="https://www.facebook.com/ARFedu">
          <img className="w-6 h-6 mx-2" src="/images/Icons/Facebook.png" alt="" />
        </a>
        <a href="https://www.linkedin.com/company/arfed/">
          <img className="w-6 h-6 mx-2" src="/images/Icons/Linkedin.png" alt="" />
        </a>
        <a href="https://twitter.com/_arfed?t=5rCb3hgsiscquV-MLRJ6Ng&s=09">
          <img className="w-6 h-6 mx-2" src="/images/Icons/Twitter.png" alt="" />
        </a>
      </div>
    </div>
  );
};

export default FooterNav;
