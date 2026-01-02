import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, TrendingUp, Calendar, Plus, Phone, Mail, FileText, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const HomePage: React.FC = () => {

  // Datos de ejemplo - en producción vendrían de una API
  const stats = [
    {
      title: 'Total Clientes',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Ventas del Mes',
      value: '$45,678',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Leads Activos',
      value: '89',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Citas Programadas',
      value: '24',
      change: '-2.4%',
      changeType: 'negative' as const,
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'call',
      title: 'Llamada con Juan Pérez',
      time: 'Hace 2 horas',
      status: 'completed'
    },
    {
      id: 2,
      type: 'email',
      title: 'Email enviado a María González',
      time: 'Hace 4 horas',
      status: 'sent'
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Reunión con equipo de ventas',
      time: 'Hace 1 día',
      status: 'completed'
    },
    {
      id: 4,
      type: 'task',
      title: 'Seguimiento lead - Tech Corp',
      time: 'Hace 2 días',
      status: 'pending'
    }
  ]

  const quickActions = [
    {
      title: 'Nuevo Cliente',
      description: 'Agregar un cliente al CRM',
      icon: Plus,
      variant: 'default' as const
    },
    {
      title: 'Programar Llamada',
      description: 'Agendar una llamada',
      icon: Phone,
      variant: 'secondary' as const
    },
    {
      title: 'Enviar Email',
      description: 'Enviar email masivo',
      icon: Mail,
      variant: 'outline' as const
    },
    {
      title: 'Crear Reporte',
      description: 'Generar nuevo reporte',
      icon: FileText,
      variant: 'ghost' as const
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'meeting': return Calendar
      case 'task': return FileText
      default: return Clock
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            ¡Hola! Sandra 👋🏼
          </h1>
          <p className="text-muted-foreground text-lg">
            Bienvenida al sistema de gestión de relaciones con clientes
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">desde el mes pasado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Actividades Recientes</CardTitle>
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-full bg-background border">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(activity.status)}`}>
                      {activity.status === 'completed' ? 'Completado' :
                        activity.status === 'sent' ? 'Enviado' : 'Pendiente'}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Daily Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={action.title}
                    variant={action.variant}
                    className="w-full justify-start h-auto p-4"
                    size="lg"
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm opacity-70">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Daily Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Resumen del Día</CardTitle>
              <CardDescription>Tu actividad de hoy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tareas pendientes</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Llamadas programadas</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emails sin responder</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reuniones hoy</span>
                <span className="font-medium">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Objetivos del Mes</CardTitle>
            <CardDescription>Tu progreso hacia las metas establecidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nuevos Clientes</span>
                <span className="font-medium">67%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ventas Mensuales</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seguimientos</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Próximas Citas</CardTitle>
            <CardDescription>Tus reuniones programadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Reunión con Carlos López</p>
                <p className="text-xs text-muted-foreground">10:00 AM - 11:00 AM</p>
              </div>
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Demo con TechStart</p>
                <p className="text-xs text-muted-foreground">2:30 PM - 3:30 PM</p>
              </div>
              <span className="text-xs text-muted-foreground">Mañana</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Seguimiento Marketing Plus</p>
                <p className="text-xs text-muted-foreground">4:00 PM - 4:30 PM</p>
              </div>
              <span className="text-xs text-muted-foreground">Viernes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
