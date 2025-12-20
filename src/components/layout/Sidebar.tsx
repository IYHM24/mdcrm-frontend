import type { ReactNode } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon?: ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Clientes', href: '/customers' },
  { name: 'Leads', href: '/leads' },
  { name: 'Tareas', href: '/tasks' },
  { name: 'Reportes', href: '/reports' },
  { name: 'Configuración', href: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.name}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
};
