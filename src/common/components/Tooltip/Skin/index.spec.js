import React from 'react';
import { shallow } from 'enzyme';
import SkinTooltip from './';

describe('<SkinTooltip />', () => {
  it('should render the detail type for weapons', () => {
    const testData = {
      skin: {
        type: 'Weapon',
        details: {
          type: 'Axe',
        },
      },
    };

    const wrapper = shallow(<SkinTooltip data={testData} />);
    expect(wrapper.find('span')).to.have.length(1);
    expect(wrapper.find('span')).to.contain('Axe');
  });

  it('should render the weight and detail type for armor', () => {
    const testData = {
      skin: {
        type: 'Armor',
        details: {
          type: 'Helm',
          weight_class: 'Heavy',
        },
      },
    };

    const wrapper = shallow(<SkinTooltip data={testData} />);

    expect(wrapper.find('span')).to.have.length(2);
    expect(wrapper.find('span').at(0)).to.contain('Heavy');
    expect(wrapper.find('span').at(1)).to.contain('Helm');
  });
});
