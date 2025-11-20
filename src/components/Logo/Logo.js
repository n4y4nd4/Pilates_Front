import React from 'react';

const Logo = ({ size = 60 }) => {
  return (
    <div className="logo-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Círculo branco */}
        <circle cx="100" cy="100" r="100" fill="white" />
        
        {/* Formas geométricas 3D roxas e verdes */}
        <g transform="translate(100, 80)">
          {/* Formas roxas (profundidade) */}
          <polygon points="-25,-15 -5,-15 5,-5 -15,-5" fill="#764ba2" />
          <polygon points="5,-15 25,-15 35,-5 15,-5" fill="#764ba2" />
          <polygon points="-5,5 5,5 15,15 -5,15" fill="#764ba2" />
          
          {/* Formas verdes/teal (preenchimento) */}
          <polygon points="-25,-25 -5,-25 -5,-15 -25,-15" fill="#10b981" />
          <polygon points="-15,-5 -5,-5 -5,5 -15,5" fill="#10b981" />
          <polygon points="5,-5 15,-5 15,5 5,5" fill="#10b981" />
          <polygon points="15,-5 25,-5 25,5 15,5" fill="#10b981" opacity="0.8" />
          
          {/* Letra 'e' estilizada em branco (sobreposta) */}
          <text
            x="0"
            y="8"
            fontSize="50"
            fill="white"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            e
          </text>
        </g>
        
        {/* Texto "espaço" em verde */}
        <text
          x="100"
          y="150"
          fontSize="15"
          fill="#10b981"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          textAnchor="middle"
        >
          espaço
        </text>
        
        {/* Texto "PILATES" em roxo */}
        <text
          x="100"
          y="172"
          fontSize="13"
          fill="#764ba2"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="1px"
        >
          PILATES
        </text>
      </svg>
    </div>
  );
};

export default Logo;

