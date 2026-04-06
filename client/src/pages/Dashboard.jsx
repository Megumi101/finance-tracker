import { useState, useEffect } from 'react'
import MetricCard, { formatRupiah } from '../components/dashboard/MetricCard'
import FinanceChart from '../components/dashboard/FinanceChart'
import CategorySummary from '../components/dashboard/CategorySummary'
import RecentTransactions from '../components/dashboard/RecentTransaction'
import { summaryMetrics } from '../data/dashboardData'
import { dashboardApi } from '../lib/api'

const METRIC_CARDS = [
  {
    label: 'Total Saldo',
    key: 'totalSaldo',
    perubahanKey: 'saldo',
    icon: '💰',
    accentColor: 'linear-gradient(90deg, #7C3AED, #4F46E5)',
    bgColor: 'rgba(124,58,237,0.12)',
  },
  {
    label: 'Total Pemasukan',
    key: 'totalPemasukan',
    perubahanKey: 'pemasukan',
    icon: '📈',
    accentColor: 'linear-gradient(90deg, #0D9488, #0891B2)',
    bgColor: 'rgba(13,148,136,0.12)',
  },
  {
    label: 'Total Pengeluaran',
    key: 'totalPengeluaran',
    perubahanKey: 'pengeluaran',
    icon: '📉',
    accentColor: 'linear-gradient(90deg, #BE185D, #9F1239)',
    bgColor: 'rgba(190,24,93,0.12)',
  },
  {
    label: 'Total Tabungan',
    key: 'totalTabungan',
    perubahanKey: 'tabungan',
    icon: '🎯',
    accentColor: 'linear-gradient(90deg, #D97706, #B45309)',
    bgColor: 'rgba(217,119,6,0.12)',
  },
]

export default function Dashboard() {
  const [metrics, setMetrics] = useState(summaryMetrics)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Fetch dashboard data on mount ──
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await dashboardApi.getSummary()
        if (response.data) {
          setMetrics({
            ...response.data.summaryMetrics,
            perubahan: summaryMetrics.perubahan, // keep default perubahan for now
          })
          setCategories(response.data.categories || [])
        }
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message)
        // Keep using default data on error
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="flex flex-col gap-6">

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {METRIC_CARDS.map(card => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={metrics[card.key]}
            perubahan={metrics.perubahan?.[card.perubahanKey] || 0}
            icon={card.icon}
            accentColor={card.accentColor}
            bgColor={card.bgColor}
          />
        ))}
      </div>

      {/* ── Chart + Category ── */}
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <FinanceChart />
        <CategorySummary />
      </div>

      {/* ── Recent Transactions ── */}
      <RecentTransactions />

    </div>
  )
}
