import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutes } from './feedback.routing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        FormsModule,
        AppCommonModule,
        FeedbackRoutes
    ],
    declarations: [
        FeedbackComponent
    ]
})
export class FeedbackModule { }