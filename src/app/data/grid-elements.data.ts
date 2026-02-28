import { CableElement, NodeElement, TransformerElement, GridElement } from '../models';

const M0 = { P_trans: 0, Q_trans: 0, S_trans: 0, P_verlust: 0, Q_verlust: 0, auslastung: 0 };

const TRANSFORMER: TransformerElement = {
  id: 'trafo-01', name: 'Umspannwerk Düsseldorf-Altstadt', type: 'transformer',
  ratedPowerKva: 630, coordinates: [51.2261, 6.7721], measurement: M0,
};

const node = (id: string, name: string, coords: [number, number]): NodeElement => ({
  id, name, type: 'node', voltageKv: 0.4, coordinates: coords, measurement: M0,
});

const NODES: NodeElement[] = [
  node('node-01', 'Knoten Marktplatz',          [51.2257, 6.7721]),
  node('node-02', 'Knoten Burgplatz',            [51.2271, 6.7713]),
  node('node-03', 'Knoten Carlsplatz',           [51.2238, 6.7736]),
  node('node-04', 'Knoten Bolkerstraße',         [51.2260, 6.7724]),
  node('node-05', 'Knoten Lambertuskirche',      [51.2280, 6.7716]),
  node('node-06', 'Knoten Andreaskirche',        [51.2271, 6.7752]),
  node('node-07', 'Knoten Heinehaus',            [51.2262, 6.7749]),
  node('node-08', 'Knoten Stadtgründungsmonument', [51.2275, 6.7719]),
];

const cable = (
  id: string, name: string, from: string, to: string,
  capacity: number, coords: [number, number][],
): CableElement => ({
  id, name, type: 'cable', fromNodeId: from, toNodeId: to,
  ratedCapacity: capacity, coordinates: coords, measurement: M0,
});

const CABLES: CableElement[] = [
  cable('cable-01', 'Kabel Trafo→Marktplatz',           'trafo-01', 'node-01', 400, [[51.2261,6.7721], [51.2257,6.7721]]),
  cable('cable-02', 'Kabel Marktplatz→Burgplatz',       'node-01',  'node-02', 300, [[51.2257,6.7721], [51.2271,6.7713]]),
  cable('cable-03', 'Kabel Marktplatz→Carlsplatz',      'node-01',  'node-03', 250, [[51.2257,6.7721], [51.2238,6.7736]]),
  cable('cable-04', 'Kabel Trafo→Bolkerstraße',         'trafo-01', 'node-04', 350, [[51.2261,6.7721], [51.2260,6.7724]]),
  cable('cable-05', 'Kabel Bolkerstraße→Lambertus',     'node-04',  'node-05', 200, [[51.2260,6.7724], [51.2280,6.7716]]),
  cable('cable-06', 'Kabel Lambertus→Andreaskirche',    'node-05',  'node-06', 180, [[51.2280,6.7716], [51.2271,6.7752]]),
  cable('cable-07', 'Kabel Marktplatz→Heinehaus',       'node-01',  'node-07', 220, [[51.2257,6.7721], [51.2262,6.7749]]),
  cable('cable-08', 'Kabel Burgplatz→Stadtgründung',    'node-02',  'node-08', 280, [[51.2271,6.7713], [51.2275,6.7719]]),
  cable('cable-09', 'Kabel Heinehaus→Carlsplatz',       'node-07',  'node-03', 160, [[51.2262,6.7749], [51.2238,6.7736]]),
  cable('cable-10', 'Kabel Bolkerstraße→Andreaskirche', 'node-04',  'node-06', 150, [[51.2260,6.7724], [51.2271,6.7752]]),
];

export const ALL_GRID_ELEMENTS: GridElement[] = [TRANSFORMER, ...NODES, ...CABLES];
