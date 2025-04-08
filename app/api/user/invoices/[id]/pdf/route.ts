import { NextResponse } from "next/server"
import { getInvoiceById } from "@/lib/invoices"
import { auth } from "@/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    // Si no hay sesión, devolver un error de autenticación
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const invoice = await getInvoiceById(params.id)

    // Verificar que la factura pertenece al usuario o es admin
    if (invoice.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Formatear fechas
    const formatDate = (date: Date | null) => {
      if (!date) return "N/A"
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    }

    // Crear un HTML para la factura
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Factura ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .invoice-details {
              margin-bottom: 30px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 10px;
            }
            .invoice-table th {
              background-color: #f2f2f2;
            }
            .invoice-footer {
              text-align: center;
              margin-top: 50px;
              font-size: 12px;
            }
            .text-right {
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1>FACTURA</h1>
            <h2>${invoice.invoiceNumber}</h2>
          </div>
          
          <div class="invoice-details">
            <p><strong>Fecha:</strong> ${formatDate(invoice.createdAt)}</p>
            <p><strong>Cliente:</strong> ${invoice.user?.name || "Cliente"}</p>
            <p><strong>Email:</strong> ${invoice.user?.email || "email@ejemplo.com"}</p>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.subscription?.plan?.name || "Plan"} - ${invoice.subscription?.plan?.description || "Suscripción"}</td>
                <td class="text-right">${invoice.amount.toFixed(2)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th class="text-right">${invoice.amount.toFixed(2)}</th>
              </tr>
            </tfoot>
          </table>
          
          <div>
            <p><strong>Estado:</strong> ${
              invoice.status === "PAID"
                ? "Pagada"
                : invoice.status === "PENDING"
                  ? "Pendiente"
                  : invoice.status === "OVERDUE"
                    ? "Vencida"
                    : "Cancelada"
            }</p>
            ${invoice.paidAt ? `<p><strong>Fecha de pago:</strong> ${formatDate(invoice.paidAt)}</p>` : ""}
          </div>
          
          <div class="invoice-footer">
            <p>Gracias por su confianza en Lugasa</p>
          </div>
        </body>
      </html>
    `

    // Devolver el HTML como respuesta
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="factura-${invoice.invoiceNumber}.html"`,
      },
    })
  } catch (error) {
    console.error("Error al generar factura:", error)
    return NextResponse.json({ error: "Error al generar factura" }, { status: 500 })
  }
}
