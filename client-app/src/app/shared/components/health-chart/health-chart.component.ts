import { Component, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import Chart from "chart.js/auto"

@Component({
  selector: "app-health-chart",
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [
    `
    .chart-container {
      position: relative;
      height: 200px;
      width: 100%;
    }
  `,
  ],
})
export class HealthChartComponent implements AfterViewInit {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef
  chart: any

  ngAfterViewInit() {
    this.createChart()
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext("2d")

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Blood Pressure (Systolic)",
            data: [120, 125, 123, 126, 125, 120],
            borderColor: "#3880ff",
            backgroundColor: "rgba(56, 128, 255, 0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Blood Sugar",
            data: [95, 98, 102, 99, 96, 95],
            borderColor: "#3dc2ff",
            backgroundColor: "rgba(61, 194, 255, 0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    })
  }
}

