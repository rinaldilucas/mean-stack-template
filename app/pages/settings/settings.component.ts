import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ICategory } from '@app/scripts/models/category.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
    @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    isLoading = true;
    isSearching = false;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    categoryCtrl = new FormControl();
    filteredCategories!: Observable<string[]>;
    categories: ICategory[] = [];

    constructor(
        private changeDetector: ChangeDetectorRef,
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private snackBar: MatSnackBar,
        private titleService: Title,
    ) {}

    ngOnInit(): void {
        this.translateService.get('title.settings').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.refresh();
    }

    refresh(): void {
        this.categoryService.listCategories().subscribe((result: IQueryResult<ICategory>) => {
            this.categories = result.data.map((category: ICategory) => {
                return {
                    _id: category._id,
                    title: category.title,
                } as ICategory;
            });

            this.isLoading = false;
            this.changeDetector.markForCheck();
        });
    }

    saveCategory(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        const category = { title: value } as ICategory;

        if (!value) {
            return;
        }

        this.categoryService.createCategory(category).subscribe({
            next: (result: IQueryResult<ICategory>) => {
                if (!result || !result.success) {
                    this.translateService.get('settings.category-create-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }

                this.translateService.get('settings.category-create-success').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 5000 }));
                this.categoryService.emitCategory.emit(result.data[0]);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
                this.categories.push(result.data[0]);
            },
            error: () => {
                this.translateService.get('settings.category-create-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
            },
        });
    }

    removeCategory(category: ICategory): void {
        this.categoryService.removeCategory(category._id).subscribe({
            next: () => {
                this.translateService.get('settings.category-remove-success').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 5000 }));
                this.categoryService.emitCategory.emit(category);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
                const index = this.categories.indexOf(category);
                this.categories.splice(index, 1);
                this.changeDetector.markForCheck();
            },
            error: () => {
                debugger;
                this.translateService.get('settings.category-remove-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
            },
        });
    }
}
