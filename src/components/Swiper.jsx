import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const SwiperComp = () => {
    const [num, setNum] = useState(4)
    useEffect(() => {
        if (window.innerWidth <= 600) {
            setNum(1)
        }
    }, [])
    return (
        <div className='my-10'>
            <Swiper
                autoplay
                spaceBetween={50}
                slidesPerView={num}
                navigation
            >
                <SwiperSlide>
                    <div className='rounded-md bg-white'>
                        <div className='text-base text-black  p-5 text-center'>
                            Physics
                        </div>
                        <div className='text-sm rounded-md bg-[#CBD5E8AD] p-5'>
                            <img className='w-1/2  h-24 mx-auto' src="/images/subjects/atom-29539_1280.svg" alt="" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='rounded-md bg-white'>
                        <div className='text-base text-black  p-5 text-center'>
                            Science
                        </div>
                        <div className='text-sm rounded-md bg-[#CBD5E8AD] p-5'>
                            <img className='w-1/2  h-24 mx-auto' src="/images/subjects/beakers-309864_1280.svg" alt="" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='rounded-md bg-white'>
                        <div className='text-base text-black  p-5 text-center'>
                            Biology
                        </div>
                        <div className='text-sm rounded-md bg-[#CBD5E8AD] p-5'>
                            <img className='w-1/2 h-24 mx-auto' src="/images/subjects/brain-2750415_1280.svg" alt="" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='rounded-md bg-white'>
                        <div className='text-base text-black  p-5 text-center'>
                            Planetary
                        </div>
                        <div className='text-sm rounded-md bg-[#CBD5E8AD] p-5'>
                            <img className='w-1/2 mx-auto h-24' src="/images/subjects/system-152937_1280.svg" alt="" />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default SwiperComp;