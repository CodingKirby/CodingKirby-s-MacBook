import React, { useState } from 'react';
import Container from '../common/Container';
import { useAppState } from '../../contexts/AppContext';
import '../../styles/Mail.css'; // Mail 관련 스타일 추가

const Mail: React.FC = () => {
  // useAppState로 앱 상태 관리
  const { apps } = useAppState();

  // Mail 앱의 실행 상태 및 최소화 상태 가져오기
  const isRunning = apps.mail.isRunning;
  const isMinimized = apps.mail.isMinimized;

  // 메일 목록 데이터 (더미 데이터)
  const mails = [
    { id: 1, subject: 'Welcome to the Mail App!', from: 'admin@mail.com', content: 'Thank you for joining our platform.' },
    { id: 2, subject: 'Weekly Newsletter', from: 'news@mail.com', content: 'Here is the latest news of the week.' },
    { id: 3, subject: 'Your Subscription Expiring', from: 'support@mail.com', content: 'Your subscription will expire soon. Please renew it.' },
  ];

  // 상태 관리 (선택된 메일)
  const [selectedMail, setSelectedMail] = useState<number | null>(null);

  // 선택한 메일을 상세 보기에서 보여줌
  const mailDetails = selectedMail !== null ? mails.find(mail => mail.id === selectedMail) : null;

  // 앱이 실행 중이지 않거나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  return (
    <Container title="Mail" appName="mail" appStyle={{ overflow: 'hidden' }}>
      <div className="mail-app">
        <div className="mail-list">
          <h3>Inbox</h3>
          <ul>
            {mails.map((mail) => (
              <li key={mail.id} onClick={() => setSelectedMail(mail.id)} className={selectedMail === mail.id ? 'active' : ''}>
                <span className="mail-subject">{mail.subject}</span>
                <span className="mail-from">{mail.from}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mail-details">
          {mailDetails ? (
            <>
              <h4>{mailDetails.subject}</h4>
              <p>From: {mailDetails.from}</p>
              <p>{mailDetails.content}</p>
            </>
          ) : (
            <p>Select a mail to read</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Mail;
