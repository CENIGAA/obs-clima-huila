import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const cspConfig = JSON.parse(fs.readFileSync('public/staticwebapp.config.json', 'utf8'))
const csp = cspConfig.globalHeaders['content-security-policy']

function getJsonLdContent() {
  const html = fs.readFileSync('index.html', 'utf8')
  const marker = '<script type="application/ld+json">'
  const start = html.indexOf(marker) + marker.length
  const end = html.indexOf('</script>', start)
  return html.slice(start, end)
}

test('script-src ya no permite unsafe-inline ni unsafe-eval', () => {
  const scriptSrc = csp.split(';').find((part) => part.trim().startsWith('script-src'))

  assert.ok(scriptSrc, 'Debe existir una directiva script-src')
  assert.doesNotMatch(scriptSrc, /unsafe-inline/)
  assert.doesNotMatch(scriptSrc, /unsafe-eval/)
})

test('script-src contiene el hash del bloque JSON-LD embebido', () => {
  const content = getJsonLdContent()
  const hash = crypto.createHash('sha256').update(content).digest('base64')

  assert.match(csp, new RegExp(`sha256-${hash.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}`))
})
