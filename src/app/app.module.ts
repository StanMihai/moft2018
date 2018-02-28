import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { environment } from '../environments/environment';

import { RestDataService } from './rest-data.service';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    AppComponent,    
    LandingComponent,    
    NavbarComponent,
    FooterComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,    
    NgbModule.forRoot(),
    ScrollToModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule    
  ],
  entryComponents: [ ModalComponent ],
  providers: [ RestDataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
