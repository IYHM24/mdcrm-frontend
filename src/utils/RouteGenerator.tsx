import type { RouteMapType } from '@/types';
import { Route } from 'react-router-dom';

interface RouteGeneratorProps {
    RoutesMap: RouteMapType[];
}

/**
 * Inyector de rutas
 * @param param0 
 * @returns 
 */
export const RouteGenerator = ({ RoutesMap }: RouteGeneratorProps) => {
    return (
        RoutesMap.map(({ route, subroutes }, index) => (
            (
                route && route.path != null && subroutes == null
            ) ?
                <Route
                    key={"Index - " + index}
                    path={route.path}
                    element={
                        <route.component />
                    }
                /> :
                subroutes?.map((subroute, subindex) => (
                    <Route
                        key={"subIndex - " + subindex}
                        path={subroute.route.path}
                        element={
                            <subroute.route.component />
                        }
                    />
                ))
        ))
    )
}

