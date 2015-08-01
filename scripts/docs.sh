#!/bin/bash
SITE_DIR=$(cd `dirname $0`/.. && pwd)
LIB_DIR=$(cd `dirname $0`/../../rct-material-kit/Source && pwd)

cd $LIB_DIR
docco-central 'Lib/**/*.js'
gulp docs

rm -rf $SITE_DIR/docs
mv docs $SITE_DIR/

cd $SITE_DIR
git checkout -- docs/docco.css  # drop the auto-gen diff

# insert google analytics tracker
OS=`uname`
case $OS in
  Darwin )
    SED_CMD="sed -i .bak"
    ;;
  * )
    SED_CMD="sed -i"
    ;;
esac

read -d '' GA_SCRIPT <<"EOF"
<script type="text/javascript">\
  var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");\
  document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));\
</script>\
<script type="text/javascript">\
  try {\
    var pageTracker = _gat._getTracker("UA-33049696-1");\
  pageTracker._trackPageview();\
  } catch(err) {}\
</script>
EOF
# echo $GA_SCRIPT
find docs -type f -name "*.html" -exec $SED_CMD "s|</body>|${GA_SCRIPT}</body>|g" '{}' \;
