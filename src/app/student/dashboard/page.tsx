import StudentProgressChart from './components/charts/StudentProgressChart'

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <StudentProgressChart />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
