// file: api-canvas.js
const express = require('express')
const { createCanvas } = require('canvas')

const app = express()
const PORT = process.env.PORT || 3000

// GET /t2s?text=...
app.get('/t2s', (req, res) => {
  const text = (req.query.text || '').toString()
  if (!text) return res.status(400).send('text query required')

  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // background putih
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  // style teks simple center 2 baris max
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const maxWidth = size - 80
  let fontSize = 120

  const wrapText = (t, fs) => {
    ctx.font = `${fs}px sans-serif`
    const words = t.split(/\s+/).filter(Boolean)
    const lines = []
    let line = ''
    for (const w of words) {
      const test = line ? line + ' ' + w : w
      const wTest = ctx.measureText(test).width
      if (wTest > maxWidth && line) {
        lines.push(line)
        line = w
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    return lines
  }

  let lines = []
  while (fontSize > 24) {
    lines = wrapText(text, fontSize)
    if (lines.length <= 2) break
    fontSize -= 4
  }
  ctx.font = `${fontSize}px sans-serif`
  if (lines.length > 2) {
    lines = [lines[0], lines.slice(1).join(' ')]
  }

  const lineHeight = fontSize + 6
  const totalHeight = lines.length * lineHeight
  const startY = size / 2 - totalHeight / 2 + lineHeight / 2

  lines.forEach((ln, i) => {
    const y = startY + i * lineHeight
    ctx.fillText(ln, size / 2, y)
  })

  // kirim sebagai PNG
  const buf = canvas.toBuffer('image/png')
  res.setHeader('Content-Type', 'image/png')
  res.send(buf)
})

app.listen(PORT, () => {
  console.log('Canvas API listening on port', PORT)
})
