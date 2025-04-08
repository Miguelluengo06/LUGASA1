import { NextResponse } from "next/server"
import { prisma, testDatabaseConnection } from "@/lib/prisma"

export const runtime = "nodejs" // Especificar runtime para Vercel

export async function GET() {
  try {
    // Probar la conexión
    const isConnected = await testDatabaseConnection()

    if (!isConnected) {
      throw new Error("No se pudo establecer conexión con la base de datos")
    }

    // Intentar una consulta simple
    const usersCount = await prisma.user.count()

    // Obtener información sobre las tablas de la base de datos
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      status: "connected",
      usersCount,
      tables,
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]+@/, ":****@"), // Oculta la contraseña
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error de conexión a la base de datos:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        databaseUrl: process.env.DATABASE_URL ? "Configurado (con error)" : "No configurado",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
