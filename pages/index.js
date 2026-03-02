import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CONDITIONS, CATEGORIES } from '../data/conditions';
import SEOHead from '../components/SEOHead';

const S = {
  font: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay: "'Fraunces', Georgia, serif",
};

function Pill({ text, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      background: color + '15', color, fontSize: 12, fontWeight: 600,
      margin: '2px 4px 2px 0', border: `1px solid ${color}25`,
    }}>{text}</span>
  );
}

function DetailModal({ item, onClose }) {
  const cat = CATEGORIES[item.cat] || CATEGORIES['Allgemein'];
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const sections = [
    { label: 'Ursachen', text: item.causes, emoji: '🔍' },
    { label: 'Diagnostik', text: item.diagnostik, emoji: '🩺' },
    { label: 'Behandlung', text: item.treatment, emoji: '💊' },
    { label: 'Medikamente', text: item.meds, emoji: '💉', pills: true },
    { label: 'Wirkstoffe', text: item.agents, emoji: '🧪', pills: true },
    { label: 'Dosierung & Hinweise', text: item.dosage, emoji: '📋' },
    { label: 'Anmerkungen', text: item.notes, emoji: '⚠️' },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, maxWidth: 700, width: '100%',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${cat.color}, ${cat.accent})`,
          padding: '28px 28px 22px', borderRadius: '20px 20px 0 0', position: 'relative',
        }}>
          <button onClick={onClose} aria-label="Schliessen" style={{
            position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.2)',
            border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: 500 }}>
            {cat.icon} {item.cat} · ICD-10: {item.icd}
          </div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 21, fontWeight: 700, fontFamily: S.fontDisplay, lineHeight: 1.3 }}>
            {item.name}
          </h2>
          <Link href={`/beschwerden/${item.slug}/`} style={{
            display: 'inline-block', marginTop: 10, padding: '5px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 600,
          }}>
            Eigenständige Seite →
          </Link>
        </div>
        <div style={{ padding: '22px 28px 28px' }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2,
                color: cat.color, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{sec.emoji}</span> {sec.label}
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.7, color: '#374151',
                padding: '10px 14px', background: '#F9FAFB', borderRadius: 10,
                borderLeft: `3px solid ${cat.color}25`,
              }}>
                {sec.pills
                  ? sec.text.split(', ').map((m, j) => <Pill key={j} text={m.trim()} color={cat.color} />)
                  : sec.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, onClick }) {
  const cat = CATEGORIES[item.cat] || CATEGORIES['Allgemein'];
  return (
    <div onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(item)}
      style={{
        background: '#fff', borderRadius: 14, padding: '14px 18px',
        cursor: 'pointer', transition: 'all 0.15s ease',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${cat.color}15`; e.currentTarget.style.borderColor = cat.color + '40'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, background: cat.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 19, flexShrink: 0,
      }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 1 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.icd} · {item.meds.split(',').slice(0, 3).join(', ')}
        </div>
      </div>
      <div style={{
        padding: '3px 9px', borderRadius: 7, fontSize: 10, fontWeight: 600,
        background: cat.bg, color: cat.color, whiteSpace: 'nowrap', flexShrink: 0,
      }}>{item.cat}</div>
    </div>
  );
}

export default function Home({ allConditions }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('symptom');
  const inputRef = useRef(null);

  const results = useMemo(() => {
    let items = allConditions;
    if (activeCat) items = items.filter(d => d.cat === activeCat);
    if (search.length >= 2) {
      const q = search.toLowerCase();
      if (mode === 'symptom') {
        items = items.filter(d =>
          [d.name, d.causes, d.diagnostik, d.treatment, d.cat, d.icd, d.notes].some(f => f.toLowerCase().includes(q))
        );
      } else {
        items = items.filter(d =>
          [d.meds, d.agents].some(f => f.toLowerCase().includes(q))
        );
      }
    }
    return items;
  }, [search, activeCat, mode, allConditions]);

  const catCounts = useMemo(() => {
    const c = {};
    allConditions.forEach(d => { c[d.cat] = (c[d.cat] || 0) + 1; });
    return c;
  }, [allConditions]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MedRef CH',
    description: 'Interaktive medizinische Referenz für die Schweiz und Mitteleuropa',
    url: 'https://medref-ch.vercel.app',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    inLanguage: 'de-CH',
  };

  return (
    <>
      <SEOHead
        title="Top 100 Beschwerden – Medikamente & Behandlungen"
        description="Interaktive medizinische Referenz: Die 100 häufigsten Beschwerden in der Schweiz & Europa mit Medikamenten, Wirkstoffen, Dosierungen und ICD-10 Codes."
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', fontFamily: S.font }}>

        {/* === HEADER === */}
        <header style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          padding: '34px 20px 30px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent)' }} />

          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: 'var(--gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: '#fff', fontWeight: 800,
              }}>M</div>
              <span style={{ color: '#64748B', fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                Medizinische Referenz Schweiz & Europa
              </span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: '6px 0 2px', fontFamily: S.fontDisplay }}>
              MedRef{' '}
              <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CH</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 13, margin: '0 0 22px' }}>
              100 häufigste Beschwerden · Medikamente · Wirkstoffe · Dosierungen
            </p>

            {/* Mode switch */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 14, background: '#1E293B', borderRadius: 10, padding: 3, width: 'fit-content' }}>
              {[
                { key: 'symptom', label: '🔍 Beschwerde suchen' },
                { key: 'agent', label: '💊 Wirkstoff suchen' },
              ].map(m => (
                <button key={m.key} onClick={() => { setMode(m.key); setSearch(''); inputRef.current?.focus(); }}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s', fontFamily: S.font,
                    background: mode === m.key ? 'var(--gradient)' : 'transparent',
                    color: mode === m.key ? '#fff' : '#64748B',
                  }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
                placeholder={mode === 'symptom' ? 'z.B. Kopfschmerzen, Rückenschmerzen, Diabetes...' : 'z.B. Ibuprofen, Paracetamol, Metformin...'}
                aria-label="Suche"
                style={{
                  width: '100%', padding: '14px 18px 14px 44px', borderRadius: 13,
                  border: '2px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: 15, outline: 'none', fontFamily: S.font,
                }}
                onFocus={e => e.target.style.borderColor = '#3B82F660'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>
                {mode === 'symptom' ? '🔍' : '💊'}
              </span>
              {search && (
                <button onClick={() => setSearch('')} aria-label="Suche löschen" style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94A3B8',
                  width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              )}
            </div>
          </div>
        </header>

        {/* === MAIN === */}
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '22px 16px 50px' }}>

          {/* Category grid */}
          <section style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: 0 }}>
                Fachgebiete
                {activeCat && <span style={{ fontWeight: 400, color: '#9CA3AF' }}> · {activeCat}</span>}
              </h2>
              {activeCat && (
                <button onClick={() => setActiveCat(null)} style={{
                  background: '#EF4444', color: '#fff', border: 'none', padding: '4px 12px',
                  borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: S.font,
                }}>Filter aufheben ✕</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {Object.entries(CATEGORIES).map(([name, c]) => {
                const count = catCounts[name] || 0;
                if (!count) return null;
                const isActive = activeCat === name;
                return (
                  <button key={name} onClick={() => setActiveCat(isActive ? null : name)}
                    style={{
                      background: isActive ? `linear-gradient(135deg, ${c.color}, ${c.accent})` : '#fff',
                      borderRadius: 13, padding: '12px 10px', cursor: 'pointer',
                      border: `1.5px solid ${isActive ? c.color : 'var(--border)'}`,
                      transition: 'all 0.15s ease', textAlign: 'center', fontFamily: S.font,
                      boxShadow: isActive ? `0 4px 14px ${c.color}25` : '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = c.color + '50'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 3 }}>{c.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#fff' : '#374151', lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.8)' : '#9CA3AF', fontWeight: 500 }}>{count}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Results */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
              {results.length} Ergebnis{results.length !== 1 && 'se'}
              {search && ` für «${search}»`}
            </span>
            {search.length >= 2 && mode === 'agent' && results.length > 0 && (
              <span style={{ fontSize: 10, background: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: 5, fontWeight: 600 }}>
                Wirkstoff-Suche
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280', marginBottom: 3 }}>Keine Ergebnisse</div>
                <div style={{ fontSize: 12 }}>Versuche einen anderen Suchbegriff oder wähle ein Fachgebiet.</div>
              </div>
            ) : (
              results.map(item => <ItemRow key={item.id} item={item} onClick={setSelected} />)
            )}
          </div>

          {/* Disclaimer */}
          <footer style={{
            marginTop: 36, padding: '18px 22px', background: '#fff',
            borderRadius: 13, border: '1px solid #FDE68A', textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600, marginBottom: 3 }}>⚠️ Medizinischer Hinweis</div>
            <div style={{ fontSize: 11, color: '#78716C', lineHeight: 1.6 }}>
              Diese Anwendung dient ausschliesslich zu Informationszwecken und ersetzt keine ärztliche Beratung.
              Bei gesundheitlichen Beschwerden wenden Sie sich bitte an eine qualifizierte Ärztin / einen qualifizierten Arzt.
            </div>
          </footer>
        </main>
      </div>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      allConditions: JSON.parse(JSON.stringify(CONDITIONS)),
    },
  };
}
