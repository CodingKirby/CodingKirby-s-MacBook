import React from 'react';
import Container from '../common/Container';
import '../../styles/Safari.css';
import '../../styles/Container.css';

const Safari: React.FC = () => {
  const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;
  
  const projects = [
    {
      imgSrc: `${imageUrl}/sproutfarm.png`,
      title: 'SproutFarm',
      subtitle: '새싹 농장🌱',
      description: '캐주얼 픽셀 미니게임',
      link: 'https://codingkirby.github.io/SproutFarm/'
    },
    {
      imgSrc: './img/purrfectday.png',
      title: 'PurrFectDay.',
      subtitle: '퍼펙데이.',
      description: '고양이와 함께 나만의 방을 만들어가는 귀여운 투두리스트😻',
      link: 'https://codingkirby.github.io/projects/PurrFectDay'
    },
    {
      imgSrc: './img/chatbuddy.png',
      title: 'CHATBuddy',
      subtitle: '챗벗👀',
      description: '우울감을 지닌 청년들을 위한 AI 채팅 서비스',
      link: 'https://codingkirby.github.io/projects/CHATBuddy'
    }
  ];

  return (
    <Container title="Portfolio" appName="safari">
      <header>
        <h1>김정현의 포트폴리오</h1>
        <p>안녕하세요, 늘 고민하는 개발자 김정현입니다.<br />제 프로젝트들을 소개합니다.</p>
      </header>
      <div className="projects">
        {projects.map((project, index) => (
          <div key={index} className="project">
            <div className="img-container">
              <img src={project.imgSrc} alt={project.title} />
            </div>
            <h2>{project.title}</h2>
            <h2>{project.subtitle}</h2>
            <span>{project.description}</span>
            <button onClick={() => window.open(project.link, '_blank')}>자세히 보러가기</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Safari;
