import { execSync } from "child_process"
import * as readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askMigrationName(): Promise<string> {
  return new Promise((resolve) => {
    rl.question("📝 Nombre para la migración (use_snake_case): ", (answer) => {
      resolve(answer.trim())
    })
  })
}

async function createMigration() {
  console.log("🚀 Creando una nueva migración para el proyecto Lugasa...")

  try {
    // Solicitar nombre para la migración
    const migrationName = await askMigrationName()
    rl.close()

    if (!migrationName) {
      console.log("❌ Debes proporcionar un nombre para la migración")
      process.exit(1)
    }

    // Validar formato del nombre (snake_case)
    if (!/^[a-z0-9_]+$/.test(migrationName)) {
      console.log("❌ El nombre debe estar en snake_case (solo minúsculas, números y guiones bajos)")
      process.exit(1)
    }

    // Crear la migración
    console.log(`📝 Creando migración "${migrationName}"...`)
    execSync(`npx prisma migrate dev --name ${migrationName}`, { stdio: "inherit" })

    console.log("✅ Migración creada correctamente")
    console.log("📊 Puedes ver la nueva migración en la carpeta 'prisma/migrations'")

    // Verificar el estado de las migraciones
    console.log("🔍 Verificando el estado de las migraciones...")
    execSync("npx prisma migrate status", { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Error al crear la migración:", error)
    process.exit(1)
  }
}

createMigration()
