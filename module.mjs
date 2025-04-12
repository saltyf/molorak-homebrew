
// Execute script when initiation world
Hooks.on("init", function() {

    // Remove currency EP from the world
    delete CONFIG.DND5E.currencies.ep;

    // Add a flag for the Resourceful species trait
    CONFIG.DND5E.characterFlags.resourceful = {
        name: "Resourceful",
        hint: "You gain Heroic Inspiration whenever you finish a Long Rest.",
        section: "DND5E.RacialTraits",
        type: Boolean
    };

    // Add tool proficiency for Harvester's Tools
    CONFIG.DND5E.tools.harvester = {
        ability: "dex",
        id: "Compendium.molorak-homebrew.equipment.Item.jNs0lFWXOmChwYvy"
    };

    // Remove all languages and add my list
    delete CONFIG.DND5E.languages.standard;
    delete CONFIG.DND5E.languages.exotic;
    CONFIG.DND5E.languages = {
        standard: {
            label: "Standard Languages",
            selectable: false,
            children: {
              common: "Common",
              aquan: "Aquan",
              auran: "Auran",
              ignan: "Ignan",
              terran: "Terran",
              sign: "Common Sign Language"
            }
          },
          rare: {
            label: "Rare Languages",
            selectable: false,
            children: {
              primordial: "Primordial",
              abyssal: "Abyssal",
              infernal: "Infernal",
              deep: "Deep Speech",
              giant: "Giant",
              orc: "Orc",
              dwarvish: "Dwarvish",
            }
          },
          exotic: {
            label: "Exotic Languages",
            selectable: false,
            children: {
              celestial: "Celestial",
              draconic: "Draconic",
              cant: "Thieves' Cant",
              druidic: "Druidic"
            }
          }
    };
});

// Execute script bofore rest is finished
Hooks.on("dnd5e.preRestCompleted", function({isLongRest, isResourceful, currentExhaustion, ...actor}={}, result={}, config={}) {
    isLongRest ??= config.type === "long";
    isResourceful ??= actor.flags.dnd5e.resourceful === true;
    currentExhaustion ??= actor.system.attributes.exhaustion ?? 0;
    // Only recovers attributes on Long Rests.
    if ( !isLongRest ) return;
    
    // Recover a level of exhaustion if actor has at least one level.
    if ( currentExhaustion ) {
      result.updateData['system.attributes.exhaustion'] = currentExhaustion - 1;
    }

    // Give Heroic Inspiration when actor has the Resourceful species trait.
    if ( isResourceful ) {
      result.updateData['system.attributes.inspiration'] = true;
    }
});