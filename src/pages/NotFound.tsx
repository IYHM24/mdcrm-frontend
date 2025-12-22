import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const NotFound: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2 items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-center mt-20">404 - Página no encontrada</h1>
            <p className="text-center mt-4">Lo sentimos, la página que buscas no existe.</p>
            <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
    )
}

export default NotFound
