export interface ResumeLink {
  label: string;
  url: string;
}

export const RESUME_LINKS: ResumeLink[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tarjah/' },
  { label: 'Behance', url: 'https://www.behance.net/tatianajaramil11' },
  { label: 'GitHub', url: 'https://github.com/tatyajh' },
  { label: 'itch.io', url: 'https://tarjah.itch.io/' },
];

// Correo del cierre del portafolio, guardado al revés: la dirección solo
// se arma cuando alguien toca el botón, así los robots que buscan correos
// en el código de la página no la encuentran escrita (el minificador
// juntaba las partes si estaban al derecho).
const REVERSED_EMAIL = 'moc.liamg@ollimaraj.ardnajelat';
export const getContactEmail = () => REVERSED_EMAIL.split('').reverse().join('');
