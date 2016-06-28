 rm -r build
 mkdir build
 cp -r client/static build/static
 webpack
 babel ./server.js -d build
 babel ./data -d build/data
