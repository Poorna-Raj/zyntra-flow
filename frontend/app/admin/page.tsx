'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem('adminLoggedIn');

    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const stats = [
    {
      title: 'Weekly Sales',
      value: '$15,000',
      growth: 'Increased by 60%',
      gradient:
        'linear-gradient(135deg, #FDBA74 0%, #F472B6 100%)',
      icon: '📈',
    },
    {
      title: 'Weekly Orders',
      value: '45,634',
      growth: 'Decreased by 10%',
      gradient:
        'linear-gradient(135deg, #7DD3FC 0%, #3B82F6 100%)',
      icon: '📘',
    },
    {
      title: 'Visitors Online',
      value: '95,741',
      growth: 'Increased by 5%',
      gradient:
        'linear-gradient(135deg, #5EEAD4 0%, #2DD4BF 100%)',
      icon: '💎',
    },
  ];

  const activities = [
    ['Coca-Cola', 'Western', '920', 'High'],
    ['Rice Flour', 'Southern', '860', 'Medium'],
    ['Milk Powder', 'Central', '780', 'Stable'],
    ['Soft Drinks', 'Northern', '970', 'High'],
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#F6F4FA',
        fontFamily: 'Inter, sans-serif',
        color: '#1E293B',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '260px',
          background: '#fff',
          borderRight: '1px solid #ECEAF3',
          padding: '2rem 1.4rem',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, #38BDF8, #1E90FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            L
          </div>

          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              Loka
              <span style={{ color: '#38BDF8' }}>
                lens
              </span>
            </h1>

            <p
              style={{
                fontSize: '0.8rem',
                color: '#94A3B8',
                marginTop: '0.2rem',
              }}
            >
              AI Forecast Platform
            </p>
          </div>
        </div>

        {/* USER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg, #C084FC, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              Admin User
            </h3>

            <p
              style={{
                fontSize: '0.82rem',
                color: '#94A3B8',
              }}
            >
              Project Manager
            </p>
          </div>
        </div>

        {/* MENU */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}
        >
          
          {[
  'Dashboard',
  'Forecasts',
  'Analytics',
  'Users',
  'Settings',
].map((item, index) => (
  <button
    key={item}
    style={{
      padding: '1rem 1rem',
      borderRadius: '16px',

      background:
        index === 0
          ? 'rgba(56,189,248,0.10)'
          : 'transparent',

      border:
        index === 0
          ? '1px solid rgba(56,189,248,0.22)'
          : '1px solid transparent',

      backdropFilter:
        index === 0 ? 'blur(18px)' : 'none',

      WebkitBackdropFilter:
        index === 0 ? 'blur(18px)' : 'none',

      color:
        index === 0 ? '#0EA5E9' : '#334155',

      fontWeight: 600,
      fontSize: '0.95rem',
      textAlign: 'left',
      cursor: 'pointer',

      transition: 'all 0.25s ease',

      transform: 'translateX(0px)',

      boxShadow:
        index === 0
          ? '0 8px 24px rgba(56,189,248,0.10)'
          : '0 8px 24px rgba(56,189,248,0)',
    }}

    onMouseEnter={(e) => {
      e.currentTarget.style.transform =
        'translateX(6px)';

      e.currentTarget.style.boxShadow =
        '0 10px 24px rgba(56,189,248,0.18)';
    }}

    onMouseLeave={(e) => {
      e.currentTarget.style.transform =
        'translateX(0px)';

      e.currentTarget.style.boxShadow =
        index === 0
          ? '0 8px 24px rgba(56,189,248,0.10)'
          : '0 8px 24px rgba(56,189,248,0)';
    }}
  >
    {item}
  </button>
))}
        </div>

        {/* PROJECT BOX */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            borderRadius: '24px',
           background:
        'linear-gradient(135deg, #38BDF8, #1E90FF)',
            color: '#fff',
            
          }}
        >
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '0.8rem',
            }}
          >
            AI Forecast Engine
          </h3>

          <p
            style={{
              fontSize: '0.88rem',
              lineHeight: 1.7,
              opacity: 0.9,
              marginBottom: '1rem',
            }}
          >
            AI-powered forecasting system currently
            monitoring regional demand patterns.
          </p>

          <button
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '14px',
              border: 'none',
              background: '#fff',
              color: '#1E90FF',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            View Analytics
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              width: '380px',
              background: '#fff',
              borderRadius: '18px',
              padding: '0.9rem 1rem',
              border: '1px solid #ECEAF3',
              color: '#94A3B8',
            }}
          >
            🔍 Search forecasts...
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {['✉️', '🔔', '⚙️'].map((icon) => (
              <div
                key={icon}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#fff',
                  border: '1px solid #ECEAF3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {icon}
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                background: '#fff',
                borderRadius: '18px',
                padding: '0.5rem 1rem',
                border: '1px solid #ECEAF3',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, #C084FC, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                A
              </div>

              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  Admin
                </p>

                <p
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                  }}
                >
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div
          style={{
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              marginBottom: '0.8rem',
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              color: '#64748B',
              lineHeight: 1.8,
            }}
          >
            Monitor forecasting analytics, AI insights
            and regional demand performance in real time.
          </p>
        </div>

        {/* STATS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                padding: '2rem',
                background: stat.gradient,
                color: '#fff',
                minHeight: '220px',
              }}
            >
              {/* CIRCLES */}
              <div
                style={{
                  position: 'absolute',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background:
                    'rgba(255,255,255,0.12)',
                  top: '-50px',
                  right: '-40px',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background:
                    'rgba(255,255,255,0.10)',
                  bottom: '-70px',
                  right: '40px',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '2rem',
                }}
              >
                <p
                  style={{
                    fontSize: '1rem',
                    opacity: 0.95,
                  }}
                >
                  {stat.title}
                </p>

                <div
                  style={{
                    fontSize: '1.4rem',
                  }}
                >
                  {stat.icon}
                </div>
              </div>

              <h2
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem',
                }}
              >
                {stat.value}
              </h2>

              <p
                style={{
                  fontSize: '0.95rem',
                  opacity: 0.95,
                }}
              >
                {stat.growth}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* CHART */}
          <div
            style={{
              background: '#fff',
              borderRadius: '28px',
              padding: '2rem',
              border: '1px solid #ECEAF3',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                  }}
                >
                  Weekly Demand Forecasts
                </h3>

                <p
                  style={{
                    color: '#64748B',
                  }}
                >
                  Regional forecasting performance
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#A855F7',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#A855F7',
                    }}
                  />

                  AI
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#38BDF8',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#38BDF8',
                    }}
                  />

                  Forecast
                </div>
              </div>
            </div>

            {/* CHART AREA */}
            <div
              style={{
                height: '340px',
                position: 'relative',
              }}
            >
              {/* GRID */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: `${i * 25}%`,
                    left: 0,
                    right: 0,
                    borderTop:
                      '1px solid #F1F5F9',
                  }}
                />
              ))}

              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 340"
                preserveAspectRatio="none"
              >
                {/* PURPLE */}
                <rect
                  x="80"
                  y="170"
                  width="16"
                  height="120"
                  rx="8"
                  fill="#A855F7"
                />
                <rect
                  x="180"
                  y="120"
                  width="16"
                  height="170"
                  rx="8"
                  fill="#A855F7"
                />
                <rect
                  x="280"
                  y="190"
                  width="16"
                  height="100"
                  rx="8"
                  fill="#A855F7"
                />
                <rect
                  x="380"
                  y="130"
                  width="16"
                  height="160"
                  rx="8"
                  fill="#A855F7"
                />
                <rect
                  x="480"
                  y="90"
                  width="16"
                  height="200"
                  rx="8"
                  fill="#A855F7"
                />
                <rect
                  x="580"
                  y="150"
                  width="16"
                  height="140"
                  rx="8"
                  fill="#A855F7"
                />

                {/* PINK */}
                <rect
                  x="110"
                  y="140"
                  width="16"
                  height="150"
                  rx="8"
                  fill="#EC4899"
                />
                <rect
                  x="210"
                  y="190"
                  width="16"
                  height="100"
                  rx="8"
                  fill="#EC4899"
                />
                <rect
                  x="310"
                  y="150"
                  width="16"
                  height="140"
                  rx="8"
                  fill="#EC4899"
                />
                <rect
                  x="410"
                  y="210"
                  width="16"
                  height="80"
                  rx="8"
                  fill="#EC4899"
                />
                <rect
                  x="510"
                  y="180"
                  width="16"
                  height="110"
                  rx="8"
                  fill="#EC4899"
                />
                <rect
                  x="610"
                  y="130"
                  width="16"
                  height="160"
                  rx="8"
                  fill="#EC4899"
                />

                {/* BLUE */}
                <rect
                  x="140"
                  y="80"
                  width="16"
                  height="210"
                  rx="8"
                  fill="#38BDF8"
                />
                <rect
                  x="240"
                  y="220"
                  width="16"
                  height="70"
                  rx="8"
                  fill="#38BDF8"
                />
                <rect
                  x="340"
                  y="170"
                  width="16"
                  height="120"
                  rx="8"
                  fill="#38BDF8"
                />
                <rect
                  x="440"
                  y="140"
                  width="16"
                  height="150"
                  rx="8"
                  fill="#38BDF8"
                />
                <rect
                  x="540"
                  y="80"
                  width="16"
                  height="210"
                  rx="8"
                  fill="#38BDF8"
                />
                <rect
                  x="640"
                  y="190"
                  width="16"
                  height="100"
                  rx="8"
                  fill="#38BDF8"
                />
              </svg>
            </div>
          </div>

          {/* DONUT */}
          <div
            style={{
              background: '#fff',
              borderRadius: '28px',
              padding: '2rem',
              border: '1px solid #ECEAF3',
            }}
          >
            <h3
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                marginBottom: '2rem',
              }}
            >
              Traffic Sources
            </h3>

            {/* DONUT */}
            <div
              style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background:
                  'conic-gradient(#EC4899 0% 40%, #2DD4BF 40% 70%, #38BDF8 70% 100%)',
                margin: '0 auto 2rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '40px',
                  borderRadius: '50%',
                  background: '#fff',
                }}
              />
            </div>

            {/* LEGEND */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {[
                ['Search Engines', '#EC4899'],
                ['Direct Click', '#2DD4BF'],
                ['Social Media', '#38BDF8'],
              ].map(([label, color]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: color,
                      }}
                    />

                    <span
                      style={{
                        color: '#64748B',
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    30%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: '#fff',
            borderRadius: '28px',
            padding: '2rem',
            border: '1px solid #ECEAF3',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.8rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
              }}
            >
              Recent Forecast Activity
            </h3>

            <button
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '14px',
                border: 'none',
                background:
                  'linear-gradient(135deg, #C084FC, #A855F7)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View Reports
            </button>
          </div>

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
                  color: '#94A3B8',
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
              {activities.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: '1.2rem 0',
                      borderTop:
                        '1px solid #F1F5F9',
                      fontWeight: 700,
                    }}
                  >
                    {item[0]}
                  </td>

                  <td
                    style={{
                      borderTop:
                        '1px solid #F1F5F9',
                      color: '#64748B',
                    }}
                  >
                    {item[1]}
                  </td>

                  <td
                    style={{
                      borderTop:
                        '1px solid #F1F5F9',
                      color: '#64748B',
                    }}
                  >
                    {item[2]}
                  </td>

                  <td
                    style={{
                      borderTop:
                        '1px solid #F1F5F9',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '999px',
                        background:
                          item[3] === 'High'
                            ? 'rgba(34,197,94,0.12)'
                            : item[3] === 'Medium'
                            ? 'rgba(250,204,21,0.16)'
                            : 'rgba(56,189,248,0.12)',
                        color:
                          item[3] === 'High'
                            ? '#16A34A'
                            : item[3] === 'Medium'
                            ? '#CA8A04'
                            : '#0284C7',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      {item[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}