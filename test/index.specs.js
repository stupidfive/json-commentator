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
      const rules = [
        ['^squadName$', 'Name of the squad'],
        ['^homeTown$', 'Where the squad is coming from'],
        ['^formed$', 'Year when the squad is formed'],
        ['^active$', 'Whether the squad is still active'],
        ['^members$', 'Members of the squad'],
        ['^members,0$', 'Leader of the squad'],
        ['^members,0,name$', 'Name of the member'],
        ['^members,0,age$', 'Age of the member'],
        ['^members,0,secretIdentity$', 'Secret identity of the member'],
        ['^members,0,powers$', 'Special powers of the member'],
      ]
      for (const rule of rules) {
        if (pathString.match(rule[0])) {
          return rule[1]
        }
      }

      if (pathString.match(/^members,.*,powers,.*$/)) {
        const map = {
          'Radiation resistance': 'Receives less damage from radiation',
          'Turning tiny': 'Shrink in size drastically, harder to be spotted by the enemy',
          'Radiation blast': 'A power blast that deal damage to enemies near him',
          'Million tonne punch': 'Heavy punch that deals a lot of damage to one enemy',
          'Damage resistance': 'Receives less physical damage',
          'Superhuman reflexes': 'High change of dodging attacks',
          'Immortality': 'Reborn after death',
          'Heat Immunity': 'Immune to heat',
          'Inferno': 'Heat damage to all enemies in the room',
          'Teleportation': 'Teleport to any place during battle',
          'Interdimensional travel': 'Fast travel to any beacon near a beacon',
        }
        if (value in map) {
          return map[value]
        }
      }
      return null
    })

    expect(commented).to.equal(`{
  "squadName": "Super hero squad", // Name of the squad
  "homeTown": "Metro City", // Where the squad is coming from
  "formed": 2016, // Year when the squad is formed
  "secretBase": "Super tower",
  "active": true, // Whether the squad is still active
  "members": [ // Members of the squad
    { // Leader of the squad
      "name": "Molecule Man", // Name of the member
      "age": 29, // Age of the member
      "secretIdentity": "Dan Jukes", // Secret identity of the member
      "powers": [ // Special powers of the member
        "Radiation resistance", // Receives less damage from radiation
        "Turning tiny", // Shrink in size drastically, harder to be spotted by the enemy
        "Radiation blast" // A power blast that deal damage to enemies near him
      ]
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
        "Heat Immunity", // Immune to heat
        "Inferno", // Heat damage to all enemies in the room
        "Teleportation", // Teleport to any place during battle
        "Interdimensional travel" // Fast travel to any beacon near a beacon
      ]
    }
  ]
}`)
  });

  it('should comment at opening brace for object', () => {
    const json = JSON.stringify({
      a: 123
    })
    let commented = comment(json, (path) => {
      if (path.join(',') === '') {
        return 'alpha'
      }
      return null
    });
    expect(commented).to.equal(`{ // alpha
  "a": 123
}`)
  });

  it('should comment at opening brace for nested object', () => {
    const json = JSON.stringify({
      a: {
        b: 123
      }
    })
    let commented = comment(json, (path) => {
      if (path.join(',').match('^a$')) {
        return 'alpha'
      }
      return null
    });
    expect(commented).to.equal(`{
  "a": { // alpha
    "b": 123
  }
}`)
  });

  it('should comment object property in array', () => {
    const json = JSON.stringify({
      a: [
        {
          b: 1,
        },
      ]
    })

    const commented = comment(json, (path) => {
      if (path.join(',').match('a,\\d+,b')) {
        return 'beta'
      }
      return null
    })
    expect(commented).to.equal(`{
  "a": [
    {
      "b": 1 // beta
    }
  ]
}`)
  });
})
