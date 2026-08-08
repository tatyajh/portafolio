"use client";

import { motion } from 'framer-motion';
import { CV_SKILLS } from '@/data/cv';
import { TECH_IDENTITY_ROLES } from '@/data/techRoute';

// Se leen del propio CV en vez de escribirlas otra vez aquí: si algún
// día cambian en cv.ts, esta sección se actualiza sola.
const SOFT_SKILLS =
  CV_SKILLS.find(group => group.category === 'Habilidades Blandas')?.items ?? [];

export default function TechIdentity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-10"
    >
      {/* max-w-2xl a propósito: a todo el ancho de la columna cabían
          tres chips en la primera fila y el cuarto quedaba solo abajo.
          Angostando el contenedor el reparto queda 2 y 2 (y 3 y 3 en
          capacidades), que se lee mucho más ordenado. */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
        {TECH_IDENTITY_ROLES.map(role => (
          <span
            key={role}
            className="px-3 py-1.5 bg-burgundy/20 border border-burgundy/50 text-gold text-sm tracking-wide rounded-lg"
          >
            {role}
          </span>
        ))}
      </div>

      {/* Antes esto se llamaba "capacidades" y mostraba los NOMBRES de
          las categorías del CV (Desarrollo de Software, Seguridad,
          Habilidades Blandas…). Decía poco: son etiquetas de archivador,
          y encima se repetían con los roles de arriba y con la lista de
          herramientas del nodo perfil. Ahora muestra las habilidades
          blandas de verdad, que es lo único que no está en ninguna otra
          parte del sitio. */}
      <p className="font-script text-2xl text-center text-gold-mid -rotate-1 mb-6">
        habilidades blandas
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {SOFT_SKILLS.map(skill => (
          <span
            key={skill}
            className="px-3 py-1 border border-gold/20 text-gold/70 text-sm tracking-wide rounded-lg"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
