import { execSync } from "child_process"

async function deployMigrations() {
  console.log("🚀 Aplicando migraciones en la base de datos...")

  try {
    // Aplicar migraciones existentes
    console.log("📝 Aplicando migraciones...")
    execSync("npx prisma migrate deploy", { stdio: "inherit" })

    console.log("✅ Migraciones aplicadas correctamente")

    // Verificar el estado de las migraciones
    console.log("🔍 Verificando el estado de las migraciones...")
    execSync("npx prisma migrate status", { stdio: "inherit" })

    console.log("\n🎉 Proceso de migración completado")
  } catch (error) {
    console.error("❌ Error al aplicar migraciones:", error)
    process.exit(1)
  }
}

deployMigrations()
