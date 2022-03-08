import { Component } from '@angular/core';
import { DataSourceService } from './data-source.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'JenshinSolver';
  isCollapsed = true;

  constructor(public dataSource: DataSourceService) {}
}
