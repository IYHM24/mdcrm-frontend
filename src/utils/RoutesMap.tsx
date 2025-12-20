//Importacion de tipos
import type { RouteMapType } from "@/types";

//Importacion de paginas
import InformacionPage from "@/pages/Informacion";
import UsuariosPage from "@/pages/Usuarios";
import RolesPage from "@/pages/Roles";
import HomePage from "@/pages/Home";
import { Login } from "@/pages/Login";

//Configuracion de componente - Privadas
const InformacionComponent = (params: any) => { return <InformacionPage {...params} /> }
const UsuariosComponent = (params: any) => { return <UsuariosPage {...params} /> }
const RolesComponent = (params: any) => { return <RolesPage {...params} /> }
const HomeComponent = (params: any) => { return <HomePage {...params} /> }

//Confuiguracion de componente - Publicas
const LoginComponent = (params: any) => { return <Login {...params} /> }

//Mapa de rutas - Privadas
export const RoutesMap: RouteMapType[] = [
    {
        module: 'home',
        route: {
            path: '/',
            component: HomeComponent,
        },
    },
    {
        module: 'informacion',
        route: {
            path: '/informacion',
            component: InformacionComponent,
        },

    },
    {
        module: 'usuarios',
        route: {
            path: '/usuarios',
            component: UsuariosComponent,
        },
    },
    {
        module: 'roles',
        route: {
            path: '/roles',
            component: RolesComponent,
        },
    }
]

//Mapa de rutas - Publico
export const PublicRoutesMap: RouteMapType[] = [
    {
        module: 'login',
        route: {
            path: '/',
            component: LoginComponent,
        },
    }
]