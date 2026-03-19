
(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const PLAN_KEY = 'albionTraderDailyPlan';
  const DEFAULT_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const RED_LOCATIONS = ['Caerleon'];
  const BLACK_LOCATIONS = ['Black Market'];
  const DEFAULT_FEE = 6.5;
  const ALL_ITEMS = [{"template": "T{tier}_ARTEFACT_HEAD_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Artefact Head Leather Avalon"}, {"template": "T{tier}_ARTEFACT_HEAD_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Artefact Head Leather Hell"}, {"template": "T{tier}_ARTEFACT_HEAD_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Artefact Head Leather Morgana"}, {"template": "T{tier}_ARTEFACT_HEAD_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Artefact Head Leather Undead"}, {"template": "T{tier}_HEAD_LEATHER_SET1", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Cabeça de couro 1"}, {"template": "T{tier}_HEAD_LEATHER_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Cabeça de couro 2"}, {"template": "T{tier}_HEAD_LEATHER_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Cabeça de couro 3"}, {"template": "T{tier}_HEAD_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Head Leather Avalon"}, {"template": "T{tier}_HEAD_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Head Leather Hell"}, {"template": "T{tier}_HEAD_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Head Leather Morgana"}, {"template": "T{tier}_HEAD_LEATHER_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Head Leather Royal"}, {"template": "T{tier}_HEAD_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Cabeça", "label": "Head Leather Undead"}, {"template": "T{tier}_ARMOR_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Armor Leather Avalon"}, {"template": "T{tier}_ARMOR_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Armor Leather Hell"}, {"template": "T{tier}_ARMOR_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Armor Leather Morgana"}, {"template": "T{tier}_ARMOR_LEATHER_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Armor Leather Royal"}, {"template": "T{tier}_ARMOR_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Armor Leather Undead"}, {"template": "T{tier}_ARTEFACT_ARMOR_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Artefact Armor Leather Avalon"}, {"template": "T{tier}_ARTEFACT_ARMOR_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Artefact Armor Leather Hell"}, {"template": "T{tier}_ARTEFACT_ARMOR_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Artefact Armor Leather Morgana"}, {"template": "T{tier}_ARTEFACT_ARMOR_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Artefact Armor Leather Undead"}, {"template": "T{tier}_ARMOR_LEATHER_SET1", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Peitoral de couro 1"}, {"template": "T{tier}_ARMOR_LEATHER_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Peitoral de couro 2"}, {"template": "T{tier}_ARMOR_LEATHER_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Peito", "label": "Peitoral de couro 3"}, {"template": "T{tier}_ARTEFACT_SHOES_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Artefact Shoes Leather Avalon"}, {"template": "T{tier}_ARTEFACT_SHOES_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Artefact Shoes Leather Hell"}, {"template": "T{tier}_ARTEFACT_SHOES_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Artefact Shoes Leather Morgana"}, {"template": "T{tier}_ARTEFACT_SHOES_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Artefact Shoes Leather Undead"}, {"template": "T{tier}_SHOES_LEATHER_SET1", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Botas de couro 1"}, {"template": "T{tier}_SHOES_LEATHER_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Botas de couro 2"}, {"template": "T{tier}_SHOES_LEATHER_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Botas de couro 3"}, {"template": "T{tier}_SHOES_LEATHER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Shoes Leather Avalon"}, {"template": "T{tier}_SHOES_LEATHER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Shoes Leather Hell"}, {"template": "T{tier}_SHOES_LEATHER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Shoes Leather Morgana"}, {"template": "T{tier}_SHOES_LEATHER_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Shoes Leather Royal"}, {"template": "T{tier}_SHOES_LEATHER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Couro Pés", "label": "Shoes Leather Undead"}, {"template": "T{tier}_ARTEFACT_HEAD_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Artefact Head Cloth Avalon"}, {"template": "T{tier}_ARTEFACT_HEAD_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Artefact Head Cloth Hell"}, {"template": "T{tier}_ARTEFACT_HEAD_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Artefact Head Cloth Keeper"}, {"template": "T{tier}_ARTEFACT_HEAD_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Artefact Head Cloth Morgana"}, {"template": "T{tier}_HEAD_CLOTH_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Cabeça de pano 1"}, {"template": "T{tier}_HEAD_CLOTH_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Cabeça de pano 2"}, {"template": "T{tier}_HEAD_CLOTH_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Cabeça de pano 3"}, {"template": "T{tier}_HEAD_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Head Cloth Avalon"}, {"template": "T{tier}_HEAD_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Head Cloth Hell"}, {"template": "T{tier}_HEAD_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Head Cloth Keeper"}, {"template": "T{tier}_HEAD_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Head Cloth Morgana"}, {"template": "T{tier}_HEAD_CLOTH_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Cabeça", "label": "Head Cloth Royal"}, {"template": "T{tier}_ARMOR_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Armor Cloth Avalon"}, {"template": "T{tier}_ARMOR_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Armor Cloth Hell"}, {"template": "T{tier}_ARMOR_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Armor Cloth Keeper"}, {"template": "T{tier}_ARMOR_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Armor Cloth Morgana"}, {"template": "T{tier}_ARMOR_CLOTH_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Armor Cloth Royal"}, {"template": "T{tier}_ARTEFACT_ARMOR_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Artefact Armor Cloth Avalon"}, {"template": "T{tier}_ARTEFACT_ARMOR_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Artefact Armor Cloth Hell"}, {"template": "T{tier}_ARTEFACT_ARMOR_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Artefact Armor Cloth Keeper"}, {"template": "T{tier}_ARTEFACT_ARMOR_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Artefact Armor Cloth Morgana"}, {"template": "T{tier}_ARMOR_CLOTH_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Peitoral de pano 1"}, {"template": "T{tier}_ARMOR_CLOTH_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Peitoral de pano 2"}, {"template": "T{tier}_ARMOR_CLOTH_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Peito", "label": "Peitoral de pano 3"}, {"template": "T{tier}_ARTEFACT_SHOES_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Artefact Shoes Cloth Avalon"}, {"template": "T{tier}_ARTEFACT_SHOES_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Artefact Shoes Cloth Hell"}, {"template": "T{tier}_ARTEFACT_SHOES_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Artefact Shoes Cloth Keeper"}, {"template": "T{tier}_ARTEFACT_SHOES_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Artefact Shoes Cloth Morgana"}, {"template": "T{tier}_SHOES_CLOTH_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Botas de pano 1"}, {"template": "T{tier}_SHOES_CLOTH_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Botas de pano 2"}, {"template": "T{tier}_SHOES_CLOTH_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Botas de pano 3"}, {"template": "T{tier}_SHOES_CLOTH_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Shoes Cloth Avalon"}, {"template": "T{tier}_SHOES_CLOTH_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Shoes Cloth Hell"}, {"template": "T{tier}_SHOES_CLOTH_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Shoes Cloth Keeper"}, {"template": "T{tier}_SHOES_CLOTH_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Shoes Cloth Morgana"}, {"template": "T{tier}_SHOES_CLOTH_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Pano Pés", "label": "Shoes Cloth Royal"}, {"template": "T{tier}_ARTEFACT_HEAD_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Artefact Head Plate Avalon"}, {"template": "T{tier}_ARTEFACT_HEAD_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Artefact Head Plate Hell"}, {"template": "T{tier}_ARTEFACT_HEAD_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Artefact Head Plate Keeper"}, {"template": "T{tier}_ARTEFACT_HEAD_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Artefact Head Plate Undead"}, {"template": "T{tier}_HEAD_PLATE_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Cabeça de placa 1"}, {"template": "T{tier}_HEAD_PLATE_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Cabeça de placa 2"}, {"template": "T{tier}_HEAD_PLATE_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Cabeça de placa 3"}, {"template": "T{tier}_HEAD_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Avalon"}, {"template": "T{tier}_HEAD_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Hell"}, {"template": "T{tier}_HEAD_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Keeper"}, {"template": "T{tier}_HEAD_PLATE_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Royal"}, {"template": "T{tier}_HEAD_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Undead"}, {"template": "T{tier}_HEAD_PLATE_VANITY_PERFTEST_HIGH", "tiers": [8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Vanity Perftest High"}, {"template": "T{tier}_HEAD_PLATE_VANITY_PERFTEST_NO_FX", "tiers": [8], "family": "Armaduras", "group": "Placa Cabeça", "label": "Head Plate Vanity Perftest No Fx"}, {"template": "T{tier}_ARMOR_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Avalon"}, {"template": "T{tier}_ARMOR_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Hell"}, {"template": "T{tier}_ARMOR_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Keeper"}, {"template": "T{tier}_ARMOR_PLATE_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Royal"}, {"template": "T{tier}_ARMOR_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Undead"}, {"template": "T{tier}_ARMOR_PLATE_VANITY_PERFTEST_HIGH", "tiers": [8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Vanity Perftest High"}, {"template": "T{tier}_ARMOR_PLATE_VANITY_PERFTEST_MESHONLY", "tiers": [8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Vanity Perftest Meshonly"}, {"template": "T{tier}_ARMOR_PLATE_VANITY_PERFTEST_PARTICLEONLY", "tiers": [8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Vanity Perftest Particleonly"}, {"template": "T{tier}_ARMOR_PLATE_VANITY_PERFTEST_VERYHIGH", "tiers": [8], "family": "Armaduras", "group": "Placa Peito", "label": "Armor Plate Vanity Perftest Veryhigh"}, {"template": "T{tier}_ARTEFACT_ARMOR_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Artefact Armor Plate Avalon"}, {"template": "T{tier}_ARTEFACT_ARMOR_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Artefact Armor Plate Hell"}, {"template": "T{tier}_ARTEFACT_ARMOR_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Artefact Armor Plate Keeper"}, {"template": "T{tier}_ARTEFACT_ARMOR_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Artefact Armor Plate Undead"}, {"template": "T{tier}_ARMOR_PLATE_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Peitoral de placa 1"}, {"template": "T{tier}_ARMOR_PLATE_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Peitoral de placa 2"}, {"template": "T{tier}_ARMOR_PLATE_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Peito", "label": "Peitoral de placa 3"}, {"template": "T{tier}_ARTEFACT_SHOES_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Artefact Shoes Plate Avalon"}, {"template": "T{tier}_ARTEFACT_SHOES_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Artefact Shoes Plate Hell"}, {"template": "T{tier}_ARTEFACT_SHOES_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Artefact Shoes Plate Keeper"}, {"template": "T{tier}_ARTEFACT_SHOES_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Artefact Shoes Plate Undead"}, {"template": "T{tier}_SHOES_PLATE_SET1", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Botas de placa 1"}, {"template": "T{tier}_SHOES_PLATE_SET2", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Botas de placa 2"}, {"template": "T{tier}_SHOES_PLATE_SET3", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Botas de placa 3"}, {"template": "T{tier}_SHOES_PLATE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Avalon"}, {"template": "T{tier}_SHOES_PLATE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Hell"}, {"template": "T{tier}_SHOES_PLATE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Keeper"}, {"template": "T{tier}_SHOES_PLATE_ROYAL", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Royal"}, {"template": "T{tier}_SHOES_PLATE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Undead"}, {"template": "T{tier}_SHOES_PLATE_VANITY_PERFTEST_HIGH", "tiers": [8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Vanity Perftest High"}, {"template": "T{tier}_SHOES_PLATE_VANITY_PERFTEST_MESHONLY", "tiers": [8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Vanity Perftest Meshonly"}, {"template": "T{tier}_SHOES_PLATE_VANITY_PERFTEST_NO_FX", "tiers": [8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Vanity Perftest No Fx"}, {"template": "T{tier}_SHOES_PLATE_VANITY_PERFTEST_PARTICLEONLY", "tiers": [8], "family": "Armaduras", "group": "Placa Pés", "label": "Shoes Plate Vanity Perftest Particleonly"}, {"template": "T{tier}_2H_DAGGER_KATAR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Adagas", "label": "2H Dagger Katar Avalon"}, {"template": "T{tier}_2H_DAGGERPAIR", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Adagas", "label": "2H Daggerpair"}, {"template": "T{tier}_ARTEFACT_2H_DAGGER_KATAR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Adagas", "label": "Artefact 2H Dagger Katar Avalon"}, {"template": "T{tier}_MAIN_DAGGER", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Adagas", "label": "Main Dagger"}, {"template": "T{tier}_2H_ARCANE_RINGPAIR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "2H Arcane Ringpair Avalon"}, {"template": "T{tier}_2H_ARCANESTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "2H Arcanestaff"}, {"template": "T{tier}_2H_ARCANESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "2H Arcanestaff Hell"}, {"template": "T{tier}_ARTEFACT_2H_ARCANE_RINGPAIR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "Artefact 2H Arcane Ringpair Avalon"}, {"template": "T{tier}_ARTEFACT_2H_ARCANESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "Artefact 2H Arcanestaff Hell"}, {"template": "T{tier}_ARTEFACT_MAIN_ARCANESTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "Artefact Main Arcanestaff Undead"}, {"template": "T{tier}_MAIN_ARCANESTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "Main Arcanestaff"}, {"template": "T{tier}_MAIN_ARCANESTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcano", "label": "Main Arcanestaff Undead"}, {"template": "T{tier}_2H_BOW", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Bow"}, {"template": "T{tier}_2H_BOW_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Bow Avalon"}, {"template": "T{tier}_2H_BOW_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Bow Hell"}, {"template": "T{tier}_2H_BOW_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Bow Keeper"}, {"template": "T{tier}_2H_CROSSBOW", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Crossbow"}, {"template": "T{tier}_2H_CROSSBOW_CANNON_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Crossbow Cannon Avalon"}, {"template": "T{tier}_2H_CROSSBOWLARGE", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Crossbowlarge"}, {"template": "T{tier}_2H_CROSSBOWLARGE_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Crossbowlarge Morgana"}, {"template": "T{tier}_2H_DUALCROSSBOW_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Dualcrossbow Hell"}, {"template": "T{tier}_2H_LONGBOW", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Longbow"}, {"template": "T{tier}_2H_LONGBOW_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Longbow Undead"}, {"template": "T{tier}_2H_REPEATINGCROSSBOW_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Repeatingcrossbow Undead"}, {"template": "T{tier}_2H_WARBOW", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "2H Warbow"}, {"template": "T{tier}_ARTEFACT_2H_BOW_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Bow Avalon"}, {"template": "T{tier}_ARTEFACT_2H_BOW_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Bow Hell"}, {"template": "T{tier}_ARTEFACT_2H_BOW_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Bow Keeper"}, {"template": "T{tier}_ARTEFACT_2H_CROSSBOW_CANNON_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Crossbow Cannon Avalon"}, {"template": "T{tier}_ARTEFACT_2H_CROSSBOWLARGE_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Crossbowlarge Morgana"}, {"template": "T{tier}_ARTEFACT_2H_DUALCROSSBOW_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Dualcrossbow Hell"}, {"template": "T{tier}_ARTEFACT_2H_LONGBOW_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Longbow Undead"}, {"template": "T{tier}_ARTEFACT_2H_REPEATINGCROSSBOW_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Artefact 2H Repeatingcrossbow Undead"}, {"template": "T{tier}_MAIN_1HCROSSBOW", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Arcos", "label": "Main 1Hcrossbow"}, {"template": "T{tier}_2H_QUARTERSTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Bastões", "label": "2H Quarterstaff"}, {"template": "T{tier}_2H_QUARTERSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Bastões", "label": "2H Quarterstaff Avalon"}, {"template": "T{tier}_ARTEFACT_2H_QUARTERSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Bastões", "label": "Artefact 2H Quarterstaff Avalon"}, {"template": "T{tier}_2H_DUALSWORD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Espadas", "label": "2H Dualsword"}, {"template": "T{tier}_MAIN_SWORD", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Espadas", "label": "Main Sword"}, {"template": "T{tier}_2H_FIRE_RINGPAIR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "2H Fire Ringpair Avalon"}, {"template": "T{tier}_2H_FIRESTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "2H Firestaff"}, {"template": "T{tier}_2H_FIRESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "2H Firestaff Hell"}, {"template": "T{tier}_ARTEFACT_2H_FIRE_RINGPAIR_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "Artefact 2H Fire Ringpair Avalon"}, {"template": "T{tier}_ARTEFACT_2H_FIRESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "Artefact 2H Firestaff Hell"}, {"template": "T{tier}_ARTEFACT_MAIN_FIRESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "Artefact Main Firestaff Keeper"}, {"template": "T{tier}_MAIN_FIRESTAFF", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "Main Firestaff"}, {"template": "T{tier}_MAIN_FIRESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Fogo", "label": "Main Firestaff Keeper"}, {"template": "T{tier}_2H_FROSTSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "2H Froststaff"}, {"template": "T{tier}_ARTEFACT_MAIN_FROSTSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "Artefact Main Froststaff Avalon"}, {"template": "T{tier}_ARTEFACT_MAIN_FROSTSTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "Artefact Main Froststaff Keeper"}, {"template": "T{tier}_MAIN_FROSTSTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "Main Froststaff"}, {"template": "T{tier}_MAIN_FROSTSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "Main Froststaff Avalon"}, {"template": "T{tier}_MAIN_FROSTSTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Gelo", "label": "Main Froststaff Keeper"}, {"template": "T{tier}_2H_SPEAR", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "2H Spear"}, {"template": "T{tier}_ARTEFACT_MAIN_SPEAR_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "Artefact Main Spear Keeper"}, {"template": "T{tier}_ARTEFACT_MAIN_SPEAR_LANCE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "Artefact Main Spear Lance Avalon"}, {"template": "T{tier}_MAIN_SPEAR", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "Main Spear"}, {"template": "T{tier}_MAIN_SPEAR_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "Main Spear Keeper"}, {"template": "T{tier}_MAIN_SPEAR_LANCE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Lanças", "label": "Main Spear Lance Avalon"}, {"template": "T{tier}_2H_AXE", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "2H Axe"}, {"template": "T{tier}_2H_AXE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "2H Axe Avalon"}, {"template": "T{tier}_2H_DUALAXE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "2H Dualaxe Keeper"}, {"template": "T{tier}_2H_TOOL_AXE", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "2H Tool Axe"}, {"template": "T{tier}_2H_TOOL_AXE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "2H Tool Axe Avalon"}, {"template": "T{tier}_ARTEFACT_2H_AXE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "Artefact 2H Axe Avalon"}, {"template": "T{tier}_ARTEFACT_2H_DUALAXE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "Artefact 2H Dualaxe Keeper"}, {"template": "T{tier}_MAIN_AXE", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Machados", "label": "Main Axe"}, {"template": "T{tier}_2H_CURSEDSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "2H Cursedstaff"}, {"template": "T{tier}_2H_CURSEDSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "2H Cursedstaff Morgana"}, {"template": "T{tier}_ARTEFACT_2H_CURSEDSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Artefact 2H Cursedstaff Morgana"}, {"template": "T{tier}_ARTEFACT_MAIN_CURSEDSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Artefact Main Cursedstaff Avalon"}, {"template": "T{tier}_ARTEFACT_MAIN_CURSEDSTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Artefact Main Cursedstaff Undead"}, {"template": "T{tier}_MAIN_CURSEDSTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Main Cursedstaff"}, {"template": "T{tier}_MAIN_CURSEDSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Main Cursedstaff Avalon"}, {"template": "T{tier}_MAIN_CURSEDSTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maldição", "label": "Main Cursedstaff Undead"}, {"template": "T{tier}_2H_DUALHAMMER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Dualhammer Hell"}, {"template": "T{tier}_2H_HAMMER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Hammer"}, {"template": "T{tier}_2H_HAMMER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Hammer Avalon"}, {"template": "T{tier}_2H_HAMMER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Hammer Undead"}, {"template": "T{tier}_2H_POLEHAMMER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Polehammer"}, {"template": "T{tier}_2H_TOOL_HAMMER", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Tool Hammer"}, {"template": "T{tier}_2H_TOOL_HAMMER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Tool Hammer Avalon"}, {"template": "T{tier}_2H_TOOL_SIEGEHAMMER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Tool Siegehammer"}, {"template": "T{tier}_2H_TOOL_SIEGEHAMMER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "2H Tool Siegehammer Avalon"}, {"template": "T{tier}_ARTEFACT_2H_DUALHAMMER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "Artefact 2H Dualhammer Hell"}, {"template": "T{tier}_ARTEFACT_2H_HAMMER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "Artefact 2H Hammer Avalon"}, {"template": "T{tier}_ARTEFACT_2H_HAMMER_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "Artefact 2H Hammer Undead"}, {"template": "T{tier}_MAIN_HAMMER", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Martelos", "label": "Main Hammer"}, {"template": "T{tier}_2H_DUALMACE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "2H Dualmace Avalon"}, {"template": "T{tier}_2H_MACE", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "2H Mace"}, {"template": "T{tier}_2H_MACE_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "2H Mace Morgana"}, {"template": "T{tier}_ARTEFACT_2H_DUALMACE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Artefact 2H Dualmace Avalon"}, {"template": "T{tier}_ARTEFACT_2H_MACE_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Artefact 2H Mace Morgana"}, {"template": "T{tier}_ARTEFACT_MAIN_MACE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Artefact Main Mace Hell"}, {"template": "T{tier}_ARTEFACT_MAIN_ROCKMACE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Artefact Main Rockmace Keeper"}, {"template": "T{tier}_MAIN_MACE", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Main Mace"}, {"template": "T{tier}_MAIN_MACE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Main Mace Hell"}, {"template": "T{tier}_MAIN_ROCKMACE_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Maças", "label": "Main Rockmace Keeper"}, {"template": "T{tier}_2H_NATURESTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "2H Naturestaff"}, {"template": "T{tier}_2H_NATURESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "2H Naturestaff Hell"}, {"template": "T{tier}_2H_NATURESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "2H Naturestaff Keeper"}, {"template": "T{tier}_ARTEFACT_2H_NATURESTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Artefact 2H Naturestaff Hell"}, {"template": "T{tier}_ARTEFACT_2H_NATURESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Artefact 2H Naturestaff Keeper"}, {"template": "T{tier}_ARTEFACT_MAIN_NATURESTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Artefact Main Naturestaff Avalon"}, {"template": "T{tier}_ARTEFACT_MAIN_NATURESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Artefact Main Naturestaff Keeper"}, {"template": "T{tier}_MAIN_NATURESTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Main Naturestaff"}, {"template": "T{tier}_MAIN_NATURESTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Main Naturestaff Avalon"}, {"template": "T{tier}_MAIN_NATURESTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Natureza", "label": "Main Naturestaff Keeper"}, {"template": "T{tier}_2H_CLAWPAIR", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Clawpair"}, {"template": "T{tier}_2H_CLAYMORE", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Claymore"}, {"template": "T{tier}_2H_CLAYMORE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Claymore Avalon"}, {"template": "T{tier}_2H_CLEAVER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Cleaver Hell"}, {"template": "T{tier}_2H_COMBATSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Combatstaff Morgana"}, {"template": "T{tier}_2H_DEMONICSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Demonicstaff"}, {"template": "T{tier}_2H_DIVINESTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Divinestaff"}, {"template": "T{tier}_2H_DOUBLEBLADEDSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Doublebladedstaff"}, {"template": "T{tier}_2H_DUALSCIMITAR_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Dualscimitar Undead"}, {"template": "T{tier}_2H_DUALSICKLE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Dualsickle Undead"}, {"template": "T{tier}_2H_ENIGMATICSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Enigmaticstaff"}, {"template": "T{tier}_2H_FLAIL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Flail"}, {"template": "T{tier}_2H_GLACIALSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Glacialstaff"}, {"template": "T{tier}_2H_GLAIVE", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Glaive"}, {"template": "T{tier}_2H_HALBERD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Halberd"}, {"template": "T{tier}_2H_HALBERD_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Halberd Morgana"}, {"template": "T{tier}_2H_HARPOON_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Harpoon Hell"}, {"template": "T{tier}_2H_ICECRYSTAL_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Icecrystal Undead"}, {"template": "T{tier}_2H_ICEGAUNTLETS_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Icegauntlets Hell"}, {"template": "T{tier}_2H_INFERNOSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Infernostaff"}, {"template": "T{tier}_2H_INFERNOSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Infernostaff Morgana"}, {"template": "T{tier}_2H_IRONCLADEDSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Ironcladedstaff"}, {"template": "T{tier}_2H_IRONGAUNTLETS_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Irongauntlets Hell"}, {"template": "T{tier}_2H_RAM_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Ram Keeper"}, {"template": "T{tier}_2H_ROCKSTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Rockstaff Keeper"}, {"template": "T{tier}_2H_SCYTHE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Scythe Hell"}, {"template": "T{tier}_2H_TOOL_FISHINGROD", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Fishingrod"}, {"template": "T{tier}_2H_TOOL_FISHINGROD_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Fishingrod Avalon"}, {"template": "T{tier}_2H_TOOL_KNIFE", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Knife"}, {"template": "T{tier}_2H_TOOL_KNIFE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Knife Avalon"}, {"template": "T{tier}_2H_TOOL_PICK", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Pick"}, {"template": "T{tier}_2H_TOOL_PICK_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Pick Avalon"}, {"template": "T{tier}_2H_TOOL_SICKLE", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Sickle"}, {"template": "T{tier}_2H_TOOL_SICKLE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Tool Sickle Avalon"}, {"template": "T{tier}_2H_TRIDENT_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Trident Undead"}, {"template": "T{tier}_2H_TWINSCYTHE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Twinscythe Hell"}, {"template": "T{tier}_2H_WILDSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "2H Wildstaff"}, {"template": "T{tier}_ARTEFACT_2H_CLAYMORE_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Claymore Avalon"}, {"template": "T{tier}_ARTEFACT_2H_CLEAVER_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Cleaver Hell"}, {"template": "T{tier}_ARTEFACT_2H_COMBATSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Combatstaff Morgana"}, {"template": "T{tier}_ARTEFACT_2H_DUALSCIMITAR_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Dualscimitar Undead"}, {"template": "T{tier}_ARTEFACT_2H_DUALSICKLE_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Dualsickle Undead"}, {"template": "T{tier}_ARTEFACT_2H_HALBERD_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Halberd Morgana"}, {"template": "T{tier}_ARTEFACT_2H_HARPOON_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Harpoon Hell"}, {"template": "T{tier}_ARTEFACT_2H_ICECRYSTAL_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Icecrystal Undead"}, {"template": "T{tier}_ARTEFACT_2H_ICEGAUNTLETS_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Icegauntlets Hell"}, {"template": "T{tier}_ARTEFACT_2H_INFERNOSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Infernostaff Morgana"}, {"template": "T{tier}_ARTEFACT_2H_IRONGAUNTLETS_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Irongauntlets Hell"}, {"template": "T{tier}_ARTEFACT_2H_RAM_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Ram Keeper"}, {"template": "T{tier}_ARTEFACT_2H_ROCKSTAFF_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Rockstaff Keeper"}, {"template": "T{tier}_ARTEFACT_2H_SCYTHE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Scythe Hell"}, {"template": "T{tier}_ARTEFACT_2H_TRIDENT_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Trident Undead"}, {"template": "T{tier}_ARTEFACT_2H_TWINSCYTHE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact 2H Twinscythe Hell"}, {"template": "T{tier}_ARTEFACT_MAIN_RAPIER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact Main Rapier Morgana"}, {"template": "T{tier}_ARTEFACT_MAIN_SCIMITAR_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Artefact Main Scimitar Morgana"}, {"template": "T{tier}_MAIN_RAPIER_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Main Rapier Morgana"}, {"template": "T{tier}_MAIN_SCIMITAR_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Outras", "label": "Main Scimitar Morgana"}, {"template": "T{tier}_MAIN_SUMMONERSTAFF_PROTOTYPE", "tiers": [7], "family": "Armas", "group": "Outras", "label": "Main Summonerstaff Prototype"}, {"template": "T{tier}_2H_HOLYSTAFF", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "2H Holystaff"}, {"template": "T{tier}_2H_HOLYSTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "2H Holystaff Hell"}, {"template": "T{tier}_2H_HOLYSTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "2H Holystaff Undead"}, {"template": "T{tier}_ARTEFACT_2H_HOLYSTAFF_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Artefact 2H Holystaff Hell"}, {"template": "T{tier}_ARTEFACT_2H_HOLYSTAFF_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Artefact 2H Holystaff Undead"}, {"template": "T{tier}_ARTEFACT_MAIN_HOLYSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Artefact Main Holystaff Avalon"}, {"template": "T{tier}_ARTEFACT_MAIN_HOLYSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Artefact Main Holystaff Morgana"}, {"template": "T{tier}_MAIN_HOLYSTAFF", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Main Holystaff"}, {"template": "T{tier}_MAIN_HOLYSTAFF_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Main Holystaff Avalon"}, {"template": "T{tier}_MAIN_HOLYSTAFF_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Sagrado", "label": "Main Holystaff Morgana"}, {"template": "T{tier}_2H_ENIGMATICORB_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "2H Enigmaticorb Morgana"}, {"template": "T{tier}_2H_SKULLORB_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "2H Skullorb Hell"}, {"template": "T{tier}_ARTEFACT_2H_ENIGMATICORB_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact 2H Enigmaticorb Morgana"}, {"template": "T{tier}_ARTEFACT_2H_SKULLORB_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact 2H Skullorb Hell"}, {"template": "T{tier}_ARTEFACT_OFF_CENSER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Censer Avalon"}, {"template": "T{tier}_ARTEFACT_OFF_DEMONSKULL_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Demonskull Hell"}, {"template": "T{tier}_ARTEFACT_OFF_HORN_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Horn Keeper"}, {"template": "T{tier}_ARTEFACT_OFF_JESTERCANE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Jestercane Hell"}, {"template": "T{tier}_ARTEFACT_OFF_LAMP_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Lamp Undead"}, {"template": "T{tier}_ARTEFACT_OFF_ORB_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Orb Morgana"}, {"template": "T{tier}_ARTEFACT_OFF_SHIELD_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Shield Avalon"}, {"template": "T{tier}_ARTEFACT_OFF_SHIELD_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Shield Hell"}, {"template": "T{tier}_ARTEFACT_OFF_SPIKEDSHIELD_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Spikedshield Morgana"}, {"template": "T{tier}_ARTEFACT_OFF_TALISMAN_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Talisman Avalon"}, {"template": "T{tier}_ARTEFACT_OFF_TOTEM_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Totem Keeper"}, {"template": "T{tier}_ARTEFACT_OFF_TOWERSHIELD_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Artefact Off Towershield Undead"}, {"template": "T{tier}_FURNITUREITEM_GUILDBANNER_SHIELD", "tiers": [2, 3, 4, 5], "family": "Armas", "group": "Secundárias", "label": "Furnitureitem Guildbanner Shield"}, {"template": "T{tier}_OFF_BOOK", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Book"}, {"template": "T{tier}_OFF_CENSER_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Censer Avalon"}, {"template": "T{tier}_OFF_DEMONSKULL_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Demonskull Hell"}, {"template": "T{tier}_OFF_HORN_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Horn Keeper"}, {"template": "T{tier}_OFF_JESTERCANE_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Jestercane Hell"}, {"template": "T{tier}_OFF_LAMP_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Lamp Undead"}, {"template": "T{tier}_OFF_ORB_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Orb Morgana"}, {"template": "T{tier}_OFF_SHIELD", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Shield"}, {"template": "T{tier}_OFF_SHIELD_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Shield Avalon"}, {"template": "T{tier}_OFF_SHIELD_HELL", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Shield Hell"}, {"template": "T{tier}_OFF_SPIKEDSHIELD_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Spikedshield Morgana"}, {"template": "T{tier}_OFF_TALISMAN_AVALON", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Talisman Avalon"}, {"template": "T{tier}_OFF_TORCH", "tiers": [3, 4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Torch"}, {"template": "T{tier}_OFF_TOTEM_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Totem Keeper"}, {"template": "T{tier}_OFF_TOWERSHIELD_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Armas", "group": "Secundárias", "label": "Off Towershield Undead"}, {"template": "T{tier}_SKILLBOOK_STANDARD", "tiers": [4], "family": "Armas", "group": "Secundárias", "label": "Skillbook Standard"}, {"template": "T{tier}_MEAL_OMELETTE", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Omelette"}, {"template": "T{tier}_MEAL_OMELETTE_AVALON", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Omelette Avalon"}, {"template": "T{tier}_MEAL_OMELETTE_FISH", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Omelette Fish"}, {"template": "T{tier}_MEAL_PIE", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Pie"}, {"template": "T{tier}_MEAL_PIE_FISH", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Pie Fish"}, {"template": "T{tier}_MEAL_ROAST", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Roast"}, {"template": "T{tier}_MEAL_ROAST_FISH", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Comidas", "label": "Meal Roast Fish"}, {"template": "T{tier}_MEAL_SALAD", "tiers": [2, 4, 6], "family": "Consumíveis", "group": "Comidas", "label": "Meal Salad"}, {"template": "T{tier}_MEAL_SALAD_FISH", "tiers": [2, 4, 6], "family": "Consumíveis", "group": "Comidas", "label": "Meal Salad Fish"}, {"template": "T{tier}_MEAL_SANDWICH", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Sandwich"}, {"template": "T{tier}_MEAL_SANDWICH_AVALON", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Sandwich Avalon"}, {"template": "T{tier}_MEAL_SANDWICH_FISH", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Sandwich Fish"}, {"template": "T{tier}_MEAL_SOUP", "tiers": [1, 3, 5], "family": "Consumíveis", "group": "Comidas", "label": "Meal Soup"}, {"template": "T{tier}_MEAL_SOUP_FISH", "tiers": [1, 3, 5], "family": "Consumíveis", "group": "Comidas", "label": "Meal Soup Fish"}, {"template": "T{tier}_MEAL_STEW", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Stew"}, {"template": "T{tier}_MEAL_STEW_AVALON", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Stew Avalon"}, {"template": "T{tier}_MEAL_STEW_FISH", "tiers": [4, 6, 8], "family": "Consumíveis", "group": "Comidas", "label": "Meal Stew Fish"}, {"template": "T{tier}_POTION_CLEANSE", "tiers": [8], "family": "Consumíveis", "group": "Poções", "label": "Potion Cleanse"}, {"template": "T{tier}_POTION_ENERGY", "tiers": [2, 4, 6], "family": "Consumíveis", "group": "Poções", "label": "Potion Energy"}, {"template": "T{tier}_POTION_HEAL", "tiers": [2, 4, 6], "family": "Consumíveis", "group": "Poções", "label": "Potion Heal"}, {"template": "T{tier}_POTION_REVIVE", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Poções", "label": "Potion Revive"}, {"template": "T{tier}_POTION_SLOWFIELD", "tiers": [3, 5, 7], "family": "Consumíveis", "group": "Poções", "label": "Potion Slowfield"}, {"template": "T{tier}_FARM_BURDOCK_SEED", "tiers": [4], "family": "Fazenda e montarias", "group": "Criação", "label": "Burdock Seed"}, {"template": "T{tier}_FARM_CABBAGE_SEED", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Cabbage Seed"}, {"template": "T{tier}_FARM_CHICKEN_BABY", "tiers": [3], "family": "Fazenda e montarias", "group": "Criação", "label": "Chicken Baby"}, {"template": "T{tier}_FARM_CHICKEN_GROWN", "tiers": [3], "family": "Fazenda e montarias", "group": "Criação", "label": "Chicken Grown"}, {"template": "T{tier}_FARM_COMFREY_SEED", "tiers": [3], "family": "Fazenda e montarias", "group": "Criação", "label": "Comfrey Seed"}, {"template": "T{tier}_FARM_CORN_SEED", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Corn Seed"}, {"template": "T{tier}_FARM_COUGAR_BABY", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Cougar Baby"}, {"template": "T{tier}_FARM_COUGAR_GROWN", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Cougar Grown"}, {"template": "T{tier}_FARM_COW_BABY", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Cow Baby"}, {"template": "T{tier}_FARM_COW_GROWN", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Cow Grown"}, {"template": "T{tier}_FARM_DIREBEAR_BABY", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direbear Baby"}, {"template": "T{tier}_FARM_DIREBEAR_FW_FORTSTERLING_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direbear Fw Fortsterling Baby"}, {"template": "T{tier}_FARM_DIREBEAR_FW_FORTSTERLING_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direbear Fw Fortsterling Grown"}, {"template": "T{tier}_FARM_DIREBEAR_GROWN", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direbear Grown"}, {"template": "T{tier}_FARM_DIREBOAR_BABY", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Direboar Baby"}, {"template": "T{tier}_FARM_DIREBOAR_FW_LYMHURST_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direboar Fw Lymhurst Baby"}, {"template": "T{tier}_FARM_DIREBOAR_FW_LYMHURST_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direboar Fw Lymhurst Grown"}, {"template": "T{tier}_FARM_DIREBOAR_GROWN", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Direboar Grown"}, {"template": "T{tier}_FARM_DIREWOLF_BABY", "tiers": [6, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direwolf Baby"}, {"template": "T{tier}_FARM_DIREWOLF_GROWN", "tiers": [6, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Direwolf Grown"}, {"template": "T{tier}_FARM_FOXGLOVE_SEED", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Foxglove Seed"}, {"template": "T{tier}_FARM_GIANTSTAG_BABY", "tiers": [4, 6], "family": "Fazenda e montarias", "group": "Criação", "label": "Giantstag Baby"}, {"template": "T{tier}_FARM_GIANTSTAG_GROWN", "tiers": [4, 6], "family": "Fazenda e montarias", "group": "Criação", "label": "Giantstag Grown"}, {"template": "T{tier}_FARM_GIANTSTAG_MOOSE_BABY", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Giantstag Moose Baby"}, {"template": "T{tier}_FARM_GIANTSTAG_MOOSE_GROWN", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Giantstag Moose Grown"}, {"template": "T{tier}_FARM_GOAT_BABY", "tiers": [4], "family": "Fazenda e montarias", "group": "Criação", "label": "Goat Baby"}, {"template": "T{tier}_FARM_GOAT_GROWN", "tiers": [4], "family": "Fazenda e montarias", "group": "Criação", "label": "Goat Grown"}, {"template": "T{tier}_FARM_GOOSE_BABY", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Goose Baby"}, {"template": "T{tier}_FARM_GOOSE_GROWN", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Goose Grown"}, {"template": "T{tier}_FARM_GREYWOLF_FW_CAERLEON_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Greywolf Fw Caerleon Baby"}, {"template": "T{tier}_FARM_GREYWOLF_FW_CAERLEON_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Greywolf Fw Caerleon Grown"}, {"template": "T{tier}_FARM_HORSE_BABY", "tiers": [3, 4, 5, 6, 7, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Horse Baby"}, {"template": "T{tier}_FARM_HORSE_GROWN", "tiers": [3, 4, 5, 6, 7, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Horse Grown"}, {"template": "T{tier}_FARM_MAMMOTH_BABY", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Mammoth Baby"}, {"template": "T{tier}_FARM_MAMMOTH_GROWN", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Mammoth Grown"}, {"template": "T{tier}_FARM_MOABIRD_FW_BRIDGEWATCH_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Moabird Fw Bridgewatch Baby"}, {"template": "T{tier}_FARM_MOABIRD_FW_BRIDGEWATCH_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Moabird Fw Bridgewatch Grown"}, {"template": "T{tier}_MOUNTUPGRADE_COUGAR_KEEPER", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Mountupgrade Cougar Keeper"}, {"template": "T{tier}_MOUNTUPGRADE_GIANTSTAG_XMAS", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Mountupgrade Giantstag Xmas"}, {"template": "T{tier}_MOUNTUPGRADE_HORSE_CURSE", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Mountupgrade Horse Curse"}, {"template": "T{tier}_MOUNTUPGRADE_HORSE_MORGANA", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Mountupgrade Horse Morgana"}, {"template": "T{tier}_FARM_MULLEIN_SEED", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Mullein Seed"}, {"template": "T{tier}_FARM_OX_BABY", "tiers": [3, 4, 5, 6, 7, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Ox Baby"}, {"template": "T{tier}_FARM_OX_GROWN", "tiers": [3, 4, 5, 6, 7, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Ox Grown"}, {"template": "T{tier}_FARM_PIG_BABY", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Pig Baby"}, {"template": "T{tier}_FARM_PIG_GROWN", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Pig Grown"}, {"template": "T{tier}_FARM_POTATO_SEED", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Potato Seed"}, {"template": "T{tier}_FARM_PUMPKIN_SEED", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Pumpkin Seed"}, {"template": "T{tier}_FARM_RAM_FW_MARTLOCK_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Ram Fw Martlock Baby"}, {"template": "T{tier}_FARM_RAM_FW_MARTLOCK_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Ram Fw Martlock Grown"}, {"template": "T{tier}_FARM_SHEEP_BABY", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Sheep Baby"}, {"template": "T{tier}_FARM_SHEEP_GROWN", "tiers": [6], "family": "Fazenda e montarias", "group": "Criação", "label": "Sheep Grown"}, {"template": "T{tier}_FARM_SWAMPDRAGON_BABY", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Swampdragon Baby"}, {"template": "T{tier}_FARM_SWAMPDRAGON_FW_THETFORD_BABY", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Swampdragon Fw Thetford Baby"}, {"template": "T{tier}_FARM_SWAMPDRAGON_FW_THETFORD_GROWN", "tiers": [5, 8], "family": "Fazenda e montarias", "group": "Criação", "label": "Swampdragon Fw Thetford Grown"}, {"template": "T{tier}_FARM_SWAMPDRAGON_GROWN", "tiers": [7], "family": "Fazenda e montarias", "group": "Criação", "label": "Swampdragon Grown"}, {"template": "T{tier}_FARM_TEASEL_SEED", "tiers": [5], "family": "Fazenda e montarias", "group": "Criação", "label": "Teasel Seed"}, {"template": "T{tier}_FARM_TURNIP_SEED", "tiers": [4], "family": "Fazenda e montarias", "group": "Criação", "label": "Turnip Seed"}, {"template": "T{tier}_FARM_WHEAT_SEED", "tiers": [3], "family": "Fazenda e montarias", "group": "Criação", "label": "Wheat Seed"}, {"template": "T{tier}_FARM_YARROW_SEED", "tiers": [8], "family": "Fazenda e montarias", "group": "Criação", "label": "Yarrow Seed"}, {"template": "T{tier}_ALCOHOL", "tiers": [6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Alcohol"}, {"template": "T{tier}_ARMOR_GATHERER_FISH", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Armor Gatherer Fish"}, {"template": "T{tier}_BACKPACK_GATHERER_FISH", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Backpack Gatherer Fish"}, {"template": "T{tier}_BREAD", "tiers": [4], "family": "Outros", "group": "Diversos", "label": "Bread"}, {"template": "T{tier}_BURDOCK", "tiers": [4], "family": "Outros", "group": "Diversos", "label": "Burdock"}, {"template": "T{tier}_BUTTER", "tiers": [4, 6, 8], "family": "Outros", "group": "Diversos", "label": "Butter"}, {"template": "T{tier}_CABBAGE", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Cabbage"}, {"template": "T{tier}_CLOTH_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Cloth Level1"}, {"template": "T{tier}_CLOTH_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Cloth Level2"}, {"template": "T{tier}_CLOTH_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Cloth Level3"}, {"template": "T{tier}_COMFREY", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Comfrey"}, {"template": "T{tier}_CORN", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Corn"}, {"template": "T{tier}_EGG", "tiers": [3, 5], "family": "Outros", "group": "Diversos", "label": "Egg"}, {"template": "T{tier}_ESSENCE", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Essence"}, {"template": "T{tier}_ESSENCE_POTION", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Essence Potion"}, {"template": "T{tier}_FIBER_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Fiber Level1"}, {"template": "T{tier}_FIBER_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Fiber Level2"}, {"template": "T{tier}_FIBER_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Fiber Level3"}, {"template": "T{tier}_FISH_FRESHWATER_ALL_COMMON", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater All Common"}, {"template": "T{tier}_FISH_FRESHWATER_AVALON_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Avalon Rare"}, {"template": "T{tier}_FISH_FRESHWATER_FOREST_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Forest Rare"}, {"template": "T{tier}_FISH_FRESHWATER_HIGHLANDS_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Highlands Rare"}, {"template": "T{tier}_FISH_FRESHWATER_MOUNTAIN_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Mountain Rare"}, {"template": "T{tier}_FISH_FRESHWATER_STEPPE_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Steppe Rare"}, {"template": "T{tier}_FISH_FRESHWATER_SWAMP_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Freshwater Swamp Rare"}, {"template": "T{tier}_FISH_SALTWATER_ALL_BOSS_SHARK", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Fish Saltwater All Boss Shark"}, {"template": "T{tier}_FISH_SALTWATER_ALL_COMMON", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Fish Saltwater All Common"}, {"template": "T{tier}_FISH_SALTWATER_ALL_RARE", "tiers": [3, 5, 7], "family": "Outros", "group": "Diversos", "label": "Fish Saltwater All Rare"}, {"template": "T{tier}_FISHINGBAIT", "tiers": [1, 3, 5], "family": "Outros", "group": "Diversos", "label": "Fishingbait"}, {"template": "T{tier}_FLOUR", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Flour"}, {"template": "T{tier}_FOXGLOVE", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Foxglove"}, {"template": "T{tier}_FURNITUREITEM_ANNIVERSARYBANNER", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Anniversarybanner"}, {"template": "T{tier}_FURNITUREITEM_ANNIVERSARYBANNER_2020", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Anniversarybanner 2020"}, {"template": "T{tier}_FURNITUREITEM_ANNIVERSARYBANNER_2021", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Anniversarybanner 2021"}, {"template": "T{tier}_FURNITUREITEM_BED", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Bed"}, {"template": "T{tier}_FURNITUREITEM_CHEST", "tiers": [2, 3, 4, 5], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Chest"}, {"template": "T{tier}_FURNITUREITEM_GUILDBANNER_FABRIC", "tiers": [2, 3, 4, 5], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Guildbanner Fabric"}, {"template": "T{tier}_FURNITUREITEM_REPAIRKIT", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Repairkit"}, {"template": "T{tier}_FURNITUREITEM_TABLE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Table"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_FISH", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Trophy Fish"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_FISHING_BOSS", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Trophy Fishing Boss"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_GENERAL", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Trophy General"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_MERCENARY", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Furnitureitem Trophy Mercenary"}, {"template": "T{tier}_HEAD_GATHERER_FISH", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Head Gatherer Fish"}, {"template": "T{tier}_HELLGATE_10V10_LETHAL_1_MAP", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Hellgate 10V10 Lethal 1 Map"}, {"template": "T{tier}_HELLGATE_10V10_NON_LETHAL_1_MAP", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Hellgate 10V10 Non Lethal 1 Map"}, {"template": "T{tier}_HELLGATE_2V2_LETHAL_1_MAP", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Hellgate 2V2 Lethal 1 Map"}, {"template": "T{tier}_HELLGATE_2V2_NON_LETHAL_1_MAP", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Hellgate 2V2 Non Lethal 1 Map"}, {"template": "T{tier}_HELLGATE_5V5_LETHAL_1_MAP", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Hellgate 5V5 Lethal 1 Map"}, {"template": "T{tier}_HELLGATE_5V5_NON_LETHAL_1_MAP", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Hellgate 5V5 Non Lethal 1 Map"}, {"template": "T{tier}_HIDE_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Hide Level1"}, {"template": "T{tier}_HIDE_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Hide Level2"}, {"template": "T{tier}_HIDE_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Hide Level3"}, {"template": "T{tier}_LABOURER_CONTRACT_FISHERMAN", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Fisherman"}, {"template": "T{tier}_LABOURER_CONTRACT_HUNTER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Hunter"}, {"template": "T{tier}_LABOURER_CONTRACT_MAGE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Mage"}, {"template": "T{tier}_LABOURER_CONTRACT_MERCENARY", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Mercenary"}, {"template": "T{tier}_LABOURER_CONTRACT_STONE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Stone"}, {"template": "T{tier}_LABOURER_CONTRACT_TOOLMAKER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Toolmaker"}, {"template": "T{tier}_LABOURER_CONTRACT_WARRIOR", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Labourer Contract Warrior"}, {"template": "T{tier}_LEATHER_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Leather Level1"}, {"template": "T{tier}_LEATHER_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Leather Level2"}, {"template": "T{tier}_LEATHER_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Leather Level3"}, {"template": "T{tier}_LOOTCHEST_CRYSTAL_LEAGUE", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Lootchest Crystal League"}, {"template": "T{tier}_MEAT", "tiers": [3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Meat"}, {"template": "T{tier}_METALBAR_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Metalbar Level1"}, {"template": "T{tier}_METALBAR_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Metalbar Level2"}, {"template": "T{tier}_METALBAR_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Metalbar Level3"}, {"template": "T{tier}_MILK", "tiers": [4, 6, 8], "family": "Outros", "group": "Diversos", "label": "Milk"}, {"template": "T{tier}_MOUNT_ARMORED_HORSE", "tiers": [5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Mount Armored Horse"}, {"template": "T{tier}_MOUNT_ARMORED_HORSE_MORGANA", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Armored Horse Morgana"}, {"template": "T{tier}_MOUNT_ARMORED_SWAMPDRAGON_BATTLE", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Armored Swampdragon Battle"}, {"template": "T{tier}_MOUNT_COUGAR_KEEPER", "tiers": [5, 8], "family": "Outros", "group": "Diversos", "label": "Mount Cougar Keeper"}, {"template": "T{tier}_MOUNT_DIREBEAR", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Direbear"}, {"template": "T{tier}_MOUNT_DIREBEAR_FW_FORTSTERLING", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Direbear Fw Fortsterling"}, {"template": "T{tier}_MOUNT_DIREBEAR_FW_FORTSTERLING_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Direbear Fw Fortsterling Elite"}, {"template": "T{tier}_MOUNT_DIREBOAR", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Direboar"}, {"template": "T{tier}_MOUNT_DIREBOAR_FW_LYMHURST", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Direboar Fw Lymhurst"}, {"template": "T{tier}_MOUNT_DIREBOAR_FW_LYMHURST_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Direboar Fw Lymhurst Elite"}, {"template": "T{tier}_MOUNT_DIREWOLF", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Mount Direwolf"}, {"template": "T{tier}_MOUNT_FROSTRAM_ADC", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Mount Frostram Adc"}, {"template": "T{tier}_MOUNT_GIANTSTAG", "tiers": [4], "family": "Outros", "group": "Diversos", "label": "Mount Giantstag"}, {"template": "T{tier}_MOUNT_GIANTSTAG_MOOSE", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Mount Giantstag Moose"}, {"template": "T{tier}_MOUNT_GREYWOLF_FW_CAERLEON", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Greywolf Fw Caerleon"}, {"template": "T{tier}_MOUNT_GREYWOLF_FW_CAERLEON_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Greywolf Fw Caerleon Elite"}, {"template": "T{tier}_MOUNT_HORSE", "tiers": [3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Mount Horse"}, {"template": "T{tier}_MOUNT_HORSE_UNDEAD", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Horse Undead"}, {"template": "T{tier}_MOUNT_HUSKY_ADC", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Husky Adc"}, {"template": "T{tier}_MOUNT_MAMMOTH_BATTLE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Mammoth Battle"}, {"template": "T{tier}_MOUNT_MAMMOTH_TRANSPORT", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Mammoth Transport"}, {"template": "T{tier}_MOUNT_MOABIRD_FW_BRIDGEWATCH", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Moabird Fw Bridgewatch"}, {"template": "T{tier}_MOUNT_MOABIRD_FW_BRIDGEWATCH_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Moabird Fw Bridgewatch Elite"}, {"template": "T{tier}_MOUNT_MONITORLIZARD_ADC", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Monitorlizard Adc"}, {"template": "T{tier}_MOUNT_OX", "tiers": [3, 4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Mount Ox"}, {"template": "T{tier}_MOUNT_RAM_FW_MARTLOCK", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Ram Fw Martlock"}, {"template": "T{tier}_MOUNT_RAM_FW_MARTLOCK_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Ram Fw Martlock Elite"}, {"template": "T{tier}_MOUNT_SIEGE_BALLISTA", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Mount Siege Ballista"}, {"template": "T{tier}_MOUNT_SWAMPDRAGON", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Swampdragon"}, {"template": "T{tier}_MOUNT_SWAMPDRAGON_AVALON_BASILISK", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Swampdragon Avalon Basilisk"}, {"template": "T{tier}_MOUNT_SWAMPDRAGON_BATTLE", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Swampdragon Battle"}, {"template": "T{tier}_MOUNT_SWAMPDRAGON_FW_THETFORD", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Mount Swampdragon Fw Thetford"}, {"template": "T{tier}_MOUNT_SWAMPDRAGON_FW_THETFORD_ELITE", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Mount Swampdragon Fw Thetford Elite"}, {"template": "T{tier}_MOUNT_TERRORBIRD_ADC", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mount Terrorbird Adc"}, {"template": "T{tier}_MULLEIN", "tiers": [7], "family": "Outros", "group": "Diversos", "label": "Mullein"}, {"template": "T{tier}_ORE_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Ore Level1"}, {"template": "T{tier}_ORE_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Ore Level2"}, {"template": "T{tier}_ORE_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Ore Level3"}, {"template": "T{tier}_PLANKS_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Planks Level1"}, {"template": "T{tier}_PLANKS_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Planks Level2"}, {"template": "T{tier}_PLANKS_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Planks Level3"}, {"template": "T{tier}_POTATO", "tiers": [6], "family": "Outros", "group": "Diversos", "label": "Potato"}, {"template": "T{tier}_PUMPKIN", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Pumpkin"}, {"template": "T{tier}_RELIC", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Relic"}, {"template": "T{tier}_ROCK_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Rock Level1"}, {"template": "T{tier}_ROCK_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Rock Level2"}, {"template": "T{tier}_ROCK_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Rock Level3"}, {"template": "T{tier}_RUNE", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Rune"}, {"template": "T{tier}_SHARD_AVALONIAN", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Shard Avalonian"}, {"template": "T{tier}_SHOES_GATHERER_FISH", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Shoes Gatherer Fish"}, {"template": "T{tier}_SOUL", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Soul"}, {"template": "T{tier}_TEASEL", "tiers": [5], "family": "Outros", "group": "Diversos", "label": "Teasel"}, {"template": "T{tier}_TURNIP", "tiers": [4], "family": "Outros", "group": "Diversos", "label": "Turnip"}, {"template": "T{tier}_VANITY_CONSUMABLE_FIREWORKS_BLUE", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Vanity Consumable Fireworks Blue"}, {"template": "T{tier}_VANITY_CONSUMABLE_FIREWORKS_GREEN", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Vanity Consumable Fireworks Green"}, {"template": "T{tier}_VANITY_CONSUMABLE_FIREWORKS_RED", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Vanity Consumable Fireworks Red"}, {"template": "T{tier}_VANITY_CONSUMABLE_FIREWORKS_YELLOW", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Vanity Consumable Fireworks Yellow"}, {"template": "T{tier}_WHEAT", "tiers": [3], "family": "Outros", "group": "Diversos", "label": "Wheat"}, {"template": "T{tier}_WOOD_LEVEL1", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Wood Level1"}, {"template": "T{tier}_WOOD_LEVEL2", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Wood Level2"}, {"template": "T{tier}_WOOD_LEVEL3", "tiers": [4, 5, 6, 7, 8], "family": "Outros", "group": "Diversos", "label": "Wood Level3"}, {"template": "T{tier}_YARROW", "tiers": [8], "family": "Outros", "group": "Diversos", "label": "Yarrow"}, {"template": "T{tier}_ARMOR_GATHERER_FIBER", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Armor Gatherer Fiber"}, {"template": "T{tier}_ARMOR_GATHERER_HIDE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Armor Gatherer Hide"}, {"template": "T{tier}_ARMOR_GATHERER_ORE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Armor Gatherer Ore"}, {"template": "T{tier}_ARMOR_GATHERER_ROCK", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Armor Gatherer Rock"}, {"template": "T{tier}_ARMOR_GATHERER_WOOD", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Armor Gatherer Wood"}, {"template": "T{tier}_BACKPACK_GATHERER_FIBER", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Backpack Gatherer Fiber"}, {"template": "T{tier}_BACKPACK_GATHERER_HIDE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Backpack Gatherer Hide"}, {"template": "T{tier}_BACKPACK_GATHERER_ORE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Backpack Gatherer Ore"}, {"template": "T{tier}_BACKPACK_GATHERER_ROCK", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Backpack Gatherer Rock"}, {"template": "T{tier}_BACKPACK_GATHERER_WOOD", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Backpack Gatherer Wood"}, {"template": "T{tier}_HIDE", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Couro bruto"}, {"template": "T{tier}_FIBER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Fibra bruta"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_FIBER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Furnitureitem Trophy Fiber"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_HIDE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Furnitureitem Trophy Hide"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_ORE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Furnitureitem Trophy Ore"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_ROCK", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Furnitureitem Trophy Rock"}, {"template": "T{tier}_FURNITUREITEM_TROPHY_WOOD", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Furnitureitem Trophy Wood"}, {"template": "T{tier}_HEAD_GATHERER_FIBER", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Head Gatherer Fiber"}, {"template": "T{tier}_HEAD_GATHERER_HIDE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Head Gatherer Hide"}, {"template": "T{tier}_HEAD_GATHERER_ORE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Head Gatherer Ore"}, {"template": "T{tier}_HEAD_GATHERER_ROCK", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Head Gatherer Rock"}, {"template": "T{tier}_HEAD_GATHERER_WOOD", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Head Gatherer Wood"}, {"template": "T{tier}_LABOURER_CONTRACT_FIBER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Labourer Contract Fiber"}, {"template": "T{tier}_LABOURER_CONTRACT_HIDE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Labourer Contract Hide"}, {"template": "T{tier}_LABOURER_CONTRACT_ORE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Labourer Contract Ore"}, {"template": "T{tier}_LABOURER_CONTRACT_WOOD", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Labourer Contract Wood"}, {"template": "T{tier}_WOOD", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Madeira bruta"}, {"template": "T{tier}_ORE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Minério bruto"}, {"template": "T{tier}_ROCK", "tiers": [1, 2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Pedra bruta"}, {"template": "T{tier}_SHOES_GATHERER_FIBER", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Shoes Gatherer Fiber"}, {"template": "T{tier}_SHOES_GATHERER_HIDE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Shoes Gatherer Hide"}, {"template": "T{tier}_SHOES_GATHERER_ORE", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Shoes Gatherer Ore"}, {"template": "T{tier}_SHOES_GATHERER_ROCK", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Shoes Gatherer Rock"}, {"template": "T{tier}_SHOES_GATHERER_WOOD", "tiers": [4, 5, 6, 7, 8], "family": "Recursos", "group": "Brutos", "label": "Shoes Gatherer Wood"}, {"template": "T{tier}_METALBAR", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Refinados", "label": "Barra de metal"}, {"template": "T{tier}_STONEBLOCK", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Refinados", "label": "Bloco de pedra"}, {"template": "T{tier}_LEATHER", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Refinados", "label": "Couro refinado"}, {"template": "T{tier}_CLOTH", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Refinados", "label": "Tecido"}, {"template": "T{tier}_PLANKS", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Recursos", "group": "Refinados", "label": "Tábuas"}, {"template": "T{tier}_BAG_INSIGHT", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Bag Insight"}, {"template": "T{tier}_BAG", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Bolsa"}, {"template": "T{tier}_CAPE", "tiers": [2, 3, 4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa"}, {"template": "T{tier}_CAPEITEM_FW_BRIDGEWATCH", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Bridgewatch"}, {"template": "T{tier}_CAPEITEM_FW_CAERLEON", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Caerleon"}, {"template": "T{tier}_CAPEITEM_FW_FORTSTERLING", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Fort Sterling"}, {"template": "T{tier}_CAPEITEM_FW_LYMHURST", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Lymhurst"}, {"template": "T{tier}_CAPEITEM_FW_MARTLOCK", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Martlock"}, {"template": "T{tier}_CAPEITEM_FW_THETFORD", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capa de Thetford"}, {"template": "T{tier}_CAPE_ARENA_BANNER", "tiers": [4, 6, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Arena Banner"}, {"template": "T{tier}_CAPE_CLOTH_KEEPER", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Cloth Keeper"}, {"template": "T{tier}_CAPE_CLOTH_MORGANA", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Cloth Morgana"}, {"template": "T{tier}_CAPE_CLOTH_UNDEAD", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Cloth Undead"}, {"template": "T{tier}_CAPE_LEATHER_KEEPER", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Leather Keeper"}, {"template": "T{tier}_CAPE_LEATHER_MORGANA", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Leather Morgana"}, {"template": "T{tier}_CAPE_LEATHER_UNDEAD", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Leather Undead"}, {"template": "T{tier}_CAPE_PLATE_KEEPER", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Plate Keeper"}, {"template": "T{tier}_CAPE_PLATE_MORGANA", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Plate Morgana"}, {"template": "T{tier}_CAPE_PLATE_UNDEAD", "tiers": [6], "family": "Utilidades", "group": "Capas e bolsas", "label": "Cape Plate Undead"}, {"template": "T{tier}_CAPEITEM_DEMON", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Demon"}, {"template": "T{tier}_CAPEITEM_DEMON_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Demon Bp"}, {"template": "T{tier}_CAPEITEM_FW_BRIDGEWATCH_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Bridgewatch Bp"}, {"template": "T{tier}_CAPEITEM_FW_CAERLEON_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Caerleon Bp"}, {"template": "T{tier}_CAPEITEM_FW_FORTSTERLING_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Fortsterling Bp"}, {"template": "T{tier}_CAPEITEM_FW_LYMHURST_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Lymhurst Bp"}, {"template": "T{tier}_CAPEITEM_FW_MARTLOCK_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Martlock Bp"}, {"template": "T{tier}_CAPEITEM_FW_THETFORD_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Fw Thetford Bp"}, {"template": "T{tier}_CAPEITEM_HERETIC", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Heretic"}, {"template": "T{tier}_CAPEITEM_HERETIC_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Heretic Bp"}, {"template": "T{tier}_CAPEITEM_KEEPER", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Keeper"}, {"template": "T{tier}_CAPEITEM_KEEPER_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Keeper Bp"}, {"template": "T{tier}_CAPEITEM_MORGANA", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Morgana"}, {"template": "T{tier}_CAPEITEM_MORGANA_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Morgana Bp"}, {"template": "T{tier}_CAPEITEM_UNDEAD", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Undead"}, {"template": "T{tier}_CAPEITEM_UNDEAD_BP", "tiers": [4, 5, 6, 7, 8], "family": "Utilidades", "group": "Capas e bolsas", "label": "Capeitem Undead Bp"}];

  const ISLAND_CROPS = [
    { name: 'Cenoura T3', profit: 12000, risk: 'Baixo', note: 'ótima para começar e girar rápido' },
    { name: 'Feijão T4', profit: 15000, risk: 'Baixo', note: 'boa margem e giro estável' },
    { name: 'Trigo T5', profit: 17000, risk: 'Médio', note: 'boa combinação com produção de comida' },
    { name: 'Erva medicinal T6', profit: 21000, risk: 'Médio', note: 'mais lucro, mas depende mais do mercado' },
    { name: 'Abóbora T8', profit: 19000, risk: 'Médio', note: 'opção equilibrada para quem já tem capital' }
  ];
  const ISLAND_ANIMALS = [
    { name: 'Galinha T3', profit: 14000, feed: 3500, risk: 'Baixo', note: 'simples e boa para começar' },
    { name: 'Cabra T4', profit: 20000, feed: 7000, risk: 'Médio', note: 'boa base para ilhas menores' },
    { name: 'Ganso T5', profit: 23000, feed: 8500, risk: 'Médio', note: 'bom equilíbrio entre custo e giro' },
    { name: 'Porco T7', profit: 30000, feed: 13000, risk: 'Médio', note: 'forte quando a comida está barata' },
    { name: 'Boi T8', profit: 36000, feed: 17000, risk: 'Alto', note: 'mais capital preso, mas lucro alto por pasto' }
  ];

  let marketState = { opportunities: [], sortKey: 'totalSafeProfit', sortDir: 'desc', lastScan: null };

  function getDeviceId() {
    let deviceId = localStorage.getItem('albionTraderDeviceId');
    if (!deviceId) {
      deviceId = 'device-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('albionTraderDeviceId', deviceId);
    }
    return deviceId;
  }
  function saveSession(payload) { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }
  function getSession() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
  function clearSession() { localStorage.removeItem(STORAGE_KEY); }
  function getPlanState() { try { return JSON.parse(localStorage.getItem(PLAN_KEY) || 'null'); } catch { return null; } }
  function savePlanState(v) { localStorage.setItem(PLAN_KEY, JSON.stringify(v)); }
  function clearPlanState() { localStorage.removeItem(PLAN_KEY); }

  async function api(url, options = {}) {
    const session = getSession();
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    const response = await fetch(url, Object.assign({}, options, { headers }));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Erro na requisição.');
    return data;
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const message = document.getElementById('loginMessage');
    message.textContent = 'Entrando...';
    try {
      const data = await api('/api/login', { method: 'POST', body: JSON.stringify({ email, senha, deviceId: getDeviceId() }) });
      saveSession(data);
      window.location.href = data.user.admin ? '/admin' : '/dashboard';
    } catch (error) { message.textContent = error.message; }
  }

  async function requireAuth() {
    const page = document.body.dataset.page;
    if (!page) return null;
    const session = getSession();
    if (!session?.token) { window.location.href = '/'; return null; }
    try {
      const data = await api('/api/me');
      const user = data.user;
      if (page === 'admin' && !user.admin) { window.location.href = '/dashboard'; return null; }
      return user;
    } catch {
      clearSession();
      window.location.href = '/';
      return null;
    }
  }

  function bindLogout() { const btn = document.getElementById('logoutBtn'); if (btn) btn.addEventListener('click', () => { clearSession(); window.location.href = '/'; }); }
  function activateSection(targetId) {
    document.querySelectorAll('.nav-item[data-target]').forEach((i) => i.classList.toggle('active', i.dataset.target === targetId));
    document.querySelectorAll('.page-section').forEach((s) => s.classList.toggle('active', s.id === targetId));
  }
  function bindNav() { document.querySelectorAll('[data-target]').forEach((item) => item.addEventListener('click', () => activateSection(item.dataset.target))); }

  function formatSilver(value) { return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0)); }
  function formatPercent(value) { return `${(value || 0).toFixed(1)}%`; }
  function formatBrazilTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return '—';
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  }
  function parseTime(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return null;
    return date;
  }
  function hoursSince(date) { return date ? (Date.now() - date.getTime()) / 36e5 : Infinity; }
  function setStatus(text, positive = true) {
    const badge = document.getElementById('apiStatusBadge');
    if (!badge) return;
    badge.textContent = text;
    badge.classList.toggle('status-warning', !positive);
  }
  function setProgress(percent, text) {
    const bar = document.getElementById('marketProgressBar');
    const line = document.getElementById('marketProgressText');
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (line) line.textContent = text;
  }
  function currentServer() { return document.getElementById('marketServer')?.value || 'west'; }
  function currentCapital() { return Number(document.getElementById('marketCapital')?.value || 0); }
  function currentProfile() { return document.getElementById('marketProfile')?.value || 'balanced'; }
  function currentRoute() { return document.getElementById('marketRoute')?.value || 'safe'; }

  function getLocationsForRoute(route) {
    if (route === 'safe') return DEFAULT_LOCATIONS;
    if (route === 'red') return [...DEFAULT_LOCATIONS, ...RED_LOCATIONS];
    return [...DEFAULT_LOCATIONS, ...RED_LOCATIONS, ...BLACK_LOCATIONS];
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function validPriceRows(rows) {
    const cleanedByCity = new Map();
    (rows || []).forEach((row) => {
      if (!row.city) return;
      const prev = cleanedByCity.get(row.city);
      const score = ((row.sell_price_min ? 1 : 0) + (row.buy_price_max ? 1 : 0)) * 10 - Math.min(hoursSince(parseTime(row.sell_price_min_date)), hoursSince(parseTime(row.buy_price_max_date)));
      const prevScore = prev ? (((prev.sell_price_min ? 1 : 0) + (prev.buy_price_max ? 1 : 0)) * 10 - Math.min(hoursSince(parseTime(prev.sell_price_min_date)), hoursSince(parseTime(prev.buy_price_max_date)))) : -999;
      if (!prev || score > prevScore) cleanedByCity.set(row.city, row);
    });
    const cleaned = [...cleanedByCity.values()];
    const sells = cleaned.map(r => Number(r.sell_price_min || 0)).filter(v => v > 0);
    const buys = cleaned.map(r => Number(r.buy_price_max || 0)).filter(v => v > 0);
    const sellMed = median(sells);
    const buyMed = median(buys);
    return cleaned.filter((row) => {
      const sell = Number(row.sell_price_min || 0);
      const buy = Number(row.buy_price_max || 0);
      const sellFresh = hoursSince(parseTime(row.sell_price_min_date)) <= 48;
      const buyFresh = hoursSince(parseTime(row.buy_price_max_date)) <= 48;
      const sellOk = sell > 0 && sellFresh && (!sellMed || (sell >= sellMed * 0.35 && sell <= sellMed * 2.8));
      const buyOk = buy > 0 && buyFresh && (!buyMed || (buy >= buyMed * 0.35 && buy <= buyMed * 2.8));
      return sellOk || buyOk;
    });
  }

  function estimateDailyVolume(itemId) {
    if (/(WOOD|FIBER|ORE|HIDE|ROCK)$/.test(itemId)) return 3000;
    if (/(PLANKS|CLOTH|METALBAR|LEATHER|STONEBLOCK)$/.test(itemId)) return 1800;
    if (/(POTION_|MEAL_)/.test(itemId)) return 1200;
    if (/(BAG|CAPE)/.test(itemId)) return 500;
    if (/FARM_/.test(itemId)) return 150;
    if (/(MAIN_|2H_|HEAD_|ARMOR_|SHOES_)/.test(itemId)) return 180;
    return 120;
  }

  function confidenceScore(validCities, listingMargin, instantMargin) {
    const best = Math.max(listingMargin, instantMargin);
    if (validCities >= 5 && best >= 10) return 'Alta';
    if (validCities >= 4 && best >= 5) return 'Boa';
    if (validCities >= 3 && best >= 2) return 'Média';
    return 'Baixa';
  }

  function buildItemId(template, tier, enchant) {
    let id = template.replace('T{tier}', 'T' + tier);
    if (Number(enchant) > 0) id += `@${enchant}`;
    return id;
  }

  function selectedItemDef() {
    const code = document.getElementById('itemSelect')?.value;
    return ALL_ITEMS.find(i => i.template === code) || null;
  }

  function itemLabelFromId(itemId) {
    const base = itemId.replace(/@\d+$/, '');
    const core = base.replace(/^T\d+_/, '');
    const match = ALL_ITEMS.find((x) => x.template.replace('T{tier}_', '') === core);
    if (match) {
      const tier = (base.match(/^T(\d+)_/) || [,'?'])[1];
      return `${match.label} T${tier}`;
    }
    return base.replace(/^T(\d+)_/, 'T$1 ').replace(/_/g, ' ');
  }

  function categoryFromId(itemId) {
    const core = itemId.replace(/^T\d+_/, '');
    if (/(WOOD|FIBER|ORE|HIDE|ROCK|PLANKS|CLOTH|METALBAR|LEATHER|STONEBLOCK)/.test(core)) return 'Recursos';
    if (/(BAG|CAPE)/.test(core)) return 'Utilidades';
    if (/(POTION|MEAL)/.test(core)) return 'Consumíveis';
    if (/(MAIN_|2H_|OFF_)/.test(itemId)) return 'Armas';
    if (/(HEAD_|ARMOR_|SHOES_)/.test(itemId)) return 'Armaduras';
    return 'Outros';
  }

  function analyzeItem(rows, feePct = DEFAULT_FEE) {
    const cleaned = validPriceRows(rows);
    const sells = cleaned.filter(r => Number(r.sell_price_min || 0) > 0);
    const buys = cleaned.filter(r => Number(r.buy_price_max || 0) > 0);
    if (!sells.length) return { ok: false, reason: 'Sem anúncios de venda confiáveis nas cidades analisadas.' };
    const cheapest = sells.reduce((best, row) => Number(row.sell_price_min) < Number(best.sell_price_min) ? row : best, sells[0]);
    const highestListing = sells.reduce((best, row) => Number(row.sell_price_min) > Number(best.sell_price_min) ? row : best, sells[0]);
    const highestBuy = buys.length ? buys.reduce((best, row) => Number(row.buy_price_max) > Number(best.buy_price_max) ? row : best, buys[0]) : null;
    const buyPrice = Number(cheapest.sell_price_min || 0);
    const listingSell = Number(highestListing.sell_price_min || 0);
    const buyOrderSell = Number(highestBuy?.buy_price_max || 0);
    const listingNet = listingSell * (1 - feePct / 100);
    const instantNet = buyOrderSell * (1 - feePct / 100);
    const listingProfit = listingNet - buyPrice;
    const instantProfit = instantNet - buyPrice;
    const bestMode = listingProfit >= instantProfit ? 'listing' : 'buyOrder';
    const bestProfit = Math.max(listingProfit, instantProfit);
    const bestSellCity = bestMode === 'listing' ? highestListing.city : (highestBuy?.city || highestListing.city);
    const bestSellPrice = bestMode === 'listing' ? listingSell : buyOrderSell;
    const margin = buyPrice > 0 ? (bestProfit / buyPrice) * 100 : 0;
    return {
      ok: true,
      cleaned,
      buyCity: cheapest.city,
      buyPrice,
      listingCity: highestListing.city,
      listingPrice: listingSell,
      listingNet,
      listingProfit,
      buyOrderCity: highestBuy?.city || '—',
      buyOrderPrice: buyOrderSell,
      instantNet,
      instantProfit,
      sellMode: bestMode,
      sellCity: bestSellCity,
      sellPrice: bestSellPrice,
      profit: bestProfit,
      margin,
      confidence: confidenceScore(cleaned.length, (buyPrice > 0 ? (listingProfit / buyPrice) * 100 : 0), (buyPrice > 0 ? (instantProfit / buyPrice) * 100 : 0))
    };
  }

  function priceModeLabel(op) { return op.sellMode === 'buyOrder' ? 'pedido de compra' : 'anúncio de venda'; }

  function renderMarketResult(itemName, analysis, qualityLabel) {
    const profitable = analysis.profit > 0;
    const profitText = profitable ? 'Há arbitragem positiva agora.' : 'Hoje não há arbitragem lucrativa confiável; ainda assim os preços por cidade estão abaixo para você validar no jogo.';
    const rows = analysis.cleaned.map((row) => `
      <tr>
        <td>${row.city}</td>
        <td>${Number(row.sell_price_min || 0) > 0 ? formatSilver(row.sell_price_min) : '—'}</td>
        <td>${Number(row.buy_price_max || 0) > 0 ? formatSilver(row.buy_price_max) : '—'}</td>
        <td>${formatBrazilTime(row.sell_price_min_date)}</td>
        <td>${formatBrazilTime(row.buy_price_max_date)}</td>
      </tr>`).join('');
    return `
      <div class="market-summary">
        <div><strong>${itemName}</strong></div>
        <div><span class="label">Cidade mais barata para comprar:</span> ${analysis.buyCity}</div>
        <div><span class="label">Valor de compra:</span> ${formatSilver(analysis.buyPrice)} prata</div>
        <div><span class="label">Melhor cidade para vender por anúncio:</span> ${analysis.listingCity}</div>
        <div><span class="label">Valor de venda por anúncio:</span> ${formatSilver(analysis.listingPrice)} prata</div>
        <div><span class="label">Melhor cidade para vender no pedido atual:</span> ${analysis.buyOrderCity}</div>
        <div><span class="label">Pedido de compra atual:</span> ${analysis.buyOrderPrice > 0 ? formatSilver(analysis.buyOrderPrice) : '—'} prata</div>
        <div><span class="label">Melhor forma hoje:</span> ${analysis.sellMode === 'listing' ? 'Anunciar para vender' : 'Vender no pedido de compra'}</div>
        <div><span class="label">Lucro líquido estimado por unidade:</span> ${formatSilver(analysis.profit)} prata</div>
        <div><span class="label">Margem estimada:</span> ${formatPercent(analysis.margin)}</div>
        <div><span class="label">Qualidade analisada:</span> ${qualityLabel}</div>
        <div><span class="label">Confiança:</span> ${analysis.confidence}</div>
        <div class="note-line">${profitText}</div>
      </div>
      <div class="table-wrap compact-table">
        <table>
          <thead>
            <tr><th>Cidade</th><th>Menor anúncio</th><th>Maior pedido</th><th>Anúncio atualizado</th><th>Pedido atualizado</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  async function loadMarketItem() {
    const box = document.getElementById('marketResult');
    const manual = document.getElementById('marketItemId')?.value.trim();
    const itemDef = selectedItemDef();
    const tier = Number(document.getElementById('itemTier')?.value || 4);
    const enchant = Number(document.getElementById('itemEnchant')?.value || 0);
    const quality = document.getElementById('itemQuality')?.value || '1';
    const qualityLabel = document.getElementById('itemQuality')?.selectedOptions?.[0]?.textContent || 'Normal';
    const itemId = manual || (itemDef ? buildItemId(itemDef.template, tier, enchant) : '');
    if (!itemId) { box.textContent = 'Escolha um item válido.'; return; }
    box.textContent = 'Consultando item...';
    setStatus('Consultando item...', true);
    try {
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(itemId)}&locations=${encodeURIComponent(getLocationsForRoute('black').join(','))}&qualities=${quality}&server=${currentServer()}`);
      const analysis = analyzeItem(data.data || [], DEFAULT_FEE);
      if (!analysis.ok) {
        box.innerHTML = `<div class="warning-box">${analysis.reason}</div>`;
        setStatus('Item sem preços confiáveis agora', false);
        return;
      }
      box.innerHTML = renderMarketResult(itemLabelFromId(itemId), analysis, qualityLabel);
      setStatus('Radar de item atualizado', true);
    } catch (error) {
      box.innerHTML = `<div class="warning-box">${error.message}</div>`;
      setStatus('Falha ao consultar o item', false);
    }
  }

  function renderSortArrow(key) {
    if (marketState.sortKey !== key) return '↕';
    return marketState.sortDir === 'asc' ? '↑' : '↓';
  }
  function sortValueFor(key, value) {
    if (key === 'confidence') return { 'Baixa': 1, 'Média': 2, 'Boa': 3, 'Alta': 4 }[value] || 0;
    return value;
  }
  function sortOpportunities(list) {
    const dir = marketState.sortDir === 'asc' ? 1 : -1;
    const key = marketState.sortKey;
    return [...list].sort((a, b) => {
      const av = sortValueFor(key, a[key] ?? 0);
      const bv = sortValueFor(key, b[key] ?? 0);
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  function buildPopularTemplates() {
    const scored = ALL_ITEMS.map((item) => {
      let score = 0;
      if (item.family === 'Recursos') score += 100;
      if (item.family === 'Utilidades') score += 80;
      if (item.family === 'Consumíveis') score += 70;
      if (item.family === 'Armaduras') score += 60;
      if (item.family === 'Armas') score += 60;
      score += item.tiers.length;
      return { ...item, score };
    }).sort((a, b) => b.score - a.score);
    return scored.slice(0, 300).map(i => i.template);
  }
  const POPULAR_TEMPLATES = buildPopularTemplates();

  function allowedByRoute(op, route) {
    if (route === 'safe') return op.buyCity !== 'Caerleon' && op.sellCity !== 'Caerleon' && op.sellCity !== 'Black Market' && op.buyCity !== 'Black Market';
    if (route === 'red') return op.sellCity !== 'Black Market' && op.buyCity !== 'Black Market';
    return true;
  }

  function buildOpportunities(rows, capital, profile, route) {
    const byItem = new Map();
    rows.forEach((row) => { if (!row.item_id) return; if (!byItem.has(row.item_id)) byItem.set(row.item_id, []); byItem.get(row.item_id).push(row); });
    const factor = profile === 'consistent' ? 0.18 : profile === 'max' ? 0.55 : 0.32;
    const minProfitUnit = profile === 'max' ? 250 : profile === 'balanced' ? 150 : 80;
    const minTotal = profile === 'max' ? 100000 : profile === 'balanced' ? 40000 : 15000;
    const out = [];
    byItem.forEach((itemRows, itemId) => {
      const analysis = analyzeItem(itemRows, DEFAULT_FEE);
      if (!analysis.ok || analysis.profit <= minProfitUnit) return;
      const vol = estimateDailyVolume(itemId);
      const qtyByCapital = Math.floor(capital / Math.max(1, analysis.buyPrice));
      const safeUnits = Math.max(0, Math.min(qtyByCapital, Math.floor(vol * factor)));
      const totalSafeProfit = safeUnits * analysis.profit;
      if (safeUnits <= 0 || totalSafeProfit < minTotal) return;
      const op = {
        itemId,
        itemName: itemLabelFromId(itemId),
        buyCity: analysis.buyCity,
        buyPrice: analysis.buyPrice,
        sellCity: analysis.sellCity,
        sellPrice: analysis.sellPrice,
        sellMode: analysis.sellMode,
        orderPrice: analysis.buyOrderPrice,
        profit: analysis.profit,
        margin: analysis.margin,
        confidence: analysis.confidence,
        safeUnits,
        totalSafeProfit,
        category: categoryFromId(itemId)
      };
      if (allowedByRoute(op, route)) out.push(op);
    });
    marketState.opportunities = out;
    marketState.lastScan = { capital, profile, route, at: new Date().toISOString() };
    return sortOpportunities(out);
  }

  function renderOpportunities() {
    const box = document.getElementById('opportunityResult');
    const list = sortOpportunities(marketState.opportunities);
    if (!list.length) { box.innerHTML = '<div class="warning-box">Nenhuma oportunidade confiável encontrada com os filtros atuais.</div>'; return; }
    const headers = [
      ['buyPrice','Custo'], ['sellPrice','Venda'], ['profit','Lucro/unid'], ['safeUnits','Quantidade segura'], ['totalSafeProfit','Lucro total'], ['margin','Margem'], ['confidence','Confiança']
    ];
    const headHtml = headers.map(([key,label]) => `<th><button class="sort-btn" data-sort="${key}">${label} <span>${renderSortArrow(key)}</span></button></th>`).join('');
    const body = list.map((op) => `
      <tr>
        <td><strong>${op.itemName}</strong><br><span class="muted tiny">${op.buyCity} → ${op.sellCity} · ${priceModeLabel(op)}</span></td>
        <td>${formatSilver(op.buyPrice)}</td>
        <td>${formatSilver(op.sellPrice)}</td>
        <td>${formatSilver(op.profit)}</td>
        <td>${formatSilver(op.safeUnits)}</td>
        <td>${formatSilver(op.totalSafeProfit)}</td>
        <td>${formatPercent(op.margin)}</td>
        <td>${op.confidence}</td>
      </tr>`).join('');
    box.innerHTML = `
      <div class="table-wrap"><table>
        <thead><tr><th>Item / rota</th>${headHtml}</tr></thead>
        <tbody>${body}</tbody>
      </table></div>`;
    document.querySelectorAll('.sort-btn').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (marketState.sortKey === key) marketState.sortDir = marketState.sortDir === 'asc' ? 'desc' : 'asc';
      else { marketState.sortKey = key; marketState.sortDir = key === 'confidence' ? 'desc' : 'desc'; }
      renderOpportunities();
    }));
  }

  function updateBestOpportunityPanel() {
    const best = sortOpportunities(marketState.opportunities)[0];
    const nameEl = document.getElementById('bestOpportunityName');
    const textEl = document.getElementById('bestOpportunityText');
    const planEl = document.getElementById('priorityPlan');
    const profileLabel = document.getElementById('profileLabel');
    if (profileLabel) profileLabel.textContent = document.getElementById('marketProfile')?.selectedOptions?.[0]?.textContent || 'Equilibrado';
    if (!best) {
      if (nameEl) nameEl.textContent = '—';
      if (textEl) textEl.textContent = 'Nenhuma oportunidade confiável ainda.';
      if (planEl) planEl.textContent = 'Sem oportunidade suficiente com os filtros atuais.';
      return;
    }
    if (nameEl) nameEl.textContent = best.itemName;
    if (textEl) textEl.textContent = `Compre em ${best.buyCity} e venda em ${best.sellCity}. Lucro seguro estimado: ${formatSilver(best.totalSafeProfit)} com ${best.safeUnits} unidades.`;
    if (planEl) planEl.innerHTML = `<strong>Melhor rota agora: ${best.itemName}.</strong><br>Compre em <strong>${best.buyCity}</strong> por <strong>${formatSilver(best.buyPrice)}</strong> e venda em <strong>${best.sellCity}</strong> por <strong>${formatSilver(best.sellPrice)}</strong> usando <strong>${priceModeLabel(best)}</strong>.<br>Dentro do seu capital, a quantidade segura estimada fica em <strong>${formatSilver(best.safeUnits)}</strong> unidades, com lucro total estimado de <strong>${formatSilver(best.totalSafeProfit)}</strong>.`;
  }

  async function scanMarket(mode = 'popular') {
    setStatus('Consultando AlbionData...', true);
    const box = document.getElementById('opportunityResult');
    box.textContent = 'Varrendo mercado...';
    const server = currentServer();
    const capital = currentCapital();
    const profile = currentProfile();
    const route = currentRoute();
    const templates = mode === 'all' ? ALL_ITEMS.map(i => i.template) : POPULAR_TEMPLATES;
    const ids = templates.map(t => {
      const def = ALL_ITEMS.find(i => i.template === t);
      const tier = def && def.tiers.includes(4) ? 4 : Math.min(...(def?.tiers || [4]));
      return buildItemId(t, tier, 0);
    });
    const chunks = [];
    for (let i = 0; i < ids.length; i += 35) chunks.push(ids.slice(i, i + 35));
    let merged = [];
    for (let i = 0; i < chunks.length; i++) {
      setProgress((i / chunks.length) * 100, `Lendo lote ${i+1} de ${chunks.length}...`);
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(chunks[i].join(','))}&locations=${encodeURIComponent(getLocationsForRoute(route).join(','))}&qualities=1&server=${server}`);
      merged = merged.concat(data.data || []);
    }
    buildOpportunities(merged, capital, profile, route);
    setProgress(100, `Leitura finalizada com ${marketState.opportunities.length} oportunidades.`);
    renderOpportunities();
    updateBestOpportunityPanel();
    setStatus(`AlbionData online · ${marketState.opportunities.length} oportunidades confiáveis`, true);
    renderDailyPlan();
  }

  function populateItemSelectors() {
    const familyEl = document.getElementById('itemFamily');
    const groupEl = document.getElementById('itemGroup');
    const searchEl = document.getElementById('itemSearch');
    const itemEl = document.getElementById('itemSelect');
    const tierEl = document.getElementById('itemTier');
    if (!familyEl || !groupEl || !searchEl || !itemEl || !tierEl) return;
    const families = [...new Set(ALL_ITEMS.map(i => i.family))].sort();
    familyEl.innerHTML = families.map(f => `<option value="${f}">${f}</option>`).join('');

    function updateGroups() {
      const family = familyEl.value;
      const groups = [...new Set(ALL_ITEMS.filter(i => i.family === family).map(i => i.group))].sort();
      groupEl.innerHTML = `<option value="">Todos</option>` + groups.map(g => `<option value="${g}">${g}</option>`).join('');
      updateItems();
    }
    function updateItems() {
      const family = familyEl.value;
      const group = groupEl.value;
      const term = (searchEl.value || '').toLowerCase();
      const filtered = ALL_ITEMS.filter(i => i.family === family && (!group || i.group === group) && (!term || i.label.toLowerCase().includes(term) || i.template.toLowerCase().includes(term)));
      itemEl.innerHTML = filtered.slice(0, 800).map(i => `<option value="${i.template}">${i.label} [${i.tiers.join('/')}]</option>`).join('');
      updateTiers();
      const counter = document.getElementById('itemCatalogCount');
      if (counter) counter.textContent = `${filtered.length} itens nesta busca`;
    }
    function updateTiers() {
      const item = selectedItemDef();
      if (!item) return;
      tierEl.innerHTML = item.tiers.map(t => `<option value="${t}">T${t}</option>`).join('');
    }
    familyEl.addEventListener('change', updateGroups);
    groupEl.addEventListener('change', updateItems);
    searchEl.addEventListener('input', updateItems);
    itemEl.addEventListener('change', updateTiers);
    updateGroups();
  }

  function buildTodayPlan() {
    const currentInput = Number(document.getElementById('wealthCurrent')?.value || 0);
    const goal = Number(document.getElementById('wealthGoal')?.value || 0);
    const totalDays = Math.max(1, Number(document.getElementById('wealthDays')?.value || 1));
    const state = getPlanState() || { currentDay: 1, currentBalance: currentInput, history: [] };
    if (!marketState.opportunities.length) {
      renderDailyPlan('Rode o mercado primeiro. O plano diário usa a melhor oportunidade do momento.');
      return;
    }
    const remaining = Math.max(0, totalDays - state.history.length);
    const needed = Math.max(0, goal - state.currentBalance);
    const dailyTarget = remaining > 0 ? Math.ceil(needed / remaining) : 0;
    const opportunity = sortOpportunities(marketState.opportunities)[0] || null;
    const nextState = { ...state, goal, totalDays, pendingPlan: { currentDay: state.history.length + 1, currentBalance: state.currentBalance || currentInput, goal, totalDays, dailyTarget, opportunity, generatedAt: new Date().toISOString() } };
    savePlanState(nextState);
    renderDailyPlan();
  }

  function closeDay() {
    const state = getPlanState();
    if (!state?.pendingPlan) return;
    const endBalance = Number(document.getElementById('dayEndBalance')?.value || 0);
    const profit = Number(document.getElementById('dayProfitReal')?.value || 0);
    const died = document.getElementById('dayDied')?.value === 'sim';
    const note = document.getElementById('dayNote')?.value || '';
    const history = state.history || [];
    history.push({ day: state.pendingPlan.currentDay, start: state.pendingPlan.currentBalance, end: endBalance, profit, died, note, item: state.pendingPlan.opportunity?.itemName || '—' });
    savePlanState({ currentDay: state.pendingPlan.currentDay + 1, currentBalance: endBalance, goal: state.goal, totalDays: state.totalDays, history });
    renderDailyPlan();
  }

  function renderDailyPlan(forcedMessage = '') {
    const box = document.getElementById('wealthResult');
    if (!box) return;
    if (forcedMessage) { box.innerHTML = forcedMessage; return; }
    const state = getPlanState();
    if (!state?.pendingPlan && (!state?.history || !state.history.length)) {
      box.innerHTML = 'O planejador agora funciona <strong>1 dia por vez</strong>. Primeiro rode o mercado. Depois clique em <strong>Gerar plano de hoje</strong>.';
      return;
    }
    const pending = state.pendingPlan;
    const historyHtml = (state.history || []).slice(-5).map(h => `<li>Dia ${h.day} — abriu com ${formatSilver(h.start)}, fechou com ${formatSilver(h.end)}, lucro real ${formatSilver(h.profit)}${h.died ? ' · morreu' : ''}</li>`).join('');
    if (!pending) {
      box.innerHTML = `<strong>Dia fechado com sucesso.</strong><br>Agora clique em <strong>Gerar plano de hoje</strong> para o próximo dia.<div class="history-box"><strong>Últimos fechamentos</strong><ul>${historyHtml || '<li>Nenhum dia fechado ainda.</li>'}</ul></div>`;
      return;
    }
    const op = pending.opportunity;
    const planHtml = op ? `
      <strong>Dia ${pending.currentDay} de ${pending.totalDays}</strong><br>
      Saldo de abertura: <strong>${formatSilver(pending.currentBalance)}</strong><br>
      Meta diária sugerida: <strong>${formatSilver(pending.dailyTarget)}</strong><br><br>
      <strong>O que fazer hoje:</strong><br>
      Compre <strong>${formatSilver(op.safeUnits)} unidades</strong> de <strong>${op.itemName}</strong> em <strong>${op.buyCity}</strong> por cerca de <strong>${formatSilver(op.buyPrice)}</strong> cada.<br>
      Leve para <strong>${op.sellCity}</strong> e venda usando <strong>${priceModeLabel(op)}</strong> por cerca de <strong>${formatSilver(op.sellPrice)}</strong>.<br>
      Lucro estimado por unidade: <strong>${formatSilver(op.profit)}</strong><br>
      Lucro total seguro estimado para hoje: <strong>${formatSilver(op.totalSafeProfit)}</strong>.<br><br>
      No fim do dia, registre o resultado abaixo para o sistema preparar o próximo dia.` :
      'Sem oportunidade forte o suficiente hoje. Rode o mercado de novo e gere o plano do dia após a varredura.';
    box.innerHTML = `${planHtml}<div class="day-close-box">
      <h4>Fechamento do dia</h4>
      <div class="form-grid compact-grid">
        <label><span>Você morreu hoje?</span><select id="dayDied"><option value="nao">Não</option><option value="sim">Sim</option></select></label>
        <label><span>Lucro / prejuízo real do dia</span><input id="dayProfitReal" type="number" value="0" /></label>
        <label><span>Saldo ao fechar o dia</span><input id="dayEndBalance" type="number" value="${pending.currentBalance}" /></label>
      </div>
      <label><span>Observação do dia</span><input id="dayNote" type="text" placeholder="Ex: morri na red, vendi metade, mercado travado" /></label>
      <div class="button-row"><button id="closeDayBtn" class="btn btn-primary">Fechar dia</button><button id="resetPlanBtn" class="btn btn-outline">Resetar plano</button></div>
    </div>
    <div class="history-box"><strong>Últimos fechamentos</strong><ul>${historyHtml || '<li>Nenhum dia fechado ainda.</li>'}</ul></div>`;
    document.getElementById('closeDayBtn')?.addEventListener('click', closeDay);
    document.getElementById('resetPlanBtn')?.addEventListener('click', () => { clearPlanState(); renderDailyPlan(); });
  }

  async function initDashboard() {
    const user = await requireAuth();
    if (!user) return;
    document.getElementById('welcomeTitle').textContent = `Olá, ${user.nome || user.email}`;
    const licenseDate = document.getElementById('licenseDate');
    if (licenseDate) licenseDate.textContent = new Date(user.licencaExpiraEm).toLocaleDateString('pt-BR');
    bindLogout();
    bindNav();
    populateItemSelectors();
    renderDailyPlan();
    document.getElementById('loadMarketBtn')?.addEventListener('click', loadMarketItem);
    document.getElementById('scanPopularBtn')?.addEventListener('click', () => scanMarket('popular'));
    document.getElementById('scanAllBtn')?.addEventListener('click', () => scanMarket('all'));
    document.getElementById('startDayPlanBtn')?.addEventListener('click', buildTodayPlan);
  }

  async function initAdmin() {
    const user = await requireAuth();
    if (!user) return;
    const title = document.getElementById('adminTitle');
    if (title) title.textContent = `Painel admin — ${user.nome || user.email}`;
    bindLogout();
    try {
      const data = await api('/api/users');
      const tbody = document.getElementById('adminUsersTable');
      const count = document.getElementById('adminUserCount');
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = data.notice || '';
      if (count) count.textContent = data.users.length;
      if (tbody) tbody.innerHTML = data.users.map((u) => `<tr><td>${u.nome || '-'}</td><td>${u.email}</td><td>${u.admin ? 'Admin' : 'Usuário'}</td><td>${u.licenca || '-'}</td></tr>`).join('');
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
  function calcCraft() {
    const level = Number(document.getElementById('craftLevel').value || 0);
    const city = document.getElementById('craftCity').value;
    const cost = Number(document.getElementById('craftCost').value || 0);
    const sell = Number(document.getElementById('craftSell').value || 0);
    const bonus = level >= 80 ? 1.07 : level >= 50 ? 1.04 : 1.01;
    const fee = Math.round(sell * 0.065);
    const adjustedCost = cost / bonus;
    const lucro = sell - adjustedCost - fee;
    const margem = cost > 0 ? (lucro / cost) * 100 : 0;
    setHtml('craftResult', `<strong>Resultado do craft em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>Margem: <strong>${margem.toFixed(1)}%</strong><br>Leitura: ${lucro > 0 ? 'vale testar itens de giro rápido, como bolsas e capas.' : 'esse craft está apertado; melhore custo dos materiais ou venda.'}`);
  }
  function calcRefine() {
    const level = Number(document.getElementById('refineLevel').value || 0);
    const city = document.getElementById('refineCity').value;
    const focus = document.getElementById('refineFocus').value === 'sim';
    const cost = Number(document.getElementById('refineCost').value || 0);
    const sell = Number(document.getElementById('refineSell').value || 0);
    const efficiency = focus ? 0.86 : 1;
    const xpBonus = level >= 75 ? 0.95 : 1;
    const fee = Math.round(sell * 0.065);
    const lucro = sell - cost * efficiency * xpBonus - fee;
    setHtml('refineResult', `<strong>Resultado do refino em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong> ${focus ? 'com foco' : 'sem foco'}<br>Melhor leitura: ${focus ? 'aproveite itens com retorno de recursos e venda rápida.' : 'sem foco, prefira spreads maiores e muito giro.'}`);
  }
  function calcIsland() {
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plots = Number(document.getElementById('islandPlots').value || 0);
    const pastures = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';
    const cropOptions = ISLAND_CROPS.map((crop) => ({ ...crop, totalProfit: Math.round(crop.profit * plots * (1 + level * 0.03) * (focus ? 1.12 : 1)) }));
    const animalOptions = ISLAND_ANIMALS.map((animal) => ({ ...animal, totalProfit: Math.round((animal.profit - animal.feed) * pastures * (1 + level * 0.025) * (focus ? 1.08 : 1)) }));
    const bestCrop = cropOptions.sort((a,b)=>b.totalProfit-a.totalProfit)[0] || { name: 'Nenhuma', totalProfit: 0, note: '-' };
    const bestAnimal = animalOptions.sort((a,b)=>b.totalProfit-a.totalProfit)[0] || { name: 'Nenhum', totalProfit: 0, note: '-' };
    const total = bestCrop.totalProfit + bestAnimal.totalProfit;
    setHtml('islandResult', `<strong>Melhor plano para sua ilha</strong><br><br>Melhor plantação: <strong>${bestCrop.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestCrop.totalProfit)}</strong><br>Melhor criação: <strong>${bestAnimal.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestAnimal.totalProfit)}</strong><br>Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>Observação da plantação: ${bestCrop.note}.<br>Observação do animal: ${bestAnimal.note}.`);
  }
  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const tax = Math.round(sell * 0.065);
    const lucro = sell - buy - cost - tax;
    setHtml('transportResult', `<strong>Resultado do transporte</strong><br>Rota: <strong>${buyCity} → ${sellCity}</strong><br>Lucro líquido estimado: <strong>${formatSilver(lucro)} prata</strong><br>Leitura: ${lucro > 0 ? 'boa rota para testar em volume controlado.' : 'não vale essa operação nesse formato.'}`);
  }

  window.AlbionTrader = { calcCraft, calcRefine, calcIsland, calcTransport, activateSection };
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    if (document.body.dataset.page === 'dashboard') initDashboard();
    if (document.body.dataset.page === 'admin') initAdmin();
  });
})();
