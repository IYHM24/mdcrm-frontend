import { useAuthContext } from '@/context/AuthContext';
import { LiaUser } from "react-icons/lia";
import { HiMoon, HiSun } from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuthContext();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

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

  const logoutHandle = async () => {
    await logout();
    window.location.reload();
  }

  return (
    <header className={
      `
        bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md backdrop-saturate-150 backdrop-brightness-110 shadow-lg border-b border-white/20 dark:border-zinc-700/20
        m-2 rounded-2xl 
      `
    }
    >
      <div className="mx-auto px-6">
        <div className="flex justify-end items-center h-20">

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <div className='relative group'>

                  {/* User icon*/}
                  <div className='flex gap-4 group'>
                    <div className='rounded-full border-2 border-white/30 dark:border-zinc-700/50 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm p-3 group-hover:!bg-white/30 dark:!group-hover:bg-zinc-800/30 group-hover:shadow-lg cursor-pointer'>
                      {/* Validar si se tiene el avatar */}
                      {
                        user.avatar ? (
                          <div
                            style={{
                              backgroundImage: `url(${user.avatar})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            className="w-12 h-12 rounded-full"
                          ></div>
                        ) : (
                          <LiaUser size={32} className="text-black-600" />
                        )
                      }
                    </div>
                    <div className='flex flex-col justify-center'>
                      <span className="font-medium text-card-foreground text-md">Sandra Ortiz</span>
                      <span className="font-light text-card-foreground text-sm">Administradora</span>
                    </div>
                  </div>


                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 backdrop-blur-md backdrop-saturate-120 rounded-md shadow-xl border border-white/30 dark:border-zinc-700/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">

                    <div className="p-3 border-b border-white/20 dark:border-zinc-700/30">
                      <p className="text-sm font-medium text-card-foreground">Sandra</p>
                      <p className="text-xs text-muted-foreground">Ortiz</p>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="p-3 border-b border-white/20 dark:border-zinc-700/30">
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
