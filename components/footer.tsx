import Link from "next/link"
import { Logo } from "@/components/logo"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Soluciones de suscripción innovadoras para tu negocio. Simplifica la gestión de tus servicios y mejora la
              experiencia de tus clientes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/subscription" className="text-muted-foreground hover:text-primary">
                  Gestión de Suscripciones
                </Link>
              </li>
              <li>
                <Link href="/services/billing" className="text-muted-foreground hover:text-primary">
                  Facturación Automática
                </Link>
              </li>
              <li>
                <Link href="/services/analytics" className="text-muted-foreground hover:text-primary">
                  Análisis y Reportes
                </Link>
              </li>
              <li>
                <Link href="/services/support" className="text-muted-foreground hover:text-primary">
                  Soporte al Cliente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@lugasa.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Calle Principal 123, Madrid</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Lugasa. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-primary">
                Términos de servicio
              </Link>
              <Link href="/privacy" className="hover:text-primary">
                Política de privacidad
              </Link>
              <Link href="/cookies" className="hover:text-primary">
                Política de cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
