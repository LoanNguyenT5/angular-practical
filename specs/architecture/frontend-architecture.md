# Frontend Architecture

## Overview

This is an Angular 20.3.0 single-page application (SPA) with server-side rendering (SSR) support. The application features a modern, component-based architecture using Angular's standalone components and a modular design with lazy-loaded routes.

## Technology Stack

### Core Framework
- **Angular**: 20.3.0
- **TypeScript**: 5.9.2 (strict mode enabled)
- **RxJS**: 7.8.0 (reactive programming)
- **Node.js**: Required for SSR

### UI Framework
- **ng-zorro-antd**: 20.2.1 (Ant Design for Angular)
  - Provides pre-built UI components (tables, buttons, modals, forms, etc.)
  - Consistent design language and styling

### Server-Side Rendering
- **Angular SSR**: 20.3.0
- **Express**: 5.1.0 (Node.js server for SSR)

### Testing
- **Jasmine**: 5.9.0 (test framework)
- **Karma**: 6.4.0 (test runner)
- **Karma plugins**: Chrome launcher, coverage reporter, Jasmine reporter

### Build & Development
- **Angular CLI**: 20.3.0
- **Angular Build**: 20.3.0 (esbuild-based)

## Project Structure

```
angular-practical/
├── .github/                      # GitHub-specific files
│   └── copilot-instructions.md   # AI coding assistant guidelines
├── public/                       # Static assets served directly
├── specs/                        # Feature and API specifications
│   ├── features/                 # Feature requirements
│   ├── api/                      # API contracts
│   └── architecture/             # Architecture documentation
├── src/
│   ├── app/
│   │   ├── app.ts                # Root component (layout with header/sidebar)
│   │   ├── app.html              # Root template
│   │   ├── app.scss              # Root styles
│   │   ├── app.config.ts         # Application providers and configuration
│   │   ├── app.config.server.ts  # Server-specific configuration
│   │   ├── app.routes.ts         # Main routing configuration
│   │   ├── app.routes.server.ts  # Server-specific routes
│   │   ├── icons-provider.ts     # Icon configuration for ng-zorro
│   │   ├── header/               # Header component
│   │   │   └── app-header.component.*
│   │   ├── sidebar/              # Sidebar navigation component
│   │   │   └── app-sidebar.component.*
│   │   ├── breadcrumb/           # Breadcrumb component
│   │   │   └── breadcrumb.component.*
│   │   ├── pages/                # Feature pages (lazy-loaded)
│   │   │   ├── todo-list/        # Todo list feature
│   │   │   │   ├── todo-list.component.*
│   │   │   │   ├── todo-list.routes.ts
│   │   │   │   └── todo-list.component.spec.ts
│   │   │   └── user-management/  # User management feature
│   │   │       ├── user-management.component.*
│   │   │       ├── user-management.routes.ts
│   │   │       └── user-form/    # Sub-feature: user form
│   │   │           └── user-form.component.*
│   │   └── services/             # Shared services
│   │       ├── todo.service.ts   # Todo data service
│   │       └── user-service.ts   # User data service
│   ├── main.ts                   # Browser entry point
│   ├── main.server.ts            # Server entry point
│   ├── server.ts                 # Express server configuration
│   ├── index.html                # HTML shell
│   ├── styles.scss               # Global SCSS styles
│   └── theme.less                # ng-zorro theme customization
├── angular.json                  # Angular workspace configuration
├── tsconfig.json                 # TypeScript configuration (strict mode)
├── tsconfig.app.json             # App-specific TypeScript config
├── tsconfig.spec.json            # Test-specific TypeScript config
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Architecture Patterns

### Standalone Components
- All components are **standalone** (no NgModules)
- Components explicitly import their dependencies
- Reduces boilerplate and improves tree-shaking
- Example: `TodoListComponent` imports `NzTableModule`, `NzButtonModule`, etc.

### Lazy Loading
- Feature pages are lazy-loaded via routing for better performance
- Each feature has its own `.routes.ts` file
- Example:
  ```typescript
  {
    path: 'todo-list',
    loadChildren: () =>
      import('./pages/todo-list/todo-list.routes')
        .then(m => m.TODO_LIST_ROUTES)
  }
  ```

### Zoneless Change Detection
- Application uses **zoneless change detection** (`provideZonelessChangeDetection()`)
- More efficient than traditional Zone.js-based change detection
- Requires manual or signal-based change detection triggers
- Components use `ChangeDetectorRef.detectChanges()` for manual updates

### Dependency Injection
- Services use `providedIn: 'root'` for singleton instances
- Constructor injection for all dependencies
- Example: `TodoService` is injected into `TodoListComponent`

## Component Structure

### Layout Components
- **App** (`app.ts`): Root component with collapsible sidebar and header
- **AppHeaderComponent**: Top navigation bar with user avatar and dropdown
- **AppSidebarComponent**: Side navigation menu with routing links
- **BreadcrumbComponent**: Breadcrumb navigation (shared component)

### Feature Components
- **TodoListComponent**: Displays list of todos with export functionality
- **UserManagementComponent**: User CRUD operations with table and modal
- **UserFormComponent**: Reusable form for add/edit user

### Component Conventions
- Filename pattern: `{name}.component.{ts|html|scss|spec.ts}`
- Selector prefix: `app-` (e.g., `app-todo-list`)
- Standalone: `true`
- Imports: Explicitly list all dependencies (modules, components)

## State Management

### Current Approach
- **No centralized state management** (no NgRx, Akita, etc.)
- Component-local state using class properties
- Services act as state holders and data sources
- Observables (RxJS) for asynchronous data streams

### Data Flow
1. Component calls service method (e.g., `todoService.getTodos()`)
2. Service makes HTTP request and returns `Observable<T>`
3. Component subscribes and updates local state
4. Template reactively displays data via property binding

Example:
```typescript
// Component
loadTodos(): void {
  this.todoService.getTodos().subscribe({
    next: (data: Todo[]) => {
      this.todos = data;
      this.cdr.detectChanges(); // Trigger change detection
    },
    error: (err) => console.error('Error loading todos', err)
  });
}
```

### Future Considerations
- **TODO**: Consider Angular Signals for reactive state (Angular 16+)
- **TODO**: Evaluate need for centralized state management as app grows

## Data Models

### Todo Model
```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

### User Model
**TODO**: Document User model structure (see `user-service.ts`)

## Service Layer

### TodoService
- **Location**: `src/app/services/todo.service.ts`
- **Purpose**: Fetch todos from external API
- **API**: `https://jsonplaceholder.typicode.com/todos`
- **Methods**:
  - `getTodos(): Observable<Todo[]>` - Retrieves all todos

### UserService
- **Location**: `src/app/services/user-service.ts`
- **Purpose**: Manage user data (CRUD operations)
- **TODO**: Document API endpoint and methods

### HTTP Client
- Uses Angular's `HttpClient` (provided in `app.config.ts`)
- No interceptors configured currently
- **TODO**: Add error handling interceptor if needed
- **TODO**: Add authentication interceptor when backend is integrated

## Routing

### Route Structure
```typescript
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user-management' },
  {
    path: 'user-management',
    loadChildren: () => import('./pages/user-management/user-management.routes')
      .then(m => m.USER_MANAGEMENT_ROUTES)
  },
  {
    path: 'todo-list',
    loadChildren: () => import('./pages/todo-list/todo-list.routes')
      .then(m => m.TODO_LIST_ROUTES)
  }
];
```

### Navigation
- Default route: `/user-management`
- Sidebar component handles navigation links
- **TODO**: Add route guards if authentication is implemented

## Testing Strategy

### Unit Testing
- **Framework**: Jasmine + Karma
- **Pattern**: AAA (Arrange, Act, Assert)
- Test files: `*.spec.ts` (co-located with components)

### Test Setup
- Use `TestBed.configureTestingModule()` for component testing
- Mock services using `jasmine.createSpyObj()`
- Provide zoneless change detection in tests: `provideZonelessChangeDetection()`
- Mock ng-zorro icons: `{ provide: NZ_ICONS, useValue: [...] }`

### Example Test Structure
```typescript
describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    todoService = jasmine.createSpyObj('TodoService', ['getTodos']);
    todoService.getTodos.and.returnValue(of(mockTodos));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: todoService },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();
  });

  it('should load todos on init', () => {
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(2);
  });
});
```

### Coverage
- **TODO**: Set up code coverage thresholds
- **TODO**: Document target coverage percentage

### E2E Testing
- **TODO**: E2E testing framework not yet configured
- Consider Playwright or Cypress for future implementation

## Styling

### Global Styles
- **SCSS**: `src/styles.scss` for global styles
- **Less**: `src/theme.less` for ng-zorro theme customization

### Component Styles
- Component-scoped SCSS files (e.g., `todo-list.component.scss`)
- View encapsulation: Default (Emulated)

### Design System
- ng-zorro-antd provides consistent styling
- Follow Ant Design principles for UI patterns
- **TODO**: Document custom theme variables and color palette

## Build & Deployment

### Development Server
```bash
npm start
# or
ng serve
# Runs on http://localhost:4200/
```

### Production Build
```bash
npm run build
# Output: dist/my-app/browser/ (client)
# Output: dist/my-app/server/ (server)
```

### Server-Side Rendering
```bash
npm run serve:ssr:my-app
# Runs Express server with SSR
```

### Testing
```bash
npm test
# Runs Karma with Chrome launcher
```

### Build Configuration
- **Target**: ES2022
- **Module**: preserve (ESM)
- **Strict Mode**: Enabled (TypeScript)
- **Builder**: Angular Build (esbuild-based, faster than Webpack)

### Environment Configuration
- **TODO**: Document environment file setup if needed
- **TODO**: Document deployment process (CI/CD, hosting platform)

## Key Configuration Files

### `app.config.ts` (Application Configuration)
Providers:
- `provideBrowserGlobalErrorListeners()`: Global error handling
- `provideZonelessChangeDetection()`: Modern change detection
- `provideRouter(routes)`: Routing
- `provideClientHydration(withEventReplay())`: SSR hydration
- `provideNzIcons(icons)`: ng-zorro icons
- `provideNzI18n(en_US)`: Internationalization
- `provideAnimationsAsync()`: Animations
- `provideHttpClient()`: HTTP client

### `tsconfig.json` (TypeScript Configuration)
Strict mode enabled:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

### `angular.json` (Workspace Configuration)
- **TODO**: Document build configurations if customized
- **TODO**: Document asset paths and environment files

## Performance Considerations

### Code Splitting
- Lazy-loaded routes ensure smaller initial bundle
- Each feature module is loaded on-demand

### Change Detection
- Zoneless change detection reduces overhead
- Manual change detection triggers provide fine-grained control

### SSR
- Server-side rendering improves initial page load and SEO
- Event replay ensures interactive elements work after hydration

### Optimizations
- **TODO**: Implement OnPush change detection strategy for pure components
- **TODO**: Add service worker for offline support (PWA)
- **TODO**: Optimize images and assets
- **TODO**: Configure lazy loading for images

## Security

### Current State
- No authentication/authorization implemented
- **TODO**: Add authentication guards when backend is integrated
- **TODO**: Implement CSRF protection if needed
- **TODO**: Add input sanitization for user-generated content

### Best Practices
- TypeScript strict mode enforces type safety
- Angular's built-in XSS protection (sanitization)
- **TODO**: Add Content Security Policy (CSP) headers

## Future Enhancements

- [ ] Add authentication and authorization
- [ ] Implement centralized state management (consider Signals or NgRx)
- [ ] Set up E2E testing framework
- [ ] Add PWA support (service workers, offline mode)
- [ ] Implement internationalization (i18n) for multiple languages
- [ ] Add error tracking (e.g., Sentry)
- [ ] Set up CI/CD pipeline
- [ ] Implement feature flags for gradual rollouts
- [ ] Add analytics tracking
- [ ] Optimize bundle size and performance metrics

## References

- [Angular Documentation](https://angular.dev/)
- [ng-zorro-antd Components](https://ng.ant.design/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular SSR Guide](https://angular.dev/guide/ssr)

---

**Last Updated**: 2026-08-11  
**Maintained By**: Development Team
