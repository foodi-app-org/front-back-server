class DateRange {
  constructor(date = new Date()) {
    const localDate = new Date(date);
    const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
    const colombiaOffset = -5 * 60 * 60000; // UTC-5 horas
    this.date = new Date(utc + colombiaOffset); // Fecha ajustada a Colombia
  }

  getStartOfDay() {
    const start = new Date(this.date);
    start.setUTCHours(0, 0, 0, 0); // 00:00 hora Colombia = 05:00 UTC
    start.setTime(start.getTime() - (5 * 60 * 60 * 1000)); // Restamos 5 horas para ajustarlo a UTC-5
    console.log('start', start)
    return start;
  }

  getEndOfDay() {
    const end = new Date(this.date);
    end.setUTCHours(23, 59, 59, 999); // 23:59 hora Colombia = 04:59 UTC del siguiente día
    end.setTime(end.getTime() - (5 * 60 * 60 * 1000)); // Restamos 5 horas para ajustarlo a UTC-5
    console.log('end', end)
    return end;
  }

  getRange() {
    return {
      start: this.getStartOfDay(),
      end: this.getEndOfDay()
    };
  }
}
export default DateRange;
