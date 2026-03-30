// Blockchain-inspired immutable audit logging
// Each entry is hashed with SHA-256, chaining to the previous hash (like a blockchain)

export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createBlockchainEntry(data, previousHash = '0000000000000000000000000000000000000000000000000000000000000000') {
  const timestamp = new Date().toISOString()
  const payload = JSON.stringify({ ...data, timestamp, previousHash })
  const hash = await sha256(payload)

  return {
    timestamp,
    type: data.type, // REG, UPD, INS, CERT, ZONE
    peserId: data.peserId,
    description: data.description,
    previousHash,
    hash,
    payload,
  }
}

export function getChain() {
  return JSON.parse(localStorage.getItem('peser_blockchain') || '[]')
}

export async function addToChain(data) {
  const chain = getChain()
  const prevHash = chain.length > 0 ? chain[chain.length - 1].hash : '0000000000000000000000000000000000000000000000000000000000000000'
  const entry = await createBlockchainEntry(data, prevHash)
  chain.push(entry)
  localStorage.setItem('peser_blockchain', JSON.stringify(chain))
  return entry
}

export async function verifyChain() {
  const chain = getChain()
  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i]
    const recalculated = await sha256(entry.payload)
    if (recalculated !== entry.hash) return { valid: false, brokenAt: i }
    if (i > 0 && entry.previousHash !== chain[i - 1].hash) return { valid: false, brokenAt: i }
  }
  return { valid: true, length: chain.length }
}
