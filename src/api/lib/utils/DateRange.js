class DateRange {
  constructor (date = new Date()) {
    this.date = new Date(date) // Asegura que sea un objeto Date
  }

  getStartOfDay () {
    const start = new Date(this.date)
    start.setHours(0, 0, 0, 0)
    return start
  }

  getEndOfDay () {
    const end = new Date(this.date)
    end.setHours(23, 59, 59, 999)
    return end
  }

  getRange () {
    return {
      start: this.getStartOfDay(),
      end: this.getEndOfDay()
    }
  }
}

export default DateRange
