import { NextRequest, NextResponse } from 'next/server'
import { Ollama } from 'ollama'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model = 'llama3.2:latest' } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      )
    }

    // Define your expected response schema
    const responseSchema = {
      type: 'object',
      properties: {
        example: {
          type: 'string',
          description: 'A well-crafted example that demonstrates the concept',
        },
        explanation: {
          type: 'string',
          description:
            'A brief explanation of how the example demonstrates the concept',
        },
      },
      required: ['example', 'explanation'],
    }

    const ollama = new Ollama()

    const systemPrompt = `
        You are an educational assistant specialized in providing clear, focused examples for learning.

        ## Your Role
        - Provide ONE well-crafted example per request
        - Tailor examples to the specified grade level (default: Grade 7)
        - Keep examples simple, clear, and easy to understand
        - Focus on demonstrating the core concept effectively

        ## Example Response Format
        {
          "example": "Roses are red\\nViolets are blue\\nThis is a poem\\nWith a simple view",
          "explanation": "This example demonstrates a simple AABB rhyme scheme where lines 1-2 rhyme and lines 3-4 rhyme. It's structured in four lines (a quatrain) with a clear rhythmic pattern."
        }


        ## Example Guidelines
        1. **One Example Only**: Provide a single, complete example that best illustrates the topic
        2. **Age-Appropriate**: Match complexity to the student's grade level
        3. **Clear & Concise**: Avoid unnecessary complexity or multiple variations
        4. **Educational Value**: Ensure the example teaches the concept effectively
        5. **Self-Contained**: Make examples complete and understandable on their own

        Remember: Quality over quantity. One excellent example is better than multiple confusing ones.
    `

    const response = await ollama.chat({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      // format: 'json', // This tells Ollama to output JSON
      // Alternatively, you can use:
      format: responseSchema, // Pass the schema directly (supported in newer versions)
    })

    // Parse and validate the JSON response
    const parsedResponse = JSON.parse(response.message.content)

    // Optional: Validate with Zod
    const responseFormat = z.object({
      example: z.string(),
      explanation: z.string(),
    })

    const validatedResponse = responseFormat.parse(parsedResponse)

    return NextResponse.json({
      response: validatedResponse,
      model: response.model,
    })
  } catch (error) {
    console.error('Error in agent API:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
