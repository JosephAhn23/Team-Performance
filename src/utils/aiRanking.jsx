import React from 'react'
import { Award, TrendingUp, CheckCircle, AlertCircle, XCircle, Sparkles } from 'lucide-react'

/**
 * AI-Powered Performance Ranking System
 * Analyzes multiple performance metrics and generates intelligent rankings
 */
export function calculateAIRank(user) {
  if (!user.performanceHistory || user.performanceHistory.length === 0) {
    return { score: 0, tier: 'Unrated', insights: ['No performance data available'] }
  }

  // Weighted scoring system - different metrics have different importance
  const weights = {
    productivity: 0.25,    // Core output
    quality: 0.25,         // Work excellence
    communication: 0.15,   // Team interaction
    initiative: 0.15,       // Proactive behavior
    collaboration: 0.20,   // Teamwork
  }

  // Analyze recent performance (last 5 entries for trend analysis)
  const recentEntries = user.performanceHistory.slice(-5)
  const allEntries = user.performanceHistory

  // Calculate average scores for each metric
  const avgScores = {
    productivity: allEntries.reduce((sum, e) => sum + (e.productivity || 0), 0) / allEntries.length,
    quality: allEntries.reduce((sum, e) => sum + (e.quality || 0), 0) / allEntries.length,
    communication: allEntries.reduce((sum, e) => sum + (e.communication || 0), 0) / allEntries.length,
    initiative: allEntries.reduce((sum, e) => sum + (e.initiative || 0), 0) / allEntries.length,
    collaboration: allEntries.reduce((sum, e) => sum + (e.collaboration || 0), 0) / allEntries.length,
  }

  // Calculate weighted base score
  const weightedScore = Object.keys(weights).reduce((sum, key) => {
    return sum + (avgScores[key] * weights[key])
  }, 0)

  // Trend Analysis - Bonus for improving performance
  let trendBonus = 0
  if (recentEntries.length >= 2) {
    const recentAvg = recentEntries.slice(-2).reduce((sum, e) => sum + (e.productivity || 0), 0) / 2
    const olderAvg = recentEntries.slice(0, 2).reduce((sum, e) => sum + (e.productivity || 0), 0) / 2
    trendBonus = Math.max(0, (recentAvg - olderAvg) * 0.15)
  }

  // Consistency Bonus - Rewards consistent high performance
  const consistency = calculateConsistency(allEntries)
  const consistencyBonus = consistency * 2

  // Engagement Bonus - More entries = more engagement
  const engagementBonus = Math.min(5, allEntries.length * 0.5)

  // Calculate final score
  const finalScore = Math.min(100, weightedScore + trendBonus + consistencyBonus + engagementBonus)

  // Determine tier
  let tier = 'Unrated'
  let insights = []

  if (finalScore >= 90) {
    tier = 'Elite'
    insights = ['Exceptional performance across all metrics', 'Consistent high-quality output']
  } else if (finalScore >= 80) {
    tier = 'Excellent'
    insights = ['Strong performance in key areas', 'Reliable and consistent']
  } else if (finalScore >= 70) {
    tier = 'Good'
    insights = ['Solid performance', 'Room for improvement in some areas']
  } else if (finalScore >= 60) {
    tier = 'Average'
    insights = ['Meeting basic expectations', 'Focus on core metrics']
  } else if (finalScore >= 50) {
    tier = 'Below Average'
    insights = ['Below expectations', 'Needs focused improvement']
  } else {
    tier = 'Needs Improvement'
    insights = ['Significant improvement required', 'Focus on fundamentals']
  }

  // Add specific insights based on metrics
  const lowestMetric = Object.entries(avgScores).reduce((min, [key, value]) => 
    value < min[1] ? [key, value] : min,
    ['', 100] // initial value
  )
  
  if (lowestMetric && lowestMetric[1] < 60) {
    insights.push(`Focus on improving ${lowestMetric[0]}`)
  }

  return {
    score: finalScore,
    tier,
    insights,
    metrics: avgScores,
    trend: trendBonus > 0 ? 'improving' : trendBonus < 0 ? 'declining' : 'stable'
  }
}

/**
 * Calculate consistency score (0-1)
 * Lower variance = higher consistency
 */
function calculateConsistency(entries) {
  if (entries.length < 2) return 0.5

  const scores = entries.map(e => {
    return (e.productivity || 0) * 0.25 +
           (e.quality || 0) * 0.25 +
           (e.communication || 0) * 0.15 +
           (e.initiative || 0) * 0.15 +
           (e.collaboration || 0) * 0.20
  })

  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)

  // Lower standard deviation = higher consistency
  // Normalize to 0-1 scale (assuming max std dev of 30)
  return Math.max(0, 1 - (stdDev / 30))
}

/**
 * Get color for rank tier
 */
export function getRankColor(tier) {
  const colors = {
    'Elite': 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    'Excellent': 'bg-gradient-to-r from-green-400 to-green-600',
    'Good': 'bg-gradient-to-r from-blue-400 to-blue-600',
    'Average': 'bg-gradient-to-r from-gray-400 to-gray-600',
    'Below Average': 'bg-gradient-to-r from-orange-400 to-orange-600',
    'Needs Improvement': 'bg-gradient-to-r from-red-400 to-red-600',
    'Unrated': 'bg-gradient-to-r from-gray-300 to-gray-500',
  }
  return colors[tier] || colors['Unrated']
}

/**
 * Get icon for rank tier
 */
export function getRankIcon(tier) {
  const iconProps = { className: "w-5 h-5" }
  
  switch(tier) {
    case 'Elite':
      return <Award {...iconProps} className="w-5 h-5 text-yellow-400" />
    case 'Excellent':
      return <TrendingUp {...iconProps} className="w-5 h-5 text-green-400" />
    case 'Good':
      return <CheckCircle {...iconProps} className="w-5 h-5 text-blue-400" />
    case 'Average':
      return <AlertCircle {...iconProps} className="w-5 h-5 text-gray-400" />
    case 'Below Average':
      return <AlertCircle {...iconProps} className="w-5 h-5 text-orange-400" />
    case 'Needs Improvement':
      return <XCircle {...iconProps} className="w-5 h-5 text-red-400" />
    default:
      return <Sparkles {...iconProps} className="w-5 h-5 text-gray-400" />
  }
}

