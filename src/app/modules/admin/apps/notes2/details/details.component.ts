import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotesService } from 'app/modules/admin/apps/notes2/notes.service';
import { Note, NoteFolder, NoteLabel } from 'app/modules/admin/apps/notes2/notes.types';
import { labelColorDefs } from 'app/modules/admin/apps/notes2/notes.constants';

@Component({
    selector     : 'notes-details',
    templateUrl  : './details.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NotesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('infoDetailsPanelOrigin') private _infoDetailsPanelOrigin: MatButton;
    @ViewChild('infoDetailsPanel') private _infoDetailsPanel: TemplateRef<any>;

    folders: NoteFolder[];
    labelColors: any;
    labels: NoteLabel[];
    note: Note;
    replyFormActive: boolean = false;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _elementRef: ElementRef,
        private _noteService: NotesService,
        private _overlay: Overlay,
        private _router: Router,
        private _viewContainerRef: ViewContainerRef
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
        // Get the label colors
        this.labelColors = labelColorDefs;

        // Folders
        this._noteService.folders$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((folders: NoteFolder[]) => {
                this.folders = folders;
            });

        // Labels
        this._noteService.labels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((labels: NoteLabel[]) => {
                this.labels = labels;
            });

        // Note
        this._noteService.note$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mail: Note) => {
                this.note = mail;
            });

        // Selected note changed
        this._noteService.selectedMailChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // De-activate the reply form
                this.replyFormActive = false;
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
     * Get the current folder
     */
    getCurrentFolder(): any
    {
        return this._activatedRoute.snapshot.paramMap.get('folder');
    }

    /**
     * Move to folder
     *
     * @param folderSlug
     */
    moveToFolder(folderSlug: string): void
    {
        // Find the folder details
        const folder = this.folders.find(item => item.slug === folderSlug);

        // Return if the current folder of the mail
        // is already equals to the given folder
        if ( this.note.folder === folder.id )
        {
            return;
        }

        // Update the note object
        this.note.folder = folder.id;

        // Update the note on the server
        this._noteService.updateNote(this.note.id, {folder: this.note.folder}).subscribe();

        // Navigate to the parent
        this._router.navigate(['./'], {relativeTo: this._activatedRoute.parent});
    }

    /**
     * Toggle label
     *
     * @param label
     */
    toggleLabel(label: NoteLabel): void
    {
        let deleted = false;

        // Update the note object
        if ( this.note.labels.includes(label.id) )
        {
            // Set the deleted
            deleted = true;

            // Delete the label
            this.note.labels.splice(this.note.labels.indexOf(label.id), 1);
        }
        else
        {
            // Add the label
            this.note.labels.push(label.id);
        }

        // Update the note on the server
        this._noteService.updateNote(this.note.id, {labels: this.note.labels}).subscribe();

        // If the label was deleted...
        if ( deleted )
        {
            // If the current activated route has a label parameter and it equals to the one we are removing...
            if ( this._activatedRoute.snapshot.paramMap.get('label') && this._activatedRoute.snapshot.paramMap.get('label') === label.slug )
            {
                // Navigate to the parent
                this._router.navigate(['./'], {relativeTo: this._activatedRoute.parent});
            }
        }
    }

    /**
     * Toggle important
     */
    toggleImportant(): void
    {
        // Update the note object
        this.note.important = !this.note.important;

        // Update the note on the server
        this._noteService.updateNote(this.note.id, {important: this.note.important}).subscribe();

        // If the important was removed...
        if ( !this.note.important )
        {
            // If the current activated route has a filter parameter and it equals to the 'important'...
            if ( this._activatedRoute.snapshot.paramMap.get('filter') && this._activatedRoute.snapshot.paramMap.get('filter') === 'important' )
            {
                // Navigate to the parent
                this._router.navigate(['./'], {relativeTo: this._activatedRoute.parent});
            }
        }
    }

    /**
     * Toggle star
     */
    toggleStar(): void
    {
        // Update the note object
        this.note.starred = !this.note.starred;

        // Update the note on the server
        this._noteService.updateNote(this.note.id, {starred: this.note.starred}).subscribe();

        // If the star was removed...
        if ( !this.note.starred )
        {
            // If the current activated route has a filter parameter and it equals to the 'starred'...
            if ( this._activatedRoute.snapshot.paramMap.get('filter') && this._activatedRoute.snapshot.paramMap.get('filter') === 'starred' )
            {
                // Navigate to the parent
                this._router.navigate(['./'], {relativeTo: this._activatedRoute.parent});
            }
        }
    }

    /**
     * Toggle unread
     *
     * @param unread
     */
    toggleUnread(unread: boolean): void
    {
        // Update the note object
        this.note.unread = unread;

        // Update the note on the server
        this._noteService.updateNote(this.note.id, {unread: this.note.unread}).subscribe();
    }

    /**
     * Reply
     */
    reply(): void
    {
        // Activate the reply form
        this.replyFormActive = true;

        // Scroll to the bottom of the details pane
        setTimeout(() => {
            this._elementRef.nativeElement.scrollTop = this._elementRef.nativeElement.scrollHeight;
        });
    }

    /**
     * Reply all
     */
    replyAll(): void
    {
        // Activate the reply form
        this.replyFormActive = true;

        // Scroll to the bottom of the details pane
        setTimeout(() => {
            this._elementRef.nativeElement.scrollTop = this._elementRef.nativeElement.scrollHeight;
        });
    }

    /**
     * Forward
     */
    forward(): void
    {
        // Activate the reply form
        this.replyFormActive = true;

        // Scroll to the bottom of the details pane
        setTimeout(() => {
            this._elementRef.nativeElement.scrollTop = this._elementRef.nativeElement.scrollHeight;
        });
    }

    /**
     * Discard
     */
    discard(): void
    {
        // Deactivate the reply form
        this.replyFormActive = false;
    }

    /**
     * Send
     */
    send(): void
    {
        // Deactivate the reply form
        this.replyFormActive = false;
    }

    /**
     * Open info details panel
     */
    openInfoDetailsPanel(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._infoDetailsPanelOrigin._elementRef.nativeElement)
                                  .withFlexibleDimensions(true)
                                  .withViewportMargin(16)
                                  .withLockedPosition(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._infoDetailsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._overlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._overlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if ( this._overlayRef && this._overlayRef.hasAttached() )
            {
                // Detach it
                this._overlayRef.detach();
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
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
