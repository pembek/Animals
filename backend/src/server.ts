import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fastifyCors from '@fastify/cors'
import fs from 'fs/promises'
import * as fsSync from 'fs'
import translations from '../assets/animals141/translation.json' assert { type: 'json' }

type Lang = 'en' | 'de' | 'tr'

interface AnimalTranslation {
  "en": string
  "de": string
  "tr": string
}

const app = Fastify()

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'assets'),
  prefix: '/assets/'
})

// Animals endpoint
app.get('/animals', async (request) => {
  const query = request.query as { lang?: string | string[], mode?: string | string[] }
  let lang: Lang = 'en'  // default
  let mode = 'toddler';

  if (query.lang) {
    const l = Array.isArray(query.lang) ? query.lang[0] : query.lang
    // sadece 'en'|'de'|'tr' kabul edelim
    if (l === 'en' || l === 'de' || l === 'tr') lang = l 
  }
  if (query.mode) {
    const m = Array.isArray(query.mode) ? query.mode[0] : query.mode
    if (m === 'baby' || m === 'toddler') mode = m;
  }

  if (mode === 'baby') {
    // Serve from animals.json and curated images
    const animalsPath = path.join(process.cwd(), 'assets/animals.json')
    const animalsRaw = JSON.parse(await fs.readFile(animalsPath, 'utf-8'))
    return Object.entries(animalsRaw).map(([id, namesRaw]) => {
      // Find first image in /assets/images/{id}/
      const imgDir = path.join(process.cwd(), 'assets/images', id)
      let image = ''
      try {
        const files = fsSync.readdirSync(imgDir)
        const firstImg = files.find((f: string) => /\.(jpg|jpeg|png)$/i.test(f))
        if (firstImg) image = `/assets/images/${id}/${firstImg}`
      } catch {}
      const names = namesRaw as Record<string, string>;
      return {
        id,
        name: names[lang] || names['en'] || id,
        image
      }
    })
  }

  // Toddler mode (default):
  const animalsDir = path.join(process.cwd(), 'assets/animals141/dataset/dataset')
  const folders = await fs.readdir(animalsDir)

  //const translationPath = path.join(process.cwd(), 'assets/animals141/translation.json')
  //const translations: Record<string, string> = JSON.parse(await fs.readFile(translationPath, 'utf-8'))
  // Record<key, AnimalTranslation>
  const translationsTyped: Record<string, AnimalTranslation> =  translations as Record<string, AnimalTranslation>
    
  return Promise.all(
    folders.map(async (folder) => {
      const files = await fs.readdir(path.join(animalsDir, folder))
      const firstImage = files.find(f => /\.(jpg|jpeg|png)$/i.test(f))
      return {
        id: folder.toLowerCase(),
        name: translationsTyped[folder]?.[lang] || folder, // EN / DE / TR
        image: `/assets/animals141/dataset/dataset/${folder}/${firstImage}`
      }
    })
  )
})

app.register(fastifyCors, {
  origin: true // allows all origins
})

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err
  console.log(`Backend running at ${address}`)
})
