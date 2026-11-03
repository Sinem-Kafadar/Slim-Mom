import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '../../redux/auth/auth-selector.js';

import logoDesktop from '../../assets/png/logoDeskTop.png';
import logoTablet from '../../assets/png/logoTab.png';
import logoMobile from '../../assets/png/logoMob_NotLogin.png';

import UserInfo from '../UserInfo/UserInfo';
import styles from './Header.module.css';

function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const getLinkClassName = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.activeLink : ''}`;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logoLink}
          aria-label="Slim Mom home"
        >
          <picture>
            <source
              media="(min-width: 1280px)"
              srcSet={logoDesktop}
            />

            <source
              media="(min-width: 768px)"
              srcSet={logoTablet}
            />

            <img
              src={logoMobile}
              alt="Slim Mom"
              className={styles.logo}
            />
          </picture>
        </Link>

        <nav
          className={styles.navigation}
          aria-label="Main navigation"
        >
          {isLoggedIn ? (
            <>
              <NavLink
                to="/diary"
                className={getLinkClassName}
              >
                DIARY
              </NavLink>

              <NavLink
                to="/calculator"
                className={getLinkClassName}
              >
                CALCULATOR
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={getLinkClassName}
              >
                SIGN IN
              </NavLink>

              <NavLink
                to="/registration"
                className={getLinkClassName}
              >
                REGISTRATION
              </NavLink>
            </>
          )}
        </nav>

        {isLoggedIn && <UserInfo />}
      </div>
    </header>
  );
}

export default Header;
