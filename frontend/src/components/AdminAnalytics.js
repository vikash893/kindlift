/**
 * @fileoverview AdminAnalytics — Rich Analytics Tab for the KindLift Admin Panel
 *
 * Renders interactive charts using Recharts:
 *  - User registrations over time (day/week/year toggle)
 *  - Rides created over time (day/week/year toggle)
 *  - Ride status distribution (completed / failed / incomplete / pending) — Donut + Bar
 *  - Platform-wide rating trend (weekly avg line chart)
 *  - Per-user rating trend (line chart per user — for detecting declining users)
 */

import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Car, Star, AlertTriangle } from 'lucide-react';

// ─── Colour Palette ──────────────────────────────────────
const C = {
  blue:    '#3b82f6',
  amber:   '#f59e0b',
  emerald: '#10b981',
  red:     '#ef4444',
  violet:  '#8b5cf6',
  cyan:    '#06b6d4',
  rose:    '#f43f5e',
  slate:   '#64748b',
};

const STATUS_COLORS = {
  completed:  C.emerald,
  waiting:    C.amber,
  ongoing:    C.blue,
  cancelled:  C.red,
  pending:    C.amber,
  accepted:   C.emerald,
  rejected:   C.red,
};

// ─── Helpers ─────────────────────────────────────────────

/** Shorten long axis date labels */
function shortLabel(str = '') {
  // '2024-W05' → 'W05'  |  '2024-04' → 'Apr'  |  '2024-04-20' → 'Apr 20'
  if (/^\d{4}-W\d+$/.test(str)) return str.split('-')[1];
  if (/^\d{4}-\d{2}$/.test(str)) {
    const d = new Date(str + '-01');
    return d.toLocaleString('default', { month: 'short' });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(str);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
  }
  return str;
}

// Custom tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-display font-bold text-brand-dark mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-brand-muted capitalize">{p.name}:</span>
          <span className="font-bold text-brand-dark">{typeof p.value === 'number' ? p.value.toFixed(2).replace(/\.00$/, '') : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// Section card wrapper
const ChartCard = ({ title, icon: Icon, iconColor = 'bg-blue-500', children, action }) => (
  <div className="bg-white rounded-2xl border border-brand-gray-light p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-xl ${iconColor} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-display font-bold text-brand-dark text-sm">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

// Period toggle buttons
const PeriodToggle = ({ value, onChange, options }) => (
  <div className="flex gap-1 bg-gray-100 rounded-full p-0.5">
    {options.map(o => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-3 py-1 text-xs font-display font-bold rounded-full transition-all ${
          value === o.value ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted hover:text-brand-dark'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// ─── USER GROWTH CHART ────────────────────────────────────
const UserGrowthChart = ({ data }) => {
  const [period, setPeriod] = useState('daily');
  const raw = data?.[period] || [];
  const chartData = raw.map(d => ({ label: shortLabel(d._id), Users: d.count }));

  return (
    <ChartCard
      title="User Registrations"
      icon={Users}
      iconColor="bg-blue-500"
      action={
        <PeriodToggle
          value={period}
          onChange={setPeriod}
          options={[{ label: 'Day', value: 'daily' }, { label: 'Week', value: 'weekly' }, { label: 'Month', value: 'monthly' }]}
        />
      }
    >
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-brand-muted text-sm">No data for this period</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="Users" stroke={C.blue} strokeWidth={2} fill="url(#userGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

// ─── RIDE GROWTH CHART ────────────────────────────────────
const RideGrowthChart = ({ data }) => {
  const [period, setPeriod] = useState('daily');
  const raw = data?.[period] || [];
  const chartData = raw.map(d => ({ label: shortLabel(d._id), Rides: d.count }));

  return (
    <ChartCard
      title="Rides Offered"
      icon={Car}
      iconColor="bg-violet-500"
      action={
        <PeriodToggle
          value={period}
          onChange={setPeriod}
          options={[{ label: 'Day', value: 'daily' }, { label: 'Week', value: 'weekly' }, { label: 'Month', value: 'monthly' }]}
        />
      }
    >
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-brand-muted text-sm">No data for this period</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rideGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.violet} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.violet} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="Rides" stroke={C.violet} strokeWidth={2} fill="url(#rideGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

// ─── RIDE STATUS DISTRIBUTION ─────────────────────────────
const RideStatusChart = ({ rideStatusDist = [], requestStatusDist = [] }) => {
  const [view, setView] = useState('requests');

  const rawData = view === 'rides' ? rideStatusDist : requestStatusDist;
  const chartData = rawData.map(d => ({
    name: d._id,
    value: d.count,
    fill: STATUS_COLORS[d._id] || C.slate,
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <ChartCard
      title="Ride Status Distribution"
      icon={Car}
      iconColor="bg-emerald-500"
      action={
        <PeriodToggle
          value={view}
          onChange={setView}
          options={[{ label: 'Requests', value: 'requests' }, { label: 'Offers', value: 'rides' }]}
        />
      }
    >
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-brand-muted text-sm">No data yet</div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" labelLine={false} label={renderCustomLabel}>
                {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 min-w-[140px]">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                <span className="text-brand-muted capitalize">{d.name}</span>
                <span className="ml-auto font-bold text-brand-dark">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
};

// ─── REQUEST OUTCOME BAR CHART ────────────────────────────
const RequestOutcomeBar = ({ requestStatusDist = [] }) => {
  const chartData = requestStatusDist.map(d => ({
    name: d._id,
    Count: d.count,
    fill: STATUS_COLORS[d._id] || C.slate,
  }));

  return (
    <ChartCard title="Request Outcomes" icon={TrendingUp} iconColor="bg-amber-500">
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-brand-muted text-sm">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="Count" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

// ─── PLATFORM RATING TREND ────────────────────────────────
const PlatformRatingTrend = ({ data = [] }) => {
  const chartData = data.map(d => ({
    label: shortLabel(d._id),
    'Avg Rating': parseFloat(d.avgRating.toFixed(2)),
    Reviews: d.count,
  }));

  return (
    <ChartCard title="Platform Rating Trend (Weekly)" icon={Star} iconColor="bg-pink-500">
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-brand-muted text-sm">No rating data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Avg Rating" stroke={C.amber} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Reviews" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

// ─── PER-USER RATING TREND ────────────────────────────────
const UserRatingTrends = ({ data = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  if (data.length === 0) {
    return (
      <ChartCard title="User Rating Trends" icon={AlertTriangle} iconColor="bg-rose-500">
        <div className="h-32 flex items-center justify-center text-brand-muted text-sm">
          No users with enough ratings to analyse trends yet
        </div>
      </ChartCard>
    );
  }

  const active = selectedUser ?? data[0];

  // Sort trend by week, build chart data
  const trendSorted = [...(active.trend || [])].sort((a, b) => a.week.localeCompare(b.week));
  const chartData = trendSorted.map(t => ({ label: shortLabel(t.week), Rating: parseFloat(t.avg.toFixed(2)) }));

  // Calculate direction
  let direction = 'stable';
  if (chartData.length >= 2) {
    const first = chartData[0].Rating;
    const last  = chartData[chartData.length - 1].Rating;
    if (last < first - 0.3) direction = 'declining';
    else if (last > first + 0.3) direction = 'improving';
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-gray-light p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-brand-dark text-sm">User Rating Trends</h3>
            <p className="text-xs text-brand-muted">Detect users with declining ratings (last 8 weeks)</p>
          </div>
        </div>
        {direction === 'declining' && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
            <TrendingDown className="h-3.5 w-3.5" /> Rating Declining
          </span>
        )}
        {direction === 'improving' && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
            <TrendingUp className="h-3.5 w-3.5" /> Rating Improving
          </span>
        )}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* User list */}
        <div className="lg:w-56 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-64 pb-1">
          {data.map(u => {
            const avg = u.overallAvg?.toFixed(1) || '?';
            const isActive = active._id === u._id;
            return (
              <button
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all flex-shrink-0 lg:flex-shrink w-full ${
                  isActive ? 'bg-brand-dark text-white' : 'hover:bg-brand-dark/5 text-brand-dark'
                }`}
              >
                <div className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden ${isActive ? 'bg-white/20 text-white' : 'bg-brand-accent/10 text-brand-accent'}`}>
                  {u.user?.profilePhoto
                    ? <img src={u.user.profilePhoto} alt="" className="h-full w-full object-cover" />
                    : u.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-brand-dark'}`}>{u.user?.name || 'Unknown'}</p>
                  <p className={`text-[10px] ${isActive ? 'text-white/70' : 'text-brand-muted'}`}>
                    ⭐ {avg} · {u.totalRatings} ratings
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          {chartData.length < 2 ? (
            <div className="h-48 flex items-center justify-center text-brand-muted text-sm">Not enough weekly data points</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone" dataKey="Rating"
                  stroke={direction === 'declining' ? C.red : direction === 'improving' ? C.emerald : C.amber}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: direction === 'declining' ? C.red : C.emerald }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ANALYTICS TAB ───────────────────────────────────
export const AnalyticsTab = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-6 h-72">
            <div className="h-4 bg-gray-200 rounded-full w-1/3 mb-4" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1 — User + Ride growth */}
      <div className="grid md:grid-cols-2 gap-6">
        <UserGrowthChart data={stats.userGrowth} />
        <RideGrowthChart data={stats.rideGrowth} />
      </div>

      {/* Row 2 — Status distribution + Request outcomes */}
      <div className="grid md:grid-cols-2 gap-6">
        <RideStatusChart
          rideStatusDist={stats.rideStatusDist}
          requestStatusDist={stats.requestStatusDist}
        />
        <RequestOutcomeBar requestStatusDist={stats.requestStatusDist} />
      </div>

      {/* Row 3 — Platform rating trend */}
      <PlatformRatingTrend data={stats.ratingTrendWeekly} />

      {/* Row 4 — Per-user rating trends */}
      <UserRatingTrends data={stats.userRatingTrends} />
    </div>
  );
};
