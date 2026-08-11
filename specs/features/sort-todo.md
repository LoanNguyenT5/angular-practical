# Feature Specification: Sort Todo List

## Overview

Add sorting functionality to the Todo List to allow users to organize todos alphabetically by title in ascending order.

## User Story

**As a** user viewing the todo list  
**I want to** sort todos alphabetically by title  
**So that** I can easily find and organize todos in a predictable order

## Functional Requirements

### FR-1: Sort Button
- Display a "Sort" button in the todo list header
- The button should be clearly visible and styled appropriately
- The button should be enabled at all times (regardless of list state)

### FR-2: Sort Behavior
- Clicking the "Sort" button sorts todos by the `title` field
- Sorting order is **ascending** (A → Z, alphabetically)
- The default sort field is **Title** (only field supported in initial implementation)
- Sorting is case-insensitive (e.g., "apple" comes before "Banana")

### FR-3: Visual Feedback
- After sorting, the table should update immediately to reflect the new order
- **TODO**: Consider adding visual indicator (icon/label) to show current sort state

### FR-4: Sort Persistence
- Sort is applied to the current in-memory list (frontend only)
- Sort does not persist after page reload
- **TODO**: Consider persisting sort preference in localStorage for future enhancement

## User Flow

1. User navigates to the Todo List page (`/todo-list`)
2. System loads and displays todos from the API
3. User clicks the "Sort" button
4. System sorts the todos array by title in ascending order
5. Table re-renders with sorted todos

## Technical Implementation Notes

### Sorting Logic
```typescript
// Example sorting implementation
sortByTitle(): void {
  this.todos.sort((a, b) => 
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );
}
```

### Considerations
- Use `String.prototype.localeCompare()` for proper alphabetical sorting
- Use `sensitivity: 'base'` option for case-insensitive comparison
- Sort modifies the array in-place; trigger change detection afterward

## Acceptance Criteria

- [ ] Sort button is visible in the todo list header
- [ ] Clicking Sort button sorts todos by title in ascending order (A → Z)
- [ ] Sorting is case-insensitive
- [ ] Todo items are displayed correctly after sorting
- [ ] Table updates immediately after sort is applied
- [ ] Sorting works correctly with empty list (no error)
- [ ] Sorting preserves all todo properties (id, title, completed)
- [ ] Multiple clicks on Sort maintain the ascending order
- [ ] No console errors occur during sorting

## Testing Requirements

### Unit Tests
- [ ] Component creates successfully
- [ ] Sort button triggers the sort method
- [ ] Sorting arranges todos alphabetically (A → Z)
- [ ] Sorting is case-insensitive ("apple" before "Banana")
- [ ] Sorting handles empty list without error
- [ ] Sorting preserves all todo data (id, title, completed)
- [ ] Change detection is triggered after sort

### Manual Testing Checklist
- [ ] Load todo list with mixed-case titles
- [ ] Click Sort button and verify alphabetical order (A → Z)
- [ ] Verify todos starting with lowercase come before uppercase equivalents
- [ ] Test with empty list (should not error)
- [ ] Verify all todo data remains intact after sorting
- [ ] Test with special characters in titles (e.g., "123 Task", "#Important")

### Edge Cases
- Empty todo list (no items to sort)
- Single todo item (sort still works, no errors)
- Todos with identical titles (maintain original order for ties)
- Todos with numbers in titles (e.g., "Task 1", "Task 10", "Task 2")
- Todos with special characters or emojis

## UI/UX Design

### Button Placement
- Place Sort button in the todo list header, near the Export button
- Use consistent styling with other action buttons

### Button Style
- **TODO**: Specify icon (e.g., sort-ascending icon from ng-zorro)
- **TODO**: Consider button type (default vs. primary)

### Visual Indicator
- **TODO**: Add icon or label showing current sort state (optional for v1)

## Technical Constraints

### Implementation
- Frontend-only sorting (no backend API call required)
- Sort operates on the current in-memory `todos` array
- Must trigger change detection after sorting (zoneless change detection)

### Performance
- Sorting should complete instantly for typical datasets (<200 items)
- No loading indicator needed for synchronous operation

### Browser Compatibility
- `String.localeCompare()` supported in all modern browsers
- No polyfill required

## Definition of Done

- [ ] Sort button added to todo list header
- [ ] Sort method implemented and working correctly
- [ ] Unit tests written and passing (coverage >80%)
- [ ] Manual testing completed successfully
- [ ] All edge cases handled
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Follows existing code style and conventions
- [ ] TypeScript strict mode compliance
- [ ] No new dependencies added

## Future Enhancements

- [ ] Support sorting by other fields (ID, Completed status)
- [ ] Toggle between ascending and descending order
- [ ] Visual indicator showing current sort field and direction
- [ ] Persist sort preference in localStorage
- [ ] Support multi-column sorting (e.g., sort by completed, then by title)
- [ ] Add sort options dropdown instead of single button

## Related Documentation

- Component: `src/app/pages/todo-list/todo-list.component.ts`
- Template: `src/app/pages/todo-list/todo-list.component.html`
- Tests: `src/app/pages/todo-list/todo-list.component.spec.ts`
- Service: `src/app/services/todo.service.ts`
- Related Feature: `specs/features/export-todo.md`

## References

- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
