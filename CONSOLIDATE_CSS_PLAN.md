# CSS Consolidation Plan

## Current Issues
- Two CSS files defining the same variables with different values
- `index.css` has shadcn defaults 
- `globals.css` has Access Realty brand colors
- This causes confusion and unpredictable styling

## Recommended Approach
**Option 1: Keep globals.css as the single source (RECOMMENDED)**
- Delete conflicting sections from `index.css`
- Keep only Tailwind imports in `index.css`
- Move all brand colors and utilities to `globals.css`

**Option 2: Merge everything into index.css**
- Copy Access Realty colors from `globals.css` to `index.css`  
- Delete `globals.css`
- Remove import from main.tsx

## Brand Color Scheme (Access Realty)
- Primary: #2C5282 (blue)
- Secondary: #D4A574 (gold/tan)
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Destructive: #EF4444 (red)

## Action Plan
1. Choose Option 1 (keep globals.css)
2. Clean up index.css to remove conflicts
3. Ensure consistent color usage throughout app
4. Test thoroughly

Would you like me to implement this consolidation?