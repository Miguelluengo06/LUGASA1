import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

async function initMigrations() {
  console.log("🚀 Inicializando Prisma Migrate para el proyecto Lugasa...")

  try {
    // Verificar si ya existen migraciones
    const migrationsDir = path.join(process.cwd(), "prisma", "migrations")
    const hasMigrations = fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0

    if (hasMigrations) {
      console.log("⚠️ Ya existen migraciones en el proyecto. Si continúas, podrías perder el historial existente.")
      console.log("Si estás seguro, elimina manualmente la carpeta 'prisma/migrations' y ejecuta este script de nuevo.")
      return
    }

    // Crear la migración inicial
    console.log("📝 Creando la migración inicial...")
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" })

    console.log("✅ Migración inicial creada correctamente")
    console.log("📊 Ahora puedes ver la carpeta 'prisma/migrations' con tu primera migración")

    // Verificar que la migración se aplicó correctamente
    console.log("🔍 Verificando el estado de las migraciones...")
    execSync("npx prisma migrate status", { stdio: "inherit" })

    console.log("\n🎉 Prisma Migrate ha sido inicializado correctamente")
    console.log("\n📋 Próximos pasos:")
    console.log("1. Cuando necesites modificar el esquema, edita 'prisma/schema.prisma'")
    console.log("2. Luego ejecuta 'npx prisma migrate dev --name nombre_descriptivo'")
    console.log("3. Para despliegues en producción, usa 'npx prisma migrate deploy'")
  } catch (error) {
    console.error("❌ Error al inicializar Prisma Migrate:", error)
    process.exit(1)
  }
}

initMigrations()
