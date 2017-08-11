import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordGenService } from "./services";

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { PwGeneratorComponent } from './components/pw-generator/pw-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PwGeneratorComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    NgbAlertModule
  ],
  providers: [
    PasswordGenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
