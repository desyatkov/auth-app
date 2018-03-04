import { renderComponent, expect } from "../test_helper";
import App from '../../src/components/app';

describe('App', () => {
  it('Show the correct text', ()=>{
    const component = renderComponent(App);
    expect(component).to.contain('React simple starter');
  })
});