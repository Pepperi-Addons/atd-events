import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader'

import { ActivityEventsComponent } from './index';

import { config } from '../addon.config';
import { EventsService } from '../services/events.service';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
export const routes: Routes = [
    {
        path: '',
        component: ActivityEventsComponent
    }
];
@NgModule({
    declarations: [ActivityEventsComponent],
    imports: [
        CommonModule,
        PepRemoteLoaderModule,
        PepGenericListModule,
        PepPageLayoutModule,
        PepButtonModule,
        PepSizeDetectorModule,
        PepTopBarModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) =>
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [ActivityEventsComponent],
    providers: [
        TranslateStore,
        EventsService
        // Add here all used services.
    ]
})
export class ActivityEventsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
