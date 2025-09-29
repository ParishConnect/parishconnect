import type { LdJsonByDay, LdJsonEventSchedule } from './types'

export function safelyParseJSON(jsonString: string): any | null {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse JSON:', e)
    return null
  }
}

export function mapByDayToRRule(
  byDay: LdJsonEventSchedule['eventSchedule']['byDay']
): string | null {
  if (!byDay) return null

  const dayMap: Record<LdJsonByDay, string> = {
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

export function mapRRuleToByDay(byDay: string): LdJsonByDay | undefined {
  const dayMap: Record<string, LdJsonByDay> = {
    MO: 'https://schema.org/Monday',
    TU: 'https://schema.org/Tuesday',
    WE: 'https://schema.org/Wednesday',
    TH: 'https://schema.org/Thursday',
    FR: 'https://schema.org/Friday',
    SA: 'https://schema.org/Saturday',
    SU: 'https://schema.org/Sunday',
  }
  return dayMap[byDay] || undefined
}
