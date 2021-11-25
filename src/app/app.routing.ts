import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P403Component } from './views/error/403.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';

import { AuthGuard } from './_guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '403',
    component: P403Component,
    data: {
      title: 'Page 403'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'password/reset',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: './views/base/base.module#BaseModule'
      },
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'subadmin',
        loadChildren: './views/manage-subadmin/subadmin.module#SubadminModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-employers',
        loadChildren: './views/manage-user/manage-user.module#ManageUserModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'profile',
        loadChildren: './views/profile/profile.module#ProfileModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'cms-management',
        loadChildren: './views/cms/cms.module#CmsModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'email-template',
        loadChildren: './views/email-template/email.module#EmailModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'faq',
        loadChildren: './views/faq/faq.module#FaqModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'category',
        loadChildren: './views/manage-category/category.module#CategoryModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'access-management',
        loadChildren: './views/role-permission/role-permission.module#RolePermissionModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: './views/settings/settings.module#SettingsModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'skill-management',
        loadChildren: './views/manage-profile-properties/manage-profile-properties.module#ManageProfilePropertiesModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'help-center-management/categories',
        loadChildren: './views/help-center-categories/hcc.module#HCCModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'help-center-management/questions',
        loadChildren: './views/help-center-questions/hcc.module#HCCModule',
        canActivateChild: [AuthGuard],
      },
      {
       path: 'manage-recommendations',
       loadChildren: './views/manage-recommendations/manage-recommendations.module#ManageRecommendationsModule',
       canActivateChild: [AuthGuard],
      },
      {
        path: 'talent-crew-management',
        loadChildren: './views/talent-crew-management/talent-crew-management.module#TalentCrewManagementModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'jobs-management',
        loadChildren: './views/manage-job/manage-job.module#ManageJobModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'subscription',
        loadChildren: './views/subscription/subscription.module#SubscriptionModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'subscription-permission',
        loadChildren: './views/subscription-permission/subscription-permission.module#SubPermissionModule',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'receipt',
        loadChildren: './views/receipt/receipt.module#ReceiptModule',
        canActivateChild: [AuthGuard],
      },
      // {
      //   path: 'test',
      //   loadChildren: './views/test/test.module#TestModule',
      //   canActivateChild: [AuthGuard],
      // },
    ]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
