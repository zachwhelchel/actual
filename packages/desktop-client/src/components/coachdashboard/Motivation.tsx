import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { Link } from '../common/Link';

// Regular CSS styles object
const styles = {
  container: {
    borderRadius: '8px',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '13px',
    paddingBottom: '0px',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
    width: 'auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#1f2937',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  gridContainerMedium: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    height: 'auto',
    marginBottom: '24px',
  },
  panel: {
    padding: '16px',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  assumptionsPanel: {
    backgroundColor: '#f9fafb',
  },
  controlPanel: {
    backgroundColor: '#eff6ff',
  },
  resultsPanel: {
    backgroundColor: '#ecfdf5',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  assumptionsPanelTitle: {
    color: '#374151',
  },
  controlPanelTitle: {
    color: '#1d4ed8',
  },
  resultsPanelTitle: {
    color: '#047857',
  },
  formGroup: {
    marginBottom: '12px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '4px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    fontSize: '14px',
  },
  select: {
    display: 'block',
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    fontSize: '14px',
  },
  metricsContainer: {
    marginTop: '16px',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#4b5563',
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  impactBadge: {
    display: 'inline-block',
    marginLeft: '8px',
    fontSize: '14px',
    fontWeight: 'normal',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  projectedValue: {
    color: '#047857',
  },
  chartContainer: {
    backgroundColor: 'white',
    paddingTop: '16px',
    borderRadius: '6px',
    marginBottom: '0px',
  },
  chartContainerEnd: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '0px',
    // Change these properties:
    height: 'calc(100vh - 529px)', // Adjust 800px to match the height of your top section
    minHeight: '200px', // Minimum height to prevent it from disappearing
    overflow: 'hidden', // Hide overflow of the container itself
    display: 'flex',
    flexDirection: 'column',
  },
  initiativesContainer: {
    overflowY: 'auto',
    flex: 1,
    paddingRight: '5px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#d1d5db #f9fafb',
  },
  chartTitleFixed: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
    paddingBottom: '8px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  chartWrapper: {
    marginTop: 20,
    height: '280px',
  },
  initiativesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '16px',
  },
  initiativesGridMedium: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  initiativeCard: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  initiativeCardActive: {
    backgroundColor: '#eef2ff',
  },
  initiativeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  initiativeContent: {
    flex: '1',
  },
  initiativeTitle: {
    fontWeight: '500',
    marginBottom: '4px',
  },
  initiativeDescription: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '4px',
  },
  effectsContainer: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  effect: {
    display: 'inline-block',
    marginRight: '12px',
  },
  buttonContainer: {
    marginLeft: '16px',
  },
  button: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
  },
  activeButton: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
  },
  inactiveButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
  impactArrow: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#059669',
  },
};

// Custom tooltip component to show total revenue
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Calculate the total of stacked values (passive + active revenue)
    const totalValue = payload.reduce((sum, entry) => {
      // Only include the bars in the stack, not the line
      if (entry.dataKey !== 'baselineRevenue') {
        return sum + entry.value;
      }
      return sum;
    }, 0);

    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Month {label}</strong>
        </p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            style={{
              margin: '4px 0',
              color: entry.color,
            }}
          >
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
        <p
          style={{
            margin: '4px 0',
            fontWeight: 'bold',
            borderTop: '1px solid #eee',
            paddingTop: '4px',
          }}
        >
          Total Revenue: ${totalValue.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

// Media query helper
const useMediaQuery = query => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const MotivationDashboard = () => {
  // Check if the screen is at least medium-sized
  const isMediumScreen = useMediaQuery('(min-width: 768px)');

  // Base assumptions - fixed values
  const [baseAssumptions, setBaseAssumptions] = useState({
    initialPaidUsers: 0, // Starting number of paid users
    passiveIncomePerUser: 1.76, // Passive monthly income per user
  });

  // Controllable variables - coaches can adjust these
  const [controlVars, setControlVars] = useState({
    newTrialUsersPerMonth: 10, // New trial users per month (natural acquisition)
    trialConversionRate: 0.1, // Free trial to paid conversion rate (10%)
    meetingPrice: 50, // Price per coaching session
    meetingsPerMonth: 0.33, // Number of meetings per month with user
  });

  // Improvement suggestions that can be toggled
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: 'Share on Socials Monthly',
      active: false,
      effect: {
        trialUsersBoost: 1,
        conversionRateBoost: 0.05,
        meetingsBoost: 0.11,
      },
      links: [{ title: 'Canva Templates For Socials', url: 'url' }],
      description:
        'MBC offers a low-commitment way for your followers to start working with you. Sharing your MyBudgetCoach directory listing on your socials. This will bring in new users and encourage existing users to engage more with you here on the platform.',
    },
    {
      id: 2,
      name: 'Share on Socials Weekly',
      active: false,
      effect: {
        trialUsersBoost: 4,
        conversionRateBoost: 0.05,
        meetingsBoost: 0.11,
      },
      links: [{ title: 'Canva Templates For Socials', url: 'url' }],
      description:
        'MBC offers a low-commitment way for your followers to start working with you. Share your MyBudgetCoach directory listing on your socials. This will bring in new users and encourage existing users to engage more with you here on the platform.',
    },
    {
      id: 3,
      name: 'Add MyBudgetCoach to Your LinkTree',
      active: false,
      effect: { trialUsersBoost: 0.5 },
      links: [
        { title: 'Example 1', url: 'url' },
        { title: 'Example 2', url: 'url' },
        { title: 'Example 3', url: 'url' },
      ],
      description:
        "Do you use a LinkTree or a similar link page? Adding MyBudgetCoach can be a great way to gather users. Use copy like 'Start Budgeting With Me'.",
    },
    {
      id: 4,
      name: 'Add MyBudgetCoach to Your Website',
      active: false,
      effect: { trialUsersBoost: 12, meetingsBoost: 0.2 },
      links: [
        { title: 'Example 1', url: 'url' },
        { title: 'Example 2', url: 'url' },
        { title: 'Example 3', url: 'url' },
      ],
      description:
        'Have a website for your coaching business? Incorporate MBC as an offering.',
    },
    {
      id: 5,
      name: 'Put Up Flyers Around Town',
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [
        { title: 'Discord Discussion', url: 'url' },
        { title: 'Canva Template', url: 'url' },
      ],
      description:
        'Tear off flyers are a great way to engage your local community. MBC coaches have had success putting flyers in local grocery stores, libraries, and more.',
    },
    {
      id: 6,
      name: 'Blog Quarterly For MBC',
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [{ title: 'MBC Blog', url: 'url' }],
      description:
        'The MBC Blog is seen by hundreds of internet visitors each month. When you write an article your directory listing will also be featured. Readers will be one click away from starting to budget with you.',
    },
    {
      id: 7,
      name: 'Land A Business Deal',
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [{ title: 'Case Study 1', url: 'url' }],
      description:
        'Approach a small business about helping their employees with budgeting. Your avatar will allow you to help more users than you would otherwise, making the package more cost effective and attractive to the employer.',
    },
    {
      id: 8,
      name: "Boost Your Listing On The MBC 'Find My Coach Quiz'",
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [{ title: 'Find My Coach Quiz Boosting Guide', url: 'url' }],
      description:
        "The 'Find My Coach Quiz' prioritizes coaches who are active, motivated, and available. Check out the link below to learn more about how you can boost your listing to the top.",
    },
    {
      id: 9,
      name: "Join the '2 Every 90 Club'",
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [{ title: 'Request to Join', url: 'url' }],
      description:
        "The '2 Every 90 Club' is a group of live coaches who have formed a Mastermind to work together on getting 2 paid users every 90 days.",
    },
    {
      id: 10,
      name: 'Build MBC Into Your Existing Offerings',
      active: false,
      effect: {
        trialUsersBoost: 3,
        conversionRateBoost: 0.08,
        meetingsBoost: 0.5,
      },
      links: [{ title: 'Example 1', url: 'url' }],
      description:
        "Do you have existing individual or group offerings that relied on spreadsheets or another app? Switch to MBC so you'll have access to your clients' budget and get a passive revenue stream for the long term.",
    },
  ]);

  const [projectionData, setProjectionData] = useState([]);
  const [baselineData, setBaselineData] = useState([]);
  const [projectionMonths, setProjectionMonths] = useState(12);

  // Calculate the impact of active initiatives on controllable variables
  const calculateVariableImpacts = () => {
    let impacts = {
      trialUsersBoost: 0,
      conversionRateBoost: 0,
      meetingsBoost: 0,
    };

    suggestions.forEach(suggestion => {
      if (suggestion.active) {
        if (suggestion.effect.trialUsersBoost) {
          impacts.trialUsersBoost += suggestion.effect.trialUsersBoost;
        }
        if (suggestion.effect.conversionRateBoost) {
          impacts.conversionRateBoost += suggestion.effect.conversionRateBoost;
        }
        if (suggestion.effect.meetingsBoost) {
          impacts.meetingsBoost += suggestion.effect.meetingsBoost;
        }
      }
    });

    return impacts;
  };

  const variableImpacts = calculateVariableImpacts();

  // Calculate revenue projections based on all factors
  useEffect(() => {
    // Calculate projections
    const calculateProjections = () => {
      const months = Array.from({ length: projectionMonths }, (_, i) => i + 1);

      // Calculate baseline (without interventions)
      let basePaidUsers = baseAssumptions.initialPaidUsers;
      let baseTrialUsers = 0;
      let baselineProjection = [];
      const baseConversionRate = controlVars.trialConversionRate;

      for (let month = 1; month <= projectionMonths; month++) {
        // Add new trial users
        baseTrialUsers += controlVars.newTrialUsersPerMonth;

        // Convert some trial users to paid
        const newPaidFromTrial = Math.floor(
          baseTrialUsers * baseConversionRate,
        );
        basePaidUsers += newPaidFromTrial;

        // Remove converted users from trial
        baseTrialUsers -= newPaidFromTrial;

        // Calculate revenue
        // Only first-month trial users and paid users generate meeting revenue
        let trialUsersWithMeetings = controlVars.newTrialUsersPerMonth; // Only new trial users have meetings

        // All previous trial users drop off and don't contribute to meeting revenue
        baseTrialUsers = controlVars.newTrialUsersPerMonth - newPaidFromTrial;

        const meetingRevenue =
          (basePaidUsers + trialUsersWithMeetings) *
          controlVars.meetingsPerMonth *
          controlVars.meetingPrice;

        // Only paid users generate passive income
        const passiveRevenue =
          basePaidUsers * baseAssumptions.passiveIncomePerUser;

        baselineProjection.push({
          month,
          paidUsers: basePaidUsers,
          trialUsers: baseTrialUsers,
          totalUsers: basePaidUsers + baseTrialUsers,
          activeRevenue: meetingRevenue,
          passiveRevenue: passiveRevenue,
          totalRevenue: meetingRevenue + passiveRevenue,
          baselineRevenue: meetingRevenue + passiveRevenue,
          conversionRate: baseConversionRate,
        });
      }

      setBaselineData(baselineProjection);

      // Calculate with interventions
      let paidUsers = baseAssumptions.initialPaidUsers;
      let trialUsers = 0;
      let projData = [];

      for (let month = 1; month <= projectionMonths; month++) {
        // Calculate adjusted values with boosts from active suggestions
        let trialUsersBoost = 0;
        let meetingsPerMonth = controlVars.meetingsPerMonth;
        let conversionRateBoost = 0;

        suggestions.forEach(suggestion => {
          if (suggestion.active) {
            if (suggestion.effect.trialUsersBoost) {
              trialUsersBoost += suggestion.effect.trialUsersBoost;
            }
            if (suggestion.effect.meetingsBoost) {
              meetingsPerMonth += suggestion.effect.meetingsBoost;
            }
            if (suggestion.effect.conversionRateBoost) {
              conversionRateBoost += suggestion.effect.conversionRateBoost;
            }
          }
        });

        // Add new trial users (base + boost)
        const newTrialUsersThisMonth =
          controlVars.newTrialUsersPerMonth + trialUsersBoost;
        trialUsers += newTrialUsersThisMonth;

        // Calculate adjusted conversion rate
        const adjustedConversionRate = Math.min(
          1,
          controlVars.trialConversionRate + conversionRateBoost,
        );

        // Convert some trial users to paid
        const newPaidFromTrial = Math.floor(
          trialUsers * adjustedConversionRate,
        );
        paidUsers += newPaidFromTrial;

        // Calculate revenue
        // Only first-month trial users and paid users generate meeting revenue
        let trialUsersWithMeetings = newTrialUsersThisMonth; // Only new trial users have meetings

        // Remove converted users and drop off remaining trial users (they don't contribute to meeting revenue beyond first month)
        trialUsers = newTrialUsersThisMonth - newPaidFromTrial;

        const meetingRevenue =
          (paidUsers + trialUsersWithMeetings) *
          meetingsPerMonth *
          controlVars.meetingPrice;

        // Only paid users generate passive income
        const passiveRevenue = paidUsers * baseAssumptions.passiveIncomePerUser;

        const baselineItem = baselineProjection[month - 1] || {
          totalRevenue: 0,
          conversionRate: baseConversionRate,
        };

        projData.push({
          month,
          paidUsers: paidUsers,
          trialUsers: trialUsers,
          totalUsers: paidUsers + trialUsers,
          activeRevenue: meetingRevenue,
          passiveRevenue: passiveRevenue,
          totalRevenue: meetingRevenue + passiveRevenue,
          baselineRevenue: baselineItem.totalRevenue,
          conversionRate: adjustedConversionRate,
        });
      }

      setProjectionData(projData);
    };

    calculateProjections();
  }, [baseAssumptions, controlVars, suggestions, projectionMonths]);

  // Handle toggle of a suggestion
  const toggleSuggestion = id => {
    const updatedSuggestions = suggestions.map(s =>
      s.id === id ? { ...s, active: !s.active } : s,
    );
    setSuggestions(updatedSuggestions);
  };

  // Handle change to base assumptions
  const handleAssumptionChange = (key, value) => {
    setBaseAssumptions(prev => ({
      ...prev,
      [key]: parseFloat(value),
    }));
  };

  // Handle change to controllable variables
  const handleControlVarChange = (key, value) => {
    setControlVars(prev => ({
      ...prev,
      [key]: parseFloat(value),
    }));
  };

  // Get final month data
  const finalMonthData =
    projectionData.length > 0
      ? projectionData[projectionData.length - 1]
      : { totalRevenue: 0, paidUsers: 0, conversionRate: 0 };

  // Get baseline final month data
  const baselineFinalMonthData =
    baselineData.length > 0
      ? baselineData[baselineData.length - 1]
      : { totalRevenue: 0, paidUsers: 0, conversionRate: 0 };

  // Calculate impact percentages
  const revenueImpactPercentage =
    baselineFinalMonthData.totalRevenue > 0
      ? (
          ((finalMonthData.totalRevenue - baselineFinalMonthData.totalRevenue) /
            baselineFinalMonthData.totalRevenue) *
          100
        ).toFixed(1)
      : 0;

  const userImpactPercentage =
    baselineFinalMonthData.paidUsers > 0
      ? (
          ((finalMonthData.paidUsers - baselineFinalMonthData.paidUsers) /
            baselineFinalMonthData.paidUsers) *
          100
        ).toFixed(1)
      : 0;

  const conversionRateImpactPercentage =
    baselineFinalMonthData.conversionRate > 0
      ? (
          ((finalMonthData.conversionRate -
            baselineFinalMonthData.conversionRate) /
            baselineFinalMonthData.conversionRate) *
          100
        ).toFixed(1)
      : 0;

  // Get grid container style based on screen size
  const gridContainerStyle = isMediumScreen
    ? styles.gridContainerMedium
    : styles.gridContainer;
  const initiativesGridStyle = isMediumScreen
    ? styles.initiativesGridMedium
    : styles.initiativesGrid;

  // Format conversion rate as percentage
  const formatConversionRate = rate => `${(rate * 100).toFixed(1)}%`;

  return (
    <div style={styles.container}>
      <div style={gridContainerStyle}>
        {/* Base Assumptions Panel */}
        <div style={{ ...styles.panel, ...styles.assumptionsPanel }}>
          <h2 style={{ ...styles.panelTitle, ...styles.assumptionsPanelTitle }}>
            Starting Numbers
          </h2>
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Paid Users</label>
              <input
                type="number"
                min="0"
                value={baseAssumptions.initialPaidUsers}
                onChange={e =>
                  handleAssumptionChange('initialPaidUsers', e.target.value)
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Monthly Passive Income per User ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={baseAssumptions.passiveIncomePerUser}
                onChange={e =>
                  handleAssumptionChange('passiveIncomePerUser', e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Controllable Variables Panel */}
        <div style={{ ...styles.panel, ...styles.controlPanel }}>
          <h2 style={{ ...styles.panelTitle, ...styles.controlPanelTitle }}>
            Monthly Numbers
          </h2>
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>New Trial Users per Month</label>
              <input
                type="number"
                min="0"
                step="1"
                value={controlVars.newTrialUsersPerMonth}
                onChange={e =>
                  handleControlVarChange(
                    'newTrialUsersPerMonth',
                    e.target.value,
                  )
                }
                style={styles.input}
              />
              {variableImpacts.trialUsersBoost > 0 && (
                <div style={styles.impactArrow}>
                  +{variableImpacts.trialUsersBoost} ↑
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Trial Conversion Rate</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={controlVars.trialConversionRate}
                onChange={e =>
                  handleControlVarChange('trialConversionRate', e.target.value)
                }
                style={styles.input}
              />
              {variableImpacts.conversionRateBoost > 0 && (
                <div style={styles.impactArrow}>
                  +{(variableImpacts.conversionRateBoost * 100).toFixed(1)}% ↑
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Meeting Price ($)</label>
              <input
                type="number"
                min="0"
                value={controlVars.meetingPrice}
                onChange={e =>
                  handleControlVarChange('meetingPrice', e.target.value)
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Meetings per Month per User</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={controlVars.meetingsPerMonth}
                onChange={e =>
                  handleControlVarChange('meetingsPerMonth', e.target.value)
                }
                style={styles.input}
              />
              {variableImpacts.meetingsBoost > 0 && (
                <div style={styles.impactArrow}>
                  +{variableImpacts.meetingsBoost} ↑
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Panel */}
        <div style={{ ...styles.panel, ...styles.resultsPanel }}>
          <h2 style={{ ...styles.panelTitle, ...styles.resultsPanelTitle }}>
            Projected Numbers
          </h2>
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Period</label>
              <select
                value={projectionMonths}
                onChange={e => setProjectionMonths(parseInt(e.target.value))}
                style={styles.select}
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>
            <div style={styles.metricsContainer}>
              <div style={styles.metricLabel}>Projected Monthly Revenue:</div>
              <div style={{ ...styles.metricValue, ...styles.projectedValue }}>
                $
                {finalMonthData.totalRevenue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                <span style={styles.impactBadge}>
                  +{revenueImpactPercentage}%
                </span>
              </div>
            </div>
            <div style={styles.metricsContainer}>
              <div style={styles.metricLabel}>Projected Total Paid Users:</div>
              <div style={{ ...styles.metricValue, ...styles.projectedValue }}>
                {finalMonthData.paidUsers.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
                <span style={styles.impactBadge}>+{userImpactPercentage}%</span>
              </div>
            </div>
            {/*
            <div style={styles.metricsContainer}>
              <div style={styles.metricLabel}>Conversion Rate:</div>
              <div style={{...styles.metricValue, ...styles.projectedValue}}>
                {formatConversionRate(finalMonthData.conversionRate)}
                <span style={styles.impactBadge}>+{conversionRateImpactPercentage}%</span>
              </div>
            </div>
*/}
          </div>
        </div>

        {/* Revenue Chart - Stacked Bar Chart */}
        <div style={{ ...styles.panel, ...styles.resultsPanel }}>
          <h2 style={{ ...styles.panelTitle, ...styles.resultsPanelTitle }}>
            Monthly Revenue
          </h2>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectionData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={value => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="passiveRevenue"
                  name="Passive Revenue"
                  stackId="a"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="activeRevenue"
                  name="Meeting Revenue"
                  stackId="a"
                  fill="#82ca9d"
                />
                <Line
                  type="monotone"
                  dataKey="baselineRevenue"
                  name="Baseline Revenue"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intervention Toggles */}
      <div style={styles.chartContainerEnd}>
        <h2 style={styles.chartTitleFixed}>
          Growth Initiatives (UNDER CONSTRUCTION)
        </h2>
        <div style={styles.initiativesContainer}>
          <div style={initiativesGridStyle}>
            {suggestions.map(suggestion => (
              <div
                key={suggestion.id}
                style={{
                  ...styles.initiativeCard,
                  ...(suggestion.active ? styles.initiativeCardActive : {}),
                }}
              >
                <div style={styles.initiativeHeader}>
                  <div style={styles.initiativeContent}>
                    <h3 style={styles.initiativeTitle}>{suggestion.name}</h3>
                    <p style={styles.initiativeDescription}>
                      {suggestion.description}
                    </p>
                    <div style={styles.effectsContainer}>
                      {suggestion.effect.trialUsersBoost > 0 && (
                        <span style={styles.effect}>
                          +{suggestion.effect.trialUsersBoost} Trial Users/mo
                        </span>
                      )}
                      {suggestion.effect.conversionRateBoost > 0 && (
                        <span style={styles.effect}>
                          +
                          {(
                            suggestion.effect.conversionRateBoost * 100
                          ).toFixed(1)}
                          % Conversion
                        </span>
                      )}
                      {suggestion.effect.meetingsBoost > 0 && (
                        <span style={styles.effect}>
                          +{suggestion.effect.meetingsBoost} Meetings/mo
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={styles.buttonContainer}>
                    <button
                      onClick={() => toggleSuggestion(suggestion.id)}
                      style={{
                        ...styles.button,
                        ...(suggestion.active
                          ? styles.activeButton
                          : styles.inactiveButton),
                      }}
                      onMouseOver={e => {
                        e.target.style.backgroundColor = suggestion.active
                          ? '#c7d2fe'
                          : '#d1d5db';
                      }}
                      onMouseOut={e => {
                        e.target.style.backgroundColor = suggestion.active
                          ? '#e0e7ff'
                          : '#e5e7eb';
                      }}
                    >
                      {suggestion.active ? 'Active' : 'Activate'}
                    </button>
                  </div>
                </div>
                {suggestion.links.map(link => (
                  <div style={{ marginTop: 10 }}>
                    <Link variant="external" linkColor="purple" to={link.url}>
                      {link.title}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
