import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectUser } from '../../redux/auth/auth-selector.js';
import { logout } from '../../redux/auth/auth-operations.js';
import { clearAuth } from '../../redux/auth/auth-slice.js';

import styles from './UserInfo.module.css';

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split('@')[0] ||
    'User';

  const handleLogout = async () => {
    // 1. Redux'taki kullanıcı bilgilerini hemen temizle.
    dispatch(clearAuth());

    try {
      // 2. Backend oturumunu kapat ve localStorage'ı temizle.
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 3. Login sayfasına yönlendir.
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className={styles.userInfo}>
      <span className={styles.userName}>{userName}</span>

      <span className={styles.separator}></span>

      <button
        type="button"
        className={styles.exitButton}
        onClick={handleLogout}
      >
        Exit
      </button>
    </div>
  );
}

export default UserInfo;
