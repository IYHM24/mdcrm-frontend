//Importacion de tipos
import type { RouteMapType } from "@/types";
import type { LucideProps } from "lucide-react";

//Importacion de paginas
import InformacionPage from "@/pages/Informacion";
import UsuariosPage from "@/pages/Usuarios";
import RolesPage from "@/pages/Roles";
import HomePage from "@/pages/Home";
import { Login } from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { LayoutDashboard, Users, Key } from "lucide-react";

//Configuracion de componente - Privadas
const InformacionComponent = (params: any) => { return <InformacionPage {...params} /> }
const UsuariosComponent = (params: any) => { return <UsuariosPage {...params} /> }
const RolesComponent = (params: any) => { return <RolesPage {...params} /> }
const HomeComponent = (params: any) => { return <HomePage {...params} /> }

//Configuracion de iconos - privadas
const InformacionIcon = (params: LucideProps) => { return <LayoutDashboard {...params} /> }
const UsuariosIcon = (params: LucideProps) => { return <Users {...params} /> }
const RolesIcon = (params: LucideProps) => { return <Key {...params} /> }


//Confuiguracion de componente - Publicas
const LoginComponent = (params: any) => { return <Login {...params} /> }

//Configuracion de componente - Compartidas
const NotFoundComponent = (params: any) => { return <NotFound {...params} /> }

//Mapa de rutas - Privadas (CRM)
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
        icon: InformacionIcon,
        route: {
            path: '/informacion',
            component: InformacionComponent,
        },
    },
    {
        module: 'usuarios',
        icon: UsuariosIcon,
        route: {
            path: '/usuarios',
            component: UsuariosComponent,
        },
    },
    {
        module: 'roles',
        icon: RolesIcon,
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

//Mapa de rutas - compartidas
export const SharedRoutesMap: RouteMapType[] = [
    {
        module: 'not_found',
        route: {
            path: '/*',
            component: NotFoundComponent,
        },
    }
]