import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-parameter-chart',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './parameter-chart.component.html',
  styleUrls: ['./parameter-chart.component.scss'],
})
export class ParameterChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() parameter: 'bloodPressure' | 'bloodSugar' | 'weight' = 'bloodPressure';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;

  ngAfterViewInit() {
    this.initChart();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['parameter'] && !changes['parameter'].firstChange) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private initChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: { display: true, text: 'Date' },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: this.getYAxisLabel() },
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private updateChart() {
    const raw = localStorage.getItem(this.parameter) || '[]';
    const measurements = JSON.parse(raw) as { value: string; date: string }[];
    // sort by date ascending
    measurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = measurements.map(m => new Date(m.date).toLocaleDateString());
    const data = measurements.map(m => this.parseValue(m.value));

    this.chart.data.labels = labels;
    this.chart.data.datasets = [{
      label: this.getDatasetLabel(),
      data,
      borderColor: '#387fff',
      backgroundColor: 'rgba(56, 128, 255, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    }];
    this.chart.update();
  }

  private parseValue(val: string): number {
    // strip out non-numeric characters
    const num = parseFloat(val.replace(/[^\d\.\-]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  private getDatasetLabel(): string {
    switch (this.parameter) {
      case 'bloodPressure': return 'Systolic (approx.)';
      case 'bloodSugar':   return 'Blood Sugar';
      case 'weight':       return 'Weight (kg)';
      default:             return '';
    }
  }

  private getYAxisLabel(): string {
    switch (this.parameter) {
      case 'bloodPressure': return 'mmHg';
      case 'bloodSugar':   return 'mmol/L';
      case 'weight':       return 'kg';
      default:             return '';
    }
  }
}
