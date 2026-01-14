'use server'

export async function generateExample(message: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL ||
      'http://localhost:3000'

    const url = baseUrl.startsWith('http')
      ? `${baseUrl}/api/agent`
      : `https://${baseUrl}/api/agent`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to generate example')
    }

    const data = await response.json()
    return {
      success: true,
      data: data.response,
    }
  } catch (error) {
    console.error('Error in generateExample action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
