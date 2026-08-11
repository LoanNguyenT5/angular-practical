import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TodoListComponent } from './todo-list.component';
import { TodoService, Todo } from '../../services/todo.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { DownloadOutline } from '@ant-design/icons-angular/icons';

const mockTodos: Todo[] = [
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Write "tests"', completed: true }
];

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
        { provide: NZ_ICONS, useValue: [DownloadOutline] },
        provideHttpClient(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(2);
  });

  describe('exportToCsv', () => {
    let createObjectURLSpy: jasmine.Spy;
    let revokeObjectURLSpy: jasmine.Spy;
    let clickSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let anchorElement: { href: string; download: string; click: jasmine.Spy };

    beforeEach(() => {
      anchorElement = { href: '', download: '', click: jasmine.createSpy('click') };
      const originalCreateElement = document.createElement.bind(document);
      createElementSpy = spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'a') return anchorElement as any;
        return originalCreateElement(tag);
      });
      spyOn(document.body, 'appendChild').and.stub();
      spyOn(document.body, 'removeChild').and.stub();
      createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
      revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
    });

    it('should create an anchor element and trigger download', () => {
      component.exportToCsv();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(anchorElement.download).toBe('todos.csv');
      expect(anchorElement.click).toHaveBeenCalled();
    });

    it('should revoke the object URL after download', () => {
      component.exportToCsv();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should generate CSV with correct headers and rows', () => {
      let capturedBlob: Blob | null = null;
      createObjectURLSpy.and.callFake((blob: Blob) => {
        capturedBlob = blob;
        return 'blob:mock-url';
      });

      component.exportToCsv();

      expect(capturedBlob).not.toBeNull();
      const reader = new FileReader();
      reader.readAsText(capturedBlob!);

      return new Promise<void>((resolve) => {
        reader.onload = () => {
          const csv = reader.result as string;
          const lines = csv.split('\n');
          expect(lines[0]).toBe('id,title,completed');
          expect(lines[1]).toBe('1,\"Buy groceries\",false');
          expect(lines[2]).toBe('2,\"Write ""tests""\",true');
          resolve();
        };
      });
    });

    it('should escape double quotes in titles', () => {
      let capturedBlob: Blob | null = null;
      createObjectURLSpy.and.callFake((blob: Blob) => {
        capturedBlob = blob;
        return 'blob:mock-url';
      });

      component.todos = [{ id: 3, title: 'Say "hello"', completed: false }];
      component.exportToCsv();

      const reader = new FileReader();
      reader.readAsText(capturedBlob!);
      return new Promise<void>((resolve) => {
        reader.onload = () => {
          const csv = reader.result as string;
          expect(csv).toContain('"Say ""hello"""');
          resolve();
        };
      });
    });
  });
});
