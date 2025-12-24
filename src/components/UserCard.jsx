import { useState } from 'react'
import { Award, TrendingUp, TrendingDown, Minus, Trash2, BarChart3, Sparkles } from 'lucide-react'
import { getRankColor, getRankIcon, calculateAIRank } from '../utils/aiRanking'

function UserCard({ user, rank, onUpdatePerformance, onDelete, onSelect, isSelected }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    productivity: '',
    quality: '',
    communication: '',
    initiative: '',
    collaboration: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const performanceData = {
      productivity: parseInt(formData.productivity) || 0,
      quality: parseInt(formData.quality) || 0,
      communication: parseInt(formData.communication) || 0,
      initiative: parseInt(formData.initiative) || 0,
      collaboration: parseInt(formData.collaboration) || 0,
      notes: formData.notes,
    }
    onUpdatePerformance(user.id, performanceData)
    setFormData({
      productivity: '',
      quality: '',
      communication: '',
      initiative: '',
      collaboration: '',
      notes: '',
    })
    setShowAddForm(false)
  }

  const recentTrend = user.performanceHistory?.length >= 2 && user.rank?.score
    ? user.rank.score - calculateAIRank({
        ...user,
        performanceHistory: user.performanceHistory.slice(0, -1)
      }).score
    : 0

  const TrendIcon = recentTrend > 0 ? TrendingUp : recentTrend < 0 ? TrendingDown : Minus
  const trendColor = recentTrend > 0 ? 'text-green-400' : recentTrend < 0 ? 'text-red-400' : 'text-gray-400'

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all cursor-pointer hover:scale-105 ${
        isSelected ? 'border-white/50 shadow-2xl' : 'border-white/20 hover:border-white/40'
      }`}
      onClick={onSelect}
    >
      {/* Rank Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getRankColor(user.rank?.tier || 'Unrated')}`}>
            {rank}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-white/70 text-sm">{user.role || 'No role'}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(user.id)
          }}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* AI Rank Display */}
      <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getRankIcon(user.rank?.tier || 'Unrated')}
            <span className="text-white font-semibold">{user.rank?.tier || 'Unrated'}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon className={`w-5 h-5 ${trendColor}`} />
            <span className={`text-lg font-bold ${trendColor}`}>
              {recentTrend > 0 ? '+' : ''}{recentTrend.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">AI Score</span>
          <span className="text-2xl font-bold text-white">{(user.rank?.score || 0).toFixed(1)}</span>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all"
              style={{ width: `${((user.rank?.score || 0) / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {user.performanceHistory?.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Entries</span>
            <span className="text-white font-semibold">{user.performanceHistory.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Last Updated</span>
            <span className="text-white font-semibold">
              {new Date(user.performanceHistory[user.performanceHistory.length - 1].date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Add Performance Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowAddForm(!showAddForm)
        }}
        className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all text-sm"
      >
        {showAddForm ? 'Cancel' : 'Add Performance'}
      </button>

      {/* Add Performance Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-white/70 text-xs mb-1 block">Productivity</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.productivity}
                onChange={(e) => setFormData({ ...formData, productivity: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1 block">Quality</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1 block">Communication</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.communication}
                onChange={(e) => setFormData({ ...formData, communication: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1 block">Initiative</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.initiative}
                onChange={(e) => setFormData({ ...formData, initiative: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                placeholder="0-100"
              />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1 block">Collaboration</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.collaboration}
              onChange={(e) => setFormData({ ...formData, collaboration: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
              placeholder="0-100"
            />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1 block">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
              placeholder="Additional notes..."
              rows="2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all"
          >
            Submit Performance
          </button>
        </form>
      )}
    </div>
  )
}

export default UserCard

