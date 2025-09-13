
import { Routes } from '@angular/router';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentComponent } from './components/payment/payment.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AllMarketAppsComponent } from './components/all-market-apps/all-market-apps.component';
import { DocsComponent } from './components/docs/docs.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: MarketplaceComponent,
    pathMatch: 'full',
  },
  {
    path: 'configure/:id',
    component: ConfigureComponent,
  },
  {
    path: 'category/:id',
    component: AllMarketAppsComponent,
  },
  {
    path: 'docs',
    component: DocsComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
