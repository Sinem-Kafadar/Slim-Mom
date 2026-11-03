import styles from './Container.module.css';

function Container({ children, className = '' }) {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Container;
