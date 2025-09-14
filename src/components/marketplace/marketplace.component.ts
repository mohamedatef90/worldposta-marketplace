import { Component, ChangeDetectionStrategy, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplaceItem, Category } from '../../models/marketplace.model';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [RouterLink, CommonModule, NgOptimizedImage],
  templateUrl: './marketplace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  private marketplaceService = inject(MarketplaceService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  items = signal<MarketplaceItem[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string>('popular');
  searchTerm = signal<string>('');

  // --- Start of slider logic ---
  currentSlideIndex = signal(0);
  private sliderIntervalId: any;
  
  slides = computed(() => {
    const firstCatId = this.firstCategoryId();
    if (!firstCatId) return []; // Return empty array until categories are loaded
    return [
      {
        type: 'image',
        imageSrc: 'https://i.postimg.cc/g299tYj1/market.png',
        title: 'WorldPosta Marketplace',
        description: 'Deploy pre-configured apps and services on WorldPosta\'s reliable cloud infrastructure in just a few clicks.',
        buttonText: 'Explore All Apps',
        buttonLink: ['/category', firstCatId]
      },
      {
        type: 'image',
        imageSrc: 'https://i.postimg.cc/266CGSr5/automation.png',
        title: 'Automate Your Workflows',
        description: 'Connect any app, design powerful workflows, and automate your work without writing a single line of code with tools like n8n.',
        buttonText: 'Explore Automation Apps',
        buttonLink: ['/category', 'automation-integration']
      },
      {
        type: 'image',
        imageSrc: 'https://i.postimg.cc/zBZzYnxS/Online-Project-Analyst-Vector-Illustration.png',
        title: 'Discover Top-Rated Apps',
        description: 'Explore a rich ecosystem of powerful and trusted applications. Find bestsellers and spotlight apps to enhance your projects.',
        buttonText: 'Browse Popular Apps',
        buttonLink: ['/category', 'cms-publishing']
      }
    ];
  });
  // --- End of slider logic ---

  // --- Start of typing animation logic ---
  private readonly placeholderTexts = [
    'Search for apps...',
    'Search for databases...',
    'Search for machine learning...',
    'Search for security tools...',
    'Search for operating systems...',
  ];
  animatedPlaceholder = signal('');
  private textIndex = 0;
  private isDeleting = false;
  private typingTimeoutId: any;
  // --- End of typing animation logic ---

  firstCategoryId = computed(() => {
    const cats = this.categories();
    return cats.length > 0 ? cats[0].id : undefined;
  });

  private allItemsInCategory = computed(() => {
    const category = this.selectedCategory();
    const allItems = this.items();
    if (category === 'popular') {
      const topItems = new Map<string, MarketplaceItem>();
      for (const item of allItems) {
        const existing = topItems.get(item.category);
        if (!existing || item.rating > existing.rating || (item.rating === existing.rating && item.reviews > existing.reviews)) {
          topItems.set(item.category, item);
        }
      }
      return Array.from(topItems.values());
    }
    return allItems.filter(item => item.category === category);
  });

  private searchedItems = computed(() => {
      const term = this.searchTerm().toLowerCase();
      const items = this.allItemsInCategory();
      if (!term) {
          return items;
      }
      return items.filter(item => 
          item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
      );
  });

  filteredItems = computed(() => {
      const category = this.selectedCategory();
      const term = this.searchTerm();
      const items = this.searchedItems();

      const sorted = [...items].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

      if (category !== 'popular' && !term) {
          return sorted.slice(0, 6);
      }
      return sorted;
  });

  hasMoreItems = computed(() => {
      const category = this.selectedCategory();
      if (category === 'popular' || this.searchTerm()) {
        return false;
      }
      return this.allItemsInCategory().length > 6;
  });

  selectedCategoryInfo = computed(() => {
      const catId = this.selectedCategory();
      return this.categories().find(c => c.id === catId);
  });

  ngOnInit() {
    this.marketplaceService.getItems().subscribe(items => this.items.set(items));
    this.marketplaceService.getCategories().subscribe(categories => this.categories.set(categories));
    this.startSlider();
    this.type();
  }
  
  ngOnDestroy() {
    clearTimeout(this.typingTimeoutId);
    clearInterval(this.sliderIntervalId);
  }

  private startSlider() {
    this.sliderIntervalId = setInterval(() => {
      this.nextSlide(false); // Auto-play doesn't reset timer
    }, 5000);
  }

  nextSlide(manual = true) {
    this.currentSlideIndex.update(i => (i + 1) % this.slides().length);
    if (manual) {
      clearInterval(this.sliderIntervalId);
      this.startSlider();
    }
  }

  prevSlide() {
    this.currentSlideIndex.update(i => (i - 1 + this.slides().length) % this.slides().length);
    clearInterval(this.sliderIntervalId);
    this.startSlider();
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
    clearInterval(this.sliderIntervalId);
    this.startSlider();
  }

  private type() {
    const currentWord = this.placeholderTexts[this.textIndex];
    const currentPlaceholder = this.animatedPlaceholder();
    let delay = 150;

    if (this.isDeleting) {
      // Deleting
      this.animatedPlaceholder.set(currentWord.substring(0, currentPlaceholder.length - 1));
      delay = 100;
    } else {
      // Typing
      this.animatedPlaceholder.set(currentWord.substring(0, currentPlaceholder.length + 1));
    }

    const updatedPlaceholder = this.animatedPlaceholder();

    // Condition to switch to deleting
    if (!this.isDeleting && updatedPlaceholder.length === currentWord.length) {
      delay = 800; // Pause after typing
      this.isDeleting = true;
    } 
    // Condition to switch to typing next word
    else if (this.isDeleting && updatedPlaceholder.length === 0) {
      delay = 500; // Pause before typing next word
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.placeholderTexts.length;
    }

    this.typingTimeoutId = setTimeout(() => this.type(), delay);
  }

  selectCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
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
}