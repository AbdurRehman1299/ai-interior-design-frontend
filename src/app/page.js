import Navigation from '@/components/NavigationBar'
import { Button } from '@/components/ui/button'
import { DoorOpenIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'RoomDev - AI Interior Designer',
  description: 'Your Personal AI Interior Designer - Get hundreds of interior design ideas for your room - free with no limit.',
};

function Home() {
  return (
    <main>
      <Navigation />
      <section className='mt-31'>
        <div className='w-[40%] mx-40 mt-20'>
          <h1 className='text-5xl font-bold'>Your Personal AI Interior <span className='text-green-600'>Designer</span></h1>
          <h2 className='mt-5'>Get hundreds of interior design ideas for your room -free with no limit.</h2>
          <Link href='/upload' className='flex mt-5 text-white rounded-full py-3 text-lg'>
            <Button>
              Design Your Room <DoorOpenIcon />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home