import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { NotesComponent } from 'app/modules/admin/apps/notes2/notes.component';
import { NotesService } from 'app/modules/admin/apps/notes2/notes.service';
import { NoteLabel } from 'app/modules/admin/apps/notes2/notes.types';
import { labelColorDefs, labelColors } from 'app/modules/admin/apps/notes2/notes.constants';

@Component({
    selector     : 'notes-settings',
    templateUrl  : './settings.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NotesSettingsComponent implements OnInit
{
    labelColors: any = labelColors;
    labelColorDefs: any = labelColorDefs;
    labels: NoteLabel[];
    labelsForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        public notesComponent: NotesComponent,
        private _formBuilder: FormBuilder,
        private _notesService: NotesService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the labels form
        this.labelsForm = this._formBuilder.group({
            labels  : this._formBuilder.array([]),
            newLabel: this._formBuilder.group({
                title: ['', Validators.required],
                color: ['orange']
            })
        });

        // Labels
        this._notesService.labels$
            .pipe(take(1))
            .subscribe((labels: NoteLabel[]) => {

                // Get the labels
                this.labels = labels;

                // Iterate through the labels
                labels.forEach((label) => {

                    // Create a label form group
                    const labelFormGroup = this._formBuilder.group({
                        id   : [label.id],
                        title: [label.title, Validators.required],
                        slug : [label.slug],
                        color: [label.color]
                    });

                    // Add the label form group to the labels form array
                    (this.labelsForm.get('labels') as FormArray).push(labelFormGroup);
                });
            });

        // Update labels when there is a value change
        this.labelsForm.get('labels').valueChanges
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.updateLabels();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add a label
     */
    addLabel(): void
    {
        // Add label to the server
        this._notesService.addLabel(this.labelsForm.get('newLabel').value).subscribe((addedLabel) => {

            // Push the new label to the labels form array
            (this.labelsForm.get('labels') as FormArray).push(this._formBuilder.group({
                id   : [addedLabel.id],
                title: [addedLabel.title, Validators.required],
                slug : [addedLabel.slug],
                color: [addedLabel.color]
            }));

            // Reset the new label form
            this.labelsForm.get('newLabel').markAsPristine();
            this.labelsForm.get('newLabel').markAsUntouched();
            this.labelsForm.get('newLabel.title').reset();
            this.labelsForm.get('newLabel.title').clearValidators();
            this.labelsForm.get('newLabel.title').updateValueAndValidity();
        });
    }

    /**
     * Delete a label
     */
    deleteLabel(id: string): void
    {
        // Get the labels form array
        const labelsFormArray = this.labelsForm.get('labels') as FormArray;

        // Remove the label from the labels form array
        labelsFormArray.removeAt(labelsFormArray.value.findIndex(label => label.id === id));

        // Delete label on the server
        this._notesService.deleteLabel(id).subscribe();
    }

    /**
     * Update labels
     */
    updateLabels(): void
    {
        // Iterate through the labels form array controls
        (this.labelsForm.get('labels') as FormArray).controls.forEach((labelFormGroup) => {

            // If the label has been edited...
            if ( labelFormGroup.dirty )
            {
                // Update the label on the server
                this._notesService.updateLabel(labelFormGroup.value.id, labelFormGroup.value).subscribe();
            }
        });

        // Reset the labels form array
        this.labelsForm.get('labels').markAsPristine();
        this.labelsForm.get('labels').markAsUntouched();
    }
}
