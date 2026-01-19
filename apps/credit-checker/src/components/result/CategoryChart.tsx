import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategorySummary } from '../../types';
import { categoryColors, getCategoryIcon } from '../../constants/colors';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categories: CategorySummary[];
}

export function CategoryChart({ categories }: CategoryChartProps) {
  // 合計金額を計算
  const totalAmount = categories.reduce((sum, c) => sum + c.totalAmount, 0);

  // 上位7カテゴリ + その他にまとめる
  const displayCategories = categories.slice(0, 7);
  const otherCategories = categories.slice(7);

  if (otherCategories.length > 0) {
    const otherTotal = otherCategories.reduce((sum, c) => sum + c.totalAmount, 0);
    const otherPercentage = otherCategories.reduce((sum, c) => sum + c.percentage, 0);
    displayCategories.push({
      category: 'other',
      label: 'その他',
      totalAmount: otherTotal,
      transactionCount: otherCategories.reduce((sum, c) => sum + c.transactionCount, 0),
      percentage: otherPercentage,
    });
  }

  const chartData = {
    labels: displayCategories.map(c => c.label),
    datasets: [
      {
        data: displayCategories.map(c => c.totalAmount),
        backgroundColor: displayCategories.map(c => categoryColors[c.category] || '#A89F91'),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#3D2C29',
        titleColor: '#FFFCF5',
        bodyColor: '#FFFCF5',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const value = context.raw as number;
            const percentage = displayCategories[context.dataIndex]?.percentage || 0;
            return `${value.toLocaleString()}円 (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-bg-card rounded-softer shadow-warm p-6">
      {/* 大きな円グラフ（中央に合計金額） */}
      <div className="relative mx-auto w-56 h-56 mb-6">
        <Doughnut data={chartData} options={options} />
        {/* 中央に合計金額を表示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-text-sub">合計</span>
          <span className="text-2xl font-bold text-text-main">
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* カテゴリカード一覧 */}
      <div className="space-y-3">
        {displayCategories.map((category) => {
          const Icon = getCategoryIcon(category.category);
          const color = categoryColors[category.category] || '#A89F91';

          return (
            <div
              key={category.category}
              className="bg-bg-base rounded-soft p-4 transition-all hover:shadow-warm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <span className="font-medium text-text-main">{category.label}</span>
                    <span className="text-xs text-text-sub ml-2">
                      {category.transactionCount}件
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text-main">
                    ¥{category.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-sub">
                    {category.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* 割合バー */}
              <div className="percentage-bar">
                <div
                  className="percentage-bar-fill"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
