import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { PasswordGenService } from "./services";

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { SettingsListComponent } from './components/settings-list/settings-list.component';
import { PwGeneratorComponent } from './components/pw-generator/pw-generator.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PwGeneratorComponent,
    SettingsListComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgbAlertModule,
    AngularFontAwesomeModule
  ],
  providers: [
    PasswordGenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
