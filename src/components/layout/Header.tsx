import { useAuthContext } from '@/context/AuthContext';
import { LiaUser } from "react-icons/lia";
import { HiMoon, HiSun } from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from 'react';

export const Header = () => {
  const { user, logout } = useAuthContext();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled on mount
    const darkMode = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const logoutHandle = () => {
    logout();
    window.location.reload();
  }

  return (
    <header className="bg-background shadow-sm border-b border-border transition-colors duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className='relative group'>

                  {/* User */}
                  <div className='rounded-full border p-2 hover:transition-shadow hover:shadow-lg cursor-pointer'>
                    {/* Validar si se tiene el avatar */}
                    {
                      user.avatar ? (
                        <div
                          style={{
                            backgroundImage: `url(${user.avatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          className="w-10 h-10 rounded-full"
                        ></div>
                      ) : (
                        <LiaUser size={30} className="text-black-600" />
                      )
                    }
                  </div>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {isDarkMode ? (
                            <HiMoon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <HiSun className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm text-card-foreground">
                            {isDarkMode ? 'Modo oscuro' : 'Modo claro'}
                          </span>
                        </div>
                        <Checkbox
                          checked={isDarkMode}
                          onCheckedChange={toggleDarkMode}
                        />
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={logoutHandle}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-md transition-colors duration-150"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>

              </>

            )}

          </div>

        </div>
      </div>
    </header>
  );
};
