import chai from 'chai';
import {comment} from "../index.js";

let expect = chai.expect;

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

  it('should prettify array', () => {
    assertComment(
        '["a"]',
        '' +
        '[\n' +
        '  "a"\n' +
        ']'
    )
  });

  it('should prettify long array', () => {
    assertComment(
        '["a",42,3.14,null,true,false]',
        '' +
        '[\n' +
        '  "a",\n' +
        '  42,\n' +
        '  3.14,\n' +
        '  null,\n' +
        '  true,\n' +
        '  false\n' +
        ']'
    )
  });

  it('should prettify nested array', () => {
    assertComment(
        '[[0,1],[2,3]]',
        '' +
        '[\n' +
        '  [\n' +
        '    0,\n' +
        '    1\n' +
        '  ],\n' +
        '  [\n' +
        '    2,\n' +
        '    3\n' +
        '  ]\n' +
        ']'
    )
  });

  it('should prettify array containing objects', () => {
    assertComment(
        '[{"name":"John"},{"name":"Tom"}]',
        '' +
        '[\n' +
        '  {\n' +
        '    "name": "John"\n' +
        '  },\n' +
        '  {\n' +
        '    "name": "Tom"\n' +
        '  }\n' +
        ']'
    )

  });
})
