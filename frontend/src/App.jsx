import { useState } from 'react'
import './App.css'

const summaryData = [
  { label: 'Cloudburst Risk', value: '68%', trend: '+15%', tone: 'high' },
  { label: 'Thunderstorm Risk', value: '42%', trend: '+8%', tone: 'moderate' },
  { label: 'Flash Flood Risk', value: '71%', trend: '+12%', tone: 'high' },
]

const alerts = [
  { region: 'Mumbai Metropolitan', type: 'Cloudburst', level: 'Severe', time: '1–3 hrs' },
  { region: 'Delhi NCR', type: 'Thunderstorm', level: 'High', time: '3–6 hrs' },
  { region: 'Jaipur Region', type: 'Flash Flood', level: 'High', time: '2–4 hrs' },
]

const forecastData = [
  { label: 'Rainfall', value: '184 mm/hr', status: 'Extreme' },
  { label: 'CAPE', value: '2200 J/kg', status: 'Elevated' },
  { label: 'IWV', value: '58 kg/m²', status: 'Moist' },
  { label: 'Wind Shear', value: '32 m/s', status: 'Strong' },
]

const riskZones = [
  { region: 'Mumbai', risk: 'high', value: '68%' },
  { region: 'Pune', risk: 'moderate', value: '42%' },
  { region: 'Delhi NCR', risk: 'high', value: '71%' },
  { region: 'Jaipur', risk: 'low', value: '28%' },
  { region: 'Ahmedabad', risk: 'moderate', value: '56%' },
  { region: 'Hyderabad', risk: 'extreme', value: '84%' },
  { region: 'Kolkata', risk: 'moderate', value: '49%' },
  { region: 'Chennai', risk: 'low', value: '31%' },
  { region: 'Bengaluru', risk: 'low', value: '24%' },
  { region: 'Nagpur', risk: 'high', value: '63%' },
  { region: 'Surat', risk: 'moderate', value: '51%' },
  { region: 'Lucknow', risk: 'high', value: '66%' },
]

const navItems = ['Overview', 'Risk Map', 'Alerts', 'Forecasts', 'Analytics']

function App() {
  const [activeSection, setActiveSection] = useState('Overview')

  const renderOverview = () => (
    <>
      <section className="summary-grid">
        {summaryData.map((item) => (
          <article key={item.label} className={`summary-card ${item.tone}`}>
            <div className="summary-meta">
              <span>{item.label}</span>
              <span className="trend">{item.trend}</span>
            </div>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="map-panel">
          <div className="panel-header">
            <h3>Risk Map</h3>
            <span className="pill warning">Monitoring</span>
          </div>

          <div className="map-surface">
            <div className="map-grid">
              <span className="grid-cell low" />
              <span className="grid-cell moderate" />
              <span className="grid-cell high" />
              <span className="grid-cell low" />
              <span className="grid-cell moderate" />
              <span className="grid-cell extreme" />
              <span className="grid-cell moderate" />
              <span className="grid-cell high" />
              <span className="grid-cell low" />
              <span className="grid-cell moderate" />
              <span className="grid-cell low" />
              <span className="grid-cell high" />
            </div>
            <div className="map-badge">2–6 hour outlook</div>
          </div>
        </div>

        <div className="stack-panel">
          <div className="panel-header">
            <h3>Active Alerts</h3>
            <span className="pill danger">3 active</span>
          </div>

          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.region} className="alert-item">
                <div>
                  <strong>{alert.region}</strong>
                  <p>{alert.type}</p>
                </div>
                <div className="alert-meta">
                  <span className="level-label">{alert.level}</span>
                  <small>{alert.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Atmospheric Drivers</h3>
          </div>
          <div className="metrics-list">
            {forecastData.map((item) => (
              <div key={item.label} className="metric-row">
                <span>{item.label}</span>
                <div>
                  <strong>{item.value}</strong>
                  <em>{item.status}</em>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Decision Support</h3>
          </div>
          <ul className="insight-list">
            <li>Low-level convergence is intensifying over the western corridor.</li>
            <li>Cloud-top cooling suggests stronger convective development with 3-4h lead time.</li>
            <li>Urban drainage zones remain the highest flash-flood exposure areas.</li>
          </ul>
        </div>
      </section>
    </>
  )

  const renderRiskMap = () => (
    <section className="single-panel-view">
      <div className="panel large-panel">
        <div className="panel-header">
          <div>
            <h3>Risk Map</h3>
            <p className="panel-subtitle">Predicted extreme-weather exposure by region</p>
          </div>
          <div className="map-controls">
            <button type="button" className="map-control active">2–6 hours</button>
            <button type="button" className="map-control">6–12 hours</button>
          </div>
        </div>
        <div className="map-surface large-map">
          <div className="map-grid">
            {riskZones.map((zone) => (
              <div key={zone.region} className={`grid-cell ${zone.risk}`}>
                <strong>{zone.region}</strong>
                <span>{zone.value} risk</span>
              </div>
            ))}
          </div>
          <div className="map-overlay-label">Live precipitation model</div>
          <div className="map-legend" aria-label="Risk level legend">
            <span><i className="legend-dot low" />Low</span>
            <span><i className="legend-dot moderate" />Moderate</span>
            <span><i className="legend-dot high" />High</span>
            <span><i className="legend-dot extreme" />Extreme</span>
          </div>
        </div>
      </div>
    </section>
  )

  const renderAlerts = () => (
    <section className="single-panel-view">
      <div className="panel large-panel">
        <div className="panel-header">
          <h3>Alerts</h3>
          <span className="pill danger">3 active</span>
        </div>
        <div className="alert-list stacked-alert-list">
          {alerts.map((alert) => (
            <div key={alert.region} className="alert-item wide-alert-item">
              <div>
                <strong>{alert.region}</strong>
                <p>{alert.type}</p>
              </div>
              <div className="alert-meta">
                <span className="level-label">{alert.level}</span>
                <small>{alert.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderForecasts = () => (
    <section className="single-panel-view">
      <div className="panel large-panel">
        <div className="panel-header">
          <h3>Forecasts</h3>
          <span className="pill warning">Updated 3 min ago</span>
        </div>
        <div className="metrics-list">
          {forecastData.map((item) => (
            <div key={item.label} className="metric-row">
              <span>{item.label}</span>
              <div>
                <strong>{item.value}</strong>
                <em>{item.status}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderAnalytics = () => (
    <section className="single-panel-view">
      <div className="panel large-panel">
        <div className="panel-header">
          <h3>Analytics</h3>
          <span className="pill warning">Model confidence 86%</span>
        </div>
        <ul className="insight-list">
          <li>Low-level convergence is intensifying over the western corridor.</li>
          <li>Cloud-top cooling suggests stronger convective development with 3-4h lead time.</li>
          <li>Urban drainage zones remain the highest flash-flood exposure areas.</li>
          <li>Current risk model is calibrated toward elevated rainfall momentum and terrain-driven runoff.</li>
        </ul>
      </div>
    </section>
  )

  const sectionRenderers = {
    Overview: renderOverview,
    'Risk Map': renderRiskMap,
    Alerts: renderAlerts,
    Forecasts: renderForecasts,
    Analytics: renderAnalytics,
  }

  const currentSection = sectionRenderers[activeSection] || renderOverview

  return (
    <div className="knowhow-app">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">K</div>
          <div>
            <p className="eyebrow">AI weather intelligence</p>
            <h1>KnowHow</h1>
          </div>
        </div>

        <nav className="nav-panel" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`nav-item ${activeSection === item ? 'active' : ''}`}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mini-card">
          <p className="label">System Status</p>
          <div className="status-row">
            <span className="dot live" />
            Live Nowcasting Active
          </div>
          <small>Last refresh: 3 min ago</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hyper-local early warning</p>
            <h2>{activeSection === 'Overview' ? 'Extreme Weather Risk Dashboard' : activeSection}</h2>
          </div>
          <div className="top-actions">
            <button type="button" className="ghost-btn">Export</button>
            <button type="button" className="primary-btn">Issue Alert</button>
          </div>
        </header>

        {currentSection()}
      </main>
    </div>
  )
}

export default App
