// tabla-pos.ts
type Align = "left" | "right" | "center";
export type ColDef = { width?: number; min?: number; align?: Align; name?: string }; 
// width opcional: si no suman, serán normalizados
export type Row = Array<string | number | null>;

////////////////////////////////////////////////////////////////////////////////
// util: contar "caracteres visuales" (grapheme-ish, usando Array.from)
function chars(text: string): string[] {
  return Array.from(text); // buena aproximación para acentos; evita .length directo
}
function visibleLength(text: string) {
  return chars(String(text)).length;
}
function truncateTo(text: string, max: number) {
  const a = chars(text);
  if (a.length <= max) return a.join("");
  return a.slice(0, max).join("");
}

////////////////////////////////////////////////////////////////////////////////
// wrap simple por número máximo de caracteres (grapheme aware)
function wrapText(text: string, maxChars: number): string[] {
  const out: string[] = [];
  let arr = chars(String(text));
  while (arr.length > 0) {
    out.push(arr.slice(0, maxChars).join(""));
    arr = arr.slice(maxChars);
  }
  if (out.length === 0) out.push("");
  return out;
}

////////////////////////////////////////////////////////////////////////////////
// pad con alineación usando graphemes
function pad(text: string, width: number, align: Align = "left") {
  const s = String(text);
  const len = visibleLength(s);
  if (len > width) return truncateTo(s, width);
  const spaces = width - len;
  if (align === "right") return " ".repeat(spaces) + s;
  if (align === "center") {
    const left = Math.floor(spaces / 2);
    const right = spaces - left;
    return " ".repeat(left) + s + " ".repeat(right);
  }
  // left
  return s + " ".repeat(spaces);
}

////////////////////////////////////////////////////////////////////////////////
// Normaliza anchos de columna para que encajen en totalWidth considerando gap
function normalizeWidths(cols: ColDef[], totalWidth: number, gap = 1): number[] {
  const n = cols.length;
  const totalGaps = Math.max(0, n - 1) * gap;
  const available = totalWidth - totalGaps;
  if (available < n) throw new Error("totalWidth muy pequeño para columnas y gaps");

  // toma widths dados o usa min/default
  const given = cols.map(c => (typeof c.width === "number" ? Math.max(1, Math.floor(c.width)) : -1));
  const mins = cols.map(c => (typeof c.min === "number" ? Math.max(1, Math.floor(c.min!)) : 1));

  // suma de los anchos dados (solo los positivos)
  const sumGiven = given.filter(w => w > 0).reduce((a, b) => a + b, 0);
  const countFlexible = given.filter(w => w < 0).length;

  let final: number[] = new Array(n).fill(0);

  if (sumGiven > 0 && sumGiven <= available && countFlexible === 0) {
    // todos los anchos dados y caben: repartimos diferencia proporcionalmente (opcionalmente)
    final = given.map(w => w);
  } else if (sumGiven === 0 && countFlexible === n) {
    // ningún ancho dado: repartir equitativamente
    const base = Math.floor(available / n);
    const rem = available - base * n;
    for (let i = 0; i < n; i++) final[i] = base + (i < rem ? 1 : 0);
  } else {
    // hay mezcla: asignamos los dados, y repartimos el resto entre flexibles
    let remain = available - Math.max(0, sumGiven);
    // si remain < sum(mins of flexibles) ajustamos reduciendo proporcionalmente
    if (remain < countFlexible) {
      // tenemos que reducir anchos dados proporcionalmente hasta que haya espacio
      // estrategia simple: escala todos los anchos a available (respetando min 1)
      const givenIndices = given.map((w, i) => ({ w, i })).filter(x => x.w > 0);
      const totalGiven = givenIndices.reduce((a, b) => a + b.w, 0);
      if (totalGiven === 0) throw new Error("Imposible normalizar anchos");
      for (const g of givenIndices) {
        final[g.i] = Math.max(1, Math.floor((g.w / totalGiven) * available));
      }
      // si quedó remanente por redondeo, reparte uno a uno
      let used = final.reduce((a, b) => a + b, 0);
      let k = 0;
      while (used < available) { final[k % n]++; used++; k++; }
    } else {
      // asigna anchos dados
      for (let i = 0; i < n; i++) {
        final[i] = given[i] > 0 ? given[i] : mins[i];
      }
      remain = available - final.reduce((a, b) => a + b, 0);
      // repartir remain entre flexibles
      const flexIdx = final.map((w, i) => ({ w, i })).filter(x => given[x.i] < 0);
      if (flexIdx.length === 0 && remain > 0) {
        // repartir equitativamente entre todos
        const base = Math.floor(remain / n);
        for (let i = 0; i < n; i++) final[i] += base;
        let extra = remain - base * n;
        for (let i = 0; extra > 0; i = (i + 1) % n, extra--) final[i]++;
      } else {
        const base = Math.floor(remain / flexIdx.length);
        for (const f of flexIdx) final[f.i] += base;
        let extra = remain - base * flexIdx.length;
        for (let j = 0; extra > 0; j = (j + 1) % flexIdx.length, extra--) final[flexIdx[j].i]++;
      }
    }
  }

  // última verificación / ajuste para que sum(final) == available
  let used = final.reduce((a, b) => a + b, 0);
  let i = 0;
  while (used < available) { final[i % n]++; used++; i++; }
  while (used > available) { final[i % n] = Math.max(1, final[i % n] - 1); used = final.reduce((a, b) => a + b, 0); i++; }

  return final;
}

////////////////////////////////////////////////////////////////////////////////
// Construir filas (respetando wrap y gap)
function buildRowForPrint(cols: ColDef[], widths: number[], gap: number, values: Row): string[] {
  const n = cols.length;
  // wrap each cell to its width
  const wrapped: string[][] = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < n; i++) {
    const v = values[i] == null ? "" : String(values[i]);
    wrapped[i] = wrapText(v, widths[i]);
  }
  const maxLines = Math.max(...wrapped.map(w => (w.length === 0 ? 1 : w.length)));
  const lines: string[] = [];
  for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
    const parts: string[] = [];
    for (let colIdx = 0; colIdx < n; colIdx++) {
      const text = wrapped[colIdx][lineIdx] ?? ""; // si no hay línea, vacío
      const align = cols[colIdx].align ?? "left";
      parts.push(pad(text, widths[colIdx], align));
    }
    lines.push(parts.join(" ".repeat(gap)));
  }
  return lines;
}

////////////////////////////////////////////////////////////////////////////////
// tabla completa
export function renderTable(params: {
  cols: ColDef[];
  totalWidth: number;
  gap?: number;
  rows: Row[];
}) {
  const gap = params.gap ?? 1;
  const cols = params.cols;
  const widths = normalizeWidths(cols, params.totalWidth, gap);
  const outLines: string[] = [];
  for (const r of params.rows) {
    const block = buildRowForPrint(cols, widths, gap, r);
    outLines.push(...block);
  }
  return outLines.join("\n");
}

/*
Salida esperada (aprox):

CANT PRODUCTO           SUBTOTAL
2    Jugo de Naranja      12.50
1    Sándwich de jamón, 
     queso, lechuga, to   25.00
     mate y mayonesa es
     pecial
     +Azúcar morena        0.50
     TOTAL                37.00

Observa que:
- Los nombres largos se envuelven en la columna PRODUCTO.
- La columna SUBTOTAL está alineada a la derecha.
- Hay 1 espacio (gap) entre columnas; puedes cambiarlo.
- Si quieres que la fila de "extra" no muestre CANT ni SUBTOTAL en líneas secundarias, esto ya ocurre: sólo aparece el texto de la columna PRODUCTO en las líneas de wrap.
*/

export function separatorLine(width = 32) { return "-".repeat(width); }