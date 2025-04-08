"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DbStatusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newDbUrl, setNewDbUrl] = useState("")
  const [updating, setUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/")
    }
  }, [status, session, router])

  const checkDbStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/db-test")
      const data = await response.json()

      setDbStatus(data)
    } catch (err: any) {
      console.error("Error checking database:", err)
      setError(err.message || "Error al verificar la base de datos")
    } finally {
      setLoading(false)
    }
  }

  const updateDbConnection = async () => {
    if (!newDbUrl) {
      setUpdateMessage({
        type: "error",
        message: "Por favor, introduce una URL de base de datos válida",
      })
      return
    }

    setUpdating(true)
    setUpdateMessage(null)

    try {
      // En un entorno real, esto se haría a través de una API segura
      const response = await fetch("/api/admin/update-db-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ databaseUrl: newDbUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la conexión")
      }

      setUpdateMessage({
        type: "success",
        message:
          "La conexión a la base de datos ha sido verificada. Para aplicar los cambios, actualiza las variables de entorno en Vercel.",
      })

      // Refrescamos el estado después de la actualización
      setTimeout(() => {
        checkDbStatus()
      }, 1000)
    } catch (err: any) {
      console.error("Error updating database connection:", err)
      setUpdateMessage({
        type: "error",
        message: err.message || "Error al actualizar la conexión a la base de datos",
      })
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      checkDbStatus()
    }
  }, [status, session])

  // Si el usuario no es administrador o no está autenticado
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status !== "authenticated" || session?.user?.role !== "ADMIN") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Acceso restringido</h1>
        <p>Necesitas ser administrador para acceder a esta página.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Estado de la Base de Datos</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Diagnóstico de Conexión
          </CardTitle>
          <CardDescription>Información sobre la conexión a la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : dbStatus ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2">
                  {dbStatus.status === "connected" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Estado: {dbStatus.status === "connected" ? "Conectado" : "Error"}</p>
                  {dbStatus.status !== "connected" && <p className="text-sm text-red-500">{dbStatus.message}</p>}
                </div>
              </div>

              {dbStatus.status === "connected" && (
                <>
                  <div>
                    <p className="font-medium">Número de usuarios: {dbStatus.usersCount}</p>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Tablas en la base de datos:</p>
                    <ul className="list-disc pl-5">
                      {Array.isArray(dbStatus.tables) &&
                        dbStatus.tables.map((table: any, index: number) => <li key={index}>{table.table_name}</li>)}
                    </ul>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm text-gray-500">
                  URL de la base de datos: {dbStatus.databaseUrl || "No disponible"}
                </p>
                <p className="text-sm text-gray-500">
                  Última verificación: {new Date(dbStatus.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p>No hay información disponible</p>
          )}

          <div className="mt-6">
            <Button onClick={checkDbStatus} disabled={loading} className="flex items-center">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verificar conexión
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verificar Nueva Conexión</CardTitle>
          <CardDescription>Prueba una nueva URL de conexión a la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-url">URL de la base de datos a verificar</Label>
              <Input
                id="db-url"
                placeholder="postgresql://usuario:contraseña@host:puerto/nombre_db?sslmode=require"
                value={newDbUrl}
                onChange={(e) => setNewDbUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Formato: postgresql://usuario:contraseña@host:puerto/nombre_db?sslmode=require
              </p>
            </div>

            {updateMessage && (
              <Alert variant={updateMessage.type === "success" ? "default" : "destructive"}>
                {updateMessage.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{updateMessage.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={updateDbConnection} disabled={updating || !newDbUrl} className="flex items-center">
            {updating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar conexión"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
