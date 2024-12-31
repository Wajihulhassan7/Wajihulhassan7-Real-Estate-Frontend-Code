
import Image from '../../assets/new_home_images/pexels-binyaminmellish-1396122.jpg'
import React from 'react';

const Banner = () => {
  

  return (
    <section className='h-full max-h-[640px] mb-8 xl:mb-24'>
    <div className='flex flex-col lg:flex-row'>
      {/* Text Section */}
      <div className='lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4 lg:px-0'>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] xl:text-[45px] font-semibold leading-none mb-6 bannerHeading">
        <span style={{ color: '#154D7C', fontFamily:'"Open-sans", sans-serif' }}>Rent</span> Your Dream Land With Us.
      </h1>
      <p className='max-w-[680px] mb-8'>
        Welcome to PropertyConnectHub! Your trusted platform to connect landlords, agents, and care providers seamlessly.
      </p>
    </div>
  
      {/* Image Section */}
      <div className='hidden md:flex flex-1 lg:flex justify-end items-end pr-14'>
        <img 
          src={Image} 
          alt='PropertyConnectHub' 
          className='max-w-[90%] max-h-[500px] object-contain bannerImg' 
        />
      </div>
    </div>
  </section>
  
  );
};

export default Banner;
