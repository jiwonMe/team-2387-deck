# TEAM 2387 발표 사이트 — Astro 프레임워크

`cs.yeolyi.com` 과 같은 스택으로 만든 **발표 전용 정적 사이트**입니다.

| 계층 | 선택 | 이유 |
| :--- | :--- | :--- |
| 프레임워크 | **Astro 7** (정적 생성) | 발표장에서 서버·DB 없이 뜨고, 빌드 산출물이 그대로 CDN에 올라감 |
| 인터랙션 | **React 19 아일랜드** (`client:load`) | 데모 위젯 1개만 하이드레이션. 나머지는 0KB JS |
| 스타일 | **Tailwind CSS v4** (`@theme inline`) | 토큰을 유틸리티로 노출 (`bg-fg`, `border-line2`) |
| 호스팅 | **Vercel** | `vercel --prod` 한 줄 |
| 테마 | `data-theme` + 인라인 스크립트 | 새로고침 시 깜빡임 없음, 인쇄 대응 |

## 실행

```bash
cd web
npm install      # 최초 1회
npm run dev      # http://localhost:4321
npm run build    # dist/ 생성
```

## 구조

```
web/
├── astro.config.mjs        # react + tailwind vite 플러그인
├── src/
│   ├── styles/global.css   # 디자인 토큰 + 컴포넌트 클래스 (여기가 디자인 시스템)
│   ├── layouts/Deck.astro  # 크롬(헤더·푸터)·목차·키보드·테마 스크립트
│   ├── components/
│   │   ├── Slide.astro     # <section class="slide"> 래퍼
│   │   └── DeckDemo.tsx    # 5화면 데모 (React 아일랜드, 유일한 클라이언트 JS)
│   └── pages/index.astro   # 11장 슬라이드 본문
└── dist/                   # 빌드 결과 (git 제외)
```

## 슬라이드 추가하기

`pages/index.astro` 에 블록을 하나 더 넣고 `TOTAL` 을 올리면 끝입니다. 목차·진행바·카운터는 자동입니다.

```astro
<Slide id="s12" title="부록">
  <div class="kicker">11<span class="sep">/</span>부록</div>
  <h2 class="h2">제목</h2>
  <p class="sub">설명</p>
</Slide>
```

## 디자인 토큰

`global.css` 상단의 CSS 변수만 바꾸면 전체 톤이 바뀝니다.
`--accent` 하나로 강조가 전부 움직입니다.

| 토큰 | 역할 |
| :--- | :--- |
| `--bg` `--fg` `--fg2` `--fg3` | 배경 / 본문 / 보조 / 흐린 글자 |
| `--line` `--line2` | 구분선(진함 / 흐림) |
| `--accent` | 강조 1색 — **#FF4D00** (다크에서 #FF5C14). 숫자·키커·막대·차트에만 |
| `--fill` `--fill2` | 카드 면 |
| `--r` `--maxw` | 라운드 / 본문 폭 |

## 데모 데이터 교체

`components/DeckDemo.tsx` 상단의 `HEAT`(비교 히트맵), `QUESTIONS`(문항 세트), `HITS`(적중) 배열만 고치면 됩니다.
목업 학교를 실제 학교로 바꿀 때는 `Compare()` 의 단원 이름과 퍼센트를 실제 조사값으로 넣으세요.

## 배포

```bash
cd web
npx vercel deploy --prod
```

Git 연동 시 Vercel 프로젝트의 **Root Directory 를 `web`** 으로 지정하세요. Framework Preset 은 Astro 자동 감지됩니다.

## 아직 없는 것 (의도적)

- 분석/트래픽 수집 — 발표용이라 불필요
- i18n — 한국어 단일
- 콘텐츠 컬렉션 — 슬라이드가 11장이라 마크다운화 이득 없음

> `presentation/index.html` 은 이 프레임워크 이전에 만든 단일 파일 버전입니다. 내용이 같으므로 지워도 됩니다.

## Anatomy (좌측 배경 그림)

`src/components/AnatomyFigure.astro` — 아이템을 **아이소메트릭 기계 도면**으로 그린 샘플입니다.

```
AUX / EXAM / MOCK  →  레일  →  ENGINE  →  GEN / SET
```

세 입력이 하나의 엔진을 거쳐 두 출력이 되는 구조를 그대로 그림으로 옮겼습니다.
`<figure class="anatomy" aria-hidden="true">` 로 들어가며, 스타일은 `global.css` 의 `.anatomy` 블록입니다.

| 속성 | 값 | 의미 |
| :--- | :--- | :--- |
| `position` | `fixed`, `left:-3vw`, `bottom:-4vh` | 화면 좌하단 고정, 살짝 잘라서 |
| `width` | `calc(var(--rail) * 1.36)` (≈ `--rail`×1.36) | 레일 폭에 비례 |
| `mask-image` | `linear-gradient(112deg, …92%)` | 오른쪽으로 페이드 → 본문 침범 방지 |
| `z-index` | `0` (`#deck` 는 `1`) | 항상 본문 뒤 |

### 본문은 왼쪽 레일을 비워두고 우측에 놓입니다

`.slide` 가 2단 그리드입니다.

```css
.slide { grid-template-columns: var(--rail) minmax(0, 1fr); }  /* --rail: clamp(300px, 34vw, 520px) */
.slide > .inner { grid-column: 2; max-width: var(--maxw); }     /* --maxw: 1000px */
```

- 1440×900 기준: 도면 666×471px(좌하단), 본문 x=583부터 폭 799px
- 1180px 이하: 1단으로 접히고 도면은 숨김, 본문은 가운데 정렬

- **1180px 이하**와 **인쇄**에서는 자동으로 숨김
- `pointer-events:none`, `aria-hidden` — 클릭·낭독기 영향 없음
- 색은 `currentColor`(`--fg2`)만 사용해서 라이트/다크 테마를 그대로 따라감

수치를 바꾸려면 라벨(`AUX`/`EXAM`/`MOCK`/`GEN`/`SET`)과 기하 좌표를 SVG 안에서 직접 조정하세요.

## 차트 (ztd-charts)

`npm i ztd-charts` — 순수 SVG React 차트 44종, 런타임 의존성 0, 한국어 로케일 지원.
두 곳에서 씁니다.

| 위치 | 차트 | 파일 |
| :--- | :--- | :--- |
| 05. 프로토타입 ② 비교 리포트 | `Heatmap` (단원 × 출처) | `components/DeckDemo.tsx` |
| 05. 프로토타입 ⑤ 적중 리포트 | `GaugeChart` + `BarChart` | `components/DeckDemo.tsx` |
| 09. 비즈니스 모델 | `WaterfallChart` (학교 손익) | `components/UnitEconomics.tsx` |

### 테마 연결

덱의 `data-theme` 을 그대로 따라갑니다.

- `useDeckTheme()` (`components/useDeckTheme.ts`): `documentElement` 의 `data-theme` 을 `MutationObserver` 로 감시 → `T` 키 토글에 차트도 즉시 반응
- `<ThemeProvider theme={theme} locale="ko-KR">` 로 감싸고, **그 안쪽** div에 `.ztd` 클래스를 준다 (ThemeProvider 가 자체 래퍼에 인라인 변수를 넣기 때문에 바깥에 두면 무시됨)
- `.ztd` 는 `--ztd-accent` 등 토큰을 우리 팔레트로 매핑 (`global.css`). 그래서 차트 강조색이 덱의 `--accent`(틸)와 같아진다

### 차트 수정

```tsx
<Heatmap data={rows} x="source" y="unit" value="pct" height={236} locale="ko-KR" />
<BarChart data={rows} x="name" y="v" orientation="horizontal" height={190} />
<GaugeChart data={[{ label: '적중률', value: 78, target: 90 }]} valueKey="value" targetKey="target" />
<WaterfallChart data={rows} label="item" value="amount" type="kind" />
```

하이라이트는 최상위 prop 입니다 — `highlight="none"`, `highlight="Mobile"` 처럼. (`options.highlight` 는 JSON spec 형식에서만 동작)
모든 차트는 스크린리더용 설명과 데이터 표를 자동으로 넣습니다.

## 13장 구성 (CDD 피드백 반영)

| # | 슬라이드 | 핵심 주장 |
| :--- | :--- | :--- |
| 01 | 표지 | 남들과 같은 문제집은 그만 · THESIS: 학교당 5명 SaaS |
| 02 | 시장 공백 | 모수가 작아서 서비스되지 않는다 (등급 기준 통일: 1등급=상위 10%·18명) |
| 03 | 타이밍·규모 | Bottom-up SAM 260억 + Phase 1/2/3 확장 브릿지(26 → 120 → 300억) |
| 04 | 엔진 | 출제자 변형 레시피 역추적 (+ 레시피 지속성 검증 placeholder) |
| 05 | **백테스팅** | 3개교 실증 — 원천 적중 / 메커니즘 적중 / 교사 블라인드 (placeholder) |
| 06 | 프로토타입 | 5화면 스크롤 구간 + Before/After 매칭 샘플 |
| 07 | 차별점 | 매쓰플랫이 3개월 내 모방하면? (이노베이터 딜레마 + 코호트 파라미터) |
| 08 | 공급망 | 시험 기간 첨두부하 — 사전 생성 70 : JIT 30 |
| 09 | 리스크 | 원본 미보관 + 유사성 필터 + 출판사 레버리지(채택 데이터·정품 인증) |
| 10 | GTM | 1등급 18명 중 Top 5%(8~10명) 정원 · 기출 제보 리워드 → crowd-unlock |
| 11 | 단위 경제성 | 5/10/20명 + **블렌디드 BEP**(폐강 60% 반영) |
| 12 | 해자 | B2C/B2B 문항 풀 이원화 (카니발라이제이션 차단) |
| 13 | 실행 | 마일스톤 · Kill-switch KPI 3개 · Team(placeholder) |

### 채워넣기 표시

`<span class="ph">__%</span>` 처럼 `.ph` / `.ph-block` 클래스로 표시합니다.
점선 + 액센트 배경으로 렌더링되어, 발표 전에 채울 항목이 눈에 띕니다.

```astro
<span class="ph">3곳</span>
<div class="ph-block"><span class="tag-i">검증 필요</span> ... </div>
```

## 스크롤 구간 (5장 프로토타입)

5장은 탭을 눌러야 보이는 게 아니라, **그 자리에 붙어서 스크롤로 5화면이 넘어갑니다.**

```
.slide.scrolly { height: calc(100svh + 4 * 62svh); }   /* 5단계 × 62vh */
.scrolly-sticky { position: sticky; top: 0; height: 100svh; display: grid; ... }
```

- 진행률 `p = -sectionTop / (sectionHeight - viewportHeight)` → `step = floor(p × 5)`
- 단계 헤더(`01~05`)는 진행 표시이자 **클릭하면 그 지점까지 스크롤**하는 목차입니다
- 카드 높이가 단계마다 달라 흔들리지 않도록 `.demo-stage { min-height: 372px }`
- 화살표 키는 **이 구간 안에서만 단계 이동**(`stepScrolly`), 구간을 벗어나면 다음 슬라이드로 갑니다
- 현재 슬라이드 추적은 IntersectionObserver 대신 **스크롤 위치 기반**(`activeIndex()`)입니다 — 높이가 긴 구간도 정확히 잡기 위해

발표 중에는 마우스 휠·트랙패드로 천천히 내리면 5화면이 순서대로 바뀝니다.
