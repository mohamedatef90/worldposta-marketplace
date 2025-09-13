import {
  Component,
  ChangeDetectionStrategy,
  signal,
  AfterViewInit,
  OnDestroy,
  viewChildren,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface DocSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent implements AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private observer!: IntersectionObserver;

  sectionElements = viewChildren<ElementRef>('sectionEl');
  activeSectionId = signal<string>('introduction');

  readonly sections: DocSection[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `
        <p>Welcome to the WorldPosta Marketplace documentation. This guide provides everything you need to know about browsing, configuring, and deploying applications from our marketplace. Our goal is to make cloud deployment as simple and efficient as possible.</p>
        <p>The marketplace is a curated collection of pre-configured virtual machines and services, optimized for performance and security on WorldPosta's robust infrastructure.</p>
      `,
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: `
        <h3>1. Creating an Account</h3>
        <p>To deploy an application, you first need a WorldPosta account. If you don't have one, you can sign up from the main page. The process is quick and requires only basic information.</p>
        <h3>2. Browsing the Marketplace</h3>
        <p>The marketplace homepage features popular applications and allows you to browse by category. You can also use the search bar to find specific software. Each application listing provides a description, rating, and starting price.</p>
        <h3>3. Configuring and Deploying</h3>
        <p>Once you select an application, you'll be taken to the configuration page. Here you can customize your instance by selecting:</p>
        <ul>
          <li>Operating System</li>
          <li>Storage (SSD)</li>
          <li>RAM</li>
          <li>Bandwidth</li>
        </ul>
        <p>The price will update in real-time as you adjust the configuration. Once you're satisfied, click "Get It Now" to proceed to payment and deployment.</p>
      `,
    },
    {
      id: 'managing-instances',
      title: 'Managing Instances',
      content: `
        <p>After deployment, your new virtual machine instance will appear in your WorldPosta dashboard under "My Account". From the dashboard, you can:</p>
        <ul>
          <li>Start, stop, and reboot your instance.</li>
          <li>Access connection details (IP address, credentials).</li>
          <li>Monitor resource usage (CPU, memory, disk I/O).</li>
          <li>Set up automated backups and snapshots.</li>
        </ul>
        <p>All management functions are designed to be intuitive, giving you full control over your cloud resources without a steep learning curve.</p>
      `,
    },
    {
      id: 'billing-payments',
      title: 'Billing & Payments',
      content: `
        <p>WorldPosta Marketplace uses a pay-as-you-go model. You are billed monthly for the resources you consume. Your estimated monthly cost is shown on the configuration page.</p>
        <p>You can manage your payment methods and view your billing history from the "Billing" section of your account dashboard. We accept all major credit cards.</p>
      `,
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      content: `
        <p>For advanced users and automation, the WorldPosta API provides programmatic access to manage your marketplace resources. You can use the API to deploy, manage, and scale your instances.</p>
        <p>Here's an example of how to deploy a new instance using our API:</p>
        <pre><code class="language-bash">curl -X POST https://api.worldposta.com/v1/instances \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "itemId": "wordpress-vm",
    "region": "us-east-1",
    "config": {
      "storage": 50,
      "ram": 4,
      "os": "Ubuntu 22.04 LTS"
    }
  }'</code></pre>
        <p>Full API documentation, including all endpoints and parameters, is available at <a href="#">api.worldposta.com/docs</a>.</p>
      `,
    },
  ];

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(this.handleIntersection, {
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is in the middle 20% of the viewport
      threshold: 0,
    });
    this.sectionElements().forEach(el => this.observer.observe(el.nativeElement));
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.activeSectionId.set(entry.target.id);
      }
    });
  };

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Manually set for instant feedback, observer will correct if needed
      this.activeSectionId.set(id);
    }
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
