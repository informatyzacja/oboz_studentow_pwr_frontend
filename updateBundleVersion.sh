#!/bin/bash

# This script automatically sets the versionCode and versionName
# for both iOS (Info.plist) and Android (build.gradle) projects based on the number of commits in the main branch
# and the version name provided by the user.
#
# Usage: ./updateBundleVersion.sh <new_versionName>
# Example: ./updateBundleVersion.sh 2.0

if [ $# -ne 1 ]; then
  echo "Usage: $0 <new_versionName>"
  exit 1
fi

set -o errexit
set -o nounset

export BUILT_PRODUCTS_DIR="./ios"
export WRAPPER_NAME="App/App"

INFO_PLIST="${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}/Info"

# MARKETING_VERSION is the version name provided by the user (e.g. 2.0)
MARKETING_VERSION=$1

# VERSION is the number of commits in the main branch (monotonically increasing for versionCode/CFBundleVersion)
VERSION=$(git rev-list main | wc -l | xargs)

# iOS: update Info.plist
plutil -replace CFBundleVersion -string $VERSION $INFO_PLIST.plist
plutil -replace CFBundleShortVersionString -string $MARKETING_VERSION $INFO_PLIST.plist

# Android: update build.gradle
FILE="./android/app/build.gradle"
NEW_CODE=$VERSION

# Update versionCode to the new value (number of commits)
sed -i '' -E "s/(versionCode[[:space:]]+)[0-9]+/\1$NEW_CODE/" "$FILE"

# Update versionName to the new value (provided by the user)
sed -i '' "s/versionName \".*\"/versionName \"$MARKETING_VERSION\"/" "$FILE"

echo "Updated version to $MARKETING_VERSION ($NEW_CODE) in Info.plist and build.gradle"
