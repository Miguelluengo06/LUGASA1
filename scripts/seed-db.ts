import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

async function seed() {
  console.log("🌱 Iniciando la siembra de datos...")

  try {
    // Crear un usuario administrador
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@lugasa.es" },
      update: {},
      create: {
        email: "admin@lugasa.es",
        name: "Administrador",
        password: adminPassword,
        role: "ADMIN",
      },
    })
    console.log(`✅ Usuario administrador creado: ${admin.email}`)

    // Crear un usuario normal
    const userPassword = await bcrypt.hash("user123", 10)
    const user = await prisma.user.upsert({
      where: { email: "usuario@lugasa.es" },
      update: {},
      create: {
        email: "usuario@lugasa.es",
        name: "Usuario Demo",
        password: userPassword,
        role: "USER",
      },
    })
    console.log(`✅ Usuario normal creado: ${user.email}`)

    // Crear planes
    const plans = [
      {
        name: "Plan Básico",
        description: "Ideal para uso personal",
        price: 9.99,
        interval: "month",
        features: ["Acceso a contenido básico", "Soporte por email", "Actualizaciones mensuales"],
      },
      {
        name: "Plan Profesional",
        description: "Perfecto para profesionales",
        price: 19.99,
        interval: "month",
        features: [
          "Todo lo del plan básico",
          "Acceso a contenido premium",
          "Soporte prioritario",
          "Actualizaciones semanales",
        ],
      },
      {
        name: "Plan Empresarial",
        description: "Para equipos y empresas",
        price: 49.99,
        interval: "month",
        features: [
          "Todo lo del plan profesional",
          "Acceso a contenido exclusivo",
          "Soporte 24/7",
          "Actualizaciones diarias",
          "API de integración",
        ],
      },
    ]

    for (const planData of plans) {
      const plan = await prisma.plan.upsert({
        where: { id: planData.name.toLowerCase().replace(/\s+/g, "-") },
        update: planData,
        create: {
          id: planData.name.toLowerCase().replace(/\s+/g, "-"),
          ...planData,
        },
      })
      console.log(`✅ Plan creado: ${plan.name}`)
    }

    // Crear una suscripción para el usuario demo
    const basicPlan = await prisma.plan.findFirst({
      where: { name: "Plan Básico" },
    })

    if (basicPlan) {
      const now = new Date()
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const subscription = await prisma.subscription.upsert({
        where: { id: "demo-subscription" },
        update: {},
        create: {
          id: "demo-subscription",
          userId: user.id,
          planId: basicPlan.id,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: nextMonth,
        },
      })
      console.log(`✅ Suscripción creada para ${user.email}`)

      // Crear una factura para la suscripción
      const invoice = await prisma.invoice.upsert({
        where: { invoiceNumber: "INV-2023-001" },
        update: {},
        create: {
          userId: user.id,
          subscriptionId: subscription.id,
          amount: basicPlan.price,
          status: "PAID",
          paidAt: now,
          dueDate: now,
          invoiceNumber: "INV-2023-001",
        },
      })
      console.log(`✅ Factura creada: ${invoice.invoiceNumber}`)
    }

    // Crear cupones de ejemplo
    const coupons = [
      {
        code: "WELCOME10",
        description: "10% de descuento para nuevos usuarios",
        discountType: "PERCENTAGE",
        discountAmount: 10,
        maxUses: 100,
      },
      {
        code: "SUMMER2023",
        description: "5€ de descuento en cualquier plan",
        discountType: "FIXED",
        discountAmount: 5,
        expiresAt: new Date("2023-09-30"),
      },
    ]

    for (const couponData of coupons) {
      const coupon = await prisma.coupon.upsert({
        where: { code: couponData.code },
        update: couponData,
        create: couponData,
      })
      console.log(`✅ Cupón creado: ${coupon.code}`)
    }

    console.log("🎉 Datos sembrados correctamente")
  } catch (error) {
    console.error("❌ Error al sembrar datos:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
