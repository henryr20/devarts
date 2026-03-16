import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './ForumStatsChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ForumStatsChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'));

    const unsubscribe = onSnapshot(q, (snap) => {
      const categoryCounts = {};
      snap.docs.forEach((doc) => {
        const data = doc.data();
        const category = data.category || 'General';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);

      // Pre-defined color palette for a premium look
      const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(40, 159, 64, 0.8)',
        'rgba(210, 199, 199, 0.8)',
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Posts',
            data,
            backgroundColor: [
              'rgba(56, 189, 248, 0.85)', // Sky Blue
              'rgba(248, 113, 113, 0.85)', // Soft Red
              'rgba(74, 222, 128, 0.85)', // Emerald Green
              'rgba(250, 204, 21, 0.85)', // Bright Yellow
              'rgba(192, 132, 252, 0.85)', // Purple
              'rgba(251, 146, 60, 0.85)', // Orange
              'rgba(45, 212, 191, 0.85)', // Teal
              'rgba(244, 114, 182, 0.85)', // Pink
            ],
            borderColor: [
              '#0ea5e9',
              '#ef4444',
              '#22c55e',
              '#eab308',
              '#a855f7',
              '#f97316',
              '#14b8a6',
              '#ec4899',
            ],
            borderWidth: 2,
            hoverOffset: 0,
            hoverBorderWidth: 2,
            hoverBackgroundColor: [
              'rgba(56, 189, 248, 1)',
              'rgba(248, 113, 113, 1)',
              'rgba(74, 222, 128, 1)',
              'rgba(250, 204, 21, 1)',
              'rgba(192, 132, 252, 1)',
              'rgba(251, 146, 60, 1)',
              'rgba(45, 212, 191, 1)',
              'rgba(244, 114, 182, 1)',
            ]
          },
        ],
      });
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Error loading stats chart.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="forum-stats-chart loading">Loading analytics dashboard...</div>;
  if (error) return <div className="forum-stats-chart error">{error}</div>;

  return (
    <div className="forum-stats-chart">
      <h3>Topic Distribution</h3>
      {chartData && chartData.labels.length > 0 ? (
        <div className="chart-wrapper">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: window.innerWidth > 768 ? 'right' : 'bottom',
                  labels: {
                    color: '#94a3b8',
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                      family: "'Inter', sans-serif",
                      size: 14,
                      weight: '500'
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  titleFont: { size: 16, weight: 'bold' },
                  bodyFont: { size: 14 },
                  padding: 12,
                  cornerRadius: 8,
                  displayColors: true
                }
              },
              transitions: {
                active: {
                  animation: {
                    duration: 400
                  }
                }
              }
            }}
          />
        </div>
      ) : (
        <div className="forum-stats-chart loading">No community data found yet.</div>
      )}
    </div>
  );
}
