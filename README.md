# ParishConnect Widget

ParishConnect Widget is a simple widget that allows you to store and display parish information such as mass times, name, address, phone number, email, and website. It is designed to be easily integrated into any website or application and to be **completely decentralized**. This means that you always own your data and it doesn't matter what platform(s) or services you use.

## Features

- ⚙️ **Easy Setup**: A simple setup wizard to configure your parish information and mass times.
- 🔌 **Embed Anywhere**: Generate an embed script to easily add the widget to any website.
- 🔍 **Structured Data**: Automatically generates JSON-LD snippets for better SEO and data interoperability.
- 🔔 **Webhook Integration**: Notify aggregators or indexers of updates via webhooks and webmentions protocols.
- 🌐 **Public API**: Expose parish data through a public API for use in other applications or widgets.
- 🔍 **Completely Transparent**: The widget is open-source and fully transparent and all aggregated data is cryptographically signed and independently verifiable.
- 🌱 **Decentralized Data Options**: Optionally publish parish data to decentralized platforms like Solid Pods or AT Protocol.

## Basic Flow for Admins

```mmd
flowchart TD
    A[Parish Admin Opens Widget Setup Wizard] --> B[Enter Mass Times, Address, Contact Info, Exceptions]
    B --> C[System Generates Embed Script & JSON-LD Snippet]
    C --> D[Parish Admin Copies & Pastes into Parish Website]
    D --> E[Widget Displays Schedule on Website]
    D --> F[JSON-LD Embedded for Structured Data / SEO]
    F --> G[Webhook Fired to Aggregator/Indexer]
    G --> H[Aggregator Receives Update Notification]
    H --> I[Parse JSON-LD from Parish URL]
    I --> J[Cache/Normalize Schedule Data in Aggregator DB]
    J --> K[Expose Data via Public API]
    K --> L[Other Widgets / Apps Consume API for Display]
    J --> M[Optional: Publish to Solid Pod or AT Protocol for Decentralized Data]
```
