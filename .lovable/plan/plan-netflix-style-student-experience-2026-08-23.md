# Plan - Netflix-Style Student Experience

Create a premium "Netflix-style" student area with high-end mockup covers for Josi Nascimento's courses and materials, using the provided professional photos.

## Visual Direction
- **Netflix Layout**: Large hero section with featured course, followed by horizontal scrolling rows (marquees or grid) of "posters".
- **Premium Covers**: Infoproduct style with golden accents, high-end typography, and professional lighting effects.
- **Dark Elegance**: Deep emerald/black backgrounds with gold/white highlights.

## Proposed Changes

### 1. Database & Assets
- Import all 7 new professional photos as assets.
- Seed the database with high-quality mock data (Courses and Lessons) to ensure the platform looks "full" and professional immediately.
- Courses: "Mentoria Elite", "Massoterapia Avançada", "Protocolo da Vitória", "Destaque-se no Mercado".

### 2. Student Interface (`src/routes/aluno.tsx` & `src/routes/aluno.cursos.tsx`)
- Redesign the student dashboard to feature a "Netflix Hero" (featured content).
- Implement a poster-based grid for courses with high-end hover effects.
- Add "Trending" and "New Releases" categories.

### 3. Typography & Styling
- Use "Cormorant Garamond" for elegant titles in the student area.
- Enhance glassmorphism effects on cards.

### 4. Code Cleanup
- Remove the requested feedback comments from `src/routes/index.tsx`.

## Technical Details
- **Assets**: Use `lovable-assets` for all new images.
- **Components**: Create `NetflixPoster` component for consistent, professional branding.
- **Database**: Use `supabase--run_sql` to seed courses if necessary, or just hardcode demo items if the user prefers a "template" feel that they can later edit. I will use the `courses` and `course_modules` tables already created.

## User Review Required
> [!IMPORTANT]
> The Netflix style works best with vertical posters (2:3 ratio). I will crop/fit the provided horizontal photos to look like professional movie/course posters.
