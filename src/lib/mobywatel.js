// mObywatel / Profil Zaufany integration
// Production: login.gov.pl OpenID Connect
// Demo: simulated verification flow

const MOBYWATEL_ENABLED = import.meta.env.VITE_MOBYWATEL_CLIENT_ID ? true : false

// In production, this redirects to login.gov.pl
export function startMobywatelAuth() {
  if (MOBYWATEL_ENABLED) {
    const clientId = import.meta.env.VITE_MOBYWATEL_CLIENT_ID
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
    const state = Math.random().toString(36).slice(2)
    sessionStorage.setItem('mobywatel_state', state)
    window.location.href = `https://login.gov.pl/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile&state=${state}`
    return
  }

  // Demo mode: simulate verification
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: true,
        pesel: '85010112345',
        firstName: 'Jan',
        lastName: 'Kowalski',
        nip: '1234567890',
        company: null,
        verificationMethod: 'mObywatel (demo)',
        verifiedAt: new Date().toISOString(),
      })
    }, 2000)
  })
}

// Handle callback from login.gov.pl
export async function handleMobywatelCallback(code, state) {
  const savedState = sessionStorage.getItem('mobywatel_state')
  if (state !== savedState) throw new Error('Invalid state parameter')

  // In production, exchange code for tokens via backend
  // POST /api/auth/token with code
  // This is a demo — return mock data
  return {
    verified: true,
    pesel: '85010112345',
    firstName: 'Jan',
    lastName: 'Kowalski',
    verificationMethod: 'Profil Zaufany',
    verifiedAt: new Date().toISOString(),
  }
}

export function isVerified() {
  const data = sessionStorage.getItem('peser_verified_owner')
  if (!data) return null
  return JSON.parse(data)
}

export function saveVerification(data) {
  sessionStorage.setItem('peser_verified_owner', JSON.stringify(data))
}

export function clearVerification() {
  sessionStorage.removeItem('peser_verified_owner')
}
