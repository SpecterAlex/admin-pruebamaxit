import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IEmployee, ICountry, IResponse } from 'src/app/core/interfaces/models';
import { EmployeeService } from '../service/employee.service';
import * as moment from 'moment';
import { Utilities } from 'src/app/core/classes/utilities';
import { IBeneficiary } from '../../../core/interfaces/models';

@Component({
  selector: 'app-employee-create-and-update',
  templateUrl: './employee-create-and-update.component.html',
  styleUrls: ['./employee-create-and-update.component.scss'],
})
export class EmployeeCreateAndUpdateComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  countries: ICountry[];

  get employeeId(): AbstractControl {
    return this.employeeForm.get('employeeId');
  }
  get firstName(): AbstractControl {
    return this.employeeForm.get('firstName');
  }
  get lastName(): AbstractControl {
    return this.employeeForm.get('lastName');
  }
  get birthDate(): AbstractControl {
    return this.employeeForm.get('birthDate');
  }
  get employeeNumber(): AbstractControl {
    return this.employeeForm.get('employeeNumber');
  }
  get curp(): AbstractControl {
    return this.employeeForm.get('curp');
  }
  get ssn(): AbstractControl {
    return this.employeeForm.get('ssn');
  }
  get phoneNumber(): AbstractControl {
    return this.employeeForm.get('phoneNumber');
  }
  get countryId(): AbstractControl {
    return this.employeeForm.get('countryId');
  }
  get beneficiaries(): FormArray {
    return this.employeeForm.get('beneficiaries') as FormArray;
  }

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.formBuilder.group({
      employeeId: [],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required, mayorEdadValidator()]],
      employeeNumber: [, [Validators.required]],
      curp: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
          ),
        ],
      ],
      ssn: [
        '',
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      countryId: ['', [Validators.required]],
      beneficiaries: this.formBuilder.array([]),
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const employeeId: string = paramMap.get('id');
      if (employeeId) {
        this.employeeService.getEmployee(employeeId).subscribe(
          (employeeResponse: IResponse<IEmployee>) => {
            if (employeeResponse) {
              this.employee = employeeResponse.data;
              this.employee.birthDate = moment(
                employeeResponse.data.birthDate
              ).format('YYYY-MM-DD');

              this.employeeForm.patchValue(this.employee);
              if (this.employee?.beneficiaries?.length > 0) {
                  this.builBeneficiaries(this.employee.beneficiaries);
              }
            } else {
              console.error('Employee not found');
            }
          },
          (error: HttpErrorResponse) => {
            alert(error);
          }
        );
      }
    });
    this.getCountries();
    this.beneficiaries.valueChanges.subscribe((_data: any[]) => {
        let total = 0;
        _data.forEach((value) => {
            if (value.participationPercent !== '') {
                total += parseFloat(value.participationPercent);
                if  (total > 100){
                    alert('el porcentaje no es correcto');
                    value.participationPercent = ''
                }
            }
        });
    });
  }

  ngOnInit(): void {}

  onBackClick(): void {
    if (this.employeeId.value) {
      this.router.navigate(['../../'], {
        relativeTo: this.activatedRoute.parent,
      });
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute.parent });
    }
  }

  getCountries(): void {
    this.employeeService.getCountries().subscribe(
      (response: IResponse<ICountry[]>) => {
        this.countries = response.data;
      },
      (error: HttpErrorResponse) => {
        alert('Error al obtener las nacionalidades');
      }
    );
  }

  onEmployeeFormSubmit(): void {
    if (!this.employeeForm.valid) {
      Utilities.touchAllControls(this.employeeForm);
      alert('Los datos no son del todo correctos');
      return;
    }
    if (this.employeeId.value) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee(): void {
    this.employeeService
      .createEmployee(this.employeeForm.getRawValue())
      .subscribe(
        (response: IResponse<IEmployee>) => {
          alert('Usario registrado correctamente');
          this.onBackClick();
        },
        (error: HttpErrorResponse) => {
          alert(error);
        }
      );
  }

  updateEmployee(): void {
    const body = this.employeeForm.getRawValue();
    console.log(body);
    this.employeeService
      .updateEmployee(this.employeeForm.getRawValue())
      .subscribe(
        (employeeResponse: IEmployee) => {
          alert('Usario actualizado correctamente');
          this.onBackClick();
        },
        (error: HttpErrorResponse) => {
          alert(error);
        }
      );
  }

  onRemoveBeneficiaryList(row: FormGroup, index: number): void {
    if (row.get('beneficiaryId').value) {
      row.get('deleted').setValue(true);

    } else {
      this.beneficiaries.removeAt(index);
    }
  }

  onAddBeneficiary(): void {
    const data: IBeneficiary = {
      beneficiaryId: null,
      firstName: '',
      lastName: '',
      birthDate: '',
      curp: '',
      ssn: '',
      phoneNumber: '',
      countryId: '',
      employeeId: '',
      participationPercent: 0,
    };
    this.beneficiaries.push(this.builBeneficiariesForm(data));
  }

  builBeneficiariesForm(data): FormGroup {
    const Beneficiary = this.formBuilder.group({
      beneficiaryId: [data.beneficiaryId],
      firstName: [data.firstName, [Validators.required]],
      lastName: [data.lastName, [Validators.required]],
      birthDate: [data.birthDate, [Validators.required, mayorEdadValidator()]],
      curp: [
        data.curp,
        [
          Validators.required,
          Validators.pattern(
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
          ),
        ],
      ],
      ssn: [
        data.ssn,
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
      ],
      phoneNumber: [
        data.phoneNumber,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      countryId: [data.countryId, [Validators.required]],
      participationPercent: [data.participationPercent, [Validators.required]],
      deleted: [false],
    });

    return Beneficiary;
  }

  builBeneficiaries(data: IBeneficiary[]): void {
    this.beneficiaries.reset();
    this.beneficiaries.clear();
    if (data.length > 0) {
      data.forEach((detail) => {
        this.beneficiaries.push(this.builBeneficiariesForm(detail));
      });
    } else {
      alert('No se encontró Beneficiario.');
    }
  }
}

export function mayorEdadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = moment(control.value);
    const today = moment();

    if (!date) {
      return null;
    }
    const age = today.diff(date, 'years');

    // return null if there's no errors
    return age < 18 ? { invalidDate: 'No es mayor de edad' } : null;
  };
}
