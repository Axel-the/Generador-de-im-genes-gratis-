'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Download, Trash2, Image as ImageIcon } from 'lucide-react'
import LoadingAnimation from './loading-animation'

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

interface ImageGenerationCardProps {
  image?: GeneratedImage
  isLoading?: boolean
  prompt?: string
  onDownload?: (imageData: string, prompt: string) => void
  onDelete?: (imageId: string) => void
}

export default function ImageGenerationCard({ 
  image, 
  isLoading = false, 
  prompt = '', 
  onDownload, 
  onDelete 
}: ImageGenerationCardProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)

  if (isLoading) {
    return (
      <Card className="overflow-hidden glass-effect">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            Generando Imagen...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingAnimation prompt={prompt} />
        </CardContent>
      </Card>
    )
  }

  if (!image) {
    return null
  }

  return (
    <Card className="overflow-hidden glass-effect">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Imagen Generada
          </CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Vista previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Vista previa de la imagen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={`data:image/png;base64,${image.imageData}`}
                    alt={image.prompt}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Prompt original:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {image.originalPrompt || image.prompt}
                      </p>
                    </div>
                    {image.originalPrompt && (
                      <div>
                        <p className="text-sm font-medium mb-2">Prompt mejorado:</p>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {image.prompt}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {image.model && (
                        <Badge variant="secondary" className="text-xs">
                          Modelo: {image.model}
                        </Badge>
                      )}
                      {image.style && (
                        <Badge variant="outline" className="text-xs">
                          Estilo: {image.style}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onDownload?.(image.imageData, image.prompt)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar imagen</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete?.(image.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <img
            src={`data:image/png;base64,${image.imageData}`}
            alt={image.prompt}
            className="w-full max-w-md rounded-lg cursor-pointer image-hover"
            onClick={() => setSelectedImage(image)}
          />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{image.originalPrompt || image.prompt}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {image.size}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {new Date(image.createdAt).toLocaleDateString()}
              </Badge>
              {image.model && (
                <Badge variant="outline" className="text-xs">
                  {image.model}
                </Badge>
              )}
              {image.style && (
                <Badge variant="secondary" className="text-xs">
                  {image.style}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}