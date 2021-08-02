import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NotesService } from 'app/modules/admin/apps/notes2/notes.service';
import { Note, NoteFilter, NoteFolder, NoteLabel } from 'app/modules/admin/apps/notes2/notes.types';

@Injectable({
    providedIn: 'root'
})
export class NotesFoldersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: NotesService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NoteFolder[]>
    {
        return this._mailboxService.getFolders();
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotesFiltersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: NotesService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NoteFilter[]>
    {
        return this._mailboxService.getFilters();
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotesLabelsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: NotesService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NoteLabel[]>
    {
        return this._mailboxService.getLabels();
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotesNotesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _mailboxService: NotesService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Note[]> | any
    {
        // Don't allow page param to go below 1
        if ( route.paramMap.get('page') && parseInt(route.paramMap.get('page'), 10) <= 0 )
        {
            // Get the parent url
            const url = state.url.split('/').slice(0, -1).join('/') + '/1';

            // Navigate to there
            this._router.navigateByUrl(url);

            // Don't allow request to go through
            return false;
        }

        // Create and build the sources array
        const sources = [];

        // If folder is set on the parameters...
        if ( route.paramMap.get('folder') )
        {
            sources.push(this._mailboxService.getNotesByFolder(route.paramMap.get('folder'), route.paramMap.get('page')));
        }

        // If filter is set on the parameters...
        if ( route.paramMap.get('filter') )
        {
            sources.push(this._mailboxService.getNotesByFilter(route.paramMap.get('filter'), route.paramMap.get('page')));
        }

        // If label is set on the parameters...
        if ( route.paramMap.get('label') )
        {
            sources.push(this._mailboxService.getNotesByLabel(route.paramMap.get('label'), route.paramMap.get('page')));
        }

        // Fork join all the sources
        return forkJoin(sources)
            .pipe(
                finalize(() => {

                    // If there is no selected mail, reset the mail every
                    // time mail list changes. This will ensure that the
                    // mail will be reset while navigating between the
                    // folders/filters/labels but it won't reset on page
                    // reload if we are reading a mail.

                    // Try to get the current activated route
                    let currentRoute = route;
                    while ( currentRoute.firstChild )
                    {
                        currentRoute = currentRoute.firstChild;
                    }

                    // Make sure there is no 'id' parameter on the current route
                    if ( !currentRoute.paramMap.get('id') )
                    {
                        // Reset the mail
                        this._mailboxService.resetNote().subscribe();
                    }
                }),

                // Error here means the requested page is not available
                catchError((error) => {

                    // Log the error
                    console.error(error.message);

                    // Get the parent url and append the last possible page number to the parent url
                    const url = state.url.split('/').slice(0, -1).join('/') + '/' + error.pagination.lastPage;

                    // Navigate to there
                    this._router.navigateByUrl(url);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotesNoteResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _mailboxService: NotesService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Note>
    {
        return this._mailboxService.getNoteById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested mail is either
                       // not available on the requested page or not
                       // available at all
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}
