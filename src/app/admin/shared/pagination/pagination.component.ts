import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PaginationBaseDto } from "app/admin/shared/utils/pagination.dto";
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'xiaoyuyue-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  // 保存有多少页码量，总数量/页面显示的多少页码=页码量
  pageColumn: number = 1;
  pageOffsetArr: number[] = [];
  pageOffset: number;
  pagesNum: number = 0;
  basePaging: PaginationBaseDto = new PaginationBaseDto();
  pagesCount: number[] = new Array();
  totalCount: number;
  currentPage: number = 0;
  @Output() paginationHandler: EventEmitter<PaginationBaseDto> = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
    this.initPage();
  }

  ngAfterViewInit() {
  }

  initPage(): void {
    this.basePaging.sorting = "";
    this.basePaging.maxResultCount = AppConsts.grid.defaultPageSize;
    this.basePaging.skipCount = 0;

    this.paginationHandler.emit(this.basePaging);
  }

  // 计算分页总数量
  public countPagesTotal(totalCount): void {
    this.totalCount = totalCount;
    let temp = this.totalCount - this.basePaging.maxResultCount;
    this.pagesCount.push(++this.pagesNum);

    if (temp < 0) {
      this.pageColumn = this.pagesCount.length / 5 > 1 ? this.pagesCount.length / 5 : 1;
      return;
    } else {
      return this.countPagesTotal(temp);
    }
  }

  // 下一页
  nextPage(): void {
    this.currentPage++;
    this.basePaging.skipCount = this.basePaging.maxResultCount * this.currentPage + 1;
    this.countPageOffset();
    this.pagesNum = 0;
    this.pagesCount = [];
    this.paginationHandler.emit(this.basePaging);
  }

  // 上一页
  prevPage(): void {
    this.currentPage--;
    this.basePaging.skipCount = this.basePaging.maxResultCount * this.currentPage + 1;
    this.countPageOffset();
    this.pagesNum = 0;
    this.pagesCount = [];
    this.paginationHandler.emit(this.basePaging);
  }

  // 第一页
  firstPage(): void {
    this.currentPage = 0;
    this.basePaging.skipCount = 0;
    this.pagesNum = 0;
    this.pagesCount = [];
    this.pageOffset = 0;
    this.paginationHandler.emit(this.basePaging);
  }

  // 最后一页
  lastPage(): void {
    this.currentPage = this.pagesCount.length - 1;
    this.basePaging.skipCount = this.pagesCount.length - 1;
    this.pagesNum = 0;
    this.pagesCount = [];
    this.pageOffset = -40 * 5;
    this.paginationHandler.emit(this.basePaging);
  }

  // 某一页
  otherPage(index: number): void {
    this.currentPage = index;
    this.basePaging.skipCount = this.basePaging.maxResultCount * index + 1;
    this.countPageOffset();
    this.pagesNum = 0;
    this.pagesCount = [];
    this.paginationHandler.emit(this.basePaging);
  }

  // 计算页码偏移位置
  countPageOffset(): void {

  }
}
