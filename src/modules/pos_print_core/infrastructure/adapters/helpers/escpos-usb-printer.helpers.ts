

// Utilidades para tabla en impresora POS
function pad(text, length, align = "left") {
  text = String(text);

  if (text.length > length) {
    return text.slice(0, length);
  }

  const spaces = length - text.length;

  if (align === "right") return " ".repeat(spaces) + text;
  if (align === "center") {
    const left = Math.floor(spaces / 2);
    const right = spaces - left;
    return " ".repeat(left) + text + " ".repeat(right);
  }

  return text + " ".repeat(spaces);
}




// Totales tipo tabla: [LABEL] [VALOR]
export function renderTotalRow(label, value) {
  // columnas: 22 | 10 = 32 chars
  const c1 = pad(label, 22, "right");
  const c2 = pad(value, 10, "right");
  return `${c1}${c2}`;
}


// Render de línea producto: [CANT] [NOMBRE] [SUBTOTAL]
export function renderProductRow(qty, name, subtotal) {
  // columnas: 4 | 18 | 10 = 32 chars
  const c1 = pad(qty, 4, "left");
  const c2 = pad(name, 18, "left");
  const c3 = pad(subtotal, 10, "right");
  return `${c1}${c2}${c3}`;
}

// Render de extra:   [+ Nombre] [subtotal]
export function renderExtraRow(name, subtotal) {
  // columnas: 6 | 16 | 10 = 32 chars  
  // (dejamos 6 para sangría y "+")
  const c1 = pad("  +", 6);
  const c2 = pad(name, 16);
  const c3 = pad(subtotal, 10, "right");
  return `${c1}${c2}${c3}`;
}

export function wrapText(text: string, maxChars: number = 32): string[] {
  const lines: string[] = []
  let current = text

  while (current.length > maxChars) {
    lines.push(current.slice(0, maxChars))
    current = current.slice(maxChars)
  }
  if (current.length > 0) lines.push(current)

  return lines
}



export function wrapNameColumn(text: string, maxChars = 18): string[] {
  const lines: string[] = []
  let current = text

  while (current.length > maxChars) {
    lines.push(current.slice(0, maxChars))
    current = current.slice(maxChars)
  }

  if (current.length > 0) lines.push(current)

  return lines
}

export function separatorLine(width = 32) {
  return "-".repeat(width);
}