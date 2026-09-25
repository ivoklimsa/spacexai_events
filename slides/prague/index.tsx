import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Step,
  Steps,
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useSlidePageNumber,
} from '@open-slide/core';
import cursorGothicBold from './assets/CursorGothic-Bold.ttf';
import cursorGothicRegular from './assets/CursorGothic-Regular.ttf';

export const design: DesignSystem = {
  palette: { bg: '#14120b', text: '#edecec', accent: '#f54e00' },
  fonts: {
    display:
      '"Cursor Gothic", "Helvetica Neue", Helvetica, system-ui, sans-serif',
    body: '"Cursor Gothic", "Helvetica Neue", Helvetica, system-ui, sans-serif',
  },
  typeScale: { hero: 120, body: 30 },
  radius: 14,
};

export const meta: SlideMeta = {
  title: 'Prague Hackathon',
  theme: 'cursor-brand-dark',
  createdAt: '2026-09-22T11:58:38.414Z',
};

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const mono =
  'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace';
const muted = 'rgb(237 236 236 / 0.6)';
const dim = 'rgb(237 236 236 / 0.32)';
const panel = '#1b1913';
const line = 'rgb(237 236 236 / 0.1)';
const accentSoft = 'rgb(245 78 0 / 0.45)';
const accentWash = 'rgb(245 78 0 / 0.12)';
const pad = '88px 120px 96px';
const SCRAMBLE = '!<>-_/[]{}=+*^?#01';

const CURSOR_MARK =
  "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20466.73%20532.09'%3e%3cpath%20fill='%23edecec'%20d='M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z'/%3e%3c/svg%3e";

const canvas: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  overflow: 'hidden',
};

const MOTION_CSS = `
@keyframes pragueFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function ensureBrandAssets() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('prague-brand-fonts')) return;
  const style = document.createElement('style');
  style.id = 'prague-brand-fonts';
  // Madrid Mallorca faces: Regular 400 + Bold covering 700–900 (heroes use 800).
  style.textContent = `
    @font-face {
      font-family: "Cursor Gothic";
      src: url("${cursorGothicRegular}") format("truetype");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: "Cursor Gothic";
      src: url("${cursorGothicBold}") format("truetype");
      font-weight: 700 900;
      font-style: normal;
      font-display: swap;
    }
    ${MOTION_CSS}
  `;
  document.head.appendChild(style);
}

ensureBrandAssets();

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

const ScrambleText = ({
  text,
  delay = 0,
  style,
}: {
  text: string;
  delay?: number;
  style?: CSSProperties;
}) => {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(text);

  useEffect(() => {
    if (reduced) {
      setValue(text);
      return;
    }
    setValue('');
    let tick = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        tick += 1;
        const revealed = Math.floor((tick / 22) * text.length);
        let next = '';
        for (let i = 0; i < text.length; i += 1) {
          if (text[i] === ' ') {
            next += ' ';
            continue;
          }
          next +=
            i < revealed
              ? text[i]
              : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
        }
        setValue(next);
        if (tick >= 22) {
          clearInterval(interval);
          setValue(text);
        }
      }, 28);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, reduced]);

  return <span style={style}>{value || '\u00a0'}</span>;
};

const CornerMark = ({
  d,
  top,
  left,
  right,
  bottom,
  color = dim,
}: {
  d: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  color?: string;
}) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 16 16"
    aria-hidden
    style={{ position: 'absolute', top, left, right, bottom }}
  >
    <path d={d} fill="none" stroke={color} strokeWidth="1.4" />
  </svg>
);

const Corners = ({
  inset = 0,
  color = dim,
}: {
  inset?: number;
  color?: string;
}) => (
  <>
    <CornerMark d="M2 8 V2 H8" top={inset} left={inset} color={color} />
    <CornerMark d="M14 8 V2 H8" top={inset} right={inset} color={color} />
    <CornerMark d="M2 8 V14 H8" bottom={inset} left={inset} color={color} />
    <CornerMark d="M14 8 V14 H8" bottom={inset} right={inset} color={color} />
  </>
);

const Eyebrow = ({
  children,
  accent,
}: {
  children: ReactNode;
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

const AgendaRow = ({
  time,
  label,
  sub,
  accent,
}: {
  time: string;
  label: string;
  sub?: string;
  accent?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gap: 32,
      alignItems: 'baseline',
      padding: '22px 0',
      borderBottom: `1px solid ${line}`,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 26,
        color: accent ? 'var(--osd-accent)' : muted,
        letterSpacing: '0.06em',
      }}
    >
      {time}
    </span>
    <div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>
        {label}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 26,
            color: muted,
            marginTop: 8,
            lineHeight: 1.35,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  </div>
);

const Opening: Page = () => {
  const reduced = usePrefersReducedMotion();
  const fade = (delayMs: number): CSSProperties =>
    reduced
      ? {}
      : {
          animation: 'pragueFadeUp 0.55s cubic-bezier(0,0,0.2,1) both',
          animationDelay: `${delayMs}ms`,
        };

  return (
    <div
      style={{
        ...canvas,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 120px 100px',
        boxSizing: 'border-box',
      }}
    >
      <Corners inset={48} color={accentSoft} />
      <img
        src={CURSOR_MARK}
        alt=""
        aria-hidden
        style={{ width: 56, height: 56, marginBottom: 40, ...fade(0) }}
      />
      <span
        style={{
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: '0.22em',
          color: muted,
          ...fade(80),
        }}
      >
        30 . 09 . 2026 · PRAGUE · FORGE THE STACK
      </span>
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
        <ScrambleText text="Cursor Hackathon" delay={200} />
        <br />
        <ScrambleText text="Prague" delay={480} />
      </h1>
      <p
        style={{
          fontSize: 36,
          color: muted,
          marginTop: 36,
          maxWidth: 1100,
          lineHeight: 1.5,
          ...fade(900),
        }}
      >
        Productboard · SpaceXAI Prague
        <br />
        Thanks for coming!
      </p>
      <Footer />
    </div>
  );
};

const Agenda: Page = () => {
  return (
    <div
      style={{
        ...canvas,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Corners inset={14} />
      <Eyebrow>agenda</Eyebrow>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 58,
          fontWeight: 800,
          margin: '12px 0 20px',
          lineHeight: 1.05,
        }}
      >
        One afternoon to ship.
      </h2>
      <div style={{ flex: 1, maxWidth: 1680 }}>
        <AgendaRow
          time="12:30"
          label="Doors Open & Networking"
          sub="Settle in, grab a seat, meet the room"
        />
        <AgendaRow
          time="13:00"
          label="Kickoff"
          sub="Briefing, theme, find your teammates"
        />
        <AgendaRow
          time="13:30–18:00"
          label="Hackathon Sprint"
          sub="Build time — ship a working demo"
        />
        <AgendaRow
          time="18:00–19:00"
          label="Project Pitches, Voting & Prizes"
          sub="Top 3 projects · prize handover"
        />
        <AgendaRow
          time="19:30+"
          label="Afterparty · Karlinska Holka"
          sub="Off-site · sponsored by Incident.io"
          accent
        />
      </div>
      <Footer />
    </div>
  );
};

const JuryCard = ({
  n,
  name,
  role,
  intro,
}: {
  n: string;
  name: string;
  role: string;
  intro: string;
}) => (
  <div
    style={{
      position: 'relative',
      background: panel,
      border: `1px solid ${line}`,
      borderRadius: 14,
      padding: '32px 36px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 0,
    }}
  >
    <Corners inset={12} />
    <span
      style={{
        fontFamily: mono,
        fontSize: 18,
        color: 'var(--osd-accent)',
        letterSpacing: '0.14em',
      }}
    >
      {n}
    </span>
    <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>
      {name}
    </span>
    <span style={{ fontSize: 26, color: muted, lineHeight: 1.35 }}>{role}</span>
    <span
      style={{
        fontFamily: mono,
        fontSize: 22,
        color: 'var(--osd-accent)',
        letterSpacing: '0.06em',
        marginTop: 'auto',
        paddingTop: 8,
      }}
    >
      {intro}
    </span>
  </div>
);

const JURY = [
  {
    n: '01',
    name: 'Daniel Hejl',
    role: 'Co-founder & CAIO, Productboard',
    intro: 'Hosts the room',
  },
  {
    n: '02',
    name: 'Ben King',
    role: 'Product Engineer, incident.io',
    intro: 'Loves Cursor CMD+K',
  },
  {
    n: '03',
    name: 'Petr Podrouzek',
    role: 'CTO, IP Fabric',
    intro: 'Finds security gaps',
  },
  {
    n: '04',
    name: 'Kate Douskova',
    role: 'Pitch coach & advisor',
    intro: 'Clear under pressure',
  },
] as const;

const Jury: Page = () => (
  <div
    style={{
      ...canvas,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={14} />
    <Eyebrow>jury</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        margin: '12px 0 28px',
        lineHeight: 1.05,
      }}
    >
      Who scores tonight.
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 28,
        flex: 1,
        maxWidth: 1680,
        minHeight: 0,
      }}
    >
      {JURY.map((person) => (
        <JuryCard key={person.n} {...person} />
      ))}
    </div>
    <Footer />
  </div>
);

const CREW = [
  { n: '01', name: 'Eleanor Menchú' },
  { n: '02', name: 'Dejan Lazeski' },
  { n: '03', name: 'Chin Man Yeung' },
  { n: '04', name: 'Kornel Dubieniecki' },
  { n: '05', name: 'Ivo Klimša' },
] as const;

const CrewCard = ({ n, name }: { n: string; name: string }) => (
  <div
    style={{
      position: 'relative',
      background: panel,
      border: `1px solid ${line}`,
      borderRadius: 14,
      padding: '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 0,
    }}
  >
    <Corners inset={12} />
    <span
      style={{
        fontFamily: mono,
        fontSize: 18,
        color: 'var(--osd-accent)',
        letterSpacing: '0.14em',
      }}
    >
      {n}
    </span>
    <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15 }}>
      {name}
    </span>
    <span
      style={{
        fontFamily: mono,
        fontSize: 20,
        color: 'var(--osd-accent)',
        letterSpacing: '0.06em',
        marginTop: 'auto',
        paddingTop: 8,
      }}
    >
      SpaceXAI Ambassador
    </span>
  </div>
);

const Crew: Page = () => (
  <div
    style={{
      ...canvas,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={14} />
    <Eyebrow>crew</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        margin: '12px 0 28px',
        lineHeight: 1.05,
      }}
    >
      SpaceXAI crew today.
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 24,
        flex: 1,
        maxWidth: 1680,
        minHeight: 0,
        alignContent: 'start',
      }}
    >
      {CREW.map((person) => (
        <CrewCard key={person.n} {...person} />
      ))}
    </div>
    <Footer />
  </div>
);

const SPONSORS = ['SpaceXAI', 'Productboard', 'incident.io'] as const;

const Thanks: Page = () => (
  <div
    style={{
      ...canvas,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={14} />
    <Eyebrow>thanks</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        margin: '12px 0 36px',
        lineHeight: 1.05,
      }}
    >
      Sponsors & venue care.
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 28,
        maxWidth: 1680,
      }}
    >
      {SPONSORS.map((name, i) => (
        <div
          key={name}
          style={{
            position: 'relative',
            background: panel,
            border: `1px solid ${line}`,
            borderRadius: 14,
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 200,
          }}
        >
          <Corners inset={12} />
          <span
            style={{
              fontFamily: mono,
              fontSize: 18,
              color: 'var(--osd-accent)',
              letterSpacing: '0.14em',
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>
            {name}
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 22,
              color: muted,
              letterSpacing: '0.06em',
              marginTop: 'auto',
            }}
          >
            sponsor
          </span>
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: 36,
        padding: '28px 36px',
        borderRadius: 14,
        maxWidth: 1680,
        background: accentWash,
        border: `1px solid ${accentSoft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 18,
          color: 'var(--osd-accent)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        kudos
      </span>
      <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>
        Kateřina Kolářová
      </span>
      <span style={{ fontSize: 28, color: muted, lineHeight: 1.4 }}>
        Taking care of us at Productboard
      </span>
    </div>
    <Footer />
  </div>
);

const FORMAT_STAGES = [
  {
    n: '01',
    chip: '4',
    chipLabel: 'groups',
    label: 'Group round',
    body: '4 groups · 1 judge each · 1 min per project',
  },
  {
    n: '02',
    chip: '3',
    chipLabel: 'each',
    label: 'Shortlist',
    body: 'Each judge picks top 3 → 12 finalists',
  },
  {
    n: '03',
    chip: '12',
    chipLabel: 'finalists',
    label: 'Final round',
    body: 'Present to everyone · 2 min incl. pitch + questions',
  },
  {
    n: '04',
    chip: '3',
    chipLabel: 'winners',
    label: 'Winners',
    body: 'Full jury scores → 1st / 2nd / 3rd',
  },
] as const;

const BracketConnector = () => (
  <div
    aria-hidden
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      color: 'var(--osd-accent)',
      opacity: 0.7,
    }}
  >
    <svg width="28" height="28" viewBox="0 0 28 28">
      <path
        d="M6 14 H20 M14 8 L20 14 L14 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const FormatStage = ({
  n,
  chip,
  chipLabel,
  label,
  body,
}: {
  n: string;
  chip: string;
  chipLabel: string;
  label: string;
  body: string;
}) => (
  <div
    style={{
      position: 'relative',
      flex: 1,
      minWidth: 0,
      background: panel,
      border: `1px solid ${line}`,
      borderRadius: 14,
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 420,
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={10} />
    <span
      style={{
        fontFamily: mono,
        fontSize: 16,
        color: 'var(--osd-accent)',
        letterSpacing: '0.14em',
      }}
    >
      {n}
    </span>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        margin: '8px 0 4px',
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--osd-accent)',
          letterSpacing: '-0.02em',
        }}
      >
        {chip}
      </span>
      <span
        style={{
          fontFamily: mono,
          fontSize: 18,
          color: muted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {chipLabel}
      </span>
    </div>
    <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
      {label}
    </span>
    <span
      style={{
        fontSize: 22,
        color: muted,
        lineHeight: 1.4,
        marginTop: 'auto',
      }}
    >
      {body}
    </span>
  </div>
);

const Format: Page = () => (
  <div
    style={{
      ...canvas,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={14} />
    <Eyebrow>the format</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 52,
        fontWeight: 800,
        margin: '12px 0 28px',
        lineHeight: 1.05,
      }}
    >
      Four groups. Twelve finalists. Three winners.
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 36px 1fr 36px 1fr 36px 1fr',
        alignItems: 'stretch',
        flex: 1,
        maxWidth: 1680,
        minHeight: 0,
      }}
    >
      <Steps>
        <Step>
          <FormatStage {...FORMAT_STAGES[0]} />
        </Step>
        <Step>
          <BracketConnector />
        </Step>
        <Step>
          <FormatStage {...FORMAT_STAGES[1]} />
        </Step>
        <Step>
          <BracketConnector />
        </Step>
        <Step>
          <FormatStage {...FORMAT_STAGES[2]} />
        </Step>
        <Step>
          <BracketConnector />
        </Step>
        <Step>
          <FormatStage {...FORMAT_STAGES[3]} />
        </Step>
      </Steps>
    </div>
    <div
      style={{
        marginTop: 28,
        padding: '22px 32px',
        borderRadius: 14,
        maxWidth: 1680,
        background: accentWash,
        border: `1px solid ${accentSoft}`,
      }}
    >
      <p style={{ fontSize: 28, lineHeight: 1.4, margin: 0, color: muted }}>
        <span style={{ color: 'var(--osd-text)' }}>
          Show the product working.
        </span>{' '}
        Make the problem and value clear.
      </p>
    </div>
    <Footer />
  </div>
);

const SCORE_ROWS = [
  {
    n: '01',
    label: 'Execution',
    question: 'Does it work? What was actually built?',
    weight: '1–5 × 2',
  },
  {
    n: '02',
    label: 'Usefulness',
    question: 'Is the problem real, and would someone use this?',
    weight: '1–5 × 1',
  },
  {
    n: '03',
    label: 'Clarity',
    question: 'Can we understand the demo and why it matters?',
    weight: '1–5 × 1',
  },
] as const;

const Scoring: Page = () => (
  <div
    style={{
      ...canvas,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Corners inset={14} />
    <Eyebrow>judging</Eyebrow>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        margin: '12px 0 28px',
        lineHeight: 1.05,
      }}
    >
      Working product first.
    </h2>
    <div style={{ flex: 1, maxWidth: 1680, minHeight: 0 }}>
      {SCORE_ROWS.map((row) => (
        <div
          key={row.n}
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 200px',
            gap: 28,
            alignItems: 'baseline',
            padding: '26px 0',
            borderBottom: `1px solid ${line}`,
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 22,
              color: 'var(--osd-accent)',
              letterSpacing: '0.06em',
            }}
          >
            {row.n} · {row.label}
          </span>
          <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25 }}>
            {row.question}
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 28,
              color: 'var(--osd-accent)',
              letterSpacing: '0.04em',
              textAlign: 'right',
            }}
          >
            {row.weight}
          </span>
        </div>
      ))}
      <div
        style={{
          marginTop: 32,
          padding: '24px 32px',
          borderRadius: 14,
          background: accentWash,
          border: `1px solid ${accentSoft}`,
        }}
      >
        <p
          style={{
            fontFamily: mono,
            fontSize: 28,
            lineHeight: 1.4,
            margin: 0,
            color: 'var(--osd-text)',
            letterSpacing: '0.02em',
          }}
        >
          Total = (Execution × 2) + Usefulness + Clarity · Max 20
        </p>
      </div>
      <p
        style={{
          fontSize: 26,
          color: muted,
          margin: '22px 0 0',
          lineHeight: 1.4,
        }}
      >
        Working focused tool ·{' '}
        <span style={{ color: 'var(--osd-text)' }}>4×2 + 4 + 5 = 17/20</span>
      </p>
      <p
        style={{
          fontFamily: mono,
          fontSize: 20,
          color: dim,
          margin: '18px 0 0',
          letterSpacing: '0.06em',
        }}
      >
        1 missing · 3 solid · 5 standout
      </p>
    </div>
    <Footer />
  </div>
);

export default [
  Opening,
  Agenda,
  Jury,
  Crew,
  Thanks,
  Format,
  Scoring,
] satisfies Page[];
