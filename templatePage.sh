#!/bin/bash

# turns out post type isn't all that nessisary
posttype="cv" #default post type

# first argument is name of post
if [ "$1" ]; then
  postcat="$1"
  sectiontype="organization"
  [ "$2" ] && postcat="$2" && sectiontype="role"
  [ -f content/$posttype/$postcat/$1.md ] && echo "post exist" && exit 0
  mkdir -p "content/$posttype/$postcat"
  # cp src/templates/pageTemplate.md content/$posttype/$postcat/$1.md
  fileToMake=content/$posttype/$postcat/$1.md
  touch $fileToMake
  primerole=""
  [ $sectiontype == "role" ] && primerole=$1
  echo "---" >> $fileToMake
  echo "organization: \"$postcat\"" >> $fileToMake
  echo "type: \"$sectiontype\"" >> $fileToMake
  echo "fields: \"\"" >> $fileToMake
  echo "orgtype: \"corporation\"" >> $fileToMake
  echo "startdate: \"2013-09-12\"" >> $fileToMake
  echo "enddate: \"\"" >> $fileToMake
  echo "summary: \"\"" >> $fileToMake
  echo "roles: \"$primerole\"" >> $fileToMake
  echo "projects: \"\"" >> $fileToMake
  echo "skillslearned: \"\"" >> $fileToMake
  echo "skillsused: \"\"" >> $fileToMake
  echo "---" >> $fileToMake 
  code content/$posttype/$postcat/$1.md
fi