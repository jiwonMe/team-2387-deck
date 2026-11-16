import { BarChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

const DATA = [
  { unit: '조건변형', p: 92 },
  { unit: '수열 추론', p: 81 },
  { unit: '이차함수', p: 64 },
  { unit: '확률', p: 48 },
];

export default function PrioChart() {
  const theme = useDeckTheme();
  return (
    <ThemeProvider theme={theme} locale="ko-KR">
      <div className="ztd">
        <BarChart
          data={DATA}
          x="unit"
          y="p"
          orientation="horizontal"
          height={210}
          highlight="조건변형"
          locale="ko-KR"
        />
      </div>
    </ThemeProvider>
  );
}
