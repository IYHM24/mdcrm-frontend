import { useEffect, useState } from 'react';
import { RoutesMap } from '@/utils/RoutesMap';
import { Link } from 'react-router-dom';
import {
  ChartNoAxesColumn,
  ChevronDown,
  ChevronFirst,
  ChevronRight,
} from 'lucide-react';
import type { RouteMapType } from '@/types';

//

//
const TAMANO_ICONO = 20;

export const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeRoute, setActiveRoute] = useState<string>('');

  useEffect(() => {
    //Set initial active route based on current URL
    setActiveRoute(window.location.pathname);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const activeItem = (item: RouteMapType | undefined = undefined) => {
    item !== undefined ? setActiveRoute(item.route ? item.route.path : '/')
      : setActiveRoute('/');;
  }

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-brand-900 dark:bg-zinc-800 transition-all duration-300 ease-in-out flex flex-col h-screen overflow-hidden`}>
      {/* Header */}

      <div className="p-6">

        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" onClick={() => activeItem()}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-brand-900  font-bold text-lg">MD</span>
                </div>
                <span className="text-white font-semibold text-xl">Sollution</span>
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white/70 dark:text-brand-dark-400 hover:text-white dark:hover:text-brand-dark-200 transition-colors p-1 rounded"
          >
            {isCollapsed ? <ChartNoAxesColumn size={16} className="rotate-90" /> : <ChevronFirst size={16} />}
          </button>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 min-h-44 overflow-y-auto scrollbar-hide">
        <div className="space-y-2">
          {RoutesMap.map((item) => {
            const isExpanded = expandedItems.includes(item.module);
            const hasSubItems = item.subroutes && item.subroutes.length > 0;

            return item.route?.path === "/" ? <></> : (
              <div key={"item-" + item.module}>
                {/* Main Item */}
                {item.route ? (
                  <a
                    href={item.route.path}
                    onClick={() => { activeItem(item) }}
                    className={`
                      group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative
                      ${activeRoute === item.route.path
                        ? 'bg-white/90 dark:bg-brand-dark-700/90 text-brand-500 dark:text-brand-400 shadow-lg backdrop-blur-sm'
                        : 'text-white/80 dark:text-brand-dark-300 hover:text-white dark:hover:text-brand-dark-100 hover:bg-white/10 dark:hover:bg-brand-dark-700/50'
                      }
                    `}
                    title={isCollapsed ? item.module : ''}
                  >
                    <span className="flex-shrink-0">
                      {item.icon && item.icon({ size: TAMANO_ICONO })}
                    </span>
                    {!isCollapsed && (
                      <span className="ml-3 truncate">{item.module}</span>
                    )}
                    {item.active && (
                      <div className={`${isCollapsed ? 'absolute -right-1 top-1/2 -translate-y-1/2' : 'ml-auto'}`}>
                        <div className="w-1 h-1 bg-brand-500 dark:bg-brand-400 rounded-full"></div>
                      </div>
                    )}
                  </a>
                ) : (
                  <button
                    onClick={() => hasSubItems && !isCollapsed && toggleExpanded(item.module)}
                    className={`
                      w-full group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative
                      text-white/80 dark:text-brand-dark-300 hover:text-white dark:hover:text-brand-dark-100 hover:bg-white/10 dark:hover:bg-brand-dark-700/50
                    `}
                    title={isCollapsed ? item.module : ''}
                  >
                    <span className="flex-shrink-0">
                      {item.icon && item.icon({ size: TAMANO_ICONO })}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 truncate flex-1 text-left">{item.module}</span>
                        {hasSubItems && (
                          <span className="ml-auto">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.subroutes!.map((subItem, index) => (
                      <a
                        onClick={() => { activeItem(item) }}
                        key={index}
                        href={subItem.route.path}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${subItem.active
                            ? 'bg-white/90 dark:bg-brand-dark-700/90 text-brand-500 dark:text-brand-400 shadow-lg backdrop-blur-sm'
                            : 'text-white/70 dark:text-brand-dark-400 hover:text-white dark:hover:text-brand-dark-100 hover:bg-white/10 dark:hover:bg-brand-dark-700/50'
                          }
                        `}
                      >
                        {subItem.icon && (
                          <span className="flex-shrink-0 mr-2">
                            {subItem.icon({ size: 16 })}
                          </span>
                        )}
                        <span className="truncate">{subItem.module}</span>
                        {subItem.active && (
                          <div className="ml-auto">
                            <div className="w-1 h-1 bg-brand-500 dark:bg-brand-400 rounded-full"></div>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-brand-400/20 dark:border-brand-dark-600">
          <div className="text-white/60 dark:text-brand-dark-400 text-xs text-center">
            <h2 className='font-bold'>Ancom </h2>
            <p className="mb-1">Todos los derechos reservados</p>
            <p>{new Date().getFullYear()}</p>
          </div>
        </div>

      )}
    </aside>
  );
};