# Copilot Instructions for Todo List Project

## Spec-Driven Development Workflow

This repository follows Spec-Driven Development (SDD) principles. All features should be implemented according to specifications in the `/specs` directory.

## Implementation Guidelines

### Before Implementation

1. **Read the relevant specification** under `/specs` before implementing any feature
2. **Inspect the existing codebase** to understand:
   - Current architecture and patterns
   - Existing components, services, and utilities
   - Code style and conventions
   - Testing patterns
3. **Verify that you understand** the requirements and acceptance criteria

### During Implementation

1. **Follow existing patterns**:
   - Match the project's folder structure
   - Follow existing naming conventions
   - Use the same coding style and formatting
   - Maintain consistency with existing components
2. **Reuse over reinvent**:
   - Use existing components, utilities, and services where possible
   - Leverage existing dependencies before adding new ones
   - Follow established patterns for similar functionality
3. **Avoid scope creep**:
   - Only modify files necessary for the feature
   - Do not refactor unrelated code unless explicitly required
   - Keep changes focused and minimal
4. **Test as you go**:
   - Write or update unit tests for new functionality
   - Follow existing test patterns (Karma/Jasmine)
   - Ensure tests cover all acceptance criteria
   - Mock external dependencies appropriately

### Before Completing

1. **Run all checks**:
   ```bash
   npm run build    # Verify the build succeeds
   npm test         # Ensure all tests pass
   ```
2. **Review against specification**:
   - Verify all acceptance criteria are met
   - Check that edge cases are handled
   - Confirm error handling is implemented
   - Validate the Definition of Done checklist
3. **Report blockers**:
   - Clearly state if any requirement cannot be implemented
   - Document any technical constraints or limitations
   - Explain any deviations from the specification

## Architecture Awareness

- Consult `/specs/architecture/frontend-architecture.md` for system design
- Understand component boundaries and responsibilities
- Follow the established service layer patterns
- Respect the routing structure

## Dependencies

- **Avoid** adding new dependencies unless absolutely necessary
- If a new dependency is required:
  - Justify the need
  - Consider bundle size impact
  - Verify compatibility with Angular 20.3.0
  - Check for existing alternatives in the project

## Code Quality

- Follow TypeScript strict mode requirements
- Use strong typing; avoid `any`
- Keep components focused and single-purpose
- Write self-documenting code with clear variable names
- Add comments only when the "why" is not obvious

## Testing Philosophy

- Test behavior, not implementation details
- Cover happy paths and edge cases
- Mock external services (HTTP, APIs)
- Ensure tests are deterministic and fast
- Follow AAA pattern (Arrange, Act, Assert)

---

**Remember**: The `/specs` directory is the source of truth. When in doubt, refer to the specifications first.
