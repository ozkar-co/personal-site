import { Node, Edge } from 'reactflow';

function censurarNombre(nombre: string) {
  const partes = nombre.split(' ');
  return partes.map(p => p.length > 2 ? p.slice(0, 2) + '*'.repeat(p.length - 2) : p).join(' ');
}

export function buildGenealogyGraph(data: any, unlocked: boolean): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = data.personas.map((p: any) => ({
    id: p.id,
    type: 'default',
    data: {
      label: unlocked ? p.nombreCompleto : p.nombre,
      foto: p.foto,
      nacionalidad: p.nacionalidad,
      genero: p.genero,
      colorGenero: p.colorGenero,
      fechaNacimiento: p.fechaNacimiento,
      fechaDefuncion: p.fechaDefuncion,
      unlocked,
    },
    position: { x: Math.random() * 600, y: Math.random() * 400 }, // Mejorar con layout real
  }));

  const edges: Edge[] = data.relaciones.map((r: any, i: number) => {
    let style = {};
    let type = 'default';
    if (r.tipo === 'matrimonio') style = { stroke: '#3498db', strokeWidth: 2 };
    if (r.tipo === 'union libre') style = { strokeDasharray: '5,5', stroke: '#27ae60' };
    if (r.tipo === 'temporal') style = { strokeDasharray: '2,8', stroke: '#e67e22' };
    if (r.tipo === 'hijo') {
      if (r.subtipo === 'adoptado') style = { strokeDasharray: '4,2', stroke: '#8e44ad' };
      if (r.subtipo === 'bastardo') style = { strokeDasharray: '1,6', stroke: '#c0392b' };
    }
    if (r.tipo === 'matrimonio' || r.tipo === 'union libre' || r.tipo === 'temporal') {
      return {
        id: `rel-${i}`,
        source: r.personas[0],
        target: r.personas[1],
        style,
        type,
      };
    }
    if (r.tipo === 'hijo') {
      return {
        id: `rel-${i}`,
        source: r.hijo,
        target: r.padres[0],
        style,
        type,
      };
    }
    return null;
  }).filter(Boolean) as Edge[];

  return { nodes, edges };
} 