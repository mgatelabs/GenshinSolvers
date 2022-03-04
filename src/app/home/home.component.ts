import { Component, OnInit } from '@angular/core';
import { DataSourceService } from '../data-source.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public getPercentComplete(): number {
    return Math.round(
      (this.dataSource.workingPuzzles / this.dataSource.totalPuzzles) * 100
    );
  }

  constructor(public dataSource: DataSourceService) {}

  ngOnInit(): void {}
}
