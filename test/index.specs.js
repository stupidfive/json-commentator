import chai from 'chai';
import {getOne} from "../index.js";

let expect = chai.expect;

describe('index', () => {
  it('should return 1 if get 1', () => {
    expect(getOne()).to.equal(1)
  });
})
