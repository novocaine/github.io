pushd ../sourcemapped-stacktrace/demo
sh make.sh
cp *.coffee *.js *.html *.map ../../sourcemapped-stacktrace-demo/public_html
popd
