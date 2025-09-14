import { Component, ChangeDetectionStrategy, inject, signal, OnInit, viewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { Category, MarketplaceItem } from '../../models/marketplace.model';

@Component({
  selector: 'app-publishing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publishing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class PublishingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private marketplaceService = inject(MarketplaceService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  publishForm!: FormGroup;
  submissionAttempted = signal(false);
  submissionSuccess = signal(false);
  logoPreview = signal<string | null>(null);
  isOsDropdownOpen = signal(false);

  osDropdownContainer = viewChild<ElementRef>('osDropdownContainer');

  availableOsOptions: string[] = [
    'Ubuntu 22.04 LTS',
    'Ubuntu 20.04 LTS',
    'Debian 12',
    'Debian 11',
    'RHEL 9',
    'AlmaLinux 9',
    'Rocky Linux 9',
    'Windows Server 2022',
    'Windows 11 Pro',
    'CentOS Stream 9',
    'Fedora Server 38',
    'openSUSE Leap 15.5',
    'FreeBSD 13.2',
    'Oracle Linux 9',
    'Arch Linux',
  ];

  selectedOsDisplay = computed(() => {
    const selected = this.publishForm?.get('osOptions')?.value as string[];
    if (!selected || selected.length === 0) {
      return 'Select operating systems...';
    }
    if (selected.length === 1) {
      return selected[0];
    }
    return `${selected.length} systems selected`;
  });

  ngOnInit(): void {
    this.marketplaceService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    this.publishForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      provider: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      longDescription: ['', [Validators.required, Validators.minLength(50)]],
      logo: [null, [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      osOptions: [[], [Validators.required]],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.logoPreview.set(reader.result as string);
          this.publishForm.patchValue({ logo: reader.result as string });
          this.publishForm.get('logo')?.updateValueAndValidity();
        };
        reader.readAsDataURL(file);
      } else {
        // Handle invalid file type
        this.logoPreview.set(null);
        this.publishForm.patchValue({ logo: null });
        this.publishForm.get('logo')?.setErrors({ invalidFileType: true });
        input.value = ''; // Reset file input
      }
    }
  }

  onSubmit(): void {
    this.submissionAttempted.set(true);
    this.submissionSuccess.set(false);
    
    if (this.publishForm.invalid) {
      return;
    }

    const formValue = this.publishForm.value;

    const newItem: MarketplaceItem = {
      id: `custom-${formValue.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: formValue.name,
      description: formValue.description,
      longDescription: formValue.longDescription,
      category: formValue.category,
      icon: `<img src="${formValue.logo}" alt="${formValue.name} logo" class="w-full h-full object-contain">`,
      price: {
        base: formValue.price,
        storagePerGB: 0.1,
        ramPerGB: 2,
        bandwidthPerTB: 5,
      },
      osOptions: formValue.osOptions,
      rating: 0,
      reviews: 0,
      provider: formValue.provider,
      downloads: 0,
      fortified: false,
    };
    
    this.marketplaceService.addItem(newItem);

    this.submissionSuccess.set(true);
    this.publishForm.reset();
    this.submissionAttempted.set(false);
    this.logoPreview.set(null);
    
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  toggleOsDropdown(): void {
    this.isOsDropdownOpen.update(v => !v);
  }

  isOsSelected(os: string): boolean {
    const selected = this.publishForm.get('osOptions')?.value as string[];
    return selected?.includes(os) ?? false;
  }

  onOsSelectionChange(os: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const currentSelection = [...(this.publishForm.get('osOptions')?.value ?? [])] as string[];

    if (input.checked) {
      if (!currentSelection.includes(os)) {
        currentSelection.push(os);
      }
    } else {
      const index = currentSelection.indexOf(os);
      if (index > -1) {
        currentSelection.splice(index, 1);
      }
    }

    this.publishForm.get('osOptions')?.setValue(currentSelection);
  }
  
  onClickOutside(event: Event) {
    if (this.isOsDropdownOpen() && !this.osDropdownContainer()?.nativeElement.contains(event.target)) {
      this.isOsDropdownOpen.set(false);
    }
  }

  get f() { return this.publishForm.controls; }
}