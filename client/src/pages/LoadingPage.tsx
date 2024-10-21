import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          window.location.href = '/desktop';
          return 100;
        }
        return oldProgress + 1;
      });
    }, 50);
  
    return () => clearInterval(timer);
  }, []);  

  return (
    <div style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    }}>
      <i 
        className="fa-brands fa-apple"
        style={{
          fontSize: '10rem',
          color: '#fff',
          filter: 'drop-shadow(0 0 0.3rem #fff)', 
          marginBottom: '2rem',
        }}
      />
      <div style={{
        width: '10rem',
        height: '0.5rem',
        backgroundColor: '#333',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 0 0.5rem #fff',
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',  // 높이를 지정하여 바가 꽉 차도록 설정
            backgroundColor: '#fff',  // 배경 색상을 추가해 가시성 확보
            transition: 'width 0.1s ease-out',  // 애니메이션 부드럽게 전환
          }}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
