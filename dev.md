```sh
lerna add mod-1 --scope=mod-2 # add mod-1 to mod-2
lerna add mod-1 --scope=mod-2 --dev # add mod-1 to mod-2's devDependencies
lerna add mod-1 # add mod-1 to all modules
lerna add typescript # add typescript to all modules
```


```sh
lerna publish --force-publish
```


```sh
lerna add jest --scope=@ipaint/util --dev
lerna add babel-jest --scope=@ipaint/util --dev
lerna add @babel/core --scope=@ipaint/util --dev
lerna add @babel/preset-env --scope=@ipaint/util --dev
```

```sh
lerna add @ipaint/board --scope=@ipaint/paint
lerna add @ipaint/util --scope=@ipaint/board
lerna add @ipaint/types --scope=@ipaint/board --dev
```