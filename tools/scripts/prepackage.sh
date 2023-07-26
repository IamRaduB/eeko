cd ../eeko-ui || exit
npm ci
npm run build
rm -rf ../eeko/dist/ui
mkdir ../eeko/dist/ui
cp -r dist/* ../eeko/dist/ui
