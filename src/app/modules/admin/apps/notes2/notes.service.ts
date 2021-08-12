import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Note, NoteCategory, NoteFilter, NoteFolder, NoteLabel } from 'app/modules/admin/apps/notes2/notes.types';
import { DatabaseService } from 'app/core/database/services/database.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService
{
    selectedMailChanged: BehaviorSubject<any> = new BehaviorSubject(null);
    private _category: BehaviorSubject<NoteCategory> = new BehaviorSubject(null);
    private _filters: BehaviorSubject<NoteFilter[]> = new BehaviorSubject(null);
    private _folders: BehaviorSubject<NoteFolder[]> = new BehaviorSubject(null);
    private _labels: BehaviorSubject<NoteLabel[]> = new BehaviorSubject(null);
    private _notes: BehaviorSubject<Note[]> = new BehaviorSubject(null);
    private _notesLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _note: BehaviorSubject<Note> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, _dbService: DatabaseService)
    {
        _dbService.db.collections.hero
        .findOne({ selector: { color: 'blue' } })
        .exec()
        .then(
            () => {
                console.log('ran query');
            }
        );


        // // create task
        // //
        // const newTask = _dbService.db.collections.task.newDocument({
        //     guid: '22',
        //     title: 'preparations',
        //     priority: 1,
        //     order: 1
        // });

        // newTask.save()
        //        .then(() => console.log('new task created'))
        //        .catch(() => console.error('failed to create new task'));


        // // create tag
        // _dbService.db.collections.tag.newDocument({ name: 'test' }).save();

        // // update task list
        // _dbService.db.tag.findOne().exec().then((firstTag) => {
        //     _dbService.db.task.findOne().exec().then((firstTask) => {
        //         firstTask.atomicPatch({
        //             section: 'first steps',
        //             completed: false,
        //             tags: [ 'test' ]
        //         })
        //         .then(() => console.log('task updated'))
        //         .catch((err) => console.log('update failed ' + err));
        //     });
        // });

        // _dbService.db.tag.findOne().exec().then((tag) => {
        //     console.log(`tag: ${JSON.stringify(tag, null, 2)}`);
        // });


        // // WIP nested reference to tags not populated

        // _dbService.db.task.findOne().exec().then((task) => {
        //     console.log(`task: ${JSON.stringify(task, null, 2)}`);
        //     task.populate('tags').then((tags) => {
        //         console.log(`populated tags: ${JSON.stringify(tags, null, 2)}`);
        //     });
        // });

        _dbService.db.task.findOne('22').exec().then((task) => {
            console.log(`found task 22: ${task.title}`);
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for category
     */
    get category$(): Observable<NoteCategory>
    {
        return this._category.asObservable();
    }

    /**
     * Getter for filters
     */
    get filters$(): Observable<NoteFilter[]>
    {
        return this._filters.asObservable();
    }

    /**
     * Getter for folders
     */
    get folders$(): Observable<NoteFolder[]>
    {
        return this._folders.asObservable();
    }

    /**
     * Getter for labels
     */
    get labels$(): Observable<NoteLabel[]>
    {
        return this._labels.asObservable();
    }

    /**
     * Getter for notes
     */
    get notes$(): Observable<Note[]>
    {
        return this._notes.asObservable();
    }

    /**
     * Getter for notes loading
     */
    get notesLoading$(): Observable<boolean>
    {
        return this._notesLoading.asObservable();
    }

    /**
     * Getter for note
     */
    get note$(): Observable<Note>
    {
        return this._note.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<any>
    {
        return this._pagination.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get filters
     */
    getFilters(): Observable<any>
    {
        return this._httpClient.get<NoteFilter[]>('api/apps/mailbox/filters').pipe(
            tap((response: any) => {
                this._filters.next(response);
            })
        );
    }

    /**
     * Get folders
     */
    getFolders(): Observable<any>
    {
        return this._httpClient.get<NoteFolder[]>('api/apps/mailbox/folders').pipe(
            tap((response: any) => {
                this._folders.next(response);
            })
        );
    }

    /**
     * Get labels
     */
    getLabels(): Observable<any>
    {
        return this._httpClient.get<NoteLabel[]>('api/apps/mailbox/labels').pipe(
            tap((response: any) => {
                this._labels.next(response);
            })
        );
    }

    /**
     * Get notes by filter
     */
    getNotesByFilter(filter: string, page: string = '1'): Observable<any>
    {
        // Execute the notes loading with true
        this._notesLoading.next(true);

        return this._httpClient.get<Note[]>('api/apps/mailbox/mails', {
            params: {
                filter,
                page
            }
        }).pipe(
            tap((response: any) => {
                this._category.next({
                    type: 'filter',
                    name: filter
                });
                this._notes.next(response.mails);
                this._pagination.next(response.pagination);
                this._notesLoading.next(false);
            }),
            switchMap((response) => {

                if ( response.mails === null )
                {
                    return throwError({
                        message   : 'Requested page is not available!',
                        pagination: response.pagination
                    });
                }

                return of(response);
            })
        );
    }

    /**
     * Get notes by folder
     */
    getNotesByFolder(folder: string, page: string = '1'): Observable<any>
    {
        // Execute the notes loading with true
        this._notesLoading.next(true);

        return this._httpClient.get<Note[]>('api/apps/mailbox/mails', {
            params: {
                folder,
                page
            }
        }).pipe(
            tap((response: any) => {
                this._category.next({
                    type: 'folder',
                    name: folder
                });
                this._notes.next(response.mails);
                this._pagination.next(response.pagination);
                this._notesLoading.next(false);
            }),
            switchMap((response) => {

                if ( response.mails === null )
                {
                    return throwError({
                        message   : 'Requested page is not available!',
                        pagination: response.pagination
                    });
                }

                return of(response);
            })
        );
    }

    /**
     * Get notes by label
     */
    getNotesByLabel(label: string, page: string = '1'): Observable<any>
    {
        // Execute the notes loading with true
        this._notesLoading.next(true);

        return this._httpClient.get<Note[]>('api/apps/mailbox/mails', {
            params: {
                label,
                page
            }
        }).pipe(
            tap((response: any) => {
                this._category.next({
                    type: 'label',
                    name: label
                });
                this._notes.next(response.mails);
                this._pagination.next(response.pagination);
                this._notesLoading.next(false);
            }),
            switchMap((response) => {

                if ( response.mails === null )
                {
                    return throwError({
                        message   : 'Requested page is not available!',
                        pagination: response.pagination
                    });
                }

                return of(response);
            })
        );
    }

    /**
     * Get note by id
     */
    getNoteById(id: string): Observable<any>
    {
        return this._notes.pipe(
            take(1),
            map((notes) => {

                // Find the note
                const note = notes.find(item => item.id === id) || null;

                // Update the note
                this._note.next(note);

                // Return the note
                return note;
            }),
            switchMap((note) => {

                if ( !note )
                {
                    return throwError('Could not found note with id of ' + id + '!');
                }

                return of(note);
            })
        );
    }

    /**
     * Update note
     *
     * @param id
     * @param note
     */
    updateNote(id: string, note: Note): Observable<any>
    {
        return this._httpClient.patch('api/apps/mailbox/mail', {
            id,
            mail: note
        }).pipe(
            tap(() => {

                // Re-fetch the folders on note update
                // to get the updated counts on the sidebar
                this.getFolders().subscribe();
            })
        );
    }

    /**
     * Reset the current note
     */
    resetNote(): Observable<boolean>
    {
        return of(true).pipe(
            take(1),
            tap(() => {
                this._note.next(null);
            })
        );
    }

    /**
     * Add label
     *
     * @param label
     */
    addLabel(label: NoteLabel): Observable<any>
    {
        return this.labels$.pipe(
            take(1),
            switchMap(labels => this._httpClient.post<NoteLabel>('api/apps/mailbox/label', {label}).pipe(
                map((newLabel) => {

                    // Update the labels with the new label
                    this._labels.next([...labels, newLabel]);

                    // Return the new label
                    return newLabel;
                })
            ))
        );
    }

    /**
     * Update label
     *
     * @param id
     * @param label
     */
    updateLabel(id: string, label: NoteLabel): Observable<any>
    {
        return this.labels$.pipe(
            take(1),
            switchMap(labels => this._httpClient.patch<NoteLabel>('api/apps/mailbox/label', {
                id,
                label
            }).pipe(
                map((updatedLabel: any) => {

                    // Find the index of the updated label within the labels
                    const index = labels.findIndex(item => item.id === id);

                    // Update the label
                    labels[index] = updatedLabel;

                    // Update the labels
                    this._labels.next(labels);

                    // Return the updated label
                    return updatedLabel;
                })
            ))
        );
    }

    /**
     * Delete label
     *
     * @param id
     */
    deleteLabel(id: string): Observable<any>
    {
        return this.labels$.pipe(
            take(1),
            switchMap(labels => this._httpClient.delete('api/apps/mailbox/label', {params: {id}}).pipe(
                map((isDeleted: any) => {

                    // Find the index of the deleted label within the labels
                    const index = labels.findIndex(item => item.id === id);

                    // Delete the label
                    labels.splice(index, 1);

                    // Update the labels
                    this._labels.next(labels);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
