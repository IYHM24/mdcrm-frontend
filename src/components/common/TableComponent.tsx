import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Loader2,
    MoreVertical
} from 'lucide-react';

// Tipos genéricos
export interface ColumnDef<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface TableAction<T = any> {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: T[]) => void | Promise<void>;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    requiresSelection?: boolean;
    className?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
}

export interface TableComponentProps<T> {
    // Datos
    data?: T[];
    columns: ColumnDef<T>[];

    // Paginación
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    itemsPerPageOptions?: number[];

    // Búsqueda
    searchable?: boolean;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void | Promise<void>;
    searchValue?: string;

    // Selección
    selectable?: boolean;
    selectedRows?: T[];
    onSelectionChange?: (rows: T[]) => void;
    getRowId?: (row: T) => string | number;

    // Acciones
    actions?: TableAction<T>[];
    rowActions?: (row: T) => TableAction<T>[];

    // Estilos y personalización
    title?: string;
    subtitle?: string;
    className?: string;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;

    // Estados
    loading?: boolean;
    error?: string;

    // Ordenamiento (local)
    enableLocalSort?: boolean;

    // Vista responsive
    responsiveView?: 'table' | 'cards';
    cardRenderer?: (row: T) => React.ReactNode;
}

type SortConfig = {
    key: string;
    direction: 'asc' | 'desc';
} | null;

export function TableComponent<T extends Record<string, any>>({
    data = [],
    columns,
    pagination,
    onPageChange,
    onLimitChange,
    itemsPerPageOptions = [5, 10, 20, 50],
    searchable = true,
    searchPlaceholder = 'Buscar...',
    onSearch,
    searchValue,
    selectable = false,
    onSelectionChange,
    getRowId = (row) => row.id,
    actions = [],
    rowActions,
    title,
    subtitle,
    className,
    emptyMessage = 'No se encontraron resultados',
    emptyIcon,
    loading = false,
    error,
    enableLocalSort = false,
}: TableComponentProps<T>) {
    const [internalSearchTerm, setInternalSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [internalSelectedRows, setInternalSelectedRows] = useState<Set<string | number>>(new Set());

    const searchTerm = searchValue !== undefined ? searchValue : internalSearchTerm;
    const selectedRowIds = selectable ? internalSelectedRows : new Set();

    // Asegurar que data siempre sea un array
    const safeData = Array.isArray(data) ? data : [];

    // Filtrado local
    const filteredData = useMemo(() => {
        if (!searchable || !searchTerm || onSearch) return safeData;

        return safeData.filter((row) => {
            return columns.some((col) => {
                if (col.filterable === false) return false;
                const value = row[col.key as keyof T];
                if (value == null) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [safeData, searchTerm, columns, searchable, onSearch]);

    // Ordenamiento local
    const sortedData = useMemo(() => {
        if (!enableLocalSort || !sortConfig) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredData, sortConfig, enableLocalSort]);

    const displayData = sortedData;

    // Manejo de búsqueda
    const handleSearch = (value: string) => {
        if (searchValue === undefined) {
            setInternalSearchTerm(value);
        }
        if (onSearch) {
            onSearch(value);
        }
        if (onPageChange) {
            onPageChange(1);
        }
    };

    // Manejo de ordenamiento
    const handleSort = (key: string) => {
        if (!enableLocalSort) return;

        setSortConfig((current) => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    // Manejo de selección
    const handleSelectAll = (checked: boolean) => {
        if (!selectable) return;

        const newSelected = new Set<string | number>();
        if (checked) {
            displayData.forEach((row) => newSelected.add(getRowId(row)));
        }
        setInternalSelectedRows(newSelected as Set<string | number>);

        if (onSelectionChange) {
            onSelectionChange(checked ? displayData : []);
        }
    };

    const handleSelectRow = (row: T, checked: boolean) => {
        if (!selectable) return;

        const rowId = getRowId(row);
        const newSelected = new Set<string | number>(Array.from(selectedRowIds) as (string | number)[]);

        if (checked) {
            newSelected.add(rowId);
        } else {
            newSelected.delete(rowId);
        }

        setInternalSelectedRows(newSelected);

        if (onSelectionChange) {
            const selectedRowsData = displayData.filter((r) => newSelected.has(getRowId(r)));
            onSelectionChange(selectedRowsData);
        }
    };

    const isAllSelected = displayData.length > 0 && displayData.every((row) => selectedRowIds.has(getRowId(row)));
    const isSomeSelected = displayData.some((row) => selectedRowIds.has(getRowId(row))) && !isAllSelected;

    // Obtener filas seleccionadas
    const getSelectedRowsData = () => {
        return displayData.filter((row) => selectedRowIds.has(getRowId(row)));
    };

    // Renderizado del encabezado de columna
    const renderColumnHeader = (column: ColumnDef<T>) => {
        const isSorted = sortConfig?.key === column.key;
        const canSort = enableLocalSort && column.sortable !== false;

        return (
            <div
                className={`flex items-center gap-2 ${canSort ? 'cursor-pointer select-none' : ''}`}
                onClick={() => canSort && handleSort(column.key as string)}
            >
                <span>{column.label}</span>
                {canSort && (
                    <div className="flex flex-col">
                        {!isSorted && <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                        {isSorted && sortConfig.direction === 'asc' && <ArrowUp className="h-3 w-3" />}
                        {isSorted && sortConfig.direction === 'desc' && <ArrowDown className="h-3 w-3" />}
                    </div>
                )}
            </div>
        );
    };

    // Renderizado de celda
    const renderCell = (column: ColumnDef<T>, row: T) => {
        const value = row[column.key as keyof T];

        if (column.render) {
            return column.render(value, row);
        }

        if (value == null) return '-';
        if (typeof value === 'boolean') return value ? 'Sí' : 'No';
        // Check for Date-like objects
        if (typeof value === 'object' && 'toLocaleDateString' in value && typeof value.toLocaleDateString === 'function') {
            return value.toLocaleDateString();
        }

        return String(value);
    };

    return (
        <div className={className}>
            <Card>
                {(title || subtitle || searchable || actions.length > 0) && (
                    <CardHeader className="flex flex-col gap-4">
                        {(title || subtitle) && (
                            <div>
                                {title && <CardTitle className="text-xl">{title}</CardTitle>}
                                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            {/* Barra de búsqueda */}
                            {searchable && (
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            )}

                            {/* Acciones */}
                            {actions.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {actions.map((action, idx) => {
                                        const isDisabled = action.requiresSelection && selectedRowIds.size === 0;
                                        return (
                                            <Button
                                                key={idx}
                                                variant={action.variant || 'default'}
                                                className={action.className}
                                                onClick={() => action.onClick(getSelectedRowsData())}
                                                disabled={isDisabled}
                                            >
                                                {action.icon}
                                                {action.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Info de selección */}
                        {selectable && selectedRowIds.size > 0 && (
                            <div className="text-sm text-muted-foreground">
                                {selectedRowIds.size} {selectedRowIds.size === 1 ? 'elemento seleccionado' : 'elementos seleccionados'}
                            </div>
                        )}
                    </CardHeader>
                )}

                <CardContent>
                    {/* Estados de error y carga */}
                    {error && (
                        <div className="text-center py-8 text-destructive">
                            <p>{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Tabla */}
                    {!loading && !error && displayData.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {selectable && (
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Seleccionar todo"
                                                    className={isSomeSelected ? 'data-[state=checked]:bg-primary' : ''}
                                                />
                                            </TableHead>
                                        )}
                                        {columns.map((column) => (
                                            <TableHead
                                                key={column.key as string}
                                                className={column.headerClassName}
                                            >
                                                {renderColumnHeader(column)}
                                            </TableHead>
                                        ))}
                                        {rowActions && <TableHead className="w-12"></TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayData.map((row, idx) => {
                                        const rowId = getRowId(row);
                                        const isSelected = selectedRowIds.has(rowId);

                                        return (
                                            <TableRow
                                                key={rowId}
                                                data-state={isSelected ? 'selected' : undefined}
                                            >
                                                {selectable && (
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                                                            aria-label={`Seleccionar fila ${idx + 1}`}
                                                        />
                                                    </TableCell>
                                                )}
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={`${rowId}-${column.key as string}`}
                                                        className={column.className}
                                                    >
                                                        {renderCell(column, row)}
                                                    </TableCell>
                                                ))}
                                                {rowActions && (
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">Abrir menú</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {rowActions(row).map((action, actionIdx) => (
                                                                    <DropdownMenuItem
                                                                        key={actionIdx}
                                                                        onClick={() => action.onClick([row])}
                                                                        className={action.className}
                                                                    >
                                                                        {action.icon && <span className="mr-2">{action.icon}</span>}
                                                                        {action.label}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Estado vacío */}
                    {!loading && !error && displayData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                {emptyIcon || (
                                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                                        <Search className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="font-medium text-foreground">{emptyMessage}</p>
                                    {searchTerm && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Intenta con otros términos de búsqueda
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paginación */}
                    {pagination && pagination.totalPages && pagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <div className="text-sm text-muted-foreground">
                                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                                {pagination.total} resultados
                            </div>

                            <div className="flex items-center gap-4">
                                {onLimitChange && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Por página:</span>
                                        <select
                                            value={pagination.limit}
                                            onChange={(e) => onLimitChange(Number(e.target.value))}
                                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        >
                                            {itemsPerPageOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => onPageChange && onPageChange(Math.max(1, pagination.page - 1))}
                                                className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: Math.min(5, pagination.totalPages || 0) }, (_, i) => {
                                            let pageNum;
                                            const totalPages = pagination.totalPages || 0;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }

                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        onClick={() => onPageChange && onPageChange(pageNum)}
                                                        isActive={pagination.page === pageNum}
                                                        className="cursor-pointer"
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {(pagination.totalPages || 0) > 5 && pagination.page < (pagination.totalPages || 0) - 2 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => onPageChange && onPageChange(Math.min(pagination.totalPages || 1, pagination.page + 1))}
                                                className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
