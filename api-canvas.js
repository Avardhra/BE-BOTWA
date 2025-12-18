const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

// GET /t2s?text=...
app.get('/t2s', (req, res) => {
  const text = (req.query.text || '').toString()
  if (!text) {
    return res.status(400).json({ error: 'text query required' })
  }

  // PNG 1x1 putih (dummy) – hanya untuk test jalur API
  const png = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000150a0b53c0000000049454e44ae426082',
    'hex'
  )

  res.setHeader('Content-Type', 'image/png')
  res.send(png)
})

app.listen(PORT, () => {
  console.log('API t2s dummy listening on port', PORT)
})
