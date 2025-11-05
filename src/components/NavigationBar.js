import { Lamp } from 'lucide-react'
import { Button } from './ui/button'

function Navigation(){
    return (
        <nav className='flex justify-between mr-[100px] ml-[60px] mt-4'>
            <div className='flex text-green-600 text-3xl font-bold hover:cursor-pointer'>
                <Lamp />
                <h1>roomDev</h1>
            </div>
            <div className="flex gap-3">
                <Button className='bg-green-600 text-white'>Login</Button>
                <Button variant="outline" className='text-green-600 hover:text-green-600'>Sign Up</Button>
            </div>
        </nav>
    )
}

export default Navigation