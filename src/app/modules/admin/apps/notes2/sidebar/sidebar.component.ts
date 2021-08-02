import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { NotesService } from 'app/modules/admin/apps/notes2/notes.service';
import { NotesComposeComponent } from 'app/modules/admin/apps/notes2/compose/compose.component';
import { labelColorDefs } from 'app/modules/admin/apps/notes2/notes.constants';
import { NoteFilter, NoteFolder, NoteLabel } from 'app/modules/admin/apps/notes2/notes.types';

@Component({
    selector     : 'notes-sidebar',
    templateUrl  : './sidebar.component.html',
    styleUrls    : ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotesSidebarComponent implements OnInit, OnDestroy
{
    filters: NoteFilter[];
    folders: NoteFolder[];
    labels: NoteLabel[];
    menuData: FuseNavigationItem[] = [];
    private _filtersMenuData: FuseNavigationItem[] = [];
    private _foldersMenuData: FuseNavigationItem[] = [];
    private _labelsMenuData: FuseNavigationItem[] = [];
    private _otherMenuData: FuseNavigationItem[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _notesServices: NotesService,
        private _matDialog: MatDialog,
        private _fuseNavigationService: FuseNavigationService
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
        // Filters
        this._notesServices.filters$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((filters: NoteFilter[]) => {
                this.filters = filters;

                // Generate menu links
                this._generateFiltersMenuLinks();
            });

        // Folders
        this._notesServices.folders$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((folders: NoteFolder[]) => {
                this.folders = folders;

                // Generate menu links
                this._generateFoldersMenuLinks();

                // Update navigation badge
                this._updateNavigationBadge(folders);
            });

        // Labels
        this._notesServices.labels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((labels: NoteLabel[]) => {
                this.labels = labels;

                // Generate menu links
                this._generateLabelsMenuLinks();
            });

        // Generate other menu links
        this._generateOtherMenuLinks();
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
     * Open compose dialog
     */
    openComposeDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(NotesComposeComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Generate menus for folders
     *
     * @private
     */
    private _generateFoldersMenuLinks(): void
    {
        // Reset the folders menu data
        this._foldersMenuData = [];

        // Iterate through the folders
        this.folders.forEach((folder) => {

            // Generate menu item for the folder
            const menuItem: FuseNavigationItem = {
                id   : folder.id,
                title: folder.title,
                type : 'basic',
                icon : folder.icon,
                link : '/apps/notes2/' + folder.slug
            };

            // If the count is available and is bigger than zero...
            if ( folder.count && folder.count > 0 )
            {
                // Add the count as a badge
                menuItem['badge'] = {
                    title: folder.count + ''
                };
            }

            // Push the menu item to the folders menu data
            this._foldersMenuData.push(menuItem);
        });

        // Update the menu data
        this._updateMenuData();
    }

    /**
     * Generate menus for filters
     *
     * @private
     */
    private _generateFiltersMenuLinks(): void
    {
        // Reset the filters menu
        this._filtersMenuData = [];

        // Iterate through the filters
        this.filters.forEach((filter) => {

            // Generate menu item for the filter
            this._filtersMenuData.push({
                id   : filter.id,
                title: filter.title,
                type : 'basic',
                icon : filter.icon,
                link : '/apps/notes2/filter/' + filter.slug
            });
        });

        // Update the menu data
        this._updateMenuData();
    }

    /**
     * Generate menus for labels
     *
     * @private
     */
    private _generateLabelsMenuLinks(): void
    {
        // Reset the labels menu
        this._labelsMenuData = [];

        // Iterate through the labels
        this.labels.forEach((label) => {

            // Generate menu item for the label
            this._labelsMenuData.push({
                id     : label.id,
                title  : label.title,
                type   : 'basic',
                icon   : 'heroicons_outline:tag',
                classes: {
                    icon: labelColorDefs[label.color].text
                },
                link   : '/apps/notes2/label/' + label.slug
            });
        });

        // Update the menu data
        this._updateMenuData();
    }

    /**
     * Generate other menus
     *
     * @private
     */
    private _generateOtherMenuLinks(): void
    {
        // Settings menu
        this._otherMenuData.push({
            title: 'Settings',
            type : 'basic',
            icon : 'heroicons_outline:cog',
            link : '/apps/notes2/settings'
        });

        // Update the menu data
        this._updateMenuData();
    }

    /**
     * Update the menu data
     *
     * @private
     */
    private _updateMenuData(): void
    {
        this.menuData = [
            {
                title   : 'NOTES',
                type    : 'group',
                children: [
                    ...this._foldersMenuData
                ]
            },
            {
                title   : 'FILTERS',
                type    : 'group',
                children: [
                    ...this._filtersMenuData
                ]
            },
            {
                title   : 'LABELS',
                type    : 'group',
                children: [
                    ...this._labelsMenuData
                ]
            },
            {
                type: 'spacer'
            },
            ...this._otherMenuData
        ];
    }

    /**
     * Update the navigation badge using the
     * unread count of the inbox folder
     *
     * @param folders
     * @private
     */
    private _updateNavigationBadge(folders: NoteFolder[]): void
    {
        // Get the inbox folder
        const inboxFolder = this.folders.find(folder => folder.slug === 'inbox');

        // Get the component -> navigation data -> item
        const mainNavigationComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

        // If the main navigation component exists...
        if ( mainNavigationComponent )
        {
            const mainNavigation = mainNavigationComponent.navigation;
            const menuItem = this._fuseNavigationService.getItem('apps.notes2', mainNavigation);

            // Update the badge title of the item
            menuItem.badge.title = inboxFolder.count + '';

            // Refresh the navigation
            mainNavigationComponent.refresh();
        }
    }
}
