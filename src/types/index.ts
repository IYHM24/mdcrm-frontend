import type { JSX } from "react";

// Common types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  customerId: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  assignedTo: string;
  relatedTo?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}


export interface RouteType{
  path: string;
  component: (params: any) => JSX.Element;
}

export interface SubRouteMapType {
  icon?: string;
  module: string;
  route: RouteType;
}


export interface RouteMapType {
  icon?: string;
  module: string;
  route?: RouteType;
  subroutes?: SubRouteMapType[];
}

