import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  pageNumber = model(1);  //an input property that is writable
  totalPages = input(1);
  pageSize = model(10);
  totalCount = input(0);
  pageSizeOptions = input([5, 10, 20, 50]);

  pageChange = output<{pageNumber: number, pageSize: number}>();

  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  })

  // lastPage = computed( () => {
  //   return Math.ceil(this.totalCount() / this.pageSize())
  // })

  onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) this.pageNumber.set(newPage);
    if (pageSize) {
      const size = Number((pageSize as HTMLSelectElement).value)
      this.pageSize.set(size);

      //check current page and see if based on the totalCount, the page number would work based on the new page size
      //if page size will not work, then pick the first page size
      const lastPageNumber = Math.ceil(this.totalCount() / this.pageSize())
      if (this.pageNumber() > lastPageNumber) this.pageNumber.set(1);
    } 

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    })
  }
  
}
