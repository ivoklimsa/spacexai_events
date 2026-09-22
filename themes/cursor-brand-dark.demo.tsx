import { type Page, useSlidePageNumber } from '@open-slide/core';

const mono =
  'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace';
const muted = 'rgb(237 236 236 / 0.6)';
const dim = 'rgb(237 236 236 / 0.32)';

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontWeight: 800,
      fontSize: 120,
      lineHeight: 1.02,
      margin: '32px 0 0',
      letterSpacing: '-0.03em',
    }}
  >
    {children}
  </h1>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48,
        left: 120,
        right: 120,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: mono,
        fontSize: 18,
        letterSpacing: '0.12em',
        color: dim,
      }}
    >
      <span>cursor hackathon · prague #1</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Eyebrow = ({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 20,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent ? 'var(--osd-accent)' : muted,
    }}
  >
    {children}
  </span>
);

const Cover: Page = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#14120b',
      color: '#edecec',
      fontFamily:
        '"Cursor Gothic", "Helvetica Neue", Helvetica, system-ui, sans-serif',
      padding: '0 120px 100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}
  >
    <Eyebrow>30 . 09 . 2026 · PRAGUE · FORGE THE STACK</Eyebrow>
    <Title>
      Cursor Hackathon
      <br />
      Prague
    </Title>
    <p style={{ fontSize: 36, color: muted, marginTop: 36, maxWidth: 1100 }}>
      Productboard · SpaceXAI Prague
      <br />
      Thanks for coming!
    </p>
    <Footer />
  </div>
);

const Agenda: Page = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#14120b',
      color: '#edecec',
      fontFamily:
        '"Cursor Gothic", "Helvetica Neue", Helvetica, system-ui, sans-serif',
      padding: '88px 120px 96px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Eyebrow>agenda</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        margin: '12px 0 28px',
        lineHeight: 1.05,
      }}
    >
      One afternoon to ship.
    </h2>
    <div style={{ fontSize: 36, color: muted }}>
      12:30 Doors · 13:00 Kickoff · 13:30–18:00 Build · 18:00 Pitches · 19:30+
      Afterparty
    </div>
    <Footer />
  </div>
);

export default [Cover, Agenda];
