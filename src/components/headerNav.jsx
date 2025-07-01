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
                {/* <Link href={`/subjects`}>
                    <div>Subjects</div>
                </Link> */}
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