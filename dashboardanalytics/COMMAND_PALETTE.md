# Command Palette

A keyboard-first navigation system for quick access to all dashboard features.

## Usage

### Opening the Command Palette

**Keyboard Shortcut:**
- **Mac:** `⌘ + K`
- **Windows/Linux:** `Ctrl + K`

**Mouse:**
- Click the search bar in the header

### Navigation

- **Type** to search/filter commands
- **↑/↓ Arrow Keys** to navigate through results
- **Enter** to execute selected command
- **Escape** to close the palette

## Available Commands

### Navigation
- **Dashboard** - Main analytics overview
- **Sales Report** - Sales analytics and transactions
- **Marketing Analytics** - Campaign performance metrics
- **Client Insights** - Customer behavior and satisfaction
- **Financial Overview** - Financial health and metrics
- **Settings** - Application preferences

### API Documentation
- **Sales API Documentation** - Opens sales API endpoints
- **Marketing API Documentation** - Opens marketing API endpoints

### AI Features
- **AI Suggestions** - Get AI-powered insights (coming soon)

## Features

✅ **Fuzzy Search** - Search by name, description, or keywords
✅ **Keyboard Navigation** - Full keyboard support
✅ **Visual Feedback** - Highlighted selection
✅ **Quick Access** - Instant navigation to any page
✅ **Responsive** - Works on all screen sizes
✅ **Accessible** - Keyboard-first design

## Search Keywords

Each command has associated keywords for easier discovery:

- **Dashboard:** home, overview, main
- **Sales:** revenue, orders, transactions
- **Marketing:** campaigns, cpo, clicks, performance
- **Clients:** customers, users, satisfaction, engagement
- **Financial:** profit, liquidity, capital, ratios
- **Settings:** preferences, config, configuration
- **API:** api, docs, documentation
- **AI:** ai, artificial intelligence, insights, suggestions

## Examples

### Quick Navigation
1. Press `⌘K` (or `Ctrl+K`)
2. Type "sales"
3. Press `Enter`
→ Navigate to Sales Report

### Search by Keyword
1. Press `⌘K` (or `Ctrl+K`)
2. Type "revenue"
3. Select "Sales Report"
→ Navigate to Sales Report

### Browse All Commands
1. Press `⌘K` (or `Ctrl+K`)
2. Leave search empty
3. Use arrow keys to browse
→ See all available commands

## Customization

To add new commands, edit `src/components/ui/CommandPalette.tsx`:

```typescript
const commands: Command[] = [
  {
    id: 'my-command',
    label: 'My Custom Command',
    description: 'Description of what it does',
    icon: <MyIcon className="h-4 w-4" />,
    action: () => router.push('/my-route'),
    keywords: ['custom', 'my', 'command'],
  },
  // ... other commands
];
```

## Technical Details

- **Framework:** React with Next.js
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Keyboard Events:** Native browser events
- **Animations:** CSS keyframes

## Accessibility

- ✅ Keyboard-only navigation
- ✅ Focus management
- ✅ Escape key support
- ✅ Visual focus indicators
- ✅ Semantic HTML
- ✅ ARIA labels (can be enhanced)

## Future Enhancements

- [ ] Recent commands history
- [ ] Command categories/grouping
- [ ] Custom keyboard shortcuts per command
- [ ] Search data (sales, clients, etc.)
- [ ] Command aliases
- [ ] Theme switching command
- [ ] Export data commands
- [ ] Quick actions (e.g., "Create new report")
