import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config()

async function updateDatabaseConnection(newDatabaseUrl: string) {
  // Verificar que la nueva URL es válida
  if (!newDatabaseUrl || !newDatabaseUrl.startsWith("postgres://")) {
    console.error("❌ URL de base de datos inválida. Debe comenzar con postgres://")
    return false
  }

  try {
    console.log("🔍 Probando conexión con la nueva URL...")

    // Crear un cliente Prisma temporal con la nueva URL
    const tempPrisma = new PrismaClient({
      datasources: {
        db: {
          url: newDatabaseUrl,
        },
      },
    })

    // Probar la conexión
    await tempPrisma.$connect()
    console.log("✅ Conexión exitosa a la nueva base de datos")

    // Desconectar el cliente temporal
    await tempPrisma.$disconnect()

    // Actualizar el archivo .env si existe
    const envPath = path.join(process.cwd(), ".env")
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8")

      // Reemplazar o añadir la variable DATABASE_URL
      if (envContent.includes("DATABASE_URL=")) {
        envContent = envContent.replace(/DATABASE_URL=.*$/m, `DATABASE_URL="${newDatabaseUrl}"`)
      } else {
        envContent += `\nDATABASE_URL="${newDatabaseUrl}"\n`
      }

      fs.writeFileSync(envPath, envContent)
      console.log("✅ Archivo .env actualizado correctamente")
    } else {
      // Crear un nuevo archivo .env si no existe
      fs.writeFileSync(envPath, `DATABASE_URL="${newDatabaseUrl}"\n`)
      console.log("✅ Archivo .env creado correctamente")
    }

    console.log("🎉 La conexión a la base de datos ha sido actualizada")
    console.log("⚠️ Recuerda reiniciar tu aplicación para aplicar los cambios")

    return true
  } catch (error) {
    console.error("❌ Error al conectar con la nueva base de datos:", error)
    return false
  }
}

// Ejecutar el script si se proporciona una URL como argumento
const newDatabaseUrl = process.argv[2]
if (newDatabaseUrl) {
  updateDatabaseConnection(newDatabaseUrl)
    .then((success) => {
      if (!success) {
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error("Error inesperado:", error)
      process.exit(1)
    })
} else {
  console.log("❌ Debe proporcionar una URL de base de datos como argumento")
  console.log("Ejemplo: npm run update-db postgres://usuario:contraseña@host:puerto/nombre_db")
  process.exit(1)
}
