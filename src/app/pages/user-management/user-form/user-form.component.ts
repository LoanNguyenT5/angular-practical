import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzModalModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() mode: 'add' | 'edit' = 'add';
    private _userData: any = null;

  @Input() set userData(value: any) {
    this._userData = value;
    if (value) {
      this.form.patchValue({
        login: value.loginName ?? '',
        template: value.template ?? null,
        customProfile: value.customProfile ?? true,
        roleMaster: value.roles?.includes('Master') ?? false,
        roleAdmin: value.roles?.includes('GlobalAdmin') ?? false
      }, { emitEvent: false });

      this.applyCustomProfileEffects(value.customProfile ?? true);
    }
  }
  get userData(): any {
    return this._userData;
  }

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() existingLogins: string[] = [];
  @Input() resetTrigger = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      template: [null],
      customProfile: [true],
      roleMaster: [false],
      roleAdmin: [false]
    });
    this.handleCustomProfileChange();
  }
  private createDuplicateLoginValidator(existingLogins: string[], mode: 'add' | 'edit', currentLogin?: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;
      if (mode === 'edit' && currentLogin && value === currentLogin) {
        return null;
      }

      const exists = existingLogins.includes(value);
      return exists ? { duplicate: true } : null;
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    const loginControl = this.form.get('login');
    if (changes['resetTrigger']?.currentValue) {
      Promise.resolve().then(() => this.resetForm());
    }

    if (loginControl) {
      loginControl.setValidators([
        Validators.required,
        this.createDuplicateLoginValidator(this.existingLogins, this.mode, this.userData?.loginName)
      ]);
      loginControl.updateValueAndValidity();
    }

    if (changes['mode']?.currentValue === 'edit' && this.userData) {

      this.form.patchValue({
        login: this.userData.loginName ?? '',
        template: this.userData.template ?? null,
        customProfile: this.userData.customProfile ?? true,
        roleMaster: this.userData.roles?.includes('Master') ?? false,
        roleAdmin: this.userData.roles?.includes('GlobalAdmin') ?? false
      }, { emitEvent: false });

      this.applyCustomProfileEffects(this.form.get('customProfile')!.value);

    } else if (changes['mode']?.currentValue === 'add') {
      this.form.reset({
        login: '',
        template: null,
        customProfile: true,
        roleMaster: false,
        roleAdmin: false
      }, { emitEvent: false });

      this.applyCustomProfileEffects(true);
    }
  }

  resetForm() {
    this.form.reset({
      login: '',
      template: null,
      customProfile: true,
      roleMaster: false,
      roleAdmin: false
    }, { emitEvent: false });

    this.applyCustomProfileEffects(true);
  }

  private applyCustomProfileEffects(checked: boolean) {
    const template = this.form.get('template')!;
    const roleMaster = this.form.get('roleMaster')!;
    const roleAdmin = this.form.get('roleAdmin')!;

    if (checked) {
      template.reset(null, { emitEvent: false });
      template.disable({ emitEvent: false });
      template.clearValidators();

      roleMaster.enable({ emitEvent: false });
      roleAdmin.enable({ emitEvent: false });
    } else {
      template.enable({ emitEvent: false });
      template.setValidators(Validators.required);

      roleMaster.setValue(false, { emitEvent: false });
      roleMaster.disable({ emitEvent: false });

      roleAdmin.setValue(false, { emitEvent: false });
      roleAdmin.disable({ emitEvent: false });
    }

    template.updateValueAndValidity({ emitEvent: false });
    roleMaster.updateValueAndValidity({ emitEvent: false });
    roleAdmin.updateValueAndValidity({ emitEvent: false });
  }

  handleCustomProfileChange() {
    this.form.get('customProfile')?.valueChanges.subscribe((checked: boolean) => {
      this.applyCustomProfileEffects(checked);
    });
  }

  submitForm() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
