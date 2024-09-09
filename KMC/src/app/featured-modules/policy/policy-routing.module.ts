import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: 'faq',
    component: FAQComponent,
  },
  {
    path: ':slug',
    component: PrivacyPolicyComponent,
  },

  // {
  //   path: 'terms-conditions-policy',
  //   component: PrivacyPolicyComponent,
  // },
  // {
  //   path: 'return-policy',
  //   component: PrivacyPolicyComponent,
  // },
  // {
  //   path: 'points-terms-conditions',
  //   component: PrivacyPolicyComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule {}
