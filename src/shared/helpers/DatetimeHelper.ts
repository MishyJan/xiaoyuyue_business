import { Moment } from 'moment';

const moment = require('moment');
export class DatetimeHelper {
    static localDatetime(utcDatetime: string): string {
        let localDatetimeString = moment.utc(utcDatetime).local().format("YYYY-MM-DD HH:mm:ss");
        return localDatetimeString;
    }
}