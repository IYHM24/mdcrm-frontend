import { AuthProvider } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
