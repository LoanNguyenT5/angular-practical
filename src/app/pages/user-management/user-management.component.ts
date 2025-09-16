import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UserFormComponent } from './user-form/user-form.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule } from '@angular/common/http';
import { UserService, User } from '../../services/user-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    UserFormComponent,
    NzBreadCrumbModule,
    NzIconModule,
    HttpClientModule,
    BreadcrumbComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  isVisible = false;
  formMode: 'add' | 'edit' = 'add';
  selectedUser: any = null;
  listOfData: any[] = [];
  resetFlag = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.listOfData = data.map(u => ({
          ...u,
          createdOn: u.createdOn ? new Date(u.createdOn).toLocaleString() : ''
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  onNewUser() {
    this.formMode = 'add';
    this.selectedUser = null;
    this.resetFormTrigger();
    this.isVisible = true;
    this.cdr.detectChanges();
  }

onRowDblClick(user: any) {
  this.formMode = 'edit';
  this.selectedUser = { ...user };


  setTimeout(() => {
    this.isVisible = true;
    this.cdr.detectChanges();
  });
}


  onSave(userFormValue: any) {
    if (this.formMode === 'add') {
      const payload: User = {
        loginName: userFormValue.login,
        customProfile: userFormValue.customProfile,
        template: userFormValue.template,
        roles: this.getSelectedRoles(userFormValue)
      };

      this.userService.createUser(payload).subscribe({
        next: () => {
          this.message.success('Save successful');
          this.loadUsers();
          this.resetFormTrigger();
          this.isVisible = false;
          this.cdr.detectChanges();
        },
        error: () => this.message.error('Save failed')
      });

    } else if (this.formMode === 'edit' && this.selectedUser) {
      const payload: User = {
        loginName: this.selectedUser.loginName,
        customProfile: userFormValue.customProfile,
        template: userFormValue.template,
        roles: this.getSelectedRoles(userFormValue)
      };

      this.userService.updateUser(this.selectedUser.loginName, payload).subscribe({
        next: () => {
          this.message.success('Update successful');
          this.loadUsers();
          this.resetFormTrigger();
          this.isVisible = false;
          this.cdr.detectChanges();
        },
        error: () => this.message.error('Update failed')
      });
    }
  }

  private resetFormTrigger() {
    this.resetFlag = !this.resetFlag;
  }

  get existingLogins(): string[] {
    return this.listOfData.map(u => u.loginName);
  }

  onCancel() {
    this.isVisible = false;
    this.cdr.detectChanges();
  }

  private getSelectedRoles(user: any): string[] {
    const roles: string[] = [];
    if (user.roleMaster) roles.push('Master');
    if (user.roleAdmin) roles.push('GlobalAdmin');
    return roles;
  }
}
