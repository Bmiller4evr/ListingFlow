# Access Realty Style Guide

A comprehensive documentation of design patterns and style preferences used throughout the Access Realty application.

## Overview

Access Realty uses a clean, professional design system focused on usability and accessibility. The design emphasizes clarity, progressive disclosure, and mobile-first responsive design patterns.

## Core Design Principles

### 1. **Clean & Minimal Interface**
- Cards use `border-none shadow-none` for a clean, flat appearance
- Generous whitespace and spacing using consistent Tailwind spacing scale
- Focus on content over decoration

### 2. **Progressive Disclosure**
- Multi-step forms with single question focus
- Smart conditional logic that shows/hides relevant questions
- Clear progress indicators and navigation

### 3. **Professional Tone**
- Consistent terminology (e.g., "Homes" not "Properties" in user-facing text)
- Formal business language without being overly technical
- Clear, actionable instructions

## Layout & Structure

### **Card Containers**
```tsx
<Card className="border-none shadow-none">
  <CardHeader className="relative">
    <CardTitle className="text-center text-2xl">Form Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### **Container Spacing**
- Main content areas use `space-y-6` for vertical spacing
- Card content uses `CardContent` with built-in padding
- Questions and form elements use `space-y-4`

### **Mobile Responsiveness**
- Mobile-first approach with `useIsMobile()` hook
- Touch-friendly targets (minimum 44px touch targets)
- Responsive grid layouts (`grid-cols-2` on mobile, more on desktop)
- Mobile-optimized spacing and typography

## Typography System

### **Hierarchy**
- **Card Titles**: `text-2xl` centered headings
- **Question Titles**: `text-lg` using `<Label>` components
- **Body Text**: Default `text-base` (14px root font size)
- **Helper Text**: `text-sm text-muted-foreground`
- **Descriptions**: `text-muted-foreground` 

### **Font Weights**
- **Headers**: `font-weight-medium` (500)
- **Labels**: `font-weight-medium` (500)  
- **Body Text**: `font-weight-normal` (400)
- **Buttons**: `font-weight-medium` (500)

### **Custom Typography Tokens**
```css
:root {
  --font-size: 14px;  /* Base font size */
  --font-weight-medium: 500;
  --font-weight-normal: 400;
}
```

## Form Patterns

### **Multi-Step Form Structure**
1. **Progress Indicators**: `Question X of Y` format
2. **Single Question Focus**: One question per screen/step
3. **Auto-Advancement**: Radio buttons auto-advance after selection
4. **Smart Navigation**: Previous/Next with conditional visibility

### **Question Types & Styling**

#### **Radio Button Groups**
- Custom `ButtonRadioGroup` component using Button variants
- `grid-cols-2 gap-3` layout for options
- Selected state: `bg-primary text-primary-foreground`
- Unselected state: `bg-white text-foreground border-border hover:bg-muted`

#### **Select Dropdowns**
- ShadCN Select component with descriptions
- Auto-advance behavior (except property type to avoid glitches)
- Option descriptions in `text-sm text-muted-foreground`

#### **Input Fields**
- Standard ShadCN Input component
- Consistent placeholder text format: "e.g., 2,400"
- Full width: `w-full`

#### **Checkbox Groups**
- Used for multi-select scenarios
- Consistent spacing and labeling

### **Special UI Patterns**

#### **Explainer Boxes - Detailed Information**
For questions requiring substantial clarification:
```tsx
<div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
  <p className="text-sm text-gray-800">
    Detailed explanation content...
  </p>
</div>
```
- Used for complex concepts (bedrooms, bathrooms, square footage)
- Grey background (`bg-gray-50`) with grey border (`border-gray-300`)
- Text in `text-gray-800` for readability

#### **Definition Boxes - Informational**
For general information and definitions:
```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
    <div>
      <h4 className="font-medium text-blue-800 dark:text-blue-200">Title</h4>
      <div className="text-sm text-blue-700 dark:text-blue-300">Content</div>
    </div>
  </div>
</div>
```

## Button System

### **Primary Actions**
- Default variant for main actions: `<Button>Continue</Button>`
- Success state for completion: `bg-green-600 hover:bg-green-700 text-white`

### **Secondary Actions**
- Outline variant: `<Button variant="outline">Back</Button>`
- Ghost variant for minimal actions: `<Button variant="ghost">`

### **Navigation Buttons**
```tsx
<div className="flex justify-between pt-6 border-t">
  <Button variant="outline">
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
  <Button>
    Next
    <ArrowRight className="h-4 w-4 ml-2" />
  </Button>
</div>
```

### **Exit Functionality**
- Consistent X button in top-right: `absolute right-4 top-4`
- Uses AlertDialog for confirmation
- Saves progress as draft before exit

## Color System

### **Semantic Colors**
- **Primary**: Dark (`#030213`) - main actions, selected states
- **Success**: Green tones for completion/success states
- **Muted**: Light greys for secondary text and backgrounds
- **Border**: Light grey (`rgba(0, 0, 0, 0.1)`) for subtle divisions

### **State Colors**
- **Selected**: Primary color background with white text
- **Hover**: Muted background (`hover:bg-muted`)
- **Disabled**: 50% opacity (`disabled:opacity-50`)

## Interactive Elements

### **Y/N/U Buttons (Yes/No/Unknown)**
Special tri-state buttons for disclosure forms:
```tsx
// Selected states with semantic colors
case 'Y': return 'border-green-500 bg-green-500 text-white';
case 'N': return 'border-red-500 bg-red-500 text-white';  
case 'U': return 'border-amber-500 bg-amber-500 text-white';
```

### **Confetti Celebrations**
- Custom confetti implementation for form completion
- Triggers on final question completion
- 50 pieces with randomized colors and animations

## Helper Text Guidelines

### **When to Show Descriptions**
1. **Detailed Explainer Boxes**: Questions needing substantial clarification (bedrooms, bathrooms, square footage, garage spaces)
2. **Simple Helper Text**: Brief useful descriptions that add value
3. **No Helper Text**: Obvious questions that don't need explanation

### **Description Patterns**
- **Bedroom**: "A bedroom must have a window and a closet"
- **Square Footage**: "Interior living space in square feet" 
- **Lot Size**: "Total property size in square feet"
- **Survey**: "A property survey shows exact boundaries, structures, and features"

## Data Patterns

### **Form Validation**
- Permissive validation - always allow advancement
- No required field blocking (user can proceed and return)
- Client-side validation for format but not completeness

### **Auto-Save & Drafts**
- Automatic progress saving to localStorage
- Draft system with resume capability
- Exit handlers that preserve data

### **Conditional Logic**
- Smart question filtering based on previous answers
- Dynamic form length based on selections
- Property type affects available questions

## Mobile Optimizations

### **Touch Targets**
- Minimum 44px touch targets for all interactive elements
- Button heights of `h-12` for better mobile usability
- Generous spacing between interactive elements

### **Mobile Layouts**
- Single column layouts on mobile
- Responsive grids that collapse appropriately
- Mobile-specific padding classes

### **Mobile Navigation**
- Simplified navigation patterns
- Swipe-friendly interfaces
- Optimized for thumb navigation

## Accessibility

### **Focus Management**
- Visible focus indicators
- Logical tab order
- Keyboard navigation support

### **ARIA Labels**
- Proper labeling of form controls
- Screen reader friendly structure
- Semantic HTML structure

### **Color Contrast**
- Sufficient contrast ratios for all text
- Not relying solely on color for meaning
- Dark mode support where applicable

## Implementation Notes

- Uses ShadCN/UI component library as foundation
- Tailwind CSS v4 for styling
- React Hook Form for form management where needed
- Framer Motion for animations (imported as 'motion/react')
- Custom utility functions for common patterns

## Key Files

- `/styles/globals.css` - Global typography and CSS variables
- `/components/ui/` - ShadCN component library
- `/components/listing-creation/` - Form implementations
- `/components/onboarding/` - Account creation flows

This style guide should be followed consistently across all new forms and components to maintain the professional, user-friendly experience that defines Access Realty.