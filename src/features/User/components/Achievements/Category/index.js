// @flow

import type { Node } from 'react';

import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import styles from './styles.less';

type Props = {
  to?: string,
  name: string,
  className?: string,
  icon?: Node,
  selected?: boolean,
  subCategory?: boolean,
  rightComponent?: Node,
  onClick?: () => void,
};

const AchievementCategory = ({
  name,
  icon,
  className,
  selected,
  subCategory,
  rightComponent,
  to,
  onClick,
}: Props) => {
  const Container = to ? NavLink : 'button';

  const navProps = to
    ? {
        activeClassName: styles.selected,
        exact: true,
        to,
      }
    : null;

  return (
    <Container
      {...navProps}
      onClick={onClick}
      className={cx(styles.root, className, {
        [styles.selected]: selected,
        [styles.subCategory]: subCategory,
      })}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.name}>
        <span>{name || <span className={styles.loading}>Loading Category...</span>}</span>
        {rightComponent && <span className={styles.rightComponent}>{rightComponent}</span>}
      </span>
    </Container>
  );
};

export default AchievementCategory;
