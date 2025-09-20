'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Loader2, Download, Trash2, Plus, Image as ImageIcon, MessageSquare, History, Sparkles, Palette, Zap, Settings, LogOut, User, Home } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ImageGenerationCard from '@/components/image-generation-card'

interface Chat {
  id: string
  title: string
  createdAt: string
  messages: Message[]
  images: GeneratedImage[]
}

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
}

export default function Dashboard() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [selectedModel, setSelectedModel] = useState('hd')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [showSettings, setShowSettings] = useState(false)
  const { toast } = useToast()

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('ai-image-chats')
    if (savedChats) {
      setChats(JSON.parse(savedChats))
      if (JSON.parse(savedChats).length > 0) {
        setCurrentChat(JSON.parse(savedChats)[0])
      }
    }
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-image-chats', JSON.stringify(chats))
  }, [chats])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      createdAt: new Date().toISOString(),
      messages: [],
      images: []
    }
    setChats([newChat, ...chats])
    setCurrentChat(newChat)
    setPrompt('')
  }

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat)
  }

  const generateImage = async () => {
    if (!prompt.trim() || !currentChat) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          model: selectedModel, 
          style: selectedStyle 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      // Update current chat with new message and image
      const updatedChat = {
        ...currentChat,
        messages: [
          ...currentChat.messages,
          {
            id: Date.now().toString(),
            content: prompt,
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ],
        images: [
          ...currentChat.images,
          {
            id: Date.now().toString(),
            prompt: data.prompt,
            imageData: data.image,
            size: data.size,
            originalPrompt: data.originalPrompt,
            model: data.model,
            style: data.style,
            createdAt: new Date().toISOString()
          }
        ]
      }

      // Update chats array
      const updatedChats = chats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
      setChats(updatedChats)
      setCurrentChat(updatedChat)
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
      title: "📥 Descarga iniciada",
      description: "La imagen se está descargando.",
    })
  }

  const deleteImage = (imageId: string) => {
    if (!currentChat) return

    const updatedChat = {
      ...currentChat,
      images: currentChat.images.filter(img => img.id !== imageId)
    }

    const updatedChats = chats.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    )
    setChats(updatedChats)
    setCurrentChat(updatedChat)

    toast({
      title: "🗑️ Imagen eliminada",
      description: "La imagen ha sido eliminada del historial.",
    })
  }

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    
    if (currentChat?.id === chatId) {
      setCurrentChat(updatedChats[0] || null)
    }

    toast({
      title: "🗑️ Chat eliminado",
      description: "El chat ha sido eliminado del historial.",
    })
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('ai-image-chats')
    // Redirect to home
    window.location.href = '/'
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={createNewChat} className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Chat
          </Button>
        </div>
        
        {/* Chat List */}
        <Separator />
        <ScrollArea className="flex-1 p-4 scrollbar-thin">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between group">
                <Button
                  variant={currentChat?.id === chat.id ? "default" : "ghost"}
                  className="flex-1 justify-start h-auto p-3"
                  onClick={() => selectChat(chat)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <span className="block truncate text-sm font-medium">{chat.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {chat.images.length} imágenes
                      </span>
                    </div>
                  </div>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminar chat</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que quieres eliminar este chat? Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteChat(chat.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    {currentChat.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentChat.images.length} imágenes generadas • {currentChat.messages.length} mensajes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Activo
                  </Badge>
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configuración de Generación</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Modelo</label>
                          <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hd">HD - Alta Calidad</SelectItem>
                              <SelectItem value="ultra">Ultra - Máxima Calidad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Estilo</label>
                          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realistic">Realista</SelectItem>
                              <SelectItem value="cinematic">Cinematográfico</SelectItem>
                              <SelectItem value="artistic">Artístico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Messages and Images */}
            <ScrollArea className="flex-1 p-6 scrollbar-thin">
              <div className="space-y-6 max-w-4xl mx-auto">
                {currentChat.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-4 chat-bubble">
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
                  <ImageGenerationCard 
                    isLoading={true}
                    prompt={prompt}
                  />
                )}

                {currentChat.images.map((image) => (
                  <ImageGenerationCard
                    key={image.id}
                    image={image}
                    onDownload={downloadImage}
                    onDelete={deleteImage}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t bg-card/50 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
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
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={generateImage} 
                    disabled={isLoading || !prompt.trim()}
                    size="lg"
                    className="gradient-bg hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    <span className="ml-2">Generar</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Presiona Enter para generar, Shift+Enter para nueva línea
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedModel === 'hd' ? 'HD' : 'Ultra'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {selectedStyle}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 mx-auto gradient-bg rounded-full flex items-center justify-center">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Bienvenido a tu Espacio</h2>
              <p className="text-muted-foreground text-lg">
                Crea tu primer chat para comenzar a generar imágenes increíbles con inteligencia artificial.
              </p>
              <Button onClick={createNewChat} size="lg" className="gradient-bg hover:opacity-90 transition-opacity">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}