import chai from 'chai';
import {comment, getOne} from "../index.js";

let expect = chai.expect;

describe('index', () => {
  it('should return 1 if get 1', () => {
    expect(getOne()).to.equal(1)
  });
})

function assertComment(input, expected) {
  expect(comment(input)).to.equal(expected)
}

describe('Comment JSON', function () {
  it('should satisfy base case', () => {
    assertComment('{}', '{}')
  });

  it('should prettify', () => {
    assertComment(
        '{"id":123}',
        '' +
        '{\n' +
        '  "id": 123\n' +
        '}'
    )
  });

  it('should prettify two keys', () => {
    assertComment(
        '{"id":123, "name":"john-doe"}',
        '' +
        '{\n' +
        '  "id": 123,\n' +
        '  "name": "john-doe"\n' +
        '}'
    )

  });
})
