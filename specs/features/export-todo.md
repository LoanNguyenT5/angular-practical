# Feature Specification: Export Todo List

## Overview

Allow users to export the current todo list to a CSV file for external use, reporting, or backup purposes.

## User Story

**As a** user viewing the todo list  
**I want to** export all todos to a CSV file  
**So that** I can use the data in spreadsheet applications, share it with others, or keep a backup

## Functional Requirements

### FR-1: Export Button
- Display an "Export" button with a download icon in the todo list header
- The button should be clearly visible and styled using the primary button style (ng-zorro-antd)
- The button should be enabled at all times (even when the list is empty)

### FR-2: CSV Generation
When the user clicks the Export button, the system shall:
- Generate a CSV file containing all currently loaded todos
- Include three columns in the following order: `id`, `title`, `completed`
- Format the data according to RFC 4180 CSV standards:
  - Fields containing quotes must escape them by doubling (`"` becomes `""`)
  - Text fields should be quoted to handle special characters
  - Boolean values should be represented as `true` or `false`

### FR-3: File Download
- Automatically trigger a browser download of the generated CSV file
- Use the filename: `todos.csv`
- Set the MIME type to `text/csv;charset=utf-8;`
- Clean up object URLs after download to prevent memory leaks

### FR-4: Empty List Behavior
- When the todo list is empty, generate a CSV file with only the header row
- Do not show an error or prevent the export action

### FR-5: Data Accuracy
- Export exactly the todos currently displayed in the table
- Preserve the data as-is without modifications or filtering
- Ensure IDs, titles, and completion status match the UI exactly

## User Flow

1. User navigates to the Todo List page (`/todo-list`)
2. System loads and displays todos from the API
3. User clicks the "Export" button
4. System generates CSV content from current todos
5. Browser downloads `todos.csv` to the user's default download location
6. User can open the file in spreadsheet applications (Excel, Google Sheets, etc.)

## CSV Format

### Structure
```
id,title,completed
1,"Buy groceries",false
2,"Write ""tests""",true
3,"Deploy application",false
```

### Field Specifications

| Field     | Type    | Description                          | Escaping Rules                    |
|-----------|---------|--------------------------------------|-----------------------------------|
| id        | number  | Unique identifier from API           | No escaping required              |
| title     | string  | Todo description                     | Wrap in quotes; escape `"` as `""` |
| completed | boolean | Completion status (true/false)       | No escaping required              |

### Example with Special Characters
```csv
id,title,completed
5,"Meeting at 9:00 AM",false
6,"Read ""Angular"" documentation",true
7,"Review code, add comments",false
```

## Edge Cases and Error Handling

### Edge Cases
- **Empty todo list**: Export CSV with header only
- **Todos with quotes in title**: Escape quotes properly (`"` → `""`)
- **Todos with commas in title**: Wrap title in quotes
- **Very long titles**: No truncation; export full text
- **Special characters**: Preserve UTF-8 characters correctly

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari) support Blob and URL.createObjectURL
- No fallback required for legacy browsers (Angular 20.3.0 requires modern browsers)

### Error Scenarios
- **Network failure during load**: Export button available but list may be empty
- **Large datasets**: No pagination; export all loaded todos (API returns 200 items max)

## Acceptance Criteria

- [ ] Export button is visible in the todo list header with a download icon
- [ ] Clicking Export downloads a file named `todos.csv`
- [ ] CSV includes header row: `id,title,completed`
- [ ] All todos in the table are included in the export
- [ ] Titles with quotes are escaped correctly (`"` becomes `""`)
- [ ] Titles with commas are wrapped in quotes
- [ ] Boolean values are exported as `true` or `false`
- [ ] Empty list exports CSV with header only (no error shown)
- [ ] Object URL is revoked after download to prevent memory leaks
- [ ] Export works correctly in Chrome, Firefox, Edge, and Safari
- [ ] CSV can be opened successfully in Excel and Google Sheets
- [ ] No console errors occur during export

## Testing Requirements

### Unit Tests
- [x] Component creates successfully
- [x] Component loads todos on initialization
- [x] `exportToCsv()` creates an anchor element and triggers download
- [x] Object URL is revoked after download
- [x] CSV contains correct headers (`id,title,completed`)
- [x] CSV rows match todos data with proper formatting
- [x] Titles containing quotes are escaped (`"test"` → `"test""`)
- [ ] Empty list exports header-only CSV
- [ ] Export handles todos with commas in title

### Manual Testing Checklist
- [ ] Verify download triggers automatically when clicking Export
- [ ] Verify filename is exactly `todos.csv`
- [ ] Open CSV in Excel and verify data displays correctly
- [ ] Open CSV in Google Sheets and verify data displays correctly
- [ ] Verify special characters (émojis, ñ, 中文) are preserved
- [ ] Test with empty todo list (should download header-only CSV)
- [ ] Test with 200 todos (max from API)

### Integration Tests
- [ ] Verify export works after data is loaded from API
- [ ] Verify export reflects current state if todos are filtered/sorted (future feature)

## Technical Constraints

### Implementation Notes
- Use browser's native Blob API for CSV generation
- Use `URL.createObjectURL()` and programmatic `<a>` click for download
- Must call `URL.revokeObjectURL()` to prevent memory leaks
- No server-side processing required; client-side only

### Dependencies
- No additional npm packages required
- Uses existing Angular and TypeScript capabilities
- Leverages ng-zorro-antd for button and icon styling

### Performance Considerations
- Export operation should complete in under 1 second for typical datasets (<200 items)
- CSV generation is synchronous; acceptable for current dataset size
- No loading indicator needed due to fast operation

### Browser APIs Used
- `Blob` constructor
- `URL.createObjectURL()`
- `URL.revokeObjectURL()`
- `document.createElement()`

## Definition of Done

- [x] Code is implemented in `TodoListComponent`
- [x] Unit tests are written and passing (coverage >80%)
- [ ] Manual testing completed on all target browsers
- [ ] CSV opens correctly in Excel and Google Sheets
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Documentation updated (if needed)
- [x] Follows existing code style and conventions
- [x] TypeScript strict mode compliance
- [x] No new dependencies added

## Related Documentation

- Component: `src/app/pages/todo-list/todo-list.component.ts`
- Template: `src/app/pages/todo-list/todo-list.component.html`
- Tests: `src/app/pages/todo-list/todo-list.component.spec.ts`
- Service: `src/app/services/todo.service.ts`

## References

- [RFC 4180: Common Format and MIME Type for CSV Files](https://tools.ietf.org/html/rfc4180)
- [MDN: Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
