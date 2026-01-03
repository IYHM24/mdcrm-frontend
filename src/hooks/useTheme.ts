import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types';

export const useTheme = () => {
    // Función para determinar el tema efectivo
    const getEffectiveTheme = useCallback((theme: Theme): 'light' | 'dark' => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    }, []);

    const [theme, setThemeState] = useState<Theme>(() => {
        // Recuperar el tema guardado o usar 'system' por defecto
        const saved = localStorage.getItem('theme') as Theme;
        return saved || 'system';
    });

    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
        // Determinar el tema efectivo al cargar
        const saved = localStorage.getItem('theme') as Theme;
        return getEffectiveTheme(saved || 'system');
    });

    const isDarkMode = effectiveTheme === 'dark';

    // Función para aplicar la clase al DOM
    const applyThemeToDOM = useCallback((newEffectiveTheme: 'light' | 'dark') => {
        const htmlElement = document.documentElement;
        const shouldHaveDarkClass = newEffectiveTheme === 'dark';
        const currentlyHasDarkClass = htmlElement.classList.contains('dark');

        // Solo modificar el DOM si es necesario
        if (shouldHaveDarkClass && !currentlyHasDarkClass) {
            htmlElement.classList.add('dark');
        } else if (!shouldHaveDarkClass && currentlyHasDarkClass) {
            htmlElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const newEffectiveTheme = getEffectiveTheme(theme);

        // Solo actualizar si ha cambiado
        if (newEffectiveTheme !== effectiveTheme) {
            setEffectiveTheme(newEffectiveTheme);
            applyThemeToDOM(newEffectiveTheme);
        }

        // Escuchar cambios en las preferencias del sistema solo si el tema es 'system'
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                const systemTheme = mediaQuery.matches ? 'dark' : 'light';
                if (systemTheme !== effectiveTheme) {
                    setEffectiveTheme(systemTheme);
                    applyThemeToDOM(systemTheme);
                }
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, effectiveTheme, getEffectiveTheme, applyThemeToDOM]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    }, []);

    const toggleDarkMode = useCallback(() => {
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [effectiveTheme, setTheme]);

    return {
        theme,
        effectiveTheme,
        isDarkMode,
        setTheme,
        toggleDarkMode,
    };
};