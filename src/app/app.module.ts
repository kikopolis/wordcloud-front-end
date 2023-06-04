import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SendformComponent } from './sendform/sendform.component';
import { HomeComponent } from './home/home.component';
import { CloudComponent } from './cloud/cloud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InprogressComponent } from './inprogress/inprogress.component';
import { TagCloudComponent } from "angular-tag-cloud-module";

@NgModule({
    declarations: [
        AppComponent,
        SendformComponent,
        HomeComponent,
        CloudComponent,
        InprogressComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        TagCloudComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
