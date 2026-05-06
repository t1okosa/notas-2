# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **Dynamics 365 web resource** — a React 18 + Vite app embedded as an iframe inside a D365 CRM dialog. It shows and manages sales documents (PDF checklist) keyed by `IdVenta` / `saleId`. Deployed by uploading `dist/` plus the PDF worker/font assets as CRM webresources.

This is the successor to `apolo-modal-documentos` (the sibling repo). It calls the same D365 Custom APIs but is structured with Zustand + React Query instead of Redux.

## Commands

```bash
# First-time: authenticate to the private Azure Artifacts feed
npx -y vsts-npm-auth -config .npmrc   # or set NPM_TOKEN=<PAT with Packaging Read>

yarn install          # also runs sync:pdfjs-assets.mjs via postinstall

yarn dev:local        # dev server with mocks (no CRM needed) — preferred for local work
yarn dev              # dev server expecting real CRM/Xrm context

yarn build            # production bundle → dist/ (base: './')
yarn lint             # eslint check (--max-warnings 0)
yarn lint:fix
yarn sync:pdfjs       # manually re-sync pdfjs worker + fonts + cmaps into public/
```

Override PDF asset URLs for a non-default CRM path:
```bash
VITE_PDF_WORKER_URL=/WebResources/axx_/Html/Documentos/ModalPdf/pdf.work.min.js \
VITE_PDF_FONTS_URL=/WebResources/axx_/Html/Documentos/ModalPdf/fonts/ \
VITE_PDF_CMAP_URL=/WebResources/axx_/Html/Documentos/ModalPdf/cmaps/ \
yarn build
```

No test suite exists yet.

## Environment variables (`.env.sample`)

| Variable | Purpose |
|---|---|
| `VITE_APP_MODO_LOCAL` | `true` → mock API + auto saleId, no CRM needed |
| `VITE_PDF_WORKER_URL` | pdfjs worker thread location (default `/pdf.work.min.js`) |
| `VITE_PDF_CMAP_URL` | Character maps for Asian-language PDFs (default `/pdf-cmaps/`) |
| `VITE_PDF_FONTS_URL` | Standard font files for pdfjs (default `/pdf-fonts/`) |

## Architecture

### Data flow

```
sessionStorage.IdVenta
       │
  useSaleContext      → writes saleId to Zustand store
       │
  useDocumentList     → useQuery → 1 API call → writes documents[] to store
       │
  useDocumentFiles    → useQueries (N parallel) → per-doc updateDocument() as each resolves
```

**Zustand store** (`src/store/useDocumentStore.js`) is the single source of truth for document list, file status (`idle | loading | ready | error`), base64 payloads, and selections. React Query is used for async lifecycle only; its cache is bypassed (`staleTime: 0, gcTime: 0`).

### API client abstraction

`ApiClientContext` picks the implementation at mount:
- `MODO_LOCAL=true` → `mockApiClient` (simulated latency, 15 % file error rate)
- else, `xrm` present → `createApoloClient(xrm)` from `@apolo/shared-api`
- else → `null` (queries stay disabled until CRM injects the Xrm context)

Queries are `enabled: !!apiClient && !!saleId`.

### D365 response parsing (critical)

The Custom APIs return **double-nested JSON strings**. `src/services/document-parser.js` unwraps:
1. Outer envelope: `{ Error, Response: { Api_..._Output: "<JSON string>" } }`
2. Inner JSON: parsed from the string value

Both levels must be checked for `.Error`. Silent failures happen if either check is skipped.

### PDF rendering

`pdfjs-dist 3.x` does not embed standard fonts (Helvetica, Times, Courier). The `scripts/sync-pdfjs-assets.mjs` script copies the worker, fonts, and cMap files from `node_modules/pdfjs-dist` into `public/`. **Pre-hooks on `predev`, `predev:local`, and `prebuild` run this automatically** — if PDFs render as blank or missing glyphs, the assets are out of sync; run `yarn sync:pdfjs`.

`useSystemFonts: false` is set intentionally to prevent pdfjs from falling back to OS fonts that don't match PDF subsets.

### Navigation

Stack-based, no React Router. `PageDocumentos` holds `activeId` state:
- `null` → document list view
- set → full-screen PDF viewer (`DocumentViewer`)

### D365 integration hooks

- `useSaleContext` reads `sessionStorage.IdVenta` (injected by D365 before the iframe mounts)
- `useD365Title` rewrites `window.parent.document.querySelector("#defaultDialogChromeTitle-N")` — wrapped in try/catch for cross-origin cases

### Module resolution

- `@/` alias → `src/` (configured in `vite.config.js`)
- `@apolo/*` packages are ESM-only, sourced from the private Azure Artifacts feed (`.npmrc`)
