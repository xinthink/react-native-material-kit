#!/bin/zsh
SITE_DIR=$(cd `dirname $0`/.. && pwd)
LIB_DIR=$(cd `dirname $0`/../../rct-material-kit/Source && pwd)

cd $LIB_DIR
docco-central --title 'Index' \
  --windowTitle 'Annotated Source - RN Material Kit' \
  'Lib/**/*.js'
gulp docs

rm -rf $SITE_DIR/docs
mv docs $SITE_DIR/

cd $SITE_DIR
git checkout -- docs/docco.css  # drop the auto-gen diff

# insert google analytics tracker
read -d '' GA_SCRIPT <<"EOF"
<script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-33049696-2', 'auto'); ga('send', 'pageview'); </script>
EOF
# echo $GA_SCRIPT
for f in docs/**/*.html; do
  sed -i.bak "s^</body>^${GA_SCRIPT}</body>^g" $f
  sed -i.bak -E "s/(FIXME|TODO)/<strong><i>\1<\/i><\/strong>/g" $f
done

# sitemap
ls -l docs/**/*.html | egrep -o 'docs.*' | sed 's|docs|http://www.xinthink.com/react-native-material-kit/docs|g' > sitemap-docs.txt
