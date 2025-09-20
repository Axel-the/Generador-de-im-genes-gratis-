import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'hd', style = 'realistic', resolution = '1024x1024' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Enhanced prompt for better quality and realism
    const enhancedPrompt = enhancePromptForRealism(prompt, style)

    let size = resolution
    let quality = 'hd'

    // Validate and adjust size if needed
    const validSizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']
    if (!validSizes.includes(size)) {
      size = '1024x1024' // Default size
    }

    // Adjust quality based on model selection
    if (model === 'ultra') {
      quality = 'hd' // Ultra model still uses HD quality
    }

    const response = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size: size,
      // Additional parameters for better quality if supported
      ...(quality === 'hd' && { quality: 'hd' })
    })

    const imageBase64 = response.data[0].base64

    return NextResponse.json({
      image: imageBase64,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      model: model,
      style: style,
      size: size,
      resolution: resolution
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

function enhancePromptForRealism(prompt: string, style: string): string {
  const realismEnhancers = [
    'photorealistic',
    'highly detailed',
    'professional photography',
    'sharp focus',
    '8k resolution',
    'ultra realistic',
    'masterpiece',
    'best quality',
    'hyperdetailed'
  ]

  const styleEnhancers: { [key: string]: string[] } = {
    realistic: [
      'natural lighting',
      'realistic textures',
      'lifelike',
      'true to life',
      'photorealistic rendering'
    ],
    cinematic: [
      'cinematic lighting',
      'dramatic composition',
      'film grain',
      'professional color grading',
      'movie still'
    ],
    artistic: [
      'artistic composition',
      'creative interpretation',
      'stylized realism',
      'artistic vision',
      'creative photography'
    ]
  }

  let enhancedPrompt = prompt.toLowerCase()
  
  // Add realism enhancers
  realismEnhancers.forEach(enhancer => {
    if (!enhancedPrompt.includes(enhancer)) {
      enhancedPrompt += `, ${enhancer}`
    }
  })

  // Add style-specific enhancers
  const styleSpecificEnhancers = styleEnhancers[style] || styleEnhancers.realistic
  styleSpecificEnhancers.forEach(enhancer => {
    if (!enhancedPrompt.includes(enhancer.replace(' ', ''))) {
      enhancedPrompt += `, ${enhancer}`
    }
  })

  // Add technical photography terms
  const technicalTerms = [
    'DSLR photography',
    'professional camera',
    'high quality lens',
    'perfect composition',
    'award winning photography'
  ]

  technicalTerms.forEach(term => {
    if (!enhancedPrompt.includes(term.split(' ')[0])) {
      enhancedPrompt += `, ${term}`
    }
  })

  return enhancedPrompt
}