export class BusinessHour {
    start: string;
    end: string;

    constructor(start: string = null, end: string = null) {
        this.start = start ? start : '00:00';
        this.end = end ? end : '00:00';
    }

    public GetBusinessHourString(): string {
        return this.start + ' - ' + this.end;
    }
}