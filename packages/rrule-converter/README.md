# @parishconnect/rrule-converter

Convert between JSON-LD Schema.org Schedule format and RRule (RFC 5545) format for recurring events.

## Usage

```typescript
import { ldJsonToRRule, rruleToLdJson, unfurlEventsFromLdJson } from '@parishconnect/rrule-converter'
import type { CatholicChurchOrganization } from '@parishconnect/schema'

// Convert Schema.org Event to RRule
const rrules = ldJsonToRRule(event)

// Convert RRule to Schema.org Schedule
const schedule = rruleToLdJson(rrule)

// Extract all events from a church organization
const events = unfurlEventsFromLdJson(church)
```

## Features

- Bidirectional conversion between JSON-LD and RRule formats
- Support for weekly, monthly, and yearly recurring events
- Timezone handling using Temporal API
- Utility functions for working with Schema.org data structures
