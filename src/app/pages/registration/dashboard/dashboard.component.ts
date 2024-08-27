import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ChartModule } from 'primeng/chart'
import { StatsService, StatsDTO } from '../../../services/stats-service.service'
import { NavigateHomeButtonComponent } from '../../../common-components/navigate-home-button/navigate-home-button.component'
import { PoliclinicService, Policlinic } from '../../../services/policlinic.service'
import { GlobalAssets } from '../../../globals/assets'

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
  patientsByPoliclinicData: any
  patientsByAdmissionTypeData: any
  policlinicMap: { [id: string]: string } = {}

  totalPatientsData: any
  averageAgeData: any
  genderData: any

  pieChartOptions: any
  doughnutChartOptions: any
  barChartOptions: any
  patientsByCityChartOptions: any
  
  assets: any = {}

  constructor(
    private statsService: StatsService,
    private policlinicService: PoliclinicService
  ) {}

  ngOnInit() {
    // Fetch stats data and policlinic data
    this.statsService.getStats().subscribe((stats: StatsDTO) => {
      this.averageAge = stats.averageAge
      this.averageAgeMale = stats.averageAgeMale
      this.averageAgeFemale = stats.averageAgeFemale
      this.assets = GlobalAssets;
      
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
      
      // Fetch policlinic data
      this.policlinicService.getAllPoliclinics().subscribe((policlinics: Policlinic[]) => {
        policlinics.forEach(policlinic => {
          this.policlinicMap[policlinic.id] = policlinic.name;
        });
        this.updatePatientsByPoliclinicChart(stats.patientsByPoliclinic);
      });
      
      this.updatePatientsByAdmissionTypeChart(stats.patientsByAdmissionType);
      
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

  updatePatientsByPoliclinicChart(patientsByPoliclinic: { [policlinicId: string]: number }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
        const labels = Object.keys(patientsByPoliclinic).map(key => this.policlinicMap[key] || `Poliklinik ${key}`);
        const data = Object.values(patientsByPoliclinic);

        const predefinedGradients = [
            { color1: '#42A5F5', color2: '#1976D2' },  // Blue gradient
            { color1: '#FF6384', color2: '#FF0033' },  // Red gradient
            { color1: '#66BB6A', color2: '#388E3C' },  // Green gradient
            { color1: '#FFB74D', color2: '#FF9800' },  // Orange gradient
            { color1: '#BA68C8', color2: '#8E24AA' },  // Purple gradient
            { color1: '#4DD0E1', color2: '#00ACC1' },  // Cyan gradient
            { color1: '#F06292', color2: '#E91E63' },  // Pink gradient
            { color1: '#D4E157', color2: '#C0CA33' },  // Lime gradient
        ];

        const gradients = data.map((_, index) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            const colors = predefinedGradients[index % predefinedGradients.length];
            gradient.addColorStop(0, colors.color1);
            gradient.addColorStop(1, colors.color2);
            return gradient;
        });

        this.patientsByPoliclinicData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: gradients,
                    hoverBackgroundColor: gradients,
                },
            ],
        };
    }
}

updatePatientsByAdmissionTypeChart(patientsByAdmissionType: { [type: string]: number }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#E1BEE7'); // Light purple
    gradient1.addColorStop(1, '#7B1FA2'); // Purple

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#FFCC80'); // Light orange
    gradient2.addColorStop(1, '#FB8C00'); // Orange

    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, '#90CAF9'); // Light blue
    gradient3.addColorStop(1, '#1976D2'); // Blue

    const typeMap: { [key: string]: string } = {
      outpatient: 'Ayakta',
      inpatient: 'Yatan',
      daily: 'Günübirlik',
    };

    const labels = Object.keys(patientsByAdmissionType).map(
      (key) => typeMap[key] || key
    );

    this.patientsByAdmissionTypeData = {
      labels: labels,
      datasets: [
        {
          data: Object.values(patientsByAdmissionType),
          backgroundColor: [gradient1, gradient2, gradient3],
          hoverBackgroundColor: [gradient1, gradient2, gradient3],
        },
      ],
    };
  }
}
}
