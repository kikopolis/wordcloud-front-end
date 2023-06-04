import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import Status from "../entity/status";
import { environment } from "../../environments/environment";

@Component({
    selector: 'app-inprogress',
    templateUrl: './inprogress.component.html'
})
export class InprogressComponent implements OnInit, OnDestroy {
    protected readonly Status = Status;
    private interval: any;
    private uuid: string = '';
    private path: string = '/rest/work/status/'
    private url = environment.coreApiUrl + this.path;
    private status: Status = Status.PENDING;
    private displayStatus: string = 'Waiting...';
    private heading: string = 'Your work is being processed.';

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router) {
        this.route.queryParams.subscribe(params => {
            this.uuid = params['uuid'];
        });
    }

    ngOnInit(): void {
        this.interval = setInterval(() => {
            this.queryStatus();
            if (this.status === Status.PROCESSED || this.status === Status.FAILED) {
                clearInterval(this.interval);
            }
        }, 2000);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    getUuid(): string {
        return this.uuid;
    }

    queryStatus(): void {
        this.http.get(this.url + this.uuid, { responseType: 'text' })
            .pipe(
                tap((response: any) => this.onSuccess(response)),
                catchError((error: any) => {
                    this.onError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    onSuccess(response: any): void {
        if (response !== '') {
            this.setStatus(response);
        }
    }

    onError(error: any): void {
        console.log(error);
        this.setStatus(Status.FAILED);
    }

    setStatus(status: string): void {
        switch (status) {
            case Status.PROCESSING:
                this.status = Status.PROCESSING;
                this.displayStatus = 'Processing...';
                this.heading = 'Your work is being processed.';
                break;
            case Status.FAILED:
                this.status = Status.FAILED;
                this.displayStatus = 'Failed!';
                this.heading = 'Your work failed to process.';
                break;
            case Status.PROCESSED:
                this.status = Status.PROCESSED;
                this.displayStatus = 'Processed!';
                this.heading = 'Your work has been processed successfully.';
                break;
            case Status.PENDING:
            default:
                this.status = Status.PENDING;
                this.displayStatus = 'Waiting...';
                this.heading = 'Your work is being processed.';
                break;
        }
    }

    getDisplayStatus(): string {
        return this.displayStatus;
    }

    getHeading(): string {
        return this.heading;
    }

    getStatus(): Status {
        return this.status;
    }

    navigateToCloud(): void {
        this.router.navigate(['/wordcloud'], { queryParams: { uuid: this.uuid } });
    }

    navigateToForm(): void {
        this.router.navigate(['/sendform'], { queryParams: { uuid: this.uuid } });
    }

    headingClassList(): string {
        let classList = 'text-center mb-5 mx-auto';
        if (this.status === Status.PROCESSED) {
            return classList + ' text-success';
        }
        if (this.status === Status.FAILED) {
            return classList + ' text-danger';
        }
        return classList;
    }

    infoClassList(): string {
        let classList = 'rounded-1 text-center mt-5 p-5 pb-4 mx-auto';
        switch (this.status) {
            case Status.PROCESSING:
                return classList + ' bg-primary text-white';
            case Status.FAILED:
                return classList + ' bg-danger text-white';
            case Status.PROCESSED:
                return classList + ' bg-success text-white';
            case Status.PENDING:
            default:
                return classList + ' bg-secondary text-white';
        }
    }

    getInfoText() {
        switch (this.status) {
            case Status.PROCESSING:
                return 'Your work is being processed. Please wait. Copy the identifier above and keep it to view your cloud later.';
            case Status.FAILED:
                return 'Error has occurred. Please make sure you have uploaded a text file and the file size is less than 100MB.';
            case Status.PROCESSED:
                return 'Your work has been processed successfully. You can view your word cloud now. Click the link above.';
            case Status.PENDING:
            default:
                return 'Your work has not yet started processing. Please wait until it starts.';
        }
    }
}
