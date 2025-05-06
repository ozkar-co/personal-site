import React from 'react';

const genderIcons: Record<string, string> = {
  masculino: '♂',
  femenino: '♀',
  otro: '⚧',
};

const genderPhotos: Record<string, string> = {
  masculino: '/assets/male.png',
  femenino: '/assets/female.png',
  otro: '/assets/nonbinary.png',
};

function getFlagUrl(nacionalidad: string) {
  // Ejemplo: 'mx' -> 'https://flagcdn.com/32x24/mx.png'
  return `https://flagcdn.com/32x24/${nacionalidad}.png`;
}

interface PersonNodeProps {
  data: {
    label: string;
    foto: string;
    nacionalidad: string;
    genero: string;
    colorGenero: string;
    fechaNacimiento: string;
    fechaDefuncion: string | null;
    unlocked: boolean;
  };
}

export const PersonNode: React.FC<PersonNodeProps> = ({ data }) => {
  // Usar placeholder si no hay foto
  const fotoSrc = genderPhotos[data.genero] || genderPhotos['otro'];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className="genealogy-person-flags">
        <span className="genealogy-flag">
          <img
            src={getFlagUrl(data.nacionalidad)}
            alt={data.nacionalidad}
            width={24}
            height={18}
            style={{ borderRadius: '50%' }}
          />
        </span>
        <span className="genealogy-gender" style={{ background: data.colorGenero }}>
          {genderIcons[data.genero] || '⚧'}
        </span>
      </div>
      <img
        src={fotoSrc}
        alt={data.label}
        className={`genealogy-person-img${!data.unlocked ? ' blurred' : ''}`}
      />
      <div className="genealogy-person-nombre">{data.label}</div>
      <div className="genealogy-person-tooltip">
        {data.fechaNacimiento} - {data.fechaDefuncion || 'Vivo'}
      </div>
    </div>
  );
}; 