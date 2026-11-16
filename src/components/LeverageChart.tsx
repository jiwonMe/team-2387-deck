import { LineChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

const ROWS = [
  { academies: 100, margin: 18 },
  { academies: 300, margin: 34 },
  { academies: 600, margin: 48 },
  { academies: 900, margin: 58 },
];

export default function LeverageChart() {
  const theme = useDeckTheme();
  return (
    <ThemeProvider theme={theme} locale="ko-KR">
      <div className="ztd">
        <LineChart
          data={ROWS}
          x="academies"
          y="margin"
          height={210}
          format="percent"
          showLabels
          locale="ko-KR"
        />
      </div>
    </ThemeProvider>
  );
}
