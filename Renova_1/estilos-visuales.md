# Estilos Visuales Renova

## Identidad Visual

Basada en el logo de Renova: sol central amarillo-naranja rodeado de hojas verdes y pétalos azules (cyan a navy).

## Tipografía

### Familia Tipográfica
- **Headings**: Orbitron (sans-serif geométrica, futurista)
- **Cuerpo**: Rajdhani (sans-serif legible, moderna)
- **Monospace**: Space Mono (para datos técnicos, badges)

### Jerarquía
- H1-H2: Orbitron, color navy (#1A2F45)
- Body: Rajdhani, color #666666
- Labels: Space Mono, uppercase

## Sistema de Color

### Primario (azul/cyan del logo)
```css
--blue-navy: #1A2F45;    /* Headings, títulos, fondo hero */
--blue-cyan: #00B4EB;     /* Botones, CTAs, links, hover */
--blue-dark: #0090c4;     /* Hover states */
```

### Secundario (verde/amarillo del logo)
```css
--green: #71C238;         /* Iconos servicios, badges */
--green-dark: #5A9E2D;     /* Hover iconos */
--solar-yellow: #F7931E;    /* Acentos, precios */
```

### Neutrales
```css
--white: #FFFFFF;
--gray-light: #F5F5F5;
--text-body: #666666;
```

## Componentes

### Botones Primarios
- Fondo: gradiente cyan → cyan-dark
- Texto: blanco
- Sombra: cyan-glow
- Hover: elevación + sombra más intensa

### Cards
- Fondo: blanco
- Borde: 1px rgba(0,180,235,0.1)
- Sombra: 0 4px 20px rgba(0,0,0,0.05)
- Hover: borde cyan, elevación, sombra glow

### Iconos de Servicios
- Fondo: gradiente verde
- Color: blanco

### Separadores de Sección
- Línea gradiente: cyan → verde → solar-yellow

## Estructura de Fondos
- Nav: blanco sólido
- Hero: gradiente navy (#1A2F45 → #0d1f42)
- Secciones alternas: blanco y #F8F9FA
- Footer: navy sólido con borde solar-yellow