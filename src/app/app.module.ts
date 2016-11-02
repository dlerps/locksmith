import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { PwGeneratorComponent } from './components/pw-generator/pw-generator.component';
import { PasswordGenService } from "./services"

@NgModule({
  declarations: [
    AppComponent,
    PwGeneratorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule
  ],
  providers: [PasswordGenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
