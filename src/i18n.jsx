import { createContext, useContext, useState } from 'react'

const translations = {
  pl: {
    // Navbar
    nav_system: 'System',
    nav_rejestr: 'Rejestr',
    nav_tozsamosc: 'Tożsamość',
    nav_certyfikacja: 'Certyfikacja',
    nav_klasyfikacja: 'Klasyfikacja',
    nav_przezroczystosc: 'Przezroczystość',
    nav_rejestracja: 'Rejestracja',
    nav_inwestorzy: 'Dla Inwestorów',
    nav_kontakt: 'Kontakt',
    nav_cta: 'Zarejestruj Robota',

    // Landing Hero
    hero_subtitle: 'SYSTEM REJESTRACJI ROBOTÓW • POLSKA',
    hero_h1_line1: 'KAŻDY ROBOT.',
    hero_h1_line2: 'JEDEN SYSTEM.',
    hero_h1_line3: 'BEZPIECZEŃSTWO DLA WSZYSTKICH.',
    hero_desc: 'PESER to pierwszy w Polsce system rejestracji humanoidów. Każdy robot potrzebuje tożsamości cyfrowej, certyfikatów bezpieczeństwa i ścieżki audytowej. Dołącz do przyszłości robotyzacji.',
    hero_cta1: 'Przeglądaj Rejestr',
    hero_cta2: 'Zarejestruj Robota',
    hero_scroll: 'Scroll',

    // Stats
    stat_registered: 'Zarejestrowanych Robotów',
    stat_classes: 'Klas Bezpieczeństwa',
    stat_regions: 'Województw',
    stat_years: 'Lata Systemu',

    // System PESER
    system_label: 'CZYM JEST PESER',
    system_h1: 'System, który',
    system_h2: 'definiuje przyszłość',
    system_p1: 'PESER (Powszechny Elektroniczny System Ewidencji Robotów) to nowy, pierwszy w Polsce system rejestracji humanoidów i robotów autonomicznych. Analogiczny do PESEL dla ludzi, PESER przyznaje każdej maszynie unikalny numer identyfikacyjny.',
    system_p2: 'System zapewnia ścieżkę audytową, weryfikację właściciela (KYC — Know Your Robot) i klasyfikację ryzyka operacyjnego. To fundament bezpiecznej robotyzacji Polski.',
    system_p3: 'PESER to nie tylko rejestr — to całosystem certyfikacji, cyfrowej tożsamości (DID), Zero Trust authentication i przezroczystości przez blockchain.',

    // 3-step process
    step1_title: 'Złóż Wniosek',
    step1_desc: 'Właściciel lub operator wypełnia formularz rejestracyjny z danymi robota i danymi właściciela.',
    step2_title: 'Weryfikacja Hardware',
    step2_desc: 'System weryfikuje certyfikaty CE, sprawdza specyfikację techniczną i powiązanie klucza kryptograficznego z hardware\'em robota.',
    step3_title: 'Otrzymaj Numer PESER',
    step3_desc: 'System generuje unikalny numer (format: PL-202504-H1-00001-X7) i wydaje cyfrowy dowód osobisty robota.',

    // Rejestr
    rejestr_label: 'PUBLICZNY REJESTR',
    rejestr_title: 'Przeglądaj bazę',
    rejestr_subtitle: 'zarejestrowanych robotów',
    search_placeholder: 'Szukaj po numerze PESER, nazwie robota lub właścicielu...',
    filter_class: 'Klasa Ryzyka',
    filter_status: 'Status',
    filter_all: 'WSZYSTKIE',
    filter_active: 'AKTYWNY',
    filter_suspended: 'ZAWIESZONY',
    results_count: 'robotów zarejestrowanych',
    results_shown: 'wyświetlanych',
    view_details: 'Szczegóły',

    // Robot detail
    detail_peser_no: 'NUMER PESER',
    detail_robot_name: 'ROBOT',
    detail_risk_class: 'KLASA RYZYKA',
    detail_owner: 'WŁAŚCICIEL',
    detail_status: 'STATUS',
    detail_reg_date: 'DATA REJ.',
    detail_expiry: 'WYGASA',
    detail_did: 'IDENTYFIKATOR DID',
    detail_cert_level: 'POZIOM CERTYFIKACJI',
    detail_scope: 'ZAKRES OPERACYJNY',

    // Cyfrowa Tożsamość
    tozsamosc_label: 'CYFROWA TOŻSAMOŚĆ',
    tozsamosc_title: 'DID i SSI dla',
    tozsamosc_subtitle: 'robotów przyszłości',
    did_desc: 'Każdy robot posiada zdecentralizowany identyfikator (DID — Decentralized Identifier) powiązany z kluczem publicznym i prywanym.',
    ssi_desc: 'Self-Sovereign Identity (SSI) pozwala robotowi na pełną kontrolę nad swoją cyfrową tożsamością bez zależy od centralnych organów.',
    binding_desc: 'Klucze kryptograficzne są powiązane bezpośrednio z hardware\'em robota i jego firmware\'em, uniemożliwiając podszycie się.',
    pub_key_title: 'Klucz Publiczny',
    priv_key_title: 'Klucz Prywatny',
    cert_title: 'Certyfikat Firmware',
    binding_title: 'Powiązanie Hardware',

    // Certyfikacja
    cert_label: 'CERTYFIKACJA',
    cert_title: 'Zero Trust &',
    cert_subtitle: 'Paszport Techniczny',
    zero_trust_desc: 'System wymaga ciągłej autoryzacji procesów operacyjnych. Każda akcja robota jest weryfikowana względem upraw.',
    tech_passport_desc: 'Rejestr automatycznie weryfikuje, czy oprogramowanie robota jest aktualne i wolne od krytycznych luk bezpieczeństwa.',
    cert_level_a: 'Certyfikacja A — Najwyższy poziom bezpieczeństwa',
    cert_level_b: 'Certyfikacja B — Bezpieczeństwo wzmocnione',
    cert_level_c: 'Certyfikacja C — Bezpieczeństwo standardowe',
    cert_level_d: 'Certyfikacja D — Roboty eksperymentalne',

    // Klasyfikacja
    klasyfikacja_label: 'KLASYFIKACJA RYZYKA',
    klasyfikacja_title: 'Profile ryzyka dla',
    klasyfikacja_subtitle: 'różnych zastosowań',
    h1_title: 'Humanoid Publiczny (H1)',
    h1_desc: 'Roboty działające wśród ludzi. Recepcjoniści, przewodnicy, artyści.',
    h2_title: 'Humanoid Ograniczony (H2)',
    h2_desc: 'Roboty humanoidalne pracujące w kontrolowanym środowisku. Asystenci w fabrykach, obsługa logistics.',
    i1_title: 'Cobot Przemysłowy (I1)',
    i1_desc: 'Roboty współpracujące (cobots) w bezpośrednich interakcjach z ludźmi.',
    i2_title: 'Przemysłowy Pełny (I2)',
    i2_desc: 'Roboty całkowicie autonomiczne w strefach bez ludzi.',
    av_title: 'Pojazd Autonomiczny (AV)',
    av_desc: 'Samojezdne pojazdy autonomiczne dla transportu i logistyki.',

    // Transparentność
    transparentnosc_label: 'TRANSPARENTNOŚĆ',
    transparentnosc_title: 'Blockchain i',
    transparentnosc_subtitle: 'audyt w łańcuchu bloków',
    blockchain_desc: 'Wszystkie istotne akcje robota (rejestracja, aktualizacje, inspekcje, zdarzenia) są rejestrowane w niezmienionym dzienniku blockchain.',
    kyr_desc: 'Procedury KYR (Know Your Robot) wymuszają weryfikację właściciela lub operatora robota, zapewniając odpowiedzialność cywilną.',
    audit_event: 'Zarejestrowano',
    audit_verified: 'Zweryfikowano',
    audit_inspection: 'Inspekcja',
    audit_positive: 'wynik: POZYTYWNY',
    audit_renewed: 'Certyfikat odnowiony',

    // Rejestracja
    rejestracja_label: 'PANEL REJESTRACJI',
    rejestracja_title: 'Zarejestruj swojego',
    rejestracja_subtitle: 'robota w PESER',
    step_owner_data: 'Dane Właściciela',
    step_robot_data: 'Dane Robota',
    step_documents: 'Dokumenty',
    step_confirm: 'Potwierdzenie',

    form_nip: 'NIP/KRS',
    form_company: 'Nazwa firmy',
    form_authorized: 'Osoba upoważniona',
    form_email: 'Email',
    form_phone: 'Telefon',

    form_manufacturer: 'Producent',
    form_model: 'Model',
    form_serial: 'Numer seryjny',
    form_prod_date: 'Data produkcji',
    form_risk_class: 'Klasa ryzyka',
    form_hw_specs: 'Specyfikacja hardware',

    form_ce_cert: 'Certyfikat CE',
    form_safety_cert: 'Certyfikat bezpieczeństwa',
    form_upload: 'Wgraj plik',

    form_review: 'Przejrzyj dane',
    form_issue_peser: 'Wydaj numer PESER',
    form_download_card: 'Pobierz kartę PDF',
    form_download_png: 'Pobierz kartę PNG',
    form_share_link: 'Udostępnij link',
    form_add_registry: 'Dodaj do rejestru',
    form_submit: 'Wyślij wniosek',
    form_issuing: 'Generuję PESER...',
    form_issued: 'Numer PESER wydany!',

    issued_success: 'Sukces! Twój robot został zarejestrowany.',
    issued_number: 'Numer PESER',
    issued_card: 'Cyfrowy Dowód Osobisty Robota',
    issued_actions: 'Dostępne akcje',

    // Dla Inwestorów
    inwestorzy_label: 'DLA INWESTORÓW',
    inwestorzy_title: 'Rynek robotyzacji',
    inwestorzy_subtitle: 'to rynek przyszłości',
    market_size: 'Rynek robotów autonomicznych',
    market_units: 'Potencjalnych robotów do 2035',
    market_first: 'Pierwszy w Polsce',
    market_standard: 'Może stać się standardem krajowym',

    investment_thesis: 'Teza inwestycyjna PESER',
    thesis_1: 'Mandat rządowy — system może zostać wdrożony jako standard krajowy',
    thesis_2: 'Data moat — proprietary database zarejestrowanych robotów',
    thesis_3: 'API licensing — firm płacą za integrację',
    thesis_4: 'RaaS fees — opłaty za certyfikację Robota-as-a-Service',

    download_deck: 'Pobierz prezentację',
    contact_investor: 'Skontaktuj się z IR',

    // Kontakt & API
    kontakt_label: 'KONTAKT I API',
    kontakt_title: 'Integracja dla',
    kontakt_subtitle: 'deweloperów i instytucji',

    api_intro: 'PESER oferuje REST API dla firm i instytucji rządowych.',
    api_endpoints: 'Dostępne endpointy',
    api_get_robot: 'Pobierz dane robota',
    api_register: 'Zarejestruj robota',
    api_search: 'Przeszukaj rejestr',
    api_verify: 'Zweryfikuj certyfikat',

    contact_form_title: 'Skontaktuj się',
    contact_form_desc: 'Pytania? Chcesz integrować API? Napisz do nas.',
    form_subject: 'Temat',
    form_message: 'Wiadomość',
    form_send: 'Wyślij',

    gov_integration: 'Integracja rządowa',
    gov_partners: 'Partnerzy rządowi',

    // Status labels
    status_active: 'AKTYWNY',
    status_suspended: 'ZAWIESZONY',
    status_revoked: 'UNIEWAŻNIONY',

    // Footer
    footer_company: '© 2026 PESER. System Ewidencji Robotów.',
    footer_privacy: 'Polityka Prywatności',
    footer_terms: 'Warunki Użytkowania',
    footer_contact: 'Kontakt',
  },

  en: {
    // Navbar
    nav_system: 'System',
    nav_rejestr: 'Registry',
    nav_tozsamosc: 'Identity',
    nav_certyfikacja: 'Certification',
    nav_klasyfikacja: 'Classification',
    nav_przezroczystosc: 'Transparency',
    nav_rejestracja: 'Registration',
    nav_inwestorzy: 'For Investors',
    nav_kontakt: 'Contact',
    nav_cta: 'Register Robot',

    // Landing Hero
    hero_subtitle: 'ROBOT REGISTRY SYSTEM • POLAND',
    hero_h1_line1: 'EVERY ROBOT.',
    hero_h1_line2: 'ONE SYSTEM.',
    hero_h1_line3: 'SAFETY FOR ALL.',
    hero_desc: 'PESER is Poland\'s first humanoid robot registration system. Every robot needs a digital identity, safety certificates and an audit trail. Join the robotics revolution.',
    hero_cta1: 'Browse Registry',
    hero_cta2: 'Register Robot',
    hero_scroll: 'Scroll',

    // Stats
    stat_registered: 'Robots Registered',
    stat_classes: 'Safety Classes',
    stat_regions: 'Regions',
    stat_years: 'Years of System',

    // System PESER
    system_label: 'WHAT IS PESER',
    system_h1: 'System that',
    system_h2: 'defines the future',
    system_p1: 'PESER (Universal Electronic Robot Registry System) is Poland\'s first registration system for humanoids and autonomous robots. Similar to PESEL for humans, PESER assigns each machine a unique identification number.',
    system_p2: 'The system ensures audit trails, owner verification (KYC — Know Your Robot) and operational risk classification. This is the foundation for safe robotics in Poland.',
    system_p3: 'PESER is not just a registry — it\'s a complete certification system, digital identity (DID), Zero Trust authentication and blockchain transparency.',

    // 3-step process
    step1_title: 'Submit Application',
    step1_desc: 'The owner or operator fills out a registration form with robot data and owner information.',
    step2_title: 'Hardware Verification',
    step2_desc: 'The system verifies CE certificates, checks technical specifications and cryptographic key binding to robot hardware.',
    step3_title: 'Receive PESER Number',
    step3_desc: 'The system generates a unique number (format: PL-202504-H1-00001-X7) and issues a digital robot ID card.',

    // Rejestr
    rejestr_label: 'PUBLIC REGISTRY',
    rejestr_title: 'Browse database of',
    rejestr_subtitle: 'registered robots',
    search_placeholder: 'Search by PESER number, robot name or owner...',
    filter_class: 'Risk Class',
    filter_status: 'Status',
    filter_all: 'ALL',
    filter_active: 'ACTIVE',
    filter_suspended: 'SUSPENDED',
    results_count: 'robots registered',
    results_shown: 'displayed',
    view_details: 'Details',

    // Robot detail
    detail_peser_no: 'PESER NUMBER',
    detail_robot_name: 'ROBOT',
    detail_risk_class: 'RISK CLASS',
    detail_owner: 'OWNER',
    detail_status: 'STATUS',
    detail_reg_date: 'REG. DATE',
    detail_expiry: 'EXPIRES',
    detail_did: 'DID IDENTIFIER',
    detail_cert_level: 'CERTIFICATION LEVEL',
    detail_scope: 'OPERATIONAL SCOPE',

    // Cyfrowa Tożsamość
    tozsamosc_label: 'DIGITAL IDENTITY',
    tozsamosc_title: 'DID and SSI for',
    tozsamosc_subtitle: 'robots of the future',
    did_desc: 'Each robot has a decentralized identifier (DID — Decentralized Identifier) linked to a public and private key.',
    ssi_desc: 'Self-Sovereign Identity (SSI) allows the robot to have full control over its digital identity without relying on central authorities.',
    binding_desc: 'Cryptographic keys are tied directly to the robot\'s hardware and firmware, preventing impersonation.',
    pub_key_title: 'Public Key',
    priv_key_title: 'Private Key',
    cert_title: 'Firmware Certificate',
    binding_title: 'Hardware Binding',

    // Certyfikacja
    cert_label: 'CERTIFICATION',
    cert_title: 'Zero Trust &',
    cert_subtitle: 'Technical Passport',
    zero_trust_desc: 'The system requires continuous authorization of operational processes. Every robot action is verified against permissions.',
    tech_passport_desc: 'The registry automatically verifies that the robot\'s software is up-to-date and free of critical security vulnerabilities.',
    cert_level_a: 'Certification A — Highest security level',
    cert_level_b: 'Certification B — Enhanced security',
    cert_level_c: 'Certification C — Standard security',
    cert_level_d: 'Certification D — Experimental robots',

    // Klasyfikacja
    klasyfikacja_label: 'RISK CLASSIFICATION',
    klasyfikacja_title: 'Risk profiles for',
    klasyfikacja_subtitle: 'different applications',
    h1_title: 'Public Humanoid (H1)',
    h1_desc: 'Robots operating among humans. Receptionists, guides, artists.',
    h2_title: 'Restricted Humanoid (H2)',
    h2_desc: 'Humanoid robots working in controlled environments. Factory assistants, logistics support.',
    i1_title: 'Industrial Cobot (I1)',
    i1_desc: 'Collaborative robots (cobots) in direct human interactions.',
    i2_title: 'Industrial Full (I2)',
    i2_desc: 'Fully autonomous robots in human-free zones.',
    av_title: 'Autonomous Vehicle (AV)',
    av_desc: 'Self-driving autonomous vehicles for transport and logistics.',

    // Transparentność
    transparentnosc_label: 'TRANSPARENCY',
    transparentnosc_title: 'Blockchain and',
    transparentnosc_subtitle: 'blockchain audit trail',
    blockchain_desc: 'All significant robot actions (registration, updates, inspections, events) are recorded in an immutable blockchain ledger.',
    kyr_desc: 'KYR procedures (Know Your Robot) enforce owner or operator verification, ensuring civil responsibility.',
    audit_event: 'Registered',
    audit_verified: 'Verified',
    audit_inspection: 'Inspection',
    audit_positive: 'result: POSITIVE',
    audit_renewed: 'Certificate renewed',

    // Rejestracja
    rejestracja_label: 'REGISTRATION PANEL',
    rejestracja_title: 'Register your',
    rejestracja_subtitle: 'robot in PESER',
    step_owner_data: 'Owner Data',
    step_robot_data: 'Robot Data',
    step_documents: 'Documents',
    step_confirm: 'Confirmation',

    form_nip: 'NIP/KRS',
    form_company: 'Company Name',
    form_authorized: 'Authorized Person',
    form_email: 'Email',
    form_phone: 'Phone',

    form_manufacturer: 'Manufacturer',
    form_model: 'Model',
    form_serial: 'Serial Number',
    form_prod_date: 'Production Date',
    form_risk_class: 'Risk Class',
    form_hw_specs: 'Hardware Specs',

    form_ce_cert: 'CE Certificate',
    form_safety_cert: 'Safety Certificate',
    form_upload: 'Upload File',

    form_review: 'Review Data',
    form_issue_peser: 'Issue PESER Number',
    form_download_card: 'Download PDF Card',
    form_download_png: 'Download PNG Card',
    form_share_link: 'Share Link',
    form_add_registry: 'Add to Registry',
    form_submit: 'Submit Application',
    form_issuing: 'Generating PESER...',
    form_issued: 'PESER number issued!',

    issued_success: 'Success! Your robot has been registered.',
    issued_number: 'PESER Number',
    issued_card: 'Digital Robot ID Card',
    issued_actions: 'Available Actions',

    // Dla Inwestorów
    inwestorzy_label: 'FOR INVESTORS',
    inwestorzy_title: 'Robotics market',
    inwestorzy_subtitle: 'is the market of the future',
    market_size: 'Autonomous robots market',
    market_units: 'Potential robots by 2035',
    market_first: 'First in Poland',
    market_standard: 'Could become a national standard',

    investment_thesis: 'PESER Investment Thesis',
    thesis_1: 'Government mandate — system can be implemented as a national standard',
    thesis_2: 'Data moat — proprietary database of registered robots',
    thesis_3: 'API licensing — companies pay for integration',
    thesis_4: 'RaaS fees — certification fees for Robot-as-a-Service',

    download_deck: 'Download Presentation',
    contact_investor: 'Contact IR',

    // Kontakt & API
    kontakt_label: 'CONTACT & API',
    kontakt_title: 'Integration for',
    kontakt_subtitle: 'developers and institutions',

    api_intro: 'PESER offers a REST API for companies and government institutions.',
    api_endpoints: 'Available Endpoints',
    api_get_robot: 'Get robot data',
    api_register: 'Register robot',
    api_search: 'Search registry',
    api_verify: 'Verify certificate',

    contact_form_title: 'Get in Touch',
    contact_form_desc: 'Questions? Want to integrate the API? Write to us.',
    form_subject: 'Subject',
    form_message: 'Message',
    form_send: 'Send',

    gov_integration: 'Government Integration',
    gov_partners: 'Government Partners',

    // Status labels
    status_active: 'ACTIVE',
    status_suspended: 'SUSPENDED',
    status_revoked: 'REVOKED',

    // Footer
    footer_company: '© 2026 PESER. Robot Registry System.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Use',
    footer_contact: 'Contact',
  }
}

const LangContext = createContext()

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const path = window.location.pathname
    if (path.startsWith('/en')) return 'en'
    return 'pl'
  })

  const toggleLang = () => {
    const newLang = lang === 'pl' ? 'en' : 'pl'
    setLang(newLang)
    const newPath = window.location.pathname.replace(/^\/(pl|en)/, '') || '/'
    window.history.replaceState(null, '', `/${newLang}${newPath}`)
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang must be used within LangProvider')
  }
  return context
}
