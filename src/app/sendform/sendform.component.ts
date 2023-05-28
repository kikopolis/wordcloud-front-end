import { Component }              from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient }             from '@angular/common/http';
import { Router }                 from '@angular/router';

@Component({
    selector   : 'app-sendform',
    templateUrl: './sendform.component.html',
    styleUrls  : ['./sendform.component.scss'],
})
export class SendformComponent {
    private text: string = '';
    public sendForm: FormGroup = this.formBuilder.group({ text: ''});
    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ) {}
    
    onSubmit(): void {
        // Process checkout data here
        console.warn('Your order has been submitted', this.sendForm.value);
        if (this.sendForm.value.text != null) {
            this.text = this.sendForm.value.text;
            const formData : { text: string } = { text: this.text }
            this.http
                .post('http://localhost:8081/rest/words/send',
                      JSON.stringify(formData),
                      { headers: { 'Content-Type': 'application/json' } })
                .subscribe({
                    next: (response) => this.onSuccess(response),
                    error: (error) => this.onError(error)
                });
        } else {
            console.log('No text');
        }
    }
    
    onSuccess(response: any): void {
        const id: string = response?.id;
        if (id != null) {
            this.sendForm.reset();
            this.router.navigate(['/inprogress']);
        } else {
            console.log('No id');
        }
    }
    
    onError(error: any): void {
        console.log('Error: ' + error);
    }
}
