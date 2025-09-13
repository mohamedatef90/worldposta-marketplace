import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { AuthService } from '../../services/auth.service';
import { MarketplaceItem, Category } from '../../models/marketplace.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './configure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private marketplaceService = inject(MarketplaceService);
  private authService = inject(AuthService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  item = signal<MarketplaceItem | undefined>(undefined);
  categories = signal<Category[]>([]);
  
  activeTab = signal<'overview' | 'configure' | 'reviews'>('overview');
  
  selectedStorage = signal(50);
  selectedRam = signal(4);
  selectedBandwidth = signal(2);
  selectedOS = signal('');

  category = computed(() => {
    const itemCategory = this.item()?.category;
    if (!itemCategory) return undefined;
    return this.categories().find(c => c.id === itemCategory);
  });

  basePrice = computed(() => {
    return this.item()?.price.base ?? 0;
  });

  storagePrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedStorage() * currentItem.price.storagePerGB;
  });

  ramPrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedRam() * currentItem.price.ramPerGB;
  });

  bandwidthPrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedBandwidth() * currentItem.price.bandwidthPerTB;
  });

  totalPrice = computed(() => {
    return this.basePrice() + this.storagePrice() + this.ramPrice() + this.bandwidthPrice();
  });

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.marketplaceService.getItemById(itemId).subscribe(item => {
        if (item) {
          this.item.set(item);
          if (item.osOptions.length > 0) {
            this.selectedOS.set(item.osOptions[0]);
          }
        }
      });
    }
    this.marketplaceService.getCategories().subscribe(cats => this.categories.set(cats));
  }
  
  setActiveTab(tab: 'overview' | 'configure' | 'reviews') {
    this.activeTab.set(tab);
  }

  onStorageChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedStorage.set(Number(value));
  }
  
  onRamChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedRam.set(Number(value));
  }

  onBandwidthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedBandwidth.set(Number(value));
  }

  onOsChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedOS.set(value);
  }

  proceed() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/register']);
    }
  }
  
  sanitizeIcon(svgContent: string | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent || '');
  }
}
