"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from "next-auth/react"

type Invoice = {
  id: string
  userId: string
  subscriptionId: string | null
  amount: number
  status: string
  paidAt: string | null
  dueDate: string
  invoiceNumber: string
  stripeInvoiceId: string | null
  createdAt: string
  subscription: {
    plan: {
      name: string
    }
  } | null
}

export function UserInvoices() {
  const { data: session, status } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Si el usuario no está autenticado, no hacemos la petición
        if (status === "unauthenticated") {
          setInvoices([])
          setIsLoading(false)
          return
        }

        // Si todavía está cargando la sesión, esperamos
        if (status === "loading") {
          return
        }

        const response = await fetch("/api/user/invoices")

        if (!response.ok) {
          // Si el usuario no está autenticado, simplemente establecemos un array vacío
          if (response.status === 401) {
            setInvoices([])
            return
          }
          throw new Error("Error al obtener facturas")
        }

        const data = await response.json()
        setInvoices(data)
      } catch (error: any) {
        console.error("Error fetching invoices:", error)
        setError(error.message || "Ocurrió un error al cargar las facturas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [status])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString // Fallback to original string if formatting fails
    }
  }

  const viewInvoice = async (invoiceId: string) => {
    try {
      // Abrir la factura en una nueva ventana
      window.open(`/api/user/invoices/${invoiceId}/pdf`, "_blank")
    } catch (error: any) {
      console.error("Error viewing invoice:", error)
      setError(error.message || "Ocurrió un error al visualizar la factura")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mis facturas</CardTitle>
          <CardDescription>Inicia sesión para ver tus facturas</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-6">Debes iniciar sesión para ver tus facturas</p>
          <Button asChild>
            <a href="/login">Iniciar sesión</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mis facturas</CardTitle>
          <CardDescription>No tienes facturas disponibles</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-6">Las facturas aparecerán aquí cuando realices pagos por tus suscripciones</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mis facturas</h2>

      <Card>
        <CardHeader>
          <CardTitle>Historial de facturación</CardTitle>
          <CardDescription>Todas tus facturas y pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>
                    {invoice.subscription ? `Suscripción: ${invoice.subscription.plan.name}` : "Cargo"}
                  </TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        invoice.status === "PAID"
                          ? "bg-green-500"
                          : invoice.status === "PENDING"
                            ? "bg-yellow-500"
                            : invoice.status === "OVERDUE"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }
                    >
                      {invoice.status === "PAID"
                        ? "Pagada"
                        : invoice.status === "PENDING"
                          ? "Pendiente"
                          : invoice.status === "OVERDUE"
                            ? "Vencida"
                            : "Cancelada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewInvoice(invoice.id)}
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver factura
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
