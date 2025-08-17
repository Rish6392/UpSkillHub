import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate better colors for the chart
  const getChartColors = (numColors) => {
    const colors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
      "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF",
      "#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"
    ]
    return colors.slice(0, numColors)
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName || "Untitled Course"),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getChartColors(courses.length),
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName || "Untitled Course"),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getChartColors(courses.length),
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          color: '#FFFFFF',
          font: {
            size: 12
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto h-80 w-80">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}