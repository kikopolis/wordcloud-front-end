import { Component, ViewChild } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { CloudData, CloudOptions, TagCloudComponent, ZoomOnHoverOptions } from "angular-tag-cloud-module";
import Word from "../entity/word";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-cloud',
    templateUrl: './cloud.component.html'
})
export class CloudComponent {
    @ViewChild(TagCloudComponent) tagCloudComponent!: TagCloudComponent;
    private path: string = '/rest/work/counts/';
    private url: string = environment.coreApiUrl + this.path;
    private words: Word[] = [];
    private uuid: string = '';
    public workUuidGroup: FormGroup = this.formBuilder.group({ workUuid: '' });
    public data: CloudData[] = [];
    public options: CloudOptions = {
        width: 1000,
        height: 400,
        overflow: false
    }
    public zoomOnHoverOptions: ZoomOnHoverOptions = {
        scale: 2,
        transitionTime: 0.3,
        delay: 0.2
    }
    public error: string = '';

    constructor(private http: HttpClient,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            if (params['uuid'] === undefined) {
                return;
            }
            this.uuid = params['uuid'];
        });
        this.getCloud();
    }

    sortAscending() {
        this.words.sort((a, b) => a.count - b.count);
    }

    sortDescending() {
        this.words.sort((a, b) => b.count - a.count);
    }

    getWords(): any {
        return this.words;
    }

    onSubmit(): void {
        if (this.workUuidGroup.value.workUuid !== '') {
            this.uuid = this.workUuidGroup.value.workUuid;
            this.getCloud();
        }
    }

    private getCloud(): void {
        if (this.uuid === '') {
            return;
        }
        this.http.get(this.url + this.uuid)
            .pipe(
                tap((response: any) => this.onSuccess(response)),
                catchError((error: any) => {
                    this.onError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    private onSuccess(response: any): void {
        this.error = '';
        if (response !== '') {
            this.words = response;
            this.sortDescending();
            this.words.forEach((word: any) => {
                this.data.push({ text: `"${ word.word }": ${ word.count }`, weight: word.count });
            });
        }
        if (this.tagCloudComponent === undefined) {
            return;
        }
        this.tagCloudComponent.reDraw();
    }

    private onError(error: any): void {
        console.log(error);
        if (error.status === 404) {
            this.error = 'Wrong identifier supplied. Nothing found.';
        } else if (error.status === 400) {
            this.error = 'Invalid UUID';
        } else if (error.status === 500) {
            this.error = 'Internal server error';
        } else {
            this.error = 'Unknown error';
        }
    }
}
