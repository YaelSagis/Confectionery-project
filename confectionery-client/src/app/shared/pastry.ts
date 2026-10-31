import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

// Line drawings on a 24x24 grid (Lucide-style), one per kind of pastry.
const DRAWINGS = {
  cake: [
    'M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8',
    'M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1',
    'M2 21h20', 'M7 8v3', 'M12 8v3', 'M17 8v3', 'M7 4h.01', 'M12 4h.01', 'M17 4h.01',
  ],
  slice: [
    'M16 13H3', 'M16 17H3',
    'm7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6',
    circle(9, 7, 2),
  ],
  cookie: [
    'M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5',
    'M8.5 8.5v.01', 'M16 15.5v.01', 'M12 12v.01', 'M11 17v.01', 'M7 14v.01',
  ],
  croissant: [
    'm4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z',
    'm10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83',
    'M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4',
    'm14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2',
    'M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5',
  ],
  tart: [
    'M3 12h18',
    'M4 12l1.4 5.6A2 2 0 0 0 7.3 19h9.4a2 2 0 0 0 1.9-1.4L20 12',
    'M7 12c0-2.2 2.2-3.5 5-3.5s5 1.3 5 3.5',
    'M9 15.5v.01', 'M12 15.5v.01', 'M15 15.5v.01',
  ],
  dessert: [
    'M10.162 3.167A10 10 0 0 0 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4-.006 10 10 0 0 0-8.161-9.826',
    'M20.804 14.869a9 9 0 0 1-17.608 0',
    circle(12, 4, 2),
  ],
} satisfies Record<string, string[]>;

type Kind = keyof typeof DRAWINGS;

// First match wins; Hebrew and English names.
const KEYWORDS: [RegExp, Kind][] = [
  [/עוגי|cookie|biscuit|ביסקוו/i, 'cookie'],
  [/קרואס|croissant|מאפה|רוגל|שמרים|danish|pastry/i, 'croissant'],
  [/פאי|טארט|pie|tart|קיש|quiche/i, 'tart'],
  [/מוס|mousse|קינוח|pudding|פודינג|כוס|cup|פנה קוטה|panna/i, 'dessert'],
  [/גבינה|cheese|פרוס|slice|טירמיסו|tiramisu/i, 'slice'],
  [/עוגה|עוגת|cake|טורט/i, 'cake'],
];

/** A line drawing that matches the pastry's name, so the menu doesn't rely on photos. */
@Component({
  selector: 'app-pastry',
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @for (d of paths(); track $index) {
        <svg:path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: var(--pastry-size, 52px);
      height: var(--pastry-size, 52px);
      border-radius: var(--radius);
      color: var(--on-accent);
      background: var(--accent);
    }
    svg {
      width: var(--pastry-icon, 58%);
      height: var(--pastry-icon, 58%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pastry {
  readonly name = input<string | null | undefined>('');

  protected readonly paths = computed(() => DRAWINGS[kindOf(this.name() ?? '')]);
}

function kindOf(name: string): Kind {
  return KEYWORDS.find(([re]) => re.test(name))?.[1] ?? 'cake';
}
