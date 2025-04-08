import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config()

async function verifyDatabaseConnection() {
  console.log("🔍 Verificando conexión a la base de datos Neon...")

  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("❌ No se encontró la variable DATABASE_URL en el entorno")
    return false
  }

  // Ocultar la contraseña para mostrar en la consola
  const safeUrl = url.replace(/:[^:]+@/, ":****@")
  console.log(`📡 Intentando conectar a: ${safeUrl}`)

  const prisma = new PrismaClient()

  try {
    // Intentar conectar
    await prisma.$connect()
    console.log("✅ Conexión exitosa a la base de datos Neon")

    // Verificar si hay tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    console.log("📋 Tablas encontradas en la base de datos:")
    console.table(tables)

    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la verificación
verifyDatabaseConnection()
  .then((success) => {
    if (success) {
      console.log("🎉 La verificación de la base de datos se completó con éxito")
    } else {
      console.log("⚠️ La verificación de la base de datos falló")
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error("Error inesperado:", error)
    process.exit(1)
  })
