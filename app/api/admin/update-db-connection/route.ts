import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

export async function POST(request: Request) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await auth()

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener la nueva URL de la base de datos
    const { databaseUrl } = await request.json()

    if (!databaseUrl || typeof databaseUrl !== "string") {
      return NextResponse.json({ error: "URL de base de datos inválida" }, { status: 400 })
    }

    // Probar la conexión con la nueva URL
    try {
      const tempPrisma = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      })

      await tempPrisma.$connect()
      await tempPrisma.$disconnect()
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error al conectar con la nueva base de datos: ${error.message}` },
        { status: 400 },
      )
    }

    // En un entorno de producción, aquí se actualizaría la variable de entorno
    // Esto generalmente requiere acceso al sistema de configuración del hosting
    // Por ejemplo, en Vercel sería a través de su API

    return NextResponse.json({
      success: true,
      message: "Conexión a la base de datos verificada correctamente",
    })
  } catch (error: any) {
    console.error("Error al actualizar la conexión a la base de datos:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
