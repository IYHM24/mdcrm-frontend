import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import React from 'react'


const NotFound: React.FC = () => {

    const navigate = useNavigate();
    const image = new URL('/assets/NotFound/image/imagen.webp', import.meta.url).href

    return (
        <div className='container '>
            <div className='flex flex-col mx-auto w-1/2 gap-5'>
                <div
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '600px',
                        height: '600px',
                    }}
                ></div>
                <h1 className="text-4xl font-bold text-center">Página no encontrada</h1>
                <p className="text-center">Lo sentimos, la página que buscas no existe.</p>
                <Button className='bg-brand-800 hover:bg-brand-900 w-1/2 mx-auto' onClick={() => navigate('/')}>Volver al inicio</Button>
            </div>
        </div>

    )
}

export default NotFound
