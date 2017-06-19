import { NgModule } from '@angular/core';
import { AppGridData } from "shared/grid-data-results/grid-data-results";
import { GridDataMock } from "shared/grid-data-results/grid-data-mock";

@NgModule({
    providers: [
        AppGridData,
        GridDataMock
    ]
})
export class GridDataResultsModule { }
