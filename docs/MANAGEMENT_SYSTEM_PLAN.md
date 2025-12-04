# Linguistics Association of Ghana (LAG) Management System Plan

## 1. System Overview
This document outlines the architecture for the LAG Management System, integrated directly into the existing website. The system uses **Supabase** for the backend (Database, Auth, Storage) and **React** for the frontend (Admin Dashboard + Public Website).

## 2. Database Schema (Supabase PostgreSQL)

### 2.1 Tables

#### `profiles` (Extends Supabase Auth)
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | References `auth.users.id` (PK) |
| `email` | Text | User email |
| `role` | Text | 'admin', 'member', 'staff' |
| `created_at` | Timestamp | Record creation time |

#### `members`
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK to `auth.users.id` (optional, if member has login) |
| `first_name` | Text | |
| `last_name` | Text | |
| `email` | Text | Unique |
| `phone` | Text | For SMS notifications |
| `affiliation` | Text | University/Institution |
| `research_area` | Text | |
| `membership_type` | Text | 'Student', 'Professional', 'Institutional' |
| `status` | Text | 'active', 'pending', 'expired' |
| `dues_paid_until` | Date | Track membership validity |
| `image_url` | Text | Avatar URL |
| `created_at` | Timestamp | |

#### `publications`
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | Primary Key |
| `title` | Text | |
| `authors` | Text | |
| `abstract` | Text | |
| `category` | Text | 'Journal', 'Newsletter', 'Proceedings' |
| `publication_date` | Date | |
| `file_url` | Text | Link to PDF in Storage |
| `created_at` | Timestamp | |

#### `events`
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | Primary Key |
| `title` | Text | |
| `description` | Text | |
| `start_date` | Timestamp | |
| `end_date` | Timestamp | |
| `location` | Text | |
| `registration_url` | Text | |
| `image_url` | Text | |
| `created_at` | Timestamp | |

#### `leadership`
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | Primary Key |
| `name` | Text | |
| `role` | Text | e.g., 'President' |
| `bio` | Text | |
| `image_url` | Text | |
| `term_start` | Date | |
| `term_end` | Date | |
| `is_current` | Boolean | True for current execs |
| `display_order` | Integer | For sorting |

#### `news`
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID | Primary Key |
| `title` | Text | |
| `description` | Text | |
| `date` | Date | |
| `category` | Text | |

### 2.2 Security (RLS Policies)
- **Public Access:** Read-only access to `publications`, `events`, `leadership`, `news`, and active `members` (directory).
- **Admin Access:** Full CRUD on all tables.
- **Member Access:** Read/Update own profile in `members`.

## 3. Admin Dashboard Routes
Located at `/admin` (Protected Route).
- `/admin/dashboard` - Overview/Stats
- `/admin/members` - Approve registrations, manage dues
- `/admin/publications` - Upload/Edit publications
- `/admin/events` - Create/Edit events
- `/admin/leadership` - Manage executive profiles
- `/admin/communications` - Send SMS (via Edge Function)

## 4. Integration Steps
1. **Supabase Setup:** Run SQL migration script.
2. **Environment Variables:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Client Initialization:** Create `src/lib/supabase.ts`.
4. **Frontend Refactor:** Replace static data arrays with `useEffect` hooks fetching from Supabase.
5. **Admin Panel Build:** Implement the dashboard using existing UI components.

## 5. SMS Integration
- **Provider:** smsonlinegh
- **Implementation:** Supabase Edge Function `send-sms` triggered by Admin Dashboard or Database Webhook (e.g., on `dues_paid_until` expiry).
