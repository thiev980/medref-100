import Link from 'next/link';
import { CONDITIONS, CATEGORIES, getConditionBySlug, getAllSlugs, getConditionsByCategory } from '../../data/conditions';
import SEOHead from '../../components/SEOHead';

const S = {
  font: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay: "'Fraunces', Georgia, serif",
};

function Pill({ text, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: 20,
      background: color + '12', color, fontSize: 13, fontWeight: 600,
      margin: '3px 5px 3px 0', border: `1px solid ${color}22`,
    }}>{text}</span>
  );
}

function Section({ label, emoji, text, color, pills }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.3,
        color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 8px',
      }}>
        <span>{emoji}</span> {label}
      </h3>
      <div style={{
        fontSize: 15, lineHeight: 1.75, color: '#374151',
        padding: '14px 18px', background: '#F9FAFB', borderRadius: 12,
        borderLeft: `3px solid ${color}30`,
      }}>
        {pills
          ? text.split(', ').map((m, j) => <Pill key={j} text={m.trim()} color={color} />)
          : text}
      </div>
    </div>
  );
}

export default function ConditionPage({ condition, relatedConditions }) {
  if (!condition) return null;
  const cat = CATEGORIES[condition.cat] || CATEGORIES['Allgemein'];

  const seoDesc = `${condition.name} (${condition.icd}): Diagnostik, Ursachen, Behandlung, Medikamente und Dosierung. Schweizer Referenz mit ${condition.meds.split(',').length} Medikamenten.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: condition.name,
    code: { '@type': 'MedicalCode', codeValue: condition.icd, codingSystem: 'ICD-10' },
    description: seoDesc,
    possibleTreatment: condition.treatment.split(';').map(t => ({
      '@type': 'MedicalTherapy', name: t.trim(),
    })),
    signOrSymptom: condition.causes.split(';').slice(0, 3).map(s => ({
      '@type': 'MedicalSignOrSymptom', name: s.trim(),
    })),
    typicalTest: condition.diagnostik.split(';').slice(0, 3).map(t => ({
      '@type': 'MedicalTest', name: t.trim(),
    })),
  };

  return (
    <>
      <SEOHead
        title={`${condition.name} – Behandlung & Medikamente`}
        description={seoDesc}
        path={`/beschwerden/${condition.slug}/`}
        type="article"
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', fontFamily: S.font, background: '#F0F2F5' }}>

        {/* Nav */}
        <nav style={{
          background: 'var(--dark)', padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontSize: 13,
            fontWeight: 500, transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
          >
            <span style={{
              width: 28, height: 28, borderRadius: 7, background: 'var(--gradient)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#fff', fontWeight: 800,
            }}>M</span>
            <span>← Zurück zur Übersicht</span>
          </Link>
        </nav>

        {/* Hero */}
        <header style={{
          background: `linear-gradient(135deg, ${cat.color}, ${cat.accent})`,
          padding: '36px 20px 32px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{ maxWidth: 740, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: 20,
                fontSize: 12, color: '#fff', fontWeight: 600,
              }}>{cat.icon} {condition.cat}</span>
              <span style={{
                background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: 20,
                fontSize: 12, color: '#fff', fontWeight: 600,
              }}>ICD-10: {condition.icd}</span>
            </div>
            <h1 style={{
              color: '#fff', fontSize: 28, fontWeight: 700, margin: 0,
              fontFamily: S.fontDisplay, lineHeight: 1.3,
            }}>
              {condition.name}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main style={{ maxWidth: 740, margin: '0 auto', padding: '28px 16px 50px' }}>
          <article>
            <Section label="Häufige Ursachen" emoji="🔍" text={condition.causes} color={cat.color} />
            <Section label="Diagnostik" emoji="🩺" text={condition.diagnostik} color={cat.color} />
            <Section label="Übliche Behandlung" emoji="💊" text={condition.treatment} color={cat.color} />
            <Section label="Medikamente (Markennamen)" emoji="💉" text={condition.meds} color={cat.color} pills />
            <Section label="Wirkstoffe (INN)" emoji="🧪" text={condition.agents} color={cat.color} pills />
            <Section label="Dosierung & Hinweise" emoji="📋" text={condition.dosage} color={cat.color} />
            <Section label="Klinische Anmerkungen" emoji="⚠️" text={condition.notes} color={cat.color} />
          </article>

          {/* Related */}
          {relatedConditions.length > 0 && (
            <section style={{ marginTop: 36 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
                Weitere Beschwerden in «{condition.cat}»
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {relatedConditions.map(rc => (
                  <Link key={rc.id} href={`/beschwerden/${rc.slug}/`} style={{
                    padding: '8px 16px', background: '#fff', borderRadius: 10,
                    border: '1px solid var(--border)', fontSize: 13, fontWeight: 500,
                    color: '#374151', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '50'; e.currentTarget.style.color = cat.color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#374151'; }}
                  >
                    {rc.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: 36, padding: '16px 20px', background: '#fff',
            borderRadius: 12, border: '1px solid #FDE68A', textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600, marginBottom: 2 }}>⚠️ Medizinischer Hinweis</div>
            <div style={{ fontSize: 11, color: '#78716C', lineHeight: 1.6 }}>
              Diese Informationen dienen ausschliesslich zu Referenzzwecken und ersetzen keine ärztliche Beratung.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = getAllSlugs().map(slug => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const condition = getConditionBySlug(params.slug);
  if (!condition) return { notFound: true };

  const relatedConditions = getConditionsByCategory(condition.cat)
    .filter(c => c.id !== condition.id)
    .map(c => ({ id: c.id, name: c.name, slug: c.slug }));

  return {
    props: JSON.parse(JSON.stringify({ condition, relatedConditions })),
  };
}
