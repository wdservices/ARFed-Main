import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ModelCard = ({ model }) => {
    return (
        <Link href={`/${model._id}`}>
            <div className='bg-white rounded-md lg:w-96 w-full'>
                <div className='mx-auto p-6 w-full subject'>
                    <img src={model.image} className="w-full h-44" alt="" />
                    {/* <model-viewer src={model.model} ar ar-modes="webxr scene-viewer quick-look" camera-controls poster={model.image} shadow-intensity="1" touch-action="pan-y" autoplay auto-rotate> </model-viewer> */}
                </div>
                <div className='bg-[#39F9CD] p-3 rounded-md'>
                    <div className='text-xl font-bold text-center text-[#3E1D6C]'>{model.title}</div>
                    {/* <div className='text-sm text-black'>{model.description}</div> */}
                </div>
            </div>
        </Link>
    );
};

export default ModelCard;