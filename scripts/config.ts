interface PkgConfig {
  dirName: string;
  globalName: string;
}

export const packages: PkgConfig[] = [
  {
    dirName: 'util',
    globalName: 'iPaintUtil',
  },
  {
    dirName: 'core',
    globalName: 'iPaintCore',
  },
  {
    dirName: 'board',
    globalName: 'iPaintBoard',
  },
  {
    dirName: 'ipaint',
    globalName: 'iPaint',
  },
  {
    dirName: 'editor',
    globalName: 'iPaintEditor',
  },
]

export function getTargetPackage(cmdTarget = '') {
  let target = '';
  if (typeof cmdTarget === 'string') {
    target = cmdTarget.replace(/^--target-pkg\=/ig, '');
  }
  let pkgs: PkgConfig[] = [];
  let targetIndex: number = -1;
  for (let i = 0; i < packages.length; i ++) {
    if (packages[i] && packages[i].dirName === target) {
      targetIndex = i;
      break;
    }
  }
  if (targetIndex >= 0) {
    pkgs = [packages[targetIndex]];
  } else {
    pkgs = packages;
  }
  return pkgs
}

