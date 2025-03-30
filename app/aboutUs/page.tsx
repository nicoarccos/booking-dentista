"use client";
import Layout from "../components/Layout";

const AboutUs: React.FC = () => {
    return (
        <Layout>
      <div className="flex justify-center items-center bg-gray-100 px-6 py-8 md:py-12">
        <div className="w-full max-w-3xl shadow-lg rounded-2xl p-6 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
          <p className="text-gray-600 text-lg mb-4">
            At Our Company, we believe in delivering excellence and innovation. Our mission is to create 
            outstanding products that make a difference. With a dedicated team and a passion for quality, 
            we strive to exceed expectations every day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">Our Mission</h3>
              <p className="text-gray-500 mt-2">To provide top-tier solutions that enhance everyday life.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">Our Vision</h3>
              <p className="text-gray-500 mt-2">To be a global leader in our industry through innovation and integrity.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">Our Values</h3>
              <p className="text-gray-500 mt-2">Commitment, Quality, and Customer Satisfaction.</p>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    );
    
  };

export default AboutUs;
