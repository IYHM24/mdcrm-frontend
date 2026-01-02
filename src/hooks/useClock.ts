// hooks/useClock.ts
import { useState, useEffect, useRef } from 'react'

interface UseClockOptions {
    updateInterval?: number
    format?: 'time' | 'date' | 'datetime'
}

export const useClock = (options: UseClockOptions = {}) => {
    const { updateInterval = 1000, format = 'datetime' } = options
    const [time, setTime] = useState(new Date())
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        // Función para actualizar la hora
        const updateTime = () => {
            setTime(new Date())
        }

        // Configurar el interval
        intervalRef.current = setInterval(updateTime, updateInterval)

        // Cleanup al desmontar
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [updateInterval])

    const formatTime = () => {
        switch (format) {
            case 'time':
                return time.toLocaleTimeString('es-ES')
            case 'date':
                return time.toLocaleDateString('es-ES')
            case 'datetime':
                return {
                    time: time.toLocaleTimeString('es-ES'),
                    date: time.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }
            default:
                return time.toLocaleString('es-ES')
        }
    }

    return {
        time,
        formattedTime: formatTime(),
        rawTime: time.getTime()
    }
}