import React from 'react';
import {
  AiOutlineFileAdd,
  AiOutlineSetting,
  AiOutlineCloud,
  AiOutlineSafety,
  AiOutlineGlobal,
  AiOutlineCheckCircle,
} from 'react-icons/ai';

export const HowtoUse = () => {
  const features = [
    {
      icon: <AiOutlineFileAdd size={40} className="text-purple-500" />,
      title: "Upload Your PDFs",
      description:
        "Drop in your PDFs or select them to start compressing. In just a few seconds, your files will be lighter and ready to download.",
    },
    {
      icon: <AiOutlineSetting size={40} className="text-purple-500" />,
      title: "Adjust the Quality",
      description:
        "Tweak the compression level to get the perfect balance between quality and size.",
    },
    {
      icon: <AiOutlineCheckCircle size={40} className="text-purple-500" />,
      title: "Super Easy to Use",
      description:
        "No software? No problem. Just select, compress, and you're done.",
    },
    {
      icon: <AiOutlineGlobal size={40} className="text-purple-500" />,
      title: "Works Everywhere",
      description:
        "It’s browser-based, so it runs on any system—Windows, macOS, Linux, or your phone.",
    },
    {
      icon: <AiOutlineCloud size={40} className="text-purple-500" />,
      title: "No Installation Needed",
      description:
        "Compress files in the cloud without draining your device’s resources.",
    },
    {
      icon: <AiOutlineSafety size={40} className="text-purple-500" />,
      title: "Secure & Private",
      description:
        "Your files are automatically deleted from the server after processing, so your data stays safe.",
    },
  ];

  return (

    <div className="bg-gray-50 py-10 px-6 sm:px-12 lg:px-24">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        How to Use Our PDF Compressor
      </h2>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:-translate-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </div>
        ))}
      </div>
       
    </div>


  );
};

export default HowtoUse;
