# Mini Seller Console

Goal: Build a lightweight console to triage Leads and convert them into Opportunities.

## Features

- **Lead Management** - Track leads with search, filtering, and sortable columns
- **Opportunity Tracking** - Convert leads to opportunities and monitor progress
- **Persistent Preferences** - Search filters and sorting preferences saved to localStorage
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite (build tool)
- Local state management with Context API

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout components
│   ├── leads/         # Lead management components
│   ├── opportunities/ # Opportunity tracking components
│   └── ui/            # Reusable UI components
├── context/           # React Context for state management
├── data/              # Mock data
├── hooks/             # Custom React hooks
├── services/          # Data services and storage
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

