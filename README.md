# Protein Classroom 3D

A lightweight web app for teaching protein structure with AlphaFold models, aimed at MBBS and BAMS learners.

## What is included

- A browser-based 3D protein viewer using AlphaFold model files
- Curated educational briefs for human insulin, hemoglobin beta, and serum albumin
- A prompt builder for generating new sidebar content in Claude
- A JSON preview panel that can be dropped into an app sidebar or info tab

## Run locally

```bash
npm start
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173)

## Notes

- The app is intentionally dependency-light: no install step is required beyond Node.js.
- Runtime internet access is still needed for:
  - AlphaFold model downloads
  - Google Fonts
  - 3Dmol.js CDN
