import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { dataList } from './data';

@Injectable({ providedIn: 'root' })
export class CateringMockApi {

    data: any = dataList;
    /**
     * Constructor
     */
    constructor(private _erpMockApiService: ErpMockApiService) {
        // Register Mock API handlers
        this.registerEndPoints();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerEndPoints(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Catering - GET
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onGet('api/catering/list').reply(() => {
            console.warn('api', this.data)
            // Return the response
            return [
                200,
                this.data
            ];
        });
    }
}
