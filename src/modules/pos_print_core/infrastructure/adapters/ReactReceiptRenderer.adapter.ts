import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import { ReceiptRenderer } from "@modules/pos_print_core/domain/repositories/pos_print_core.repository";
import { createElement } from "react";
import { Receipt } from "../views/Receipt";

export class ReactReceiptRenderer implements ReceiptRenderer {
    async renderSale(sale: unknown): Promise<string> {
        const html = renderToStaticMarkup(
            createElement(Receipt, { sale })
        )

        const finalHtml = `
      <html>
        <body style="margin:0;padding:0;">
          ${html}
        </body>
      </html>
    `;

        // Lanzar navegador headless
        const browser = await puppeteer.launch({
            headless: "shell"
        });

        const page = await browser.newPage();

        await page.setContent(finalHtml, { waitUntil: "networkidle0" });

        const buffer = await page.screenshot({
            type: "png",
            fullPage: true
        });

        await browser.close();

        // Guardar archivo en disco (misma ruta donde guardabas)
        const baseDir =
            process.platform === "win32"
                ? process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming")
                : process.platform === "darwin"
                    ? path.join(os.homedir(), "Library", "Application Support")
                    : process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");

        const appDataDir = path.join(baseDir, "app_data");
        await fs.mkdir(appDataDir, { recursive: true });

        const filePath = path.join(
            appDataDir,
            `receipt_${(sale as any).id}_${Date.now()}.png`
        );

        await fs.writeFile(filePath, buffer);

        return filePath;
    }
}
