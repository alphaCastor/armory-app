import { shallow } from 'enzyme';
import { stubComponent, stubStyles } from 'test/utils';

const Base = stubComponent('Base');
const Embed = stubComponent('Embed');

const styles = stubStyles([
  'embed',
]);

const sandbox = sinon.sandbox.create();
const bootstrapTooltip = sinon.spy();
const resetLs = sandbox.spy();
const axiosGet = sandbox.stub();
const render = sandbox.spy();
const translate = sandbox.stub();
const addStyleSheet = sandbox.spy();
const setLang = sandbox.spy();

const createEmbed = sandbox.stub();
const embedName = 'traits';

const bootstrap = proxyquire('embeds/bootstrap', {
  'lib/localStorage': {
    reset: resetLs,
  },
  '../Base': Base,
  './styles.less': styles,
  'react-dom': {
    render,
  },
  axios: {
    get: axiosGet,
  },
  'i18n-react': {
    translate,
  },
  'lib/dom': {
    addStyleSheet,
  },
  'lib/i18n': {
    set: setLang,
  },
  'lib/tooltip': bootstrapTooltip,
  [`embeds/creators/${embedName}`]: { default: createEmbed },
});

describe('embed bootstrapper', () => {
  const publicPath = 'htts://gw2armory.com/';
  const manifest = {
    'gw2aEmbeds.css': 'gw2aEmbeds.css',
  };

  before(() => {
    global.__webpack_public_path__ = publicPath;
  });

  after(() => {
    delete global.__webpack_public_path__;
  });

  beforeEach(() => {
    delete document.GW2A_EMBED_OPTIONS;
    axiosGet.withArgs(`${publicPath}asset-manifest.json`).returns(Promise.resolve({ data: manifest }));
  });

  afterEach(() => sandbox.reset());

  describe('tooltip', () => {
    beforeEach(() => {
      bootstrap();
    });

    it('should render tooltip', () => {
      expect(bootstrapTooltip).to.have.been.calledWith({
        showBadge: true,
        className: 'embed-style gw2a-tooltip-embed',
      });
    });
  });

  describe('global options', () => {
    it('should default lang to en', () => {
      bootstrap();

      expect(setLang).to.have.been.calledWith('en');
    });

    it('should override lang if passed in', () => {
      document.GW2A_EMBED_OPTIONS = {
        lang: 'de',
      };

      bootstrap();

      expect(setLang).to.have.been.calledWith('de');
    });
  });

  describe('style fetching', () => {
    it('should fetch styles using manifest.json and add it to head', async () => {
      await bootstrap();

      expect(addStyleSheet).to.have.been.calledWith(`${global.__webpack_public_path__}${manifest['gw2aEmbeds.css']}`);
    });
  });

  describe('embeds', () => {
    const ids = ['1', '2', '3'];
    const size = 50;
    const inlineText = 'wiki';
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('data-armory-embed', embedName);
      element.setAttribute('data-armory-size', size);
      element.setAttribute('data-armory-inline-text', inlineText);
      element.setAttribute('data-armory-ids', ids.join(','));
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should find all embeds in the body and render them', async () => {
      const blank = 'optional man';
      createEmbed.withArgs(element, ids).returns(Embed);
      translate.withArgs('words.optional').returns(blank);

      await bootstrap();

      const [jsx, container] = render.firstCall.args;
      const wrapper = shallow(jsx);

      expect(wrapper.find(Embed).props()).to.eql({
        className: 'embed-style gw2a-traits-embed',
        blankText: blank,
        size,
        inlineText,
      });

      expect(container).to.equal(element);
    });

    context('when blank text is used', () => {
      it('should override text', async () => {
        const textOverride = 'override man';
        element.setAttribute('data-armory-blank-text', textOverride);
        createEmbed.withArgs(element, ids).returns(Embed);

        await bootstrap();

        const [jsx, container] = render.firstCall.args;
        const wrapper = shallow(jsx);

        expect(wrapper.find(Embed).props()).to.include({
          blankText: textOverride,
        });

        expect(container).to.equal(element);
      });
    });
  });
});
