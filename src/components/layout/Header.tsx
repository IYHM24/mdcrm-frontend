import { useAuthContext } from '@/context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">CRM System</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
