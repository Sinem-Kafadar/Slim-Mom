import { useLocation } from 'react-router-dom';
import styles from './Background.module.css';

function Background({ children }) {
  const { pathname } = useLocation();

  const authPages = [
    '/login',
    '/registration',
    '/forgot-password',
  ];

  const diaryPages = [
    '/diary',
    '/diary-mobile-form',
    '/calculator',
  ];

  let backgroundClass = styles.backgroundHome;

  if (authPages.includes(pathname)) {
    backgroundClass = styles.backgroundAuth;
  } else if (diaryPages.includes(pathname)) {
    backgroundClass = styles.backgroundDiaryCalc;
  }

  return (
    <div className={backgroundClass}>
      {children}
    </div>
  );
}

export default Background;
