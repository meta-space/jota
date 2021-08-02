import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { QuillModule } from 'ngx-quill';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { NotesComponent } from 'app/modules/admin/apps/notes2/notes.component';
import { NotesComposeComponent } from 'app/modules/admin/apps/notes2/compose/compose.component';
import { NotesDetailsComponent } from 'app/modules/admin/apps/notes2/details/details.component';
import { NotesListComponent } from 'app/modules/admin/apps/notes2/list/list.component';
import { NotesSettingsComponent } from 'app/modules/admin/apps/notes2/settings/settings.component';
import { NotesSidebarComponent } from 'app/modules/admin/apps/notes2/sidebar/sidebar.component';
import { mailboxRoutes } from 'app/modules/admin/apps/notes2/notes.routing';

@NgModule({
    declarations: [
        NotesComponent,
        NotesComposeComponent,
        NotesDetailsComponent,
        NotesListComponent,
        NotesSettingsComponent,
        NotesSidebarComponent
    ],
    imports     : [
        RouterModule.forChild(mailboxRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        QuillModule.forRoot(),
        FuseFindByKeyPipeModule,
        FuseNavigationModule,
        FuseScrollbarModule,
        FuseScrollResetModule,
        SharedModule
    ]
})
export class NotesModule
{
}
