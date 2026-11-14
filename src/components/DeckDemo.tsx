import { useEffect, useRef, useState } from 'react';
import { SegmentedBar, BarChart, GaugeChart, ThemeProvider } from 'ztd-charts';
import { useDeckTheme } from './useDeckTheme';

/* ── 목업 데이터 (발표용 가정) ───────────────────────────── */

/** 작년 기말 22문항을 역추적한 출처 구성 */
const RECIPE = [
  { src: '부교재 숫자변형', n: 9, pct: 41, note: '올림포스 고난도 · 계수만 교체' },
  { src: '부교재 조건추가', n: 5, pct: 23, note: '"실수 조건" 추가 후 판별' },
  { src: '학평 킬러 차용', n: 4, pct: 18, note: '9월 학평 29·30번 변형' },
  { src: '교과서 변형', n: 4, pct: 18, note: '개념 확인 → 서술형 2문항' },
];

const QUESTIONS = [
  { n: '01', t: '다항식의 연산', d: '상', tag: '숫자변형', gen: true },
  { n: '02', t: '나머지정리 응용', d: '중', tag: '검수', gen: false },
  { n: '03', t: '인수분해 · 실수조건', d: '상', tag: '조건추가', gen: true },
  { n: '04', t: '이차방정식 근의 판별', d: '중', tag: '검수', gen: false },
  { n: '05', t: '학평 변형 유형', d: '상', tag: '학평차용', gen: true },
];

const HITS = [
  { name: '다항식', v: 92 },
  { name: '나머지정리', v: 85 },
  { name: '이차방정식', v: 64 },
  { name: '도형', v: 22 },
];

/* ── 공통 조각 ──────────────────────────────────────────── */

function Badge({
  children,
  tone = 'plain',
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'accent' | 'solid';
}) {
  const toneCls =
    tone === 'accent'
      ? 'text-accent border-accent/40 bg-accent/10'
      : tone === 'solid'
        ? 'bg-fg text-bg border-fg'
        : 'text-fg2 border-line';
  return (
    <span
      className={`rounded border px-2 py-[3px] font-mono text-[9.5px] tracking-[0.06em] ${toneCls}`}
    >
      {children}
    </span>
  );
}

function PaneHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <span className="text-[14px] font-semibold">{title}</span>
      {children}
    </div>
  );
}

function Foot({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 font-mono text-[10.5px] leading-[1.7] text-fg3">{children}</p>;
}

/* ── ① 부교재 선택 + 기출 촬영 ──────────────────────────── */

function Upload() {
  return (
    <>
      <PaneHead title="부교재는 고르고, 기출만 찍습니다">
        <Badge tone="accent">분석 후 즉시 파기</Badge>
        <Badge>본문 미저장</Badge>
      </PaneHead>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-[6px] border border-line bg-bg p-3.5">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-fg3">
            Step 1 · 카탈로그
          </div>
          <div className="mb-1 text-[12.5px] font-semibold leading-[1.4]">부교재 선택</div>
          <div className="mb-3 font-mono text-[10.5px] text-fg3">시중 20종 · 태깅 완료</div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="accent">올림포스</Badge>
            <Badge>마플시너지</Badge>
            <Badge>쎈</Badge>
            <Badge>+17</Badge>
          </div>
        </div>

        <div className="rounded-[6px] border border-line bg-bg p-3.5">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-fg3">
            Step 2 · 촬영
          </div>
          <div className="mb-1 text-[12.5px] font-semibold leading-[1.4]">학교 기출·프린트</div>
          <div className="mb-3 font-mono text-[10.5px] text-fg3">2024 1학기 기말 · 22문항</div>
          <div className="h-[2px] overflow-hidden rounded bg-line2">
            <i className="block h-full w-[72%] bg-accent" />
          </div>
        </div>
      </div>

      <Foot>
        학생이 42쪽 PDF를 올리지 않습니다. 교재는 이미 태깅되어 있고, 서버에 들어오는 건 학교 고유 자료뿐입니다.
      </Foot>
    </>
  );
}

/* ── ② 출처 역추적 리포트 ───────────────────────────────── */

function Trace() {
  return (
    <>
      <PaneHead title="작년 22문항은 어디서 나왔나">
        <Badge tone="solid">핵심 화면</Badge>
        <Badge>2024 1학기 기말 기준</Badge>
      </PaneHead>

      <SegmentedBar
        data={RECIPE.map((r) => ({ src: r.src, n: r.n }))}
        label="src"
        value="n"
        height={100}
        locale="ko-KR"
      />

      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {RECIPE.map((r) => (
          <div key={r.src} className="flex items-baseline gap-2 text-[11px]">
            <span className="font-mono text-[9.5px] text-fg3">{r.n}문항</span>
            <span className="text-fg2">{r.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[6px] border border-line2 bg-bg p-3">
        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-fg3">
          Match sample — 원문 → 조건 추가 → 생성
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <div className="text-[11px] text-fg2">올림포스 p.42 #14</div>
            <div className="font-mono text-[10px] text-fg3">x³−6x²+11x−6 = 0</div>
          </div>
          <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-[2px] font-mono text-[9px] text-accent">
            + k&gt;0
          </span>
          <div>
            <div className="text-[11px] text-fg2">생성 #03 · 조건추가</div>
            <div className="font-mono text-[10px] text-fg3">서술형 2문항으로 확장</div>
          </div>
        </div>
      </div>

      <Foot>
        이 학교는 <b className="font-semibold text-fg">숫자변형 41% + 조건추가 23%</b>. 즉 올림포스 고난도 문항을
        숫자만 바꾸거나 실수 조건을 더해 냅니다. — 올해 범위에 같은 레시피를 적용합니다.
      </Foot>
    </>
  );
}

/* ── ③ 문항 세트 ────────────────────────────────────────── */

function QuestionSet() {
  return (
    <>
      <PaneHead title="생성 문항 + 검수 문항">
        <Badge tone="accent">생성 60%</Badge>
        <Badge>검수 40%</Badge>
        <Badge>3단 검증 통과분</Badge>
      </PaneHead>
      <div className="flex flex-col gap-2">
        {QUESTIONS.map((q) => (
          <div
            key={q.n}
            className="grid grid-cols-[24px_1fr_auto_auto] items-center gap-3 rounded-[6px] border border-line2 bg-bg px-3.5 py-2.5"
          >
            <span className="font-mono text-[10px] text-fg3">{q.n}</span>
            <span className="text-[12.5px]">
              {q.t} <span className="text-fg3">· {q.d}</span>
            </span>
            <Badge tone={q.gen ? 'accent' : 'plain'}>{q.tag}</Badge>
            <span className="font-mono text-[9.5px] text-accent">✓ 검증</span>
          </div>
        ))}
      </div>
      <Foot>
        생성 문항에는 <b className="font-semibold text-fg">어떤 변형을 적용했는지 태그</b>가 붙습니다. 학생은 왜 이
        문항이 나왔는지 알고, 우리는 탈락률을 지표로 관리합니다.
      </Foot>
    </>
  );
}

/* ── ④ 오답 → 해설 ─────────────────────────────────────── */

function Solve() {
  const opts = [
    { t: '(x−1)(x−2)(x−4)', s: '' },
    { t: '(x−1)(x−3)(x−3)', s: 'wrong' },
    { t: '(x−1)(x−2)(x−3)', s: 'right' },
    { t: '(x−2)(x−2)(x−3)', s: '' },
  ];
  const steps = [
    '상수항 −6의 약수 중 하나를 대입해 근을 찾습니다. x=1에서 0.',
    '(x−1)로 나누면 x²−5x+6. 여기서 끊지 않는 것이 이 유형의 포인트.',
    'x²−5x+6 = (x−2)(x−3). 최종 (x−1)(x−2)(x−3).',
  ];
  return (
    <>
      <PaneHead title="틀린 문항에서 바로 해설로">
        <Badge>03번 · 조건추가</Badge>
      </PaneHead>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[6px] border border-line2 bg-bg p-4">
          <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-fg3">
            Question
          </div>
          <div className="mb-3 text-[12.5px] leading-[1.75]">
            x³ − 6x² + 11x − 6 을 인수분해하면?
          </div>
          <div className="flex flex-col gap-[5px]">
            {opts.map((o, i) => (
              <div
                key={o.t}
                className={`rounded border px-2.5 py-[7px] text-[11.5px] ${
                  o.s === 'wrong'
                    ? 'border-danger/35 bg-danger/10 text-fg2'
                    : o.s === 'right'
                      ? 'border-accent/45 bg-accent/10 text-fg'
                      : 'border-transparent text-fg2'
                }`}
              >
                {'①②③④'[i]} {o.t}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[6px] border border-line2 bg-bg p-4">
          <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-fg3">
            Explanation · 판서 해설
          </div>
          <div className="flex flex-col gap-2.5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-[18px_1fr] gap-2.5 text-[11.5px] leading-[1.65] text-fg2"
              >
                <i className="pt-[2px] font-mono text-[9px] not-italic text-accent">
                  {String(i + 1).padStart(2, '0')}
                </i>
                <div>{s}</div>
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <Badge tone="accent">취약: 인수분해</Badge>
            <Badge>유사 3문항</Badge>
            <Badge>이전 학기 오답 2건</Badge>
          </div>
        </div>
      </div>
      <Foot>
        해설은 개념 단위로 연결됩니다. 틀린 문항 → 취약 단원 → 유사 문항의 루프가 닫힙니다.
      </Foot>
    </>
  );
}

/* ── ⑤ 적중 리포트 ─────────────────────────────────────── */

function Hit() {
  return (
    <>
      <PaneHead title="시험 후, 실제로 맞았는지">
        <Badge tone="solid">2024 1학기 기말</Badge>
        <Badge tone="accent">적중 78%</Badge>
      </PaneHead>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <GaugeChart
          data={[{ label: '적중률', value: 78, target: 90 }]}
          valueKey="value"
          targetKey="target"
          height={190}
          locale="ko-KR"
        />
        <BarChart
          data={HITS}
          x="name"
          y="v"
          orientation="horizontal"
          height={190}
          locale="ko-KR"
        />
      </div>

      <Foot>
        다음 학기 조정 — 변형 레시피를 갱신하고 부교재 비중을 +1단계. 이 숫자가 다음 학기 재결제와 정원 해제를
        결정합니다.
      </Foot>
    </>
  );
}

/* ── 데모 셸 ────────────────────────────────────────────── */

const TABS = ['부교재 선택', '출처 역추적', '문항 세트', '오답 → 해설', '적중 리포트'];

const NAV = [
  { n: '01', t: '부교재 선택', d: '고르고, 기출만 촬영' },
  { n: '02', t: '출처 역추적', d: '22문항의 변형 레시피' },
  { n: '03', t: '문항 세트', d: '생성 60 + 검수 40' },
  { n: '04', t: '오답 → 해설', d: '개념 단위로 연결' },
  { n: '05', t: '적중 리포트', d: '실제 출제와 대조' },
];

export default function DeckDemo({ scrolly = false }: { scrolly?: boolean }) {
  const [tab, setTab] = useState(0);
  const theme = useDeckTheme();
  const rootRef = useRef<HTMLDivElement>(null);

  /* 스크롤 모드: 이 섹션 안에서의 진행률을 5단계로 매핑 */
  useEffect(() => {
    if (!scrolly) return;
    const sec = rootRef.current?.closest('.scrolly') as HTMLElement | null;
    if (!sec) return;

    let raf = 0;
    const update = () => {
      const total = sec.offsetHeight - window.innerHeight;
      const top = sec.getBoundingClientRect().top;
      const p = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
      setTab(Math.min(TABS.length - 1, Math.floor(p * TABS.length)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrolly]);

  const select = (i: number) => {
    if (!scrolly) return setTab(i);
    const sec = rootRef.current?.closest('.scrolly') as HTMLElement | null;
    if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * (i / TABS.length) + 2, behavior: 'smooth' });
  };

  return (
    <div ref={rootRef} className="mt-6 overflow-hidden rounded-[6px] border border-line bg-fill">
      {scrolly ? (
        <div className="flex flex-wrap items-stretch border-b border-line">
          {NAV.map((it, i) => {
            const active = tab === i;
            return (
              <button
                key={it.n}
                onClick={() => select(i)}
                aria-current={active ? 'step' : undefined}
                className={`relative flex min-w-0 flex-1 cursor-pointer flex-col gap-[3px] px-3.5 py-3 text-left transition-colors ${
                  i < NAV.length - 1 ? 'border-r border-line2' : ''
                } ${active ? 'bg-bg' : 'hover:bg-fill'}`}
              >
                <span
                  className={`font-mono text-[9.5px] tracking-[0.12em] ${
                    active ? 'text-accent' : 'text-fg3'
                  }`}
                >
                  {it.n}
                </span>
                <span
                  className={`truncate text-[11.5px] ${
                    active ? 'font-semibold text-fg' : 'text-fg3'
                  }`}
                >
                  {it.t}
                </span>
                <span className="mt-[6px] block h-[2px] w-full bg-line2">
                  <i
                    className={`block h-full transition-[width] duration-300 ${
                      i === tab ? 'bg-accent' : i < tab ? 'bg-fg3/45' : ''
                    }`}
                    style={{ width: i <= tab ? '100%' : '0%' }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          role="tablist"
          aria-label="프로토타입 화면"
          className="flex overflow-x-auto border-b border-line"
        >
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              onClick={() => select(i)}
              className={`cursor-pointer whitespace-nowrap border-r border-line2 px-4 py-[13px] font-mono text-[11px] tracking-[0.03em] transition-colors ${
                tab === i
                  ? 'border-b-accent bg-bg font-medium text-fg'
                  : 'border-b-transparent text-fg3 hover:bg-fill hover:text-fg2'
              }`}
            >
              {i + 1}. {t}
            </button>
          ))}
        </div>
      )}

      <ThemeProvider theme={theme} locale="ko-KR">
        <div className="ztd demo-stage p-5" data-step={tab}>
          <div key={tab} className="demo-pane">
            {tab === 0 && <Upload />}
            {tab === 1 && <Trace />}
            {tab === 2 && <QuestionSet />}
            {tab === 3 && <Solve />}
            {tab === 4 && <Hit />}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
