import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, Component, DoBootstrap, Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ActivityEventsComponent, ActivityEventsModule } from './activity-events';
import { RouterModule, Routes } from '@angular/router';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from './addon.config';

@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    { path: '**', component: EmptyRouteComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        ActivityEventsModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [
        //AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(private addonService: PepAddonService,
        private injector: Injector) { }

    ngDoBootstrap(appRef: ApplicationRef): void {
        this.addonService.defineCustomElement(`atd-events-element-${config.AddonUUID}`, ActivityEventsComponent, this.injector);
    }
 }
