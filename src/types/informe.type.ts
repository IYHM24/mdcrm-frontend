export type TipoIdentificacion = "CC" | "TI" | "CE" | "NIT" | "PEP";

/**
 * Tipado mínimo de usuario (según ApplicationUser del backend).
 * Ajustar según propiedades que realmente serializa la API.
 */
export interface ApplicationUser {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    documentNumber?: string | null;
    avatar?: string | null;
    isActive?: boolean;
    createdAt?: string | null; // ISO datetime
}

/**
 * Tipado de cliente (ClienteModel).
 */
export interface ClienteModel {
    id: number;
    nombre: string;
    apellido: string;
    identificacion: string;
    tipoIdentificacion: TipoIdentificacion | string;
    celular: string;
    correo?: string | null;
    celularAlterno?: string | null;
    observacion?: string | null;
    createdAt?: string | null; // ISO datetime
    updatedAt?: string | null; // ISO datetime
}

/**
 * Tipado de informe (InformeModel).
 * Los DateTime del backend se representan como string ISO en JSON.
 * Nombres en camelCase para consumo en frontend.
 */
export interface InformeModel {
    id: number;
    poliza?: number | null;
    asegurado?: string | null;
    cc?: string | null;
    prima?: number | null;
    observacion?: string | null;
    datacredito?: string | null;
    cifin?: string | null;
    fchInicio?: number | null; // si es fecha como entero, conservar number; si es epoch/date, ajustar
    createdByUserId?: number | null;
    createdByUser?: ApplicationUser | null;
    clientId?: number | null;
    client?: ClienteModel | null;
    createdAt?: string | null; // ISO datetime
    updatedAt?: string | null; // ISO datetime
}