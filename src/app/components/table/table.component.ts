import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTable, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableData: any;
  displayedColumns: string[] = ['name', 'value', 'name2', 'value2'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatTable)
  table: MatTable<any>;
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.tableData);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.tableData.firstChange && changes.tableData.previousValue !== changes.tableData.currentValue) {
      this.renderRows();
    }
  }
  renderRows(): void {
    this.dataSource.data = this.tableData;
    this.table.renderRows();
  }
}
