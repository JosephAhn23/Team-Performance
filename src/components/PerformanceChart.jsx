import { BarChart3, TrendingUp, Award, MessageSquare, Lightbulb, Users } from 'lucide-react'

function PerformanceChart({ user }) {
  if (!user.performanceHistory || user.performanceHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No performance data yet. Add performance entries to see analytics.</p>
      </div>
    )
  }

  const metrics = [
    { key: 'productivity', label: 'Productivity', icon: TrendingUp, color: 'bg-blue-500' },
    { key: 'quality', label: 'Quality', icon: Award, color: 'bg-green-500' },
    { key: 'communication', label: 'Communication', icon: MessageSquare, color: 'bg-purple-500' },
    { key: 'initiative', label: 'Initiative', icon: Lightbulb, color: 'bg-yellow-500' },
    { key: 'collaboration', label: 'Collaboration', icon: Users, color: 'bg-pink-500' },
  ]

  const calculateAverage = (key) => {
    const values = user.performanceHistory.map(entry => entry[key] || 0)
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  const calculateTrend = (key) => {
    if (user.performanceHistory.length < 2) return 0
    const recent = user.performanceHistory.slice(-3)
    const older = user.performanceHistory.slice(-6, -3)
    if (older.length === 0) return 0
    
    const recentAvg = recent.reduce((sum, e) => sum + (e[key] || 0), 0) / recent.length
    const olderAvg = older.reduce((sum, e) => sum + (e[key] || 0), 0) / older.length
    return recentAvg - olderAvg
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const avg = calculateAverage(metric.key)
          const trend = calculateTrend(metric.key)
          const Icon = metric.icon
          return (
            <div key={metric.key} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{avg.toFixed(1)}</div>
              <div className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Performance History */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Performance History</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {user.performanceHistory.slice().reverse().map((entry, index) => (
            <div key={entry.id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {metrics.map((metric) => (
                  <div key={metric.key} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                    <div className={`${metric.color} text-white rounded-lg py-1 px-2 text-sm font-semibold`}>
                      {entry[metric.key] || 0}
                    </div>
                  </div>
                ))}
              </div>
              {entry.notes && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">"{entry.notes}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metric Trends */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Metric Trends</h3>
        <div className="space-y-4">
          {metrics.map((metric) => {
            const values = user.performanceHistory.map(entry => entry[metric.key] || 0)
            const maxValue = Math.max(...values, 100)
            const Icon = metric.icon
            
            return (
              <div key={metric.key} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">{metric.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    Avg: {calculateAverage(metric.key).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {values.map((value, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 ${metric.color} rounded-t transition-all hover:opacity-80`}
                      style={{ height: `${(value / maxValue) * 100}%` }}
                      title={`${value}`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart

