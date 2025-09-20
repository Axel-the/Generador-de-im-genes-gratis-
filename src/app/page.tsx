'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles, Zap, Image as ImageIcon, Users, Star, ArrowRight, Brain, Camera, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "IA de Última Generación",
      description: "Modelos de inteligencia artificial avanzados para generar imágenes de alta calidad"
    },
    {
      icon: Camera,
      title: "Fotorealismo Extremo",
      description: "Crea imágenes ultra realistas con detalles impresionantes"
    },
    {
      icon: Wand2,
      title: "Estilos Personalizados",
      description: "Elige entre realista, cinematográfico o artístico para tus creaciones"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  const handleGetStarted = () => {
    router.push('/platform')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo y Badge */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Powered by AI
              </Badge>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Generador Imágenes Gratis
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crea imágenes increíbles con IA de forma totalmente gratis. Sin registro, sin límites.
            </p>

            {/* Característica animada */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted/50 rounded-full backdrop-blur-sm">
                {(() => {
                  const FeatureIcon = features[currentFeature].icon
                  return (
                    <>
                      <FeatureIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{features[currentFeature].title}</span>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="gradient-bg hover:opacity-90 transition-opacity text-lg px-8 py-6"
                onClick={handleGetStarted}
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => {
                  const demo = document.getElementById('demo')
                  demo?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para crear imágenes impresionantes con inteligencia artificial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>IA Avanzada</CardTitle>
                <CardDescription>
                  Modelos de última generación para imágenes de alta calidad y realismo extremo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Múltiples Estilos</CardTitle>
                <CardDescription>
                  Realista, cinematográfico o artístico. Elige el estilo perfecto para tu visión
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Alta Resolución</CardTitle>
                <CardDescription>
                  Genera imágenes en 8K calidad con detalles impresionantes y nítidos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Historial Personal</CardTitle>
                <CardDescription>
                  Guarda todas tus creaciones en tu espacio personal de trabajo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Rápido y Eficiente</CardTitle>
                <CardDescription>
                  Genera imágenes en segundos con nuestra tecnología optimizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Fácil de Usar</CardTitle>
                <CardDescription>
                  Interfaz intuitiva diseñada para creadores de todos los niveles
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crear imágenes increíbles es tan simple como describir lo que imaginas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe tu Idea</h3>
              <p className="text-muted-foreground">
                Escribe una descripción detallada de la imagen que quieres crear
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Elige Estilo</h3>
              <p className="text-muted-foreground">
                Selecciona entre realista, cinematográfico o artístico
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Genera y Descarga</h3>
              <p className="text-muted-foreground">
                Obtén tu imagen en segundos y descárgala en alta calidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Crear Imágenes Gratis?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están creando imágenes increíbles con nuestra IA, totalmente gratis.
          </p>
          <Button 
            size="lg" 
            className="gradient-bg hover:opacity-90 transition-opacity text-lg px-8 py-6"
            onClick={handleGetStarted}
          >
            Comenzar Ahora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">AI Image Generator</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 AI Image Generator. Derechos reservados por Richard GitHub.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}