import React from 'react';
import Link from 'next/link.js';

const HeaderNav = () => {
    return (
        <div className='flex justify-between lg:px-20 p-6'>
            <Link href={'/'}>
                <img src="/images/logo.svg" className='w-20 ' alt="" />
            </Link>
            <div className='lg:flex hidden w-1/2 my-auto justify-evenly text-sm'>
                <a href="#about">
                    <div>About Us</div>
                </a>
                <a href="#features">
                    <div>Features</div>
                </a>
                <div className="relative group">
                  <button className="focus:outline-none">Subjects</button>
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-10">
                    <Link href="/subject/biology"><div className="px-4 py-2 hover:bg-gray-100">Biology</div></Link>
                    <Link href="/subject/chemistry"><div className="px-4 py-2 hover:bg-gray-100">Chemistry</div></Link>
                    <Link href="/subject/physics"><div className="px-4 py-2 hover:bg-gray-100">Physics</div></Link>
                  </div>
                </div>
                <Link href="/how-to-use" className="text-white hover:text-white/80 px-3 py-2 rounded-md text-sm font-medium">
                  How to Use
                </Link>
                <a href="#pricing">
                    <div>Pricing</div>
                </a>
                <div>Contact Us</div>
                <a href="malito:hello.arfed@gmail.com">
                    <div>Book a Demo</div>
                </a>
            </div>
            <Link href='/signup'>
                <button className='p-2 rounded-full w-32 text-sm text-white bg-[#5925DC]'>Sign Up</button>
            </Link>
        </div>
    );
};

export default HeaderNav;