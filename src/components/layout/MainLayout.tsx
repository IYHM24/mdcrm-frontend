import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';


export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen ">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
