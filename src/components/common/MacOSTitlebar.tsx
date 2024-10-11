import React from 'react';

interface MacOSTitlebarProps {
  title: string;
  children: React.ReactNode;
}

const MacOSTitlebar: React.FC<MacOSTitlebarProps> = ({ title, children }) => {
  return (
    <div className="container">
      <div className="macos-titlebar">
        <div className="traffic-lights">
          <span className="close"></span>
          <span className="minimize"></span>
          <span className="fullscreen"></span>
        </div>
        <span className="title">{title}</span>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default MacOSTitlebar;
