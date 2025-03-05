'use client';

import Image from 'next/image';

const MyImage: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Image 
        src="https://res.cloudinary.com/desem7vhd/image/upload/v1700675122/uj5dppakpuj1rlw72t3l.jpg" 
        alt="My Image"
        width={500}  
        height={300}  
        className="rounded-lg shadow-md w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"  
        priority
      />
    </div>
  );
};

export default MyImage;
