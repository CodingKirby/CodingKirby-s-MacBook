import React, { useState, useEffect } from 'react';
import { useAppState } from '../../contexts/AppContext';

import Container from '../common/Container';
import Profile from './GithubProfile';  // 프로필 컴포넌트
import '../../styles/Github.css';

const imgUrl = process.env.REACT_APP_IMAGE_URL;

interface Repository {
  id: string;
  project: string;
  name: string;
  description: string;
  language: string;
  languageColor?: string;
  url: string;
}

const featuredRepos: Repository[] = [
  { id: '1', project: '서울여자대학교 소프트웨어융합학과 졸업 프로젝트', name: 'PurrFectDay.',
    description: '꾸미기 게임과 투두리스트를 결합한 iOS 앱', language: 'Swift', languageColor: '#F05138',
    url: 'https://github.com/PurrFectDay/PurrFectDay.' },
  { id: '2', project: '서울여자대학교 컴퓨터그래픽스 기말 프로젝트', name: 'Sprout Farm',
    description: 'Unity를 이용한 미니 게임',language: 'C#', languageColor: '#178600',
    url: 'https://github.com/username/project2' },
  { id: '3', project: 'ICT 멘토링 공모전', name: 'VOA',
    description: '동상 수상 - AI를 활용한 시각장애인을 위한 키오스크 프로그램', language: 'Python', languageColor: '#3572A5',
    url: 'https://github.com/2023-ICT-Kiosks/VOA' },
  { id: '4', project: '2023-GDSC-SWU', name: 'ChatBuddy',
    description: 'ChatGPT를 활용한 심리 상담 Android 앱', language: 'Java', languageColor: '#B07219',
    url: 'https://github.com/GDSC-SWU/2023-ChatBuddy-SolutionChallenge' },
  { id: '5', project: '서울여자대학교 정보보호학과 졸업 프로젝트', name: 'Chaseye',
    description: 'AI(Mediapipe)와 시스템 분석을 이용한 부정행위 감지 프로그램', language: 'Python', languageColor: '#3572A5',
    url: 'https://github.com/CodingKirby/BOSWU' },
];

const Github: React.FC = () => {
  const { apps } = useAppState();
  const memoAppState = apps['github'];
  const isRunning = memoAppState.isRunning;
  const isMinimized = memoAppState.isMinimized;

  // 앱이 실행 중이 아닌 경우나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  return (
    <Container title="GitHub" appName="github">
      <div className="github-layout">
        <div className="left-section">
            <div className="profile-container">
        <div className="profile-image">
            <img src={`${imgUrl}/me.png`} alt="Profile" />
        </div>
        <div className="profile-info">
            <h2>Kim Jeong Hyeon</h2>
            <p>
                App Developer | Frontend Enthusiast
            </p>
            <p>
                Seoul Women's University
            </p>
            <p>
            <i className="fa-solid fa-map-marker-alt"></i>
            <strong>Seoul, South Korea</strong>
            </p>
            <div className="profile-links">
                <a href="https://github.com/CodingKirby" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href="mailto:codingkirby0@gmail.com">Email</a>
            </div>
        </div>
        </div>
        </div>

        <div className="right-section">
          <Profile/>
          <h2>📌 Pinned Repositories</h2>
          <div className="repos-list">
            {featuredRepos.map((repo) => (
                <div key={repo.id} className="repo-card">
                    <div className="repo-card-header">
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <h3>{repo.name}</h3>
                    </a>
                    <span className="badge">Public</span>
                    </div>
                    <p className="repo-card-description">{repo.description}</p>
                    <div className="repo-card-footer">
                    <span className="repo-language">
                        <span className="repo-language-color" style={{ backgroundColor: repo.languageColor }}></span>
                        {repo.language}
                    </span>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </Container>
  );
};

export default Github;
