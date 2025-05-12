import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get the canvas context
    const ctx = chartRef.current.getContext("2d");

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.day),
        datasets: [
          {
            label: "Revenue ($)",
            data: data.map((item) => item.revenue),
            backgroundColor: "rgba(234, 179, 8, 0.5)", // Yellow color to match theme
            borderColor: "rgb(234, 179, 8)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 10,
            cornerRadius: 4,
            titleFont: {
              size: 14,
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full h-[40vh]">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default BarChart;
