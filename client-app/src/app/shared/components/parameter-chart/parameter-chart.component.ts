import {
  Component,
  type AfterViewInit,
  type ElementRef,
  ViewChild,
  Input,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import Chart from "chart.js/auto"

@Component({
  selector: "app-parameter-chart",
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
export class ParameterChartComponent implements AfterViewInit, OnChanges {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef
  @Input() parameter = "bloodPressure"

  chart: any

  ngAfterViewInit() {
    this.createChart()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["parameter"] && !changes["parameter"].firstChange) {
      this.updateChart()
    }
  }

  createChart() {
    if (!this.chartCanvas) return

    const ctx = this.chartCanvas.nativeElement.getContext("2d")
    const data = this.getChartData()

    this.chart = new Chart(ctx, {
      type: "line",
      data: data,
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

  updateChart() {
    if (!this.chart) return

    const data = this.getChartData()
    this.chart.data = data
    this.chart.update()
  }

  getChartData() {
    // Generate last 30 days
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    switch (this.parameter) {
      case "bloodPressure":
        return {
          labels,
          datasets: [
            {
              label: "Systolic",
              data: [
                120, 122, 123, 121, 120, 125, 126, 124, 123, 122, 120, 119, 120, 121, 122, 123, 124, 125, 123, 122, 121,
                120, 119, 120, 121, 122, 123, 122, 121, 120,
              ],
              borderColor: "#3880ff",
              backgroundColor: "rgba(56, 128, 255, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Diastolic",
              data: [
                80, 81, 82, 80, 79, 82, 83, 82, 81, 80, 79, 78, 79, 80, 81, 82, 83, 82, 81, 80, 79, 78, 79, 80, 81, 82,
                81, 80, 79, 80,
              ],
              borderColor: "#3dc2ff",
              backgroundColor: "rgba(61, 194, 255, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        }
      case "bloodSugar":
        return {
          labels,
          datasets: [
            {
              label: "Blood Sugar",
              data: [
                95, 96, 97, 98, 99, 100, 101, 102, 103, 102, 101, 100, 99, 98, 97, 96, 95, 96, 97, 98, 99, 100, 101,
                102, 103, 102, 101, 100, 99, 98,
              ],
              borderColor: "#3880ff",
              backgroundColor: "rgba(56, 128, 255, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        }
      case "weight":
        return {
          labels,
          datasets: [
            {
              label: "Weight (kg)",
              data: [
                70, 70, 70.2, 70.3, 70.2, 70.1, 70, 70, 70.1, 70.2, 70.3, 70.4, 70.5, 70.4, 70.3, 70.2, 70.1, 70, 70,
                70.1, 70.2, 70.3, 70.2, 70.1, 70, 70, 70.1, 70.2, 70.1, 70,
              ],
              borderColor: "#3880ff",
              backgroundColor: "rgba(56, 128, 255, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        }
      default:
        return {
          labels,
          datasets: [],
        }
    }
  }
}

