import { Temporal } from '@js-temporal/polyfill'
import { RRuleTemporal } from 'rrule-temporal'
import { safelyParseJSON } from './utils'

type Freq = ReturnType<(typeof RRuleTemporal)['prototype']['options']>['freq']

function mapByDayToRRule(byDay: string): string | null {
  const dayMap: { [key: string]: string } = {
    'https://schema.org/Monday': 'MO',
    'https://schema.org/Tuesday': 'TU',
    'https://schema.org/Wednesday': 'WE',
    'https://schema.org/Thursday': 'TH',
    'https://schema.org/Friday': 'FR',
    'https://schema.org/Saturday': 'SA',
    'https://schema.org/Sunday': 'SU',
  }
  return dayMap[byDay] || null
}

export function LdJsonToRRule(ldJson: string): string {
  const obj = safelyParseJSON(ldJson)
  if (!obj) return ''

  if (obj['@type'] !== 'Event' || !obj.eventSchedule) {
    console.error('Invalid schema.org Event with Schedule')
    return ''
  }

  const schedule = obj.eventSchedule
  if (schedule['@type'] !== 'Schedule') {
    console.error('Invalid schema.org Schedule')
    return ''
  }

  // Extract relevant fields
  const startDate = schedule.startDate // e.g., "2017-01-01"
  const endDate = schedule.endDate // e.g., "2017-12-31"

  const repeatFrequency = schedule.repeatFrequency // e.g., "P1W"
  const repeatCount = schedule.repeatCount // e.g., 10
  const byDay = mapByDayToRRule(schedule.byDay) // e.g., "https://schema.org/Wednesday"
  const byMonth = schedule.byMonth // e.g., 1
  const byMonthDay = schedule.byMonthDay // e.g., 15
  const byMonthWeek = schedule.byMonthWeek // e.g., 2

  const startTime = schedule.startTime // e.g., "19:00:00"
  const endTime = schedule.endTime // e.g., "20:00:00"

  const scheduleTimezone = schedule.scheduleTimezone

  ;(
    ['startDate', 'repeatFrequency', 'startTime', 'scheduleTimezone'] as const
  ).forEach((field) => {
    if (!schedule[field]) {
      console.error(`Missing required field: ${field}`)
      return ''
    }
  })

  // Map repeatFrequency to RRule freq and interval
  let frequency: Freq | '' = ''
  let interval = 1

  const duration = Temporal.Duration.from(repeatFrequency)

  if (!duration.toString()) {
    console.error('Invalid repeatFrequency format')
    return ''
  }

  if (duration.weeks > 0) {
    frequency = 'WEEKLY'
    interval = duration.weeks
  } else if (duration.days > 0) {
    frequency = 'DAILY'
    interval = duration.days
  } else if (duration.months > 0) {
    frequency = 'MONTHLY'
    interval = duration.months
  } else if (duration.years > 0) {
    frequency = 'YEARLY'
    interval = duration.years
  } else {
    console.error('Unsupported repeatFrequency')
    return ''
  }

  const dtstart = Temporal.PlainDate.from(startDate).toZonedDateTime({
    timeZone: scheduleTimezone,
    plainTime: Temporal.PlainTime.from(startTime),
  })

  const dtend = endDate
    ? Temporal.PlainDate.from(endDate).toZonedDateTime({
        timeZone: scheduleTimezone,
        plainTime: endTime
          ? Temporal.PlainTime.from(endTime)
          : Temporal.PlainTime.from(startTime).add(
              Temporal.Duration.from(schedule.duration || 'PT1H')
            ),
      })
    : undefined

  const rule = new RRuleTemporal({
    dtstart,
    until: dtend,
    freq: frequency,
    interval,
    byDay: byDay ? [byDay] : undefined,
    byMonth: byMonth ? [byMonth] : undefined,
    byMonthDay: byMonthDay ? [byMonthDay] : undefined,
    bySetPos: byMonthWeek ? [byMonthWeek] : undefined,
    count: repeatCount ? repeatCount : undefined,
    tzid: scheduleTimezone || Temporal.Now.timeZoneId(),
  })

  return rule.toString()
}
