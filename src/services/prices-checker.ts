import axios from './axios';

import { PriceCheckerInterface } from '../interfaces/barcode.interface'



export class PriceChecker {

    static getPriceasync = async (barcode: PriceCheckerInterface) => {
       return await axios.post('/api/get-products-barcode', barcode)
    }
}

