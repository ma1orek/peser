// Pre-registered robots (real MERA Robotics fleet — first entries in PESER)
// All other robots appear only after registration through the form
export const preRegistered = [
  {
    id: 'PL-202501-H1-00001-A3',
    name: 'EDWARD WARCHOCKI',
    manufacturer: 'MERA Robotics',
    owner: 'MERA Robotics sp. z o.o.',
    ownerCity: 'Warszawa',
    riskClass: 'H1',
    status: 'AKTYWNY',
    registrationDate: '2025-01-15',
    expiryDate: '2027-01-14',
    didHash: 'did:peser:zQ3shX9v...a7Fk2',
    certLevel: 'A',
    operationalScope: 'PUBLIC_EVENTS',
    description: 'Humanoid robot do interakcji publicznej. Specjalizacja: eventy, marketing, recepcja.',
  },
  {
    id: 'PL-202503-H1-00006-F2',
    name: 'UNITREE G1-PL',
    manufacturer: 'Unitree Robotics',
    owner: 'MERA Robotics sp. z o.o.',
    ownerCity: 'Warszawa',
    riskClass: 'H1',
    status: 'AKTYWNY',
    registrationDate: '2025-03-05',
    expiryDate: '2027-03-04',
    didHash: 'did:peser:zV7rBb5o...f8Ps3',
    certLevel: 'A',
    operationalScope: 'PUBLIC_SERVICE',
    description: 'Humanoid serwisowy. Import bezposredni z Unitree Robotics. Inspekcja, asystent.',
  },
  {
    id: 'PL-202506-H1-00015-O8',
    name: 'UNITREE B2-PL',
    manufacturer: 'Unitree Robotics',
    owner: 'MERA Robotics sp. z o.o.',
    ownerCity: 'Warszawa',
    riskClass: 'H1',
    status: 'NIEAKTYWNY',
    registrationDate: '2025-06-10',
    expiryDate: '2027-06-09',
    didHash: 'did:peser:zF6aKk4x...o3Yb9',
    certLevel: 'A',
    operationalScope: 'SECURITY_PATROL',
    description: 'Quadruped robot patrolowy. Inspekcja terenu, bezpieczenstwo obiektow.',
  },
  {
    id: 'PL-202509-H1-00021-U2',
    name: 'UNITREE GO2-PL',
    manufacturer: 'Unitree Robotics',
    owner: 'MERA Robotics sp. z o.o.',
    ownerCity: 'Warszawa',
    riskClass: 'H1',
    status: 'AKTYWNY',
    registrationDate: '2025-09-01',
    expiryDate: '2027-08-31',
    didHash: 'did:peser:zL2gQq0d...u7Eh3',
    certLevel: 'A',
    operationalScope: 'DEMO_EVENTS',
    description: 'Quadruped robot demonstracyjny. Pokazy, eventy, edukacja.',
  },
]

// Get all robots: pre-registered + user-registered from localStorage
export function getAllRobots() {
  const userRegistered = JSON.parse(localStorage.getItem('peser_registrations') || '[]')
  const fromStorage = userRegistered.map((r) => ({
    id: r.peser_id,
    name: (r.robot_model || 'ROBOT').toUpperCase(),
    manufacturer: r.robot_manufacturer || '',
    owner: r.owner_company || r.owner_person || '',
    ownerCity: r.zone_city || '',
    riskClass: r.risk_class || 'H1',
    status: 'AKTYWNY',
    registrationDate: r.registration_date || new Date().toISOString().split('T')[0],
    expiryDate: r.expiry_date || '',
    didHash: r.did_hash || '',
    certLevel: 'A',
    operationalScope: r.zone_purpose || '',
    description: '',
    photoUrl: r.photo_url || null,
  }))
  return [...preRegistered, ...fromStorage]
}

export const riskClassLabels = {
  H1: { name: 'Humanoid Publiczny', color: '#111' },
  H2: { name: 'Humanoid Ograniczony', color: '#c67800' },
  I1: { name: 'Cobot Przemyslowy', color: '#0066cc' },
  I2: { name: 'Przemyslowy Pelny', color: '#cc3333' },
  AV: { name: 'Pojazd Autonomiczny', color: '#7733cc' },
}

export const statusLabels = {
  AKTYWNY: { label: 'Aktywny', color: '#1a8a4a' },
  NIEAKTYWNY: { label: 'Nieaktywny', color: '#999' },
  ZAWIESZONY: { label: 'Zawieszony', color: '#c67800' },
  UNIEWAZNIONY: { label: 'Uniewazniony', color: '#cc3333' },
}
