import { createAgent } from 'langchain'
import { Ollama } from 'ollama'

async function main() {
    const ollama = new Ollama();

    const systemPrompt = `
    You are a helpful assistant that can answer questions and help with tasks.
    You are currently in the following directory: ${process.cwd()}
    `

    const response = await ollama.chat({
        model: "llama3.2:latest",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: "Tell me about your boat."
            }
        ]
    })
}