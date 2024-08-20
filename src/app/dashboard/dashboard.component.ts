import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ChartModule } from 'primeng/chart'
import { StatsService, StatsDTO } from '../services/stats-service.service'
import { NavigateHomeButtonComponent } from '../navigate-home-button/navigate-home-button.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ChartModule,
    NavigateHomeButtonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalPatients: number = 0
  activePatients: number = 0
  deletedPatients: number = 0
  femalePatients: number = 0
  malePatients: number = 0
  averageAge: number = 0
  averageAgeMale: number = 0
  averageAgeFemale: number = 0
  patientsByCityDataPart1: any
  patientsByCityDataPart2: any
  biggestCitiesData: any
  topThreeCitiesData: any

  totalPatientsData: any
  averageAgeData: any
  genderData: any

  pieChartOptions: any
  doughnutChartOptions: any
  barChartOptions: any
  patientsByCityChartOptions: any

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getStats().subscribe((stats: StatsDTO) => {
      this.averageAge = stats.averageAge
      this.averageAgeMale = stats.averageAgeMale
      this.averageAgeFemale = stats.averageAgeFemale

      this.animateCounter('totalPatients', stats.totalPatients, () =>
        this.updateTotalPatientsChart(),
      )
      this.animateCounter(
        'activePatients',
        stats.totalPatients - stats.deletedPatients,
        () => this.updateTotalPatientsChart(),
      )
      this.animateCounter('deletedPatients', stats.deletedPatients, () =>
        this.updateTotalPatientsChart(),
      )
      this.animateCounter('femalePatients', stats.femaleCount, () =>
        this.updateGenderChart(),
      )
      this.animateCounter('malePatients', stats.maleCount, () =>
        this.updateGenderChart(),
      )

      this.updateAverageAgeChart()
      this.updatePatientsByCityCharts(stats.patientsByCity)
      this.updateBiggestCitiesChart(stats.patientsByCity)
      this.updateTopThreeCitiesChart(stats.patientsByCity)

      this.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        legend: { display: true },
      }

      this.barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: false,
          },
        },
        plugins: {
          legend: { display: false },
        },
      }

      this.patientsByCityChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { display: false },
        },
      }
    })
  }

  animateCounter(
    property: keyof this,
    targetValue: number,
    callback?: () => void,
  ) {
    const duration = 500
    const increment = targetValue / (duration / 10)
    let currentValue = 0

    const interval = setInterval(() => {
      currentValue += increment
      if (currentValue >= targetValue) {
        currentValue = targetValue
        clearInterval(interval)
        if (callback) {
          callback()
        }
      }
      ;(this as any)[property] = Math.floor(currentValue)
    }, 10)
  }

  updateTotalPatientsChart() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradientActive = ctx.createLinearGradient(0, 0, 0, 400)
      gradientActive.addColorStop(0, '#42A5F5')
      gradientActive.addColorStop(1, '#1976D2')

      const gradientDeleted = ctx.createLinearGradient(0, 0, 0, 400)
      gradientDeleted.addColorStop(0, '#FF4C4C')
      gradientDeleted.addColorStop(1, '#B22222')

      this.totalPatientsData = {
        labels: ['Aktif', 'Silinmiş'],
        datasets: [
          {
            label: 'Hasta',
            backgroundColor: [gradientActive, gradientDeleted],
            data: [this.activePatients, this.deletedPatients],
          },
        ],
      }
    }
  }

  updateGenderChart() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradientMale = ctx.createLinearGradient(0, 0, 0, 400)
      gradientMale.addColorStop(0, '#42A5F5')
      gradientMale.addColorStop(1, '#1976D2')

      const gradientFemale = ctx.createLinearGradient(0, 0, 0, 400)
      gradientFemale.addColorStop(0, '#FF6384')
      gradientFemale.addColorStop(1, '#FF0033')

      this.genderData = {
        labels: ['Erkek', 'Kadın'],
        datasets: [
          {
            data: [this.malePatients, this.femalePatients],
            backgroundColor: [gradientMale, gradientFemale],
            hoverBackgroundColor: [gradientMale, gradientFemale],
          },
        ],
      }
    }
  }

  updateAverageAgeChart() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradientAverage = ctx.createLinearGradient(0, 0, 0, 400)
      gradientAverage.addColorStop(0, '#66BB6A')
      gradientAverage.addColorStop(1, '#388E3C')

      const gradientMale = ctx.createLinearGradient(0, 0, 0, 400)
      gradientMale.addColorStop(0, '#42A5F5')
      gradientMale.addColorStop(1, '#1976D2')

      const gradientFemale = ctx.createLinearGradient(0, 0, 0, 400)
      gradientFemale.addColorStop(0, '#FF6384')
      gradientFemale.addColorStop(1, '#FF0033')

      this.averageAgeData = {
        labels: ['Ortalama', 'Erkek', 'Kadın'],
        datasets: [
          {
            label: 'Ortalama Yaş',
            data: [this.averageAge, this.averageAgeMale, this.averageAgeFemale],
            backgroundColor: [gradientAverage, gradientMale, gradientFemale],
            hoverBackgroundColor: [
              gradientAverage,
              gradientMale,
              gradientFemale,
            ],
          },
        ],
      }
    }
  }

  updatePatientsByCityCharts(patientsByCity: { [city: string]: number }) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, 'crimson')
      gradient.addColorStop(1, 'crimson')

      const labels = Object.keys(patientsByCity)
      const data = Object.values(patientsByCity)

      const midIndex = Math.ceil(labels.length / 2) // Calculate the midpoint

      const labelsPart1 = labels.slice(0, midIndex)
      const dataPart1 = data.slice(0, midIndex)

      const labelsPart2 = labels.slice(midIndex)
      const dataPart2 = data.slice(midIndex)

      this.patientsByCityDataPart1 = {
        labels: labelsPart1,
        datasets: [
          {
            label: 'Hasta Sayısı',
            data: dataPart1,
            backgroundColor: gradient,
            hoverBackgroundColor: gradient,
          },
        ],
      }

      this.patientsByCityDataPart2 = {
        labels: labelsPart2,
        datasets: [
          {
            label: 'Hasta Sayısı',
            data: dataPart2,
            backgroundColor: gradient,
            hoverBackgroundColor: gradient,
          },
        ],
      }
    }
  }

  updateBiggestCitiesChart(patientsByCity: { [city: string]: number }) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradientIstanbul = ctx.createLinearGradient(0, 0, 0, 400)
      gradientIstanbul.addColorStop(0, 'purple')
      gradientIstanbul.addColorStop(1, '#1976D2')

      const gradientAnkara = ctx.createLinearGradient(0, 0, 0, 400)
      gradientAnkara.addColorStop(0, 'crimson')
      gradientAnkara.addColorStop(1, '#388E3C')

      const gradientIzmir = ctx.createLinearGradient(0, 0, 0, 400)
      gradientIzmir.addColorStop(0, 'orange')
      gradientIzmir.addColorStop(1, '#FF0033')

      this.biggestCitiesData = {
        labels: ['Istanbul', 'Ankara', 'İzmir'],
        datasets: [
          {
            data: [
              patientsByCity['İstanbul'],
              patientsByCity['Ankara'],
              patientsByCity['İzmir'],
            ],
            backgroundColor: [gradientIstanbul, gradientAnkara, gradientIzmir],
            hoverBackgroundColor: [
              gradientIstanbul,
              gradientAnkara,
              gradientIzmir,
            ],
          },
        ],
      }
    }
  }

  updateTopThreeCitiesChart(patientsByCity: { [city: string]: number }) {
    const sortedCities = Object.entries(patientsByCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    const topThreeLabels = sortedCities.map((city) => city[0])
    const topThreeData = sortedCities.map((city) => city[1])

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 400)
      gradient1.addColorStop(0, 'darkmagenta')
      gradient1.addColorStop(1, '#1976D2')

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 400)
      gradient2.addColorStop(0, 'crimson')
      gradient2.addColorStop(1, '#388E3C')

      const gradient3 = ctx.createLinearGradient(0, 0, 0, 400)
      gradient3.addColorStop(0, 'orange')
      gradient3.addColorStop(1, '#FF0033')

      this.topThreeCitiesData = {
        labels: topThreeLabels,
        datasets: [
          {
            data: topThreeData,
            backgroundColor: [gradient1, gradient2, gradient3],
            hoverBackgroundColor: [gradient1, gradient2, gradient3],
          },
        ],
      }
    }
  }
}
