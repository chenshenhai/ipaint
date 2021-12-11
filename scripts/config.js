const packages = [
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
  // {
  //   dirName: 'demo-data',
  //   globalName: 'iPaint.demoData'
  // }
]

function getTargetPackage(cmdTarget = '') {
  let target = '';
  if (typeof cmdTarget === 'string') {
    target = cmdTarget.replace(/^--target-pkg\=/ig, '');
  }
  let pkgs = [];
  let targetIndex = -1;
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


module.exports = {
  packages,
  getTargetPackage,
}