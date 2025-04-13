import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HealthChartComponent } from "./components/health-chart/health-chart.component"
import { ParameterChartComponent } from "./components/parameter-chart/parameter-chart.component"

@NgModule({
  imports: [CommonModule, HealthChartComponent, ParameterChartComponent],
  exports: [HealthChartComponent, ParameterChartComponent],
})
export class SharedComponentsModule {}

