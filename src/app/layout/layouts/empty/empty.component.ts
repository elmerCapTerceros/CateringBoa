import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErpLoadingBarComponent } from '@erp/components/loading-bar';
import { Subject } from 'rxjs';

@Component({
    selector: 'empty-layout',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [ErpLoadingBarComponent, RouterOutlet]
})
export class EmptyLayoutComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
