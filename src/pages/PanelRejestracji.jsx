import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, MapPin, Shield, FileText, Globe } from 'lucide-react'
import { useLang } from '../i18n'
import RobotIdCard from '../components/RobotIdCard'
import { saveRegistration, uploadFile, saveAuditLog } from '../lib/supabase'
import { addToChain } from '../lib/blockchain'
import { pinJSON, pinFile } from '../lib/ipfs'
import { startMobywatelAuth, isVerified, saveVerification } from '../lib/mobywatel'
import domtoimage from 'dom-to-image-more'
import { jsPDF } from 'jspdf'

const riskClasses = ['H1', 'H2', 'I1', 'I2', 'AV']
const regions = [
  'Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź', 'Katowice',
  'Lublin', 'Szczecin', 'Bydgoszcz', 'Białystok', 'Rzeszów', 'Toruń', 'Olsztyn', 'Opole', 'Kielce',
]

function generatePeser(riskClass) {
  const now = new Date()
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const seq = String(Math.floor(10000 + Math.random() * 90000))
  const raw = `PL${ym}${riskClass}${seq}`
  let sum = 0
  for (const ch of raw) sum = (sum + ch.charCodeAt(0)) % 256
  const chk = sum.toString(36).toUpperCase().padStart(2, '0').slice(-2)
  return `PL-${ym}-${riskClass}-${seq}-${chk}`
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", color: '#111', outline: 'none', transition: 'border-color 0.2s' }}
        onFocus={(e) => e.target.style.borderColor = '#111'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
      />
    </div>
  )
}

function FileUpload({ label, file, onFileChange, accept = '.pdf,.jpg,.jpeg,.png' }) {
  const ref = useRef(null)
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 8 }}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        style={{
          padding: file ? '16px 20px' : '32px 20px',
          border: file ? '1px solid rgba(0,0,0,0.12)' : '2px dashed rgba(0,0,0,0.1)',
          textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
          background: file ? 'rgba(26,138,74,0.04)' : 'transparent',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = file ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.1)'}
      >
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircle size={16} color="#1a8a4a" />
            <span style={{ fontSize: 13, color: '#1a8a4a', fontWeight: 500 }}>{file.name}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Upload size={16} color="rgba(0,0,0,0.3)" />
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>Wgraj plik ({accept})</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => onFileChange(e.target.files[0])} />
    </div>
  )
}

export default function PanelRejestracji() {
  const { t } = useLang()
  const [step, setStep] = useState(0)
  const [isIssuing, setIsIssuing] = useState(false)
  const cardRef = useRef(null)

  const [owner, setOwner] = useState({ nip: '', company: '', person: '', email: '', phone: '' })
  const [robot, setRobot] = useState({ manufacturer: '', model: '', serial: '', prodDate: '', riskClass: 'H1', description: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [ceCert, setCeCert] = useState(null)
  const [safetyCert, setSafetyCert] = useState(null)
  const [zone, setZone] = useState({ city: '', district: '', purpose: '' })
  const [issued, setIssued] = useState(null)
  const [blockchainHash, setBlockchainHash] = useState(null)
  const [ipfsCid, setIpfsCid] = useState(null)
  const [verified, setVerified] = useState(isVerified())
  const [verifying, setVerifying] = useState(false)

  const steps = ['WERYFIKACJA', t.step_owner_data, t.step_robot_data, 'ZDJĘCIE I DOKUMENTY', 'STREFA OPERACYJNA', 'POTWIERDZENIE']

  const handleVerify = async () => {
    setVerifying(true)
    try {
      const result = await startMobywatelAuth()
      if (result && result.verified) {
        saveVerification(result)
        setVerified(result)
        setOwner({
          ...owner,
          person: `${result.firstName} ${result.lastName}`,
          nip: result.nip || owner.nip,
          company: result.company || owner.company,
        })
        setStep(1)
      }
    } catch (e) {
      console.error('Verification failed:', e)
    }
    setVerifying(false)
  }

  const handlePhotoChange = (file) => {
    setPhoto(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleIssue = async () => {
    setIsIssuing(true)
    const peserId = generatePeser(robot.riskClass)
    const now = new Date()
    const regDate = now.toISOString().split('T')[0]
    const exp = new Date(now)
    exp.setFullYear(exp.getFullYear() + 2)
    const expiry = exp.toISOString().split('T')[0]
    const hash = 'did:peser:z' + Math.random().toString(36).slice(2, 10) + '...' + Math.random().toString(36).slice(2, 6)

    // Upload photo if available
    let photoUrl = photoPreview
    if (photo) {
      const uploaded = await uploadFile('robot-photos', `${peserId}/${photo.name}`, photo)
      if (uploaded) photoUrl = uploaded
    }

    const robotData = {
      id: peserId,
      name: robot.model.toUpperCase() || 'ROBOT',
      manufacturer: robot.manufacturer,
      owner: owner.company || owner.person,
      ownerCity: zone.city || 'Warszawa',
      riskClass: robot.riskClass,
      status: 'AKTYWNY',
      registrationDate: regDate,
      expiryDate: expiry,
      didHash: hash,
      certLevel: 'A',
      operationalScope: zone.purpose || 'PENDING_REVIEW',
      photoUrl,
      description: robot.description,
      zone: { city: zone.city, district: zone.district, purpose: zone.purpose },
    }

    // Save to Supabase / localStorage
    await saveRegistration({
      peser_id: peserId,
      owner_nip: owner.nip,
      owner_company: owner.company,
      owner_person: owner.person,
      owner_email: owner.email,
      robot_manufacturer: robot.manufacturer,
      robot_model: robot.model,
      robot_serial: robot.serial,
      risk_class: robot.riskClass,
      zone_city: zone.city,
      zone_district: zone.district,
      zone_purpose: zone.purpose,
      registration_date: regDate,
      expiry_date: expiry,
      did_hash: hash,
      photo_url: photoUrl,
    })

    // Add to blockchain audit trail
    const chainEntry = await addToChain({
      type: 'REG',
      peserId,
      description: `Rejestracja robota ${robot.model} (${robot.riskClass}) — właściciel: ${owner.company || owner.person}`,
    })
    setBlockchainHash(chainEntry.hash)

    // Also log audit
    await saveAuditLog({
      type: 'REG',
      peser_id: peserId,
      description: `Robot ${robot.model} zarejestrowany`,
      blockchain_hash: chainEntry.hash,
      timestamp: chainEntry.timestamp,
    })

    // Certification entry
    await addToChain({
      type: 'CERT',
      peserId,
      description: `Wydano certyfikat PESER klasy A dla ${peserId}`,
    })

    // Zone declaration
    if (zone.city) {
      await addToChain({
        type: 'ZONE',
        peserId,
        description: `Zgłoszono strefę operacyjną: ${zone.city}${zone.district ? ', ' + zone.district : ''} — ${zone.purpose}`,
      })
    }

    // Pin entire registration record to IPFS (decentralized, immutable)
    const ipfsResult = await pinJSON({
      peser_id: peserId,
      robot: { manufacturer: robot.manufacturer, model: robot.model, serial: robot.serial, riskClass: robot.riskClass },
      owner: { company: owner.company, person: owner.person, nip: owner.nip },
      zone: { city: zone.city, district: zone.district, purpose: zone.purpose },
      blockchain_hash: chainEntry.hash,
      registration_date: regDate,
      expiry_date: expiry,
      did_hash: hash,
    }, `PESER-${peserId}`)
    setIpfsCid(ipfsResult.cid)

    // Pin photo to IPFS too
    if (photo) {
      await pinFile(photo, `PESER-PHOTO-${peserId}`)
    }

    setIssued(robotData)
    setStep(6)
    setIsIssuing(false)
  }

  const handleDownloadPng = async () => {
    if (!cardRef.current) return
    try {
      const blob = await domtoimage.toBlob(cardRef.current, { quality: 1, scale: 2 })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'PESER-' + (issued?.id || 'card') + '.png'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error('PNG download failed:', e) }
  }

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await domtoimage.toPng(cardRef.current, { quality: 1, scale: 2 })
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
      pdf.addImage(dataUrl, 'PNG', 0, 0, 85.6, 54)
      pdf.save('PESER-' + (issued?.id || 'card') + '.pdf')
    } catch (e) { console.error('PDF download failed:', e) }
  }

  const btnPrimary = { padding: '12px 36px', background: '#111', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s' }
  const btnSecondary = { padding: '12px 24px', background: 'transparent', border: '1px solid rgba(0,0,0,0.2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#111' }
  const btnOutline = { padding: '10px 24px', background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#111', letterSpacing: '0.04em', transition: 'all 0.2s' }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '120px 48px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>{t.rejestracja_label}</div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', marginBottom: 48 }}>
            {t.rejestracja_title} <span style={{ color: 'rgba(0,0,0,0.25)' }}>{t.rejestracja_subtitle}</span>
          </h1>

          {/* Step indicator */}
          {step < 6 && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 48 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: 3, background: i <= step ? '#111' : 'rgba(0,0,0,0.08)', transition: 'background 0.3s', marginBottom: 8 }} />
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: i <= step ? '#111' : 'rgba(0,0,0,0.3)' }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 0: mObywatel verification */}
            {step === 0 && (
              <motion.div key="s-verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 32, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, background: '#dc143c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                      <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>mO</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>Weryfikacja przez mObywatel</div>
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>Profil Zaufany / login.gov.pl</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', marginBottom: 24 }}>
                    Aby zarejestrować robota w systemie PESER, musisz zweryfikować swoją tożsamość przez mObywatel lub Profil Zaufany.
                    Gwarantuje to, że każdy robot jest przypisany do zweryfikowanego właściciela — osoby fizycznej lub prawnej.
                  </p>

                  {verified ? (
                    <div style={{ padding: '16px 20px', background: 'rgba(26,138,74,0.04)', border: '1px solid rgba(26,138,74,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckCircle size={20} color="#1a8a4a" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a8a4a' }}>Tożsamość zweryfikowana</div>
                        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>{verified.firstName} {verified.lastName} — {verified.verificationMethod}</div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={handleVerify} disabled={verifying} style={{
                      ...btnPrimary, background: '#dc143c', display: 'flex', alignItems: 'center', gap: 8,
                      opacity: verifying ? 0.6 : 1,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>mO</span>
                      {verifying ? 'Weryfikuję...' : 'Zaloguj się przez mObywatel'}
                    </button>
                  )}
                </div>

                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', lineHeight: 1.6, marginBottom: 24 }}>
                  Nie masz mObywatela? Możesz też użyć Profilu Zaufanego (epuap.gov.pl) lub złożyć wniosek osobiście w urzędzie.
                </div>

                {verified && (
                  <button onClick={() => setStep(1)} style={btnPrimary}>Dalej — dane właściciela</button>
                )}
              </motion.div>
            )}

            {/* Step 1: Owner */}
            {step === 1 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {verified && (
                  <div style={{ padding: '12px 16px', background: 'rgba(26,138,74,0.04)', border: '1px solid rgba(26,138,74,0.1)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#1a8a4a' }}>
                    <CheckCircle size={14} /> Zweryfikowano: {verified.firstName} {verified.lastName}
                  </div>
                )}
                <Input label={t.form_nip} value={owner.nip} onChange={(e) => setOwner({ ...owner, nip: e.target.value })} placeholder="1234567890" />
                <Input label={t.form_company} value={owner.company} onChange={(e) => setOwner({ ...owner, company: e.target.value })} placeholder="MERA Robotics sp. z o.o." />
                <Input label={t.form_authorized} value={owner.person} onChange={(e) => setOwner({ ...owner, person: e.target.value })} placeholder="Jan Kowalski" />
                <Input label={t.form_email} value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} placeholder="email@firma.pl" type="email" />
                <Input label={t.form_phone} value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value })} placeholder="+48 123 456 789" type="tel" />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(0)} style={btnSecondary}>Wstecz</button>
                  <button onClick={() => setStep(2)} style={btnPrimary}>Dalej</button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Robot data */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Input label={t.form_manufacturer} value={robot.manufacturer} onChange={(e) => setRobot({ ...robot, manufacturer: e.target.value })} placeholder="Unitree Robotics" />
                <Input label={t.form_model} value={robot.model} onChange={(e) => setRobot({ ...robot, model: e.target.value })} placeholder="G1 Pro" />
                <Input label={t.form_serial} value={robot.serial} onChange={(e) => setRobot({ ...robot, serial: e.target.value })} placeholder="SN-2025-00001" />
                <Input label={t.form_prod_date} value={robot.prodDate} onChange={(e) => setRobot({ ...robot, prodDate: e.target.value })} type="date" />
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 8 }}>{t.form_risk_class}</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {riskClasses.map((c) => (
                      <button key={c} onClick={() => setRobot({ ...robot, riskClass: c })} style={{
                        padding: '8px 18px', fontSize: 12, fontWeight: 600,
                        border: robot.riskClass === c ? '1px solid #111' : '1px solid rgba(0,0,0,0.12)',
                        background: robot.riskClass === c ? '#111' : 'transparent',
                        color: robot.riskClass === c ? '#fff' : '#111', cursor: 'pointer',
                      }}>{c}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 4 }}>OPIS ROBOTA</label>
                  <textarea value={robot.description} onChange={(e) => setRobot({ ...robot, description: e.target.value })} placeholder="Opis przeznaczenia, specyfikacja, uwagi..."
                    style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", color: '#111', outline: 'none', resize: 'vertical', minHeight: 80 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)} style={btnSecondary}>Wstecz</button>
                  <button onClick={() => setStep(3)} style={btnPrimary}>Dalej</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Photo & Documents */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {/* Photo upload */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 8 }}>
                    ZDJĘCIE ROBOTA (jak w dowodzie)
                  </label>
                  {photoPreview ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <img src={photoPreview} alt="Robot" style={{ width: 120, height: 120, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a8a4a', marginBottom: 8 }}>Zdjęcie wgrane</div>
                        <button onClick={() => { setPhoto(null); setPhotoPreview(null) }} style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Zmień</button>
                      </div>
                    </div>
                  ) : (
                    <FileUpload label="" file={photo} onFileChange={handlePhotoChange} accept=".jpg,.jpeg,.png" />
                  )}
                </div>

                <FileUpload label={t.form_ce_cert} file={ceCert} onFileChange={setCeCert} />
                <FileUpload label={t.form_safety_cert} file={safetyCert} onFileChange={setSafetyCert} />

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(2)} style={btnSecondary}>Wstecz</button>
                  <button onClick={() => setStep(4)} style={btnPrimary}>Dalej</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Operational Zone (like drone registration) */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 32, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <MapPin size={20} color="rgba(0,0,0,0.4)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4 }}>Strefa operacyjna</div>
                    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                      Analogicznie do deklaracji lotów dronów, musisz zgłosić rejon, w którym robot będzie operował. System weryfikuje zgodność strefy z klasą ryzyka robota.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 8 }}>MIASTO</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {regions.slice(0, 8).map((city) => (
                      <button key={city} onClick={() => setZone({ ...zone, city })} style={{
                        padding: '6px 14px', fontSize: 12, fontWeight: 500,
                        border: zone.city === city ? '1px solid #111' : '1px solid rgba(0,0,0,0.1)',
                        background: zone.city === city ? '#111' : 'transparent',
                        color: zone.city === city ? '#fff' : '#111', cursor: 'pointer',
                      }}>{city}</button>
                    ))}
                  </div>
                </div>

                <Input label="DZIELNICA / OBSZAR" value={zone.district} onChange={(e) => setZone({ ...zone, district: e.target.value })} placeholder="np. Mokotów, Stare Miasto, cały obszar miejski" />
                <Input label="CEL OPERACYJNY" value={zone.purpose} onChange={(e) => setZone({ ...zone, purpose: e.target.value })} placeholder="np. recepcja hotelowa, patrol bezpieczeństwa, dostawa paczek" />

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(3)} style={btnSecondary}>Wstecz</button>
                  <button onClick={() => setStep(5)} style={btnPrimary}>Dalej</button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirm */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 32, marginBottom: 32 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#111' }}>Podsumowanie wniosku</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13 }}>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>NIP:</span> <strong>{owner.nip || '\u2014'}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Firma:</span> <strong>{owner.company || '\u2014'}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Producent:</span> <strong>{robot.manufacturer || '\u2014'}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Model:</span> <strong>{robot.model || '\u2014'}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Nr seryjny:</span> <strong>{robot.serial || '\u2014'}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Klasa:</span> <strong>{robot.riskClass}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Strefa:</span> <strong>{zone.city || '\u2014'}{zone.district ? ', ' + zone.district : ''}</strong></div>
                    <div><span style={{ color: 'rgba(0,0,0,0.4)' }}>Cel:</span> <strong>{zone.purpose || '\u2014'}</strong></div>
                  </div>
                  {photoPreview && (
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={photoPreview} alt="Robot" style={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)' }} />
                      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>Zdjęcie robota załączone</span>
                    </div>
                  )}
                  <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {ceCert && <div style={{ fontSize: 11, color: '#1a8a4a', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> CE</div>}
                    {safetyCert && <div style={{ fontSize: 11, color: '#1a8a4a', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> Bezpieczeństwo</div>}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 32, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Shield size={20} color="rgba(0,0,0,0.4)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4 }}>Blockchain & Certyfikacja</div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                      Po zatwierdzeniu, system: (1) wygeneruje numer PESER, (2) wyda certyfikat PESER klasy A, (3) zapisze rejestrację w blockchainie (SHA-256, immutable), (4) zgłosi strefę operacyjną. Dane nie mogą być edytowane po zapisie.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(4)} style={btnSecondary}>Wstecz</button>
                  <button onClick={handleIssue} disabled={isIssuing} style={{ ...btnPrimary, opacity: isIssuing ? 0.6 : 1 }}>
                    {isIssuing ? 'Generuję PESER...' : t.form_issue_peser}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Issued! */}
            {step === 6 && issued && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [.22, 1, .36, 1] }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                  <div style={{ width: 56, height: 56, background: '#1a8a4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff', fontSize: 28 }}>&#10003;</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 8 }}>{t.issued_success}</h2>
                  <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>{t.issued_number}: <strong style={{ fontFamily: "'Space Mono', monospace" }}>{issued.id}</strong></p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <RobotIdCard robot={issued} cardRef={cardRef} />
                </div>

                {/* Blockchain proof */}
                {blockchainHash && (
                  <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Shield size={16} color="#1a8a4a" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1a8a4a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zapisano w blockchainie</span>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(0,0,0,0.5)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                      SHA-256: {blockchainHash}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 8 }}>
                      Ten hash jest niezmieniany i powiązany z poprzednim wpisem w łańcuchu. Modyfikacja jest niemożliwa bez unieważnienia całego łańcucha.
                    </div>
                  </div>
                )}

                {/* IPFS proof */}
                {ipfsCid && (
                  <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Globe size={16} color="#0066cc" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#0066cc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zapisano na IPFS (zdecentralizowane)</span>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(0,0,0,0.5)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                      CID: {ipfsCid}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 8 }}>
                      Dane rejestracji zostały zapisane na zdecentralizowanym systemie plików IPFS. Nie mogą być edytowane ani usunięte. CID to kryptograficzny hash zawartości — każda zmiana danych generuje inny CID.
                    </div>
                  </div>
                )}

                {/* Certification badge */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color="#111" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Certyfikat PESER — Klasa A</div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>Wydano automatycznie po weryfikacji dokumentów. Ważny do {issued.expiryDate}.</div>
                  </div>
                </div>

                {/* Download buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleDownloadPng} style={btnPrimary}>{t.form_download_png}</button>
                  <button onClick={handleDownloadPdf} style={btnOutline}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> POBIERZ PDF</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
