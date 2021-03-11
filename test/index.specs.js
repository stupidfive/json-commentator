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

  it('should prettify nested object', () => {
    assertComment(
        '{"id":123,"name":"john-doe","address":{"country":"US","state":"CA"}}',
        '' +
        '{\n' +
        '  "id": 123,\n' +
        '  "name": "john-doe",\n' +
        '  "address": {\n' +
        '    "country": "US",\n' +
        '    "state": "CA"\n' +
        '  }\n' +
        '}'
    )
  });

  it('should prettify three layer nested object', () => {
    assertComment(
        '{"id":123,"name":"john-doe","address":{"country":"US","state":"CA","lines":{"line1":"404 Room","line2":"1600 Avenue NW"}}}',
        '' +
        '{\n' +
        '  "id": 123,\n' +
        '  "name": "john-doe",\n' +
        '  "address": {\n' +
        '    "country": "US",\n' +
        '    "state": "CA",\n' +
        '    "lines": {\n' +
        '      "line1": "404 Room",\n' +
        '      "line2": "1600 Avenue NW"\n' +
        '    }\n' +
        '  }\n' +
        '}'
    )
  });
})
