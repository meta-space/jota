import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotesService } from 'app/modules/admin/apps/notes2/notes.service';
import { NotesComponent } from 'app/modules/admin/apps/notes2/notes.component';
import { Note, NoteCategory } from 'app/modules/admin/apps/notes2/notes.types';

@Component({
    selector     : 'notes-list',
    templateUrl  : './list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NotesListComponent implements OnInit, OnDestroy
{
    @ViewChild('notesList') notesList: ElementRef;

    category: NoteCategory;
    notes: Note[];
    notesLoading: boolean = false;
    pagination: any;
    selectedNote: Note;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public notesComponent: NotesComponent,
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
        // Category
        this._notesService.category$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((category: NoteCategory) => {
                this.category = category;
            });

        // Notes
        this._notesService.notes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mails: Note[]) => {
                this.notes = mails;
            });

        // Notes loading
        this._notesService.notesLoading$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notesLoading: boolean) => {
                this.notesLoading = notesLoading;

                // If the note list element is available & the notes are loaded...
                if ( this.notesList && !notesLoading )
                {
                    // Reset the note list element scroll position to top
                    this.notesList.nativeElement.scrollTo(0, 0);
                }
            });

        // Pagination
        this._notesService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                this.pagination = pagination;
            });

        // Selected note
        this._notesService.note$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((note: Note) => {
                this.selectedNote = note;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On note selected
     *
     * @param note
     */
    onMailSelected(note: Note): void
    {
        // If the note is unread...
        if ( note.unread )
        {
            // Update the note object
            note.unread = false;

            // Update the note on the server
            this._notesService.updateNote(note.id, {unread: false}).subscribe();
        }

        // Execute the mailSelected observable
        this._notesService.selectedMailChanged.next(note);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
