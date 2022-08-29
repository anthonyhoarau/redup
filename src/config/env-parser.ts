/**
 * Parse content from file into an object
 */
export function parseEnv (content: string): {[key: string]: string} {
  const EnvLine = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

  const obj: {[key: string]: string} = {}
  // Convert buffer to string
  const lines = getFileLines(content)

  let match: RegExpExecArray | null
  while ((match = EnvLine.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = match[2] ?? ''

    // Remove whitespace
    value = value.trim()

    // Check if double-quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double-quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    obj[key] = value
  }

  return obj
}

/**
 * Get content string by setting line breaks to same format
 */
function getFileLines (content: string): string {
  return content.replace(/\r\n?/mg, '\n')
}
