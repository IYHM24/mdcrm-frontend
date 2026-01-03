import { createContext, useContext } from 'react';
import type { ReactNode, Theme } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
    theme: Theme;
    effectiveTheme: 'light' | 'dark';
    isDarkMode: boolean;
    setTheme: (theme: Theme) => void;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const themeData = useTheme();

    return <ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};