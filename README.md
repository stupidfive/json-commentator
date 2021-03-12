# JSON Commentator

Documenting JSON with ease

## Usage

Install with npm

```bash
npm install json-commentator
```

Giving JSON

```json
{
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
}
```

When `comment` with a rule

```javascript
const commentedJSON = comment(json, function (path, value) {
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
```

It will generate the following output

```json
{
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
}
```

