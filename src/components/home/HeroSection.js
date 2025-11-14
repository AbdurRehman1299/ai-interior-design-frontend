"use client";

import { Button } from '@/components/ui/button'
import { DoorOpenIcon } from 'lucide-react'
import Link from 'next/link'

function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 md:py-20">
          
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Personal AI Interior <span className="text-green-600">Designer</span>
            </h1>
            <h2 className="mt-5 text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Get hundreds of interior design ideas for your room - free with no limit.
            </h2>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link href="/upload">
                <Button>
                    Design Your Room
                    <DoorOpenIcon className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
            <img 
              src="https://placehold.co/600x400/a3e635/172b4d?text=Beautiful+Room+Design" 
              alt="AI Interior Design Example"
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
              onError={(e) => e.target.src='https://placehold.co/600x400?text=Image+Error'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;