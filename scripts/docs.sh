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
<script type="text/javascript"> var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www."); document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E")); </script> <script type="text/javascript"> try {var pageTracker = _gat._getTracker("UA-33049696-1"); pageTracker._trackPageview(); } catch(err) {} </script>
EOF
# echo $GA_SCRIPT
for f in docs/**/*.html; do
  sed -i.bak "s|</body>|${GA_SCRIPT}</body>|g" $f
  sed -i.bak -E "s/(FIXME|TODO)/<strong><i>\1<\/i><\/strong>/g" $f
done

# sitemap
ls -l docs/**/*.html | egrep -o 'docs.*' | sed 's|docs|http://www.xinthink.com/react-native-material-kit/docs|g' > sitemap-docs.txt
