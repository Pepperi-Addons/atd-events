import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, Component, DoBootstrap, Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ActivityEventsComponent, ActivityEventsModule } from './activity-events';
import { RouterModule, Routes } from '@angular/router';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { config } from './addon.config';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';

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
        HttpClientModule,
        PepNgxLibModule,
        ActivityEventsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        }),
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        //AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(private addonService: PepAddonService,
        private injector: Injector) { }

    ngDoBootstrap(): void {
        this.addonService.defineCustomElement(`atd-events-element-${config.AddonUUID}`, ActivityEventsComponent, this.injector);
    }
 }
