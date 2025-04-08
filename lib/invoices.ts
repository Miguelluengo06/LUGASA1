import { prisma } from "@/lib/prisma"

export const getUserInvoices = async (userId: string) => {
  try {
    return await prisma.invoice.findMany({
      where: { userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Error getting user invoices:", error)
    return []
  }
}

export const getInvoiceById = async (id: string) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    if (!invoice) {
      throw new Error(`Invoice with ID ${id} not found`)
    }

    return invoice
  } catch (error) {
    console.error("Error getting invoice by id:", error)
    throw new Error("Error al obtener la factura")
  }
}

export const createInvoice = async (data: {
  userId: string
  subscriptionId: string
  amount: number
  status: string
  dueDate: Date
  invoiceNumber: string
  stripeInvoiceId?: string
}) => {
  try {
    return await prisma.invoice.create({
      data,
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw new Error("Error al crear la factura")
  }
}

export const updateInvoiceStatus = async (id: string, status: string, paidAt?: Date) => {
  try {
    const data: any = { status }
    if (paidAt) {
      data.paidAt = paidAt
    }

    return await prisma.invoice.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error("Error updating invoice status:", error)
    throw new Error("Error al actualizar el estado de la factura")
  }
}
