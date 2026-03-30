// IPFS via Pinata — free tier (1GB, 100 pins)
// Files are immutable: CID = cryptographic hash of content
// Change 1 bit → different CID. Nobody can edit pinned data.

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs'

// Pin a JSON object to IPFS (registration data, audit log entry)
export async function pinJSON(data, name = 'peser-record') {
  if (!PINATA_JWT) {
    console.warn('IPFS: No Pinata JWT configured, saving locally only')
    return localFallback(data, name)
  }

  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: { name },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Pinata error:', err)
      return localFallback(data, name)
    }

    const result = await res.json()
    return {
      cid: result.IpfsHash,
      url: `${PINATA_GATEWAY}/${result.IpfsHash}`,
      pinned: true,
      timestamp: new Date().toISOString(),
    }
  } catch (e) {
    console.error('IPFS pin failed:', e)
    return localFallback(data, name)
  }
}

// Pin a file (photo, certificate PDF) to IPFS
export async function pinFile(file, name = 'peser-file') {
  if (!PINATA_JWT) {
    console.warn('IPFS: No Pinata JWT configured')
    return { cid: null, url: URL.createObjectURL(file), pinned: false }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pinataMetadata', JSON.stringify({ name }))

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${PINATA_JWT}` },
      body: formData,
    })

    if (!res.ok) {
      console.error('Pinata file pin error:', await res.text())
      return { cid: null, url: URL.createObjectURL(file), pinned: false }
    }

    const result = await res.json()
    return {
      cid: result.IpfsHash,
      url: `${PINATA_GATEWAY}/${result.IpfsHash}`,
      pinned: true,
    }
  } catch (e) {
    console.error('IPFS file pin failed:', e)
    return { cid: null, url: URL.createObjectURL(file), pinned: false }
  }
}

// Verify a CID exists on IPFS (check immutability)
export async function verifyCID(cid) {
  try {
    const res = await fetch(`${PINATA_GATEWAY}/${cid}`, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

function localFallback(data, name) {
  // Generate a simulated CID (SHA-256 of the data)
  const str = JSON.stringify(data)
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buf => {
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
    const cid = 'Qm' + hash.slice(0, 44) // Simulated CIDv0 format

    // Save to localStorage as fallback
    const records = JSON.parse(localStorage.getItem('peser_ipfs_records') || '[]')
    records.push({ cid, data, name, timestamp: new Date().toISOString() })
    localStorage.setItem('peser_ipfs_records', JSON.stringify(records))

    return {
      cid,
      url: null,
      pinned: false,
      local: true,
      timestamp: new Date().toISOString(),
    }
  })
}
