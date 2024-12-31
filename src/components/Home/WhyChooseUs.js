// src/components/WhyChooseUs.js

import React from 'react';
import House1 from '../../assets/new_home_images/vu-anh-TiVPTYCG_3E-unsplash.jpg';
import House2 from '../../assets/new_home_images/pexels-pixabay-209296.jpg';
import House4 from '../../assets/new_home_images/ronnie-george-z11gbBo13ro-unsplash.jpg';
import House3 from '../../assets/new_home_images/webaliser-_TPTXZd9mOo-unsplash.jpg';
import '../components/../CareProviderDashBoard/style.css'
const WhyChooseUs = () => {
  return (
    <section className='bg-opacity-14  py-12 text-white' style={{ background: 'rgba(198, 76, 123, 0.10)' }}
>
      <div className='container mx-auto text-center mb-8'>
        <h2 className='text-4xl font-semibold text-[#154D7C] mb-6 pb-10' style={{fontFamily:'"Open-sans",sans-serif'}}>WHY CHOOSE US</h2>
      </div>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
        <div className='flex flex-col items-center'>
          <img src={House1} alt='For Care Providers' className='whyChooseImg' />
          <h3 className='text-2xl font-semibold text-[#154D7C] mb-4' style={{fontFamily:'"Open-sans",sans-serif'}}>For Care Providers</h3>
          <p className='text-[#000000]'>Access compliant housing options from trusted landlords.</p>
        </div>
        <div className='flex flex-col items-center'>
          <img src={House2} alt='For Care Providers' className='whyChooseImg' />
          <h3 className='text-2xl font-semibold text-[#154D7C] mb-4' style={{fontFamily:'"Open-sans",sans-serif'}}> For Agents of CP</h3>
          <p className='text-[#000000]'>Access compliant housing options from trusted landlords.</p>
        </div>
        <div className='flex flex-col items-center'>
          <img src={House3} alt='For Landlords' className='whyChooseImg' />
          <h3 className='text-2xl font-semibold text-[#154D7C] mb-4' style={{fontFamily:'"Open-sans",sans-serif'}}>For Landlords</h3>
          <p className='text-[#000000]'>Connect with stable, long-term tenants and access our support services.</p>
        </div>
        <div className='flex flex-col items-center'>
          <img src={House4} alt='For Agents' className='whyChooseImg' />
          <h3 className='text-2xl font-semibold text-[#154D7C] mb-4' style={{fontFamily:'"Open-sans",sans-serif'}}>For Agents</h3>
          <p className='text-[#000000]'>Expand your reach with properties that meet care provider needs.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
