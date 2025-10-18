# @parishconnect/schema

Zod schemas and TypeScript types for ParishConnect data structures, including Catholic Church organization schemas following Schema.org standards.

## Usage

```typescript
import { CatholicChurchOrganizationSchema, type CatholicChurchOrganization } from '@parishconnect/schema'

// Validate data against the schema
const church = CatholicChurchOrganizationSchema.parse(data)

// Use TypeScript types
const myChurch: CatholicChurchOrganization = {
  // ...
}
```

## Exports

- `CatholicChurchOrganizationSchema` - Zod schema for Catholic Church organizations
- `CatholicChurchOrganization` - TypeScript type inferred from the schema
- `ServiceTypes` - Enum of service types (mass, confession, adoration)
- `WeekDaysLD` - Array of Schema.org day names
- Various utility types for working with Schema.org data
