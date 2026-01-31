import type { PaginationInfo } from "@/components/common";
import type { PaginatedResponse, PaginationParams } from "@/types";
import type { useStateDefinition } from "@/types/Definitions";

export type TableEventsProps = {
    loading: boolean;
    setLoading: useStateDefinition<boolean>;
    error: string | null;
    setError: useStateDefinition<string | null>;
    pagination: PaginationInfo;
    setPagination: useStateDefinition<PaginationInfo>;
    data: any[];
    setData: useStateDefinition<any[]>;
    request_data: (params?: PaginationParams) => Promise<PaginatedResponse<any>>
}