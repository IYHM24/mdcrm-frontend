import { MainLayout } from '@/components/layout/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { authService } from './services';
import { RouteGenerator } from './utils/RouteGenerator';
import { RoutesMap, PublicRoutesMap } from './utils/RoutesMap';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authService.isAuthenticated() ?

          /* Autenticado */
          (
            <Route path='/' element={<MainLayout />}>
              {RouteGenerator({ RoutesMap: RoutesMap })}
            </Route>
          ) :
          /* No autenticado */
          (
            <>
              {RouteGenerator({ RoutesMap: PublicRoutesMap })}
            </>
          )

        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
