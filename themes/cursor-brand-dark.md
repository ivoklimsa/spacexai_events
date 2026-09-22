---
name: Cursor Brand Dark
description: Dark Cursor event deck — warm near-black, orange accent, letter-scramble titles, corner brackets
mode: dark
---

# Cursor Brand Dark

## Palette

| Role   | Value                | Notes                         |
| ------ | -------------------- | ----------------------------- |
| bg     | `#14120b`            | warm near-black canvas        |
| text   | `#edecec`            | primary copy                  |
| accent | `#f54e00`            | Cursor orange                 |
| muted  | `rgb(237 236 236 / 0.6)` | secondary copy / eyebrows |
| dim    | `rgb(237 236 236 / 0.32)` | footer / inactive            |
| panel  | `#1b1913`            | inset panels                  |
| line   | `rgb(237 236 236 / 0.1)` | hairline dividers            |

## Typography

- Display font: `"Cursor Gothic", "Helvetica Neue", Helvetica, system-ui, sans-serif` — weight 800 for headlines.
- Body font: same Cursor Gothic stack.
- Mono: `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace` for eyebrows, times, footer.
- Type-scale overrides:
  - Hero title: 120 px
  - Section heading: 58 px
  - Body text: 30–36 px

## Layout

- Content padding: 88–120 px from canvas edges (1920 × 1080).
- Alignment: left-aligned, single column.
- Corner bracket chrome at slide insets (48 px on heroes, 14 px on content).

## Fixed components

### Title

```tsx
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
```

### Footer

```tsx
import { useSlidePageNumber } from '@open-slide/core';

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
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 18,
        letterSpacing: '0.12em',
        color: 'rgb(237 236 236 / 0.32)',
      }}
    >
      <span>cursor hackathon · prague #1</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

### Eyebrow

```tsx
const Eyebrow = ({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <span
    style={{
      fontFamily: 'ui-monospace, Menlo, monospace',
      fontSize: 20,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: accent ? 'var(--osd-accent)' : 'rgb(237 236 236 / 0.6)',
    }}
  >
    {children}
  </span>
);
```

## Motion

- Philosophy: rich — letter scramble on heroes, short fade-up on supporting copy.
- Scramble charset: `!<>-_\/[]{}=+*^?#01`, ~22 ticks at 28 ms, respect `prefers-reduced-motion`.

## Aesthetic

Cursor community-event stage deck: warm dark field, orange accent, monospace chrome, diamond mark, corner brackets. No cards-as-decoration, no purple gradients, no soft pastel UI kits.

## Example usage

```tsx
const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      padding: '0 120px 100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Eyebrow>30 . 09 . 2026 · PRAGUE</Eyebrow>
    <Title>Cursor Hackathon</Title>
    <Footer />
  </div>
);
```
