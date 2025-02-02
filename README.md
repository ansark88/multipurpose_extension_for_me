# 概要

自分の作業を便利するために作成したFirefoxアドオンです。WXT+Reactで作成しています。


## debug

```
$ pnpm run build:firefox
$ pnpm run dev:firefox
```

ビルド結果に対してweb-extで起動したりLintをかけることもできます。。

```
$ cd .output/firefox-mv2
$ web-ext run
$ web-ext lint
```