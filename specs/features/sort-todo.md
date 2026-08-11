# Sort Todo List

## Overview

Allow users to sort the Todo List by title.

## User Story

As a user,
I want to sort my todos by title,
so that I can find todos more easily.

## Functional Requirements

### Sort by Title

The user can sort todos by title.

Supported directions:

- Ascending: A → Z
- Descending: Z → A

### Default Behavior

The Todo List keeps its original order by default.

### Empty List

Sorting an empty Todo List must not cause an error.

### Data Integrity

Sorting must not modify the original todo data.

## Acceptance Criteria

- [ ] A sort control is displayed on the Todo List page.
- [ ] User can select ascending order.
- [ ] User can select descending order.
- [ ] Todos are correctly sorted by title.
- [ ] Original todo data is not modified.
- [ ] Empty Todo List can be sorted without errors.
- [ ] Existing Todo functionality still works.

## Testing Requirements

Tests must cover:

- Ascending sort.
- Descending sort.
- Empty todo list.
- Original data is not mutated.