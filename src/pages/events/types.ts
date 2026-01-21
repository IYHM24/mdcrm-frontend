import type { PaginatedResponse, PaginationParams } from "@/types";
import type { useStateDefinition } from "@/types/Definitions";

export type TableEventsProps = {
    loading: boolean;
    setLoading: useStateDefinition<boolean>;
    error: string | null;
    setError: useStateDefinition<string | null>;
    pagination: { page: number; limit: number; total: number; totalPages: number; };
    setPagination: useStateDefinition<{ page: number; limit: number; total: number; totalPages: number; }>;
    data: any[];
    setData: useStateDefinition<any[]>;
    request_data: (params?: PaginationParams) => Promise<PaginatedResponse<any>>
}