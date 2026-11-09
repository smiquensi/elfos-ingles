# Elfos del Inglés
App de inglés para Vera (Capacitor, Android). Identificador: `com.samias.elfos`.

## Una sola vez: secretos de firma
En el repo: **Settings → Secrets and variables → Actions → New repository secret**:
- `ANDROID_KEYSTORE_BASE64` = contenido de `keystore_base64.txt`
- `ANDROID_KEYSTORE_PASSWORD` = la contraseña de `password.txt`
Guarda también `elfos.keystore` en un sitio seguro: si lo pierdes, no podrás actualizar encima del APK instalado.

## Obtener el APK
1. En GitHub: **Actions → Construir APK → Run workflow** (~6 min).
2. Descarga `elfos-ingles.apk` desde **Releases** en la tablet e instálalo (permitir "orígenes desconocidos").
3. Para actualizar: vuelve a lanzar el workflow e instala el nuevo APK ENCIMA. El progreso se conserva
   (misma firma, la del secreto + mismo identificador + `versionCode` creciente).

## Progreso
Se guarda en `localStorage` y, además, en el almacén nativo (`@capacitor/preferences`).
No desinstales la app antes de actualizar: al desinstalar Android borra los datos.

## Cambiar la web
Edita `www/` y vuelve a lanzar el workflow.
