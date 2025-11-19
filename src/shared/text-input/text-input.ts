import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css'
})
export class TextInput implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  maxDate = input<string>('');

  constructor(@Self() public ngControl: NgControl) {  //self is a dependecy injection modifier
    this.ngControl.valueAccessor = this;              //tells angualr to look for this ngControl injector on current element only and not it's parent or ancestor
  }                                                   //important to add this so that Angualr does not mix up the text input control 


  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  
  get control(): FormControl {
    return this.ngControl.control as FormControl
  }
}
