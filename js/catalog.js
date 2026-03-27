window.ALBION_CATALOG = (() => {
  const QUALITY_NAMES = {
    1: 'Normal',
    2: 'Bom',
    3: 'Excelente',
    4: 'Excepcional',
    5: 'Obra-prima'
  };

  const ENCHANTMENT_NAMES = {
    0: 'Sem encantamento',
    1: '.1',
    2: '.2',
    3: '.3',
    4: '.4'
  };

  const families = [
    {
      key: 'resources-raw',
      label: 'Recursos brutos',
      groups: [
        {
          key: 'raw',
          label: 'Coleta',
          items: [
            { key: 'WOOD', label: 'Madeira bruta', template: 'T{tier}_WOOD', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'FIBER', label: 'Fibra bruta', template: 'T{tier}_FIBER', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ORE', label: 'Minério bruto', template: 'T{tier}_ORE', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HIDE', label: 'Couro bruto', template: 'T{tier}_HIDE', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ROCK', label: 'Pedra bruta', template: 'T{tier}_ROCK', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        }
      ]
    },
    {
      key: 'resources-refined',
      label: 'Recursos refinados',
      groups: [
        {
          key: 'refined',
          label: 'Refino',
          items: [
            { key: 'PLANKS', label: 'Tábuas', template: 'T{tier}_PLANKS', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'CLOTH', label: 'Tecido', template: 'T{tier}_CLOTH', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'METALBAR', label: 'Barra de metal', template: 'T{tier}_METALBAR', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'LEATHER', label: 'Couro refinado', template: 'T{tier}_LEATHER', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'STONEBLOCK', label: 'Bloco de pedra', template: 'T{tier}_STONEBLOCK', material: true, craftable: false, qualities: false, tiers: [2,3,4,5,6,7,8], enchants: [0] }
          ]
        }
      ]
    },
    {
      key: 'bags-capes',
      label: 'Bolsas e capas',
      groups: [
        {
          key: 'bags',
          label: 'Bolsas',
          items: [
            { key: 'BAG', label: 'Bolsa', template: 'T{tier}_BAG', material: false, craftable: true, qualities: true, tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'capes',
          label: 'Capas',
          items: [
            { key: 'CAPE', label: 'Capa', template: 'T{tier}_CAPE', material: false, craftable: true, qualities: true, tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SMUGGLER_CAPE', label: 'Capa de Contrabandista', template: 'T{tier}_CAPEITEM_SMUGGLER', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'BW_CAPE', label: 'Capa de Bridgewatch', template: 'T{tier}_CAPEITEM_FW_BRIDGEWATCH', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'FS_CAPE', label: 'Capa de Fort Sterling', template: 'T{tier}_CAPEITEM_FW_FORTSTERLING', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'LYM_CAPE', label: 'Capa de Lymhurst', template: 'T{tier}_CAPEITEM_FW_LYMHURST', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'MART_CAPE', label: 'Capa de Martlock', template: 'T{tier}_CAPEITEM_FW_MARTLOCK', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'THET_CAPE', label: 'Capa de Thetford', template: 'T{tier}_CAPEITEM_FW_THETFORD', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'CAE_CAPE', label: 'Capa de Caerleon', template: 'T{tier}_CAPEITEM_FW_CAERLEON', material: false, craftable: false, qualities: true, tiers: [4,5,6,7,8], enchants: [0] }
          ]
        }
      ]
    },
    {
      key: 'armor-plate',
      label: 'Armadura de placa',
      groups: [
        {
          key: 'plate-head',
          label: 'Elmos e capuzes',
          items: [
            { key: 'HEAD_PLATE_SET1', label: 'Capacete de soldado', template: 'T{tier}_HEAD_PLATE_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_PLATE_SET2', label: 'Capuz de guardião', template: 'T{tier}_HEAD_PLATE_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_PLATE_SET3', label: 'Capuz de cavaleiro', template: 'T{tier}_HEAD_PLATE_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'plate-armor',
          label: 'Armaduras',
          items: [
            { key: 'ARMOR_PLATE_SET1', label: 'Armadura de soldado', template: 'T{tier}_ARMOR_PLATE_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_PLATE_SET2', label: 'Armadura de guardião', template: 'T{tier}_ARMOR_PLATE_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_PLATE_SET3', label: 'Armadura de cavaleiro', template: 'T{tier}_ARMOR_PLATE_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'plate-shoes',
          label: 'Botas',
          items: [
            { key: 'SHOES_PLATE_SET1', label: 'Botas de soldado', template: 'T{tier}_SHOES_PLATE_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_PLATE_SET2', label: 'Botas de guardião', template: 'T{tier}_SHOES_PLATE_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_PLATE_SET3', label: 'Botas de cavaleiro', template: 'T{tier}_SHOES_PLATE_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        }
      ]
    },
    {
      key: 'armor-leather',
      label: 'Armadura de couro',
      groups: [
        {
          key: 'leather-head',
          label: 'Capuzes',
          items: [
            { key: 'HEAD_LEATHER_SET1', label: 'Capuz de mercenário', template: 'T{tier}_HEAD_LEATHER_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_LEATHER_SET2', label: 'Capuz de caçador', template: 'T{tier}_HEAD_LEATHER_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_LEATHER_SET3', label: 'Capuz de assassino', template: 'T{tier}_HEAD_LEATHER_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'leather-armor',
          label: 'Casacos',
          items: [
            { key: 'ARMOR_LEATHER_SET1', label: 'Casaco de mercenário', template: 'T{tier}_ARMOR_LEATHER_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_LEATHER_SET2', label: 'Casaco de caçador', template: 'T{tier}_ARMOR_LEATHER_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_LEATHER_SET3', label: 'Casaco de assassino', template: 'T{tier}_ARMOR_LEATHER_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'leather-shoes',
          label: 'Botas',
          items: [
            { key: 'SHOES_LEATHER_SET1', label: 'Botas de mercenário', template: 'T{tier}_SHOES_LEATHER_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_LEATHER_SET2', label: 'Botas de caçador', template: 'T{tier}_SHOES_LEATHER_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_LEATHER_SET3', label: 'Botas de assassino', template: 'T{tier}_SHOES_LEATHER_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        }
      ]
    },
    {
      key: 'armor-cloth',
      label: 'Armadura de pano',
      groups: [
        {
          key: 'cloth-head',
          label: 'Capuzes',
          items: [
            { key: 'HEAD_CLOTH_SET1', label: 'Capuz de estudioso', template: 'T{tier}_HEAD_CLOTH_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_CLOTH_SET2', label: 'Capuz de clérigo', template: 'T{tier}_HEAD_CLOTH_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'HEAD_CLOTH_SET3', label: 'Capuz de mago', template: 'T{tier}_HEAD_CLOTH_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'cloth-armor',
          label: 'Túnicas e robes',
          items: [
            { key: 'ARMOR_CLOTH_SET1', label: 'Túnica de estudioso', template: 'T{tier}_ARMOR_CLOTH_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_CLOTH_SET2', label: 'Túnica de clérigo', template: 'T{tier}_ARMOR_CLOTH_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'ARMOR_CLOTH_SET3', label: 'Robe de mago', template: 'T{tier}_ARMOR_CLOTH_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'cloth-shoes',
          label: 'Sandálias',
          items: [
            { key: 'SHOES_CLOTH_SET1', label: 'Sandálias de estudioso', template: 'T{tier}_SHOES_CLOTH_SET1', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_CLOTH_SET2', label: 'Sandálias de clérigo', template: 'T{tier}_SHOES_CLOTH_SET2', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'SHOES_CLOTH_SET3', label: 'Sandálias de mago', template: 'T{tier}_SHOES_CLOTH_SET3', craftable: true, qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        }
      ]
    },
    {
      key: 'weapons',
      label: 'Armas',
      groups: [
        {
          key: 'bows',
          label: 'Arcos',
          items: [
            { key: '2H_BOW', label: 'Arco', template: 'T{tier}_2H_BOW', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_LONGBOW', label: 'Arco longo', template: 'T{tier}_2H_LONGBOW', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_BOW_HELL', label: 'Arco sussurrante', template: 'T{tier}_2H_BOW_HELL', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'spears',
          label: 'Lanças',
          items: [
            { key: 'MAIN_SPEAR', label: 'Lança', template: 'T{tier}_MAIN_SPEAR', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_HARPOON', label: 'Arpão', template: 'T{tier}_2H_HARPOON', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: 'MAIN_SPEAR_KEEPER', label: 'Lança de guardião', template: 'T{tier}_MAIN_SPEAR_KEEPER', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'axes',
          label: 'Machados',
          items: [
            { key: 'MAIN_AXE', label: 'Machado de batalha', template: 'T{tier}_MAIN_AXE', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_AXE', label: 'Machado grande', template: 'T{tier}_2H_AXE', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_HALBERD', label: 'Alabarda', template: 'T{tier}_2H_HALBERD', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        },
        {
          key: 'swords',
          label: 'Espadas',
          items: [
            { key: 'MAIN_SWORD', label: 'Espada larga', template: 'T{tier}_MAIN_SWORD', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_CLAYMORE', label: 'Claymore', template: 'T{tier}_2H_CLAYMORE', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
            { key: '2H_DUALSWORD', label: 'Espadas duplas', template: 'T{tier}_2H_DUALSWORD', qualities: true, tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
          ]
        }
      ]
    },
    {
      key: 'consumables',
      label: 'Consumíveis',
      groups: [
        {
          key: 'food',
          label: 'Comidas',
          items: [
            { key: 'MEAL_OMELETTE', label: 'Omelete', template: 'T{tier}_MEAL_OMELETTE', qualities: false, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'MEAL_STEW', label: 'Ensopado', template: 'T{tier}_MEAL_STEW', qualities: false, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'MEAL_SOUP', label: 'Sopa', template: 'T{tier}_MEAL_SOUP', qualities: false, tiers: [4,5,6,7,8], enchants: [0] }
          ]
        },
        {
          key: 'potions',
          label: 'Poções',
          items: [
            { key: 'POTION_POISON', label: 'Poção venenosa', template: 'T{tier}_POTION_POISON', qualities: false, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'POTION_HEAL', label: 'Poção de cura', template: 'T{tier}_POTION_HEAL', qualities: false, tiers: [4,5,6,7,8], enchants: [0] },
            { key: 'POTION_REVIVE', label: 'Poção de resistência', template: 'T{tier}_POTION_REVIVE', qualities: false, tiers: [4,5,6,7,8], enchants: [0] }
          ]
        }
      ]
    }
  ];

  const allItems = [];
  families.forEach((family) => {
    family.groups.forEach((group) => {
      group.items.forEach((item) => {
        allItems.push({
          familyKey: family.key,
          familyLabel: family.label,
          groupKey: group.key,
          groupLabel: group.label,
          ...item
        });
      });
    });
  });

  const buildItemId = (item, tier, enchantment) => {
    const base = item.template.replace('{tier}', String(tier));
    return enchantment > 0 ? `${base}@${enchantment}` : base;
  };

  const renderName = ({ item, tier, enchantment = 0, quality = 1 }) => {
    const enchantLabel = enchantment > 0 ? `.${enchantment}` : '';
    const qualityLabel = item.qualities === false ? '' : ` · ${QUALITY_NAMES[quality] || QUALITY_NAMES[1]}`;
    return `${item.label} T${tier}${enchantLabel}${qualityLabel}`;
  };

  const iconUrl = (itemId, quality = 1) => `https://render.albiononline.com/v1/item/${encodeURIComponent(itemId)}.png?quality=${quality}&size=64`;

  const getScannerBaseItems = () => {
    const preferred = allItems.filter((item) => ['resources-raw','resources-refined','bags-capes','armor-leather','armor-cloth','armor-plate'].includes(item.familyKey));
    const ids = [];
    preferred.forEach((item) => {
      const tiers = item.familyKey.startsWith('resources') ? [4,5,6] : [4,5,6];
      const enchants = item.familyKey.startsWith('resources') ? [0] : [0,1];
      tiers.forEach((tier) => {
        if (!item.tiers.includes(tier)) return;
        enchants.forEach((enchant) => {
          if (!item.enchants.includes(enchant)) return;
          ids.push({
            itemId: buildItemId(item, tier, enchant),
            item,
            tier,
            enchantment: enchant,
            qualityRange: item.qualities === false ? [1] : [1,2,3]
          });
        });
      });
    });
    return ids;
  };

  const getFullScannerItems = () => {
    const ids = [];
    allItems.forEach((item) => {
      item.tiers.forEach((tier) => {
        item.enchants.forEach((enchantment) => {
          ids.push({
            itemId: buildItemId(item, tier, enchantment),
            item,
            tier,
            enchantment,
            qualityRange: item.qualities === false ? [1] : [1,2,3]
          });
        });
      });
    });
    return ids;
  };

  const itemById = new Map();
  allItems.forEach((item) => itemById.set(item.key, item));

  return {
    QUALITY_NAMES,
    ENCHANTMENT_NAMES,
    families,
    allItems,
    itemById,
    buildItemId,
    renderName,
    iconUrl,
    getScannerBaseItems,
    getFullScannerItems
  };
})();
