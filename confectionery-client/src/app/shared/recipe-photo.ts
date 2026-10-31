import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { Pastry } from './pastry';

/** The recipe's photo, or its line drawing when there is no photo (or it fails to load). */
@Component({
  selector: 'app-recipe-photo',
  imports: [Pastry],
  template: `
    @if (src(); as url) {
      <img [src]="url" [alt]="name() ?? ''" loading="lazy" (error)="src.set(null)" />
    } @else {
      <app-pastry [name]="name()" />
    }
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: var(--photo-ratio, 4 / 3);
      overflow: hidden;
      background: var(--bg-soft);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s var(--ease);
    }
    app-pastry {
      --pastry-icon: 34%;
      width: 100%;
      height: 100%;
      border-radius: 0;
      color: var(--text-muted);
      background: transparent;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipePhoto {
  readonly image = input<string | null | undefined>(null);
  readonly name = input<string | null | undefined>('');

  protected readonly src = linkedSignal(() => this.image() || null);
}

/** Reads an image file and shrinks it to a JPEG data URL, so it can be saved with the recipe. */
export function imageFileToDataUrl(file: File, maxSide = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('not an image'));
    };
    img.src = url;
  });
}
