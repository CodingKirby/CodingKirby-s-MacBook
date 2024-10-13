import React from 'react';
import Container from '../common/Container';
import { useAppState } from '../../contexts/AppContext';
import '../../styles/Container.css';

const Blog: React.FC = () => {
  const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;
  
  // useAppState를 이용해 앱 상태를 관리
  const { apps } = useAppState();

  // 'blog' 앱의 실행 상태 및 최소화 상태를 가져옴
  const isRunning = apps.blog.isRunning;
  const isMinimized = apps.blog.isMinimized;

  // 앱이 실행 중이 아닌 경우나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  return (
    <Container
      title="My Blog"
      appName="blog"
      appStyle={{
        overflow: 'hidden',  // 스크롤을 없앰
      }}
    >
      <iframe
        src="https://codingkirby.github.io/"
        title="GitHub Pages"
        style={{
          border: 'none', 
          width: '100%', 
          height: '100%', 
          display: 'block', // Iframe을 블록 요소로 만듦
        }}
        allowFullScreen
      ></iframe>
    </Container>
  );
};

export default Blog;
