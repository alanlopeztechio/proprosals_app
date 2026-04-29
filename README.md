# Proposal Management App

A modern, full-stack application for managing clients and project proposals, built with **Next.js**, **Convex**, and **Tailwind CSS**.

## 🚀 Features

- **Client Management**: Track client information including company details, contact info, and custom notes.
- **Proposal Tracking**: Create and manage project proposals with status tracking (Draft, Sent, Accepted, Rejected, Cancelled).
- **Real-time Database**: Powered by Convex for instant updates and reactive queries.
- **Data Table**: Interactive data presentation using AG Grid for efficient sorting and filtering.
- **Dark Mode**: Built-in theme support for a comfortable user experience.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, AG Grid, Lucide React, Radix UI.
- **Backend**: Convex (Real-time database and serverless functions).
- **Styling**: Tailwind CSS, Shadcn UI.
- **Language**: TypeScript.

## 🏁 Getting Started

### Prerequisites

- Node.js installed.
- pnpm (recommended) or npm.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up Convex:
   ```bash
   npx convex dev
   ```

### Seeding Data

To populate the database with sample clients and proposals:

1. Run the client seed:
   ```bash
   npx convex run seed:seedClients
   ```
2. Run the proposal seed:
   ```bash
   npx convex run seed:seedProposals
   ```

## 📄 License

This project is licensed under the MIT License.
