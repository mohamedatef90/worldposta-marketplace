import { Component, ChangeDetectionStrategy, signal, inject, computed, OnInit, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplaceItem, Category } from '../../models/marketplace.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-market-apps',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-market-apps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllMarketAppsComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);

  private paramMap = toSignal(this.route.paramMap);

  items = signal<MarketplaceItem[]>([]);
  categories = signal<Category[]>([]);
  
  // Pagination state
  readonly pageSize = 25;
  currentPage = signal(1);

  selectedCategoryId = computed(() => this.paramMap()?.get('id') ?? '');

  selectedCategory = computed(() => {
    const catId = this.selectedCategoryId();
    return this.categories().find(c => c.id === catId);
  });

  filteredItems = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return [];
    return this.items()
      .filter(item => item.category === categoryId)
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  });

  // Pagination computed values
  totalItems = computed(() => this.filteredItems().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize));

  paginatedItems = computed(() => {
    const items = this.filteredItems();
    const page = this.currentPage();
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return items.slice(startIndex, endIndex);
  });

  // For pagination controls
  pages = computed<(number | string)[]>(() => {
    const total = this.totalPages();
    if (total <= 1) return [];

    const current = this.currentPage();
    const delta = 1;
    const rangeSet = new Set<number>();
    
    rangeSet.add(1);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i > 1 && i < total) {
        rangeSet.add(i);
      }
    }
    rangeSet.add(total);
    
    const range = Array.from(rangeSet).sort((a,b) => a - b);
    
    const rangeWithDots: (number | string)[] = [];
    let last: number | undefined;

    for (const page of range) {
      if (last !== undefined) {
        if (page - last > 1) {
          if (page - last > 2) {
             rangeWithDots.push('...');
          } else if (page - last === 2) {
             rangeWithDots.push(last + 1);
          }
        }
      }
      rangeWithDots.push(page);
      last = page;
    }

    return rangeWithDots;
  });

  constructor() {
    effect(() => {
      // When category changes, reset to the first page.
      this.selectedCategoryId();
      this.currentPage.set(1);
    });
  }

  ngOnInit() {
    this.marketplaceService.getItems().subscribe(items => this.items.set(items));
    this.marketplaceService.getCategories().subscribe(categories => this.categories.set(categories));
  }

  sanitizeIcon(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  formatDownloads(downloads: number | undefined): string {
    if (!downloads) return '';
    if (downloads >= 10000) {
      return (downloads / 1000).toFixed(0) + 'k';
    }
    if (downloads >= 1000) {
      return (downloads / 1000).toFixed(1) + 'k';
    }
    return downloads.toString();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
}
