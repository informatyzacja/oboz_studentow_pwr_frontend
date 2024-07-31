#!/bin/sh

# This script automatically sets the version and short version string of an
# Xcode project from the Git repository containing the project.
#
# To use this script in Xcode 4, add the contents to a "Run Script" build
# phase for your application target.

set -o errexit
set -o nounset

export BUILT_PRODUCTS_DIR="./ios"
export WRAPPER_NAME="App/App"

INFO_PLIST="${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}/Info"

# Use the latest version tag for CFBundleShortVersionString. I tag releases
# in Git using the format 0.0.0; this assumes you're doing the same.
# MARKETING_VERSION=$(git describe --abbrev=0)

# Apple wants CFBundleVersion to be a monotonically increasing integer, so
# use the number of commits on master.
VERSION=$(git rev-list main | wc -l | xargs) 
echo "Version: $VERSION"

MARKETING_VERSION="1.2"

# defaults write $INFO_PLIST CFBundleShortVersionString $MARKETING_VERSION
# defaults write $INFO_PLIST CFBundleVersion $VERSION
plutil -replace CFBundleVersion -string $VERSION $INFO_PLIST.plist
plutil -replace CFBundleShortVersionString -string $MARKETING_VERSION $INFO_PLIST.plist

cd android && ./gradlew bumperInit -PbumperVersionCode=$VERSION -PbumperVersionName=$MARKETING_VERSION