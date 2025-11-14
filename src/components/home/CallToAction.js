import React from 'react';
import { Button } from '../ui/button';
import { DoorOpenIcon } from 'lucide-react';

function CallToActionSection() {
  return (
    <section className="bg-green-600">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to See Your Dream Room?
        </h2>
        <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
          Start designing for free right now. No sign-up required, no limits on your creativity.
        </p>
        <div className="mt-8">
          <Button className="bg-white text-green-700 hover:bg-gray-100">
            Start Designing Now
            <DoorOpenIcon className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CallToActionSection;