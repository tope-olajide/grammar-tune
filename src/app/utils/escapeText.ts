   // Escape all special characters that could interfere with GraphQL string syntax
const escapeText = (text: string) => {
    const escapedText = text.replace(/[\\"'`\n\r\t\b\f]/g, (char: string | number) => {
        const escapes: { [key: string]: string } = {
          '\\': '\\\\',
          '"': '\\"',
          "'": "\\'",
          '`': '\\`',
          '\n': '\\n',
          '\r': '\\r',
          '\t': '\\t',
          '\b': '\\b',
          '\f': '\\f'
        };
        return escapes[char];
    });
    return escapedText;
}

export default escapeText