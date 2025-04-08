import { PrismaClient } from "@prisma/client"

async function checkDatabaseConnection() {
  const prisma = new PrismaClient()

  try {
    console.log("Intentando conectar a la base de datos...")

    // Intentar una consulta simple
    const usersCount = await prisma.user.count()
    console.log(`✅ Conexión exitosa! Número de usuarios: ${usersCount}`)

    // Obtener información sobre las tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    console.log("Tablas en la base de datos:")
    console.table(tables)

    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la función
checkDatabaseConnection()
  .then((success) => {
    if (success) {
      console.log("Verificación completada con éxito")
    } else {
      console.log("La verificación falló")
      process.exit(1)
    }
  })
  .catch((e) => {
    console.error("Error inesperado:", e)
    process.exit(1)
  })
