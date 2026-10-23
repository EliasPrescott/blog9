import * as path from 'node:path'

export function globPostImages() {
  const rawImages = import.meta.glob('/blog/**/*.{jpeg,jpg,png,gif}')
  return rawImages
}

export function cleanAssetPath(rootDir, rawAssetPath) {
  if (!rootDir || !rawAssetPath) {
    return null
  }
  if (path.isAbsolute(rawAssetPath)) {
    return rawAssetPath
  } else {
    return path.join('/', rootDir, rawAssetPath)
  }
}
