import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Save registration to Supabase (graceful fallback to localStorage)
export async function saveRegistration(data) {
  if (supabase) {
    const { data: row, error } = await supabase
      .from('registrations')
      .insert([data])
      .select()
      .single()
    if (error) {
      console.error('Supabase insert error:', error)
      saveToLocal(data)
      return data
    }
    return row
  }
  saveToLocal(data)
  return data
}

// Save blockchain audit log entry
export async function saveAuditLog(entry) {
  if (supabase) {
    const { error } = await supabase
      .from('audit_log')
      .insert([entry])
    if (error) console.error('Audit log error:', error)
  }
  // Always save locally too
  const logs = JSON.parse(localStorage.getItem('peser_audit_log') || '[]')
  logs.push(entry)
  localStorage.setItem('peser_audit_log', JSON.stringify(logs))
}

// Upload file to Supabase Storage
export async function uploadFile(bucket, path, file) {
  if (supabase) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })
    if (error) {
      console.error('Upload error:', error)
      return null
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  }
  // Fallback: return local object URL
  return URL.createObjectURL(file)
}

function saveToLocal(data) {
  const regs = JSON.parse(localStorage.getItem('peser_registrations') || '[]')
  regs.push(data)
  localStorage.setItem('peser_registrations', JSON.stringify(regs))
}
