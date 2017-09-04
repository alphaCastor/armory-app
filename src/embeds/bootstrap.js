// @flow

// Base is deliberately at the top.
import Base from '../Base';
import React from 'react';
import bootstrapTooltip from 'lib/tooltip';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import axios from 'axios';
import T from 'i18n-react';

import { addStyleSheet } from 'lib/dom';
import { set as setLang } from 'lib/i18n';
import styles from './styles.less';

type Options = {
  lang: string,
  showBadge: boolean,
};

export type EmbedProps = {
  className?: string,
  blankText?: string,
  size?: number,
  inlineText?: string,
};

const makeClassName = (str) => `gw2a-${str}-embed`;
export const makeAttribute = (str: string) => `data-armory-${str}`;

function fetchStyles () {
  return axios.get(`${__webpack_public_path__}asset-manifest.json`)
    .then((response) => {
      const styleSheetPath = response.data['gw2aEmbeds.css'];
      if (styleSheetPath) {
        addStyleSheet(`${__webpack_public_path__}${styleSheetPath}`);
      }
    });
}

function setOptions () {
  const options: Options = {
    lang: 'en',
    // $FlowFixMe
    ...document.GW2A_EMBED_OPTIONS,
  };

  return options;
}

function bootstrapEmbeds () {
  if (!document.body) {
    throw new Error('Document body not loaded!');
  }

  const embedables = Array.from(document.body.querySelectorAll(`[${makeAttribute('embed')}]`));
  return embedables.map((element) => {
    const embedName = element.getAttribute(makeAttribute('embed'));
    if (!embedName) {
      return undefined;
    }

    // Remove the attribute so if the embed script is added to the document again, it doesn't pick
    // already bootstrapped embeds.
    element.removeAttribute(makeAttribute('embed'));

    return import(`embeds/creators/${embedName}`).then(({ default: createEmbed }) => {
      const rawIds = element.getAttribute(makeAttribute('ids'));
      const blankText = element.getAttribute(makeAttribute('blank-text')) || T.translate('words.optional');
      const ids = (rawIds || '').split(',');
      const size: number = parseInt(element.getAttribute(makeAttribute('size')), 10);
      const inlineText = element.getAttribute(makeAttribute('inline-text')) || '';

      const Component = createEmbed(element, ids);

      const props: EmbedProps = {
        className: cx(styles.embed, makeClassName(embedName)),
        blankText,
        size,
        inlineText,
      };

      ReactDOM.render(
        <Base>
          <Component {...props} />
        </Base>,
        element
      );
    });
  });
}

export default function bootstrap () {
  const options = setOptions();

  setLang(options.lang);

  return Promise.all([
    fetchStyles(),
    bootstrapEmbeds(),
    bootstrapTooltip({
      showBadge: true,
      className: cx(styles.embed, makeClassName('tooltip')),
    }),
  ]);
}
