'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Sparkles, ArrowRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Platform() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo y título */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">AI Image Generator Platform</h1>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Bienvenido a la Plataforma
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Esta es la plataforma de generación de imágenes con IA. 
              Aquí podrás crear imágenes increíbles usando inteligencia artificial.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Generador de Imágenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accede al dashboard completo para generar imágenes con IA, gestionar tus creaciones y más.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Características
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Generación de imágenes en tiempo real</li>
                    <li>• Múltiples estilos artísticos</li>
                    <li>• Historial de creaciones</li>
                    <li>• Descarga en alta calidad</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gradient-bg hover:opacity-90 transition-opacity"
                onClick={() => router.push('/simple-dashboard')}
              >
                Ir al Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/')}
              >
                Volver al Inicio
                <Home className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}