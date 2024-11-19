# Git 사용 가이드

## 1. GitHub 프로젝트 다운로드 및 업로드 기본 과정

### 프로젝트 다운로드 및 시작
```bash
# 프로젝트 다운로드 (클론)
git clone https://github.com/username/repository-name.git
cd repository-name

# 최신 변경사항 가져오기
git pull origin main
```

### 작업 후 업로드 과정
```bash
# 변경된 파일 확인
git status

# 변경사항을 스테이징 영역에 추가
git add .           # 모든 변경사항 추가
# 또는
git add filename    # 특정 파일만 추가

# 변경사항 커밋
git commit -m "변경사항에 대한 설명"

# 원격 저장소에 푸시
git push origin main

# 연결 해제 
git remote remove origin
```

## 주의사항

1. 항상 작업 전 `git pull`로 최신 상태 유지
2. 의미 있는 커밋 메시지 작성
3. 정기적으로 커밋하여 작업 내용 보존
4. 중요한 변경 전 브랜치 생성 고려
5. force push (`-f`) 사용 시 주의

## 문제 해결

### 푸시 거부된 경우
```bash
# 원격 저장소의 변경사항을 가져옴
git pull origin main --allow-unrelated-histories

# 또는 강제 푸시 (주의: 기존 원격 저장소 내용이 삭제될 수 있음)
git push -f origin main
```

### 저장소 초기화가 필요한 경우
```bash
# 1. 기존 .git 폴더 삭제
rm -rf .git

# 2. 깃 초기화부터 다시 시작
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin [repository-url]
git push -f origin main
```

## 7. 유용한 Git 설정

```bash
# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 자격 증명 저장
git config --global credential.helper store
```
