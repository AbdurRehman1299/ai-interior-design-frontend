import React from 'react';
import { UploadCloudIcon, SparklesIcon, LightbulbIcon } from 'lucide-react';

function FeaturesSection() {
  const features = [
    {
      icon: <UploadCloudIcon className="h-10 w-10 text-white" />,
      title: "1. Upload Your Room",
      description: "Snap a photo of any room, or upload an existing picture. Our AI works with any image.",
    },
    {
      icon: <SparklesIcon className="h-10 w-10 text-white" />,
      title: "2. Select Your Style",
      description: "Choose from dozens of styles like Modern, Minimalist, Bohemian, or Scandinavian.",
    },
    {
      icon: <LightbulbIcon className="h-10 w-10 text-white" />,
      title: "3. Get Your Designs",
      description: "Receive hundreds of unique, high-quality design variations in seconds. It's that easy!",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900">
            Redesign Your Space in 3 Simple Steps
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6 bg-gray-50 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;