#!/usr/bin/env node
/**
 * Sincroniza los assets de pdfjs-dist al directorio public/ de la app.
 * Corre en postinstall, predev y prebuild para que standardFontDataUrl
 * y cMapUrl resuelvan contra archivos locales.
 *
 * Sin esto, los PDFs que referencian las 14 fuentes estandar (Helvetica,
 * Times, etc.) sin embeberlas se renderizan como glifos vacios en pdfjs 3.x.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const pdfjsRoot = resolve(projectRoot, 'node_modules/pdfjs-dist')
const publicDir = resolve(projectRoot, 'public')

const targets = [
  { src: resolve(pdfjsRoot, 'cmaps'), dst: resolve(publicDir, 'pdf-cmaps') },
  { src: resolve(pdfjsRoot, 'standard_fonts'), dst: resolve(publicDir, 'pdf-fonts') },
]

if (!existsSync(pdfjsRoot)) {
  console.warn('[sync-pdfjs-assets] pdfjs-dist no esta instalado todavia — skip.')
  process.exit(0)
}

mkdirSync(publicDir, { recursive: true })

for (const { src, dst } of targets) {
  if (!existsSync(src)) {
    console.warn(`[sync-pdfjs-assets] ${src} no existe — skip.`)
    continue
  }
  rmSync(dst, { recursive: true, force: true })
  cpSync(src, dst, { recursive: true })
  console.log(`[sync-pdfjs-assets] ${src.replace(projectRoot, '.')}  ->  ${dst.replace(projectRoot, '.')}`)
}

// Worker de pdfjs-dist v5 que usa react-pdf (instalado como dependencia anidada)
const reactPdfWorkerSrc = resolve(projectRoot, 'node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
const reactPdfWorkerDst = resolve(publicDir, 'pdf.worker.react-pdf.min.mjs')
if (existsSync(reactPdfWorkerSrc)) {
  copyFileSync(reactPdfWorkerSrc, reactPdfWorkerDst)
  console.log(`[sync-pdfjs-assets] ${reactPdfWorkerSrc.replace(projectRoot, '.')}  ->  ${reactPdfWorkerDst.replace(projectRoot, '.')}`)
} else {
  console.warn('[sync-pdfjs-assets] react-pdf pdfjs worker no encontrado — react-pdf mode puede fallar.')
}
