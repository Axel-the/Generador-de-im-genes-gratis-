'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Download, Trash2, Plus, Image as ImageIcon, MessageSquare, Sparkles, Palette, Zap, Settings, LogOut, Home } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: string
  createdAt: string
}

interface GeneratedImage {
  id: string
  prompt: string
  imageData: string
  size: string
  createdAt: string
  originalPrompt?: string
  model?: string
  style?: string
  resolution?: string
}

export default function SimpleDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('hd')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [selectedResolution, setSelectedResolution] = useState('1024x1024')
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      content: '¡Bienvenido al generador de imágenes con IA! Describe lo que quieres crear y yo lo generaré para ti.',
      role: 'assistant',
      createdAt: new Date().toISOString()
    }])
  }, [])

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          model: selectedModel, 
          style: selectedStyle,
          resolution: selectedResolution
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      // Add image to the gallery
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: data.prompt,
        imageData: data.image,
        size: data.size,
        originalPrompt: data.originalPrompt,
        model: data.model,
        style: data.style,
        resolution: selectedResolution,
        createdAt: new Date().toISOString()
      }
      
      setImages(prev => [newImage, ...prev])
      setPrompt('')

      toast({
        title: "✨ Imagen generada",
        description: "La imagen ha sido generada exitosamente con alta calidad.",
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo generar la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = (imageData: string, prompt: string) => {
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${imageData}`
    link.download = `ai-generated-${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "📥 Descarga completada",
      description: "La imagen se ha descargado en alta calidad.",
    })
  }

  const deleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    toast({
      title: "🗑️ Imagen eliminada",
      description: "La imagen ha sido eliminada del historial.",
    })
  }

  const handleExit = () => {
    // Clear all data
    setMessages([])
    setImages([])
    setPrompt('')
    // Redirect to home
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">AI Generator</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Sesión Temporal
            </Badge>
            <p className="text-xs text-muted-foreground">
              Los datos se borrarán al cerrar
            </p>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium mb-3">Imágenes Generadas ({images.length})</h3>
          <ScrollArea className="h-[calc(100vh-200px)] scrollbar-thin">
            <div className="space-y-2">
              {images.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay imágenes aún
                </p>
              ) : (
                images.map((image) => (
                  <Card key={image.id} className="p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                          <img 
                            src={`data:image/png;base64,${image.imageData}`} 
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{image.prompt}</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img 
                            src={`data:image/png;base64,${image.imageData}`} 
                            alt={image.prompt}
                            className="max-w-full max-h-[70vh] object-contain"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-muted-foreground">
                            {image.resolution} • {image.style} • {image.model}
                          </div>
                          <Button 
                            onClick={() => downloadImage(image.imageData, image.prompt)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar imagen
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {image.resolution}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadImage(image.imageData, image.prompt)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Generador de Imágenes IA
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sesión temporal • {images.length} imágenes generadas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Activo
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6 scrollbar-thin">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">U</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    {message.role === 'user' ? 'Tú' : 'IA'}
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Show loading card when generating */}
            {isLoading && (
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Generando imagen...</p>
                    <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 border-t bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-3">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">HD - Alta Calidad</SelectItem>
                  <SelectItem value="ultra">Ultra - Máxima Calidad</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realista</SelectItem>
                  <SelectItem value="cinematic">Cinematográfico</SelectItem>
                  <SelectItem value="artistic">Artístico</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedResolution} onValueChange={setSelectedResolution}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512x512">512×512</SelectItem>
                  <SelectItem value="1024x1024">1024×1024</SelectItem>
                  <SelectItem value="1024x1792">1024×1792</SelectItem>
                  <SelectItem value="1792x1024">1792×1024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Textarea
                placeholder="Describe la imagen que quieres generar... Ej: Un gato astronauta en la luna, estilo arte digital"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    generateImage()
                  }
                }}
              />
              <Button 
                onClick={generateImage}
                disabled={isLoading || !prompt.trim()}
                className="gradient-bg hover:opacity-90 transition-opacity px-8"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Generar'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}