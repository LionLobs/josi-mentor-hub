# Implementation Plan - Enhanced Platform Security and Restricted Access

The user wants to implement robust security for the platform, ensuring that only authorized clients (inserted into the database) can access the content. This involves setting up route guards, restricting public sign-ups, and ensuring admin-only user management.

## User Review Required

> [!IMPORTANT]
> - By default, I will disable public self-registration. Access will be managed by you (Admin) by adding students in the "Alunos" panel.
> - Do you want students to be able to reset their own passwords via email, or should that also be admin-managed?

## Proposed Changes

### 1. Route Security (Authentication Guards)
- Add `beforeLoad` checks to `src/routes/admin.tsx` and `src/routes/aluno.tsx` to ensure users are authenticated.
- Implement role-based redirection:
  - `/admin/*` routes will require the `admin` role.
  - `/aluno/*` routes will require a logged-in user.
- Redirect unauthenticated users to `/auth`.

### 2. Restricted Authentication Flow
- Modify `src/routes/auth.tsx` to remove the public "Criar conta" (Sign-up) tab.
- Update the login page text to clarify that access is exclusive to mentoradas.
- Add a "forgot password" flow if not already present.

### 3. Database & Roles Integration
- Ensure `user_roles` are correctly checked in the `AuthProvider`.
- Implement a server-side `checkAdmin` function to protect admin API endpoints and server functions.

### 4. Admin Management Enhancement
- Ensure the "Alunos" management panel in `src/routes/admin.alunos.tsx` allows the admin to correctly provision access.
- (Optional) Add a "Send Invite" button to students that triggers a Supabase invite email.

## Technical Details
- **Route Guards**: Use TanStack Router's `beforeLoad` with a helper that checks `supabase.auth.getSession()`.
- **Auth State**: Leverage the existing `AuthProvider` and `useAuth` hook, but move the core check to a server-side safe pattern for SSR.
- **Middleware**: Use `requireSupabaseAuth` middleware for any sensitive server functions.

## Constraints & Considerations
- We must handle the "first admin" scenario (likely the project owner).
- Supabase RLS policies are already in place but need validation for the `students` table to ensure students can only see their own data.
