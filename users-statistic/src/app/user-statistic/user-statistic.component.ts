import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersdataService } from '../usersdata.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-user-statistic',
  templateUrl: './user-statistic.component.html',
  styleUrls: ['./user-statistic.component.scss']
})
export class UserStatisticComponent implements OnInit {

  constructor(private route: ActivatedRoute, private usersdata: UsersdataService) { }
  username;
  ngOnInit(): void {
	console.log(this.route.snapshot.paramMap.get('id'));
	this.usersdata.getUserStatistic(this.route.snapshot.paramMap.get('id'))
		.subscribe(response => {
			console.log(response);
			this.clicksChartData[0].data = response['stats']['clicks'];
			this.clicksChartLabels = response['stats']['date'];
			this.viewsChartData[0].data = response['stats']['views'];
			this.viewsChartLabels = response['stats']['date'];
			this.username = response['stats']['user_name'];
		});
  }
  
  clicksChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Clicks' },
  ];
  viewsChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Views' },
  ];

  clicksChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  viewsChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  clicksChartOptions = {
    responsive: true,
  };
  viewsChartOptions = {
    responsive: true,
  };

  clicksChartColors: Color[] = [
    {
      borderColor: '#3A80BA',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
  ];
  viewsChartColors: Color[] = [
    {
      borderColor: '#3A80BA',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
  ];

  clicksChartLegend = false;
  clicksChartPlugins = [];
  clicksChartType = 'line';
  viewsChartLegend = false;
  viewsChartPlugins = [];
  viewsChartType = 'line';  
  
  startDate = 0;
  endDate = 0;
  
  public onChange(event, type){
	console.log(event);
	if (type === 'start'){
		this.startDate = new Date(event.value).getTime();
	} else {
		this.endDate = new Date(event.value).getTime();
	}
  }
  
  public getUserStatisticByDate(){
	console.log('Start:', this.startDate);
	console.log('End:', this.endDate);
	this.usersdata.getUserStatistic(this.route.snapshot.paramMap.get('id'), this.startDate, this.endDate).subscribe(response => {
		console.log(response);
		this.clicksChartData[0].data = response['stats']['clicks'];
		this.clicksChartLabels = response['stats']['date'];
		this.viewsChartData[0].data = response['stats']['views'];
		this.viewsChartLabels = response['stats']['date'];
		this.username = response['stats']['user_name'];
	});
  }
}
