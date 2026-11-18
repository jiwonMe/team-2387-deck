import { LineChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

const ROWS = [
  { academies: 50, margin: 8 },
  { academies: 120, margin: 30 },
  { academies: 250, margin: 42 },
  { academies: 500, margin: 52 },
];

export default function LeverageChart() {
  const theme = useDeckTheme();
  return (
    <ThemeProvider theme={theme} locale="ko-KR">
      <div className="ztd" style={{ paddingRight: 12 }}>
        <LineChart
          data={ROWS}
          x="academies"
          y="margin"
          height={195}
          format="percent"
          dots
          area
          showLabels
          locale="ko-KR"
        />
      </div>
    </ThemeProvider>
  );
}
