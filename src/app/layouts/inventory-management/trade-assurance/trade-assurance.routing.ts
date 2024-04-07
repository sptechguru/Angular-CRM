import { Routes } from '@angular/router';
import { TradeassuranceListComponent } from './tradeassurance-list/tradeassurance-list.component';


export const tradeAssuranceRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: TradeassuranceListComponent
        }
    ]
},

]
