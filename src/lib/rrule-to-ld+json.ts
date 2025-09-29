import { RRuleTemporal } from 'rrule-temporal'
import type { LdJsonByDay, LdJsonEventSchedule } from './types'
import { Temporal } from '@js-temporal/polyfill'
import { mapRRuleToByDay } from './utils'

function freqAndIntervalToIsoDuration(freq: string, interval: number): string {
  const duration = Temporal.Duration.from({
    days: freq === 'DAILY' ? interval : 0,
    weeks: freq === 'WEEKLY' ? interval : 0,
    months: freq === 'MONTHLY' ? interval : 0,
    years: freq === 'YEARLY' ? interval : 0,
  })
  return duration.toString()
}

export function rruleToLdJson(
  rrule: string | RRuleTemporal
): LdJsonEventSchedule {
  if (!rrule) {
    throw new Error('No rrule provided')
  }

  if (typeof rrule === 'string') {
    rrule = new RRuleTemporal({ rruleString: rrule })
  }

  const options = rrule.options()

  const ldJson: LdJsonEventSchedule = {
    eventSchedule: {
      '@context': 'https://schema.org',
      '@type': 'Schedule',

      startDate: options.dtstart.toPlainDate().toString(),
      endDate: options.until?.toPlainDate().toString() || undefined,

      repeatFrequency: freqAndIntervalToIsoDuration(
        options.freq,
        options.interval || 1
      ),
      byDay: options.byDay?.[0]
        ? (options.byDay
            .map((byDay) => mapRRuleToByDay(byDay))
            .filter(Boolean) as LdJsonByDay[])
        : undefined,
      byMonth:
        typeof options.byMonth?.[0] === 'number'
          ? options.byMonth?.[0]
          : undefined,
      byMonthDay: options.byMonthDay?.[0] || undefined,
      byMonthWeek:
        options.bySetPos?.[0] && options.byDay?.[0]
          ? options.bySetPos[0]
          : undefined,

      startTime: options.dtstart.toPlainTime().toString(),
      endTime: options.until?.toPlainTime().toString() || undefined,

      scheduleTimezone: options.dtstart.timeZoneId || options.tzid || 'UTC',
    },
  }

  return ldJson
}
