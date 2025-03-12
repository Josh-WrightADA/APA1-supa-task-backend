

# Going Cold Coffee - Backend API

## Project Overview
This repository contains the backend API infrastructure for the Going Cold Coffee application. It is built using Supabase Edge Functions to provide serverless API endpoints for caffeine tracking, wellness check-ins, and data analysis.

## Current Implementation Status

The backend infrastructure is currently in development with the following components:

- **Database Schema**: Fully implemented in Supabase with tables for users, caffeine entries, and wellness check-ins
- **Edge Functions**: Structure is defined but functionality is partially implemented:
  - `caffeineTimer`: Structure defined for tracking caffeine entries (implementation in progress)
  - `wellnessCheckin`: Structure defined for wellness data (implementation in progress)
  - `statsProcessor`: Planned for data analysis and insights generation
 
**Note**: The frontend application currently connects directly to Supabase for data operations. The Edge Functions will be fully implemented in future iterations to provide additional business logic and data processing capabilities.

## Technologies Used

- **Supabase**: Database, Authentication, and Edge Functions
- **TypeScript**: For type-safe Edge Function development


## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Deno](https://deno.land/) for local development

### Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/Josh-WrightADA/APA1-supa-task-backend.git
   cd APA1-supa-task-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Authenticate with Supabase:
   ```
   npx supabase login
   ```

4. Link your local project to your Supabase project:
   ```
   npx supabase link --project-ref your_project_id
   ```

5. Deploy Edge Functions (when ready):
   ```
   npx supabase functions deploy
   ```

## Database Schema

### caffeine_entries
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- amount: INTEGER
- beverage_type: TEXT
- consumed_at: TIMESTAMP
- created_at: TIMESTAMP

### wellness_checkins
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- energy_level: INTEGER (1-5)
- mood: INTEGER (1-5)
- caffeine_craving: INTEGER (1-5)
- notes: TEXT
- created_at: TIMESTAMP

## API Endpoints

### Caffeine Tracking API

#### GET `/api/caffeine`
- **Description**: Retrieves all caffeine entries for the authenticated user
- **Auth Required**: Yes
- **Response**: Array of caffeine entries ordered by consumed_at (descending)

#### GET `/api/caffeine/:id`
- **Description**: Retrieves a specific caffeine entry
- **Auth Required**: Yes
- **Parameters**: id - UUID of the entry
- **Response**: Single caffeine entry object

#### POST `/api/caffeine`
- **Description**: Creates a new caffeine entry
- **Auth Required**: Yes
- **Request Body**: 
  ```json
  {
    "amount": 100,
    "type": "coffee",
    "consumed_at": "2023-06-20T10:30:00Z"
  }
  ```
- **Response**: Created caffeine entry object

#### PUT `/api/caffeine/:id`
- **Description**: Updates an existing caffeine entry
- **Auth Required**: Yes
- **Parameters**: id - UUID of the entry
- **Request Body**: 
  ```json
  {
    "amount": 150,
    "type": "espresso",
    "consumed_at": "2023-06-20T10:30:00Z"
  }
  ```
- **Response**: Updated caffeine entry object

#### DELETE `/api/caffeine/:id`
- **Description**: Deletes a caffeine entry
- **Auth Required**: Yes
- **Parameters**: id - UUID of the entry
- **Response**: Success confirmation

### Wellness Checkin API

#### GET `/api/wellness`
- **Description**: Retrieves all wellness check-ins for the authenticated user
- **Auth Required**: Yes
- **Response**: Array of wellness check-ins ordered by created_at (descending)

#### GET `/api/wellness/:id`
- **Description**: Retrieves a specific wellness check-in
- **Auth Required**: Yes
- **Parameters**: id - UUID of the check-in
- **Response**: Single wellness check-in object

#### POST `/api/wellness`
- **Description**: Creates a new wellness check-in
- **Auth Required**: Yes
- **Request Body**: 
  ```json
  {
    "energy_level": 4,
    "mood": 3,
    "caffeine_craving": 2,
    "notes": "Feeling good today with less caffeine"
  }
  ```
- **Response**: Created wellness check-in object

#### PUT `/api/wellness/:id`
- **Description**: Updates an existing wellness check-in
- **Auth Required**: Yes
- **Parameters**: id - UUID of the check-in
- **Request Body**: 
  ```json
  {
    "energy_level": 3,
    "mood": 4,
    "caffeine_craving": 2,
    "notes": "Updated notes"
  }
  ```
- **Response**: Updated wellness check-in object

#### DELETE `/api/wellness/:id`
- **Description**: Deletes a wellness check-in
- **Auth Required**: Yes
- **Parameters**: id - UUID of the check-in
- **Response**: Success confirmation


### Statistics and Analysis

- `GET /functions/v1/statsProcessor` - Get statistical analysis of caffeine consumption and wellness data

## Authentication

All endpoints require authentication using a Supabase JWT token in the Authorization header:

## Future Development

- Complete implementation of all Edge Functions
- Add advanced analytics and insights
