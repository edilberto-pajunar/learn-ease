// utils/wordCount.ts
export const wordCount = (text: string): number => {
    if (!text) return 0;
    // Split by whitespace and filter out empty strings
    return text.trim().split(/\s+/).length;
  };
  