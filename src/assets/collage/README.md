# Recortes de la portada

Los siete PNG salen de `assets.png` (la hoja con todos los dibujos). Las tijeras
abiertas y cerradas comparten lienzo y el tornillo queda en el mismo punto, para
que el tijereteo no salte al cambiar de imagen.

Para reemplazar uno: PNG con fondo transparente, sin halo, con su propio borde
de papel (la sombra la pone CSS), manteniendo el nombre del archivo. Las
importaciones están en `src/lib/collageAssets.ts`.
