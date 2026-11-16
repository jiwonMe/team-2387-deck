import { BarChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

const ROWS = [
  { part: 'ARPU', kind: '기본 구독', v: 30 },
  { part: 'ARPU', kind: '학교 추가', v: 15 },
  { part: 'ARPU', kind: '분석 크레딧', v: 5 },
  { part: 'ARPU', kind: '도서 마진', v: 10 },
];

export default function RevenueChart() {
  const theme = useDeckTheme();
  return (
    <ThemeProvider theme={theme} locale="ko-KR">
      <div className="ztd">
        <BarChart
          data={ROWS}
          x="part"
          y="v"
          series="kind"
          height={200}
          orientation="horizontal"
          layout="stacked"
          showLabels
          locale="ko-KR"
        />
      </div>
    </ThemeProvider>
  );
}
