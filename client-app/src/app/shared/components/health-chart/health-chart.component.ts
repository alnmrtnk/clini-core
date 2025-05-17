import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import Chart, {
  ChartConfiguration,
  ChartData,
  Point
} from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-health-chart',
  templateUrl: './health-chart.component.html',
  styleUrls: ['./health-chart.component.scss'],
})
export class HealthChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart<'line', Point[]>;

  ngAfterViewInit() {
    const config: ChartConfiguration<'line', Point[], unknown> = {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day' },
            title: { display: true, text: 'Date' },
          },
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Value' },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    };

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy() {
    this.chart.destroy();
  }

  /** Build chart data by grouping raw entries into one point/day */
  private getChartData(): ChartData<'line', Point[]> {
    const bpRaw = JSON.parse(
      localStorage.getItem('bloodPressure') || '[]'
    ) as Array<{ value: string; date: string }>;

    const sugarRaw = JSON.parse(
      localStorage.getItem('bloodSugar') || '[]'
    ) as Array<{ value: string; date: string }>;

    const bpData = this.groupByDay(bpRaw, (v) =>
      this.parseSystolic(v)
    );
    const sugarData = this.groupByDay(sugarRaw, (v) =>
      this.parseNumeric(v)
    );

    return {
      datasets: [
        {
          label: 'Blood Pressure (Systolic)',
          data: bpData,
          borderColor: '#3880ff',
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Blood Sugar',
          data: sugarData,
          borderColor: '#3dc2ff',
          backgroundColor: 'rgba(61, 194, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  /**
   * Groups raw {value,date} entries by calendar day,
   * then for each day emits { x: timestamp, y: dailyAverage }.
   */
  private groupByDay(
    raw: Array<{ value: string; date: string }>,
    parseFn: (v: string) => number
  ): Point[] {
    const buckets = new Map<number, number[]>();

    raw.forEach((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0); // normalize to midnight
      const t = d.getTime();

      if (!buckets.has(t)) {
        buckets.set(t, []);
      }
      buckets.get(t)!.push(parseFn(e.value));
    });

    return Array.from(buckets.entries())
      .map(([time, vals]) => ({
        x: time,
        y:
          vals.reduce((sum, v) => sum + v, 0) /
          vals.length,
      }))
      .sort((a, b) => a.x - b.x);
  }

  /** Extracts the systolic (first) number from “120/80” */
  private parseSystolic(bp: string): number {
    const [sys] = bp.split('/');
    return parseInt(sys, 10) || 0;
  }

  /** Strips non-numeric chars and parses to float */
  private parseNumeric(val: string): number {
    const num = parseFloat(val.replace(/[^\d.\-]/g, ''));
    return isNaN(num) ? 0 : num;
  }
}
