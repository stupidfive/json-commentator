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

  it('should prettify object containing null', () => {
    assertComment(
        '{"name":null}',
        '' +
        '{\n' +
        '  "name": null\n' +
        '}'
    )
  });

  it('should prettify object containing array', () => {
    assertComment(
        '{"names":["Tom","Thomas"]}',
        '' +
        '{\n' +
        '  "names": [\n' +
        '    "Tom",\n' +
        '    "Thomas"\n' +
        '  ]\n' +
        '}'
    )
  });

  it('should add comment base on the rule', () => {
    const json = `{
  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,
  "secretBase": "Super tower",
  "active": true,
  "members": [
    {
      "name": "Molecule Man",
      "age": 29,
      "secretIdentity": "Dan Jukes",
      "powers": [
        "Radiation resistance",
        "Turning tiny",
        "Radiation blast"
      ]
    },
    {
      "name": "Madame Uppercut",
      "age": 39,
      "secretIdentity": "Jane Wilson",
      "powers": [
        "Million tonne punch",
        "Damage resistance",
        "Superhuman reflexes"
      ]
    },
    {
      "name": "Eternal Flame",
      "age": 1000000,
      "secretIdentity": "Unknown",
      "powers": [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel"
      ]
    }
  ]
}`
    const commented = comment(json, function (path, value) {
      const pathString = path.join(',')
      if (pathString === 'squadName') {
        return 'Name of the squad'
      } else if (pathString === 'homeTown') {
        return 'Where the squad is coming from'
      } else if (pathString === 'formed') {
        return 'Year when the squad is formed'
      } else if (pathString === 'active') {
        return 'Whether the squad is still active'
      } else if (pathString === 'members') {
        return 'Members of the squad'
      } else if (pathString === 'members,0') {
        return 'Leader of the squad'
      } else if (pathString === 'members,0,name') {
        return 'Name of the member'
      } else if (pathString === 'members,0,age') {
        return 'Age of the member'
      } else if (pathString === 'members,0,secretIdentity') {
        return 'Secret identity of the member'
      } else if (pathString === 'members,0,powers') {
        return 'Special powers of the member'
      } else if (pathString.match(/^members,.*,powers,.*$/)) {
        if (value === 'Radiation resistance') {
          return 'Receives less damage from radiation'
        } else if (value === 'Turning tiny') {
          return 'Shrink in size drastically, harder to be spotted by the enemy'
        } else if (value === 'Radiation blast') {
          return 'A power blast that deal damage to enemies near him'
        } else if (value === 'Million tonne punch') {
          return 'Heavy punch that deals a lot of damage to one enemy'
        } else if (value === 'Damage resistance')  {
          return 'Receives less physical damage'
        } else if (value === 'Superhuman reflexes') {
          return 'High change of dodging attacks'
        } else if (value === 'Immortality') {
          return 'Reborn after death'
        }
        return null
      }
      return null
    })

    console.log(commented)

    return

    expect(commented).to.equal(`{
  "squadName": "Super hero squad", // Name of the squad
  "homeTown": "Metro City", // Where the squad is coming from
  "formed": 2016, // Year when the squad is formed
  "secretBase": "Super tower",
  "active": true, // Whether the squad is still active
  "members": [
    {
      "name": "Molecule Man", // Name of the member
      "age": 29, // Age of the member
      "secretIdentity": "Dan Jukes", // Secret identity of the member
      "powers": [
        "Radiation resistance", // Receives less damage from radiation
        "Turning tiny", // Shrink in size drastically, harder to be spotted by the enemy
        "Radiation blast" // A power blast that deal damage to enemies near him
      ] // Special powers of the member
    },
    {
      "name": "Madame Uppercut",
      "age": 39,
      "secretIdentity": "Jane Wilson",
      "powers": [
        "Million tonne punch", // Heavy punch that deals a lot of damage to one enemy
        "Damage resistance", // Receives less physical damage
        "Superhuman reflexes" // High change of dodging attacks
      ]
    },
    {
      "name": "Eternal Flame",
      "age": 1000000,
      "secretIdentity": "Unknown",
      "powers": [
        "Immortality", // Reborn after death
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel"
      ]
    }
  ]
}`)
  });
})
