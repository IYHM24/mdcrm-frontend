// JWT Service para decodificar tokens
class JwtService {
    /**
     * Decodifica un JWT y retorna el payload sin verificar la firma
     * @param token - El JWT token a decodificar
     * @returns El payload del token decodificado o null si hay error
     */
    decodeToken<T = any>(token: string): T | null {
        try {
            // Verificar que el token tenga el formato correcto (3 partes separadas por puntos)
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('❌ JWT: Token mal formado');
                return null;
            }

            // Decodificar el payload (segunda parte del token)
            const payload = parts[1];

            // Agregar padding si es necesario para base64url
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

            // Decodificar de base64
            const decodedString = atob(paddedBase64);

            // Parsear JSON
            const decodedPayload = JSON.parse(decodedString);

            return decodedPayload;
        } catch (error) {
            console.error('❌ JWT: Error al decodificar token:', error);
            return null;
        }
    }

    /**
     * Verifica si un token ha expirado
     * @param token - El JWT token a verificar
     * @returns true si el token ha expirado, false si no
     */
    isTokenExpired(token: string): boolean {
        try {
            const payload = this.decodeToken<{ exp?: number }>(token);

            if (!payload || !payload.exp) {
                return true; // Si no hay exp, consideramos que está expirado
            }

            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            console.error('❌ JWT: Error al verificar expiración:', error);
            return true;
        }
    }

    /**
     * Obtiene el tiempo restante antes de que expire el token (en segundos)
     * @param token - El JWT token
     * @returns Segundos restantes o 0 si ha expirado
     */
    getTimeUntilExpiry(token: string): number {
        try {
            const payload = this.decodeToken<{ exp?: number }>(token);

            if (!payload || !payload.exp) {
                return 0;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = payload.exp - currentTime;

            return Math.max(0, timeLeft);
        } catch (error) {
            console.error('❌ JWT: Error al calcular tiempo de expiración:', error);
            return 0;
        }
    }

    /**
     * Extrae información específica del token
     * @param token - El JWT token
     * @param field - Campo específico a extraer del payload
     * @returns El valor del campo o null si no existe
     */
    getTokenField<T = any>(token: string, field: string): T | null {
        try {
            const payload = this.decodeToken(token);
            return payload && payload[field] ? payload[field] : null;
        } catch (error) {
            console.error(`❌ JWT: Error al extraer campo ${field}:`, error);
            return null;
        }
    }

    /**
     * Verifica si un token es válido en formato (no verifica firma)
     * @param token - El JWT token a validar
     * @returns true si el formato es válido, false si no
     */
    isValidFormat(token: string): boolean {
        try {
            if (!token || typeof token !== 'string') {
                return false;
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                return false;
            }

            // Intentar decodificar cada parte
            parts.forEach(part => {
                const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
                const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
                atob(paddedBase64);
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene información completa del usuario desde el token
     * @param token - El JWT token
     * @returns Información del usuario o null si hay error
     */
    getUserInfo<T = any>(token: string): T | null {
        try {
            const payload = this.decodeToken<{
                sub?: string;
                email?: string;
                name?: string;
                role?: string;
                permissions?: string[];
                [key: string]: any;
            }>(token);

            if (!payload) {
                return null;
            }

            // Filtrar campos comunes de usuario
            const userInfo = {
                id: payload.sub || payload.id,
                email: payload.email,
                name: payload.name,
                role: payload.role,
                permissions: payload.permissions,
                ...payload // Incluir todos los campos adicionales
            };

            return userInfo as T;
        } catch (error) {
            console.error('❌ JWT: Error al extraer información de usuario:', error);
            return null;
        }
    }
}

// Exportar instancia singleton
export const jwtService = new JwtService();

// Exportar la clase por si se necesita crear instancias adicionales
export { JwtService };

// Tipos de utilidad
export interface DecodedToken {
    sub?: string;
    iat?: number;
    exp?: number;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
}