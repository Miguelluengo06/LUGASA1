import { NextResponse } from "next/server"
import { getUserInvoices } from "@/lib/invoices"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()

    // Si no hay sesión, devolver un error de autenticación
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    const invoices = await getUserInvoices(userId)

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error al obtener facturas:", error)
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
  }
}
