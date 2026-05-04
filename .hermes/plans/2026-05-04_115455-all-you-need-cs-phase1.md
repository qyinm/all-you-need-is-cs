# all-you-need-cs — Phase 1: 자료구조 & 알고리즘 시각화 페이지

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 컴퓨터 사이언스의 자료구조와 알고리즘을 시각적/인터랙티브하게 이해할 수 있는 싱글 페이지 웹앱을 만든다.

**Architecture:** Next.js + React 기반의 SPA. 각 자료구조/알고리즘은 전용 인터랙티브 컴포넌트로 구현되며, p5.js로 동작을 애니메이션화한다. 전체 개요는 마인드맵/로드맵 다이어그램으로 상단에 배치하고, 하단에 각 토픽의 상세 시각화가 이어진다.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, p5.js (canvas 인터랙티브), Framer Motion (전환 효과)

---

## Phase 1 Scope: 자료구조 & 알고리즘

### 자료구조 (Data Structures)
- Array / Dynamic Array
- Linked List (Singly, Doubly)
- Stack & Queue
- Hash Table
- Tree (Binary Tree, BST, AVL, Red-Black)
- Heap (Min/Max Heap)
- Graph (Adjacency List/Matrix)
- Trie

### 알고리즘 (Algorithms)
- Sorting: Bubble, Selection, Insertion, Merge, Quick, Heap
- Searching: Linear, Binary
- Graph: BFS, DFS, Dijkstra, A*
- Dynamic Programming: Knapsack, LCS
- Recursion & Backtracking: N-Queens, Maze

---

## Task Plan

### Task 1: 프로젝트 초기화 및 설정

**Objective:** Next.js 프로젝트를 생성하고 필요한 의존성을 설치한다.

**Files:**
- 전체 프로젝트 디렉토리 구조 생성
- `package.json` (next, react, typescript, tailwind, p5, framer-motion)

**Steps:**
1. `npx create-next-app@latest all-you-need-cs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` 실행
2. `npm install p5 @types/p5 framer-motion`
3. 프로젝트가 정상적으로 `npm run dev` 되는지 확인
4. 커밋

---

### Task 2: 전체 레이아웃 및 네비게이션 구조

**Objective:** 페이지의 기본 레이아웃 — 상단 히어로, 토픽 마인드맵/로드맵, 하단 상세 섹션 구조를 만든다.

**Files:**
- `src/app/layout.tsx` — 메타데이터, 폰트, 글로벌 스타일
- `src/app/page.tsx` — 메인 페이지 구조
- `src/components/layout/Hero.tsx` — 상단 히어로 섹션
- `src/components/layout/TopicRoadmap.tsx` — CS 토픽 마인드맵 (SVG/Canvas 기반)
- `src/components/layout/TopicSection.tsx` — 개별 토픽 섹션 래퍼

**Steps:**
1. 레이아웃에 Pretendard 또는 Inter 폰트 적용
2. 다크 테마 기반 디자인 (코드 에디터 느낌)
3. Hero 섹션: "All You Need is CS" 타이틀 + 부제목
4. TopicRoadmap: CS 지도 형태의 SVG 다이어그램 (Phase 1에 해당하는 자료구조/알고리즘 노드들)
5. 아래로 스크롤하면 각 토픽의 상세 시각화 섹션
6. 커밋

---

### Task 3: P5.js 인터랙티브 컴포넌트 래퍼

**Objective:** React에서 p5.js 스케치를 쉽게 임베드할 수 있는 재사용 가능한 래퍼 컴포넌트를 만든다.

**Files:**
- `src/components/viz/P5Wrapper.tsx`

**Steps:**
1. p5.js instance mode로 동작하는 React 컴포넌트 작성
2. `createCanvas` 사이즈를 컨테이너에 반응형으로 조정
3. `useEffect`로 마운트/언마운트 관리
4. props로 sketch 함수, config, controls 전달 가능하게
5. 커밋

---

### Task 4: Array & Sorting 시각화

**Objective:** 배열 자료구조와 주요 정렬 알고리즘을 시각화한다.

**Files:**
- `src/components/viz/ArrayViz.tsx` — 배열 추상화
- `src/components/viz/SortingViz.tsx` — 정렬 알고리즘 시각화 (Bubble, Merge, Quick)

**Steps:**
1. ArrayViz: 막대 그래프 형태로 배열 요소 표현, 삽입/삭제/접근 애니메이션
2. SortingViz: 정렬 과정을 단계별로 애니메이션, 알고리즘 선택 드롭다운
3. Play/Pause/Step 컨트롤
4. 비교/스왑 하이라이트
5. 커밋

---

### Task 5: Linked List 시각화

**Objective:** 단일/이중 연결 리스트의 노드 삽입, 삭제, 탐색을 시각화한다.

**Files:**
- `src/components/viz/LinkedListViz.tsx`

**Steps:**
1. 노드를 화살표로 연결된 원형으로 표현
2. head에서부터 순차 탐색 애니메이션
3. 삽입/삭제 시 포인터 재조정 과정을 단계별로 보여줌
4. Singly / Doubly 전환 가능
5. 커밋

---

### Task 6: Stack & Queue 시각화

**Objective:** 스택(LIFO)과 큐(FIFO)의 push/pop, enqueue/dequeue 동작을 시각화한다.

**Files:**
- `src/components/viz/StackViz.tsx`
- `src/components/viz/QueueViz.tsx`

**Steps:**
1. Stack: 수직 구조, push/pop 애니메이션, top 표시
2. Queue: 수평 구조, enqueue/dequeue 애니메이션, front/rear 표시
3. 양쪽 모두 step-by-step 모드 지원
4. 커밋

---

### Task 7: Hash Table 시각화

**Objective:** 해시 테이블의 삽입, 충돌 해결(체이닝/오픈 어드레싱), 검색을 시각화한다.

**Files:**
- `src/components/viz/HashTableViz.tsx`

**Steps:**
1. 버킷 배열 + 해시 함수 시각화
2. 키 입력 → 해시 계산 → 버킷 매핑 과정 애니메이션
3. Chaining: 버킷 내 연결 리스트 표시
4. 충돌 발생 시 하이라이트
5. 커밋

---

### Task 8: Tree (Binary Tree, BST) 시각화

**Objective:** 이진 트리와 BST의 구조, 삽입, 삭제, 순회를 시각화한다.

**Files:**
- `src/components/viz/TreeViz.tsx`
- `src/components/viz/BSTViz.tsx`

**Steps:**
1. 노드-간선 트리 레이아웃 (재귀적 좌표 계산)
2. BST 삽입: 루트부터 비교하며 내려가는 애니메이션
3. 순회: Preorder/Inorder/Postorder 방문 순서 애니메이션
4. 노드 삭제 케이스별 시각화 (리프, 자식1, 자식2)
5. 커밋

---

### Task 9: Heap 시각화

**Objective:** Min/Max Heap의 삽입(bubble-up)과 삭제(bubble-down) 과정을 시각화한다.

**Files:**
- `src/components/viz/HeapViz.tsx`

**Steps:**
1. 완전 이진 트리 형태로 힙 표현
2. Insert: 마지막 위치에 추가 후 bubble-up 애니메이션
3. Extract: 루트 제거 후 마지막 요소를 루트로 → bubble-down
4. Min/Max Heap 전환
5. 커밋

---

### Task 10: Graph BFS/DFS 시각화

**Objective:** 그래프의 BFS와 DFS 탐색 과정을 시각화한다.

**Files:**
- `src/components/viz/GraphViz.tsx`

**Steps:**
1. 노드-간선 그래프 레이아웃 (force-directed 또는 사용자 배치)
2. 시작 노드 선택 → BFS/DFS 탐색 애니메이션
3. 방문 노드 하이라이트, 큐/스택 상태 표시
4. Dijkstra로 확장 가능한 구조
5. 커밋

---

### Task 11: Dynamic Programming & Recursion 시각화

**Objective:** 피보나치(메모이제이션), Knapsack, N-Queens 백트래킹을 재귀 트리로 시각화한다.

**Files:**
- `src/components/viz/DPViz.tsx`
- `src/components/viz/BacktrackingViz.tsx`

**Steps:**
1. DPViz: 재귀 호출 트리 + 메모이제이션 테이블
2. BacktrackingViz: N-Queens 보드 + 배치/철회 애니메이션
3. Maze solver (DFS backtracking) 포함
4. 커밋

---

### Task 12: 토픽 로드맵 완성 및 전체 연결

**Objective:** TopicRoadmap을 클릭 가능한 네비게이션 맵으로 완성하고, 각 토픽 섹션으로 스크롤 이동.

**Files:**
- `src/components/layout/TopicRoadmap.tsx` 업데이트

**Steps:**
1. 각 토픽 노드 클릭 시 해당 섹션으로 smooth scroll
2. 현재 보고 있는 섹션 하이라이트 (Intersection Observer)
3. Phase 2, 3 placeholder 노드 추가 (OS, Network, DB, ML 등 — 비활성화 상태)
4. 커밋

---

### Task 13: 반응형 디자인 및 성능 최적화

**Objective:** 모바일/태블릿 대응, 번들 최적화, 메타태그 완성.

**Files:**
- CSS/스타일 파일들
- `src/app/layout.tsx`

**Steps:**
1. 모바일 레이아웃: 로드맵은 가로 스크롤, 시각화는 세로 스택
2. p5.js 스케치 지연 로딩 (Intersection Observer로 뷰포트 진입 시 초기화)
3. SEO 메타태그, OG 이미지
4. `next build` 정상 확인
5. 커밋

---

## 이후 Phase (계획만)

- **Phase 2:** OS (프로세스 스케줄링, 메모리 관리, 파일시스템), Network (TCP/IP, HTTP, DNS), Database (인덱싱, 트랜잭션), Compiler (렉싱, 파싱, AST)
- **Phase 3:** CS 논문 — 주간/월간 한 편씩 시각화 + 인터랙티브 구현 (MapReduce, Paxos, Bitcoin, Transformer, Attention Is All You Need 등)

---

## Verification

- `npm run dev` → 로컬에서 모든 시각화가 정상 동작
- `npm run build` → 프로덕션 빌드 성공
- 모바일/데스크톱 반응형 확인
- 각 시각화 Play/Pause/Step 컨트롤 정상