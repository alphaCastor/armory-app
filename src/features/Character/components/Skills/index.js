// @flow

import React from 'react';
import get from 'lodash/get';
import cx from 'classnames';

import styles from './styles.less';
import { Skill } from 'armory-component-ui';

type SkillsProps = {
  skills: {},
  characterSkills: {
    heal: number,
    elite: number,
  },
  professionData?: {},
  className?: string,
  items?: {},
  character?: {},
  showWeaponSkills?: boolean,
};

const Skills = ({
  skills,
  characterSkills,
  professionData,
  items,
  character,
  className,
  showWeaponSkills,
}: SkillsProps) => {
  const utilities = get(characterSkills, 'utilities', [undefined, undefined, undefined]);

  let mainHandSkills = [];
  let offHandSkills = [];

  if (showWeaponSkills) {
    const mainHandId = get(character, 'equipment.weaponA1.id');
    const offHandId = get(character, 'equipment.weaponA2.id');
    const mainHand = get(items, `[${mainHandId}].details.type`);
    const offHand = get(items, `[${offHandId}].details.type`);

    mainHandSkills = get(professionData, `weapons[${mainHand}].skills`, []);
    offHandSkills = get(professionData, `weapons[${offHand}].skills`, []);

    if (offHandSkills) {
      mainHandSkills = mainHandSkills.slice(0, 3);
    }

    if (!mainHandSkills.length && !offHandSkills.length) {
      mainHandSkills = [{}, {}, {}, {}, {}];
    }
  }

  return (
    <div className={cx(styles.root, className)}>
      {mainHandSkills.map(({ id }) => <Skill key={id} data={skills[id]} />)}
      {offHandSkills.map(({ id }) => <Skill key={id} data={skills[id]} />)}
      <Skill data={skills[characterSkills.heal]} className={styles.heal} />
      {utilities.map((id, index) => <Skill key={id || index} data={skills[id]} />)}
      <Skill data={skills[characterSkills.elite]} className={styles.elite} />
    </div>
  );
};

export default Skills;
