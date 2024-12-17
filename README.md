# jieun.xyz - Personalized Rolling Paper Service Web Application

## 🔗 URL

[Visit Jieun.XYZ](https://www.jieun.xyz)

**jieun.xyz** is a personalized rolling paper web application created to celebrate a friend's birthday. This project uses web interaction technologies to provide an interactive and engaging user experience on both PC and mobile devices.

## Features

### General

- **Interactive Canvas**: Navigate the rolling paper by moving the background or adjusting the scale.
- **Object Manipulation**: Users can move, resize, and rotate objects (texts, images, stickers) on the infinite canvas.
- **Cross-Platform Compatibility**: Supports both PC and mobile with optimized touch and mouse event handling.

### Functionalities

- **Text Writing**: Users can write messages directly on the canvas.
- **Image Upload**: Upload personal images to add them as objects on the canvas.
- **Sticker Library**: Add stickers from a pre-defined set of images.
- **Responsive Design**: Ensures a seamless experience across different devices and screen sizes.

## Technology Stack

- **Frontend**: React.js
- **Styling**: CSS Modules
- **Backend**: Firebase Firestore (Database) and Firebase Storage (File storage)
- **Deployment**: Vercel

## Core Technical Highlights

### Canvas Interactivity

- **Dynamic Transformations**: Implemented using CSS transformations and custom functions without library to handle position, scale, and rotation of objects.
- **Touch and Mouse Events**: Custom event handlers were created to ensure smooth interactions across devices.

### Firebase Integration

- **Firestore**: Stores user-created objects and their attributes (e.g., position, scale, rotation, data).
- **Storage**: Hosts uploaded images.

### Cross-Platform Design

- Unified event listeners to handle both `MouseEvent` and `TouchEvent`.
- Ensured responsiveness with media queries and adaptive layouts.

## Author

This project was created by Geonhyo Park. Feel free to reach out with any questions or feedback!

## License

This project is licensed under the MIT License.

---

**jieun.xyz**는 친구의 생일을 축하하기 위해 제작된 롤링페이퍼 웹 애플리케이션입니다. 이 프로젝트는 웹 상호작용 기술을 활용하여 PC와 모바일 디바이스에서 상호작용적이고 몰입감 있는 사용자 경험을 제공합니다.

## 주요 기능

### 일반 기능

- **인터랙티브 캔버스**: 롤링페이퍼 배경을 이동하거나 확대/축소 가능.
- **오브젝트 조작**: 사용자가 텍스트, 이미지, 스티커 등의 오브젝트를 무한 캔버스에서 이동, 크기 조정, 회전 가능.
- **크로스 플랫폼 호환성**: PC와 모바일 모두에서 최적화된 터치 및 마우스 이벤트 지원.

### 상세 기능

- **텍스트 작성**: 사용자가 캔버스에 메시지를 직접 작성 가능.
- **이미지 업로드**: 개인 이미지를 업로드하여 캔버스에 추가 가능.
- **스티커 라이브러리**: 사전 정의된 이미지 스티커 추가 가능.
- **반응형 디자인**: 다양한 디바이스와 화면 크기에 적합한 환경 제공.

## 기술 스택

- **프론트엔드**: React.js
- **스타일링**: CSS Modules
- **백엔드**: Firebase Firestore (데이터베이스) 및 Firebase Storage (파일 스토리지)
- **배포**: Vercel

## 핵심 기술적 요소

### 캔버스 상호작용

- **동적 변환**: 라이브러리 없이 CSS 변환과 커스텀 함수를 사용하여 오브젝트의 위치, 크기, 회전을 처리.
- **터치 및 마우스 이벤트**: 사용자 경험을 보장하기 위해 커스텀 이벤트 핸들러 구현.

### Firebase 통합

- **Firestore**: 사용자 생성 오브젝트와 속성(위치, 크기, 회전, 데이터) 저장.
- **Storage**: 업로드된 이미지를 호스팅.

### 크로스 플랫폼 설계

- `MouseEvent`와 `TouchEvent`를 모두 처리하는 통합 이벤트 리스너 사용.
- 미디어 쿼리와 적응형 레이아웃으로 반응형 설계 구현.

## 제작자

이 프로젝트는 GeonhyoPark에 의해 진행되었습니다. 문의 사항이나 피드백은 언제든 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
