import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from "rxjs";
import { environment } from "../../environments/environment";

@Component({
    selector: 'app-sendform',
    templateUrl: './sendform.component.html',
    styleUrls: ['./sendform.component.css'],
})
export class SendformComponent {
    public sendForm: FormGroup = this.formBuilder.group({ text: '', ignoredWords: '', ignoreDefaultWords: false });
    public overlayClasses: string = 'overlay overlay-hidden';
    private path: string = '/rest/words/send';
    private url = environment.coreApiUrl + this.path;
    private text: string = '';
    private ignoredWords: string = '';
    private ignoreDefaultWords: boolean = false;
    private file: File | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ) {
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file != null) {
            this.file = file;
        }
    }

    onSubmit(): void {
        if (this.file != null) {
            this.setOverlayClasses(true);
            this.ignoredWords = this.sendForm.value.ignoredWords;
            this.ignoreDefaultWords = this.sendForm.value.ignoreDefaultWords;
            const formData: FormData = new FormData();
            formData.append('file', this.file);
            formData.append('ignoredWords', this.ignoredWords);
            formData.append('ignoreDefaultWords', this.ignoreDefaultWords.toString());
            this.http
                .post(this.url, formData, { responseType: 'text' })
                .pipe(
                    tap((response: any) => this.onSuccess(response)),
                    catchError((error: any) => {
                        this.onError(error);
                        throw error;
                    }),
                )
                .subscribe();
        } else {
            console.log('No text file');
        }
    }

    onSuccess(response: any): void {
        if (response !== '') {
            this.sendForm.reset();
            this.router.navigate(['/inprogress'],
                { queryParams: { uuid: response } });
        }
        this.setOverlayClasses(false);
    }

    onError(error: any): void {
        console.log('Error: ' + error);
        this.setOverlayClasses(false);
    }

    setOverlayClasses(show: boolean): void {
        this.overlayClasses = show ? 'overlay overlay-shown' : 'overlay overlay-hidden';
    }
}
