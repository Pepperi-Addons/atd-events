import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader'

import { ActivityFlowsComponent } from './index';

import { config } from '../addon.config';
import { EventsService } from '../services/events.service';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { AddFormComponent } from './add-form/add-form.component';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
export const routes: Routes = [
    {
        path: '',
        component: ActivityFlowsComponent
    }
];
@NgModule({
    declarations: [ActivityFlowsComponent, AddFormComponent],
    imports: [
        CommonModule,
        PepRemoteLoaderModule,
        PepGenericListModule,
        PepPageLayoutModule,
        PepButtonModule,
        PepSizeDetectorModule,
        PepTopBarModule,
        PepDialogModule,
        PepSelectModule,
        PepRemoteLoaderModule,
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
    exports: [ActivityFlowsComponent],
    providers: [
        TranslateStore,
        EventsService
        // Add here all used services.
    ]
})
export class ActivityFlowsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
