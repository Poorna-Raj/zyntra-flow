'use client';
export default function AdminPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #F7FAFC 0%, #EBF5FF 50%, #D6EDFF 100%)',
        display: 'flex',
        fontFamily: 'var(--font-body)',
        color: '#1A2A3A',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          padding: '2rem 1.5rem',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(18px)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <h1
          className="gradient-text"
          style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            marginBottom: '3rem',
            fontFamily: 'var(--font-display)',
          }}
        >
          Lokalens
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {[
            'Dashboard',
            'Forecasts',
            'Analytics',
            'Users',
            'Settings',
          ].map((item) => (
            <button
              key={item}
              style={{
                padding: '1rem 1.2rem',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255,255,255,0.75)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: '0.25s ease',
                textAlign: 'left',
                color: '#1A2A3A',
                boxShadow: '0 4px 18px rgba(30,144,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = '#1E90FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0px)';
                e.currentTarget.style.borderColor =
                  'rgba(0,0,0,0.06)';
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '2.5rem',
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '2.5rem',
          }}
        >
          <div className="badge" style={{ marginBottom: '1rem' }}>
            AI Forecast Intelligence
          </div>

          <h1
            style={{
              fontSize: '4rem',
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: '1rem',
              fontFamily: 'var(--font-display)',
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              color: '#4A6580',
              fontSize: '1.1rem',
              maxWidth: '650px',
            }}
          >
            Monitor localized forecasting insights, analytics,
            prediction performance and platform activities in real time.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {[
            ['Total Forecasts', '12,480'],
            ['Active Users', '1,245'],
            ['Prediction Accuracy', '91%'],
            ['Top Province', 'Western'],
          ].map(([title, value]) => (
            <div
              key={title}
              className="stat-card"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: '24px',
                padding: '1.8rem',
                backdropFilter: 'blur(18px)',
                boxShadow:
                  '0 10px 35px rgba(30,144,255,0.10)',
              }}
            >
              <p
                style={{
                  color: '#4A6580',
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                }}
              >
                {title}
              </p>

              <h2
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Chart 1 */}
          <div
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '28px',
              padding: '1.8rem',
              boxShadow:
                '0 10px 35px rgba(30,144,255,0.08)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '1.5rem',
                fontWeight: 700,
              }}
            >
              Weekly Demand Forecasts
            </h3>

            <div
              style={{
                height: '260px',
                borderRadius: '22px',
                background:
                  'linear-gradient(135deg, rgba(30,144,255,0.08), rgba(91,186,255,0.12))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A6580',
                fontWeight: 600,
              }}
            >
              Forecast Chart Placeholder
            </div>
          </div>

          {/* Chart 2 */}
          <div
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '28px',
              padding: '1.8rem',
              boxShadow:
                '0 10px 35px rgba(30,144,255,0.08)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '1.5rem',
                fontWeight: 700,
              }}
            >
              Province Distribution
            </h3>

            <div
              style={{
                height: '260px',
                borderRadius: '22px',
                background:
                  'linear-gradient(135deg, rgba(30,144,255,0.08), rgba(91,186,255,0.12))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A6580',
                fontWeight: 600,
              }}
            >
              Province Analytics Placeholder
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: 'rgba(255,255,255,0.72)',
            borderRadius: '28px',
            padding: '2rem',
            boxShadow:
              '0 10px 35px rgba(30,144,255,0.08)',
            border: '1px solid rgba(255,255,255,0.8)',
          }}
        >
          <h3
            style={{
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              fontWeight: 700,
            }}
          >
            Recent Forecast Activity
          </h3>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: 'left',
                  color: '#4A6580',
                }}
              >
                <th style={{ paddingBottom: '1rem' }}>
                  Product
                </th>
                <th style={{ paddingBottom: '1rem' }}>
                  Province
                </th>
                <th style={{ paddingBottom: '1rem' }}>
                  Forecast Score
                </th>
                <th style={{ paddingBottom: '1rem' }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                ['Coca-Cola', 'Western', '920', 'High'],
                ['Rice Flour', 'Southern', '860', 'Medium'],
                ['Milk Powder', 'Central', '780', 'Stable'],
              ].map((item, index) => (
                <tr key={index}>
                  {item.map((value, i) => (
                    <td
                      key={i}
                      style={{
                        padding: '1rem 0',
                        borderTop:
                          '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}