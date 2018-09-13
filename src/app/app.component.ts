import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MainActions } from '../actions';
import { ThankYouModel } from '../models';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary">
    <span>Latest Thank You Messages</span>

    <span class="example-fill-remaining-space"></span>

    <span><mat-icon>library_add_new</mat-icon></span>
  </mat-toolbar>
        <mat-list>
            <mat-list-item  *ngFor="let thankYou of thankYous | async; let i = index;">
                <mat-icon mat-list-icon>star</mat-icon>
                <h4 mat-line>&quot;{{ thankYou.original }}&quot;</h4>
                <p mat-line> {{ thankYou.submitter.replace('.', ' ') | titlecase }}</p>
            </mat-list-item>
        </mat-list>


  <mat-toolbar color="primary">
    <span>Thank You Statistics</span>

    <span class="example-fill-remaining-space"></span>
  </mat-toolbar>

  <h4 mat-line>Total Thank Yous:</h4>{{ (thankYous | async).length }}
  <h4 mat-line>Random Thank You:</h4>
  <button raised color="accent" (click)="getRandom()">Get Random Thank You</button>
  <ng-template [ngIf]="showRandom">
    <mat-list>
      <mat-list-item>
          <mat-icon mat-list-icon>stars</mat-icon>
          <h4 mat-line>&quot;{{ randomThankYou.original }}&quot;</h4>
          <p mat-line> {{ randomThankYou.submitter.replace('.', ' ') | titlecase }}</p>
      </mat-list-item>
    </mat-list>
  </ng-template>

  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

  <h1> Add a Thank You </h1>
  <div class="example-container">
    <form [formGroup]="thankYouForm" name="form">
        <mat-form-field>
            <input matInput placeholder="Thanks..." type="string" formControlName="thankYou" required>
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Your Name" type="string" formControlName="name" required>
        </mat-form-field>
        <button raised color="accent" [disabled]="!thankYouForm.valid" (click)="onFormSubmit()">Apply</button>
    </form>
  </div>
<br><br><br>
`,
  styles: [
    `
      .example-fill-remaining-space {
        /* This fills the remaining space, by using flexbox. 
         Every toolbar row uses a flexbox row layout. */
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public thankYouList: AngularFireList<any>;
  public thankYous: Observable<ThankYouModel[]>;
  public thankYouArray: ThankYouModel[];
  public randomThankYou: ThankYouModel;
  public showRandom = false;
  constructor(db: AngularFireDatabase, private formBuilder: FormBuilder) {
    this.thankYouList = db.list('messages');
    this.thankYous = this.thankYouList.valueChanges();
    // MainActions.createLoadSuccessAction(this.thankYous);
    this.thankYous.subscribe(thankYous => {
      return (this.thankYouArray = thankYous);
    });
  }

  thankYouForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.min(0)]],
    thankYou: ['', [Validators.required, Validators.min(0)]],
  });

  public async addThankYou(submitter: string, original: string): Promise<void> {
    this.thankYouList.push({
      submitter,
      original,
    });
  }

  onFormSubmit() {
    if (this.thankYouForm.valid) {
      this.addThankYou(this.thankYouForm.value.name, this.thankYouForm.value.thankYou);
    }
  }

  getRandom() {
    this.randomThankYou = this.thankYouArray[
      Math.floor(Math.random() * this.thankYouArray.length)
    ];
    this.showRandom = true;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
