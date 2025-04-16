# Final Project Team2 - 파2리

## 프로젝트 소개

### 사용자의 영상 제작에 들이는 시간과 비용을 절감할 수 있도록 도와주는 AI기술을 통한 영상 제작 서비스 플랫폼입니다.

- 입력 된 기사를 기반으로 AI 아나운서의 대사 스크립트 및 템플릿을 제공합니다.
- 사용자의 의도에 따라 직접 대사를 입력하고 템플릿을 선택할 수 있습니다.

## 🚀 프로젝트 시작하기

### 설치

깃허브를 통해 해당 프로젝트를 클론 한 후 npm 설치를 진행해야합니다.

```
git clone https://github.com/FC-DEV2-FinalProject/Charmander_FE.git
npm install
```

### 실행

```bash
$ npm run dev
```

---

## 🌱 팀원 소개

<div style="display: flex; justify-content: space-around; align-items: center;">
 
| <img src="https://avatars.githubusercontent.com/u/176368439?v=4" width="150" height="150"> | <img src="https://avatars.githubusercontent.com/u/127061507?v=4" width="150" height="150"> | <img src="https://avatars.githubusercontent.com/u/121649439?v=4" width="150" height="150">
| :---------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
|                 박찬희<br />[@park-chan-hui](https://github.com/goldegg127)                  |                  차재식<br />[@Chajaesik01](https://github.com/Chajaesik01)                   |                   이경민<br />[@santa-developer](https://github.com/santa-developer)                    
| 공통 컴포넌트 제작 <br /> 프로젝트 에디터 페이지 퍼블리싱 및 개발 | 공통 컴포넌트 제작 <br />  로그인 페이지, 회원가입 페이지 <br /> 마이 페이지 퍼블리싱 및 개발 | 개발 환경 구축, 디자인 토큰 세팅, <br /> 공통 컴포넌트 제작 <br />대시보드 페이지, 영상 보관함 페이지, 내 프로젝트 페이지 퍼블리싱 |
</div>

## 🔧 기술 스택

<div align="center">

|       Type       |                                                                                                               Tool                                                                                                               |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     Library      |       ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)       |
|     Language     |                                                     ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)                                                     |
|     Styling      |                                              ![Styled Components](https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)                                               |
| State Management |                                                                 ![Zustand](https://img.shields.io/badge/🐻%20Zustand-81c147?style=for-the-badge&logoColor=white)                                                                 |
|  Data Fetching   | ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) ![Axios](https://img.shields.io/badge/-Axios-%23000000?style=for-the-badge&logo=axios&logoColor=white) |
|    Formatting    |     ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)     |
| Package Manager  |                                                               ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)                                                                |
| Version Control  |         ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)         |
|  Collaboration   |         ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)          |

</div>

&nbsp;

## 🔗 Routing

"@tanstack/react-router": "^1.112.0" 라이브러리를 활용하여 폴더 구조 기반으로 라우팅을 작성했습니다.

### 장점

_tanstack router의 가장 큰 장점으로는 자동 라우팅 코드 생성과, 강력한 타입 안전성을 들 수 있습니다._ \
_잘못된 경로와 오타로 인한 라우팅 오류를 런타임 및 컴파일 시점에 잡아낼 수 있습니다._ \
_그리고 Link 컴포넌트에서 to 속성을 통한 경로 자동 완성(Intellisense) 기능을 제공합니다._\
_라우팅 파일에 별도의 코드를 작성하지 않아도 생성한 파일의 이름을 기준으로 자동으로 라우팅 코드가 생성됩니다._

### 폴더구조

```bash
ai-vatar-user
├──📂husky
├──📂node_modules
├──📂public
├──📂src
│   ├──📂api
│   │   ├──📂dashboard
│   │   ├──📂login
│   │   ├──📂myPage
│   │   ├──📂project
│   │   ├──📂sign-up
│   │   └──📂video-archive
│   ├──📂assets // 아이콘 및 이미지
│   ├──📂components
│   │   ├──📂common // 공통 컴포넌트
│   │   ├──📂auth
│   │   ├──📂googleLoginButton
│   │   ├──📂kakaoLoginButton
│   │   ├──📂icons
│   │   ├──📂project-editor
│   │   └──📜SideBarUserModal.tsx
│   ├──📂constants // 상수
│   ├──📂hook
│   ├──📂mock
│   │   ├──📂mockData // 목데이터
│   │   ├──📂mockImage // 템플릿 이미지 목데이터
│   │   │   ├──📂avatar
│   │   │   └──📂news
│   │   └──📂msw // msw worker 및 handler
│   ├──📂routes
│   │   ├──📂_projectSideBarLayout
│   │   │  └──📂$project(동적URL 지정) 프로젝트ID
│   │   │     ├──📂article // http://localhost:5173/$project/article
│   │   │     │   └──📜 index.tsx
│   │   │     ├──📂avatar // http://localhost:5173/$project/avatar
│   │   │     ├──📂background // http://localhost:5173/$project/background
│   │   │     ├──📂script // http://localhost:5173/$project/script
│   │   │     └──📂template // http://localhost:5173/$project/template
│   │   ├──📂_sideBarLayout
│   │   │  ├──📂dashboard // http://localhost:5173/dashboard
│   │   │  ├──📂 my-page // http://localhost:5173/my-page
│   │   │  ├──📂 my-project // http://localhost:5173/my-project
│   │   │  └──📂 video-archive // http://localhost:5173/video-archive
│   │   ├──📂auth //회원 관련
│   │   │   ├──📂callback // 소셜 로그인
│   │   │   │   ├──📂google http://localhost:5173/auth/callback/google
│   │   │   │   └──📂kakao  http://localhost:5173/auth/callback/kakao
│   │   │   ├──📂login   // http://localhost:5173/auth/login
│   │   │   ├──📂sign-in   // http://localhost:5173/auth/sign-in
│   │   │   └──📂sign-up
│   │   │       ├──📂finish // http://localhost:5173/auth/sign-up/finish
│   │   │       └──📂sns // http://localhost:5173/auth/sign-up/sns
│   │   ├──📂help // 비밀번호 찾기
│   │   │   └──📂password   // http://localhost:5173/help/password
│   │   ├──📜__root.tsx
│   │   ├──📜_projectSideBarLayout.tsx
│   │   └──📜_sideBarLayout.tsx
│   ├──📂schema
│   ├──📂store // 전역 상태
│   ├──📂styles // 글로벌 스타일 및 디자인 토큰
│   ├──📂types
│   ├──📂utils
│   ├──📜App.tsx
│   ├──📜main.tsx
│   ├──📜router.ts
│   ├──📜routeTree.gen.ts // 자동생성 파일
│   └──📜vite-env.d.ts
├──📜.commitlintrc.json
├──📜.prettierrc
├──📜eslint.config.js
├──📜index.html
├──📜tsconfig.app.json
├──📜tsconfig.json
├──📜tsconfig.node.json
├──📜package-lock.json
├──📜package.json
└──📜README.md
```

- sidebar 레이아웃이 필요한 페이지는 \_sideBarLayout 폴더 안에 작성하면 됩니다.
- sidebar 레이아웃이 필요없는 페이지는 routes 폴더 루트에 바로 작성하면 됩니다.
- 페이지에 해당하는 폴더 안에 index.tsx를 생성 하면 라우팅이 자동으로 설정됩니다.
- next.js 처럼 동적 라우팅도 가능합니다.

---

## 📆 프로젝트 진행 과정

### 기획 (2025.02.10 ~ 2025.02.28)

프로젝트의 방향성을 설정하고 핵심 기능을 정의하는 시간을 가졌습니다. 팀원들과 함께 기획서 및 요구사항 명세서를 작성하고 서비스 플로우, 디자인 기획서를 구체화했습니다.

### 개발 및 퍼블리싱 (2025.03.01 ~ 2025.03.23)

설계된 와이어프레임을 기반으로 핵심 기능을 구현했습니다. 와이어프레임 작업이 딜레이 됨에 따라 디자인 기획서 및 와이어 프레임 초안을 바탕으로 진행하였고, 추후 작업 완료됨에 따라 수정하는 식으로 진행했습니다. 재사용 가능한 UI 컴포넌트들을 직접 설계하고 개발한 후, 세부 기능을 단계적으로 구현했습니다. 매일 아침 데일리 스크럼을 통해 진행 상황을 공유했습니다.

### API 연동 (2025.03.19 ~ 2025.04.02)

백엔드에서 제공해준 API 활용한 연동작업을 진행했습니다. 프로젝트 데이터는 실시간으로 저장을 통해 많은 데이터를 자주 호출해야한다고 판단하여 캐싱하지 않았으나, 일부 데이터는 TanStack Query와 연동해 효율적인 데이터 페칭과 상태 관리를 구현했습니다.

### 리팩토링 (2025.04.07 ~ 2025.04.11)

코드 품질 향상을 위한 리팩토링을 진행했고, 컴포넌트 분리 및 발견된 버그를 수정했습니다.

&nbsp;

## 🍀 우리의 컨벤션

### 네이밍 컨벤션

- 폴더명 : 카멜 케이스(camelCase)
- 파일명: 파스칼 케이스(PascalCase)
- 컴포넌트명: 파스칼 케이스(PascalCase)
- 상수명 : 스네이크 케이스(SNAKE_CASE)
- 함수명: 카멜 케이스(camelCase)
- 변수명: 카멜 케이스(camelCase)

### 커밋 컨벤션

- docs: 문서 작업 ([README.md](http://readme.md/))
- feat: 새로운 기능 구현(마크업 포함)
  - 최소 단위
- conf: 설정 파일 관련
  - 패키지, 라이브러리 추가
- asset: 이미지 소스 추가
- design : css 작업(오로지 css작업)
- rename : 파일 명 | 디렉토리 변경
- remove: 파일 삭제
- chore: 주석 변경/삭제
- refactor: 코드 리팩토링 (성능, 가독성)
  - 의미나 동작에 영향을 주지 않는 상태에서 가독성, 재사용성 또는 구조를 개선하기 위해 현재 코드를 재작성하는 것
- fix: 버그를 고친 경우
- hotfix: 치명적인 버그 수정
  - 의논 후 담당 1명을 정해서 처리
  - 의도치 않은 에러 수정
- !breakingChange : 커다란 API의 변경
- test : 테스트 관련
