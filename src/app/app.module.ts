import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AppComponent } from './app.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductService } from './services/product.service';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { UserRegisterComponent } from './user/user-register/userRegister.component';
import { UserLoginComponent } from './user/user-login/userLogin.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

const appRoutes: Routes = [
  {path: '', component: ProductListComponent},
  {path: 'robots', component: ProductListComponent},
  {path: 'add-product', component: AddProductComponent},
  {path: 'product-detail/:id', component: ProductDetailComponent},
  {path: 'user/login', component: UserLoginComponent},
  {path: 'user/register', component: UserRegisterComponent},
  {path: '**', component: ProductListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    ProductListComponent,
      NavBarComponent,
      AddProductComponent,
      ProductDetailComponent,
      UserRegisterComponent,
      UserLoginComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [ProductService,
              UserService,
              AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
