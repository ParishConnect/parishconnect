import type { LdJsonByDay } from "./types"

export function safelyParseJSON(jsonString: string): any | null {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error("Failed to parse JSON:", e)
    return null
  }
}

export function mapByDayToRRule(byDay: LdJsonByDay | LdJsonByDay[] | undefined): string[] {
  if (!byDay) return []

  const dayMap: Record<LdJsonByDay, string> = {
    "https://schema.org/Monday": "MO",
    "https://schema.org/Tuesday": "TU",
    "https://schema.org/Wednesday": "WE",
    "https://schema.org/Thursday": "TH",
    "https://schema.org/Friday": "FR",
    "https://schema.org/Saturday": "SA",
    "https://schema.org/Sunday": "SU",
  }

  if (Array.isArray(byDay)) {
    return byDay.map((day) => dayMap[day]).filter(Boolean) || null
  }

  return [dayMap[byDay]]
}

export function mapRRuleToByDay(byDay: string): LdJsonByDay | undefined {
  const dayMap: Record<string, LdJsonByDay> = {
    MO: "https://schema.org/Monday",
    TU: "https://schema.org/Tuesday",
    WE: "https://schema.org/Wednesday",
    TH: "https://schema.org/Thursday",
    FR: "https://schema.org/Friday",
    SA: "https://schema.org/Saturday",
    SU: "https://schema.org/Sunday",
  }
  return dayMap[byDay] || undefined
}
