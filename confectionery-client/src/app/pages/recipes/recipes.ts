import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DIFFICULTIES, difficultyLabel, lines, normalizeDifficulty } from '../../core/format';
import { Difficulty, Recipe, RecipeInput } from '../../core/models';
import { RecipeService } from '../../core/services/api.services';
import { ConfirmService, ToastService } from '../../core/services/ui.services';
import { Icon } from '../../shared/icon';
import { Modal } from '../../shared/modal';
import { RecipePhoto, imageFileToDataUrl } from '../../shared/recipe-photo';

type SortKey = 'name' | 'price' | 'prepTime';

@Component({
  selector: 'app-recipes',
  imports: [ReactiveFormsModule, CurrencyPipe, Icon, Modal, RecipePhoto],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPage {
  private readonly api = inject(RecipeService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly difficulties = DIFFICULTIES;
  protected readonly difficultyLabel = difficultyLabel;
  protected readonly normalizeDifficulty = normalizeDifficulty;
  protected readonly lines = lines;

  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);

  protected readonly query = signal('');
  protected readonly difficulty = signal<Difficulty | 'all'>('all');
  protected readonly sort = signal<SortKey>('name');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const d = this.difficulty();
    const key = this.sort();
    return this.recipes()
      .filter(
        (r) =>
          !q ||
          r.name?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.ingredients?.toLowerCase().includes(q),
      )
      .filter((r) => d === 'all' || normalizeDifficulty(r.difficulty) === d)
      .sort((a, b) =>
        key === 'name' ? (a.name ?? '').localeCompare(b.name ?? '', 'he') : (a[key] ?? Infinity) - (b[key] ?? Infinity),
      );
  });

  /** Recipe opened in the read view (ingredients + steps). */
  protected readonly viewing = signal<Recipe | null>(null);

  protected readonly editorOpen = signal(false);
  protected readonly editing = signal<Recipe | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    prepTime: this.fb.control<number | null>(null, [Validators.min(1), Validators.max(1440)]),
    difficulty: this.fb.control<Difficulty | ''>(''),
    price: this.fb.control<number | null>(null, [Validators.min(0)]),
    description: ['', Validators.maxLength(160)],
    imageUrl: [''],
    ingredients: ['', Validators.maxLength(4000)],
    instructions: ['', Validators.maxLength(8000)],
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.api
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.recipes.set(list ?? []),
        error: () => this.loadFailed.set(true),
      });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.editorOpen.set(true);
  }

  protected openEdit(recipe: Recipe): void {
    this.editing.set(recipe);
    this.form.reset({
      name: recipe.name,
      prepTime: recipe.prepTime ?? null,
      difficulty: normalizeDifficulty(recipe.difficulty) ?? '',
      price: recipe.price ?? null,
      description: recipe.description ?? '',
      imageUrl: recipe.imageUrl ?? '',
      ingredients: recipe.ingredients ?? '',
      instructions: recipe.instructions ?? '',
    });
    this.viewing.set(null);
    this.editorOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: RecipeInput = {
      name: v.name.trim(),
      prepTime: v.prepTime,
      difficulty: v.difficulty || null,
      price: v.price,
      description: v.description.trim() || null,
      imageUrl: v.imageUrl || null,
      ingredients: v.ingredients.trim() || null,
      instructions: v.instructions.trim() || null,
    };
    const current = this.editing();
    const request = current ? this.api.update(current.id, { ...body, id: current.id }) : this.api.create(body);

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe(() => {
      this.toast.success(current ? `"${body.name}" עודכן בהצלחה` : `"${body.name}" נוסף לקטלוג`);
      this.editorOpen.set(false);
      this.load();
    });
  }

  protected async pickImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      this.form.controls.imageUrl.setValue(await imageFileToDataUrl(file));
    } catch {
      this.toast.error('לא הצלחנו לקרוא את הקובץ. נסו תמונה אחרת.');
    }
  }

  protected openView(recipe: Recipe): void {
    this.viewing.set(recipe);
  }

  protected async remove(recipe: Recipe): Promise<void> {
    const ok = await this.confirm.ask({
      title: 'מחיקת מתכון',
      message: `למחוק את "${recipe.name}" מהקטלוג? אי אפשר לבטל את הפעולה.`,
      confirmText: 'כן, למחוק',
      danger: true,
    });
    if (!ok) return;
    this.viewing.set(null);
    this.api.remove(recipe.id).subscribe(() => {
      this.recipes.update((list) => list.filter((r) => r.id !== recipe.id));
      this.toast.success('המתכון נמחק');
    });
  }

  protected setSort(value: string): void {
    this.sort.set(value as SortKey);
  }

  protected hasError(control: 'name' | 'prepTime' | 'price' | 'description', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
