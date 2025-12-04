# Buttons

## General Requirements
- Slim padding
- Sizes: xs, sm, md, lg
- Reference doc/colors.md for color values
- All files go in /components

## Coding Guidelines
- Keep code as simple as possible (very important)
- Add info for intellisense (jsdoc)
- Reference existing components when they exist
- Maintain consistent props structure
- Use Tailwind classes for styling

## Core Button Components

### Default Button
- Filename: `button.tsx`
- Component name: `Button`
- Color: primary (blue-400)
- Basic props: `size`, `type`, `children`

### Link Button
- Filename: `button-link.tsx`
- Component name: `ButtonLink`
- Props: `text`, `href`
- Appears as button, functions as link

### Icon Button
- Filename: `button-icon.tsx`
- Component name: `ButtonIcon`
- No margin
- Minimal padding
- Centered icon alignment

## Additional Button Components

### Toggle Button
- Filename: `button-toggle.tsx`
- Component name: `ButtonToggle`
- Props: `isActive`, `onChange`, `children`
- Visual state feedback
- Color shifts on toggle

### Loading Button
- Filename: `button-loading.tsx`
- Component name: `ButtonLoading`
- Props: `isLoading`, `children`, `onClick`
- Spinner animation when loading
- Disabled state while loading

### Confirm Button
- Filename: `button-confirm.tsx`
- Component name: `ButtonConfirm`
- Props: `onConfirm`, `children`, `confirmText`
- Two-step confirmation process
- Prevents accidental clicks

### Copy Button
- Filename: `button-copy.tsx`
- Component name: `ButtonCopy`
- Props: `text`, `children`, `onCopy`
- Copies text to clipboard
- Success feedback animation

### Dropdown Button
- Filename: `button-dropdown.tsx`
- Component name: `ButtonDropdown`
- Props: `items`, `children`
- Expandable options menu
- Keyboard navigation support

### Badge Button
- Filename: `button-badge.tsx`
- Component name: `ButtonBadge`
- Props: `badgeCount`, `children`, `onClick`
- Shows notification count
- Optional max count display

### Progress Button
- Filename: `button-progress.tsx`
- Component name: `ButtonProgress`
- Props: `progress`, `children`, `onClick`
- Visual progress indicator
- Optional percentage display

## Button System Guidelines

### 1. Visual Hierarchy
- **Primary Actions**
  - Color: blue-400
  - Use for: Main CTAs, form submissions
  - One per view recommended

- **Secondary Actions**
  - Color: gray-400
  - Use for: Alternative options, cancel actions
  - Multiple per view acceptable

- **Danger Actions**
  - Color: red-500
  - Use for: Destructive actions, deletions
  - Require confirmation when critical

### 2. Size System
| Size | Height | Text | Padding | Use Case |
|------|---------|------|----------|-----------|
| xs   | h-6     | text-xs | px-2 py-1 | Compact areas |
| sm   | h-8     | text-sm | px-3 py-1.5 | Default size |
| md   | h-10    | text-base | px-4 py-2 | Main actions |
| lg   | h-12    | text-lg | px-6 py-2.5 | Hero CTAs |

### 3. State Management
- **Default**
  - Base color
  - Normal opacity
  - Regular shadow

- **Hover**
  - Slightly darker (100 value up)
  - Optional scale transform
  - Cursor: pointer

- **Active/Pressed**
  - Darker shade (200 value up)
  - Slight inset shadow
  - Scale down transform

- **Disabled**
  - 50% opacity
  - No hover effects
  - Cursor: not-allowed

- **Loading**
  - Show spinner
  - Disable interactions
  - Maintain width

### 4. Spacing & Layout
- Internal spacing scales with button size
- Minimum gap between buttons: gap-2
- Icon and text spacing: gap-1.5
- Consistent height within button groups
- Align to 4px grid system

### 5. Accessibility Requirements
- Minimum touch target: 44px (11rem)
- Focus states must be visible
- Color contrast ratio: 4.5:1 minimum
- Meaningful aria-labels required
- Support keyboard navigation
- Screen reader friendly text

### 6. Best Practices
1. **Consistency**
   - Use same button type for similar actions
   - Maintain consistent sizing patterns
   - Follow established color meanings

2. **Responsiveness**
   - Adjust size on smaller screens
   - Stack buttons on narrow widths
   - Maintain touch targets

3. **Performance**
   - Minimize JS for basic buttons
   - Use CSS for simple animations
   - Lazy load complex buttons

4. **Maintenance**
   - Document prop requirements
   - Include usage examples
   - Keep variants minimal
   - Share common styles


