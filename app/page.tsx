import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Zap, Shield, BarChart4, CreditCard } from "lucide-react"
import { Footer } from "@/components/footer"

// Datos de ejemplo para los planes
const plans = [
  {
    id: "basic",
    name: "Plan Básico",
    description: "Ideal para uso personal",
    price: 9.99,
    features: ["Acceso a contenido básico", "Soporte por email", "Actualizaciones mensuales"],
    popular: false,
  },
  {
    id: "pro",
    name: "Plan Profesional",
    description: "Perfecto para profesionales",
    price: 19.99,
    features: [
      "Todo lo del plan básico",
      "Acceso a contenido premium",
      "Soporte prioritario",
      "Actualizaciones semanales",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Plan Empresarial",
    description: "Para equipos y empresas",
    price: 49.99,
    features: [
      "Todo lo del plan profesional",
      "Acceso a contenido exclusivo",
      "Soporte 24/7",
      "Actualizaciones diarias",
      "API de integración",
    ],
    popular: false,
  },
]

// Datos para las características
const features = [
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Acceso ilimitado",
    description: "Accede a todo nuestro contenido sin restricciones, cuando y donde quieras.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Soporte premium",
    description: "Nuestro equipo de soporte está disponible para ayudarte con cualquier problema o duda.",
  },
  {
    icon: <BarChart4 className="h-10 w-10 text-primary" />,
    title: "Analíticas detalladas",
    description: "Obtén información valiosa sobre el uso de tus servicios con nuestras analíticas avanzadas.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: "Facturación transparente",
    description: "Sistema de facturación claro y sin sorpresas. Accede a tus facturas en cualquier momento.",
  },
]

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 hero-pattern">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="gradient-text">Lugasa</span> - Servicios de suscripción para todos
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Descubre nuestros planes de suscripción diseñados para satisfacer tus necesidades. Elige el plan que
                mejor se adapte a ti.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/services">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90">
                  Ver servicios
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contactar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Características <span className="gradient-text">principales</span>
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Nuestros servicios de suscripción ofrecen una amplia gama de características diseñadas para mejorar tu
                experiencia.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Nuestros <span className="gradient-text">planes</span>
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen actualizaciones y
                soporte.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col ${
                  plan.popular ? "border-primary shadow-lg" : ""
                } relative overflow-hidden hover:shadow-xl transition-shadow duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 gradient-bg text-white px-3 py-1 text-xs font-medium">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground"> / mes</span>
                  </div>
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={`/services/${plan.id}`} className="w-full">
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className={`w-full ${plan.popular ? "gradient-bg text-white hover:opacity-90" : ""}`}
                    >
                      Elegir plan
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                ¿Listo para <span className="gradient-text">empezar</span>?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Únete a miles de usuarios satisfechos y comienza a disfrutar de nuestros servicios hoy mismo.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90">
                  Registrarse ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Más información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
