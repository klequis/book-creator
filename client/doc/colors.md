# Colors

Below is a comprehensive list of colors used throughout the application and their specific purposes:

| Color | Variant | Usage | Context |
|-------|---------|--------|---------|
| Blue | 400 | Primary color | Main UI elements, buttons, links |
| Blue | 500 | Header background | Component headers, navigation |
| Blue | 50 | Light background | Info alert backgrounds, hover states |
| Blue | 200 | Borders | Info alert borders, dividers |
| Blue | 800 | Text | Info alert text, dark accent text |
| Red | 500 | Primary danger | Delete buttons base state |
| Red | 600-700 | Danger hover | Delete button hover states |
| Red | 50 | Error background | Error alert backgrounds |
| Red | 200 | Error borders | Error alert borders, error indicators |
| Red | 800 | Error text | Error messages, validation text |
| Green | 400 | Success indicators | Success buttons, status indicators |
| Green | 50 | Success background | Success alert backgrounds |
| Green | 200 | Success borders | Success alert borders, valid indicators |
| Green | 800 | Success text | Success messages, validation text |
| Yellow | 50 | Warning background | Warning alert backgrounds |
| Yellow | 200 | Warning borders | Warning alert borders |
| Yellow | 800 | Warning text | Warning messages, caution text |
| Gray | 50 | Lightest background | Form backgrounds, hover states |
| Gray | 200 | Light elements | Disabled states, secondary backgrounds |
| Gray | 300 | Borders | Default border color |
| Gray | 600 | Secondary text | Supporting text, labels |
| Gray | 700 | Primary text | Main content text |
| Gray | 800 | Dark text | Headings, emphasized text |
| Indigo | 400 | Accent color | Highlights, secondary actions |
| Cyan | 400 | Info elements | Information indicators |
| Purple | 400 | Secondary accent | Alternative highlights |
| Pink | 400 | Highlight elements | Special indicators |
| Emerald | 400 | Alternative success | Additional success states |

## Component-Specific Usage

### Buttons
- Primary: `bg-blue-500`, hover: `bg-blue-700`
- Danger: `bg-red-600`, hover: `bg-red-700`
- Text on buttons: `text-white`

### Alerts
- Success: `bg-green-50`, `border-green-200`, `text-green-800`
- Warning: `bg-yellow-50`, `border-yellow-200`, `text-yellow-800`
- Error: `bg-red-50`, `border-red-200`, `text-red-800`
- Info: `bg-blue-50`, `border-blue-200`, `text-blue-800`

### Text
- Primary text: `text-gray-700`
- Secondary text: `text-gray-600`
- Links: `text-blue-600`, hover: `text-blue-800`
- Headings: `text-gray-800`

### Backgrounds
- Light background: `bg-gray-50`
- Hover states: `hover:bg-gray-100`
- Navigation: `bg-gray-800`

### Borders
- Default: `border-gray-300`
- Component-specific: matches the component's color theme

## Usage Guidelines

1. **Consistent Usage**
   - Use blue-400 for primary actions
   - Use red-500+ for destructive actions
   - Use green-400 for success states

2. **Accessibility**
   - Ensure sufficient contrast with text colors
   - Use darker shades (700+) for text on light backgrounds
   - Use lighter shades (50-200) for text on dark backgrounds

3. **State Changes**
   - Use hover states for interactive elements
   - Maintain color meaning consistency across components