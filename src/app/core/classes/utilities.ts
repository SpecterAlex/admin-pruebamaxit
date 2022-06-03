import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class Utilities {
  public static touchAllControls(formGroup: FormGroup | FormArray): void {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: false });
			} else if (control instanceof FormGroup || control instanceof FormArray) {
				this.touchAllControls(control);
			}
		});
	}
}
