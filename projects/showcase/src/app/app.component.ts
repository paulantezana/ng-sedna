import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'showcase';

  form: FormGroup = this.getFormFields();

  constructor(
    private formBuilder: FormBuilder,
  ) {
    
  }

  private getFormFields() {
    return this.formBuilder.group({
      number: ['', Validators.required],
      serie: ['', Validators.required],
    });
  }
}
