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
