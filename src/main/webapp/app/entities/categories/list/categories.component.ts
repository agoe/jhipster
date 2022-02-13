import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategories } from '../categories.model';
import { CategoriesService } from '../service/categories.service';
import { CategoriesDeleteDialogComponent } from '../delete/categories-delete-dialog.component';

@Component({
  selector: 'jhi-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories?: ICategories[];
  isLoading = false;

  constructor(protected categoriesService: CategoriesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.categoriesService.query().subscribe({
      next: (res: HttpResponse<ICategories[]>) => {
        this.isLoading = false;
        this.categories = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICategories): string {
    return item.id!;
  }

  delete(categories: ICategories): void {
    const modalRef = this.modalService.open(CategoriesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.categories = categories;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
