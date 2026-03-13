window.ALBION_CITIES = [
  "Bridgewatch",
  "Martlock",
  "Fort Sterling",
  "Lymhurst",
  "Thetford",
  "Caerleon"
];

window.ALBION_CATALOG = {
  bags: {
    label: "Bolsas e Capas",
    items: [
      { id: "BAG", name: "Bolsa do Aventureiro" },
      { id: "CAPEITEM_FW_BRIDGEWATCH", name: "Capa de Bridgewatch" },
      { id: "CAPEITEM_FW_MARTLOCK", name: "Capa de Martlock" },
      { id: "CAPEITEM_FW_LYMHURST", name: "Capa de Lymhurst" }
    ]
  },
  leather: {
    label: "Couro",
    items: [
      { id: "ARMOR_LEATHER_SET1_JACKET", name: "Casaco de Mercenário" },
      { id: "ARMOR_LEATHER_SET2_JACKET", name: "Casaco de Caçador" },
      { id: "ARMOR_LEATHER_SET3_JACKET", name: "Jaqueta de Assassino" },
      { id: "HEAD_LEATHER_SET1", name: "Capuz de Mercenário" },
      { id: "SHOES_LEATHER_SET1", name: "Sapatos de Mercenário" }
    ]
  },
  cloth: {
    label: "Pano",
    items: [
      { id: "ARMOR_CLOTH_SET1_ROBE", name: "Manto de Acadêmico" },
      { id: "ARMOR_CLOTH_SET2_ROBE", name: "Manto de Clérigo" },
      { id: "ARMOR_CLOTH_SET3_ROBE", name: "Manto de Mago" }
    ]
  },
  plate: {
    label: "Placa",
    items: [
      { id: "ARMOR_PLATE_SET1_JACKET", name: "Armadura de Soldado" },
      { id: "ARMOR_PLATE_SET2_JACKET", name: "Armadura de Cavaleiro" },
      { id: "ARMOR_PLATE_SET3_JACKET", name: "Armadura de Guardião" }
    ]
  },
  weapons: {
    label: "Armas",
    items: [
      { id: "2H_BOW", name: "Arco de Guerra" },
      { id: "2H_CROSSBOW", name: "Besta Pesada" },
      { id: "2H_DAGGERPAIR", name: "Adagas Duplas" },
      { id: "2H_SPEAR", name: "Lança" },
      { id: "2H_FIRESTAFF", name: "Cajado de Fogo" }
    ]
  },
  war: {
    label: "Mercado de Guerra",
    items: [
      { id: "ARMOR_LEATHER_SET3_JACKET", name: "Jaqueta de Assassino", tier: 6 },
      { id: "HEAD_LEATHER_SET3", name: "Capuz de Assassino", tier: 6 },
      { id: "SHOES_CLOTH_SET2", name: "Sandálias de Clérigo", tier: 6 },
      { id: "ARMOR_CLOTH_SET2_ROBE", name: "Manto de Clérigo", tier: 6 },
      { id: "2H_DAGGERPAIR", name: "Adagas Duplas", tier: 6 },
      { id: "2H_SPEAR", name: "Lança", tier: 6 },
      { id: "2H_BOW", name: "Arco de Guerra", tier: 6 },
      { id: "2H_CROSSBOW", name: "Besta Pesada", tier: 6 }
    ]
  },
  resources: {
    label: "Recursos",
    items: [
      { id: "HIDE", name: "Couro Bruto" },
      { id: "FIBER", name: "Fibra Bruta" },
      { id: "WOOD", name: "Madeira Bruta" },
      { id: "ORE", name: "Minério Bruto" },
      { id: "ROCK", name: "Pedra Bruta" }
    ]
  },
  animals: {
    label: "Animais",
    items: [
      { id: "T3_MOUNT_OX", name: "Boi T3", feed: "Cenoura" },
      { id: "T5_MOUNT_OX", name: "Boi T5", feed: "Cenoura" },
      { id: "T7_MOUNT_OX", name: "Boi T7", feed: "Abóbora" },
      { id: "T3_MOUNT_HORSE", name: "Cavalo T3", feed: "Feijão" },
      { id: "T5_MOUNT_HORSE", name: "Cavalo T5", feed: "Trigo" }
    ]
  }
};

window.RADAR_STRUCTURE = {
  Equipamentos: {
    Couro: window.ALBION_CATALOG.leather.items,
    Pano: window.ALBION_CATALOG.cloth.items,
    Placa: window.ALBION_CATALOG.plate.items,
    Armas: window.ALBION_CATALOG.weapons.items,
    Bolsas: window.ALBION_CATALOG.bags.items
  },
  Recursos: {
    Brutos: window.ALBION_CATALOG.resources.items
  },
  Animais: {
    Montarias: window.ALBION_CATALOG.animals.items
  }
};
