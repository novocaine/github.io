pushd ../sourcemapped-stacktrace/demo
git pull origin master
npm update
sh make.sh
cp *.coffee *.js *.html *.map ../../sourcemapped-stacktrace-demo/public_html
popd
