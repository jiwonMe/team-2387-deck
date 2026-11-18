import { BarChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

const ROWS = [
  { part: '월 ARPU', kind: '기본 구독(3개교)', v: 15 },
  { part: '월 ARPU', kind: '학교 추가(3개교)', v: 9 },
  { part: '월 ARPU', kind: '분석 크레딧', v: 3 },
  { part: '월 ARPU', kind: '도서 순마진(가설)', v: 3 },
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
          height={195}
          orientation="horizontal"
          layout="stacked"
          showLabels
          locale="ko-KR"
        />
      </div>
    </ThemeProvider>
  );
}
